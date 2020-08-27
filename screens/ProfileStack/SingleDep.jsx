import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../Contexts/User/UserContext";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import GlobalStyles from "../../hooks/sharedStyles";
import axios from "axios";
import { api, colors, isArabic } from "../../Constants";
import AntDesign from "react-native-vector-icons/AntDesign";

const SingleDep = ({ route, navigation }) => {
  const dep = route.params.dep;
  const {
    userState: { token },
  } = useContext(UserContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleDelete = () => {
    Alert.alert("", "هل انت متأكد أنك تريد حذف القسم؟", [
      {
        text: "نعم",
        onPress: () => deleteDep(),
      },
      {
        text: "لا",
      },
    ]);
  };
  const deleteDep = () => {
    axios
      .delete(api.getDeps + `/${dep.id}`, {
        headers: {
          Authorization: "bearer " + token,
        },
      })
      .then((res) => {
        if (res.data === "parent") {
          Alert.alert("", "لا يمكن حذف القسم لأن هناك خدمات محفوظة بداخله");
          return;
        }
        Alert.alert("", "تم حذف القسم");
        navigation.navigate("deps");
      })
      .catch((err) => console.log(err));
  };
  const getServices = () => {
    setLoading(true);
    axios
      .get(api.getServices(dep.id), {
        headers: {
          Authorization: "bearer " + token,
        },
      })
      .then((res) => setServices(res.data.sort((a, b) => a.order - b.order)))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };
  const handlePress = (service) => {
    navigation.navigate("singleService", { service, dep });
  };
  useEffect(() => {
    getServices();
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getServices();
    });
    return unsubscribe;
  }, [navigation]);

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
          الخدمات
        </Text>
      </View>

      <FlatList
        data={services}
        keyExtractor={(service) => `${service.id}`}
        refreshing={loading}
        onRefresh={() => getServices()}
        ListFooterComponent={
          <View>
            <View
              style={{
                flexDirection: isArabic ? "row" : "row-reverse",

                justifyContent: "center",
                alignItems: "center",
                marginVertical: 20,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 50,
                  paddingVertical: 5,
                  borderRadius: 10,
                }}
                onPress={() => navigation.navigate("addService", { dep })}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  إضافة خدمة
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.headerText}>بيانات القسم</Text>
              <View style={styles.row}>
                <Text style={styles.text}>عنوان القسم</Text>
                <Text style={styles.text}>{dep.title}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.text}>وصف القسم</Text>
                <Text style={styles.text}>{dep.desc}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.text}> حالة القسم</Text>
                <Text style={styles.text}>
                  {dep.is_active ? "فعال" : "غير فعال"}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.text}> ترتيب ظهور القسم</Text>
                <Text style={styles.text}>{dep.order}</Text>
              </View>
            </View>
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("addDep", { dep })}
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
        }
        renderItem={({ item: service }) => {
          return (
            <View>
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.5}
                onPress={() => handlePress(service)}
              >
                <Text style={styles.cardText}>{service.title}</Text>
                <Image
                  style={styles.cardImage}
                  source={{ uri: api.uploads + "/services/" + service.image }}
                />
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "90%",
    height: 50,
    marginHorizontal: "5%",
    marginVertical: 4,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: isArabic ? "row" : "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 2,
  },
  cardText: {
    fontSize: 20,
    fontFamily: "Cairo",
  },
  cardImage: {
    width: "10%",
    height: "90%",
  },
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
export default SingleDep;
