/**
 * {
 *   "my_credential": ["eyJhbGci...QMA", "eyJhbGci...QMA", ...]
 * }
 */
export class VpToken {
  vp_token: Record<string, Array<string>>;
}
