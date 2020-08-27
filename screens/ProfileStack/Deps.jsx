import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../Contexts/User/UserContext";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import GlobalStyles from "../../hooks/sharedStyles";
import axios from "axios";
import { api, colors, isArabic } from "../../Constants";
import AntDesign from "react-native-vector-icons/AntDesign";

const Deps = ({ navigation }) => {
  const {
    userState: { token },
  } = useContext(UserContext);
  const [deps, setDeps] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDeps = () => {
    setLoading(true);
    axios
      .get(api.getDeps, {
        headers: {
          Authorization: "bearer " + token,
        },
      })
      .then((res) => setDeps(res.data.sort((a, b) => a.order - b.order)))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };
  const handlePress = (dep) => {
    navigation.navigate("singleDep", { dep });
  };
  useEffect(() => {
    getDeps();
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getDeps();
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
          الأقسام
        </Text>
      </View>

      <FlatList
        data={deps}
        keyExtractor={(dep) => `${dep.id}`}
        refreshing={loading}
        onRefresh={() => getDeps()}
        ListFooterComponent={
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
              onPress={() => navigation.navigate("addDep")}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                إضافة قسم
              </Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item: dep }) => {
          return (
            <View>
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.5}
                onPress={() => handlePress(dep)}
              >
                <Text style={styles.cardText}>{dep.title}</Text>
                <Image
                  style={styles.cardImage}
                  source={{ uri: api.uploads + "/deps/" + dep.image }}
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
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
  cardText: {
    fontSize: 20,
    fontFamily: "Cairo",
  },
  cardImage: {
    width: "10%",
    height: "90%",
  },
});
export default Deps;
