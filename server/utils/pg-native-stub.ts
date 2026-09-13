// Stub for the optional `pg-native` dependency, which is never used by the
// JS `pg` client. Nitro's Cloudflare preset forbids externals, so this alias
// prevents rollup from trying to resolve the missing native module.
export default {};
