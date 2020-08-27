import { StyleSheet } from "react-native";
import { colors, barHeight, isArabic } from "../Constants";
const GlobalStyles = StyleSheet.create({
  whiteContainer: {
    flex: 1,
    paddingTop: barHeight,
    backgroundColor: "#fff",
  },
  blueContainer: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: barHeight,
  },
  blackBold: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
  },
  white: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  button: {
    backgroundColor: "#fff",
    borderRadius: 50,
    width: "90%",
    marginTop: 15,
    marginHorizontal: "5%",
    paddingVertical: 10,
  },
  blackCenter: {
    color: "#000",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  whiteText: {
    color: "#fff",
    fontFamily: "Cairo",
    fontSize: 25,
    marginHorizontal: 25,
  },
  pickerContainer: {
    backgroundColor: "lightgray",
    borderRadius: 50,
    height: 30,
    flexDirection: isArabic ? "row" : "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  pickerContainerContainer: {
    flexDirection: isArabic ? "row" : "row-reverse",
    alignItems: "center",
  },
  rightText: {
    textAlign: "right",
  },
});

export default GlobalStyles;
