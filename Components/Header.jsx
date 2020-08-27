import React from "react";
import { View, Image, Text } from "react-native";
import HeaderImage from "../assets/header.png";
import Icon from "../assets/logotrasparentsmall.png";
import GlobalStyles from "../hooks/sharedStyles";
const Header = ({ color, withText, height, radius }) => {
  return (
    <View
      style={{
        height: height ? height : "25%",
        borderBottomLeftRadius: radius ? radius : 40,
        borderBottomRightRadius: radius ? radius : 40,
        backgroundColor: color ? color : "#fff",
      }}
    >
      {withText ? (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 30, marginRight: 15 }}>
            أنجزلي
          </Text>
          <Image source={Icon} style={{ height: 300, width: 50 }} />
        </View>
      ) : (
        <Image
          source={HeaderImage}
          resizeMode="cover"
          style={{ height: "100%", width: "100%" }}
        />
      )}
    </View>
  );
};

export default Header;
