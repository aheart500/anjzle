import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import GlobalStyles from "../../hooks/sharedStyles";
import Header from "../../Components/Header";
import { privacy } from "../../SiteData";
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
        الشروط والخصوصية
      </Text>
      <ScrollView style={styles.scroll}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold",
            marginHorizontal: 30,
            marginVertical: 10,
          }}
        >
          يعمل التطبيق كمتجر الكتروني مختص في مجال الخدمات الدراسية في المملكة
          العربية السعودية وتتعدد الخدمات التي يقدمها ما بين تقديم البحوث
          الدراسية مروراً بالترجمة والتقارير والمقالات
        </Text>
        <Text
          style={{
            marginHorizontal: 10,
            fontSize: 15,
            textAlign: isArabic ? "left" : "right",
            color: "#000",
            fontWeight: "bold",
          }}
        >
          {privacy}
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
