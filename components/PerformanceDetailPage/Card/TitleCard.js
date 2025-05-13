import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";

const TitleCard = ({ title }) => {
  return (
    <View style={{ paddingHorizontal: 50 }}>
      <View
        style={{
          borderBottomWidth: 3,
          borderColor: "black",
          width: "100%",
          height: 70,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 40,
          padding: 5,
        }}
      >
        {/* 상단 영역 */}
        <Text style={styles.bottomText}>{title}</Text>
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
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -1,
    lineHeight: 30,
  },
});

export default TitleCard;
