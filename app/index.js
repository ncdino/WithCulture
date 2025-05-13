import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Platform, View, ActivityIndicator, Alert } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { supabase } from "../supabase/supabase";

// Store
import { useAuthStore } from "../store/authStore";

// Navigation
import AppNavigator from "../navigation/AppNavigator";

// Components
import Header from "../components/Header/Header";

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
      cacheTime: 1000 * 60 * 30,
    },
  },
});

export default function App() {
  if (Platform.OS !== "web") {
    SplashScreen.preventAutoHideAsync();
  }

  async function registerForpushNotificationsAsync() {
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert("알림 권한이 필요합니다");
        return null;
      }

      const token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "a32c1b31-43e6-41b7-a484-4c860e33c148",
        })
      ).data;
      console.log("push token: ", token);
      return token;
    } else {
      Alert.alert("푸시 알림은 기기에서만 지원됩니다.");
      return null;
    }
  }

  const { isLoading, loadSession } = useAuthStore();
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    Pretendard: require("../assets/fonts/PretendardVariable.ttf"),
    MapoFlowerIsland: require("../assets/fonts/MapoFlowerIsland.ttf"),
    RIDIBatang: require("../assets/fonts/RIDIBatang.otf"),
    YeongdoRegular: require("../assets/fonts/YeongdoOTF-Regular.otf"),
    YeongdoBold: require("../assets/fonts/YeongdoOTF-Bold.otf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        await loadSession();
        const { user } = useAuthStore.getState();

        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id;
        const token = await registerForpushNotificationsAsync();

        if (userId && token) {
          console.log("token 존재");

          // 기존 동일 토큰을 다른 유저가 갖고 있다면 삭제
          await supabase
            .from("fcm_tokens")
            .delete()
            .neq("profile_id", userId)
            .eq("fcm_token", token);

          // 같은 유저가 동일 디바이스 타입으로 저장한 기존 토큰 삭제
          await supabase
            .from("fcm_tokens")
            .delete()
            .eq("profile_id", userId)
            .eq("device_type", Platform.OS);

          // 새 토큰 저장
          const { error } = await supabase.from("fcm_tokens").upsert(
            {
              fcm_token: token,
              profile_id: userId,
              device_type: Platform.OS,
            },
            {
              onConflict: "fcm_token",
              // if)) fcm_token이 PK가 아니고 다른 unique constraint 이름이라면 그 명시
            }
          );

          if (error) {
            console.error("FCM token save failed :", error);
          } else {
            console.log("FCM token saved successfully");
          }
        }
      } catch (e) {
        console.warn("알 수 없는 오류 발생:", e);
      } finally {
        if (fontsLoaded) {
          setAppIsReady(true);
          if (Platform.OS !== "web") {
            SplashScreen.hideAsync();
          }
        }
      }
    }

    prepare();
  }, [loadSession, fontsLoaded]);

  if (!appIsReady || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <QueryClientProvider client={queryClient}>
          <AppNavigator />
          <Header.MenuDrawer />
          <Header.SearchDrawer />
        </QueryClientProvider>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}
