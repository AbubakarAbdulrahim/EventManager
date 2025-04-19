// node_modules/.pnpm/@mui+x-internals@7.28.0_@types+react@19.0.11_react@19.0.0/node_modules/@mui/x-internals/esm/warning/warning.js
var warnedOnceCache = /* @__PURE__ */ new Set();
function warnOnce(message, gravity = "warning") {
  if (false) {
    return;
  }
  const cleanMessage = Array.isArray(message) ? message.join("\n") : message;
  if (!warnedOnceCache.has(cleanMessage)) {
    warnedOnceCache.add(cleanMessage);
    if (gravity === "error") {
      console.error(cleanMessage);
    } else {
      console.warn(cleanMessage);
    }
  }
}

export {
  warnOnce
};
//# sourceMappingURL=chunk-646RCWXO.js.map
