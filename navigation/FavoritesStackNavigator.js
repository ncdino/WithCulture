import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import FavoritesScreen from "../screens/Favorites/FavoritesScreen";
import DetailsScreen from "../screens/Exhibition/DetailsScreen";
import PerformanceDetailsScreen from "../screens/Performance/PerformanceDetailsScreen";
import NotificationScreen from "../screens/notifications/NotificationScreen";

// Constants
import { SCREENS } from "./navigationConstants";

// header options
import { getCommonHeaderOptions } from "./navigationOptions";

const Stack = createStackNavigator();

export default function FavoritesStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={SCREENS.FAVORITES}
        component={FavoritesScreen}
        options={({ navigation }) =>
          getCommonHeaderOptions(navigation, "즐겨찾기")
        }
      />
      <Stack.Screen
        name={SCREENS.DETAILS}
        component={DetailsScreen}
        options={({ navigation }) =>
          getCommonHeaderOptions(navigation, "전시 상세")
        }
      />
      <Stack.Screen
        name={SCREENS.PERFORMANCE_DETAILS}
        component={PerformanceDetailsScreen}
        options={({ navigation }) =>
          getCommonHeaderOptions(navigation, "공연 상세")
        }
      />
    </Stack.Navigator>
  );
}
