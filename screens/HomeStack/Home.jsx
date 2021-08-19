import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import GlobalStyles from "../../hooks/sharedStyles";
import Header from "../../Components/Header";
import axios from "axios";
import { api, images, colors, isArabic } from "../../Constants";

const Home = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [deps, setDeps] = useState(deps);

  const getData = () => {
    axios
      .get(api.getDeps)
      .then((res) => setDeps(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", getData);
    return unsubscribe;
  }, [navigation]);
  const Card = ({ dep, myId }) => {
    let img;
    const isDep = typeof dep?.created_at !== "undefined";
    if (isDep) {
      img = {
        uri: api.uploads + "/deps/" + dep.image,
      };
    } else {
      img =
        myId === 1 ? images.Privacy : myId === 2 ? images.Who : images.Contact;
    }
    let title = isDep
      ? dep.title
      : myId === 1
      ? "الشروط والخصوصية"
      : myId === 2
      ? "من نحن"
      : "اتصل بنا";
    const handlePress = () => {
      if (isDep) {
        navigation.navigate("dep", { dep });
      } else {
        switch (myId) {
          case 1:
            navigation.navigate("privacy");
            break;
          case 2:
            navigation.navigate("who");
            break;
          case 3:
            navigation.navigate("contact");
            break;
        }
      }
    };
    return (
      <TouchableOpacity
        style={{ ...styles.card, marginBottom: myId === 3 ? 50 : 5 }}
        activeOpacity={0.5}
        onPress={handlePress}
      >
        <Image style={styles.cardImage} source={img} />
        <Text style={styles.cardText}>{title}</Text>
      </TouchableOpacity>
      
    );
  };

  return (
    <View style={styles.container}>
      <Header
        searchIconPress={() =>
          navigation.navigate("orders", {
            searching: true,
          })
        }
      />

      <ScrollView style={styles.scroll}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <View style={styles.cardsContianer}>
            {deps
              ?.filter((dep) => dep.is_active === 1)
              .sort((a, b) => a.order - b.order)
              .map((dep, i) => (
                <Card dep={dep} key={i} />
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};
const deviceWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.whiteContainer,
    paddingTop: 0,
  },
  scroll: {
    backgroundColor: "#fbfdff",
    borderTopLeftRadius: 20,
    paddingTop: 10,
  },
  cardsContianer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: "5%",
  },
  card: {
    width: (deviceWidth * 50) / 100 - 35,
    height: 200,
    backgroundColor: "white",
    marginVertical: 4,
    marginHorizontal: 5,
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
    borderRadius: 10,
  },
  cardText: {
    fontSize: deviceWidth < 420 ? 17 : 20,
    fontFamily: "Cairo",
    textAlign: "center",
  },
  cardImage: {
    width: "90%",
    height: "50%",
  },
});

export default Home;
