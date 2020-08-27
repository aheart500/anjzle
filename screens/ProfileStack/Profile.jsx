import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  FontAwesome,
  Entypo,
  Ionicons,
  Feather,
  AntDesign,
} from "@expo/vector-icons";
import GlobalStyles from "../../hooks/sharedStyles";
import UserContext from "../../Contexts/User/UserContext";
import Header from "../../Components/Header";
import { colors, api, isArabic } from "../../Constants";
import { Avatar } from "react-native-elements";
import axios from "axios";
const Profile = ({ navigation }) => {
  const {
    userState: { image, name, token, role_id },
    Logout,
  } = useContext(UserContext);
  const [unreadedOrders, setUnreadedOrders] = useState(0);
  const [unreadedMessages, setUnreadedMessages] = useState(0);
  const [unreadedContacts, setUnreadedContacts] = useState(0);
  const [usersCount, setUsersCount] = useState(0);

  const isAdmin = parseInt(role_id) === 1;

  const getUnreaded = () => {
    axios
      .get(api.addOrder + "/unreaded", {
        headers: {
          Authorization: "bearer " + token,
        },
      })
      .then((res) => {
        const orders = res.data;

        const unreadedOrdersLength = orders.filter(
          (order) => order.status_id === 2
        ).length;
        const unreadedMessagesLength = orders.filter(
          (order) => order.status_id === 1
        ).length;
        setUnreadedOrders(unreadedOrdersLength);
        setUnreadedMessages(unreadedMessagesLength);
      })
      .catch((err) => console.log(err));
  };

  const getUnreadedContacts = () => {
    if (isAdmin) {
      axios
        .get(api.contacts + "/unreaded", {
          headers: {
            Authorization: "bearer " + token,
          },
        })
        .then((res) => {
          setUnreadedContacts(res.data.length);
        })
        .catch((err) => console.log(err));
    }
  };
  const getUsersCount = () => {
    if (isAdmin) {
      axios
        .get(api.api_base + "/users" + "/count", {
          headers: {
            Authorization: "bearer " + token,
          },
        })
        .then((res) => {
          setUsersCount(res.data.count[0]["COUNT(*)"]);
        })
        .catch((err) => console.log(err));
    }
  };
  useEffect(() => {
    getUnreaded();
    getUnreadedContacts();
    getUsersCount();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getUnreaded();
      getUnreadedContacts();
      getUsersCount();
    });
    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    await Logout();
    navigation.navigate("login");
  };
  return (
    <View style={styles.container}>
      <Header color={colors.primary} radius={20} height={120} withText={true} />
      <View
        style={{
          flexDirection: isArabic ? "row" : "row-reverse",

          position: "absolute",
          top: 60,
          justifyContent: "space-between",
          alignItems: "center",
          width: "90%",
          marginHorizontal: "5%",
        }}
      >
        <Avatar
          size="large"
          source={{ uri: api.uploads + "/users/" + image }}
          title={name.substring(0, 1)}
          rounded
        />
        <Text style={{ fontWeight: "bold", fontSize: 20, color: "#fff" }}>
          {name}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("editProfile")}
        style={{
          backgroundColor: colors.primary,
          width: 150,
          alignSelf: isArabic ? "flex-start" : "flex-end",
          marginTop: 25,
          marginHorizontal: 10,
          padding: 4,
          borderRadius: 4,
        }}
      >
        <Text style={{ ...GlobalStyles.white, textAlign: "center" }}>
          ملفي الشخصي
        </Text>
      </TouchableOpacity>
      <View style={styles.list}>
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => navigation.navigate("orders", { status_id: 1 })}
        >
          <FontAwesome name="envelope" size={24} color={colors.primary} />
          <Text style={styles.listText}> الرسائل</Text>

          {unreadedMessages > 0 && (
            <Text style={styles.badge}>{unreadedMessages}</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => navigation.navigate("orders", { status_id: 2 })}
        >
          <Entypo name="shopping-cart" size={24} color={colors.primary} />
          <Text style={styles.listText}> سلة المشتريات</Text>

          {unreadedOrders > 0 && (
            <Text style={styles.badge}>{unreadedOrders}</Text>
          )}
        </TouchableOpacity>
        {isAdmin && (
          <>
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => navigation.navigate("contactUsList")}
            >
              <Feather name="phone-call" size={24} color={colors.primary} />
              <Text style={styles.listText}> رسائل اتصل بنا</Text>

              {unreadedContacts > 0 && (
                <Text style={styles.badge}>{unreadedContacts}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => navigation.navigate("usersList")}
            >
              <AntDesign name="addusergroup" size={24} color={colors.primary} />
              <Text style={styles.listText}>المستخدمين</Text>

              {usersCount > 0 && <Text style={styles.badge}>{usersCount}</Text>}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => navigation.navigate("depsAndServices")}
            >
              <FontAwesome name="reorder" size={24} color={colors.primary} />
              <Text style={styles.listText}> الأقسام والخدمات</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.listItem}
          onPress={() => handleLogout()}
        >
          <Ionicons name="ios-log-out" size={24} color={colors.primary} />
          <Text style={styles.listText}> تسجيل الخروج</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  list: {
    backgroundColor: "#fff",
    marginVertical: 20,

    paddingVertical: 5,
  },
  listItem: {
    flexDirection: isArabic ? "row" : "row-reverse",

    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  listText: {
    paddingRight: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
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
export default Profile;
