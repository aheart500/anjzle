import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ActionSheetIOS,
} from "react-native";

import GlobalStyles from "../../hooks/sharedStyles";
import { api, colors, isArabic } from "../../Constants";
import axios from "axios";
import UserContext from "../../Contexts/User/UserContext";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-community/picker";
import { TextInput } from "react-native-gesture-handler";

const Orders = ({ navigation, route }) => {
  const [orders, setOrders] = useState([]);
  const {
    userState: { token, role_id },
  } = useContext(UserContext);

  const [statusId, setStatusId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  let axiosCancel;
  let CancelToken = axios.CancelToken;

  const fetchOrders = (s, l, refresh, searchParam) => {
    setLoading(true);

    axios
      .get(
        `${api.addOrder}/${s}/${l}/10/${
          searchParam ? searchParam : "no_search"
        }`,
        {
          headers: {
            Authorization: "bearer " + token,
            search: searchParam ? true : false,
          },
          cancelToken: new CancelToken((c) => {
            axiosCancel = c;
          }),
        }
      )
      .then((res) => {
        if (typeof res.data === "object") {
          refresh ? setOrders(res.data) : setOrders(orders.concat(res.data));
        }
        if (res.data === "NO_ORDERS") {
          refresh && setOrders([]);
        }
      })
      .catch((e) => setError("مشكلة في الأتصال"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders(statusId, 0, true, search);
  }, [search]);

  const hangleStatusChange = (value) => {
    setOrders([]);
    setStatusId(value);
    fetchOrders(value, 0, true, search);
  };
  useEffect(() => {
    if (route.params) {
      route.params.status_id
        ? hangleStatusChange(route.params.status_id)
        : null;
    } else {
      hangleStatusChange(statusId);
    }
    setSearch("");
  }, [route.params]);

  const readOrder = (id) => {
    axios
      .post(
        api.addOrder + "/readed",
        { id },
        {
          headers: {
            Authorization: "bearer " + token,
          },
        }
      )

      .catch((err) => console.log(err));
  };

  const showActiveSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["كافة الطلبات", "الطلبات الملغية", "إلغاء"],
        cancelButtonIndex: 2,
      },
      (index) => {
        if (index === 0) hangleStatusChange(2);
        if (index === 1) hangleStatusChange(4);
      }
    );
  };

  const UNREADED = () => (
    <Text
      style={{
        marginRight: 20,
        backgroundColor: colors.primary,
        padding: 5,
        borderRadius: 5,
        color: "#fff",
      }}
    >
      غير مقروء
    </Text>
  );

  return (
    <View style={GlobalStyles.whiteContainer}>
      <View style={styles.header}>
        <Text style={{ fontFamily: "Cairo", fontSize: 20 }}>طلباتي</Text>
        <TextInput
          style={{
            borderRadius: 2,
            borderColor: "lightgray",
            borderWidth: 2,
            paddingHorizontal: 10,
            paddingVertical: 2,
          }}
          value={search}
          onChangeText={(t) => {
            setSearch(t);
          }}
          placeholder="رقم الطلب"
        />
        <View style={GlobalStyles.pickerContainerContainer}>
          <View style={GlobalStyles.pickerContainer}>
            {Platform.OS !== "ios" ? (
              <Picker
                selectedValue={statusId === 4 ? statusId : 2}
                mode={Platform.OS === "ios" ? "dialog" : "dropdown"}
                style={{
                  height: 50,
                  width: 100,
                  backgroundColor: "transparent",
                }}
                onValueChange={(value) => hangleStatusChange(value)}
              >
                <Picker.Item label="كافة الطلبات" value={2} />

                <Picker.Item label="الطلبات الملغية" value={4} />
              </Picker>
            ) : (
              <TouchableOpacity
                style={{
                  height: 50,
                  width: 90,
                  backgroundColor: "transparent",
                  justifyContent: "center",
                }}
                onPress={showActiveSheet}
              >
                <Text style={{ textAlign: "right" }}>
                  {statusId === 4 ? "الطلبات الملغية" : "كافة الطلبات"}
                </Text>
              </TouchableOpacity>
            )}

            <AntDesign name="down" size={10} color="black" />
          </View>
        </View>
      </View>
      {statusId !== 4 && (
        <View style={styles.taps}>
          <TouchableOpacity
            style={styles.tap}
            onPress={() => hangleStatusChange(1)}
          >
            <Text
              style={{
                ...styles.tapText,
                color: statusId === 1 ? "orange" : "black",
              }}
            >
              الاستفسارات
            </Text>
            <View
              style={{
                ...styles.blackLine,
                backgroundColor: statusId === 1 ? "orange" : "black",
              }}
            ></View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tap}
            onPress={() => hangleStatusChange(2)}
          >
            <Text
              style={{
                ...styles.tapText,
                color: statusId === 2 ? "orange" : "black",
              }}
            >
              قيد التنفيذ
            </Text>
            <View
              style={{
                ...styles.blackLine,
                backgroundColor: statusId === 2 ? "orange" : "black",
              }}
            ></View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tap}
            onPress={() => hangleStatusChange(3)}
          >
            <Text
              style={{
                ...styles.tapText,
                color: statusId === 3 ? "orange" : "black",
              }}
            >
              المكتملة
            </Text>
            <View
              style={{
                ...styles.blackLine,
                backgroundColor: statusId === 3 ? "orange" : "black",
              }}
            ></View>
          </TouchableOpacity>
        </View>
      )}
      {loading && orders.length === 0 ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ margin: 20 }}
        />
      ) : (
        <FlatList
          data={orders.filter((order) => order.status_id === statusId)}
          keyExtractor={(item) => `${item.id}`}
          refreshing={loading && orders.length === 0}
          onRefresh={() => {
            fetchOrders(statusId, 0, true);
          }}
          onEndReachedThreshold={0.5}
          ListHeaderComponent={
            orders.length === 0 ? (
              <Text
                style={{
                  fontFamily: "Cairo",
                  fontSize: 30,
                  textAlign: "center",
                  marginTop: 20,
                }}
              >
                لا توجد طلبات
              </Text>
            ) : null
          }
          onEndReached={() => {
            fetchOrders(statusId, orders.length, false, search);
          }}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.card}
                onPress={() => {
                  if (parseInt(role_id) !== 1 && item.user_readed === 0)
                    readOrder(item.id);
                  if (parseInt(role_id) === 1 && item.readed === 0)
                    readOrder(item.id);

                  navigation.navigate("order", {
                    order: item,
                  });
                }}
              >
                <View
                  style={{ flexDirection: isArabic ? "row" : "row-reverse" }}
                >
                  <FontAwesome
                    name="calendar"
                    size={24}
                    color="black"
                    style={{ marginRight: 20 }}
                  />
                  <Text style={{ marginRight: 10 }}>مدة التنفيذ غير محددة</Text>
                  <AntDesign
                    name="creditcard"
                    size={24}
                    color="black"
                    style={{ marginRight: 20 }}
                  />
                  <Text style={{ marginRight: 10 }}>{item.status_name}</Text>
                </View>
                <View
                  style={{
                    flexDirection: isArabic ? "row" : "row-reverse",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      marginHorizontal: 20,
                    }}
                  >
                    {item.id}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    {item.service_title}
                  </Text>
                  {item.readed === 0 && parseInt(role_id) === 1 && <UNREADED />}
                  {item.user_readed === 0 && parseInt(role_id) !== 1 && (
                    <UNREADED />
                  )}
                </View>

                <View
                  style={{
                    backgroundColor: colors.primary,
                    marginHorizontal: 90,
                    marginVertical: 5,
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{ textAlign: "center", fontSize: 20, color: "#fff" }}
                  >
                    إرسال رسالة
                  </Text>
                </View>
                <Text style={{ textAlign: "center", marginVertical: 5 }}>
                  التعديل متاح خلال 24 ساعة فقط من تاريخ تسليم الخدمة
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: isArabic ? "row" : "row-reverse",

    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 20,
    borderBottomWidth: 1,
    paddingBottom: 15,
    borderBottomColor: "#000",
  },
  taps: {
    flexDirection: isArabic ? "row" : "row-reverse",

    width: "100%",
    backgroundColor: "#fff",
  },
  tap: {
    marginTop: 10,
    flex: 1,
  },
  tapText: {
    fontSize: 15,
    padding: 10,
    textAlign: "center",
  },
  blackLine: {
    height: 5,
    marginHorizontal: "25%",
    borderRadius: 2,
  },
  card: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
  },
});

export default Orders;
