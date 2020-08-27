import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import Home from "../HomeStack/Home";
import Who from "../HomeStack/Who";
import Dep from "../HomeStack/Dep";
import Privacy from "../HomeStack/Privacy";
import Contact from "../HomeStack/Contact";
import Service from "../HomeStack/Service";

const HomeStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
      }}
    >
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="dep" component={Dep} />
      <Stack.Screen name="who" component={Who} />
      <Stack.Screen name="contact" component={Contact} />
      <Stack.Screen name="privacy" component={Privacy} />
      <Stack.Screen name="service" component={Service} />
    </Stack.Navigator>
  );
};

export default HomeStack;
