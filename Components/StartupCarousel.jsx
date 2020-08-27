import React, { useState, useRef, useEffect } from "react";
import { ScrollView, View, Image, Text, StyleSheet } from "react-native";
import firstImage from "../assets/images/Carousel/1.png";
import secondImage from "../assets/images/Carousel/2.png";
import { colors, isArabic } from "../Constants";
const items = [
  {
    title: "سهولة التواصل والإنجاز",
    img: firstImage,
  },

  {
    title: "أفكار جديدة بلا حدود",
    img: secondImage,
  },
];

const StartupCarousel = ({ interval, setInterval }) => {
  const [width, setWidth] = useState(0);
  const [first, setFirst] = useState(true);
  const scroller = useRef();
  useEffect(() => {
    isArabic && scroller.current.scrollTo({ x: 0, y: 0, animated: false });
  }, []);
  const getInterval = (offset) => {
    if (offset > width / 4) return 2;
    return 1;
  };
  let bullets = [];

  for (let i = 1; i <= 2; i++) {
    bullets.push(
      <View
        key={i}
        style={{
          width: interval === i ? 25 : 10,
          backgroundColor: colors.primary,

          height: 10,
          elevation: 5,
          zIndex: 5,
          marginHorizontal: 5,
          borderRadius: 5,
        }}
      ></View>
    );
  }

  return (
    <View>
      <ScrollView
        horizontal={true}
        contentContainerStyle={{
          width: "200%",
          flexDirection: isArabic ? "row-reverse" : "row",
        }}
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={(w) => setWidth(w)}
        onScroll={(data) => {
          setWidth(data.nativeEvent.contentSize.width);
          if (isArabic && first) {
            setInterval(1);
            setFirst(false);
            return;
          }
          setInterval(getInterval(data.nativeEvent.contentOffset.x));
        }}
        scrollEventThrottle={200}
        pagingEnabled={true}
        decelerationRate="fast"
        ref={scroller}
      >
        {items.map((item, i) => {
          return (
            <View style={styles.slide} key={i}>
              <Image source={item.img} style={styles.image} />
              <Text style={styles.itemText}>{item.title}</Text>
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.bullets}>{bullets}</View>
    </View>
  );
};
const styles = StyleSheet.create({
  slide: {
    maxWidth: "100%",
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",

    marginTop: 1,
  },
  image: {
    maxWidth: "100%",
    borderRadius: 10,
    height: 300,
  },
  itemText: {
    fontSize: 20,
    paddingTop: 7,
    fontFamily: "Cairo",
  },
  bullets: {
    position: "relative",
    flexDirection: isArabic ? "row-reverse" : "row",
    justifyContent: "center",
    alignItems: "center",
    top: -10,
  },
});
export default StartupCarousel;
