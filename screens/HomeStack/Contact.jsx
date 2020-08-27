import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
} from "react-native";
import GlobalStyles from "../../hooks/sharedStyles";
import AntDesign from "react-native-vector-icons/AntDesign";
import useInput from "../../hooks/useInput";
import { colors, api, isArabic } from "../../Constants";
import { Input } from "react-native-elements";
import axios from "axios";

import { Alert } from "react-native";
const Contact = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [name, email, mobile, title, content] = Array.from(Array(5), () => {
    return useInput("");
  });

  const handelSend = () => {
    setLoading(true);
    if (
      name.value === "" ||
      email.value === "" ||
      mobile.value === "" ||
      title.value === "" ||
      content.value === ""
    ) {
      setErrorMessage("يجب ملأ جميع الحقول");
      return;
    }

    const data = {
      username: name.value,
      email: email.value,
      mobile: mobile.value,
      subject: title.value,
      content: content.value,
      readed: 0,
    };

    axios
      .post(api.contacts, data)
      .then((res) => {
        name.onChangeText("");
        email.onChangeText("");
        mobile.onChangeText("");
        title.onChangeText("");
        content.onChangeText("");
        Alert.alert("", "تم إرسال الرسالة، سوف نرد عليك في أقرب وقت");
        navigation.navigate("home");
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
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
      style={{ ...GlobalStyles.whiteContainer }}
    >
      <View
        style={{
          flexDirection: isArabic ? "row" : "row-reverse",
          marginTop: 70,
          justifyContent: "center",
        }}
      >
        <AntDesign
          name="arrowright"
          size={24}
          style={{ position: "absolute", left: 20 }}
          onPress={() => navigation.goBack()}
        />
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          اتصل بنا
        </Text>
      </View>
      <ScrollView style={{ padding: 10, paddingTop: 20 }}>
        <Input {...inputProps()} {...name} label="الأسم كامل" />
        <Input
          {...inputProps()}
          {...email}
          keyboardType="email-address"
          label="البريد الإلكتروني"
        />
        <Input
          {...inputProps()}
          {...mobile}
          keyboardType="phone-pad"
          label="رقم الجوال"
        />
        <Input {...inputProps()} {...title} label="عنوان الرسالة" />
        <Input
          {...inputProps({
            textAlignVertical: "top",
          })}
          {...content}
          multiline
          numberOfLines={Platform.OS === "ios" ? null : 5}
          minHeight={Platform.OS === "ios" ? 20 * 5 : null}
          label="موضوع الرسالة"
          errorMessage={errorMessage ? errorMessage : null}
          errorStyle={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        />
        <View style={styles.buttons}>
          <TouchableOpacity
            style={{
              ...styles.button,
              backgroundColor: loading ? "lightgray" : colors.primary,
            }}
            onPress={() => handelSend()}
            disabled={loading}
          >
            {loading && <ActivityIndicator size="small" colors="#fff" />}
            <Text style={styles.buttonText}>إرسال</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  },
  wholeContainer: {
    width: "90%",
    marginHorizontal: "5%",
  },
  inputContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  input: {
    paddingLeft: 20,
    textAlign: "left",
  },
  buttons: {
    flexDirection: isArabic ? "row" : "row-reverse",
    marginHorizontal: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 50,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff",
  },
});

export default Contact;
