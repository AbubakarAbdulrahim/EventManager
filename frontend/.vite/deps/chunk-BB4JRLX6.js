// node_modules/.pnpm/@mui+material@6.4.8_@emotio_37294a75d202913bcab93acec61055c5/node_modules/@mui/material/FormControl/formControlState.js
function formControlState({
  props,
  states,
  muiFormControl
}) {
  return states.reduce((acc, state) => {
    acc[state] = props[state];
    if (muiFormControl) {
      if (typeof props[state] === "undefined") {
        acc[state] = muiFormControl[state];
      }
    }
    return acc;
  }, {});
}

export {
  formControlState
};
//# sourceMappingURL=chunk-BB4JRLX6.js.map
