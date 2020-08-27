import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import GlobalStyles from "../../hooks/sharedStyles";
import Header from "../../Components/Header";
import BackArrow from "../../Components/BackArrow";
import UserContext from "../../Contexts/User/UserContext";
import { isArabic } from "../../Constants";
const Service = ({ route, navigation }) => {
  const {
    userState: { token },
  } = useContext(UserContext);

  const service = route.params.service;
  return (
    <View style={styles.container}>
      <Header />
      <BackArrow
        style={{ color: "#fff" }}
        onPress={() => navigation.goBack()}
      />
      <Text
        style={{
          ...GlobalStyles.whiteText,
          textAlign: isArabic ? "left" : "right",
        }}
      >
        {service.title}
      </Text>

      <TouchableOpacity
        style={GlobalStyles.button}
        activeOpacity={0.6}
        onPress={() =>
          navigation.navigate("inquery", { token, service, isPay: false })
        }
      >
        <Text style={{ ...GlobalStyles.blackCenter, fontWeight: "normal" }}>
          استفسار
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={GlobalStyles.button}
        activeOpacity={0.6}
        onPress={() =>
          navigation.navigate("inquery", { token, service, isPay: true })
        }
      >
        <Text style={{ ...GlobalStyles.blackCenter, fontWeight: "normal" }}>
          {`شراء الخدمة ${service.price} ر.س`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.blueContainer,
    paddingTop: 0,
  },
});

export default Service;
