import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import SignInScreen from "../screens/auth/SignInScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";

// Constants
import { SCREENS } from "./navigationConstants";

const AuthStack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name={SCREENS.SIGN_IN} component={SignInScreen} />
      <AuthStack.Screen name={SCREENS.SIGN_UP} component={SignUpScreen} />
    </AuthStack.Navigator>
  );
}
