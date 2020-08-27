import React from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import { isArabic } from "../Constants";
const BackArrow = (props) => {
  const style = {
    textAlign: isArabic ? "left" : "right",
    marginTop: 30,
    marginBottom: 10,
    marginHorizontal: 15,
    ...props.style,
  };
  return <AntDesign {...props} style={style} name="arrowright" size={24} />;
};
export default BackArrow;
