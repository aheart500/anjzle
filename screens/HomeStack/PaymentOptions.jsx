import React, { useContext, useState, useRef } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Button } from "react-native-elements";
import GlobalStyles from "../../hooks/sharedStyles";
import { api } from "../../Constants";
import axios from "axios";
import UserContext from "../../Contexts/User/UserContext";
import BackArrow from "../../Components/BackArrow";
import { Alert } from "react-native";
import { WebView } from "react-native-webview";
const HTML_SOURCE = (data_brands, checkoutId) => `
<html>
<head>
<style>
.wpwl-label-cardNumber, .wpwl-label-cardHolder, .wpwl-label-expiry, .wpwl-label-cvv, input::placeholder{
  text-align: right
}
.wpwl-form{
  max-width: 90%;
  font-size: 2rem
}
</style>
<script>
    var wpwlOptions = {
        locale: "ar",
        iframeStyles: {
          'card-number-placeholder': {
              'text-align': 'right',
          },
              'cvv-placeholder': {
              'text-align': 'right',
          }
    }
 
  }</script>
</script>
<script async src="https://oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}"></script>
<title>Anjzle</title>
</head>
<body>
<form class="paymentWidgets" action="https://anjzle.com/" data-brands="${data_brands}"></form>
</body>
</html>
`;

const PaymentOptions = ({ route, navigation }) => {
  const webNavRef = useRef();
  const { order_id, service_id, price } = route.params;
  const [loading, setLoading] = useState(false);
  const [webViewState, setWebViewState] = useState({
    shown: false,
  });
  const {
    userState: { token },
  } = useContext(UserContext);
  const axiosConfig = {
    headers: {
      Authorization: "bearer " + token,
    },
  };
  const payment_finish = (id) => {
    axios
      .post(
        api.addOrder + "/update",
        { id: order_id, query: { status_id: 2 } },
        axiosConfig
      )
      .then((res) => {
        // Alert.alert("", "تم الدفع بنجاح - كود المعاملة: " + id);
        setLoading(false);
        navigation.navigate("orders", { status_id: 2 });
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  const handleWebViewNav = (navState) => {
    const { url } = navState;
    // if (url.includes("anjzle.com/result")) {
      if (url.includes("anjzle.com")) {
      webNavRef.current.stopLoading();
      const pay = webViewState.data_brands === "VISA MASTER" ? "VISA" : "MADA";
      const pload = {
        checkoutId: webViewState.checkoutId,
        order_id,
        service_id,
        amount: price,
        payment_method:
          webViewState.data_brands === "VISA MASTER" ? "visa_master" : "mada",
      };
      axios
        /*  .get(
          "https://anjzle.com/result2/" + pay + "/" + webViewState.checkoutId,
          pload,
          // axiosConfig
          {}
        ) */
        .post(api.payments + "/check", pload, axiosConfig)
      /* axios
        .get(
          "https://anjzle.com/result2/" + pay + "/" + webViewState.checkoutId
        ) */
        .then(({ data }) => {
          // webNavRef.current.stopLoading();
          setWebViewState({ shown: false });
          console.log("Valabji TEST");
          console.log(data);
          if (
            !data.result.description.includes("success") &&
            !data.result.code.includes("000.000.000")&&
            !data.result.code.includes("200.300.404")
          ) {
            // if (data.includes("Fail") && !data.includes("Code")) {
            Alert.alert(
              "",
              "فشل الدفع، برجاء التحقق من بيانات الدفع ووجود رصيد كافي وحاول مجدداً"
            );
            Alert.alert("", data.result.description);
            /* Alert.alert("", data);
            setTimeout(() => {
              // Alert.alert("", JSON.stringify(pload));
            }, 1000);
            setTimeout(() => {
              // Alert.alert("", JSON.stringify(data));
            }, 2000); */
            setLoading(false);
          } else {
            payment_finish(data.id);
          }
        })
        .catch((e) => console.log(e));
    }
  };
  const handleBuy = (brands) => {
    if (!order_id) return;
    setLoading(true);
    /*  axios
      // .post(
      .get(
        // api.payments + "/pay",
        "https://anjzle.com/send_cardname2/" + brands === "visa_master"
          ? "VISA"
          : "MADA" + "/" + service_id + "/" + price + "",
        { amount: price, payment_method: brands },
        // axiosConfig
        {

        }
      ) */
    const brand = brands === "visa_master" ? "VISA" : "MADA";
    const url =
      "https://anjzle.com/send_cardname2/" +
      brand +
      "/" +
      service_id +
      "/" +
      price;
    // axios
      // .get(url)
      axios
      .post(
        api.payments + "/pay",
        { amount: price, payment_method: brands },
        axiosConfig
      ) 
      .then(({ data }) => {
        setWebViewState({
          shown: true,
          checkoutId: data.id,
          data_brands: brands === "visa_master" ? "VISA MASTER" : "MADA",
        });
        // Alert.alert("", JSON.stringify(data));
        // console.log(url);
      })
      .catch((err) => {
        console.log(err);
        // Alert.alert("Error", url);
      });
  };
  const brand = webViewState.data_brands === "visa_master" ? "VISA" : "MADA";

  return (
    <View style={GlobalStyles.whiteContainer}>
      <BackArrow onPress={() => navigation.goBack()} />
      {webViewState.shown ? (
        <View style={styles.webView}>
          <WebView
            ref={webNavRef}
            source={{
              html: HTML_SOURCE(
                webViewState.data_brands,
                webViewState.checkoutId
              ),
            }}
            /* source={{
              uri:
                "https://anjzle.com/send_cardname/" +
                brand +
                "/" +
                service_id +
                "/" +
                price,
            }} */
            onNavigationStateChange={handleWebViewNav}
            originWhitelist={["*"]}
            style={{ marginTop: 20 }}
            style={{ width: Dimensions.get("window").width }}
          />
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <Button
            containerStyle={styles.button}
            type="solid"
            title="الدفع بالفيزا أو الماستر كارد"
            disabled={loading}
            onPress={() => handleBuy("visa_master")}
          />
          <Button
            containerStyle={styles.button}
            type="solid"
            title="الدفع ب MADA"
            disabled={loading}
            onPress={() => handleBuy("mada")}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  webView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  buttonContainer: {
    marginHorizontal: 10,
  },
  button: {
    marginVertical: 2,
  },
});

export default PaymentOptions;
