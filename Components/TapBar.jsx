import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { colors, isArabic } from "../Constants";

const TapBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const Icon = options.tabBarIcon;
          let title = options.title();

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
              <Icon color={isFocused ? colors.primary : "#a9a9aa"} />
              <Text style={isFocused ? styles.focusedTitle : styles.title}>
                {title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#fbfdff",
  },
  container: {
    width: "100%",
    backgroundColor: "#f1f4f9",
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
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
  title: {
    color: "#b3b3b5",
    fontFamily: "Cairo",
  },
  focusedTitle: {
    color: colors.primary,
    fontFamily: "Cairo",
  },
});
export default TapBar;
