
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

type Props = {
  size?: "small" | "large";
  color?: string;
  fullScreen?: boolean;
};

const LoadingSpinner: React.FC<Props> = ({
  size = "large",
  color = "#2196F3",
  fullScreen = false,
}) => {
  return (
    <View
      style={[
        styles.container,
        fullScreen && styles.fullScreen,
      ]}
    >
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default LoadingSpinner;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  fullScreen: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
});
