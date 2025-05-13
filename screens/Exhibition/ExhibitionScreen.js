import React, { useState } from "react";
import {
  View,
  LogBox,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TextInput,
  Button,
} from "react-native";

import { useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchExhibition,
  EntityEncoding,
} from "../../utils/api/performanceApi";
import { useNavigation, useRoute } from "@react-navigation/native";
import { formatDate } from "../../utils/DateTimeFormater";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Selector from "../../components/DropDownPicker";
import { sidoData, serviceNameData } from "../../utils/data/FilterData";

const ExhibitionScreen = () => {
  const route = useRoute();

  const navigation = useNavigation();
  const [sido, setSido] = useState("");
  const [serviceTp, setServiceTp] = useState("");
  const [keyword, setKeyword] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSidoChange = (value) => {
    setSido(value);
  };
  const handleServiceTPChange = (value) => {
    setServiceTp(value);
  };

  const [searchParams, setSearchParams] = useState({
    endpoint: "area",
    params: {},
  });

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["exhibition", searchParams],
    queryFn: ({ pageParam = 1 }) =>
      fetchExhibition({
        queryKey: ["exhibition", searchParams],
        pageParam,
      }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const handleSearch = () => {
    const updatedParams = {};

    if (sido) updatedParams.sido = sido;
    if (serviceTp) updatedParams.serviceTp = serviceTp;
    if (keyword.trim()) updatedParams.keyword = keyword;

    setSearchParams((prev) => ({
      ...prev,
      params: Object.keys(updatedParams).length > 0 ? updatedParams : undefined,
    }));

    refetch();

    setSido("");
    setServiceTp("");
    setKeyword("");
  };

  const handleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  if (isLoading) return <ActivityIndicator size="large" />;

  if (error) return <Text>데이터를 불러오는 중 오류 발생</Text>;

  const renderItem = ({ item }) => {
    return (
      <View style={styles.renderList}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Details", { item })}
          style={{ flexDirection: "column", alignItems: "center" }}
        >
          <Image source={{ uri: item.thumbnail }} style={styles.image} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.period}>
            {formatDate(item.startDate)} ~ {formatDate(item.endDate)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      {isOpen ? (
        <FontAwesome
          name="close"
          size={24}
          color="white"
          onPress={() => {
            handleIsOpen();
          }}
          style={styles.filter}
        />
      ) : (
        <FontAwesome
          name="search"
          size={24}
          color="white"
          onPress={() => {
            handleIsOpen();
          }}
          style={styles.filter}
        />
      )}
      {isOpen && (
        <View>
          <View style={styles.filterContainer}>
            <Selector
              onValueChange={handleSidoChange}
              placeholder="지역을 선택하세요"
              data={sidoData}
              containerStyle={{ width: "48%", borderColor: "transparent" }}
            />
            <Selector
              onValueChange={handleServiceTPChange}
              placeholder="분야를 선택하세요"
              data={serviceNameData}
              containerStyle={{ width: "48%" }}
            />
          </View>
          <View>
            <TextInput
              style={styles.input}
              placeholder="검색어 입력"
              value={keyword}
              onChangeText={setKeyword}
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
            >
              <Text style={styles.searchButtonText}>검색</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <FlatList
          data={data?.pages.flatMap((page) => page.items) || []}
          keyExtractor={(item) => item.seq.toString()}
          renderItem={renderItem}
          onEndReached={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator size="small" /> : null
          }
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  filter: {
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 10,
    padding: 15,
    borderWidth: 1,
    borderRadius: 9999,
    margin: 15,
    borderColor: "#493D9E",
    backgroundColor: "#493D9E",
  },
  searchButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderColor: "#B03052",
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
    fontFamily: "Pretendard",
    letterSpacing: -1,
  },
  renderList: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 300,
    resizeMode: "stretch",
    borderRadius: 20,
    alignItems: "center",
  },
  title: {
    fontFamily: "RIDIBatang",
    marginTop: 5,
    fontSize: 16,
    textAlign: "center",
    letterSpacing: -1,
  },
  period: {
    color: "#808080",
    textAlign: "center",
  },
});

export default ExhibitionScreen;
