import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import useDrawerStore from "../../store/useDrawerStore";
import { UpcomingPerformanceDate } from "../../utils/getCurrentDate";
import { useQuery } from "@tanstack/react-query";
import { fetchPerformances } from "../../utils/api/performanceApi";

export default function SearchResultScreen({ navigation }) {
  const route = useRoute();
  const [query, setQuery] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const openSearchDrawer = useDrawerStore((state) => state.openSearchDrawer);

  // 매개변수 쿼리 초기화
  useEffect(() => {
    if (route.params?.query) {
      const incomingQuery = route.params.query;
      setQuery(incomingQuery);
      setSearchedQuery(incomingQuery);
      console.log("route.params.query : ", incomingQuery);
      console.log("searchedQuery : ", searchedQuery);

      // 최근 검색어 업데이트
      if (incomingQuery.trim() !== "") {
        updateRecentSearches(incomingQuery);

        // drawer 검색어 -> trigger
        refetch({
          queryKey: [
            "performances",
            {
              endpoint: "pblprfr",
              params: {
                stdate: UpcomingPerformanceDate(-90),
                eddate: UpcomingPerformanceDate(90),
                cpage: 1,
                rows: 30,
                shprfnm: incomingQuery,
              },
            },
          ],
        });
      }
    }

    const loadRecentSearches = async () => {
      try {
      } catch (error) {
        console.error("최근 검색어 로드 실패 : ", error);
      }
    };

    loadRecentSearches();
  }, [route.params?.query]);

  // Update recent searches
  const updateRecentSearches = (searchQuery) => {
    const updatedSearches = [
      searchQuery,
      ...recentSearches.filter(
        (item) => item.toLowerCase() !== searchQuery.toLowerCase()
      ),
    ].slice(0, 5);

    setRecentSearches(updatedSearches);

    // AsyncStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const searchFetchParam = {
    stdate: UpcomingPerformanceDate(-90),
    eddate: UpcomingPerformanceDate(90),
    cpage: 1,
    rows: 30,
    shprfnm: route.params.query,
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [
      "performances",
      { endpoint: "pblprfr", params: searchFetchParam },
    ],
    queryFn: fetchPerformances,
    enabled: false,
    onSuccess: () => {
      setQuery("");
      setSearchedQuery("");
      setFilteredData([]);
    },
  });

  useEffect(() => {
    if (data) {
      setFilteredData(data.items);
      // console.log("아이템 데이터 setFilteredData : ", filteredData);
    } else {
      console.log("아이템 데이터 없음");
    }
  }, [data]);

  if (isError) {
    console.error("error");
  }

  const handleSearch = () => {
    if (query.trim() !== "") {
      setSearchedQuery(query);
      console.log("query: ");
      console.log("현재 query : ", searchedQuery);
      updateRecentSearches(query);

      refetch({
        queryKey: [
          "performances",
          {
            endpoint: "pblprfr",
            params: {
              stdate: UpcomingPerformanceDate(-90),
              eddate: UpcomingPerformanceDate(90),
              cpage: 1,
              rows: 30,
              shprfnm: searchedQuery,
            },
          },
        ],
      });
      // console.log(data);
    }
  };

  // console.log("아이템 데이터 : ", filteredData);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
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
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery("")}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="gray" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>검색</Text>
        </TouchableOpacity>
      </View>

      {searchedQuery ? (
        <>
          <Text style={styles.resultHeader}>
            "{searchedQuery}" 검색결과 ({filteredData.length})
          </Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>검색 중...</Text>
            </View>
          ) : filteredData.length > 0 ? (
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.mt20id}
              extraData={filteredData}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() =>
                    navigation.navigate("PerformanceDetails", { item })
                  }
                >
                  {item.poster && item.poster.length > 0 && (
                    <Image
                      source={{ uri: item.poster }}
                      style={styles.itemImage}
                    />
                  )}
                  <View style={styles.itemTextContainer}>
                    <Text style={styles.itemCategory}>
                      {item.genrenm ? item.genrenm : "장르 없음"}
                    </Text>
                    <Text style={styles.itemTitle}>
                      {item.prfnm ? item.prfnm : "무제"}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={styles.noResultsContainer}>
              <Ionicons name="search-outline" size={64} color="#dddddd" />
              <Text style={styles.noResultsText}>검색 결과가 없습니다</Text>
              <Text style={styles.noResultsSubtext}>
                다른 검색어로 시도해보세요
              </Text>
            </View>
          )}
        </>
      ) : (
        <View style={styles.recentSearchesContainer}>
          <View style={styles.recentSearchesHeader}>
            <Text style={styles.recentSearchesTitle}>최근 검색어</Text>
            {recentSearches.length > 0 && (
              <TouchableOpacity onPress={() => setRecentSearches([])}>
                <Text style={styles.clearText}>전체 삭제</Text>
              </TouchableOpacity>
            )}
          </View>

          {recentSearches.length > 0 ? (
            recentSearches.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentSearchItem}
                onPress={() => {
                  setQuery(item);
                  setSearchedQuery(item);
                  handleSearch();
                }}
              >
                <View style={styles.recentSearchTextContainer}>
                  <Ionicons name="time-outline" size={20} color="gray" />
                  <Text style={styles.recentSearchText}>{item}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    const newSearches = [...recentSearches];
                    newSearches.splice(index, 1);
                    setRecentSearches(newSearches);
                  }}
                >
                  <Ionicons name="close" size={20} color="gray" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noRecentSearches}>
              최근 검색 내역이 없습니다.
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 10,
    flex: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Pretendard",
  },
  clearButton: {
    padding: 5,
  },
  searchButton: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: "Pretendard",
  },
  resultHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    fontFamily: "Pretendard",
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 16,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemCategory: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    fontFamily: "Pretendard",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Pretendard",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    fontFamily: "Pretendard",
  },
  noResultsSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
    color: "#666",
    fontFamily: "Pretendard",
  },
});
