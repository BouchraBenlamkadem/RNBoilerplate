import { Dimensions, StatusBar } from "react-native";

export const WINDOW_WIDTH = Dimensions.get("window").width;
export const WINDOW_HEIGHT = Dimensions.get("window").height;
export const STATUSBAR_HEIGHT = StatusBar.currentHeight;

const guidelineBaseWidth = 414;

export const scaleSize = (size:number) => (WINDOW_WIDTH / guidelineBaseWidth) * size;
export const scaleFont = (size:number) => size; // * PixelRatio.getFontScale();

export const isPortrait = () => {
  const dim = Dimensions.get("screen");
  return dim.height >= dim.width;
};

function dimensions(top:number, right = top, bottom = top, left = right, property:string) {
  let styles:any = {};
  styles[`${property}Top`] = top;
  styles[`${property}Right`] = right;
  styles[`${property}Bottom`] = bottom;
  styles[`${property}Left`] = left;
  return styles;
}

export function margin(top:number, right:number, bottom:number, left:number) {
  return dimensions(top, right, bottom, left, "margin");
}

export function padding(top:number, right:number, bottom:number, left:number) {
  return dimensions(top, right, bottom, left, "padding");
}

export function boxShadow(color:string, offset = { height: 2, width: 2 }, radius = 8, opacity = 0.2) {
  return {
    shadowColor: color,
    shadowOffset: offset,
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation: radius
  };
}
