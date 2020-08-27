import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import Deps from "./Deps";
import AddDep from "./AddDep";
import AddService from "./AddService";
import SingleDep from "./SingleDep";
import SingleService from "./SingleService";

const HomeStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
      }}
    >
      <Stack.Screen name="deps" component={Deps} />
      <Stack.Screen name="addDep" component={AddDep} />
      <Stack.Screen name="singleDep" component={SingleDep} />
      <Stack.Screen name="singleService" component={SingleService} />
      <Stack.Screen name="addService" component={AddService} />
    </Stack.Navigator>
  );
};

export default HomeStack;
