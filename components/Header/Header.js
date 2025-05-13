import { useState, useRef, useEffect } from "react";
import {
  Image,
  View,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
  TextInput,
  ScrollView,
  Button,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, CommonActions } from "@react-navigation/native";
import useDrawerStore from "../../store/useDrawerStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "../../store/authStore";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.8;

// 로고 컴포넌트
const Logo = () => {
  const navigation = useNavigation();

  const handleNavigateToHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "홈" }],
      })
    );
  };

  return (
    <TouchableOpacity onPress={handleNavigateToHome}>
      <Image
        source={require("../../assets/image/logo/stack_logo.png")}
        style={{
          width: 48,
          height: 48,
          resizeMode: "contain",
          borderRadius: 18,
        }}
      />
    </TouchableOpacity>
  );
};

// 상세 화면 타이틀 컴포넌트
const DetailTitle = ({ title }) => {
  const navigation = useNavigation();

  const handleNavigateToHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "홈" }],
      })
    );
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TouchableOpacity onPress={handleNavigateToHome}>
        <Image
          source={require("../../assets/image/logo/stack_logo.png")}
          style={{
            width: 48,
            height: 48,
            resizeMode: "contain",
            borderRadius: 18,
          }}
        />
      </TouchableOpacity>
      <Text
        style={{
          marginLeft: 10,
          fontSize: 18,
          fontFamily: "Pretendard",
          letterSpacing: -1,
          fontWeight: "bold",
        }}
      >
        {title}
      </Text>
    </View>
  );
};

// 헤더 우측 액션 버튼 컴포넌트
const Actions = () => {
  const navigation = useNavigation();

  const openMenuDrawer = useDrawerStore(
    (state) => state.openMenuDrawer || state.openDrawer
  );
  const openSearchDrawer = useDrawerStore((state) => state.openSearchDrawer);

  // 알림 아이콘 클릭 핸들러 수정
  const handleNotificationPress = () => {
    navigation.navigate("NotificationScreen");
  };

  return (
    <View style={{ flexDirection: "row", gap: 15, marginRight: 15 }}>
      <TouchableOpacity onPress={openSearchDrawer}>
        <Ionicons name="search-outline" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNotificationPress}>
        <Ionicons name="notifications-outline" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={openMenuDrawer}>
        <Ionicons name="menu-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

// 메뉴 드로어 컴포넌트
const MenuDrawer = () => {
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

  const navigation = useNavigation();
  const drawerOpen = useDrawerStore(
    (state) => state.menuDrawerOpen || state.drawerOpen
  );
  const closeDrawer = useDrawerStore(
    (state) => state.closeMenuDrawer || state.closeDrawer
  );

  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  console.log("user info: ", user);

  const handleLogout = async () => {
    await signOut();
  };

  const drawerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(drawerAnimation, {
      toValue: drawerOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [drawerOpen]);

  if (!drawerOpen) return null;

  const translateX = drawerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [DRAWER_WIDTH, 0],
  });

  const menuItems = [
    { id: 1, title: "홈", icon: "home-outline", screen: "홈" },
    { id: 2, title: "공연", icon: "ticket-outline", screen: "공연" },
    { id: 3, title: "전시", icon: "easel-outline", screen: "전시" },
    { id: 4, title: "랭킹", icon: "trophy-outline", screen: "랭킹" },
    { id: 5, title: "즐겨찾기", icon: "heart-outline", screen: "즐겨찾기" },
    { id: 6, title: "설정", icon: "settings-outline" },
  ];

  const handleMenuPress = (item) => {
    closeDrawer();
    if (item.screen) {
      navigation.navigate(item.screen);
    } else if (item.title === "설정") {
      alert("설정 기능 준비 중!");
    }
  };

  return (
    <TouchableOpacity
      style={styles.overlay}
      activeOpacity={1}
      onPress={closeDrawer}
    >
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <TouchableOpacity style={styles.closeButton} onPress={closeDrawer}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>

        <View style={styles.drawerHeader}>
          <Image
            source={require("../../assets/image/logo/stack_logo.png")}
            style={styles.drawerLogo}
          />
          <Text style={styles.drawerTitle}>withCulture.</Text>
        </View>
        {user && (
          <View
            style={{
              borderBottomWidth: 2,
              borderColor: "#dee2e6",
              paddingVertical: 10,
              paddingHorizontal: 15,
              marginBottom: 10,
              gap: 5,
            }}
          >
            <Text
              style={{
                fontFamily: "Pretendard",
                letterSpacing: -1,
                fontSize: 18,
                color: "#495057",
                lineHeight: 20,
              }}
            >
              안녕하세요, {user?.nickname}님 !
            </Text>
            <Text
              style={{
                fontFamily: "Pretendard",
                letterSpacing: -1,
                fontSize: 20,
                lineHeight: 24,
                fontWeight: "bold",
                color: "#212529",
              }}
            >
              {Hi}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#343a40",
                alignItems: "center",
                borderRadius: 10,
              }}
              onPress={handleLogout}
            >
              <Text
                style={{
                  fontFamily: "Pretendard",
                  letterSpacing: -1,
                  fontWeight: "bold",
                  color: "#e9ecef",
                  padding: 7,
                }}
              >
                로그아웃
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {!user && (
          <View
            style={{
              borderBottomWidth: 2,
              borderColor: "#dee2e6",
              paddingVertical: 10,
              paddingHorizontal: 15,
              marginBottom: 10,
              gap: 5,
            }}
          >
            <Text
              style={{
                fontFamily: "Pretendard",
                letterSpacing: -1,
                fontSize: 18,
                color: "#495057",
                lineHeight: 20,
              }}
            >
              반가워요 👋
            </Text>
            <Text
              style={{
                fontFamily: "Pretendard",
                letterSpacing: -1,
                fontSize: 20,
                lineHeight: 24,
                fontWeight: "bold",
                color: "#212529",
              }}
            >
              로그인을 진행해 주세요.
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#343a40",
                alignItems: "center",
                borderRadius: 10,
              }}
              onPress={() => {
                closeDrawer();
                navigation.navigate("Auth", { screen: "SignIn" });
              }}
            >
              <Text
                style={{
                  fontFamily: "Pretendard",
                  letterSpacing: -1,
                  fontWeight: "bold",
                  color: "#e9ecef",
                  padding: 7,
                }}
              >
                로그인
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#343a40",
                alignItems: "center",
                borderRadius: 10,
                marginBottom: 15,
              }}
              onPress={() => {
                closeDrawer();
                navigation.navigate("Auth", { screen: "SignUp" });
              }}
            >
              <Text
                style={{
                  fontFamily: "Pretendard",
                  letterSpacing: -1,
                  fontWeight: "bold",
                  color: "#e9ecef",
                  padding: 7,
                }}
              >
                회원가입
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.drawerContent}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item)}
            >
              <Ionicons name={item.icon} size={24} color="black" />
              <Text style={styles.menuText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// 검색 드로어 컴포넌트
const SearchDrawer = () => {
  const navigation = useNavigation();
  const searchDrawerOpen = useDrawerStore((state) => state.searchDrawerOpen);
  const closeSearchDrawer = useDrawerStore((state) => state.closeSearchDrawer);
  const drawerAnimation = useRef(new Animated.Value(0)).current;
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    Animated.timing(drawerAnimation, {
      toValue: searchDrawerOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    if (searchDrawerOpen) {
      loadRecentSearches();
    }
  }, [searchDrawerOpen]);

  const loadRecentSearches = async () => {
    try {
      const savedSearches = await AsyncStorage.getItem("recentSearches");
      if (savedSearches) setRecentSearches(JSON.parse(savedSearches));
    } catch (error) {
      console.error("최근 검색목록 검색 실패", error);
    }
  };

  if (!searchDrawerOpen) return null;

  const translateX = drawerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [DRAWER_WIDTH, 0],
  });

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      const filteredSearches = recentSearches.filter(
        (item) => item.toLowerCase() !== searchQuery.toLowerCase()
      );
      const updatedSearches = [searchQuery, ...filteredSearches].slice(0, 5);
      setRecentSearches(updatedSearches);

      AsyncStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

      closeSearchDrawer();

      // 수정)) 루트 네비게이터를 통해 SearchResultScreen으로 navigate

      try {
        navigation.navigate("SearchResultScreen", { query: searchQuery });
      } catch (error) {
        console.error("SearchResultScreen으로 네비게이션 실패:", error);
        // 검색 화면이 없는 경우 에러 처리
        Alert.alert("검색", "검색 결과 화면이 준비되지 않았습니다.", [
          { text: "확인" },
        ]);
      }
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    AsyncStorage.removeItem("recentSearches");
  };

  const removeRecentSearch = (index) => {
    const newSearches = [...recentSearches];
    newSearches.splice(index, 1);
    setRecentSearches(newSearches);
    AsyncStorage.setItem("recentSearches", JSON.stringify(newSearches));
  };

  return (
    <TouchableOpacity
      style={styles.overlay}
      activeOpacity={1}
      onPress={closeSearchDrawer}
    >
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={closeSearchDrawer}
        >
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>

        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>검색</Text>
        </View>

        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="gray"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="검색어를 입력하세요"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            autoFocus
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="gray" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.recentSearchesContainer}>
          <View style={styles.recentSearchesHeader}>
            <Text style={styles.recentSearchesTitle}>최근 검색어</Text>
            {recentSearches.length > 0 && (
              <TouchableOpacity onPress={clearRecentSearches}>
                <Text style={styles.clearText}>전체 삭제</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView>
            {recentSearches.length > 0 ? (
              recentSearches.map((item, index) => (
                <View key={index} style={styles.recentSearchItem}>
                  <TouchableOpacity
                    style={styles.recentSearchTextContainer}
                    onPress={() => {
                      setSearchQuery(item);
                      // Automatically search with this term
                      closeSearchDrawer();
                      // 수정된 부분: try-catch로 오류 처리 추가
                      try {
                        navigation.navigate("SearchResultScreen", {
                          query: item,
                        });
                      } catch (error) {
                        console.error(
                          "SearchResultScreen으로 네비게이션 실패:",
                          error
                        );
                        Alert.alert(
                          "검색",
                          "검색 결과 화면이 준비되지 않았습니다.",
                          [{ text: "확인" }]
                        );
                      }
                    }}
                  >
                    <Ionicons name="time-outline" size={20} color="gray" />
                    <Text style={styles.recentSearchText}>{item}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeRecentSearch(index)}>
                    <Ionicons name="close" size={20} color="gray" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.noRecentSearches}>
                최근 검색 내역이 없습니다.
              </Text>
            )}
          </ScrollView>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    zIndex: 1000,
  },
  drawer: {
    width: DRAWER_WIDTH,
    height: "100%",
    backgroundColor: "white",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 5,
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  drawerLogo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    borderRadius: 15,
    marginRight: 10,
  },
  drawerTitle: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 22,
    fontWeight: "ultralight",
  },
  drawerContent: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 5,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 15,
    fontFamily: "Pretendard",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Pretendard",
  },
  recentSearchesContainer: {
    flex: 1,
  },
  recentSearchesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Pretendard",
  },
  clearText: {
    color: "#007AFF",
    fontSize: 14,
    fontFamily: "Pretendard",
  },
  recentSearchItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  recentSearchTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  recentSearchText: {
    fontSize: 15,
    marginLeft: 10,
    fontFamily: "Pretendard",
  },
  noRecentSearches: {
    color: "gray",
    textAlign: "center",
    marginTop: 20,
    fontFamily: "Pretendard",
  },
});

// 헤더 컴포넌트 모음
const Header = {
  Logo,
  DetailTitle,
  Actions,
  MenuDrawer,
  SearchDrawer,
};

export default Header;
