import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useEffect, useState } from "react";

const DateCard = ({ prfstate, prfpdfrom, prfpdto }) => {
  const isEqual = JSON.stringify(prfpdfrom) === JSON.stringify(prfpdto);
  const [uri, setUri] = useState("");

  useEffect(() => {
    function getUri() {
      switch (prfstate) {
        case "공연중":
          setUri(
            "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Grinning%20Face.png"
          );
          break;
        case "공연예정":
          setUri(
            "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face%20with%20Open%20Hands.png"
          );
          break;
        default:
          setUri(
            "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Pleading%20Face.png"
          );
          break;
      }
    }
    getUri();
  }, [prfstate]);

  return (
    <View style={styles.container}>
      <Image source={{ uri }} style={styles.image} />
      {/* 상단 영역 */}
      <View style={styles.topView}>
        <View style={styles.arrange}>
          <Text style={styles.topText}>{prfstate}</Text>
        </View>
      </View>

      {/* 하단 영역 */}
      <View style={styles.bottomView}>
        <Text style={styles.bottomText} numberOfLines={1}>
          {isEqual ? prfpdfrom : `${prfpdfrom} - ${prfpdto}`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 29,
    width: "100%",
    height: 75 * 1.618,
    flexDirection: "column",
  },
  image: {
    width: 50,
    height: 50,
    position: "absolute",
    left: -10,
    top: -10,
    zIndex: 10,
    transform: [{ rotate: "-30deg" }],
  },
  topView: {
    flex: 1.5,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#BFBE28",
    borderBottomWidth: 3,
  },
  arrange: {
    flexDirection: "row",
    justifyContent: "center",
    overflow: "hidden",
  },
  bottomView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#CAFFD0",
    borderBottomStartRadius: 25,
    borderBottomEndRadius: 25,
  },
  topText: {
    color: "#161616",
    fontFamily: "Pretendard",
    fontSize: 20,
    letterSpacing: -1,
    padding: 2,
    lineHeight: 22,
  },
  bottomText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 16,
  },
});

export default DateCard;
