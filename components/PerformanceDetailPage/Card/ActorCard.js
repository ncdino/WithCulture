import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";

const ActorCard = ({ children, condition, size, title }) => {
  let imageSource;

  switch (condition) {
    case "actors":
      imageSource = require("../../../assets/memoji/actor.png");
      break;
    case "directors":
      imageSource = require("../../../assets/memoji/director-clapper.png");
      break;
    default:
      imageSource = require("../../../assets/icon/Classical-Building.png");
      break;
  }

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <View style={styles.containerView}>
        {condition === "actors" && <Text style={styles.actorText}>출연진</Text>}
        {/* 상단 영역 */}
        <View style={styles.topView}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Image
              source={imageSource}
              style={{
                width: size,
                height: size,
              }}
            />
          </View>
        </View>

        {/* 하단 영역 */}
        <View style={styles.bottomView}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.bottomText} numberOfLines={2}>
            {children}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF7E9",
    borderBottomStartRadius: 25,
    borderBottomEndRadius: 25,
  },
  bottomText: {
    color: "#161616",
    fontFamily: "Pretendard",
    fontSize: 14,
    letterSpacing: -1,
    padding: 2,
    lineHeight: 22,
  },
  actorText: {
    position: "absolute",
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 25,
    zIndex: 10,
    top: -12,
    right: -10,
    paddingHorizontal: 20,
    paddingVertical: 5,
    color: "white",
    backgroundColor: "black",
    letterSpacing: -1,
    fontFamily: "YeongdoBold",
    lineHeight: 15,
    width: 80,
    textAlign: "center",
  },
  containerView: {
    position: "relative",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 29,
    width: "100%",
    height: 160,
    flexDirection: "column",
    marginBottom: 10,
  },
  topView: {
    flex: 1.5,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#161616",
  },
  titleText: {
    fontFamily: "YeongdoRegular",
    lineHeight: 20,
  },
});
export default ActorCard;
