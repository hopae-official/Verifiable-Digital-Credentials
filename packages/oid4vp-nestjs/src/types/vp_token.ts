/**
 * {
 *   "my_credential": ["eyJhbGci...QMA", "eyJhbGci...QMA", ...]
 * }
 */
export type VpToken = {
  vp_token: Record<string, Array<string>>;
};
