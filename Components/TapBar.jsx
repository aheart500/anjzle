import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { colors, isArabic } from "../Constants";

const TapBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const Icon = options.tabBarIcon;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityStates={isFocused ? ["selected"] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              key={index}
              style={styles.item}
            >
              <Icon color={isFocused ? colors.primary : "#000"} />
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.blackLine}></View>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#fff",
  },
  container: {
    width: "90%",
    marginHorizontal: "5%",
    paddingVertical: 10,
    flexDirection: isArabic ? "row" : "row-reverse",

    justifyContent: "space-around",
    alignItems: "center",
  },
  item: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  blackLine: {
    backgroundColor: "#000",
    width: "35%",
    height: 5,
    marginHorizontal: "32.5%",
    borderRadius: 2,
  },
});
export default TapBar;
