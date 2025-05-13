import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Share,
  Platform,
  Alert,
} from "react-native";
import { useLikedPerformances } from "../../Hooks/useLikes";
import { Feather, AntDesign } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;

export default function FavoritesScreen({ navigation }) {
  const { data: likedList, isLoading, isError } = useLikedPerformances();
  const [activeTab, setActiveTab] = useState("모든 공연");

  // 장르 필터
  const getFilteredList = () => {
    if (activeTab === "모든 공연" || !likedList) return likedList;

    if (activeTab === "연극") {
      return likedList.filter((item) => item.performance_genrenm === "연극");
    } else if (activeTab === "무용") {
      return likedList.filter(
        (item) =>
          item.performance_genrenm === "무용" ||
          item.performance_genrenm === "대중무용"
      );
    } else if (activeTab === "클래식") {
      return likedList.filter(
        (item) => item.performance_genrenm === "서양음악(클래식)"
      );
    } else if (activeTab === "국악") {
      return likedList.filter(
        (item) => item.performance_genrenm === "한국음악(국악)"
      );
    } else if (activeTab === "대중음악") {
      return likedList.filter(
        (item) => item.performance_genrenm === "대중음악"
      );
    } else if (activeTab === "복합") {
      return likedList.filter((item) => item.performance_genrenm === "복합");
    } else if (activeTab === "서커스/마술") {
      return likedList.filter(
        (item) => item.performance_genrenm === "서커스/마술"
      );
    } else if (activeTab === "뮤지컬") {
      return likedList.filter((item) => item.performance_genrenm === "뮤지컬");
    }

    return likedList;
  };

  const filteredList = getFilteredList();

  // 공유
  const handleShare = async (performance) => {
    try {
      const performanceName = performance.performance_name || "공연 정보";
      const venue = performance.performance_fcltynm || "정보 없음";
      const schedule =
        `${performance.performance_prfpdfrom || ""} - ${
          performance.performance_prfpdto || ""
        }` || "정보 없음";
      const genre = performance.performance_genrenm || "공연";

      let shareOptions = {};

      const shareUrl = `https://google.com/search?q=${encodeURIComponent(
        performanceName
      )}`;

      if (Platform.OS === "ios") {
        shareOptions = {
          title: `${performanceName} - 공연 정보`,
          message: `[${performanceName}]\n\n장소: ${venue}\n일정: ${schedule}\n장르: ${genre}\n\n이 공연을 함께 관람하세요!`,
          url: shareUrl,
        };

        if (performance.performance_poster) {
          try {
            const localUri =
              FileSystem.cacheDirectory + `${performance.id || "temp"}.jpg`;
            await FileSystem.downloadAsync(
              performance.performance_poster,
              localUri
            );
            shareOptions.url = localUri;
          } catch (error) {
            console.log("이미지 다운로드 실패:", error);
          }
        }
      } else {
        // android,
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

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }
  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <AntDesign name="exclamationcircleo" size={64} color="#000" />
        <Text style={styles.errorTitle}>앗, 오류가 발생했어요</Text>
        <Text style={styles.errorDescription}>
          즐겨찾기 목록을 불러오는데 문제가 발생했습니다
        </Text>
        <TouchableOpacity style={styles.retryButton}>
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }
  // Empty State 레이아웃 수정 필요
  const EmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Image
        source={require("../../assets/icon/Map.png")}
        style={styles.emptyStateImage}
      />
      <Text style={styles.emptyStateTitle}>아직 저장한 공연이 없어요</Text>
      <Text style={styles.emptyStateDescription}>
        관심있는 공연을 찾아 하트를 누르면{"\n"}이곳에 저장됩니다
      </Text>
      <TouchableOpacity
        style={styles.explorePerfButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.explorePerfButtonText}>공연 둘러보기</Text>
      </TouchableOpacity>
    </View>
  );

  const TabButton = ({ title, active, style }) => (
    <TouchableOpacity
      style={[styles.tabButton, active && styles.activeTabButton, style]}
      onPress={() => setActiveTab(title)}
    >
      <Text
        style={[styles.tabButtonText, active && styles.activeTabButtonText]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const ShareButton = ({ item }) => (
    <TouchableOpacity
      style={styles.actionButton}
      onPress={() => handleShare(item)}
    >
      <Feather name="share-2" size={18} color="#fff" />
    </TouchableOpacity>
  );

  const HeaderComponent = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>즐겨찾기</Text>
        <Text style={styles.headerSubtitle}>
          다시 보고 싶은 공연들을 모아두세요!
        </Text>
      </View>
      <Image
        source={{
          uri: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Beating%20Heart.png",
        }}
        style={{
          position: "absolute",
          width: 80,
          height: 80,
          right: 10,
          top: -10,
          zIndex: 20,
        }}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {[
          "모든 공연",
          "연극",
          "무용",
          "클래식",
          "대중음악",
          "복합",
          "서커스/마술",
          "뮤지컬",
        ].map((tab, index, array) => (
          <TabButton
            key={tab}
            title={tab}
            active={activeTab === tab}
            style={index === array.length - 1 ? { marginRight: 0 } : {}}
          />
        ))}
      </ScrollView>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {likedList?.length === 0 ? (
        <>
          <HeaderComponent />
          <EmptyState />
        </>
      ) : (
        <FlatList
          data={filteredList}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={HeaderComponent}
          stickyHeaderIndices={[]} // 스크롤에 따라 헤더도 같이 이동하도록 sticky 기능 제거
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.performanceCard}
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate("PerformanceDetails", {
                  mt20id: item.performance_id,
                })
              }
            >
              <Image
                source={{
                  uri: item.performance_poster || "null",
                }}
                style={styles.cardImage}
                resizeMode="cover"
              />

              <View style={styles.cardOverlay}>
                <View style={styles.cardInfo}>
                  <Text style={styles.performanceTitle} numberOfLines={2}>
                    {item.performance_name}
                  </Text>
                  <View style={styles.performanceMetaContainer}>
                    <View style={styles.performanceMeta}>
                      <Feather
                        name="map-pin"
                        size={14}
                        color="#fff"
                        style={styles.metaIcon}
                      />
                      <Text style={styles.metaText}>
                        {item.performance_fcltynm || "장소 정보 없음"}
                      </Text>
                    </View>
                    <View style={styles.performanceMeta}>
                      <Feather
                        name="calendar"
                        size={14}
                        color="#fff"
                        style={styles.metaIcon}
                      />
                      <Text style={styles.metaText}>
                        {item.performance_prfpdfrom +
                          "-" +
                          item.performance_prfpdto || "일정 정보 없음"}
                      </Text>
                    </View>
                    <View style={styles.performanceMeta}>
                      <Feather
                        name="tag"
                        size={14}
                        color="#fff"
                        style={styles.metaIcon}
                      />
                      <Text style={styles.metaText}>
                        {item.performance_genrenm || "장르"}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.cardActions}>
                  <ShareButton item={item} />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 50 : 30,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  loadingText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    marginTop: 16,
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  errorTitle: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    marginTop: 16,
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  errorDescription: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    marginTop: 8,
    fontSize: 15,
    color: "#666",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#000",
    borderRadius: 30,
  },
  retryButtonText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontFamily: "YeongdoBold",
    letterSpacing: -1,
    fontSize: 32,
    color: "#000",
    marginBottom: 4,
    lineHeight: 40,
  },
  headerSubtitle: {
    fontFamily: "Pretendard",
    fontSize: 16,
    color: "#495057",
    marginBottom: 10,
    lineHeight: 24,
    letterSpacing: -1,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 0,
    marginBottom: 16,
  },
  tabButton: {
    height: 40,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12, // 탭 간격 조정
    backgroundColor: "#f3f4f6",
  },
  activeTabButton: {
    backgroundColor: "#000",
  },
  tabButtonText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  activeTabButtonText: {
    color: "#fff",
  },
  contentContainer: {
    paddingBottom: 32,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emptyStateImage: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
  },
  explorePerfButton: {
    paddingVertical: 15,
    paddingHorizontal: 28,
    backgroundColor: "#000",
    borderRadius: 30,
  },
  explorePerfButtonText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  performanceCard: {
    width: CARD_WIDTH,
    height: 220,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 20,
    alignSelf: "center",
    backgroundColor: "#000",
    elevation: 5,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  cardOverlay: {
    flex: 1,
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "space-between",
  },
  cardInfo: {
    flex: 1,
    justifyContent: "flex-end",
  },
  performanceTitle: {
    fontFamily: "RIDIBatang",
    letterSpacing: -1,
    fontSize: 22,
    // fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  performanceMetaContainer: {
    marginBottom: 10,
  },
  performanceMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  metaIcon: {
    marginRight: 6,
  },
  metaText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
});
