import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useEffect, useState } from "react";

const GenreCard = ({ genrenm }) => {
  const [uri, setUri] = useState("");

  useEffect(() => {
    function getUri() {
      switch (genrenm[0]) {
        case "연극":
          setUri(
            "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Princess.png"
          );
          //   ok
          break;
        case "무용(서양/한국무용)":
          setUri(
            "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/People%20with%20Bunny%20Ears.png"
          );
          //   ok
          break;
        case "대중무용":
          setUri(
            "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/People%20with%20Bunny%20Ears.png"
          );
          //   ok
          break;
        case "서양음악(클래식)":
          setUri(
            "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Person%20in%20Tuxedo.png"
          );
          //   ok
          break;
        case "한국음악(국악)":
          setUri(
            "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Woman%20in%20Steamy%20Room.png"
          );
          break;
        case "대중음악":
          setUri(
            "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Man%20Singer.png"
          );
          //   ok
          break;
        case "복합":
          setUri(
            "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Man%20Singer.png"
          );
          //   ok
          break;
        case "서커스/마술":
          setUri(
            "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Man%20Juggling.png"
          );
          //   ok
          break;
        case "뮤지컬":
          setUri(
            "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Man%20Vampire.png"
          );
          //   ok
          break;
        default:
          setUri(
            "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Man%20Raising%20Hand.png"
          );
          //   ok
          break;
      }
    }

    getUri();
  }, [genrenm]);

  return (
    <View
      style={{
        position: "relative",
        borderWidth: 3,
        borderColor: "black",
        borderRadius: 29,
        width: "100%",
        height: 100 * 1.618,
        flexDirection: "column",
      }}
    >
      <Image
        source={{ uri }}
        style={{
          width: 125,
          height: 125,
          position: "absolute",
          left: "50%",
          transform: [{ translateX: "-50%" }],
          bottom: 0,
          zIndex: 10,
        }}
      />
      {/* 상단 영역 */}
      <View
        style={{
          flex: 1,
          borderTopStartRadius: 25,
          borderTopEndRadius: 25,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#161616",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Text style={styles.bottomText}>{genrenm}</Text>
        </View>
      </View>

      {/* 하단 영역 */}
      <View
        style={{
          flex: 3.5,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#161616",
          borderBottomStartRadius: 25,
          borderBottomEndRadius: 25,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bottomText: {
    color: "#FFF7E9",
    fontFamily: "Pretendard",
    fontSize: 16,
    letterSpacing: -1,
    paddingVertical: 2,
    paddingHorizontal: 10,
    lineHeight: 22,
    borderWidth: 2,
    borderColor: "#FFF7E9",
    padding: 5,
    borderRadius: 10,
  },
});

export default GenreCard;
