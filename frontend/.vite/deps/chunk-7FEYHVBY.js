import {
  SvgIcon_default
} from "./chunk-JQVOGM5M.js";
import {
  require_jsx_runtime
} from "./chunk-RJ554F6E.js";
import {
  require_react
} from "./chunk-XWSPDYHU.js";
import {
  __toESM
} from "./chunk-EWTE5DHJ.js";

// node_modules/.pnpm/@mui+material@6.4.8_@emotio_37294a75d202913bcab93acec61055c5/node_modules/@mui/material/utils/createSvgIcon.js
var React = __toESM(require_react());
var import_jsx_runtime = __toESM(require_jsx_runtime());
function createSvgIcon(path, displayName) {
  function Component(props, ref) {
    return (0, import_jsx_runtime.jsx)(SvgIcon_default, {
      "data-testid": `${displayName}Icon`,
      ref,
      ...props,
      children: path
    });
  }
  if (true) {
    Component.displayName = `${displayName}Icon`;
  }
  Component.muiName = SvgIcon_default.muiName;
  return React.memo(React.forwardRef(Component));
}

export {
  createSvgIcon
};
//# sourceMappingURL=chunk-7FEYHVBY.js.map
