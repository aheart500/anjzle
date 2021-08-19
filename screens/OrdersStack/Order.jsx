import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as Progress from "react-native-progress";

import GlobalStyles from "../../hooks/sharedStyles";
import { Avatar, Input, Rating } from "react-native-elements";
import { api, colors, isArabic } from "../../Constants";
import axios from "axios";
import { Ionicons, AntDesign, Feather, FontAwesome5 } from "@expo/vector-icons";
import Constants from "expo-constants";
import UserContext from "../../Contexts/User/UserContext";
import { Alert } from "react-native";
const Order = ({ route, navigation }) => {
  const { order } = route.params;
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [lod, setLod] = useState(0.0);

  const flatRef = useRef();

  const {
    userState: { token, id: userId, image: userImage, name },
  } = useContext(UserContext);

  const uploadtImage = async () => {
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
  };
  let axiosCancel;
  let CancelToken = axios.CancelToken;
  const uploadFile = async () => {
    setError("");
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: false,
      });
      if (result.type === "cancel") return;
      /* if (result.size > 4000000) {
        setError("حجم الملف أكبر من 4 ميجا");
        return;
      } */
      setFiles(files.concat([result]));
    } catch (e) {
      console.log("e", e);
    }
  };
  const removeFromSelection = (uri) =>
    setFiles(files.filter((file) => file.uri !== uri));
  const sendMessage = () => {
    setMessageLoading(true);
    let form = new FormData();
    const data = {
      readed: 0,
      content: message,
      service_id: order.service_id,
      order_id: order.id,
      receiver_id: order.user_id,
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
      .post(api.messages, form, {
        headers: {
          Authorization: "bearer " + token,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (r) => {
          console.log(JSON.stringify(r));
          setLod(Math.round((r.loaded * 1000) / r.total));
          console.log(lod);
        },
      })
      .then((res) => {
        setMessage("");
        setFiles([]);

        setMsgs(msgs.concat([res.data]));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setMessageLoading(false);
      });
  };

  const getMsgs = () => {
    setLoading(true);
    axios
      .get(`${api.messages}/${order.id}`, {
        headers: {
          Authorization: "bearer " + token,
        },
        cancelToken: new CancelToken((c) => {
          axiosCancel = c;
        }),
      })
      .then((res) => {
        if (typeof res.data === "object") {
          setMsgs(res.data.sort((a, b) => a.id - b.id));
        }
      })
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (msgs.length === 0) getMsgs();

    return () => {
      if (axiosCancel !== undefined) {
        axiosCancel();
      }
    };
  }, []);

  const userImageUri = api.uploads + "/users/";
  const UserAvatar = useCallback(
    () => (
      <Avatar
        source={{ uri: userImageUri + userImage }}
        title={name.substr(0, 1)}
        size="medium"
        rounded
      />
    ),
    []
  );
  const ChattarAvatar = useCallback(({ name, image }) => {
    return (
      <Avatar
        source={{ uri: userImageUri + image }}
        title={name.substr(0, 1)}
        size="medium"
        rounded
      />
    );
  }, []);
  const saveFile = async (uri) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("Download", asset, false);
      Alert.alert("", "تم الحفظ");
    }
  };

  const formatDate = useCallback((date) => {
    let dataFormatted = date.split("T");
    return dataFormatted[0] + " / " + dataFormatted[1].split(".")[0];
  }, []);

  const ITEM = useCallback(({ item }) => {
    return (
      <View style={styles.item}>
        <View style={styles.message}>
          {item.sender_id === userId ? (
            <UserAvatar />
          ) : (
            <ChattarAvatar name={item.sender_name} image={item.sender_image} />
          )}
          <View>
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Cairo",
                marginHorizontal: 15,
                textAlign: isArabic ? "left" : "right",
              }}
            >
              {item.sender_name}
            </Text>
            <View style={{ flexDirection: isArabic ? "row" : "row-reverse" }}>
              <View style={styles.littleIcons}>
                <AntDesign name="clockcircle" style={{ marginHorizontal: 5 }} />
                <Text>{formatDate(item.created_at)}</Text>
              </View>
            </View>
          </View>
        </View>
        <Text
          style={{
            margin: 20,
            textAlign: /[\u0600-\u06FF]/.test(item.content)
              ? isArabic
                ? "left"
                : "right"
              : isArabic
              ? "right"
              : "left",
          }}
        >
          {item.content}
        </Text>
        {item.files.length > 0 && (
          <View
            style={{
              marginHorizontal: 10,
              backgroundColor: "lightgray",
              borderRadius: 5,
              padding: 10,
            }}
          >
            {item.files.map((file, i) => (
              <TouchableOpacity
                onPress={() => {
                  Alert.alert("", "هل تريد تحميل هذا الملف؟", [
                    {
                      text: "نعم",
                      onPress: () => {
                        FileSystem.downloadAsync(
                          api.uploads + "/msgs/" + file.name,
                          FileSystem.documentDirectory + file.name
                        )
                          .then(({ uri }) => {
                            saveFile(uri);
                          })
                          .catch((err) => console.log(err));
                      },
                    },
                    { text: "لا" },
                  ]);
                }}
                key={i}
                style={{ marginVertical: 2 }}
              >
                <Text style={{ color: colors.primary }}>{file.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  }, []);

  const cancelOrder = () => {
    axios
      .post(
        api.addOrder + "/update",
        { id: order.id, query: { status_id: 4 } },
        {
          headers: {
            Authorization: "bearer " + token,
          },
        }
      )
      .then((res) => navigation.navigate("orders", { status_id: 4 }))
      .catch((err) => console.log(err));
  };

  const Header = useCallback(() => {
    const data = {
      content: order.content,
      created_at: order.order_date,
      files: order.files,
      sender_id: order.user_id,
      sender_name: order.user_name,
      sender_image: order.user_image,
    };
    return (
      <View>
        <View
          style={{
            flexDirection: isArabic ? "row" : "row-reverse",
            margin: 10,
          }}
        >
          <Avatar
            source={{ uri: api.uploads + "/deps/" + order.dep_image }}
            size="medium"
            rounded
          />
          <View>
            <View style={{ alignItems: isArabic ? "flex-start" : "flex-end" }}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Cairo",
                  marginHorizontal: 15,
                }}
              >
                {order.service_title}
              </Text>
              {order.status_id === 3 && (
                <Rating
                  readonly
                  imageSize={20}
                  style={{
                    marginHorizontal: 10,
                  }}
                  startingValue={order.rating_number}
                />
              )}
            </View>
            <View style={{ flexDirection: isArabic ? "row" : "row-reverse" }}>
              <View style={styles.littleIcons}>
                <Ionicons name="md-person" style={{ marginHorizontal: 5 }} />
                <Text>{order.user_name}</Text>
              </View>
              <View style={styles.littleIcons}>
                <AntDesign name="clockcircle" style={{ marginHorizontal: 5 }} />
                <Text>{formatDate(order.order_date)}</Text>
              </View>
            </View>
            <View style={{ flexDirection: isArabic ? "row" : "row-reverse" }}>
              {order.status_id === 2 ? (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("finishOrder", { order });
                    }}
                    disabled={userId === 1}
                    style={{
                      ...styles.headerButton,
                      backgroundColor:
                        userId === 1 ? "lightgray" : colors.primary,
                    }}
                  >
                    <Text style={styles.headerButtonText}>إتمام الطلب</Text>
                  </TouchableOpacity>
                  {userId === 1 ? (
                    <TouchableOpacity
                      style={{
                        ...styles.headerButton,
                        backgroundColor: "#eb4034",
                      }}
                      onPress={() => {
                        Alert.alert("", "هل تريد إلغاء الطلب؟", [
                          { text: "نعم", onPress: () => cancelOrder() },
                          { text: "لا" },
                        ]);
                      }}
                    >
                      <Text style={styles.headerButtonText}>إلغاء</Text>
                    </TouchableOpacity>
                  ) : null}
                </>
              ) : order.status_id === 1 && userId !== 1 ? (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("paymentOptions", {
                        order_id: order.id,
                        service_id: order.service_id,
                        price: order.service_price,
                      });
                    }}
                    style={styles.headerButton}
                  >
                    <Text style={styles.headerButtonText}>شراء</Text>
                  </TouchableOpacity>
                </>
              ) : null}
              {order.status_id === 3 && (
                <Text style={{ textAlign: isArabic ? "left" : "right" }}>
                  التقييم: {order.rating_text}
                </Text>
              )}
            </View>
          </View>
        </View>
        <ITEM item={data} />
      </View>
    );
  }, []);

  const Empty = () => {
    return (
      <Text
        style={{
          fontFamily: "Cairo",
          fontSize: 30,
          textAlign: "center",
          marginTop: 20,
        }}
      >
        لا توجد رسائل
      </Text>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ ...GlobalStyles.whiteContainer }}
    >
      <FlatList
        ListHeaderComponent={<Header />}
        ListEmptyComponent={<Empty />}
        refreshing={loading}
        onRefresh={() => getMsgs()}
        data={msgs}
        ref={flatRef}
        keyExtractor={(item, i) => `${item.id}`}
        renderItem={({ item }) => {
          return <ITEM item={item} />;
        }}
      />
      <View>
        <View style={{ flexDirection: isArabic ? "row" : "row-reverse" }}>
          {files.map((file, i) => {
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
          })}
        </View>
        <Input
          multiline
          numberOfLines={Platform.OS === "ios" ? null : 4}
          minHeight={Platform.OS === "ios" ? 20 * 4 : null}
          textAlignVertical="top"
          placeholder="الرسالة"
          inputStyle={styles.input}
          inputContainerStyle={styles.inputContainer}
          value={message}
          onChangeText={(t) => setMessage(t)}
          errorMessage={error}
        />
        <View
          style={{
            width: "100%",
            marginBottom: 20,
            display: messageLoading ? "flex" : "none",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Progress.Bar progress={lod / 1000} width={200} height={16} />
          <Text style={{ marginLeft: 10 }}>{lod / 10}%</Text>
        </View>
        <ScrollView
          contentContainerStyle={{
            flexDirection: isArabic ? "row" : "row-reverse",

            justifyContent: "center",
            alignItems: "center",
          }}
          style={{
            marginHorizontal: "5%",
          }}
          horizontal={true}
        >
          <TouchableOpacity
            style={{
              ...styles.button,
              backgroundColor: messageLoading ? "gray" : colors.primary,
            }}
            disabled={messageLoading}
            onPress={() => sendMessage()}
          >
            {messageLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Feather
                name="navigation"
                size={20}
                color="#fff"
                style={{ marginRight: 5 }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.button,
              backgroundColor: colors.primary,
            }}
            onPress={() => uploadtImage()}
          >
            <AntDesign
              name="picture"
              size={20}
              color="#fff"
              style={{ marginRight: 5 }}
            />

            <Text style={styles.buttonText}>إرسال صورة</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.button,
              backgroundColor: colors.primary,
            }}
            onPress={() => uploadFile()}
          >
            <AntDesign
              name="filetext1"
              size={20}
              color="#fff"
              style={{ marginRight: 5 }}
            />

            <Text style={styles.buttonText}>إرسال ملف</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.button,
              backgroundColor: colors.primary,
            }}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="arrowleft" color="#fff" size={24} />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  littleIcons: {
    flexDirection: isArabic ? "row" : "row-reverse",

    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
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
  button: {
    flexDirection: isArabic ? "row" : "row-reverse",

    backgroundColor: colors.primary,
    marginHorizontal: 5,
    borderRadius: 5,
    padding: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { fontSize: 15, color: "#fff", marginHorizontal: 10 },
  message: {
    flexDirection: isArabic ? "row" : "row-reverse",

    margin: 10,
  },
  item: {
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    margin: 5,
  },
  messageDetails: {},
  timesIcon: {
    position: "absolute",
    right: 0,
    top: -10,
    zIndex: 2,
    backgroundColor: "white",
    borderRadius: 20,
  },
  headerButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 5,
    margin: 5,
    borderRadius: 10,
  },
  headerButtonText: {
    color: "#fff",
    fontSize: 20,
  },
});
export default Order;
