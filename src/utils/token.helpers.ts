export type TokenClaims = {
  sub?: string;
  name?: string;
  phoneNumber?: string;
  type?: string;
  tenantId?: string;
  branchId?: string;
  subscriptionEndDate?: string;
  exp?: number;
};

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );
  return atob(padded);
}

export function decodeJwt(token: string): TokenClaims | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const payload = base64UrlDecode(parts[1]);
    return JSON.parse(payload) as TokenClaims;
  } catch {
    return null;
  }
}
