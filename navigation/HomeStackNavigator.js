import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import HomeScreen from "../screens/Home/HomeScreen";
import PerformanceScreen from "../screens/Performance/PerformanceScreen";
import ExhibitionScreen from "../screens/Exhibition/ExhibitionScreen";
import PerformanceComingScreen from "../screens/Performance/PerformanceComingScreen";
import PerformanceDetailsScreen from "../screens/Performance/PerformanceDetailsScreen";
import DetailsScreen from "../screens/Exhibition/DetailsScreen";
import HappyPriceEventScreen from "../screens/event/HappyPriceEventScreen";
import NotificationScreen from "../screens/notifications/NotificationScreen";

// Constants
import { SCREENS } from "./navigationConstants";

// header options
import { getCommonHeaderOptions } from "./navigationOptions";

const Stack = createStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={SCREENS.HOME}
        component={HomeScreen}
        options={({ navigation }) => getCommonHeaderOptions(navigation)}
      />
      <Stack.Screen
        name={SCREENS.PERFORMANCE}
        component={PerformanceScreen}
        options={({ navigation }) =>
          getCommonHeaderOptions(navigation, "공연 정보")
        }
      />
      <Stack.Screen
        name={SCREENS.EXHIBITION}
        component={ExhibitionScreen}
        options={({ navigation }) =>
          getCommonHeaderOptions(navigation, "Exhibition")
        }
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
        name={SCREENS.DETAILS}
        component={DetailsScreen}
        options={({ navigation }) =>
          getCommonHeaderOptions(navigation, "상세정보")
        }
      />
      <Stack.Screen
        name={SCREENS.HAPPY_PRICE_EVENT}
        component={HappyPriceEventScreen}
        options={({ navigation }) =>
          getCommonHeaderOptions(navigation, "만원의 행복")
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
