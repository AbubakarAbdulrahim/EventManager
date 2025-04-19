import {
  memoTheme_default
} from "./chunk-EVBE6B5O.js";
import {
  useDefaultProps
} from "./chunk-75CID27W.js";
import {
  clsx_default,
  composeClasses,
  generateUtilityClass,
  generateUtilityClasses,
  require_prop_types,
  styled_default
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

// node_modules/.pnpm/@mui+material@6.4.8_@emotio_37294a75d202913bcab93acec61055c5/node_modules/@mui/material/Toolbar/Toolbar.js
var React = __toESM(require_react());
var import_prop_types = __toESM(require_prop_types());

// node_modules/.pnpm/@mui+material@6.4.8_@emotio_37294a75d202913bcab93acec61055c5/node_modules/@mui/material/Toolbar/toolbarClasses.js
function getToolbarUtilityClass(slot) {
  return generateUtilityClass("MuiToolbar", slot);
}
var toolbarClasses = generateUtilityClasses("MuiToolbar", ["root", "gutters", "regular", "dense"]);
var toolbarClasses_default = toolbarClasses;

// node_modules/.pnpm/@mui+material@6.4.8_@emotio_37294a75d202913bcab93acec61055c5/node_modules/@mui/material/Toolbar/Toolbar.js
var import_jsx_runtime = __toESM(require_jsx_runtime());
var useUtilityClasses = (ownerState) => {
  const {
    classes,
    disableGutters,
    variant
  } = ownerState;
  const slots = {
    root: ["root", !disableGutters && "gutters", variant]
  };
  return composeClasses(slots, getToolbarUtilityClass, classes);
};
var ToolbarRoot = styled_default("div", {
  name: "MuiToolbar",
  slot: "Root",
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, !ownerState.disableGutters && styles.gutters, styles[ownerState.variant]];
  }
})(memoTheme_default(({
  theme
}) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  variants: [{
    props: ({
      ownerState
    }) => !ownerState.disableGutters,
    style: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3)
      }
    }
  }, {
    props: {
      variant: "dense"
    },
    style: {
      minHeight: 48
    }
  }, {
    props: {
      variant: "regular"
    },
    style: theme.mixins.toolbar
  }]
})));
var Toolbar = React.forwardRef(function Toolbar2(inProps, ref) {
  const props = useDefaultProps({
    props: inProps,
    name: "MuiToolbar"
  });
  const {
    className,
    component = "div",
    disableGutters = false,
    variant = "regular",
    ...other
  } = props;
  const ownerState = {
    ...props,
    component,
    disableGutters,
    variant
  };
  const classes = useUtilityClasses(ownerState);
  return (0, import_jsx_runtime.jsx)(ToolbarRoot, {
    as: component,
    className: clsx_default(classes.root, className),
    ref,
    ownerState,
    ...other
  });
});
true ? Toolbar.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The Toolbar children, usually a mixture of `IconButton`, `Button` and `Typography`.
   * The Toolbar is a flex container, allowing flex item properties to be used to lay out the children.
   */
  children: import_prop_types.default.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: import_prop_types.default.object,
  /**
   * @ignore
   */
  className: import_prop_types.default.string,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: import_prop_types.default.elementType,
  /**
   * If `true`, disables gutter padding.
   * @default false
   */
  disableGutters: import_prop_types.default.bool,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: import_prop_types.default.oneOfType([import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([import_prop_types.default.func, import_prop_types.default.object, import_prop_types.default.bool])), import_prop_types.default.func, import_prop_types.default.object]),
  /**
   * The variant to use.
   * @default 'regular'
   */
  variant: import_prop_types.default.oneOfType([import_prop_types.default.oneOf(["dense", "regular"]), import_prop_types.default.string])
} : void 0;
var Toolbar_default = Toolbar;

export {
  getToolbarUtilityClass,
  toolbarClasses_default,
  Toolbar_default
};
//# sourceMappingURL=chunk-NJVRRJP2.js.map
