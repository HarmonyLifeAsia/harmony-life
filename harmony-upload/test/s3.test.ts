import { AwsV4Signer } from "aws4fetch";
import { describe, expect, it } from "vitest";
import { MAX_PARTS, MIB, MIN_PART_SIZE, choosePartSize, expectedPartSize, partBounds, partCount } from "../src/shared/layout.ts";
import { S3Storage, normalizeEtag, xmlBlocks, xmlTag } from "../src/worker/s3.ts";

describe("podpisywanie SigV4", () => {
  it("zgadza się z oficjalnym przykładem AWS dla presigned GET", async () => {
    // Przykład z dokumentacji AWS „Authenticating Requests: Using Query Parameters (AWS Signature Version 4)”.
    const signer = new AwsV4Signer({
      method: "GET",
      url: "https://examplebucket.s3.amazonaws.com/test.txt?X-Amz-Expires=86400",
      accessKeyId: "AKIAIOSFODNN7EXAMPLE",
      secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
      service: "s3",
      region: "us-east-1",
      datetime: "20130524T000000Z",
      signQuery: true,
    });
    const { url } = await signer.sign();
    expect(url.searchParams.get("X-Amz-Signature")).toBe("aeeed9bbccd4d02ee5c0109b86d86835f995330da4c265957d157751f604d404");
  });

  const storage = new S3Storage({
    endpoint: "https://s3.example-region.example.invalid",
    region: "example-region",
    bucket: "moje-wiadro",
    accessKeyId: "AKIAEXAMPLE",
    secretAccessKey: "secret-not-real",
    pathStyle: true,
  });

  it("presigned PUT części: właściwy klucz, partNumber, uploadId, wygasanie, brak sekretu w URL", async () => {
    const { url } = await storage.presignUploadPart("trips/abc/def", "UPLOAD+ID/1", 7, 1800);
    const u = new URL(url);
    expect(u.origin).toBe("https://s3.example-region.example.invalid");
    expect(u.pathname).toBe("/moje-wiadro/trips/abc/def");
    expect(u.searchParams.get("partNumber")).toBe("7");
    expect(u.searchParams.get("uploadId")).toBe("UPLOAD+ID/1");
    expect(u.searchParams.get("X-Amz-Expires")).toBe("1800");
    expect(u.searchParams.get("X-Amz-Algorithm")).toBe("AWS4-HMAC-SHA256");
    expect(u.searchParams.get("X-Amz-SignedHeaders")).toBe("host");
    expect(u.searchParams.get("X-Amz-Signature")).toMatch(/^[0-9a-f]{64}$/);
    expect(url).not.toContain("secret-not-real");
  });

  it("presigned GET wymusza pobranie jako załącznik z bezpieczną nazwą i typem octet-stream", async () => {
    const { url } = await storage.presignGetObject("trips/a/b", 'film "x" ąę.mp4', 900);
    const u = new URL(url);
    expect(u.searchParams.get("response-content-type")).toBe("application/octet-stream");
    const cd = u.searchParams.get("response-content-disposition")!;
    expect(cd.startsWith("attachment;")).toBe(true);
    expect(cd).toContain("filename*=UTF-8''film%20%22x%22%20%C4%85%C4%99.mp4".replace("%22", "%22"));
    expect(cd).not.toMatch(/filename="[^"]*"[^;]*"/); // cudzysłów w nazwie nie psuje nagłówka
  });

  it("adresowanie virtual-hosted i origin dla CSP", () => {
    const vh = new S3Storage({ endpoint: "https://s3.example.invalid", region: "r", bucket: "b", accessKeyId: "a", secretAccessKey: "s", pathStyle: false });
    expect(vh.browserOrigin).toBe("https://b.s3.example.invalid");
    expect(storage.browserOrigin).toBe("https://s3.example-region.example.invalid");
  });
});

describe("parser XML odpowiedzi S3", () => {
  it("czyta ListParts z encjami w ETag i paginacją", () => {
    const xml = `<ListPartsResult><IsTruncated>true</IsTruncated><NextPartNumberMarker>2</NextPartNumberMarker>
      <Part><PartNumber>1</PartNumber><ETag>&quot;abc&quot;</ETag><Size>16777216</Size></Part>
      <Part><PartNumber>2</PartNumber><ETag>"def"</ETag><Size>100</Size></Part></ListPartsResult>`;
    expect(xmlTag(xml, "IsTruncated")).toBe("true");
    expect(xmlTag(xml, "NextPartNumberMarker")).toBe("2");
    const parts = xmlBlocks(xml, "Part").map((b) => ({ n: Number(xmlTag(b, "PartNumber")), etag: normalizeEtag(xmlTag(b, "ETag")!), size: Number(xmlTag(b, "Size")) }));
    expect(parts).toEqual([
      { n: 1, etag: "abc", size: 16777216 },
      { n: 2, etag: "def", size: 100 },
    ]);
  });
});

describe("układ części", () => {
  it("dzieli plik na części z krótszą ostatnią", () => {
    expect(partCount(40 * MIB, 16 * MIB)).toBe(3);
    expect(partBounds(40 * MIB, 16 * MIB, 3)).toEqual({ start: 32 * MIB, end: 40 * MIB, length: 8 * MIB });
    expect(expectedPartSize(32 * MIB, 16 * MIB, 2)).toBe(16 * MIB); // dokładna wielokrotność
    expect(partCount(1, 16 * MIB)).toBe(1);
  });
  it("nigdy nie schodzi poniżej 5 MiB i nie przekracza limitu części", () => {
    expect(choosePartSize(10 * MIB, 1 * MIB)).toBe(MIN_PART_SIZE);
    for (const size of [1, 5e9, 20e9, 5e12]) {
      const ps = choosePartSize(size, 16 * MIB);
      expect(ps).toBeGreaterThanOrEqual(MIN_PART_SIZE);
      expect(partCount(size, ps)).toBeLessThanOrEqual(MAX_PARTS);
    }
  });
});
