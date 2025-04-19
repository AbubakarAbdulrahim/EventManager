import {
  DefaultPropsProvider_default,
  require_prop_types,
  useDefaultProps
} from "./chunk-SETDZHV6.js";
import {
  require_jsx_runtime
} from "./chunk-RJ554F6E.js";
import {
  require_react
} from "./chunk-XWSPDYHU.js";
import {
  __toESM
} from "./chunk-EWTE5DHJ.js";

// node_modules/.pnpm/@mui+material@6.4.8_@emotio_37294a75d202913bcab93acec61055c5/node_modules/@mui/material/DefaultPropsProvider/DefaultPropsProvider.js
var React = __toESM(require_react());
var import_prop_types = __toESM(require_prop_types());
var import_jsx_runtime = __toESM(require_jsx_runtime());
function DefaultPropsProvider(props) {
  return (0, import_jsx_runtime.jsx)(DefaultPropsProvider_default, {
    ...props
  });
}
true ? DefaultPropsProvider.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * @ignore
   */
  children: import_prop_types.default.node,
  /**
   * @ignore
   */
  value: import_prop_types.default.object.isRequired
} : void 0;
function useDefaultProps2(params) {
  return useDefaultProps(params);
}

export {
  useDefaultProps2 as useDefaultProps
};
//# sourceMappingURL=chunk-75CID27W.js.map
