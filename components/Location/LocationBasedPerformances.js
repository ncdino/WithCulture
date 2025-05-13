import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { fetchPerformances } from "../../utils/api/performanceApi";
import {
  getBoxofficeStDate,
  UpcomingPerformanceDate,
} from "../../utils/getCurrentDate";
import { REGIONSUB_CODES, REGION_CODES } from "../../utils/data/FilterData";

// 좌표 -> 지역으로 변환
const getRegionFromCoords = async (latitude, longitude) => {
  try {
    const response = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (response && response.length > 0) {
      console.log(response);
      const { region, city, district } = response[0];
      return {
        location: region || city,
        district: city === null ? district : district || city,
      };
    }
    return null;
  } catch (error) {
    console.error("지역 변환 중 오류 발생:", error);
    return null;
  }
};

const LocationBasedPerformances = ({
  endpoint,
  navigation,
  onLoadComplete,
}) => {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [subRegion, setSubRegion] = useState(null);
  const [signgucodeSearchParams, setSigngucodeSearchParams] = useState({});
  const [signgusubcodeSearchParams, setSigngusubcodeSearchParams] = useState(
    {}
  );
  const [locationError, setLocationError] = useState(null);
  const [isComponentReady, setIsComponentReady] = useState(false);

  // 현재 위치 가져오기
  const getLocation = async () => {
    try {
      setLocationError(null);

      // 위치 권한 요청
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("위치 접근 권한이 필요합니다");
        if (onLoadComplete) onLoadComplete(); // Even with error, inform parent component we've finished loading
        return;
      }

      // 위치 가져오기
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // 좌표로부터 지역 정보 가져오기
      const regionName = await getRegionFromCoords(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );

      setRegion(regionName.location);
      setSubRegion(regionName.district);

      console.log(regionName);
      console.log("지역명 전체 : ", regionName);
      console.log("지역명 합체 :", regionName.location + regionName.district);

      // 지역 코드 매핑
      if (regionName.location && REGION_CODES[regionName.location]) {
        setSigngucodeSearchParams({
          stdate: getBoxofficeStDate(),
          eddate: UpcomingPerformanceDate(7),
          prfstate: "01",
          cpage: 1,
          rows: 6,
          signgucode: REGION_CODES[regionName.location],
        });
      } else {
        setLocationError("지역 정보를 찾을 수 없습니다");
        if (onLoadComplete) onLoadComplete();
      }

      if (
        regionName.location &&
        regionName.district &&
        REGIONSUB_CODES[regionName.location + regionName.district]
      ) {
        setSigngusubcodeSearchParams({
          stdate: getBoxofficeStDate(),
          eddate: UpcomingPerformanceDate(7),
          cpage: 1,
          prfstate: "01",
          rows: 4,
          signgucodesub: REGIONSUB_CODES[region + subRegion],
        });
      }
    } catch (error) {
      console.error("위치 가져오기 오류:", error);
      setLocationError(
        "위치 정보를 가져올 수 없습니다. 네트워크를 확인해주세요."
      );
      if (onLoadComplete) onLoadComplete(); // Even with error, inform parent component we've finished loading
    }
  };

  // 컴포넌트 마운트 시 위치 정보 가져오기
  useEffect(() => {
    getLocation();
  }, []);

  // API 데이터 가져오기
  const {
    data: signgucodeData,
    isLoading: signgucodeLoading,
    isError: signgucodeError,
    isSuccess: signgucodeSuccess,
    refetch: signgucodeRefetch,
  } = useQuery({
    queryKey: [
      "performances",
      { endpoint: endpoint, params: signgucodeSearchParams },
    ],
    queryFn: fetchPerformances,
    enabled:
      !!signgucodeSearchParams &&
      Object.keys(signgucodeSearchParams).length > 0,
  });

  // 서브 코드 데이터
  const {
    data: signgucodesubData,
    isLoading: signgucodesubLoading,
    isError: signgucodesubError,
    isSuccess: signgucodesubSuccess,
    refetch: signgucodesubRefetch,
  } = useQuery({
    queryKey: [
      "performances",
      { endpoint: endpoint, params: signgusubcodeSearchParams },
    ],
    queryFn: fetchPerformances,
    enabled:
      !!signgusubcodeSearchParams &&
      Object.keys(signgusubcodeSearchParams).length > 0,
  });

  useEffect(() => {
    const locationDataReady =
      locationError ||
      signgucodeSuccess ||
      signgucodeError ||
      (signgucodesubSuccess && signgucodeSuccess);

    if (locationDataReady && !isComponentReady) {
      setIsComponentReady(true);
      if (onLoadComplete) {
        // Small delay to ensure UI is ready
        setTimeout(() => {
          onLoadComplete();
        }, 300);
      }
    }
  }, [
    locationError,
    signgucodeSuccess,
    signgucodeError,
    signgucodesubSuccess,
    isComponentReady,
  ]);

  useEffect(() => {
    if (signgucodeSuccess) {
      console.log("데이터 패치 성공:", signgucodeData);
    }
  }, [signgucodeSuccess, signgucodeData]);

  const handleSeeMore = () => {
    console.log(
      "REGIONSUB_CODES[region + subRegion]: ",
      REGIONSUB_CODES[region + subRegion]
    );
    if (navigation) {
      navigation.navigate("PerformanceScreen", {
        signgucode: REGION_CODES[region],
        signgucodesub: REGIONSUB_CODES[region + subRegion],
      });
    } else {
      console.log("더 많은 공연 정보 요청:", signgucodeSearchParams);
    }
  };

  // 공연 아이템 렌더링
  const PerformanceCard = ({ item }) => (
    <TouchableOpacity
      style={styles.performanceCard}
      onPress={() => navigation.navigate("PerformanceDetails", { item })}
      activeOpacity={1}
    >
      <View style={{ width: 200, height: 200 }}>
        <Image source={{ uri: item.poster }} style={styles.cardImage} />
      </View>
    </TouchableOpacity>
  );

  const PerformanceList = ({ performanceSigngucode }) => {
    const rows = [];
    for (let i = 0; i < performanceSigngucode.length; i += 2) {
      rows.push(
        <View
          key={i}
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: 5,
          }}
        >
          <View style={{ flex: 1, marginHorizontal: 5 }}>
            <PerformanceCard
              key={`${performanceSigngucode[i].mt20id}-${i}`}
              item={performanceSigngucode[i]}
            />
          </View>
          {performanceSigngucode[i + 1] && (
            <View style={{ flex: 1, marginHorizontal: 5 }}>
              <PerformanceCard
                key={`${performanceSigngucode[i + 1].mt20id}-${i + 1}`}
                item={performanceSigngucode[i + 1]}
              />
            </View>
          )}
        </View>
      );
    }

    return <View>{rows}</View>;
  };

  // 위치 갱신 버튼
  const RefreshButton = () => (
    <TouchableOpacity style={styles.refreshButton} onPress={getLocation}>
      <MaterialIcons name="location-on" size={22} color="#ffffff" />
      <Text style={styles.refreshText}>위치 갱신</Text>
    </TouchableOpacity>
  );

  // 더보기 버튼
  const SeeMoreButton = () => (
    <TouchableOpacity style={styles.seeMoreButton} onPress={handleSeeMore}>
      <Text style={styles.seeMore}>더 보기</Text>
      <Ionicons name="chevron-forward" size={20} color="#5c6bc0" />
    </TouchableOpacity>
  );

  // 로딩 상태 렌더링
  const renderLoading = () => (
    <View style={styles.statusContainer}>
      <ActivityIndicator size="large" color="#5c6bc0" />
      <Text style={styles.statusText}>주변 공연 정보를 찾는 중...</Text>
    </View>
  );

  // 에러 상태 렌더링
  const renderError = () => (
    <View style={styles.statusContainer}>
      <MaterialIcons name="error-outline" size={40} color="#e74c3c" />
      <Text style={styles.errorText}>
        데이터를 불러오는데 문제가 발생했습니다
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={getLocation}>
        <Text style={styles.retryText}>다시 시도</Text>
      </TouchableOpacity>
    </View>
  );

  // 위치 오류 렌더링
  const renderLocationError = () => (
    <View style={styles.statusContainer}>
      <MaterialIcons name="location-off" size={40} color="#e74c3c" />
      <Text style={styles.errorText}>{locationError}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={getLocation}>
        <Text style={styles.retryText}>다시 시도</Text>
      </TouchableOpacity>
    </View>
  );

  // 빈 데이터 렌더링
  const renderEmpty = () => (
    <View style={styles.statusContainer}>
      <MaterialIcons name="theaters" size={40} color="#9e9e9e" />
      <Text style={styles.emptyText}>잠시만 기다려주세요!</Text>
      <Text style={styles.emptyText}>
        현재 공연을 불러오고 있거나 근처에 진행 중인 공연이 없습니다.
      </Text>
    </View>
  );

  const performanceSigngucode = signgucodeData?.items || [];
  const performanceSigngucodesub = signgucodesubData?.items || [];

  console.log("시군구코드 : ", performanceSigngucodesub);

  if (locationError) {
    return renderLocationError();
  }

  if (signgucodeLoading) {
    return renderLoading();
  }

  if (signgucodeError) {
    return renderError();
  }

  return (
    <View style={styles.container}>
      <View style={styles.locationHeader}>
        <View style={styles.titleContainer}>
          <MaterialIcons name="location-on" size={22} color="#5c6bc0" />
          <Text style={styles.locationText}>
            {region || subRegion
              ? `${region} ${subRegion}`
              : "위치 정보가 없습니다"}
          </Text>
        </View>
        <RefreshButton />
      </View>

      <View style={styles.header}>
        <View style={styles.subTitleContainer}>
          <Text style={styles.headerTitle}>
            <Text style={styles.headerTitleHighlight}>{subRegion}</Text>의
            공연들을 모아봤어요 !
          </Text>
          <SeeMoreButton />
        </View>
      </View>

      {/* 서브 지역 공연 목록 */}
      {performanceSigngucodesub.length > 0 ? (
        <View style={{ flex: 1 }}>
          <PerformanceList performanceSigngucode={performanceSigngucodesub} />
        </View>
      ) : (
        renderEmpty()
      )}

      <View style={{ flex: 1, padding: 20 }}></View>

      {/* 메인 지역 공연 목록 */}
      <View style={styles.header}>
        <View style={styles.subTitleContainer}>
          <Text style={styles.headerTitle}>
            <Text style={styles.headerTitleHighlight}>{region}</Text> 곳곳의
            공연들이에요
          </Text>
          <SeeMoreButton />
        </View>
      </View>

      {performanceSigngucode.length > 0 ? (
        <View style={{ flex: 1 }}>
          <PerformanceList performanceSigngucode={performanceSigngucode} />
        </View>
      ) : (
        renderEmpty()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 0,
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 40,
    borderWidth: 2,
    borderRadius: 20,
    marginHorizontal: 16,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  headerSigngu: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  titleContainer: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  subTitleContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  MainTitleView: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: "Pretendard",
    fontSize: 18,
    fontWeight: "light",
    letterSpacing: -1,
    color: "#333",
    lineHeight: 24,
    marginLeft: 10,
  },
  locationText: {
    fontFamily: "Pretendard",
    fontSize: 18,
    fontWeight: "light",
    letterSpacing: -1,
    color: "#333",
    lineHeight: 24,
    marginLeft: 10,
  },
  dateTitle: {
    alignSelf: "flex-end",
    fontFamily: "Pretendard",
    fontSize: 12,
    fontWeight: "light",
    letterSpacing: -1,
    color: "#555",
    lineHeight: 24,
  },
  headerTitleHighlight: {
    fontFamily: "Pretendard",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: -1,
    color: "#333",
    lineHeight: 24,
    marginLeft: 10,
  },
  seeMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  seeMore: {
    fontFamily: "Pretendard",
    fontWeight: "light",
    color: "#333",
    letterSpacing: -1,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5c6bc0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  refreshText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    color: "#fff",
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "600",
  },
  performanceList: {
    flex: 1,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  performanceCard: {
    flexDirection: "row",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 15,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  title: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  venueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  venue: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  statusContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    height: 200,
  },
  statusText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  errorText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    marginTop: 12,
    fontSize: 14,
    color: "#e74c3c",
    textAlign: "center",
  },
  emptyText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    marginTop: 12,
    fontSize: 14,
    color: "#9e9e9e",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: "#5c6bc0",
    borderRadius: 20,
  },
  retryText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default LocationBasedPerformances;
