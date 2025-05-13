import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// 네비게이터
import AuthNavigator from "./AuthNavigator";
import MainTabNavigator from "./MainTabNavigator";

// Screens
import SearchResultScreen from "../screens/search/SearchResultScreen";
import PerformanceDetailsScreen from "../screens/Performance/PerformanceDetailsScreen";

// Constants
import { SCREENS } from "./navigationConstants";

// header options
import { getCommonHeaderOptions } from "./navigationOptions";

const RootStack = createStackNavigator();

export default function AppNavigator() {
  return (
    <RootStack.Navigator
      screenOptions={{ headerShown: false, presentation: "modal" }}
    >
      <RootStack.Screen name="Main" component={MainTabNavigator} />
      <RootStack.Screen
        name={SCREENS.SEARCH_RESULT}
        component={SearchResultScreen}
        options={({ navigation }) => ({
          headerShown: true,
          ...getCommonHeaderOptions(navigation, "검색 결과"),
        })}
      />
      <RootStack.Screen
        name={SCREENS.PERFORMANCE_DETAILS}
        component={PerformanceDetailsScreen}
        options={({ navigation }) => ({
          headerShown: true,
          ...getCommonHeaderOptions(navigation, "공연 상세"),
        })}
      />
      <RootStack.Screen name="Auth" component={AuthNavigator} />
    </RootStack.Navigator>
  );
}
