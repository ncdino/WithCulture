import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchPerformances } from "../../utils/api/performanceApi";
import { UpcomingPerformanceDate } from "../../utils/getCurrentDate";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";

const { width } = Dimensions.get("window");

const PerformanceComingScreen = ({ route, navigation }) => {
  const [page, setPage] = useState(1);
  const [performanceType, setPerformanceType] = useState("ongoing");
  const [performances, setPerformances] = useState([]);
  const [shcate, setShcate] = useState("");
  const [signgucode, setSigngucode] = useState("");
  const flatListRef = useRef(null);
  const panRef = useRef(null);

  useEffect(() => {
    if (route?.params?.initialType) {
      setPerformanceType(route.params.initialType);
    }

    if (route?.params?.shcate) {
      setShcate(route.params.shcate);
    }

    if (route?.params?.signgucode) {
      setSigngucode(route.params.signgucode);
    }
  }, [route]);

  const getSearchParams = () => {
    if (performanceType === "ongoing") {
      return {
        stdate: UpcomingPerformanceDate(-30),
        eddate: UpcomingPerformanceDate(1),
        prfstate: "02",
        cpage: page,
        shcate: shcate,
        rows: 100,
        signgucode: signgucode,
      };
    } else {
      return {
        stdate: UpcomingPerformanceDate(1),
        eddate: UpcomingPerformanceDate(30),
        cpage: page,
        shcate: shcate,
        signgucode: signgucode,
        rows: 100,
      };
    }
  };

  const onSwipeGestureEvent = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      if (
        Math.abs(nativeEvent.translationX) > 50 &&
        Math.abs(nativeEvent.translationY) < 50
      ) {
        if (nativeEvent.translationX < 0) {
          setPerformanceType("upcoming");
        } else {
          setPerformanceType("ongoing");
        }
      }
    }
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [
      "performances",
      { endpoint: "pblprfr", params: getSearchParams() },
    ],
    queryFn: fetchPerformances,
    enabled: true,
  });

  useEffect(() => {
    if (data?.items && page === 1) {
      setPerformances(data.items);
    } else if (data?.items) {
      const uniqueIds = new Set(performances.map((p) => p.mt20id));
      const newItems = data.items.filter((item) => !uniqueIds.has(item.mt20id));
      setPerformances([...performances, ...newItems]);
    }
  }, [data]);

  useEffect(() => {
    setPage(1);
    setPerformances([]);
    refetch();
  }, [performanceType]);

  const loadMoreData = () => {
    if (!isLoading && data?.items?.length > 0) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePerformancePress = (item) => {
    navigation.navigate("PerformanceDetails", { item });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handlePerformancePress(item)}
      activeOpacity={0.7}
    >
      <ImageBackground
        style={styles.backgroundImage}
        source={{ uri: item.poster }}
        blurRadius={50}
      >
        <Image
          source={{ uri: item.poster }}
          style={styles.poster}
          resizeMode="contain"
        />
      </ImageBackground>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
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
        <View style={styles.tagContainer}>
          <Text
            style={[
              styles.tag,
              item.prfstate === "공연예정" && styles.upcomingTag,
              item.prfstate === "공연중" && styles.ongoingTag,
              item.prfstate === "공연완료" && styles.completedTag,
            ]}
          >
            {item.prfstate}
          </Text>
          {item.openrun === "Y" && (
            <Text style={[styles.tag, styles.openrunTag]}>오픈런</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>더 많은 공연 불러오는 중...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              performanceType === "ongoing" && styles.activeTab,
            ]}
            onPress={() => setPerformanceType("ongoing")}
          >
            <Text
              style={[
                styles.tabText,
                performanceType === "ongoing" && styles.activeTabText,
              ]}
            >
              진행 중인 공연
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              performanceType === "upcoming" && styles.activeTab,
            ]}
            onPress={() => setPerformanceType("upcoming")}
          >
            <Text
              style={[
                styles.tabText,
                performanceType === "upcoming" && styles.activeTabText,
              ]}
            >
              예정된 공연
            </Text>
          </TouchableOpacity>
        </View>

        {isError ? (
          <View style={styles.errorContainer}>
            <Text>공연 정보를 불러오는데 실패했습니다.</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => refetch()}
            >
              <Text style={styles.retryButtonText}>다시 시도</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <PanGestureHandler
            ref={panRef}
            onHandlerStateChange={onSwipeGestureEvent}
            activeOffsetX={[-20, 20]}
            failOffsetY={[-20, 20]}
          >
            <View style={{ flex: 1 }}>
              <FlatList
                ref={flatListRef}
                data={performances}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.mt20id}-${index}`}
                contentContainerStyle={styles.listContent}
                onEndReached={loadMoreData}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
                removeClippedSubviews={true}
                simultaneousHandlers={panRef}
              />
            </View>
          </PanGestureHandler>
        )}
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  tabContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  tabText: {
    fontFamily: "Pretendard",
    fontSize: 16,
    letterSpacing: -1,
    color: "#666",
  },
  activeTabText: {
    fontWeight: "bold",
    color: "#000",
  },
  listContent: {
    padding: 10,
  },
  itemContainer: {
    marginVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backgroundImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  poster: {
    width: "100%",
    height: 250,
  },
  infoContainer: {
    padding: 15,
  },
  title: {
    fontFamily: "RIDIBatang",
    fontSize: 18,
    letterSpacing: -1,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: "#666",
    width: 40,
  },
  value: {
    fontFamily: "Pretendard",
    fontWeight: "light",
    letterSpacing: -1,
    fontSize: 14,
    flex: 1,
  },
  tagContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  tag: {
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 6,
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
  loadingFooter: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontFamily: "Pretendard",
    fontSize: 14,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  retryButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#4a90e2",
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default PerformanceComingScreen;
