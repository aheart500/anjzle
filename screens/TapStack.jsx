import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "./TapsStack/HomeStack";
import ProfileStack from "./TapsStack/ProfileStack";

import { Ionicons, Fontisto, FontAwesome } from "@expo/vector-icons";
import TapBar from "../Components/TapBar";
import Orders from "./OrdersStack/Orders";
const TapsStack = () => {
  const Taps = createBottomTabNavigator();
  return (
    <Taps.Navigator
      initialRouteName="home"
      tabBar={(props) => <TapBar {...props} />}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;

          if (route.name === "home") {
            iconName = "ios-home";
          } else if (route.name === "profile") {
            iconName = "md-person";
          } else if (route.name === "orders") {
            iconName = "reorder";
            return <FontAwesome name={iconName} size={30} color={color} />;
          } else if (route.name === "settings") {
            iconName = "ios-settings";
          } else if (route.name === "menu") {
            iconName = "ios-menu";
          }

          return <Ionicons name={iconName} size={30} color={color} />;
        },
        title: () => {
          let routeName = "الرئيسية";
          if (route.name === "orders") routeName = "الطلبات";
          if (route.name === "profile") routeName = "الملف الشخصي";
          return routeName;
        },
      })}
      backBehavior="initialRoute"
      tabBarOptions={{
        showLabel: false,
      }}
    >
      <Taps.Screen name="home" component={HomeStack} />

      <Taps.Screen name="orders" component={Orders} />

      <Taps.Screen name="profile" component={ProfileStack} />
    </Taps.Navigator>
  );
};

export default TapsStack;
