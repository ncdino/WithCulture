import { useQuery } from "@tanstack/react-query";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import { fetchPerformances } from "../../../utils/api/performanceApi";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function PerformanceHallInfo({ hallId }) {
  const { data, isLoading, error } = useQuery({
    queryKey: [
      "performances",
      { endpoint: "prfplc", hallId: hallId, urlStructure: "concerthall" },
    ],
    queryFn: fetchPerformances,
    enabled: !!hallId,
  });

  if (isLoading) {
    console.log("데이터 로딩 중...");
    return <Text>Loading...</Text>;
  }

  if (error) {
    console.error("error: ", error);
  }

  if (data && data.items && data.items.length > 0) {
    const item = data.items[0];
    console.log("item: ", item);
    const hasSubVenues = item.mt13s[0] && Array.isArray(item.mt13s[0].mt13);
    console.log(item.mt13s[0]);

    const openURL = (url) => {
      Linking.openURL(url);
    };

    const openMap = () => {
      const url = `https://www.google.com/maps/search/?api=1&query=${item.la},${item.lo}`;
      Linking.openURL(url);
    };

    const callNumber = () => {
      Linking.openURL(`tel:${item.telno}`);
    };

    console.log(item.parkinglot);

    const renderAmenities = () => {
      const amenities = [
        { name: "레스토랑", value: item.restaurant[0], icon: "restaurant" },
        { name: "카페", value: item.cafe[0], icon: "coffee" },
        { name: "편의점", value: item.store[0], icon: "store" },
        { name: "놀이방", value: item.nolibang[0], icon: "child-care" },
        { name: "수유실", value: item.suyu[0], icon: "baby-changing-station" },
        { name: "주차시설", value: item.parkinglot[0], icon: "local-parking" },
      ];

      return (
        <View style={styles.amenitiesContainer}>
          {amenities.map((item, index) => (
            <View key={index} style={styles.amenityItem}>
              <MaterialIcons
                name={item.icon}
                size={24}
                color={item.value === "Y" ? "#3498db" : "#ccc"}
              />
              <Text
                style={[
                  styles.amenityText,
                  item.value === "Y"
                    ? styles.amenityAvailable
                    : styles.amenityUnavailable,
                ]}
              >
                {item.name}
              </Text>
            </View>
          ))}
        </View>
      );
    };

    const renderAccessibility = () => {
      const accessibility = [
        {
          name: "장애인 주차장",
          value: item.parkbarrier[0],
          icon: "accessible-forward",
        },
        { name: "장애인 화장실", value: item.restbarrier[0], icon: "wc" },
        { name: "경사로", value: item.runwbarrier[0], icon: "trending-up" },
        { name: "엘리베이터", value: item.elevbarrier[0], icon: "elevator" },
      ];

      return (
        <View style={styles.accessibilityContainer}>
          {accessibility.map((item, index) => (
            <View key={index} style={styles.accessibilityItem}>
              <MaterialIcons
                name={item.icon}
                size={24}
                color={item.value === "Y" ? "#2ecc71" : "#ccc"}
              />
              <Text
                style={[
                  styles.accessibilityText,
                  item.value === "Y"
                    ? styles.accessibilityAvailable
                    : styles.accessibilityUnavailable,
                ]}
              >
                {item.name}
              </Text>
            </View>
          ))}
        </View>
      );
    };

    // console.log(hasSubVenues);

    // console.log(Array.isArray(item.mt13s.mt13));
    // console.log(item.mt13s.mt13.length > 0);

    return (
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.overlay}>
            <Text style={styles.venueName}>{item.fcltynm}</Text>
            <Text style={styles.venueType}>{item.fcltychartr}</Text>
          </View>
        </View>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={callNumber}>
            <Ionicons name="call" size={22} color="#fff" />
            <Text style={styles.actionText}>전화</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => openURL(item.relateurl)}
          >
            <Ionicons name="globe" size={22} color="#fff" />
            <Text style={styles.actionText}>웹사이트</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={openMap}>
            <Ionicons name="location" size={22} color="#fff" />
            <Text style={styles.actionText}>지도</Text>
          </TouchableOpacity>
        </View>

        {/* 기본정보 시작 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>기본 정보</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons
                name="calendar"
                size={18}
                color="#3498db"
                style={styles.infoIcon}
              />
              <Text style={styles.infoLabel}>개관연도</Text>
              <Text style={styles.infoValue}>{item.opende}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons
                name="people"
                size={18}
                color="#3498db"
                style={styles.infoIcon}
              />
              <Text style={styles.infoLabel}>총 좌석 수</Text>
              <Text style={styles.infoValue}>
                {item.seatscale.toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons
                name="business"
                size={18}
                color="#3498db"
                style={styles.infoIcon}
              />
              <Text style={styles.infoLabel}>공연장 수</Text>
              <Text style={styles.infoValue}>{item.mt13cnt}</Text>
            </View>
          </View>
          <View style={styles.addressContainer}>
            <Ionicons
              name="location-outline"
              size={18}
              color="#3498db"
              style={styles.infoIcon}
            />
            <Text style={styles.addressText}>{item.adres}</Text>
          </View>
        </View>

        {/* 편의시설 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>편의 시설</Text>
          {renderAmenities()}
        </View>

        {/* 장애인 접근성 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>장애인 접근성</Text>
          {renderAccessibility()}
        </View>

        {/* 공연장 목록 */}
        {hasSubVenues && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>공연장 목록</Text>
            {item.mt13s[0].mt13.map((venue, index) => (
              <View key={index} style={styles.subVenueCard}>
                <Text style={styles.subVenueName}>{venue.prfplcnm}</Text>
                <View style={styles.subVenueInfo}>
                  <View style={styles.subVenueRow}>
                    <Text style={styles.subVenueLabel}>좌석 규모:</Text>
                    <Text style={styles.subVenueValue}>
                      {typeof venue.seatscale === "number"
                        ? venue.seatscale.toLocaleString()
                        : venue.seatscale}
                    </Text>
                  </View>

                  <View style={styles.subVenueRow}>
                    <Text style={styles.subVenueLabel}>장애인 좌석:</Text>
                    <Text style={styles.subVenueValue}>
                      {venue.disabledseatscale
                        ? venue.disabledseatscale
                        : "없음"}
                    </Text>
                  </View>

                  {venue.stagearea && (
                    <View style={styles.subVenueRow}>
                      <Text style={styles.subVenueLabel}>무대 규모:</Text>
                      <Text style={styles.subVenueValue}>
                        {venue.stagearea}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.subVenueFacilities}>
                  <View style={styles.facilityItem}>
                    <FontAwesome5
                      name="drum"
                      size={16}
                      color={venue.stageorchat[0] === "Y" ? "#3498db" : "#ccc"}
                    />
                    <Text style={styles.facilityText}>오케스트라피트</Text>
                  </View>
                  <View style={styles.facilityItem}>
                    <MaterialIcons
                      name="fitness-center"
                      size={16}
                      color={venue.stagepracat[0] === "Y" ? "#3498db" : "#ccc"}
                    />
                    <Text style={styles.facilityText}>연습실</Text>
                  </View>
                  <View style={styles.facilityItem}>
                    <FontAwesome5
                      name="paint-brush"
                      size={16}
                      color={venue.stagedresat[0] === "Y" ? "#3498db" : "#ccc"}
                    />
                    <Text style={styles.facilityText}>분장실</Text>
                  </View>
                  <View style={styles.facilityItem}>
                    <FontAwesome5
                      name="tree"
                      size={16}
                      color={venue.stageoutdrat[0] === "Y" ? "#3498db" : "#ccc"}
                    />
                    <Text style={styles.facilityText}>야외공연장</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    );
  } else {
    console.log("data fetched error");
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerContainer: {
    position: "relative",
    width: "100%",
    height: 80,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#161616",
    padding: 15,
  },
  venueName: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  venueType: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    color: "#e0e0e0",
    fontSize: 14,
    marginTop: 4,
  },
  quickActionsContainer: {
    flexDirection: "row",
    backgroundColor: "#545454",
    justifyContent: "space-around",
    paddingVertical: 12,
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    color: "#fff",
    marginTop: 4,
    fontSize: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 3,
    borderRadius: 30,
    padding: 16,
    margin: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: "YeongdoBold",
    letterSpacing: -1,
    fontSize: 18,
    marginBottom: 12,
    color: "#333",
    lineHeight: 30,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
    flexDirection: "column",
  },
  infoIcon: {
    marginBottom: 4,
  },
  infoLabel: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
  },
  addressText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    flex: 1,
    marginLeft: 8,
    lineHeight: 20,
    color: "#333",
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  amenityItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 16,
  },
  amenityText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    marginTop: 4,
    fontSize: 12,
    textAlign: "center",
  },
  amenityAvailable: {
    color: "#3498db",
    fontWeight: "500",
  },
  amenityUnavailable: {
    color: "#999",
  },
  accessibilityContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  accessibilityItem: {
    width: "45%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  accessibilityText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    marginLeft: 8,
    fontSize: 14,
  },
  accessibilityAvailable: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    color: "#2ecc71",
    fontWeight: "500",
  },
  accessibilityUnavailable: {
    color: "#999",
  },
  subVenueCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  subVenueName: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subVenueInfo: {
    marginBottom: 12,
  },
  subVenueRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  subVenueLabel: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    width: 80,
    fontSize: 14,
    color: "#666",
  },
  subVenueValue: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  subVenueFacilities: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
  },
  facilityItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: 8,
  },
  facilityText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    marginLeft: 8,
    fontSize: 13,
    color: "#555",
  },
});
