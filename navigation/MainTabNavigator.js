import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// 스택 네비게이터
import HomeStackNavigator from "./HomeStackNavigator";
import PerformanceStackNavigator from "./PerformanceStackNavigator";
import ExhibitionStackNavigator from "./ExhibitionStackNavigator";
import FestivalStackNavigator from "./FestivalStackNavigator";
import FavoritesStackNavigator from "./FavoritesStackNavigator";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "홈") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "공연") {
            iconName = focused ? "ticket" : "ticket-outline";
          } else if (route.name === "전시") {
            iconName = focused ? "easel" : "easel-outline";
          } else if (route.name === "랭킹") {
            iconName = focused ? "trophy" : "trophy-outline";
          } else if (route.name === "즐겨찾기") {
            iconName = focused ? "heart" : "heart-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="홈" component={HomeStackNavigator} />
      <Tab.Screen name="공연" component={PerformanceStackNavigator} />
      <Tab.Screen name="전시" component={ExhibitionStackNavigator} />
      <Tab.Screen name="랭킹" component={FestivalStackNavigator} />
      <Tab.Screen name="즐겨찾기" component={FavoritesStackNavigator} />
    </Tab.Navigator>
  );
}
