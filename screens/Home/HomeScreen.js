import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import Swiper from "react-native-swiper";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import LocationBasedPerformances from "../../components/Location/LocationBasedPerformances";
import { useAuthStore } from "../../store/authStore";

const { width } = Dimensions.get("window");

export const featuredEvents = [
  {
    id: "1",
    title: '뮤지컬 "레미제라블" 내한공연',
    image:
      "https://cdn.imweb.me/upload/S202303202661dcbb4dbed/ae05558857710.png",
    date: "2025.04.15 - 2025.05.20",
    venue: "세종문화회관",
  },
  {
    id: "2",
    title: "모네: 빛을 그리다",
    image:
      "https://i0.wp.com/blog.rightbrain.co.kr/wp-content/uploads/2017/12/mone.jpg?fit=1279%2C579&ssl=1",
    date: "2025.03.01 - 2025.06.30",
    venue: "국립현대미술관",
  },
  {
    id: "3",
    title: '국립발레단 "지젤"',
    image:
      "https://www.korean-national-ballet.kr/upload/performance/gallery/1112/eca780eca0a420476973656c6c6520e293924b4f5245414e204e4154494f4e414c2042414c4c45542070686f746f2062792042414b692031202d20ebb3b5ec82acebb3b8.jpg?v=u0P99Ze",
    date: "2025.04.10 - 2025.04.12",
    venue: "예술의전당",
  },
];

const categories = [
  {
    id: "1",
    name: "연극",
    icon: require("../../assets/genre/performance.png"),
    genre: "AAAA",
  },
  {
    id: "BBBC",
    name: "무용",
    icon: require("../../assets/genre/dance.png"),
    genre: "BBBC",
  },
  {
    id: "2",
    name: "대중무용",
    icon: require("../../assets/genre/dae-dance.png"),
    genre: "BBBE",
  },
  {
    id: "3",
    name: "클래식",
    icon: require("../../assets/genre/classic.png"),
    genre: "CCCA",
  },
  {
    id: "4",
    name: "국악",
    icon: require("../../assets/genre/korean.png"),
    genre: "CCCC",
  },
  {
    id: "5",
    name: "대중음악",
    icon: require("../../assets/genre/dae-music.png"),
    genre: "CCCD",
  },
  {
    id: "6",
    name: "복합",
    icon: require("../../assets/genre/composite.png"),
    genre: "EEEA",
  },
  {
    id: "7",
    name: "서커스/마술",
    icon: require("../../assets/genre/circus.png"),
    genre: "EEEB",
  },
  {
    id: "8",
    name: "뮤지컬",
    icon: require("../../assets/genre/musical.png"),
    genre: "GGGA",
  },
  {
    id: "10",
    name: "전시",
    icon: require("../../assets/genre/exhibition.png"),
    genre: "10",
  },
];

const areas = [
  {
    id: "0",
    area: "서울",
    icon: null,
    code: "11",
    iconImage: require("../../assets/image/areaiconImage/seoul.webp"),
  },
  {
    id: "1",
    area: "부산",
    icon: null,
    code: "26",
    iconImage: require("../../assets/image/areaiconImage/busan.webp"),
  },
  {
    id: "2",
    area: "대구",
    icon: null,
    code: "27",
    iconImage: require("../../assets/image/areaiconImage/daegu.webp"),
  },
  {
    id: "3",
    area: "인천",
    icon: null,
    code: "28",
    iconImage: require("../../assets/image/areaiconImage/daegu.webp"),
  },
  {
    id: "4",
    area: "광주",
    icon: null,
    code: "29",
    iconImage: require("../../assets/image/areaiconImage/gwangju.webp"),
  },
  {
    id: "5",
    area: "대전",
    icon: null,
    code: "30",
    iconImage: require("../../assets/image/areaiconImage/daejeon.webp"),
  },
  {
    id: "6",
    area: "울산",
    icon: null,
    code: "31",
    iconImage: require("../../assets/image/areaiconImage/ulsan.webp"),
  },
  {
    id: "7",
    area: "세종",
    icon: null,
    code: "36",
    iconImage: require("../../assets/image/areaiconImage/sejong.webp"),
  },
  {
    id: "8",
    area: "경기",
    icon: null,
    code: "41",
    iconImage: require("../../assets/image/areaiconImage/kyeongki.webp"),
  },
  {
    id: "9",
    area: "강원",
    icon: null,
    code: "51",
    iconImage: require("../../assets/image/areaiconImage/daegu.webp"),
  },
  {
    id: "10",
    area: "충북",
    icon: null,
    code: "43",
    iconImage: require("../../assets/image/areaiconImage/chungbuk.webp"),
  },
  {
    id: "11",
    area: "충남",
    icon: null,
    code: "44",
    iconImage: require("../../assets/image/areaiconImage/chungnam.webp"),
  },
  {
    id: "12",
    area: "전북",
    icon: null,
    code: "45",
    iconImage: require("../../assets/image/areaiconImage/jeonbuk.webp"),
  },
  {
    id: "13",
    area: "전남",
    icon: null,
    code: "46",
    iconImage: require("../../assets/image/areaiconImage/jeonnam.webp"),
  },
  {
    id: "14",
    area: "경북",
    icon: null,
    code: "47",
    iconImage: require("../../assets/image/areaiconImage/daegu.webp"),
  },
  {
    id: "15",
    area: "경남",
    icon: null,
    code: "48",
    iconImage: require("../../assets/image/areaiconImage/daegu.webp"),
  },
  {
    id: "16",
    area: "제주",
    icon: null,
    code: "50",
    iconImage: require("../../assets/image/areaiconImage/jeju.webp"),
  },
];

export default function HomeScreen({ navigation }) {
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [isLocationLoaded, setIsLocationLoaded] = useState(false);
  const { user } = useAuthStore();
  const [Hi, setHi] = useState("");

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();

    if (hours >= 6 && hours < 12) {
      setHi("오늘도 활기찬 하루 시작하세요!🌞");
    } else if (hours >= 12 && hours < 13) {
      setHi("즐거운 점심 되세요.💡");
    } else if (hours >= 13 && hours < 18) {
      setHi("나른한 오후, 여기서 잠시 쉬어가세요.✨");
    } else {
      setHi("편안한 저녁 시간 보내세요.🌙");
    }
  }, []);

  useEffect(() => {
    if (isLocationLoaded) {
      const timer = setTimeout(() => {
        setIsFullyLoaded(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isLocationLoaded]);

  // 초기 0.5초 delay

  // 위치정보 로드 완료 핸들러
  const handleLocationLoaded = () => {
    setIsLocationLoaded(true);
  };

  // 로딩 중일 때 렌더링되는 화면
  if (!isLocationLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Image
          source={{
            uri: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Writing%20Hand%20Light%20Skin%20Tone.png",
          }}
          style={{ width: 100, height: 100 }}
        />
        <Text style={{ fontFamily: "YeongdoBold", fontSize: 24 }}>
          주변 공연 정보를 불러오는 중...
        </Text>

        {/* Hidden LocationBasedPerformances to start loading it */}
        <View style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}>
          <LocationBasedPerformances
            endpoint={"pblprfr"}
            navigation={navigation}
            onLoadComplete={handleLocationLoaded}
          />
        </View>
      </View>
    );
  }

  // 위치 우선 load 후, 나머지 컴포넌트 로드
  if (!isFullyLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Only show the location component first */}
          <LocationBasedPerformances
            endpoint={"pblprfr"}
            navigation={navigation}
          />

          <View style={styles.loadingRemainder}>
            <ActivityIndicator size="large" color="#5c6bc0" />
            <Text style={styles.loadingText}>추가 컨텐츠 로딩 중...</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // 전체 로딩 완료
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {user ? (
          <View style={styles.helloHeader}>
            <Text style={styles.helloHeaderTitle}>안녕하세요!</Text>
            <Text style={styles.helloheaderHighlightSubtitle}>
              {`${user.nickname}님, `}
              <Text style={styles.helloheaderSubtitle}>{Hi}</Text>
            </Text>
          </View>
        ) : (
          <View style={styles.helloHeader}>
            <Text style={styles.helloHeaderTitle}>반가워요!</Text>
            <Text style={styles.helloheaderSubtitle}>
              지역별, 장르별 맞춤 공연 정보를 통해 나만의 공연을 찾아보세요.
            </Text>
            <View style={styles.signContainer}>
              <TouchableOpacity
                style={styles.loginContainer}
                onPress={() => {
                  navigation.navigate("Auth", { screen: "SignIn" });
                }}
              >
                <Text style={styles.loginText}>로그인</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.loginContainer}
                onPress={() => {
                  navigation.navigate("Auth", { screen: "SignUp" });
                }}
              >
                <Text style={styles.loginText}>회원가입</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <Image
          source={{
            uri: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Waving%20Hand.png",
          }}
          style={{
            position: "absolute",
            width: 50,
            height: 50,
            right: 10,
            top: -10,
            transform: [{ rotate: "0deg" }, { scaleX: 1 }],
            zIndex: 20,
          }}
        />
        {/* 상단 Swiper */}
        <View style={styles.swiperContainer}>
          <Swiper
            style={styles.swiper}
            autoplay
            autoplayTimeout={5}
            dot={<View style={styles.dot} />}
            activeDot={<View style={styles.activeDot} />}
            paginationStyle={styles.pagination}
            loop
          >
            {featuredEvents.map((item) => renderSwiperItem(item))}
          </Swiper>
        </View>

        {/* 카테고리 아이콘 */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>
            평소 관심 있었던{" "}
            <Text style={styles.sectionTitleHighlightText}>장르</Text>의 공연이
            있으신가요?
          </Text>
        </View>
        <View style={styles.categoryContainer}>
          {categories.map((item) => renderCategoryItem(item))}
        </View>

        <LocationBasedPerformances
          endpoint={"pblprfr"}
          navigation={navigation}
        />

        {/* 지역별 이벤트 */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>
            <Text style={styles.sectionTitleHighlightText}>다른 지역</Text>의
            공연도 궁금하다면?
          </Text>
        </View>
        <View style={styles.categoryContainer}>
          {areas.map((item) => renderAreaCard(item))}
        </View>

        {/* 여백 */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );

  function renderSwiperItem(item) {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.swiperSlide}
        onPress={() => navigation.navigate("EventDetail", { eventId: item.id })}
        activeOpacity={1}
      >
        <Image source={{ uri: item.image }} style={styles.swiperImage} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.textGradient}
        >
          <Text style={styles.swiperTitle}>{item.title}</Text>
          <Text style={styles.swiperSubtitle}>
            {item.date} | {item.venue}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  function renderCategoryItem(item) {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.categoryItem}
        onPress={() => {
          if (item.id === "10") {
            navigation.navigate("ExhibitionScreen");
          } else if (item.id === "11") {
            navigation.navigate("FestivalScreen");
          } else {
            navigation.navigate("PerformanceScreen", { category: item.genre });
          }
        }}
        activeOpacity={1}
      >
        <View style={styles.iconContainer}>
          <Image source={item.icon} style={{ width: 48, height: 48 }} />
        </View>
        <Text style={styles.categoryName}>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  function renderAreaCard(item) {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.areaItem}
        onPress={() => {
          navigation.navigate("PerformanceScreen", { signgucode: item.code });
          console.log("sigungucode:", item.code);
        }}
        activeOpacity={0.9}
      >
        <View style={styles.areaView}>
          <Text style={styles.areaName}>{item.area}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  signContainer: { flex: 1, flexDirection: "row", gap: 5 },
  loginContainer: {
    backgroundColor: "#343a40",
    alignItems: "center",
    borderRadius: 10,
    flex: 1 / 2,
  },
  loginText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontWeight: "bold",
    color: "#e9ecef",
    padding: 7,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 50 : 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleHeader: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
    lineHeight: 28,
  },
  subtitleHeader: {
    fontFamily: "Pretendard",
    fontSize: 16,
    color: "#000",
    fontWeight: "ultralight",
    marginBottom: 10,
    lineHeight: 24,
    letterSpacing: -1,
  },
  helloHeader: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  helloHeaderTitle: {
    fontFamily: "YeongdoBold",
    letterSpacing: -1,
    fontSize: 32,
    // fontWeight: "700",
    color: "#000",
    marginBottom: 4,
    lineHeight: 40,
  },
  helloheaderSubtitle: {
    fontFamily: "Pretendard",
    fontSize: 14,
    color: "#495057",
    marginBottom: 10,
    lineHeight: 24,
    letterSpacing: -1,
  },
  helloheaderHighlightSubtitle: {
    fontFamily: "Pretendard",
    fontWeight: "bold",
    fontSize: 16,
    color: "#495057",
    marginBottom: 10,
    letterSpacing: -1,
  },
  headerTitle: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  swiperContainer: {
    height: 320,
    marginBottom: 16,
  },
  swiper: {
    height: 320,
  },
  swiperSlide: {
    flex: 1,
    justifyContent: "flex-end",
  },
  swiperImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  textGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    paddingHorizontal: 16,
    paddingBottom: 24,
    justifyContent: "flex-end",
  },
  swiperTitle: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  swiperSubtitle: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    color: "#fff",
    fontSize: 14,
  },
  dot: {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    width: 10,
    height: 10,
    borderRadius: 7,
    marginLeft: 3,
    marginRight: 3,
  },
  activeDot: {
    backgroundColor: "#fff",
    width: 20,
    height: 10,
    borderRadius: 6,
    marginLeft: 4,
    marginRight: 4,
  },
  pagination: {
    bottom: 10,
  },
  sectionTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitleText: {
    fontFamily: "Pretendard",
    fontSize: 16,
    fontWeight: "ultralight",
    letterSpacing: -1,
    color: "#333",
    lineHeight: 24,
    marginLeft: 10,
  },
  sectionTitleHighlightText: {
    fontFamily: "Pretendard",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: -1,
    color: "#333",
    lineHeight: 24,
    marginLeft: 10,
  },
  viewAllText: {
    fontSize: 14,
    color: "#666",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    paddingHorizontal: 4,
    paddingBottom: 10,
  },
  categoryItem: {
    width: width / 6,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  areaItem: {
    width: width / 6,
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 16,
    gap: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  areaIconContainer: {
    width: "100%",
    height: 100,
    borderRadius: 25,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryName: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 12,
    color: "#333",
  },
  areaView: {
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderColor: "transparent",
    backgroundColor: "#DDDDDD",
  },
  areaName: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 14,
    color: "#000",
  },
  recommendedContainer: {
    paddingHorizontal: 16,
  },
  eventCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  eventImage: {
    width: 100,
    height: 120,
  },
  eventInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  eventTitle: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  eventDetails: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  eventPrice: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 14,
    fontWeight: "500",
    color: "#222",
    marginTop: 4,
  },
  locationBanner: {
    height: 150,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  locationBannerImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  blurView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 16,
  },
  locationButton: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  locationText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
