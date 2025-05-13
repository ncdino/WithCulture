import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import PerformanceScreen from "../screens/Performance/PerformanceScreen";
import PerformanceComingScreen from "../screens/Performance/PerformanceComingScreen";
import PerformanceDetailsScreen from "../screens/Performance/PerformanceDetailsScreen";

// Constants
import { SCREENS } from "./navigationConstants";

import { getCommonHeaderOptions } from "./navigationOptions";
import HappyPriceEventScreen from "../screens/event/HappyPriceEventScreen";

const Stack = createStackNavigator();

export default function PerformanceStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={SCREENS.PERFORMANCE}
        component={PerformanceScreen}
        options={({ navigation }) => getCommonHeaderOptions(navigation)}
      />
      <Stack.Screen
        name={SCREENS.PERFORMANCE_COMING}
        component={PerformanceComingScreen}
        options={({ navigation }) => getCommonHeaderOptions(navigation)}
      />
      <Stack.Screen
        name={SCREENS.PERFORMANCE_DETAILS}
        component={PerformanceDetailsScreen}
        options={({ navigation }) =>
          getCommonHeaderOptions(navigation, "공연 상세정보")
        }
      />
      <Stack.Screen
        name={SCREENS.HAPPY_PRICE_EVENT}
        component={HappyPriceEventScreen}
        options={({ navigation }) =>
          getCommonHeaderOptions(navigation, "만원의 행복")
        }
      />
    </Stack.Navigator>
  );
}
