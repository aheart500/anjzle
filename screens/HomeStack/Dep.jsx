import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import GlobalStyles from "../../hooks/sharedStyles";
import axios from "axios";
import Header from "../../Components/Header";
import { api, colors, images, isArabic } from "../../Constants";
import BackArrow from "../../Components/BackArrow";
const Dep = ({ route, navigation }) => {
  const dep = route.params.dep;
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(api.getServices(dep.id))
      .then((result) =>
        setServices(
          result.data
            .filter((service) => service.is_active)
            .sort((a, b) => a.order - b.order)
        )
      )
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: isArabic ? "row" : "row-reverse",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 50,
          paddingBottom: 20,
          backgroundColor: colors.primary,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          marginBottom: 20,
        }}
      >
        <BackArrow
          style={{ color: "#fff" }}
          onPress={() => navigation.goBack()}
        />
        <Text
          style={{
            ...GlobalStyles.whiteText,
            textAlign: isArabic ? "left" : "right",
          }}
        >
          {dep.title}
        </Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        services?.map((service) => {
          return (
            <TouchableOpacity
              style={[styles.card]}
              key={service.id}
              activeOpacity={0.6}
              onPress={() => navigation.navigate("service", { service })}
            >
              <Image
                source={{
                  uri: api.uploads + "/services/" + service.image,
                }}
                style={{
                  width: "30%",
                  height: "90%",
                  marginHorizontal: 10,
                }}
              />
              <View
                style={{
                  width: "65%",
                }}
              >
                <Text
                  style={{
                    color: "#7aa2fd",
                    fontFamily: "Cairo",
                    fontSize: 20,
                    textAlign: "right",
                  }}
                >
                  {service.title ? service.title : ""}
                </Text>
                {service.desc && (
                  <Text
                    style={{
                      fontFamily: "Cairo",
                      textAlign: "right",
                    }}
                  >
                    {service.desc}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.whiteContainer,
    paddingTop: 0,
  },
  card: {
    width: "90%",
    marginHorizontal: "5%",
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    display: "flex",
    flexDirection: isArabic ? "row" : "row-reverse",
    height: 100,
    alignItems: "center",
    marginVertical: 5,
    padding: 5,
  },
});

export default Dep;
