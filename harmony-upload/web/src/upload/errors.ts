/** Klasy błędów bez zależności od DOM — używane przez silnik i jego testy. */

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public extra: Record<string, unknown> = {},
  ) {
    super(message);
  }
  /** Brak odpowiedzi z serwera (offline, przerwane połączenie). */
  get isNetwork(): boolean {
    return this.status === 0;
  }
}

export type PutErrorKind = "network" | "http" | "aborted" | "stalled";

export class PutError extends Error {
  constructor(
    public kind: PutErrorKind,
    public status = 0,
  ) {
    super(`put_${kind}_${status}`);
  }
}

export class FileReadError extends Error {}
export class InsecureContextError extends Error {}
