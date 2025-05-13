import { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from "react-native";
import PerformanceHorizontalList from "./PerformanceHorizontalList";
import {
  getBoxofficeStDate,
  UpcomingPerformanceDate,
} from "../../utils/getCurrentDate";
import Swiper from "react-native-swiper";
import { featuredEvents } from "../Home/HomeScreen";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import BoxOfficeHorizontalList from "../boxOffice/BoxOfficeHorizontalList";

const PerformanceScreen = ({ route, navigation }) => {
  const params = route.params || {};
  const { category, signgucode, signgucodesub } = route.params || {};

  const paramValue = params.category ?? params.signgucode;

  useEffect(() => {
    console.log("PerformanceScreen 렌더링됨!");
    console.log("paramValue:", paramValue);
  }, [paramValue]);

  const renderSwiperItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.swiperSlide}
      onPress={() => navigation.navigate("EventDetail", { eventId: item.id })}
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

  const searchBoxOfficeList = () => {
    const boxOfficeParams = [
      {
        stdate: getBoxofficeStDate(),
        eddate: UpcomingPerformanceDate(1),
      },
    ];

    if (paramValue && paramValue.length > 0 && category !== undefined) {
      console.log("[boxOffice] 파라미터는 'category'입니다. 값:", category);
      return boxOfficeParams.map((params) => ({
        ...params,
        catecode: paramValue,
      }));
    } else if (
      paramValue &&
      paramValue.length > 0 &&
      signgucode !== undefined
    ) {
      console.log("[boxOffice] 파라미터는 'signgucode'입니다. 값:", signgucode);
      return boxOfficeParams.map((params) => ({
        ...params,
        area: paramValue,
      }));
    } else {
      console.log("[boxOffice] category 또는 signgucode 파라미터가 없습니다.");

      return boxOfficeParams;
    }
  };

  const searchParamsList = () => {
    const baseParams = [
      {
        stdate: UpcomingPerformanceDate(-9999),
        eddate: UpcomingPerformanceDate(1),
        prfstate: "02",
        cpage: 1,
        rows: 10,
      },
      {
        stdate: UpcomingPerformanceDate(1),
        eddate: UpcomingPerformanceDate(30),
        cpage: 1,
        rows: 10,
      },
    ];

    if (paramValue && paramValue.length > 0 && category !== undefined) {
      console.log("파라미터는 'category'입니다. 값:", category);
      return baseParams.map((params) => ({ ...params, shcate: paramValue }));
    } else if (
      paramValue &&
      paramValue.length > 0 &&
      signgucode !== undefined
    ) {
      console.log("파라미터는 'signgucode'입니다. 값:", signgucode);
      return baseParams.map((params) => ({
        ...params,
        signgucode: paramValue,
      }));
    } else {
      console.log("category 또는 signgucode 파라미터가 없습니다.");

      return baseParams;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>공연 정보</Text>
          <Text style={styles.headerSubtitle}>
            최신 공연과 전시 소식을 확인하세요
          </Text>
        </View>
        <Image
          source={{
            uri: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Admission%20Tickets.png",
          }}
          style={{
            position: "absolute",
            width: 100,
            height: 100,
            right: 10,
            top: -10,
            transform: [{ rotate: "45deg" }, { scaleX: -1 }],
            zIndex: 20,
          }}
        />
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
        <PerformanceHorizontalList
          navigation={navigation}
          searchParams={searchParamsList()[0] || {}}
          endpoint={"pblprfr"}
          title="진행 중인 공연"
        />

        <PerformanceHorizontalList
          navigation={navigation}
          searchParams={searchParamsList()[1] || {}}
          endpoint={"pblprfr"}
          title="예정된 공연"
        />
        <BoxOfficeHorizontalList
          navigation={navigation}
          title={"박스오피스 순위"}
          endpoint={"boxoffice"}
          searchParams={searchBoxOfficeList()[0] || {}}
          isRanking={true}
        />
        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 50 : 30,
  },
  scrollView: {
    flex: 1,
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
  spacer: {
    height: 30,
  },
  // swiper
  swiperContainer: {
    height: 160,
    marginBottom: 16,
    paddingHorizontal: 15,
  },
  swiper: {
    height: 320,
  },
  swiperSlide: {
    flex: 1,
    justifyContent: "flex-end",
    overflow: "hidden",
    borderRadius: 16,
  },
  swiperImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    borderRadius: 16,
  },
  swiperTitle: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  swiperSubtitle: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    color: "#fff",
    fontSize: 12,
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
    marginLeft: 3,
    marginRight: 3,
  },
  pagination: {
    bottom: 10,
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
});

export default PerformanceScreen;
