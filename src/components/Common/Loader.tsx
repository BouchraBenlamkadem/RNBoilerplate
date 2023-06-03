import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Colors, Mixins } from "styles";

const Loader = () => {
  return (
    <View
      style={{
        height: Mixins.WINDOW_HEIGHT,
        width: Mixins.WINDOW_WIDTH,
        position: "absolute",
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center"
      }}>
      <ActivityIndicator size="large" color={Colors.PRIMARY} />
    </View>
  );
};

export default Loader;
