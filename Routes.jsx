import React, { useContext, useState } from "react";
import UserContext from "./Contexts/User/UserContext";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import Startup from "./screens/Startup";
import Login from "./screens/LoginStack/Login";
import ResetPassword from "./screens/LoginStack/ResetPassword";
import ForgotPassword from "./screens/LoginStack/ForgotPassword";
import ResetPasswordCode from "./screens/LoginStack/ResetPasswordCode";
import Register from "./screens/LoginStack/Register";
import { StatusBar } from "expo-status-bar";
import Inquery from "./screens/HomeStack/Inquery";
import PaymentOptions from "./screens/HomeStack/PaymentOptions";
import AddPaymentOption from "./screens/HomeStack/AddPaymentOption";
import FinishOrder from "./screens/OrdersStack/FinishOrder";
import TapsStack from "./screens/TapStack";
import Order from "./screens/OrdersStack/Order";
const Routes = () => {
  const { userState } = useContext(UserContext);
  const AppStack = createStackNavigator();

  return (
    <NavigationContainer>
      <StatusBar style="auto" />

      <AppStack.Navigator
        screenOptions={{
          header: () => null,
          cardStyleInterpolator:
            CardStyleInterpolators.forScaleFromCenterAndroid,
        }}
      >
        <AppStack.Screen name="startup" component={Startup} />

        {userState.isLogged && (
          <>
            <AppStack.Screen name="home" component={TapsStack} />
            <AppStack.Screen name="order" component={Order} />
            <AppStack.Screen name="inquery" component={Inquery} />
            <AppStack.Screen name="finishOrder" component={FinishOrder} />
            <AppStack.Screen name="paymentOptions" component={PaymentOptions} />
            <AppStack.Screen
              name="addPaymentOption"
              component={AddPaymentOption}
            />
          </>
        )}

        <AppStack.Screen name="login" component={Login} />
        <AppStack.Screen name="resetPassword" component={ResetPassword} />
        <AppStack.Screen name="forgotPassword" component={ForgotPassword} />
        <AppStack.Screen
          name="resetPasswordCode"
          component={ResetPasswordCode}
        />
        <AppStack.Screen name="register" component={Register} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
