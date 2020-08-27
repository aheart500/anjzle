import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../Contexts/User/UserContext";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import GlobalStyles from "../../hooks/sharedStyles";
import axios from "axios";
import { api, colors, isArabic } from "../../Constants";

const ContactUsList = ({ route, navigation }) => {
  const {
    userState: { token },
  } = useContext(UserContext);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getContacts = () => {
    setLoading(true);
    axios
      .get(api.contacts, {
        headers: {
          Authorization: "bearer " + token,
        },
      })
      .then((res) => {
        setContacts(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getContacts();
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getContacts();
    });
    return unsubscribe;
  }, [navigation]);
  return (
    <View style={GlobalStyles.whiteContainer}>
      <View
        style={{
          flexDirection: isArabic ? "row" : "row-reverse",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            textAlign: "center",
            marginVertical: 10,
          }}
        >
          رسائل اتصل بنا
        </Text>
        <Text style={styles.badge}>
          {contacts.filter((contact) => contact.readed === 0).length}
        </Text>
      </View>
      <FlatList
        data={contacts}
        keyExtractor={(item) => `${item.id}`}
        refreshing={loading}
        onRefresh={() => getContacts()}
        renderItem={({ item: contact }) => {
          return (
            <TouchableOpacity
              style={{
                backgroundColor: contact.readed === 0 ? "#abc8f5" : "lightgray",
                padding: 5,
                marginHorizontal: 10,
                marginVertical: 5,
              }}
              onPress={() =>
                navigation.navigate("contactUs", { token, contact })
              }
            >
              <Text style={{ textAlign: isArabic ? "left" : "right" }}>
                {contact.username}
              </Text>
              <Text style={{ textAlign: isArabic ? "left" : "right" }}>
                الموضوع : {contact.subject}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: "center",
    position: "absolute",
    right: 50,
    backgroundColor: colors.primary,
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
    textAlignVertical: "center",
    borderRadius: 20,
    paddingHorizontal: 10,
  },
});
export default ContactUsList;
