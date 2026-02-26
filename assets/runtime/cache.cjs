// runtime/cache.cjs
function createCache() {
  const m = new Map();
  return {
    get: (k) => m.get(k),
    set: (k, v) => m.set(k, v),
    has: (k) => m.has(k),
    map: m,
  };
}
module.exports = { createCache };
