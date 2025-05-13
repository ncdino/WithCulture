import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";

const WholeCard = ({ dtguidance, bgColor }) => {
  return (
    <View>
      <View
        style={{
          position: "relative",
          borderWidth: 3,
          borderColor: "black",
          borderRadius: 29,
          padding: 10,
          width: "100%",
          height: 100 * 1.618,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 1,
          backgroundColor: bgColor,
        }}
      >
        <Image
          source={{
            uri: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Eleven-Thirty.png",
          }}
          style={styles.image}
        />
        <View
          style={{
            flex: 1.5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "YeongdoRegular",
              letterSpacing: -1,
              color: "#495057",
              lineHeight: 20,
            }}
          >
            공연 시간
          </Text>
          {/* 상단 영역 */}
          <Text style={styles.bottomText}>{dtguidance}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomText: {
    color: "black",
    fontFamily: "Pretendard",
    fontSize: 14,
    letterSpacing: -1,
    padding: 2,
    lineHeight: 22,
  },
  image: {
    width: 60,
    height: 60,
    position: "absolute",
    right: -10,
    top: -10,
    zIndex: 10,
  },
});

export default WholeCard;
