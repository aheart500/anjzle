import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import UserContext from "../Contexts/User/UserContext";
import { colors, isArabic } from "../Constants";
import StartupCarousel from "../Components/StartupCarousel";
import { StatusBar } from "expo-status-bar";
import LogoWord from "../assets/logo_word.png";
import LogoPic from "../assets/logo_pic.png";

const Startup = ({ navigation }) => {
  const {
    started,
    userState: { isLogged },
  } = useContext(UserContext);
  const [interval, setInterval] = useState(1);
  const startApp = () => {
    started();
    isLogged ? navigation.navigate("home") : navigation.navigate("login");
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.carouselContainer}>
        <StartupCarousel interval={interval} setInterval={setInterval} />
      </View>
      <View style={styles.footerContainer}>
        <View style={styles.logoContainer}>
          <Image source={LogoWord} />
          <Image source={LogoPic} />
        </View>
        <View style={styles.footer}>
          <Text
            style={{
              color: "#fff",
              fontSize: 15,
              textAlign: "center",
              marginTop: 40,
              height: 60,
            }}
          >
            {" "}
            {interval === 1
              ? "نقدم لك كل ما هو جديد ومتطور في متطلباتك الدعائية"
              : "نقدم لك كل ما هو جديد ومتطور في متطلباتك الدعائية"}
          </Text>
          <TouchableOpacity
            onPress={() => {
              startApp();
            }}
            style={styles.button}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}> متابعة</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  carouselContainer: {
    height: "65%",
  },
  footerContainer: {
    backgroundColor: colors.primary,
    height: "35%",
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
  },
  footer: {
    marginTop: 40,
    marginHorizontal: "15%",
    height: "100%",
    width: "70%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    marginTop: 10,
    marginBottom: 40,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 20,
    color: colors.primary,
  },
  logoContainer: {
    position: "absolute",
    width: "100%",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: isArabic ? "row-reverse" : "row",
    top: -15,
  },
});

export default Startup;
