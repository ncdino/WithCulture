import { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { formatDate } from "../../utils/DateTimeFormater";

const DetailScreen = ({ route }) => {
  const { item } = route.params;
  const [openDesc, setOpenDesc] = useState(false);

  return (
    <ImageBackground
      source={{ uri: item.thumbnail }}
      style={styles.background}
      blurRadius={50}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.thumbnail }} style={styles.image} />
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.period}>
            {formatDate(item.startDate)} ~ {formatDate(item.endDate)}
          </Text>
          <Text style={styles.period}>장소: {item.place}</Text>
          <Text style={styles.period}>분야: {item.realmName}</Text>
          {openDesc === false ? (
            <View style={styles.moreInfo}>
              <AntDesign
                name="caretdown"
                size={12}
                color="black"
                onPress={() => setOpenDesc(!openDesc)}
              />
              <Text
                style={styles.moreInfoText}
                onPress={() => setOpenDesc(!openDesc)}
              >
                MORE INFORMATION
              </Text>
            </View>
          ) : (
            <View style={styles.moreInfo}>
              <AntDesign name="caretup" size={12} color="black" />
              <Text
                style={styles.moreInfoText}
                onPress={() => setOpenDesc(!openDesc)}
              >
                CLOSE
              </Text>
            </View>
          )}

          {openDesc && (
            <Text style={styles.description}>{item.DESCRIPTION?.[0]}</Text>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center", 
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 70,
  },
  image: {
    width: 300,
    height: 500,
    resizeMode: "contain",
    borderRadius: 20,
  },
  card: {
    position: "absolute",
    bottom: 0, 
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    zIndex: 10, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontFamily: "RIDIBatang",
    fontSize: 24,
    color: "black",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: -1,
  },
  period: {
    fontFamily: "Pretendard",
    fontSize: 16,
    color: "black",
    textAlign: "center",
    marginBottom: 5,
    letterSpacing: -1,
  },
  moreInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  moreInfoText: {
    fontWeight: "bold",
    color: "black",
    marginLeft: 5,
  },
  description: {
    color: "black",
    marginTop: 10,
    textAlign: "center",
  },
});

export default DetailScreen;
