import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import GlobalStyles from "../../hooks/sharedStyles";
import useInput from "../../hooks/useInput";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { Avatar, Input } from "react-native-elements";
import Constants from "expo-constants";
import { api, colors, isArabic } from "../../Constants";
import AntDesign from "react-native-vector-icons/AntDesign";
import axios from "axios";
import UserContext from "../../Contexts/User/UserContext";
const AddDep = ({ navigation, route }) => {
  const editData = route.params ? route.params.dep : null;
  const [loading, setLoading] = useState(false);
  const {
    userState: { token },
  } = useContext(UserContext);
  const title = useInput(editData ? editData.title : "");
  const desc = useInput(editData ? editData.desc : "");
  const image = useInput(editData ? editData.image : "");
  const order = useInput(editData ? `${editData.order}` : "");
  const isActive = useInput(editData ? editData.is_active === 1 : true);
  const [error, setError] = useState("");

  const inputProps = (custom) => {
    return {
      labelStyle: styles.label,
      inputContainerStyle: styles.inputContainer,
      containerStyle: styles.wholeContainer,
      inputStyle: {
        ...styles.input,
        ...custom,
      },
    };
  };
  const handleSave = () => {
    setError("");
    setLoading(true);
    if (title.value === "" || desc.value === "" || order.value === "") {
      setError("يجب التأكد من ملأ جميع الحقول");
      setLoading(false);
      return;
    }
    if (isNaN(order.value)) {
      setError("الرجاء إدخال رقم في خانة ترتيب القسم");
      setLoading(false);
      return;
    }
    let form = new FormData();
    if (image.value.uri) {
      const uriArr = image.value.uri.split(".");
      const extenstion = uriArr[uriArr.length - 1];
      const file = {
        uri: image.value.uri,
        name: Date.now() + "." + extenstion,
        type: "*/*",
      };
      form.append("image", file);
    }
    const data = editData
      ? {
          id: editData.id,
          data: {
            title: title.value,
            desc: desc.value,
            is_active: isActive.value ? 1 : 0,
            order: parseInt(order.value),
          },
        }
      : {
          title: title.value,
          desc: desc.value,
          is_active: isActive.value ? 1 : 0,
          order: parseInt(order.value),
        };
    form.append("data", JSON.stringify(data));
    if (editData) {
      axios
        .patch(api.getDeps, form, {
          headers: {
            Authorization: "bearer " + token,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          Alert.alert("", "تم تعديل القسم");
          navigation.navigate("deps");
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    } else {
      axios
        .post(api.getDeps, form, {
          headers: {
            Authorization: "bearer " + token,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          Alert.alert("", "تم إضافة القسم");
          navigation.goBack();
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  };
  const uploadImage = async () => {
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
        image.onChangeText(result);
      }
    } catch (E) {
      console.log(E);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={GlobalStyles.whiteContainer}
    >
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
          قسم جديد
        </Text>
      </View>
      <ScrollView>
        <TouchableOpacity
          onPress={() => uploadImage()}
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              marginBottom: 10,
            }}
          >
            الصورة
          </Text>
          <Avatar
            title="D"
            source={{
              uri:
                image.value !== ""
                  ? !image.value?.uri
                    ? api.uploads + "/deps/" + editData.image
                    : image.value.uri
                  : null,
            }}
            style={{
              backgroundColor: "lightgray",
              height: 100,
              width: 100,
            }}
            size="large"
          />
        </TouchableOpacity>
        {!!error && (
          <Text
            style={{
              textAlign: "center",
              color: "red",
              fontSize: 20,
              fontFamily: "Cairo",
              marginVertical: 10,
            }}
          >
            {error}
          </Text>
        )}
        <Input {...title} {...inputProps()} label="عنوان القسم" />
        <Input {...desc} {...inputProps()} label="وصف القسم" />
        <Input
          {...order}
          {...inputProps()}
          label="ترتيب القسم"
          keyboardType="number-pad"
        />

        <View
          style={{
            flexDirection: isArabic ? "row" : "row-reverse",
            marginTop: 10,
            marginBottom: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              marginHorizontal: 20,
              fontWeight: "bold",
            }}
          >
            {isActive.value ? "فعال" : "غير فعال"}
          </Text>
          <Switch
            value={isActive.value}
            onValueChange={(v) => isActive.onChangeText(v)}
          />
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity
            style={{
              ...styles.button,
              backgroundColor: loading ? "lightgray" : colors.primary,
            }}
            onPress={() => handleSave()}
            disabled={loading}
          >
            {loading && <ActivityIndicator size="small" colors="#fff" />}
            <Text style={styles.buttonText}>
              {editData ? "تحديث" : "إضافة"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>رجوع</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  label: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: isArabic ? "left" : "right",
    position: "relative",
    top: "-10%",
  },
  wholeContainer: {
    width: "90%",
    marginHorizontal: "5%",
  },
  inputContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  input: {
    paddingHorizontal: 20,
    textAlign: "right",
  },
  buttons: {
    flexDirection: isArabic ? "row" : "row-reverse",

    marginHorizontal: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff",
  },
});
export default AddDep;
