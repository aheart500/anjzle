import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ActionSheetIOS,
  Image,
} from "react-native";
import MessageIcon from "../../assets/message.png";
import GlobalStyles from "../../hooks/sharedStyles";
import { api, colors, isArabic } from "../../Constants";
import axios from "axios";
import UserContext from "../../Contexts/User/UserContext";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-community/picker";
import { TextInput } from "react-native-gesture-handler";
import { StatusBar } from "react-native";

const Orders = ({ navigation, route }) => {
  const [orders, setOrders] = useState([]);
  const [searching, setSearching] = useState(false);
  const {
    userState: { token, role_id },
  } = useContext(UserContext);
  const searchInput = useRef();
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
    fetchOrders(statusId, 0, true, search ? search : null);
  }, [search]);

  const hangleStatusChange = (value) => {
    if (searching) {
      setSearching(false);
    }
    setOrders([]);
    setStatusId(value);
    fetchOrders(value, 0, true, search);
  };
  useEffect(() => {
    if (route.params) {
      route.params.status_id
        ? hangleStatusChange(route.params.status_id)
        : null;
      if (route.params.searching) {
        setSearching(true);
      }
    } else {
      hangleStatusChange(statusId);
    }
    setSearch("");
  }, [route.params]);
  useEffect(() => {
    if (searching && searchInput) {
      searchInput.current.focus();
    }
  }, [searching]);
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

  return (
    <View style={GlobalStyles.whiteContainer}>
      <StatusBar backgroundColor={colors.primary} />
      <View style={styles.header}>
        <TextInput
          style={{
            borderRadius: 2,
            borderColor: "lightgray",
            borderWidth: 2,
            paddingHorizontal: 10,
            paddingVertical: 2,
            width: "30%",
            display: searching ? "flex" : "none",
          }}
          value={search}
          ref={searchInput}
          onChangeText={(t) => {
            setSearch(t);
          }}
          placeholder="رقم الطلب"
        />
        <AntDesign
          name="search1"
          color="white"
          style={{
            fontSize: 25,

            display: searching ? "none" : "flex",
          }}
          onPress={() => {
            setSearching(true);
          }}
        />
        <Text
          style={{
            fontFamily: "Cairo",
            fontSize: 20,
            color: "white",
            textAlign: "center",
          }}
        >
          طلباتي
        </Text>
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
                color: statusId === 1 ? "black" : "#bfc0c0",
              }}
            >
              الاستفسارات
            </Text>
            {statusId === 1 && (
              <View
                style={{
                  ...styles.blackLine,
                  backgroundColor: "black",
                }}
              ></View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tap}
            onPress={() => hangleStatusChange(2)}
          >
            <Text
              style={{
                ...styles.tapText,
                color: statusId === 2 ? "black" : "#bfc0c0",
              }}
            >
              قيد التنفيذ
            </Text>
            {statusId === 2 && (
              <View
                style={{
                  ...styles.blackLine,
                  backgroundColor: "black",
                }}
              ></View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tap}
            onPress={() => hangleStatusChange(3)}
          >
            <Text
              style={{
                ...styles.tapText,
                color: statusId === 3 ? "black" : "#bfc0c0",
              }}
            >
              المكتملة
            </Text>
            {statusId === 3 && (
              <View
                style={{
                  ...styles.blackLine,
                  backgroundColor: "black",
                }}
              ></View>
            )}
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
          renderItem={({ item, index }) => {
            const isUnread =
              (item.readed === 0 && parseInt(role_id) === 1) ||
              (item.user_readed === 0 && parseInt(role_id) !== 1);
            return (
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.card}
                onPress={() => {
                  if (parseInt(role_id) !== 1 && item.user_readed === 0)
                    readOrder(item.id);
                  if (parseInt(role_id) === 1 && item.readed === 0)
                    readOrder(item.id);
                  setSearching(false);
                  navigation.navigate("order", {
                    order: item,
                  });
                }}
              >
                <View
                  style={{
                    width: "85%",
                  }}
                >
                  <Text
                    style={{
                      alignSelf: isArabic ? "flex-start" : "flex-end",
                      color: "#bfc0c0",
                    }}
                  >
                    {isUnread && (
                      <Text
                        style={{
                          fontSize: 20,
                          fontFamily: "Cairo",
                          color: colors.primary,
                        }}
                      >
                        *
                      </Text>
                    )}
                    {item.id}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "Cairo",
                      color: colors.primary,
                      textAlign: "right",
                    }}
                  >
                    {item.service_title}
                  </Text>
                  <View
                    style={{
                      flexDirection: isArabic ? "row" : "row-reverse",
                    }}
                  >
                    <FontAwesome name="calendar" size={24} color="#bcbcbc" />
                    <Text style={{ marginHorizontal: 10, color: "#bcbcbc" }}>
                      مدة التنفيذ غير محددة
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: isArabic ? "row" : "row-reverse",
                    }}
                  >
                    <AntDesign name="creditcard" size={24} color="#bcbcbc" />
                    <Text style={{ marginHorizontal: 10, color: "#bcbcbc" }}>
                      {item.status_name}
                    </Text>
                  </View>
                </View>
                <View>
                  <Image source={MessageIcon} />
                </View>
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
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: colors.primary,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  taps: {
    flexDirection: isArabic ? "row" : "row-reverse",
    width: "90%",
    backgroundColor: "#fff",
    marginHorizontal: "5%",
  },
  tap: {
    marginTop: 10,
    flex: 1,
  },
  tapText: {
    fontSize: 15,
    padding: 10,
    textAlign: "center",
    fontFamily: "Cairo",
  },
  blackLine: {
    height: 2,
    marginHorizontal: "10%",
    borderRadius: 2,
  },
  card: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    marginHorizontal: "5%",

    flexDirection: isArabic ? "row" : "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default Orders;
