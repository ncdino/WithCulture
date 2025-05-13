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
import { boxOfficeRequest } from "../../utils/api/performanceApi";

import { RankBadge } from "../Rank/RankScreen";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.7;

const BoxOfficeHorizontalList = ({
  navigation,
  title,
  searchParams = {},
  endpoint,
  isRanking = false,
}) => {
  // console.log("searchParams:", searchParams);
  //   console.log("searchParams (shcate):", searchParams.shcate);

  //   const shCate = searchParams.shcate;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["boxOffice", { endpoint: endpoint, params: searchParams }],
    queryFn: boxOfficeRequest,
    enabled: !!searchParams && Object.keys(searchParams).length > 0,
  });

  console.log("data:", data);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>공연 정보를 불러오는 중...</Text>
      </View>
    );
  }

  if (isError) {
    console.error("Error fetching data:", error);

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

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.sectionTitle}>{title || "추천 공연"}</Text>
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
              <RankBadge rank={item.rnum} />
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
                  {item.area}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>기간:</Text>
                <Text style={styles.value}>{item.prfpd}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>장르:</Text>
                <Text style={styles.value}>{item.cate}</Text>
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
  backgroundImage: {
    borderBottomWidth: 3,
    position: "relative",
    flex: 1,
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
  seeMore: {
    marginRight: 20,
    fontFamily: "Pretendard",
    fontWeight: "light",
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
    position: "relative",
    padding: 10,
  },
  rank: {
    fontFamily: "Pretendard",
    fontSize: 14,
    fontWeight: "bold",
    color: "#FDF7DF",
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

export default BoxOfficeHorizontalList;
