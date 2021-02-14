import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

import LogoWord from "../assets/logo_word.png";
import LogoPic from "../assets/logo_pic.png";
import AntDesign from "react-native-vector-icons/AntDesign";
import { isArabic } from "../Constants";
const Header = ({
  color,
  withText,
  title,
  height,
  radius,
  searchIconPress,
}) => {
  return (
    <View
      style={{
        height: height ? height : "20%",
        borderBottomLeftRadius: radius ? radius : 40,
        borderBottomRightRadius: radius ? radius : 40,
        backgroundColor: color ? color : "#5484fc",
        display: "flex",
        flexDirection: isArabic ? "row" : "row-reverse",
        alignItems: "flex-end",
      }}
    >
      {title && (
        <Text
          style={{
            fontFamily: "Cairo",
            color: "white",
            fontSize: 25,
            marginHorizontal: 20,
            paddingBottom: 20,
          }}
        >
          {title}
        </Text>
      )}
      {!title ? (
        withText ? (
          <View
            style={{
              flex: 1,
              flexDirection: isArabic ? "row-reverse" : "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 30, marginRight: 15 }}>
              أنجزلي
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.logoContainer}>
              <Image source={LogoWord} />
              <Image source={LogoPic} />
            </View>

            {searchIconPress && (
              <AntDesign
                name="search1"
                color="white"
                style={{
                  fontSize: 25,
                  height: 70,
                }}
                onPress={() => {
                  searchIconPress();
                }}
              />
            )}
          </>
        )
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    height: "100%",
  },
  logoContainer: {
    height: "100%",
    width: "90%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: isArabic ? "row-reverse" : "row",
    paddingRight: 10,
  },
});

export default Header;
