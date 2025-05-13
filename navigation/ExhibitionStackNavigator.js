import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import ExhibitionScreen from "../screens/Exhibition/ExhibitionScreen";
import DetailsScreen from "../screens/Exhibition/DetailsScreen";
import NotificationScreen from "../screens/notifications/NotificationScreen";

// Constants
import { SCREENS } from "./navigationConstants";

// header options
import { getCommonHeaderOptions } from "./navigationOptions";

const Stack = createStackNavigator();

export default function ExhibitionStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={SCREENS.EXHIBITION}
        component={ExhibitionScreen}
        options={({ navigation }) => getCommonHeaderOptions(navigation)}
      />
      <Stack.Screen
        name={SCREENS.DETAILS}
        component={DetailsScreen}
        options={({ navigation }) =>
          getCommonHeaderOptions(navigation, "전시 상세")
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
