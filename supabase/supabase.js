import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
// import "react-native-url-polyfill/auto";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;
console.log("✅ SUPABASE URL:", process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log("✅ SUPABASE KEY:", process.env.EXPO_PUBLIC_SUPABASE_KEY);

const isWeb = Platform.OS === "web";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: isWeb ? undefined : AsyncStorage, // 웹에서는 storage 설정 X
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const addLike = async (
  performanceId,
  profileId,
  performanceName,
  performancePoster,
  performanceprfpdfrom,
  performanceprfpdto,
  performancefcltynm,
  performancegenrenm
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("user id(현재 로그인): ", user?.id);
  const { data, error } = await supabase
    .from("likes")
    .insert([
      {
        performance_id: performanceId,
        profile_id: profileId,
        performance_name: performanceName,
        performance_poster: performancePoster,
        performance_prfpdfrom: performanceprfpdfrom,
        performance_prfpdto: performanceprfpdto,
        performance_fcltynm: performancefcltynm,
        performance_genrenm: performancegenrenm,
      },
    ])
    .select();

  console.log("addliked response: ", { data, error });

  if (error) {
    console.error("Error adding like:", error);
    throw error;
  }

  return data[0];
};

// 좋아요 삭제하기
export const removeLike = async (performanceId, profileId) => {
  const { error } = await supabase
    .from("likes")
    .delete()
    .match({ performance_id: performanceId, profile_id: profileId });

  if (error) throw error;
  return true;
};

// 사용자가 공연을 좋아요 했는지 확인
export const checkIfLiked = async (performanceId, profileId) => {
  const { data, error } = await supabase
    .from("likes")
    .select()
    .match({ performance_id: performanceId, profile_id: profileId });

  if (error) throw error;
  return data.length > 0;
};

// 공연의 좋아요 수 가져오기
export const getLikeCount = async (performanceId) => {
  const { data, count, error } = await supabase
    .from("likes")
    .select("", { count: "exact" })
    .eq("performance_id", String(performanceId));

  if (error) throw error;
  console.log("🟢 Likes fetched:", data);
  console.log("🔢 Like count:", count);

  return count;
};

// 사용자가 좋아요한 공연 목록 가져오기
export const getLikedPerformances = async (profileId) => {
  const { data, error } = await supabase
    .from("likes")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false }); // 최신순 정렬 (선택)

  if (error) {
    console.error("Error fetching liked performances:", error);
    throw error;
  }

  return data;
};

export const getSwiperFeaturedEvents = async () => {
  const { data, error } = await supabase
    .from("featured_events")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  console.log("getSwiperFeaturedEvents : ", data);
  return data;
};
