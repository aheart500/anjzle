import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import GlobalStyles from "../../hooks/sharedStyles";
import BackArrow from "../../Components/BackArrow";
import useInput from "../../hooks/useInput";
import { Input } from "react-native-elements";
import axios from "axios";
import { api, isArabic } from "../../Constants";
import Icon from "react-native-vector-icons/Entypo";
import UserContext from "../../Contexts/User/UserContext";
const ForgotPassword = ({ navigation }) => {
  const { saveUserData } = useContext(UserContext);
  const email = useInput("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const nextStep = async () => {
    setLoading(true);
    setErrorMessage("");
    if (email.value === "") {
      setErrorMessage("برجاء إدخال البريد الإلكتروني");
      setLoading(false);
      return;
    }
    try {
      const data = await axios.post(api.resendCode, { email: email.value });
      if (!data.data.code) {
        setErrorMessage("البريد الإلكتروني غير مسجل في قاعدة البيانات");
        setLoading(false);
        return;
      }
      await saveUserData("forgot", data.data);
      setLoading(false);
      email.onChangeText("");
      navigation.navigate("resetPasswordCode", {
        new: false,
        email: email.value,
        code: data.data.code,
      });
    } catch (e) {
      setErrorMessage("البريد الإلكتروني غير مسجل في قاعدة البيانات");
      setLoading(false);
    }
  };
  return (
    <View style={GlobalStyles.blueContainer}>
      <BackArrow onPress={() => navigation.goBack()} />
      <Text
        style={{
          ...GlobalStyles.white,
          marginHorizontal: 20,
          marginVertical: 10,
          textAlign: isArabic ? "left" : "right",
        }}
      >
        نسيت كلمة المرور
      </Text>
      <Text
        style={{
          ...GlobalStyles.white,
          fontWeight: "normal",
          marginHorizontal: 20,
          marginVertical: 20,
          textAlign: isArabic ? "left" : "right",
        }}
      >
        قم بإدخال البريد الإلكتروني لإرسال كود إعادة تعين كلمة المرور
      </Text>
      <Input
        {...email}
        label="البريد الإلكتروني"
        labelStyle={{
          ...GlobalStyles.white,
          color: "black",
          textAlign: isArabic ? "left" : "right",
        }}
        containerStyle={{
          marginHorizontal: "5%",
          width: "90%",
        }}
        inputContainerStyle={{
          borderBottomColor: "white",
        }}
        rightIcon={
          <Icon name="mail" size={24} style={{ paddingHorizontal: 10 }} />
        }
        placeholder="name@gmail.com"
        inputStyle={{ textAlign: "left", paddingLeft: 30 }}
        errorMessage={errorMessage ? errorMessage : "الإيميل المستخدم بالفعل"}
        errorStyle={{
          ...GlobalStyles.white,
          color: errorMessage ? "red" : "black",
          fontSize: 15,
          textAlign: isArabic ? "left" : "right",
        }}
      />
      <TouchableOpacity
        style={{
          ...GlobalStyles.button,
          backgroundColor: loading ? "lightgray" : "white",
        }}
        activeOpacity={0.8}
        onPress={nextStep}
        disabled={loading}
      >
        <Text style={GlobalStyles.blackCenter}>
          {loading ? "جاري الإرسال..." : "التالي"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPassword;
