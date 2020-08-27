import React, { useReducer, useState, useEffect } from "react";
import UserContext from "./UserContext";
import UserReducer from "./UserReducer";
import AsyncStorage from "@react-native-community/async-storage";
import { ActivityIndicator } from "react-native";
import { useFonts } from "@expo-google-fonts/inter";
import Cairo from "../../assets/fonts/Cairo-Regular.ttf";
import { api } from "../../Constants";
import axios from "axios";
const initialState = {
  first_time: false,
  isLogged: false,
  name: "",
  email: "",
  token: "",
  role_id: 0,
  fname: "",
  image: "",
  verified_code: "",
  is_active: 1,
  is_verified: 0,
};
const UserState = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [fontLoading] = useFonts({
    Cairo,
  });
  const [state, dispatch] = useReducer(UserReducer, initialState);
  useEffect(() => {
    const checkFirstTime = async () => {
      const first = await AsyncStorage.getItem("first");
      if (!first) dispatch({ type: "nonStarted" });
    };
    const checkLogged = async () => {
      const isLogged = await AsyncStorage.getItem("isLogged");
      if (isLogged && JSON.parse(isLogged)) {
        const user = await AsyncStorage.getItem("user");
        const token = await AsyncStorage.getItem("token");
        dispatch({
          type: "LOAD_DATA",
          payload: {
            ...JSON.parse(user),
            token: token ? JSON.parse(token) : "",
            isLogged: true,
          },
        });
      }
    };
    const finishLoading = async () => {
      await checkFirstTime();
      await checkLogged();
      setLoading(false);
    };

    finishLoading();
  }, []);

  const getUserData = async (token) => {
    try {
      const user = await axios.get(api.getUser, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });

      await AsyncStorage.setItem("user", JSON.stringify(user.data));
      dispatch({
        type: "LOAD_DATA",
        payload: {
          ...user.data,
        },
      });
      return user.data;
    } catch (e) {
      console.log(e);
    }
  };
  const updateUser = async (data) => {
    await AsyncStorage.setItem("user", JSON.stringify(data));
    dispatch({
      type: "LOAD_DATA",
      payload: {
        ...data,
      },
    });
  };
  const logUser = async () => {
    await AsyncStorage.setItem("isLogged", "true");
    dispatch({ type: "LOAD_DATA", payload: { isLogged: true } });
  };
  const saveUserData = async (type, data) => {
    if (type === "login") {
      await AsyncStorage.setItem("isLogged", "true");
      dispatch({ type: "LOAD_DATA", payload: { isLogged: true } });
    }
    await AsyncStorage.setItem("token", JSON.stringify(data.remember_token));
    dispatch({ type: "LOAD_DATA", payload: { token: data.remember_token } });
    getUserData(data.remember_token);
  };
  const started = async () => {
    await AsyncStorage.setItem("first", "true");
    dispatch({ type: started });
  };
  const Login = async (email, password) => {
    const data = await axios.post(api.login, { email, password });
    await saveUserData("login", data.data);
  };
  const SignUp = async (name, email, password) => {
    const data = await axios.post(api.register, { name, email, password });
    if (data.data !== "registered") {
      await saveUserData("register", data.data);
    }

    return data.data;
  };
  const Logout = async () => {
    await AsyncStorage.multiRemove(["user", "token", "isLogged"]);
  };
  const reset = async () => {
    await AsyncStorage.multiRemove(["user", "token", "isLogged", "first"]);
  };
  /*  reset(); */
  return (
    <UserContext.Provider
      value={{
        userState: state,
        Login,
        Logout,
        started,
        SignUp,
        saveUserData,
        logUser,
        reset,
        getUserData,
        updateUser,
      }}
    >
      {loading || !fontLoading ? (
        <ActivityIndicator
          size="large"
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        />
      ) : (
        children
      )}
    </UserContext.Provider>
  );
};

export default UserState;
