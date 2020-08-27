import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import GlobalStyles from "../../hooks/sharedStyles";
import axios from "axios";
import Header from "../../Components/Header";
import { api, isArabic } from "../../Constants";
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
      <Header />
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
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        services?.map((service) => {
          return (
            <TouchableOpacity
              style={GlobalStyles.button}
              key={service.id}
              activeOpacity={0.6}
              onPress={() => navigation.navigate("service", { service })}
            >
              <Text
                style={{ ...GlobalStyles.blackCenter, fontWeight: "normal" }}
              >
                {service.title}
              </Text>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.blueContainer,
    paddingTop: 0,
  },
});

export default Dep;
