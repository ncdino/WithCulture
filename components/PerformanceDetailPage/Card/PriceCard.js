import { Image } from "expo-image";
import { Text, View } from "react-native";

const PriceCard = ({ price }) => {
  // console.log("이 티켓의 가격 : ", price);
  const priceParts = price[0].split(", ");

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <View
        style={{
          position: "relative",
          borderWidth: 3,
          borderColor: "black",
          backgroundColor: "#161616",
          borderRadius: 29,
          width: "100%",
          height: 100,
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          gap: 10,
          marginBottom: 8,
        }}
      >
        <Text
          style={{
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
          }}
        >
          가격
        </Text>
        <Image
          source={require("../../../assets/icon/Ticket.png")}
          style={{ width: 75, height: 75, flex: 1, marginHorizontal: 15 }}
        />
        <View style={{ flex: 4 }}>
          {priceParts.length > 1 ? (
            priceParts.map((part, index) => (
              <Text
                key={index}
                style={{
                  color: "white",
                  fontFamily: "Pretendard",
                  lineHeight: 20,
                }}
              >
                {part}
              </Text>
            ))
          ) : (
            <Text
              style={{
                color: "white",
                fontFamily: "Pretendard",
                lineHeight: 30,
                letterSpacing: -1,
              }}
            >
              {price}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default PriceCard;
