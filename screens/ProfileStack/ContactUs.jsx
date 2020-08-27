import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import GlobalStyles from "../../hooks/sharedStyles";
import axios from "axios";
import { api, colors, isArabic } from "../../Constants";
const ContactUs = ({ route, navigation }) => {
  const { contact, token } = route.params;
  const readContact = (id) => {
    if (contact.readed === 1) return;
    axios
      .post(
        api.contacts + "/read",
        { id },
        {
          headers: {
            Authorization: "bearer " + token,
          },
        }
      )

      .catch((err) => console.log(err));
  };
  useEffect(() => {
    readContact(contact.id);
  }, []);
  return (
    <View style={GlobalStyles.whiteContainer}>
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          textAlign: "center",
          marginVertical: 10,
        }}
      >
        الرسالة
      </Text>
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.text}>الأسم: </Text>
          <Text style={styles.text}>{contact.username} </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>البريد: </Text>
          <Text style={styles.text}>{contact.email} </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>رقم الهاتف: </Text>
          <Text style={styles.text}>{contact.mobile} </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>موضوع الرسالة: </Text>
          <Text style={styles.text}>{contact.subject} </Text>
        </View>
        <Text
          style={{ ...styles.text, textAlign: isArabic ? "left" : "right" }}
        >
          الرسالة:{" "}
        </Text>
        <Text
          style={{ ...styles.text, textAlign: isArabic ? "left" : "right" }}
        >
          {contact.content}{" "}
        </Text>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: colors.primary,
          borderRadius: 10,
          paddingHorizontal: 50,
          paddingVertical: 5,
          alignSelf: "center",
          marginVertical: 10,
        }}
        onPress={() => navigation.goBack()}
      >
        <Text
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 20,
            color: "#fff",
          }}
        >
          العودة
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 10,
  },
  row: {
    flexDirection: isArabic ? "row" : "row-reverse",
  },
  text: {
    fontSize: 20,
    fontFamily: "Cairo",
  },
});
export default ContactUs;
