import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Image,
} from "react-native";
import ActorCard from "./Card/ActorCard";
import DateCard from "./Card/DateCard";
import TitleCard from "./Card/TitleCard";
import WholeCard from "./Card/WholeCard";
import ConcertHallCard from "./Card/ConcertHallCard";
import GenreCard from "./Card/GenreCard";
import { Image as ExpoImage } from "expo-image";
import PriceCard from "./Card/PriceCard";
import PerformanceHallInfo from "../../screens/Performance/HallInfoSection/PerformanceHallInfo";

const options = ["공연정보", "판매정보", "공연장 상세"];
const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function DivisionButton({ item }) {
  const [selectedOption, setSelectedOption] = useState("공연정보");

  const imageSources = {
    네이버N예약: require("../../assets/reservation/naver.png"),
    인터파크: require("../../assets/reservation/interpark.png"),
  };

  const [imageSizes, setImageSizes] = useState({});

  useEffect(() => {
    const fetchImageSizes = async () => {
      const sizes = {};
      if (item.styurls?.styurl) {
        const uri = item.styurls.styurl;
        Image.getSize(
          uri,
          (width, height) => {
            let adjustedWidth;
            if (width < 300) {
              adjustedWidth = width * 10;
            } else if (width > 300 && width < 700) {
              adjustedWidth = width * 2;
            } else {
              adjustedWidth = width;
            }
            let adjustedHeight = height * (adjustedWidth / width);
            if (height >= 10000) {
              adjustedHeight = adjustedHeight * 0.5;
              adjustedWidth = adjustedHeight * 0.5;
            }
            sizes[uri] = { width: adjustedWidth, height: adjustedHeight };
            setImageSizes((prevSizes) => ({
              ...prevSizes,
              [uri]: { width: adjustedWidth, height: adjustedHeight },
            }));
          },
          (error) => {
            console.error("Error fetching image size:", error);
            sizes[uri] = { width: 300, height: 200 };
            // 300 * 200 디폴트
            setImageSizes((prevSizes) => ({
              ...prevSizes,
              [uri]: { width: 300, height: 200 },
            }));
          }
        );
      } else if (item.styurls?.styurl && Array.isArray(item.styurls.styurl)) {
        for (const uri of item.styurls.styurl) {
          Image.getSize(
            uri,
            (width, height) => {
              let adjustedWidth;
              if (width < 300) {
                adjustedWidth = width * 10;
              } else if (width > 300 && width < 700) {
                adjustedWidth = width * 2;
              } else {
                adjustedWidth = width;
              }
              let adjustedHeight = height * (adjustedWidth / width);
              if (height >= 10000) {
                adjustedHeight = adjustedHeight * 0.5;
                adjustedWidth = adjustedHeight * 0.5;
              }
              sizes[uri] = { width: adjustedWidth, height: adjustedHeight };
              setImageSizes((prevSizes) => ({
                ...prevSizes,
                [uri]: { width: adjustedWidth, height: adjustedHeight },
              }));
            },
            (error) => {
              console.error("Error fetching image size:", error);
              sizes[uri] = { width: 300, height: 200 }; // 기본 크기
              setImageSizes((prevSizes) => ({
                ...prevSizes,
                [uri]: { width: 300, height: 200 },
              }));
            }
          );
        }
      } else {
        console.warn("No valid styurl(s) found in styurls:", item.styurls);
        setImageSizes({});
      }
    };

    fetchImageSizes();
  }, [item.styurls]);

  const renderContent = () => {
    if (selectedOption === "공연정보") {
      return (
        <View>
          <TitleCard title={item.prfnm} />
          <ActorCard condition={"actors"} size={150} title={"출연진"}>
            {item.prfcast === "" ? "정보 없음" : item.prfcast}
          </ActorCard>
          <PriceCard price={item.pcseguidance} />
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              gap: 1,
              marginTop: 2,
            }}
          >
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-between",
                flex: 1,
              }}
            >
              <DateCard
                prfstate={item.prfstate}
                prfpdfrom={item.prfpdfrom}
                prfpdto={item.prfpdto}
              />
              <GenreCard genrenm={item.genrenm} />
              <ConcertHallCard
                content={item.area}
                title="지역"
                height={75 * 1.618}
                condition={"area"}
                bgColor={"#2C3930"}
              />
            </View>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-between",
                paddingHorizontal: 0,
                flex: 1,
                gap: 1,
              }}
            >
              <WholeCard dtguidance={item.dtguidance} bgColor={"DCD7C9"} />
              <ConcertHallCard
                content={item.prfruntime}
                title="런타임"
                height={75 * 1.618}
                condition={"runtime"}
                bgColor={"#3F4F44"}
              />
              <ConcertHallCard
                content={item.fcltynm}
                title="공연장"
                height={75 * 1.618}
                condition={"hall"}
                bgColor={"#A27B5C"}
              />
            </View>
          </View>
          <ActorCard condition={"directors"} size={60} title={"제작진"}>
            {item.prfcrew === "" ? "정보 없음" : item.prfcrew}
          </ActorCard>

          <FlatList
            data={
              item.styurls?.styurl
                ? Array.isArray(item.styurls.styurl)
                  ? item.styurls.styurl
                  : [item.styurls.styurl]
                : []
            }
            keyExtractor={(uri, index) => index.toString()}
            renderItem={({ item: uri }) => (
              <View style={styles.imageWrapper}>
                {imageSizes[uri] ? (
                  <ExpoImage
                    source={{ uri }}
                    style={{
                      width: imageSizes[uri].width * 0.3 || 30,
                      height: imageSizes[uri].height * 0.3 || 20,
                    }}
                    contentFit="fill"
                  />
                ) : (
                  <ActivityIndicator size="large" color="#999" />
                )}
              </View>
            )}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>
      );
    } else if (selectedOption === "판매정보") {
      return (
        <View style={styles.ViewContainer}>
          {item.relates?.relate ? (
            (Array.isArray(item.relates.relate)
              ? item.relates.relate
              : [item.relates.relate]
            ).map((relateItem, index) => {
              const imageSource =
                imageSources[relateItem.relatenm] ||
                require("../../assets/memoji/Admission-Tickets.png");

              const relateURL = relateItem.relateurl;

              return (
                <View key={index} style={styles.ReservationrelateItemContainer}>
                  <View style={styles.ReservationimageContainer}>
                    <ExpoImage
                      source={imageSource}
                      style={styles.ReservationrelateImage}
                      contentFit="contain"
                    />
                  </View>
                  <View style={styles.ReservationtextContainer}>
                    <Text style={styles.Reservationtitle}>
                      {relateItem.relatenm}
                    </Text>
                    <Text
                      style={styles.ReservationURL}
                      onPress={() => {
                        if (relateURL) {
                          Linking.openURL(relateURL);
                        } else {
                          console.warn("일치하지 않은 URL");
                        }
                      }}
                    >
                      예매하기
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={styles.baseText}>판매 정보가 없습니다.</Text>
          )}
        </View>
      );
    } else if (selectedOption === "공연장 상세") {
      return <PerformanceHallInfo hallId={item.mt10id} />;
    }
    return null;
  };

  return (
    <View>
      <TouchableOpacity>
        <View style={styles.buttonContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => setSelectedOption(option)}
            >
              <Text
                style={
                  selectedOption === option
                    ? styles.selectedOption
                    : styles.unselectedOption
                }
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
      <FlatList
        data={[{ key: "content" }]}
        renderItem={() => renderContent()}
        keyExtractor={(item) => item.key}
        ListFooterComponent={<View style={{ height: 120 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: 20,
    marginVertical: 30,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderWidth: 2,
    borderColor: "#161616",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  selectedOption: {
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 20,
    backgroundColor: "#161616",
    color: "white",
    paddingHorizontal: 25,
    paddingVertical: 5,
    fontFamily: "Pretendard",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: -1,
  },
  unselectedOption: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    paddingVertical: 5,
    paddingHorizontal: 25,
    fontSize: 14,
    color: "#333333",
  },
  ViewContainer: {
    marginHorizontal: 30,
    flex: 1,
  },
  baseText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
  },
  ReservationViewContainer: {
    padding: 10,
  },
  ReservationrelateItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  ReservationimageContainer: {
    padding: 5,
    marginRight: 10,
    width: 60,
    height: 60,
  },
  ReservationrelateImage: {
    width: "100%",
    height: "100%",
  },
  ReservationtextContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  Reservationtitle: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  ReservationURL: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    color: "#FFF7E9",
    backgroundColor: "#161616",
    textAlign: "center",
    borderWidth: 3,
    borderColor: "#161616",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexShrink: 1,
    alignSelf: "flex-start",
    maxWidth: "100%",
    textBreakStrategy: "simple",
  },
  ReservationbaseText: {
    marginTop: 10,
    fontSize: 14,
  },
  listContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  imageWrapper: {
    marginVertical: 10,
    alignItems: "center",
  },
});
