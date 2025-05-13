import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageBackground,
  FlatList,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchPerformances } from "../../utils/api/performanceApi";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.7;

const PerformanceHorizontalList = ({
  navigation,
  title,
  searchParams = {},
  endpoint,
}) => {
  // console.log("searchParams:", searchParams);
  // console.log("searchParams (shcate):", searchParams.shcate);

  const shCate = searchParams?.shcate;
  const signguCode = searchParams?.signgucode;

  // console.log("signgucode: ", signguCode);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["performances", { endpoint: endpoint, params: searchParams }],
    queryFn: fetchPerformances,
    enabled: !!searchParams && Object.keys(searchParams).length > 0,
  });

  // console.log("second searchParams: ", searchParams);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>공연 정보를 불러오는 중...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text>공연 정보를 불러오는데 실패했습니다.</Text>
      </View>
    );
  }

  const performances = data?.items || [];

  const handlePerformancePress = (item) => {
    navigation.navigate("PerformanceDetails", { item });
  };

  const handlePerformanceSeeMore = () => {
    const isUpcoming = title === "예정된 공연";

    navigation.navigate("PerformanceComingScreen", {
      initialType: isUpcoming ? "upcoming" : "ongoing",
      shcate: shCate,
      signgucode: signguCode,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.sectionTitle}>{title || "추천 공연"}</Text>
        <TouchableOpacity
          onPress={() => {
            console.log("더보기 clicked");
            handlePerformanceSeeMore();
          }}
          style={styles.seeMoreButton}
        >
          <Text style={styles.seeMore}>더 보기</Text>
          <Ionicons name="chevron-forward" size={20} color="#333" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={performances.slice(0, 10)}
        keyExtractor={(item, index) => `${item.mt20id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => handlePerformancePress(item)}
          >
            <ImageBackground
              style={styles.backgroundImage}
              source={{ uri: item.poster }}
              blurRadius={10} // blur 강도 낮추기
            >
              <Image
                source={{ uri: item.poster }}
                style={styles.poster}
                resizeMode="contain"
              />
            </ImageBackground>
            <View style={styles.infoContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {item.prfnm}
              </Text>
              <View style={styles.detailRow}>
                <Text style={styles.label}>장소:</Text>
                <Text style={styles.value} numberOfLines={1}>
                  {item.fcltynm}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>기간:</Text>
                <Text style={styles.value}>
                  {item.prfpdfrom} ~ {item.prfpdto}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>장르:</Text>
                <Text style={styles.value}>{item.genrenm}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  innerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1,
    borderBottomWidth: 3,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontFamily: "Pretendard",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: -1,
    marginBottom: 10,
    marginLeft: 15,
  },
  seeMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 10,
    marginRight: 10,
  },
  seeMore: {
    fontFamily: "Pretendard",
    fontWeight: "light",
    color: "#333",
    letterSpacing: -1,
  },
  scrollViewContent: {
    paddingLeft: 15,
    paddingRight: 5,
    marginTop: 2,
    marginBottom: 2,
  },
  itemContainer: {
    borderWidth: 3,
    width: ITEM_WIDTH,
    marginRight: 10,
    borderRadius: 30,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  poster: {
    resizeMode: "contain",
    width: "100%",
    height: 300,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  infoContainer: {
    padding: 10,
  },
  title: {
    fontFamily: "RIDIBatang",
    fontSize: 16,
    letterSpacing: -1,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: "#666",
    width: 40,
  },
  value: {
    fontFamily: "Pretendard",
    fontWeight: "light",
    letterSpacing: -1,
    fontSize: 12,
    flex: 1,
  },
  tagContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  tag: {
    fontSize: 10,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginRight: 5,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    color: "#666",
  },
  upcomingTag: {
    backgroundColor: "#e0f7fa",
    color: "#0097a7",
  },
  ongoingTag: {
    backgroundColor: "#e8f5e9",
    color: "#43a047",
  },
  completedTag: {
    backgroundColor: "#f5f5f5",
    color: "#9e9e9e",
  },
  openrunTag: {
    backgroundColor: "#fff3e0",
    color: "#ff9800",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
});

export default PerformanceHorizontalList;
