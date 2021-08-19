import React, { useState, useContext } from "react";
import {
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import BackArrow from "../../Components/BackArrow";
import GlobalStyles from "../../hooks/sharedStyles";
import { Input } from "react-native-elements";
import useInput from "../../hooks/useInput";
import Icon from "react-native-vector-icons/Entypo";
import UserContext from "../../Contexts/User/UserContext";
import { isArabic } from "../../Constants";
const Register = ({ navigation }) => {
  const name = useInput("");
  const email = useInput("");
  const password1 = useInput("");
  const password2 = useInput("");
  const [hidePass1, setHidePass1] = useState(true);
  const [hidePass2, setHidePass2] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { SignUp } = useContext(UserContext);
  const signUp = async () => {
    setLoading(true);
    setErrorMessage("");
    if (password1.value !== password2.value) {
      setErrorMessage("كلمتي المرور غير متطابقتين");
      setLoading(false);

      return;
    }

    try {
      const data = await SignUp(name.value, email.value, password1.value);
      if (data === "registered") {
        setErrorMessage("البريد الإلكتروني مسجل بالفعل");
        setLoading(false);
        return;
      }
      setLoading(false);
      email.onChangeText("");
      name.onChangeText("");
      password1.onChangeText("");
      password2.onChangeText("");
      navigation.navigate("login", {
        code: data.verified_code,
        new: true,
        email: email.value,
      },);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };
  const inputProps = (custom) => {
    return {
      labelStyle: styles.label,
      inputContainerStyle: styles.inputContainer,
      containerStyle: styles.wholeContainer,
      inputStyle: {
        ...styles.input,
        ...custom,
      },
    };
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={GlobalStyles.blueContainer}
    >
      <>
        <BackArrow onPress={() => navigation.goBack()} />
        <ScrollView style={styles.main}>
          <Text
            style={{
              ...GlobalStyles.white,
              marginHorizontal: 20,
              marginBottom: 15,
              textAlign: isArabic ? "left" : "right",
            }}
          >
            مستخدم جديد
          </Text>
          <Input
            {...inputProps({ textAlign: "center" })}
            {...name}
            label="الأسم"
            placeholder="محمد أحمد"
          />
          <Input
            rightIcon={
              <Icon name="mail" size={24} style={{ paddingHorizontal: 10 }} />
            }
            {...inputProps({ paddingRight: 10 })}
            {...email}
            label="البريد الإلكتروني"
            placeholder="name@gmail.com"
          />
          <Input
            leftIcon={
              <Icon
                name={hidePass1 ? "eye-with-line" : "eye"}
                size={24}
                style={{ paddingHorizontal: 10 }}
                onPress={() => setHidePass1(!hidePass1)}
              />
            }
            {...inputProps({ paddingRight: 20 })}
            {...password1}
            secureTextEntry={hidePass1}
            label="كلمة المرور"
            placeholder="••••••••••••••••••••••••"
          />
          <Input
            leftIcon={
              <Icon
                name={hidePass2 ? "eye-with-line" : "eye"}
                size={24}
                style={{ paddingHorizontal: 10 }}
                onPress={() => setHidePass2(!hidePass2)}
              />
            }
            {...inputProps({ paddingRight: 20 })}
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
            onPress={signUp}
            disabled={loading}
          >
            <Text style={GlobalStyles.blackCenter}>
              {loading ? "جاري الحفظ..." : "التالي"}
              
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  label: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: isArabic ? "left" : "right",
    position: "relative",
    top: "-10%",
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
    paddingLeft: 20,
    textAlign: !isArabic ? "left" : "right",
  },
});
export default Register;
