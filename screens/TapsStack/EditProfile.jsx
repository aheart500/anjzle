import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import GlobalStyles from "../../hooks/sharedStyles";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { Avatar, Input } from "react-native-elements";
import Constants from "expo-constants";
import UserContext from "../../Contexts/User/UserContext";
import { api, colors, isArabic } from "../../Constants";
import useInput from "../../hooks/useInput";
import Icon from "react-native-vector-icons/Entypo";
import axios from "axios";
import { Alert } from "react-native";

const EditProfile = ({ navigation }) => {
  const { userState, getUserData } = useContext(UserContext);
  const [image, setImage] = useState(userState.image);
  const [uploadedImage, setUploadedImage] = useState(null);
  const name = useInput(userState.name);
  const fname = useInput(userState.fname);
  const password1 = useInput("");
  const password2 = useInput("");
  const [hidePass1, setHidePass1] = useState(true);
  const [hidePass2, setHidePass2] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
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
        setUploadedImage(result);
      }
    } catch (E) {
      console.log(E);
    }
  };
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
    if (name.value === "") {
      setErrorMessage("يجب إدخال اسم");
      return;
    }
    if (password1.value !== password2.value) {
      setErrorMessage("كلمتي المرور غير متطابقتين");
      return;
    }
    const data = {
      fname: fname.value,
      name: name.value,
      password: password1.value,
    };

    setLoading(true);
    let form = new FormData();
    if (uploadedImage) {
      const uriArr = uploadedImage.uri.split(".");
      const extenstion = uriArr[uriArr.length - 1];
      const file = {
        uri: uploadedImage.uri,
        name: Date.now() + "." + extenstion,
        type: "*/*",
      };
      form.append("image", file);
    }
    form.append("data", JSON.stringify(data));

    axios
      .post(api.getUsers + "/update", form, {
        headers: {
          Authorization: "bearer " + userState.token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        getUserData(userState.token);
        Alert.alert("", "تم الحفظ");
        navigation.navigate("profile");
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={GlobalStyles.whiteContainer}
    >
      <ScrollView>
        <View style={styles.container}>
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => uploadImage()}
          >
            <Avatar
              source={{
                uri: uploadedImage
                  ? uploadedImage.uri
                  : api.uploads + "/users/" + image,
              }}
              title={userState.name.substring(0, 1)}
              rounded
              size="xlarge"
            />
          </TouchableOpacity>
          <Input
            {...inputProps({ textAlign: "right" })}
            {...name}
            label="الأسم"
          />
          <Input
            {...inputProps({ textAlign: "right" })}
            {...fname}
            label="اسم العائلة"
            placeholder=""
          />
          <Input
            leftIcon={
              <Icon
                name={hidePass1 ? "eye-with-line" : "eye"}
                size={24}
                style={{ paddingHorizontal: 10 }}
                onPress={() => setHidePass1(!hidePass1)}
              />
            }
            {...inputProps({ paddingRight: 20 })}
            {...password1}
            secureTextEntry={hidePass1}
            label="كلمة المرور"
            placeholder="••••••••••••••••••••••••"
          />
          <Input
            leftIcon={
              <Icon
                name={hidePass2 ? "eye-with-line" : "eye"}
                size={24}
                style={{ paddingHorizontal: 10 }}
                onPress={() => setHidePass2(!hidePass2)}
              />
            }
            {...inputProps({ paddingRight: 20 })}
            {...password2}
            secureTextEntry={hidePass2}
            label="تأكيد كلمة المرور"
            placeholder="••••••••••••••••••••••••"
            errorMessage={errorMessage ? errorMessage : null}
            errorStyle={{
              fontSize: 20,
              fontWeight: "bold",
            }}
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
            <Text style={styles.buttonText}>تحديث</Text>
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
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
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
    paddingLeft: 20,
    textAlign: !isArabic ? "left" : "right",
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
export default EditProfile;
