import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../Contexts/User/UserContext";
import { View, Text, StyleSheet, FlatList } from "react-native";
import GlobalStyles from "../../hooks/sharedStyles";
import axios from "axios";
import { api, colors, isArabic } from "../../Constants";

const UsersList = () => {
  const {
    userState: { token },
  } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUsers = () => {
    setLoading(true);
    axios
      .get(api.getUsers, {
        headers: {
          Authorization: "bearer " + token,
        },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    getUsers();
  }, []);
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
          المستخدمين
        </Text>
        <Text style={styles.badge}>{users.length}</Text>
      </View>
      <FlatList
        data={users}
        keyExtractor={(user) => `${user.id}`}
        refreshing={loading}
        onRefresh={() => getUsers()}
        renderItem={({ item: user }) => {
          return (
            <View
              style={{
                backgroundColor: "lightgray",
                marginHorizontal: 10,
                marginVertical: 5,
                padding: 5,
              }}
            >
              <Text style={{ textAlign: "right" }}>{user.name}</Text>
              <Text>{user.email}</Text>
            </View>
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
export default UsersList;
