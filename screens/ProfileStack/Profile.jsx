import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
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
import ProfileOptions from "./ProfileOptions";

const Profile = ({ navigation }) => {
  const {
    userState: { image, name, token, role_id, email },
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
      <Header
        color={colors.primary}
        radius={20}
        height={120}
        title="الملف الشخصي"
      />
      <View
        style={{
          flexDirection: isArabic ? "row" : "row-reverse",
          justifyContent: "space-between",
          alignItems: "center",
          width: "90%",
          marginHorizontal: "5%",
          marginTop: 10,
        }}
      >
        <Avatar
          size="large"
          source={{ uri: api.uploads + "/users/" + image }}
          title={name.substring(0, 1)}
          rounded
        />
        <View
          style={{
            width: "70%",
            alignItems: isArabic ? "flex-start" : "flex-end",
          }}
        >
          <Text
            style={{
              fontSize: 30,
              color: "#515c6f",
              fontWeight: "bold",
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: "#515c6f",
              marginTop: 7,
              fontFamily: "Cairo",
              marginBottom: 15,
            }}
          >
            {email}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("editProfile")}
            style={{
              backgroundColor: "white",
              width: 150,

              padding: 4,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "gray",
            }}
          >
            <Text
              style={{ color: "gray", fontWeight: "bold", textAlign: "center" }}
            >
              تعديل البروفايل
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.list}>
        <View style={styles.box}>
          <ProfileOptions
            iconName="allOrders"
            title="أرشيف الطلبات"
            action={() =>
              navigation.navigate("orders", { status_id: 1, searching: false })
            }
          />
          <ProfileOptions
            iconName="pendingOrders"
            title="قيد التنفيذ"
            action={() =>
              navigation.navigate("orders", { status_id: 2, searching: false })
            }
          />
          <ProfileOptions
            iconName="completedOrders"
            title="طلبات منتهية"
            action={() =>
              navigation.navigate("orders", { status_id: 3, searching: false })
            }
          />
        </View>
        <View style={styles.box}>
          <ProfileOptions
            iconName="who"
            title="من نحن"
            action={() => navigation.navigate("who")}
          />
          <ProfileOptions
            iconName="contact"
            title="تواصل معنا"
            action={() => navigation.navigate("contact")}
          />

          <ProfileOptions
            iconName="privacy"
            title="الشروط والخصوصية"
            action={() => navigation.navigate("privacy")}
          />

          {isAdmin && (
            <>
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => navigation.navigate("contactUsList")}
              >
                <Feather name="phone-call" size={24} color="gray" />
                <Text style={styles.listText}> رسائل اتصل بنا</Text>

                {unreadedContacts > 0 && (
                  <Text style={styles.badge}>{unreadedContacts}</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => navigation.navigate("usersList")}
              >
                <AntDesign name="addusergroup" size={24} color="gray" />
                <Text style={styles.listText}>المستخدمين</Text>

                {usersCount > 0 && (
                  <Text style={styles.badge}>{usersCount}</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => navigation.navigate("depsAndServices")}
              >
                <FontAwesome name="reorder" size={24} color="gray" />
                <Text style={styles.listText}> الأقسام والخدمات</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={styles.listItem}
            onPress={() => handleLogout()}
          >
            <Ionicons name="ios-log-out" size={24} color="gray" />
            <Text style={styles.listText}> تسجيل الخروج</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: "#fff",
  },
  list: {
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
  box: {
    elevation: 2,
    borderRadius: 5,
    backgroundColor: "white",
    marginBottom: 5,
    width: "90%",
    marginHorizontal: "5%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 3.27,
  },
});
export default Profile;
