import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import Profile from "../ProfileStack/Profile";
import EditProfile from "./EditProfile";
import UsersList from "../ProfileStack/UsersList";
import ContactUs from "../ProfileStack/ContactUs";
import ContactUsList from "../ProfileStack/ContactUsList";
import DepsAndServicesStack from "../ProfileStack/DepsAndServicesStack";

const HomeStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
      }}
    >
      <Stack.Screen name="profile" component={Profile} />
      <Stack.Screen name="editProfile" component={EditProfile} />
      <Stack.Screen name="usersList" component={UsersList} />
      <Stack.Screen name="contactUsList" component={ContactUsList} />
      <Stack.Screen name="contactUs" component={ContactUs} />
      <Stack.Screen name="depsAndServices" component={DepsAndServicesStack} />
    </Stack.Navigator>
  );
};

export default HomeStack;
