import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  Dimensions,
  Share,
  Platform,
  Alert,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { fetchPerformances } from "../../utils/api/performanceApi";
import { useEffect, useState, useRef } from "react";
import DivisionButton from "../../components/PerformanceDetailPage/DivisionButton";
import { Image } from "expo-image";
import LikeButton from "../../components/LikeButton";
import { useLikeCount } from "../../Hooks/useLikes";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const MIN_CARD_HEIGHT = 240;
const MAX_CARD_HEIGHT = 700;

const PerformanceDetailsScreen = ({ route }) => {
  const { item, mt20id } = route.params;
  const performanceId = item?.mt20id || mt20id;

  const {
    data: likeCount,
    isLoading: isCountLoading,
    refetch: isCountRefetch,
  } = useLikeCount(performanceId);

  console.log("🟢 PerformanceDetailsScreen - route.params:", route.params);
  console.log("likeCount:", likeCount);
  console.log("performanceId:", performanceId);

  const [openDesc, setOpenDesc] = useState(false);

  //   const { performance, setPerformances } = usePerformanceStore();

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "performances",
      { endpoint: "pblprfr", item_id: performanceId, urlStructure: "상세" },
    ],
    queryFn: fetchPerformances,
  });

  // console.log("data:", data);
  // console.log("styurls", data?.items[0]);
  // console.log("styurls-area", data?.items[0]?.styurls);
  // 지금은 굳이
  //   useEffect(() => {
  //     setPerformances(data || []);
  //     console.log(performance.items);
  //   }, [data]);

  const cardHeight = useRef(new Animated.Value(MIN_CARD_HEIGHT)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  // 카드 상승 (More infomation)
  const toggleCard = () => {
    const newOpenState = !openDesc;
    setOpenDesc(newOpenState);

    Animated.spring(cardHeight, {
      toValue: newOpenState ? MAX_CARD_HEIGHT : MIN_CARD_HEIGHT,
      useNativeDriver: false,
      tension: 40,
      friction: 8,
    }).start();

    // 투명도 조절.
    Animated.timing(contentOpacity, {
      toValue: newOpenState ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // 공유
  const handleShare = async () => {
    if (!data || !data.items || !data.items[0]) return;

    const performance = data.items[0];
    try {
      const performanceName = performance.prfnm || "공연 정보";
      const venue = performance.fcltynm || "정보 없음";
      const schedule =
        `${performance.prfpdfrom || ""} - ${performance.prfpdto || ""}` ||
        "정보 없음";
      const genre = performance.genrenm || "공연";

      let shareOptions = {};

      const shareUrl = `https://google.com/search?q=${encodeURIComponent(
        performanceName
      )}`;

      if (Platform.OS === "ios") {
        // iOS
        shareOptions = {
          title: `${performanceName} - 공연 정보`,
          message: `[${performanceName}]\n\n장소: ${venue}\n일정: ${schedule}\n장르: ${genre}\n\n이 공연을 함께 관람하세요!`,
          url: shareUrl,
        };

        if (performance.poster) {
          try {
            const localUri =
              FileSystem.cacheDirectory + `${performance.mt20id || "temp"}.jpg`;
            await FileSystem.downloadAsync(performance.poster, localUri);
            shareOptions.url = localUri;
          } catch (error) {
            console.log("이미지 다운로드 실패:", error);
          }
        }
      } else {
        // Android
        shareOptions = {
          title: `${performanceName} - 공연 정보`,
          message: `[${performanceName}]\n\n장소: ${venue}\n일정: ${schedule}\n장르: ${genre}\n\n이 공연을 함께 관람해보세요!\n\n자세히 보기: ${shareUrl}`,
        };
      }

      const result = await Share.share(shareOptions);

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`공유 완료: ${result.activityType}`);
        } else {
          console.log("공유 완료");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("공유 취소됨");
      }
    } catch (error) {
      console.error("공유 오류:", error);

      let errorMessage = "공유하기를 실행할 수 없습니다";

      if (error.message.includes("permission")) {
        errorMessage = "공유 권한이 필요합니다";
      } else if (error.message.includes("network")) {
        errorMessage = "네트워크 연결을 확인해주세요";
      }

      Alert.alert("공유 실패", errorMessage);
    }
  };

  if (isLoading) return <ActivityIndicator size="large" />;

  if (error) {
    console.log("route.params.item:", item);
    console.log("item.mt20id:", item?.mt20id[0]);

    return <Text>데이터를 불러오는 중 오류 발생</Text>;
  }

  const ImageUri = data.items[0]?.poster;

  return (
    <ImageBackground
      source={{ uri: data.items[0]?.poster }}
      style={styles.background}
      blurRadius={50}
    >
      <View style={styles.headerButtonsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Feather name="share-2" size={22} color="#FFF7E9" />
        </TouchableOpacity>

        <LikeButton
          performanceId={data.items[0]?.mt20id}
          performanceName={data.items[0]?.prfnm}
          performancePoster={data.items[0]?.poster}
          performanceprfpdfrom={data.items[0]?.prfpdfrom}
          performanceprfpdto={data.items[0]?.prfpdto}
          performancefcltynm={data.items[0]?.fcltynm}
          performancegenrenm={data.items[0]?.genrenm}
          size={28}
          showCount={true}
        />
      </View>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={ImageUri} style={styles.image} contentFit="contain" />
        </View>

        <Animated.View
          style={[
            styles.card,
            {
              height: cardHeight,
            },
          ]}
        >
          {openDesc === false && (
            <View>
              <View style={{ justifyContent: "center", flexDirection: "row" }}>
                <Text style={styles.closeDescBox} numberOfLines={1}>
                  {data.items[0].genrenm}
                </Text>
              </View>

              <Text style={styles.title}>{data.items[0].prfnm}</Text>
              <Text style={styles.period}>{data.items[0]?.area}</Text>
              <Text style={styles.period}>
                {data.items[0]?.prfpdfrom} - {data.items[0]?.prfpdto}
              </Text>
            </View>
          )}

          <Animated.View
            style={[styles.extraContent, { opacity: contentOpacity }]}
          >
            <DivisionButton item={data.items[0]} />
          </Animated.View>
          <TouchableOpacity style={styles.moreInfoButton} onPress={toggleCard}>
            <AntDesign
              name={openDesc ? "caretup" : "caretdown"}
              size={16}
              color="#FFF7E9"
            />
            <Text style={styles.moreInfoText}>
              {openDesc ? "접기" : "더보기"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    position: "relative",
    flex: 1,
    resizeMode: "cover",
  },
  headerButtonsContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    zIndex: 10,
  },
  actionButton: {
    width: 55,
    height: 55,
    borderRadius: 20,
    backgroundColor: "rgba(22, 22, 22, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 100,
  },
  image: {
    width: 300,
    height: 500,
    borderRadius: 20,
  },
  card: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
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
    position: "relative",
    fontFamily: "Pretendard",
    fontWeight: "bold",
    fontSize: 20,
    color: "#161616",
    padding: 10,
    textAlign: "center",
    letterSpacing: -1,
  },
  period: {
    fontFamily: "Pretendard",
    fontSize: 16,
    color: "#161616",
    textAlign: "center",
    marginBottom: 5,
    letterSpacing: -1,
  },
  extraContent: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    maxHeight: MAX_CARD_HEIGHT - MIN_CARD_HEIGHT + 60,
    backgroundColor: "white",
  },
  moreInfoInsideImage: {
    flexDirection: "column",
    alignItems: "center",
  },
  moreInfoText: {
    fontFamily: "Pretendard",
    fontSize: 14,
    letterSpacing: -0.5,
    color: "#FFF7E9",
    marginLeft: 5,
  },
  description: {
    color: "#161616",
    textAlign: "center",
  },
  moreInfoButton: {
    flexDirection: "row",
    borderRadius: 16,
    borderColor: "transparent",
    backgroundColor: "#161616",
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 20,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  imageWrapper: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  detailImage: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 1.3,
    // resizeMode: "contain",
    paddingVertical: 120,
  },
  closeDescBox: {
    fontFamily: "Pretendard",
    fontSize: 14,
    letterSpacing: -1,
    color: "#FFF7E9",
    borderWidth: 1,
    textAlign: "center",
    backgroundColor: "#161616",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    lineHeight: 20,
    marginTop: 20,
  },
});

export default PerformanceDetailsScreen;
