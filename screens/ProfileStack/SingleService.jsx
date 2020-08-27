import React, { useContext } from "react";
import UserContext from "../../Contexts/User/UserContext";

import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import GlobalStyles from "../../hooks/sharedStyles";
import { colors, api, isArabic } from "../../Constants";
import axios from "axios";

import AntDesign from "react-native-vector-icons/AntDesign";
const SingleService = ({ route, navigation }) => {
  const {
    userState: { token },
  } = useContext(UserContext);
  const service = route.params.service;
  const handleDelete = () => {
    Alert.alert("", "هل انت متأكد أنك تريد حذف الخدمة", [
      {
        text: "نعم",
        onPress: () => deleteService(),
      },
      {
        text: "لا",
      },
    ]);
  };
  const deleteService = () => {
    axios
      .delete(api.services + `/${service.id}`, {
        headers: {
          Authorization: "bearer " + token,
        },
      })
      .then((res) => {
        if (res.data === "parent") {
          Alert.alert("", "لا يمكن حذف الخدمة لأن هناك مستخدمين مسجلين عليها");
          return;
        }
        Alert.alert("", "تم حذف الخدمة");
        navigation.goBack();
      })
      .catch((err) => console.log(err));
  };
  return (
    <View style={GlobalStyles.whiteContainer}>
      <View
        style={{
          flexDirection: isArabic ? "row" : "row-reverse",
          marginTop: 50,
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
            fontSize: 30,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          الخدمة
        </Text>
      </View>
      <View>
        <Text style={styles.headerText}>بيانات الخدمة</Text>
        <View style={styles.row}>
          <Text style={styles.text}>عنوان الخدمة</Text>
          <Text style={styles.text}>{service.title}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>وصف الخدمة</Text>
          <Text style={styles.text}>{service.desc}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>سعر الخدمة</Text>
          <Text style={styles.text}>{service.price}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}> حالة الخدمة</Text>
          <Text style={styles.text}>
            {service.is_active ? "فعالة" : "غير فعالة"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}> ترتيب ظهور الخدمة</Text>
          <Text style={styles.text}>{service.order}</Text>
        </View>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("addService", {
              service,
              dep: route.params.dep,
            })
          }
        >
          <Text style={styles.buttonText}>تعديل</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.button, backgroundColor: "#f54242" }}
          onPress={() => handleDelete()}
        >
          <Text style={styles.buttonText}>حذف</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: isArabic ? "row" : "row-reverse",

    marginHorizontal: 20,
    marginVertical: 5,
  },
  buttons: {
    flexDirection: isArabic ? "row" : "row-reverse",

    marginHorizontal: "10%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 10,
    textAlign: isArabic ? "left" : "right",
  },
  text: {
    fontSize: 20,
    fontFamily: "Cairo",
    flex: 1,
    textAlign: isArabic ? "left" : "right",
    marginHorizontal: 2,
  },
});
export default SingleService;
