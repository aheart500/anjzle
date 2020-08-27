import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import HeaderImage from "../../assets/header.png";
import { colors, isArabic } from "../../Constants";
import Icon from "react-native-vector-icons/Entypo";
import IonIcon from "react-native-vector-icons/Ionicons";
import { Input } from "react-native-elements";
import UserContext from "../../Contexts/User/UserContext";
import GlobalStyles from "../../hooks/sharedStyles";

const Login = ({ navigation }) => {
  const [hidePass, setHidePass] = useState(true);
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { Login: UserLogin } = useContext(UserContext);

  const login = async () => {
    setLoading(true);
    setError(false);
    try {
      await UserLogin(email, password);
      setLoading(false);
      setEmail("");
      setPassword("");
      navigation.navigate("home");
    } catch (e) {
      console.log(e.message);
      setLoading(false);
      setError(true);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Image
          source={HeaderImage}
          resizeMode="cover"
          style={styles.headerImage}
        />
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.main}>
          <Text style={GlobalStyles.white}>تسجيل الدخول</Text>

          <View style={styles.form}>
            <Text
              style={{
                ...GlobalStyles.blackBold,
                textAlign: !isArabic ? "right" : "left",
              }}
            >
              البريد الإلكتروني
            </Text>
            <Input
              rightIcon={
                <Icon name="mail" size={24} style={{ paddingLeft: 10 }} />
              }
              containerStyle={styles.inputContainer}
              inputContainerStyle={styles.input}
              inputStyle={{
                textAlign: isArabic ? "right" : "left",
                paddingLeft: 50,
              }}
              placeholder="name@gmail.com"
              keyboardType="email-address"
              value={email}
              onChangeText={(t) => setEmail(t)}
            />

            <Text
              style={{
                ...GlobalStyles.blackBold,
                textAlign: !isArabic ? "right" : "left",
              }}
            >
              كلمة المرور
            </Text>
            <Input
              leftIcon={
                <Icon
                  name={!hidePass ? "eye" : "eye-with-line"}
                  size={24}
                  style={styles.eye}
                  onPress={() => setHidePass(!hidePass)}
                />
              }
              containerStyle={styles.inputContainer}
              inputContainerStyle={{ ...styles.input, paddingHorizontal: 0 }}
              secureTextEntry={hidePass}
              placeholder="••••••••••••••••••••••••"
              value={password}
              onChangeText={(t) => setPassword(t)}
            />
            {error && (
              <Text
                style={{
                  color: "red",
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: !isArabic ? "right" : "left",
                }}
              >
                تأكد من إدخال البريد وكلمة المرور الصحيحين
              </Text>
            )}
            <TouchableOpacity
              onPress={() => navigation.navigate("forgotPassword")}
            >
              <Text
                style={{
                  ...GlobalStyles.blackBold,
                  textAlign: !isArabic ? "right" : "left",
                }}
              >
                نسيت كلمة المرور؟
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...GlobalStyles.button,
                backgroundColor: loading ? "lightgray" : "white",
              }}
              activeOpacity={0.8}
              onPress={login}
              disabled={loading}
            >
              <Text style={GlobalStyles.blackCenter}>
                {loading ? "جاري الدخول..." : "تسجيل الدخول"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginHorizontal: "25%",
                marginTop: 30,
                flexDirection: isArabic ? "row" : "row-reverse",
              }}
              onPress={() => navigation.navigate("register")}
            >
              <IonIcon
                name="md-person-add"
                size={24}
                color="#fff"
                style={{ marginHorizontal: 10 }}
              />
              <Text style={GlobalStyles.white}>مستخدم جديد</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",

    overflow: "hidden",
  },
  header: {
    height: "30%",
  },
  headerImage: {
    height: "100%",
    width: "100%",
    position: "relative",
  },
  mainContainer: {
    height: "70%",
    backgroundColor: colors.primary,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    position: "relative",
  },
  main: {
    width: "80%",
    marginHorizontal: "10%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    top: 35,
  },
  form: {
    width: "100%",
    marginVertical: 10,
  },
  inputContainer: {
    width: "100%",
    marginTop: 5,
    marginBottom: -20,
  },
  input: {
    backgroundColor: "#fff",
    paddingRight: 10,
    paddingHorizontal: 10,
    borderRadius: 10,

    flexDirection: isArabic ? "row-reverse" : "row",
  },
  eye: {
    marginHorizontal: 30,
  },
});
export default Login;
