import { NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Handles "Dołącz" form submissions and forwards them by e-mail.
 *
 * Delivery uses Web3Forms (https://web3forms.com) — the access key is created
 * for robert@harmonylife.asia, so every submission is delivered to that inbox.
 * Set the key as the WEB3FORMS_ACCESS_KEY environment variable (locally in
 * .env.local, in production via the Vercel project settings).
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Nieprawidłowe dane formularza." },
      { status: 400 },
    );
  }

  const body = (payload ?? {}) as Record<string, unknown>;
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const intention = String(body.intention ?? "").trim();
  const honeypot = String(body.website ?? "").trim();

  // Silent honeypot: pretend success for bots that fill the hidden field.
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  if (!name || name.length > 120) {
    return NextResponse.json(
      { error: "Podaj swoje imię." },
      { status: 422 },
    );
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { error: "Podaj poprawny adres e-mail." },
      { status: 422 },
    );
  }
  if (intention.length > 2000) {
    return NextResponse.json(
      { error: "Wiadomość jest zbyt długa." },
      { status: 422 },
    );
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    console.error("WEB3FORMS_ACCESS_KEY is not configured.");
    return NextResponse.json(
      { error: "Formularz nie jest jeszcze w pełni skonfigurowany." },
      { status: 503 },
    );
  }

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `Nowa Era — nowe zgłoszenie od ${name}`,
        from_name: "Nowa Era — formularz",
        replyto: email,
        // Individual fields — rendered as a list in the e-mail.
        Imię: name,
        Email: email,
        Intencja: intention || "—",
      }),
    });

    const result = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      message?: string;
    };

    if (!res.ok || !result.success) {
      console.error("Web3Forms error:", result.message ?? res.statusText);
      return NextResponse.json(
        { error: "Nie udało się wysłać wiadomości. Spróbuj ponownie." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Join form send failed:", err);
    return NextResponse.json(
      { error: "Nie udało się wysłać wiadomości. Spróbuj ponownie." },
      { status: 502 },
    );
  }
}
