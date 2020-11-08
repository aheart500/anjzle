import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import UserContext from "../Contexts/User/UserContext";
import { colors, isArabic } from "../Constants";
import StartupCarousel from "../Components/StartupCarousel";
import { StatusBar } from "expo-status-bar";
import Icon from "../assets/logotrasparentsmall.png";
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
        <Image source={Icon} style={styles.image} />
        <View style={styles.footer}>
          <Text
            style={{
              color: "#fff",
              fontSize: 15,
              textAlign: "center",
              marginTop: 15,
              height: 60,
            }}
          >
            {" "}
            {interval === 1
              ? "نقدم لك ما تريد من الخدمات الدعائيى بجودة وسرعة واتقان"
              : "نقدم لك كل ما هو جديد ومتطور في متطلباتك الدعائية"}
          </Text>
          <TouchableOpacity
            onPress={startApp}
            style={styles.button}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}> ابدأ معنا الآن</Text>
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
    marginTop: 30,
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
  image: {
    height: 85,
    width: 50,
    position: "absolute",
    left: "50%",
    top: -30,
    transform: [{ translateX: isArabic ? 25 : -25 }, { scale: 5 }],
  },
});

export default Startup;
