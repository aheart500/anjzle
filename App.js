import React, { useEffect } from "react";
import { I18nManager } from "react-native";
import UserState from "./Contexts/User/UserState";
import Routes from "./Routes";

export default function App() {
  useEffect(() => {
    I18nManager.forceRTL(false);
    I18nManager.allowRTL(false);
  }, []);
  return (
    <UserState>
      <Routes />
    </UserState>
  );
}
