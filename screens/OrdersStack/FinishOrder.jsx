import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import GlobalStyles from "../../hooks/sharedStyles";
import AntDesign from "react-native-vector-icons/AntDesign";
import UserContext from "../../Contexts/User/UserContext";
import { Avatar, Rating, Input } from "react-native-elements";
import { api, colors, isArabic } from "../../Constants";
import axios from "axios";

const FinishOrder = ({ navigation, route }) => {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const order = route.params.order;
  const {
    userState: { name, image, token },
  } = useContext(UserContext);
  const finishOrder = () => {
    axios
      .post(
        api.addOrder + "/update",
        {
          id: order.id,
          query: {
            rating_number: rating,
            rating_text: message,
            status_id: 3,
          },
        },
        {
          headers: {
            Authorization: "bearer " + token,
          },
        }
      )
      .then((res) => navigation.navigate("orders", { status_id: 3 }))
      .catch((err) => console.log(err));
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={GlobalStyles.whiteContainer}
    >
      <View
        style={{
          flexDirection: isArabic ? "row" : "row-reverse",

          marginTop: 70,
          justifyContent: "center",
        }}
      >
        <AntDesign
          name="arrowright"
          size={24}
          style={{ position: "absolute", left: 20 }}
          onPress={() => navigation.goBack()}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          تقييم الطلب
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        <Avatar
          source={{ uri: api.uploads + "/users/" + image }}
          title={name.substring(0, 1)}
          rounded
          size="xlarge"
        />
        <Text style={{ fontSize: 25, fontWeight: "bold", marginTop: 10 }}>
          {name}
        </Text>
        <Text style={{ color: "gray", fontFamily: "Cairo", fontSize: 20 }}>
          رقم الطلب : {order.id}
        </Text>
        <Rating
          type="star"
          startingValue={0}
          fractions={10}
          onFinishRating={(n) => setRating(n)}
          count={5}
          showRating={false}
        />
        <Input
          multiline
          numberOfLines={Platform.OS === "ios" ? null : 4}
          minHeight={Platform.OS === "ios" ? 20 * 4 : null}
          textAlignVertical="top"
          placeholder="اوصف تجربة العمل معنا"
          inputStyle={styles.input}
          inputContainerStyle={styles.inputContainer}
          value={message}
          onChangeText={(t) => setMessage(t)}
        />
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 50,
            paddingVertical: 10,
            borderRadius: 10,
          }}
          onPress={() => finishOrder()}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            إتمام الطلب
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    textAlign: "right",
  },
  inputContainer: {
    borderBottomWidth: 0,
    margin: 25,
  },
});
export default FinishOrder;
