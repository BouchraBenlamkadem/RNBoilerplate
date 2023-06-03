import React from "react";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import { Colors } from "styles";

const OS = Platform.OS;
const OSVersion = Platform.Version;

function StatusBar({
  backgroundColor = Colors.STATUSBAR.BACKGROUND,
  hidden = false,
  translucent = false,
  transparent = false,
  theme = Colors.STATUSBAR.DARK
}:any) {
  /*
   * For Android devices with API Level lower than 23 the theme is always light
   * Therefore the backgound should be dark
   */
  OS === "android" && (typeof OSVersion == 'string' || OSVersion < 23) && theme == Colors.STATUSBAR.DARK
    ? (backgroundColor = "black")
    : null;

  return (
    <RNStatusBar
      translucent={translucent || transparent}
      backgroundColor={transparent ? "transparent" : backgroundColor}
      barStyle={theme}
      hidden={hidden}
    />
  );
}

// StatusBar.propTypes = {
//   backgroundColor: PropTypes.string,
//   hidden: PropTypes.bool,
//   theme: PropTypes.string
// };

export default StatusBar;
