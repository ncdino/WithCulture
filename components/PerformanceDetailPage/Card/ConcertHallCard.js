import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";

const ConcertHallCard = ({ content, title, height, bgColor, condition }) => {
  let imageSource;
  switch (condition) {
    case "hall":
      imageSource = require("../../../assets/icon/Classical-Building.png"); // Time.png 이미지 경로
      break;
    case "area":
      imageSource = require("../../../assets/icon/Map.png"); // Map.png 이미지 경로
      break;
    case "runtime":
      imageSource = require("../../../assets/icon/Man-Running.png"); // Runtime.png 이미지 경로
      break;
    default:
      imageSource = require("../../../assets/icon/Classical-Building.png"); // 기본 이미지 경로
      break;
  }

  return (
    <View>
      <View
        style={{
          position: "relative",
          borderWidth: 3,
          borderColor: "black",
          borderRadius: 25,
          padding: 10,
          width: "100%",
          height: height,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 1,
          backgroundColor: bgColor,
        }}
      >
        <Image source={imageSource} style={styles.image} />
        <View style={styles.innerView}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.bottomText}>
            {content && content[0] === " " ? "정보 없음" : content}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomText: {
    color: "white",
    fontFamily: "Pretendard",
    fontSize: 14,
    letterSpacing: -1,
    padding: 2,
    lineHeight: 22,
  },
  image: {
    width: 50,
    height: 50,
    position: "relative",
    left: 0,
    top: 0,
    zIndex: 10,
  },
  innerView: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "YeongdoRegular",
    letterSpacing: -1,
    color: "#F1E7E7",
    lineHeight: 20,
  },
});
export default ConcertHallCard;
