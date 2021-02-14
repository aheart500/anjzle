import * as React from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import { colors, api, isArabic } from "../../Constants";
import ForwardArrowIcon from "../../assets/images/arrow.png";
const Icons = {
  allOrders: require("../../assets/images/all_order.png"),
  pendingOrders: require("../../assets/images/pending_shipments.png"),
  completedOrders: require("../../assets/images/finished.png"),
  who: require("../../assets/images/group.png"),
  contact: require("../../assets/images/support.png"),
  privacy: require("../../assets/images/privacy.png"),
};
const ProfileOptions = ({ iconName, title, badge, action }) => {
  return (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        action && action();
      }}
    >
      {Object.keys(Icons).includes(iconName) && (
        <Image source={Icons[iconName]} />
      )}
      <Text style={styles.listText}>{title}</Text>
      {badge && badge > 0 && <Text style={styles.badge}>{badge}</Text>}
      <Image source={ForwardArrowIcon} style={styles.arrow} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  listItem: {
    flexDirection: isArabic ? "row" : "row-reverse",
    paddingVertical: 10,
    paddingHorizontal: 25,
    alignItems: "center",
  },
  listText: {
    paddingRight: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
  badge: {
    alignSelf: "center",
    position: "absolute",
    right: 100,
    backgroundColor: colors.primary,
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
    textAlignVertical: "center",
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  arrow: {
    position: "absolute",
    right: 50,
  },
});

export default ProfileOptions;
