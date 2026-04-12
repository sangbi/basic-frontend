import { createTheme } from "@mui/material/styles";
import { palette } from "./tokens/palette";
import { shape } from "./tokens/shape";

export const appTheme = createTheme({
  palette,
  shape,
  cssVariables: true,
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
    },
  },
});
