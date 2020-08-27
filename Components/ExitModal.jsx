import React from "react";
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import GlobalStyles from "../hooks/sharedStyles";

const ExitModal = ({ close }) => {
  const handleClose = () => {
    close();
    BackHandler.exitApp();
  };
  return (
    <Modal
      visible={true}
      statusBarTranslucent={true}
      transparent={true}
      onRequestClose={() => close()}
      animationType="slide"
    >
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={[GlobalStyles.blackBold, styles.question]}>
            هل تريد الخروج من التطبيق؟
          </Text>
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleClose()}
            >
              <Text style={styles.answer}>نعم</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => close()}>
              <Text style={styles.answer}>لا</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "90%",
    height: 85,
    marginHorizontal: "10%",
    borderRadius: 5,
    backgroundColor: "#fff",
    padding: 10,
    justifyContent: "space-between",
    elevation: 10,
    zIndex: 10,
  },
  question: {
    marginHorizontal: 10,
  },
  buttons: {
    flexDirection: "row-reverse",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  button: {
    marginHorizontal: 10,
    backgroundColor: "grey",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
  },
  answer: {
    fontWeight: "bold",
    fontSize: 20,
  },
});
export default ExitModal;
