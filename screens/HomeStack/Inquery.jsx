import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
  ActionSheetIOS,
  KeyboardAvoidingView,
} from "react-native";
import GlobalStyles from "../../hooks/sharedStyles";
import Header from "../../Components/Header";
import BackArrow from "../../Components/BackArrow";
import { colors, api, isArabic } from "../../Constants";
import { Input } from "react-native-elements";
import { Picker } from "@react-native-community/picker";

import * as DocumentPicker from "expo-document-picker";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
const Inquery = ({ route, navigation }) => {
  const { service, token } = route.params;
  const isPay = route.params ? route.params.isPay : null;
  const [fileType, setFileType] = useState("image/*");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const removeFromSelection = (uri) =>
    setFiles(files.filter((file) => file.uri !== uri));
  const handleSend = () => {
    setLoading(true);
    let form = new FormData();
    const data = {
      service_id: service.id,
      status_id: 1,
      is_canceled: 0,
      readed: 0,
      content: message,
      user_readed: 1,
    };
    const filesForMulter = files.map((file) => {
      const uriArr = file.uri.split(".");
      const extenstion = uriArr[uriArr.length - 1];
      return {
        uri: file.uri,
        name: file.name ? file.name : Date.now() + "." + extenstion,
        type: "*/*",
      };
    });

    for (const file of filesForMulter) {
      form.append("images", file);
    }
    form.append("data", JSON.stringify(data));

    axios
      .post(api.addOrder, form, {
        headers: {
          Authorization: "bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {

        isPay
          ? navigation.navigate("paymentOptions", {
              order_id: res.data.order_id,
              service_id: service.id,
              price: service.price
            })
          : navigation.navigate("orders", { status_id: 1 });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };
  const showActiveSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [
          "صور",
          "ملفات نصية",
          "مقطع صوتي",
          "مقطع فيديو",
          "ملفات",
          "إلغاء",
        ],
        cancelButtonIndex: 5,
      },
      (index) => {
        if (index === 0) setFileType("image/*");
        if (index === 1) setFileType("text/*");
        if (index === 2) setFileType("audio/*");
        if (index === 3) setFileType("video/*");
        if (index === 4) setFileType("application/*");
      }
    );
  };
  const handleUpload = async () => {
    setError("");
    if (fileType === "image/*") {
      if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== "granted") {
          alert("للأسف نحتاج لإذن الدخول على الملفات حتى تستطيع المتابعة");
          return;
        }
      }

      try {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });
        if (!result.cancelled) {
          setFiles(files.concat([result]));
        }
      } catch (E) {
        console.log(E);
      }
    } else {
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: fileType,
          multiple: true,
          copyToCacheDirectory: false,
        });
        if (result.type === "cancel") return;
        if (result.size > 4000000) {
          setError("حجم الملف أكبر من 4 ميجا");
          return;
        }
        setFiles(files.concat([result]));
      } catch (e) {
        console.log("e", e);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Header color={colors.primary} withText={true} />
      <ScrollView>
        <BackArrow onPress={() => navigation.goBack()} />
        <Text
          style={{
            ...GlobalStyles.whiteText,
            color: "#000",
            textAlign: isArabic ? "left" : "right",
          }}
        >
          {isPay ? "التفاصيل" : "الاستفسار"}
        </Text>
        <Input
          multiline
          numberOfLines={Platform.OS === "ios" ? null : 5}
          minHeight={Platform.OS === "ios" ? 20 * 5 : null}
          textAlignVertical="top"
          placeholder={isPay ? "تفاصيل الطلب" : "الأستفسار"}
          inputStyle={styles.input}
          inputContainerStyle={styles.inputContainer}
          value={message}
          onChangeText={(t) => setMessage(t)}
        />
        <View style={GlobalStyles.pickerContainerContainer}>
          <Text
            style={{
              ...GlobalStyles.whiteText,
              color: "#000",
              textAlign: "right",
            }}
          >
            ارفق ملف
          </Text>
          <View style={GlobalStyles.pickerContainer}>
            {Platform.OS === "ios" ? (
              <TouchableOpacity
                style={{
                  height: 50,
                  width: 90,
                  backgroundColor: "transparent",
                  justifyContent: "center",
                }}
                onPress={showActiveSheet}
              >
                <Text style={{ textAlign: "right" }}>
                  {fileType === "image/*"
                    ? "صور"
                    : fileType === "text/*"
                    ? "ملفات نصية"
                    : fileType === "audio/*"
                    ? "مقطع صوتي"
                    : fileType === "video/*"
                    ? "مقطع فيديو"
                    : fileType === "application/*"
                    ? "ملفات"
                    : "نوع الملف"}
                </Text>
              </TouchableOpacity>
            ) : (
              <Picker
                selectedValue={fileType}
                mode={Platform.OS === "ios" ? "dialog" : "dropdown"}
                style={{
                  height: 50,
                  width: 90,
                  backgroundColor: "transparent",
                }}
                onValueChange={(value) => setFileType(value)}
              >
                <Picker.Item label="صور" value="image/*" />
                <Picker.Item label="ملفات نصية" value="text/*" />
                <Picker.Item label="مقطع صوتي" value="audio/*" />
                <Picker.Item label="مقطع فيديو" value="video/*" />
                <Picker.Item label="ملفات" value="application/*" />
              </Picker>
            )}

            <AntDesign name="down" size={10} color="black" />
          </View>
        </View>
        <TouchableOpacity
          style={styles.filesBox}
          onPress={() => handleUpload()}
        >
          {files.length === 0 ? (
            <Text
              style={{ fontSize: 15, fontFamily: "Cairo", textAlign: "center" }}
            >
              قم بالضغط هنا لتقوم بتحديد الملفات، لا يسمح بملفات اكبر من 4 ميجا
            </Text>
          ) : (
            files.map((file, i) => {
              if (file.type === "image") {
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => removeFromSelection(file.uri)}
                  >
                    <FontAwesome5
                      name="times-circle"
                      size={24}
                      color="red"
                      style={styles.timesIcon}
                    />
                    <Image
                      source={{ uri: file.uri }}
                      style={{
                        height: 50,
                        width: 50,
                        marginHorizontal: 5,
                        borderRadius: 5,
                      }}
                    />
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity
                    key={i}
                    style={{
                      marginHorizontal: 5,

                      backgroundColor: "white",
                    }}
                    onPress={() => removeFromSelection(file.uri)}
                  >
                    <FontAwesome5
                      name="times-circle"
                      size={24}
                      color="red"
                      style={{ ...styles.timesIcon, top: -25, right: -5 }}
                    />
                    {file.name && (
                      <Text style={{ padding: 5 }}>
                        {file.name.substring(0, 6) +
                          "." +
                          file.name.split(".")[1]}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              }
            })
          )}
        </TouchableOpacity>
        <Text
          style={{
            color: "red",
            marginHorizontal: 30,
            marginVertical: 10,
            textAlign: "right",
          }}
        >
          {error}
        </Text>
        <View
          style={{
            flexDirection: isArabic ? "row" : "row-reverse",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              ...styles.button,
              backgroundColor: loading ? "gray" : colors.primary,
            }}
            disabled={loading}
            onPress={handleSend}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="large" />
            ) : (
              <AntDesign
                name="message1"
                size={24}
                color="#fff"
                style={{ marginRight: 5 }}
              />
            )}
            <Text style={GlobalStyles.whiteText}>إرسال</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome5
              name="times"
              size={24}
              style={{ marginRight: 5 }}
              color="#fff"
            />
            <Text style={GlobalStyles.whiteText}>تراجع</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.whiteContainer,
    paddingTop: 0,
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    textAlign: "right",
  },
  inputContainer: {
    borderBottomWidth: 0,
    marginHorizontal: 10,
    marginVertical: 5,
  },

  filesBox: {
    marginHorizontal: "5%",
    width: "90%",
    height: 100,
    marginVertical: 5,
    borderRadius: 10,
    borderColor: "gray",
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",

    flexDirection: isArabic ? "row" : "row-reverse",

    padding: 5,
  },
  timesIcon: {
    position: "absolute",
    right: 0,
    top: -10,
    zIndex: 2,
    backgroundColor: "white",
    borderRadius: 20,
  },
  button: {
    flexDirection: isArabic ? "row" : "row-reverse",

    backgroundColor: colors.primary,
    marginHorizontal: 5,
    borderRadius: 5,
    padding: 5,
    alignItems: "center",
    marginBottom: 10,
  },
});

export default Inquery;
