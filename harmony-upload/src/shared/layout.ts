// Układ części multipart — WSPÓLNY dla serwera i przeglądarki, żeby obie strony
// zawsze liczyły ten sam podział pliku na części.

export const MIB = 1024 * 1024;
export const GB = 1_000_000_000;

/** S3: każda część poza ostatnią musi mieć co najmniej 5 MiB. */
export const MIN_PART_SIZE = 5 * MIB;
/** S3: maksymalnie 10 000 części; zostawiamy margines. */
export const MAX_PARTS = 9000;

/** Rozmiar części dla pliku: preferowany, ale nie mniejszy niż potrzeba, by zmieścić się w limicie części. */
export function choosePartSize(fileSize: number, preferred: number): number {
  const needed = Math.ceil(fileSize / MAX_PARTS / MIB) * MIB;
  return Math.max(MIN_PART_SIZE, preferred, needed);
}

export function partCount(fileSize: number, partSize: number): number {
  return Math.max(1, Math.ceil(fileSize / partSize));
}

/** Zakres bajtów części (numeracja od 1). */
export function partBounds(fileSize: number, partSize: number, partNumber: number) {
  const start = (partNumber - 1) * partSize;
  const end = Math.min(fileSize, start + partSize);
  return { start, end, length: end - start };
}

export function expectedPartSize(fileSize: number, partSize: number, partNumber: number): number {
  return partBounds(fileSize, partSize, partNumber).length;
}
