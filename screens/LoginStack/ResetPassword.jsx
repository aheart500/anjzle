import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import GlobalStyles from "../../hooks/sharedStyles";
import BackArrow from "../../Components/BackArrow";
import useInput from "../../hooks/useInput";
import { Input } from "react-native-elements";
import Icon from "react-native-vector-icons/Entypo";
import { api, isArabic } from "../../Constants";
import axios from "axios";
import UserContext from "../../Contexts/User/UserContext";

const ResetPassword = ({ navigation, route }) => {
  const { email } = route.params;
  const { logUser } = useContext(UserContext);

  const password1 = useInput("");
  const password2 = useInput("");
  const [hidePass1, setHidePass1] = useState(true);
  const [hidePass2, setHidePass2] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const inputProps = {
    labelStyle: styles.label,
    inputContainerStyle: styles.inputContainer,
    containerStyle: styles.wholeContainer,
    inputStyle: styles.input,
  };
  const updatePassword = async () => {
    setErrorMessage("");
    setLoading(true);
    if (password2.value !== password1.value) {
      setErrorMessage("برجاء التأكد من تطابق كلمتي المرور");
      setLoading(false);
      return;
    }
    try {
      await axios.post(api.updatePassword, {
        email,
        password: password1.value,
      });

      setLoading(false);
      await logUser();
      navigation.navigate("home");
    } catch (e) {
      setErrorMessage("حدث خطأ أثناء حفظ كلمة المرور الجديدة");
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
          marginBottom: 15,
          textAlign: isArabic ? "left" : "right",
        }}
      >
        إعادة تعيين كلمة المرور
      </Text>
      <Text
        style={{
          ...GlobalStyles.white,
          marginHorizontal: 20,
          marginVertical: 20,
          fontWeight: "normal",
          textAlign: isArabic ? "left" : "right",
        }}
      >
        بإمكانك الآن تعيين كلمة مرور جديدة
      </Text>
      <Input
        {...inputProps}
        leftIcon={
          <Icon
            name={hidePass1 ? "eye-with-line" : "eye"}
            size={24}
            style={{ paddingHorizontal: 10 }}
            onPress={() => setHidePass1(!hidePass1)}
          />
        }
        {...password1}
        secureTextEntry={hidePass1}
        label="كلمة المرور"
        placeholder="••••••••••••••••••••••••"
      />
      <Input
        {...inputProps}
        leftIcon={
          <Icon
            name={hidePass2 ? "eye-with-line" : "eye"}
            size={24}
            style={{ paddingHorizontal: 10 }}
            onPress={() => setHidePass2(!hidePass2)}
          />
        }
        {...password2}
        secureTextEntry={hidePass2}
        label="تأكيد كلمة المرور"
        placeholder="••••••••••••••••••••••••"
        errorMessage={errorMessage ? errorMessage : null}
        errorStyle={{
          fontSize: 20,
          fontWeight: "bold",
          textAlign: isArabic ? "left" : "right",
        }}
      />
      <TouchableOpacity
        style={{
          ...GlobalStyles.button,
          backgroundColor: loading ? "lightgray" : "white",
        }}
        activeOpacity={0.8}
        onPress={updatePassword}
        disabled={loading}
      >
        <Text style={GlobalStyles.blackCenter}>
          {loading ? "جاري الحفظ..." : "التأكيد"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  label: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",

    position: "relative",
    top: "-10%",
    textAlign: isArabic ? "left" : "right",
  },
  wholeContainer: {
    width: "90%",
    marginHorizontal: "5%",
  },
  inputContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    flexDirection: isArabic ? "row-reverse" : "row",
  },
  input: {
    paddingLeft: 30,
    textAlign: !isArabic ? "left" : "right",
  },
});
export default ResetPassword;
