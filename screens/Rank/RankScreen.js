import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useQuery } from "@tanstack/react-query";
import { boxOfficeRequest } from "../../utils/api/performanceApi";
import {
  getBoxofficeStDate,
  UpcomingPerformanceDate,
} from "../../utils/getCurrentDate";
import { Image } from "expo-image";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = height * 0.60;
const SPACING = 0;

export const RankBadge = ({ rank }) => {
  const isTopThree = rank <= 3;

  const badgeColors = {
    1: ["#FFD700", "#FFA500"],
    2: ["#C0C0C0", "#A9A9A9"],
    3: ["#CD7F32", "#8B4513"],
  };

  return (
    <View style={[styles.rankBadge, isTopThree ? {} : styles.regularRank]}>
      {isTopThree ? (
        <LinearGradient colors={badgeColors[rank]} style={styles.topThreeBadge}>
          <Text style={styles.rankText}>{rank}</Text>
        </LinearGradient>
      ) : (
        <Text style={styles.regularRankText}>{rank}</Text>
      )}
    </View>
  );
};

const PerformanceCard = ({ item, index, scrollX, navigation }) => {
  const inputRange = [
    (index - 1) * (CARD_WIDTH + SPACING),
    index * (CARD_WIDTH + SPACING),
    (index + 1) * (CARD_WIDTH + SPACING),
  ];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.8, 1, 0.8],
    extrapolate: "clamp",
  });

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.7, 1, 0.7],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
    >
      <RankBadge rank={index + 1} />
      <Image
        source={{
          uri: item.poster,
        }}
        style={styles.cardImage}
      />

      <BlurView intensity={90} tint="dark" style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.prfnm}
        </Text>
        <Text style={styles.cardSubtitle}>{item.genrenm}</Text>

        <View style={styles.cardDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>장소</Text>
            <Text style={styles.detailValue} numberOfLines={1}>
              {item.prfplcnm} [{item.area}]
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>기간</Text>
            <Text style={styles.detailValue}>{item.prfpd}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.ticketButton}
          onPress={() => navigation.navigate("PerformanceDetails", { item })}
        >
          <Text style={styles.ticketButtonText}>상세보기</Text>
        </TouchableOpacity>
      </BlurView>
    </Animated.View>
  );
};

const RankScreen = ({ navigation }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const searchParams = {
    stdate: getBoxofficeStDate(),
    eddate: UpcomingPerformanceDate(1),
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["boxOffice", { endpoint: "boxoffice", params: searchParams }],
    queryFn: boxOfficeRequest,
    enabled: !!searchParams && Object.keys(searchParams).length > 0,
  });

  // 페이지 인디케이터
  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: true }
  );

  useEffect(() => {
    const listener = scrollX.addListener(({ value }) => {
      const index = Math.round(value / (CARD_WIDTH + SPACING));
      setCurrentIndex(index);
    });

    return () => {
      scrollX.removeListener(listener);
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>공연 순위 정보를 불러오는 중...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          데이터를 불러오는데 문제가 발생했습니다.
        </Text>
        <Text style={styles.errorMessage}>{error?.message}</Text>
      </View>
    );
  }

  // const performances = data?.items || [];

  const rankingData = data?.items.slice(0, 10);
  console.log("rankingData", rankingData);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={{ flexDirection: "row", position: "relative" }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>공연 순위</Text>
          <Text style={styles.headerSubtitle}>
            지금 가장 인기있는 공연을 확인하세요!
          </Text>
        </View>

        <Image
          source={{
            uri: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Party%20Popper.png",
          }}
          style={styles.emoji}
        />
      </View>

      <Animated.ScrollView
        ref={flatListRef}
        horizontal
        pagingEnabled
        snapToInterval={CARD_WIDTH + SPACING}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {rankingData.map((item, index) => (
          <PerformanceCard
            key={item.id || index}
            item={item}
            index={index}
            scrollX={scrollX}
            navigation={navigation}
          />
        ))}
      </Animated.ScrollView>

      <View style={styles.pagination}>
        {rankingData.map((_, index) => {
          const inputRange = [
            (index - 1) * (CARD_WIDTH + SPACING),
            index * (CARD_WIDTH + SPACING),
            (index + 1) * (CARD_WIDTH + SPACING),
          ];

          // 너비 애니메이션을 transform으로 변경
          const scaleX = scrollX.interpolate({
            inputRange,
            outputRange: [0.33, 1, 0.33],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.paginationDot,
                {
                  opacity,
                  transform: [{ scaleX }],
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: Platform.OS === "ios" ? 50 : 30,
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
    color: "#FFFFFF",
    marginBottom: 4,
    lineHeight: 40,
  },
  headerSubtitle: {
    fontFamily: "Pretendard",
    fontSize: 16,
    color: "#FFFFFF99",
    marginBottom: 10,
    lineHeight: 24,
    letterSpacing: -1,
  },
  emoji: {
    position: "absolute",
    width: 100,
    height: 100,
    right: 10,
    top: -30,
    transform: [{ rotate: "0deg" }, { scaleX: -1 }],
    zIndex: 20,
  },
  scrollViewContent: {
    paddingHorizontal: width * 0.075,
    paddingVertical: 10,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: SPACING / 2,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#1E1E1E",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  cardContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  cardTitle: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 14,
    color: "#CCCCCC",
    marginBottom: 16,
  },
  cardDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailLabel: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 12,
    color: "#CCCCCC",
    width: 40,
  },
  detailValue: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 14,
    color: "#FFFFFF",
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  statLabel: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 12,
    color: "#CCCCCC",
    marginTop: 4,
  },
  ticketButton: {
    backgroundColor: "#0A84FF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  ticketButtonText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  rankBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
  },
  topThreeBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  rankText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  regularRank: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  regularRankText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  paginationDot: {
    height: 8,
    width: 24, // 기본 너비를 설정하고 scaleX로 변환
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  loadingText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    color: "#FFFFFF",
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 20,
  },
  errorText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
  },
  errorMessage: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    color: "#FF6B6B",
    marginTop: 8,
    textAlign: "center",
  },
});

export default RankScreen;
