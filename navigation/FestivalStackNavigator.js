import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import RankScreen from "../screens/Rank/RankScreen";
import PerformanceDetailsScreen from "../screens/Performance/PerformanceDetailsScreen";
import NotificationScreen from "../screens/notifications/NotificationScreen";

// Constants
import { SCREENS } from "./navigationConstants";

// header options
import { getCommonHeaderOptions } from "./navigationOptions";

const Stack = createStackNavigator();

export default function FestivalStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={SCREENS.FESTIVAL}
        component={RankScreen}
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
        name={SCREENS.NOTIFICATIONS}
        component={NotificationScreen}
        options={({ navigation }) => getCommonHeaderOptions(navigation)}
      />
    </Stack.Navigator>
  );
}
