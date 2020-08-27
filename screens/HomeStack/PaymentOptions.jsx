import React, { useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import GlobalStyles from "../../hooks/sharedStyles";
import { api } from "../../Constants";
import axios from "axios";
import UserContext from "../../Contexts/User/UserContext";
import BackArrow from "../../Components/BackArrow";
import { Alert } from "react-native";
const PaymentOptions = ({ route, navigation }) => {
  const order_id = route.params.order_id;

  const {
    userState: { token },
  } = useContext(UserContext);
  const handleBuy = () => {
    if (!order_id) return;
    axios
      .post(
        api.addOrder + "/update",
        { id: order_id, query: { status_id: 2 } },
        {
          headers: {
            Authorization: "bearer " + token,
          },
        }
      )
      .then((res) => {
        Alert.alert("", "تم الدفع");
        navigation.navigate("orders", { status_id: 2 });
      })
      .catch((err) => console.log(err));
  };
  return (
    <View style={GlobalStyles.whiteContainer}>
      <BackArrow onPress={() => navigation.goBack()} />
      <View
        style={{
          marginHorizontal: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button title="إتمام الشراء" onPress={() => handleBuy()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default PaymentOptions;
