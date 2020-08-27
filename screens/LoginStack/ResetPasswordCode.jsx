import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  useContext,
} from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import GlobalStyles from "../../hooks/sharedStyles";
import BackArrow from "../../Components/BackArrow";
import useInput from "../../hooks/useInput";
import { Input } from "react-native-elements";
import axios from "axios";
import { api, isArabic } from "../../Constants";
import UserContext from "../../Contexts/User/UserContext";

const ResetPasswordCode = ({ route, navigation }) => {
  const { code, new: isNew, email } = route.params;
  const { logUser } = useContext(UserContext);
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    const r = setTimeout(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);
    return () => clearTimeout(r);
  }, [timeLeft]);
  const nextStep = async () => {
    setLoading(true);
    setErrorMessage("");
    const wholeNumber = inputs
      .map((n) => n.value)
      .reduce((t, n) => {
        return t + n;
      }, "");

    if (parseInt(wholeNumber) === parseInt(code)) {
      setLoading(false);
      if (isNew) {
        await logUser();
        navigation.navigate("home");
      } else {
        navigation.navigate("resetPassword", { email });
      }
    } else {
      setErrorMessage("يرجي التأكد من إدخال الرقم الصحيح");
      setLoading(false);
    }
  };
  const resendCode = async () => {
    try {
      await axios.post(api.resendCode, { code, email });
      setTimeLeft(59);
    } catch (e) {
      console.log(e);
    }
  };
  const fourNumbersArray = Array(4);
  const inputs = Array.from(fourNumbersArray, () => {
    return useInput("");
  });
  const nodes = Array.from(fourNumbersArray, () => {
    return useRef();
  });

  const FourInputs = useCallback(() => {
    return (
      <View style={styles.inputsContainer}>
        {inputs.map((n, i) => {
          return (
            <Input
              value={inputs[i].value}
              onKeyPress={(e) => {
                if (e.nativeEvent.key === "Backspace" && i !== 0) {
                  nodes[i - 1].current.focus();
                }
              }}
              onChangeText={(t) => {
                inputs[i].onChangeText(t);

                if (t !== "" && i !== 3) {
                  nodes[i + 1].current.focus();
                }
              }}
              ref={nodes[i]}
              key={i}
              keyboardType="number-pad"
              placeholder="-"
              maxLength={1}
              placeholderTextColor="#000"
              containerStyle={styles.wholeContainer}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.input}
            />
          );
        })}
      </View>
    );
  });
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
        {isNew ? "كود التفعيل" : "كود إعادة التعيين"}
      </Text>
      <View>
        <Text style={styles.whiteCenter}>افحص قائمة الرسائل على الأيميل</Text>
        <Text style={styles.whiteCenter}>{email}</Text>
        <Text style={{ ...styles.whiteCenter, marginTop: 20 }}>
          ستجد رسالة تحتوي على كود {isNew ? "التفعيل" : "إعادة التعيين"}
        </Text>
      </View>
      {FourInputs()}
      <Text style={{ ...styles.whiteCenter, color: "red" }}>
        {errorMessage}
      </Text>
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
          {loading ? "جاري التحقق..." : "التالي"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity disabled={timeLeft > 0} onPress={() => resendCode()}>
        <Text
          style={{
            ...styles.whiteCenter,
            color: timeLeft > 0 ? "gray" : "black",
            fontWeight: "bold",
            marginVertical: 15,
          }}
        >
          لم تصلك رسالة بعد؟ ارسل رسالة{" "}
          {timeLeft > 0 ? `بعد 00:${timeLeft}` : "الآن"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  inputsContainer: {
    flexDirection: isArabic ? "row-reverse" : "row",
    justifyContent: "space-evenly",
    width: "80%",
    marginHorizontal: "10%",
    marginVertical: 15,
  },
  wholeContainer: {
    flex: 1,
  },
  inputContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
  },
  input: {
    fontSize: 50,
    textAlign: "center",
    borderRadius: 25,
  },
  whiteCenter: {
    ...GlobalStyles.white,
    fontWeight: "normal",
    textAlign: "center",
  },
});
export default ResetPasswordCode;
