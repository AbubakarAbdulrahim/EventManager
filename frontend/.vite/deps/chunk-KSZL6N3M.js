// node_modules/.pnpm/@mui+material@6.4.8_@emotio_37294a75d202913bcab93acec61055c5/node_modules/@mui/material/InputBase/utils.js
function hasValue(value) {
  return value != null && !(Array.isArray(value) && value.length === 0);
}
function isFilled(obj, SSR = false) {
  return obj && (hasValue(obj.value) && obj.value !== "" || SSR && hasValue(obj.defaultValue) && obj.defaultValue !== "");
}
function isAdornedStart(obj) {
  return obj.startAdornment;
}

export {
  isFilled,
  isAdornedStart
};
//# sourceMappingURL=chunk-KSZL6N3M.js.map
