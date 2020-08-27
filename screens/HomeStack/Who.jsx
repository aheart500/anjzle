import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import GlobalStyles from "../../hooks/sharedStyles";
import Header from "../../Components/Header";
import { who } from "../../SiteData";
import { isArabic } from "../../Constants";
const Privacy = () => {
  return (
    <View style={styles.container}>
      <Header />
      <Text
        style={{
          ...GlobalStyles.whiteText,
          textAlign: isArabic ? "left" : "right",
        }}
      >
        {" "}
        من نحن؟
      </Text>
      <ScrollView style={styles.scroll}>
        <Text
          style={{
            marginHorizontal: 10,
            fontSize: 20,
            textAlign: isArabic ? "left" : "right",
          }}
        >
          {who}
        </Text>
      </ScrollView>
    </View>
  );
};

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
});

export default Privacy;
