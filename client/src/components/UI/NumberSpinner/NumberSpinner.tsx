import { NumberField as BaseNumberField } from "@base-ui-components/react/number-field";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import * as React from "react";

interface NumberSpinnerProps
  extends React.ComponentProps<typeof BaseNumberField.Root> {
  size?: "small" | "medium";
  error?: boolean;
}

export default function NumberSpinner({
  id: idProp,
  error,
  size = "medium",
  ...other
}: NumberSpinnerProps) {
  let id = React.useId();
  if (idProp) {
    id = idProp;
  }
  return (
    <BaseNumberField.Root
      {...other}
      render={(props, state) => (
        <FormControl
          size={size}
          disabled={state.disabled}
          required={state.required}
          error={error}
          variant="outlined"
          sx={{
            "& .MuiButton-root": {
              borderColor: "divider",
              minWidth: 0,
              bgcolor: "action.hover",
              "&:not(.Mui-disabled)": {
                color: "text.primary",
              },
            },
          }}
        >
          {props.children}
        </FormControl>
      )}
    >
      <Box sx={{ display: "flex" }}>
        <BaseNumberField.Decrement
          render={
            <Button
              variant="outlined"
              aria-label="Decrease"
              size={size}
              sx={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                borderRight: "0px",
                "&.Mui-disabled": {
                  borderRight: "0px",
                },
              }}
            />
          }
        >
          <span style={{ fontSize: "18px" }}>-</span>
        </BaseNumberField.Decrement>

        <BaseNumberField.Input
          id={id}
          readOnly
          render={(props) => (
            <OutlinedInput
              inputRef={props.ref}
              onBlur={props.onBlur}
              onKeyUp={props.onKeyUp}
              onKeyDown={props.onKeyDown}
              onFocus={props.onFocus}
              slotProps={{
                input: {
                  ...props,
                  size: 1,
                  sx: {
                    textAlign: "center",
                  },
                },
              }}
              sx={{
                pr: 0,
                borderRadius: 0,
                flex: 1,
              }}
            />
          )}
        />

        <BaseNumberField.Increment
          render={
            <Button
              variant="outlined"
              aria-label="Increase"
              size={size}
              sx={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                borderLeft: "0px",
                "&.Mui-disabled": {
                  borderLeft: "0px",
                },
              }}
            />
          }
        >
          <span style={{ fontSize: "18px" }}>+</span>
        </BaseNumberField.Increment>
      </Box>
    </BaseNumberField.Root>
  );
}
