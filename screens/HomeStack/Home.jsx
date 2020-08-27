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
        <Text style={styles.cardText}>{title}</Text>
        <Image style={styles.cardImage} source={img} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text
        style={{
          ...GlobalStyles.whiteText,
          textAlign: isArabic ? "left" : "right",
        }}
      >
        الرئيسية
      </Text>
      <ScrollView style={styles.scroll}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <>
            {deps
              ?.filter((dep) => dep.is_active === 1)
              .sort((a, b) => a.order - b.order)
              .map((dep, i) => (
                <Card dep={dep} key={i} />
              ))}

            <Card myId={1} />
            <Card myId={2} />
            <Card myId={3} />
          </>
        )}
      </ScrollView>
    </View>
  );
};
const deviceWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.blueContainer,
    paddingTop: 0,
  },
  scroll: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    paddingTop: 10,
  },
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
    fontSize: deviceWidth < 420 ? 17 : 20,
    fontFamily: "Cairo",
  },
  cardImage: {
    width: "10%",
    height: "90%",
  },
});

export default Home;
