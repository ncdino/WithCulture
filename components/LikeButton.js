import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useLikeStatus,
  useLikeCount,
  useLikeMutation,
} from "../Hooks/useLikes";
import { useAuthStore } from "../store/authStore";

const LikeButton = ({
  performanceId,
  performanceName,
  performancePoster,
  performanceprfpdfrom,
  performanceprfpdto,
  performancefcltynm,
  performancegenrenm,
  size = 24,
  showCount = true,
}) => {
  const { user } = useAuthStore();
  const { data: isLiked, isLoading: isCheckingLike } =
    useLikeStatus(performanceId);
  const {
    data: likeCount,
    isLoading: isCountLoading,
    refetch: isCountRefetch,
  } = useLikeCount(performanceId);
  const { addLike, removeLike, isLoading: isMutating } = useLikeMutation();

  const isLoading = isCheckingLike || isCountLoading || isMutating;

  const handlePress = async () => {
    console.log("like pressed");
    if (!user) {
      alert("좋아요 기능을 사용하려면 로그인이 필요합니다.");
      return;
    }

    if (isLiked) {
      removeLike(performanceId);
      console.log("like removed");
    } else {
      addLike({
        performanceId,
        performanceName,
        performancePoster,
        performanceprfpdfrom,
        performanceprfpdto,
        performancefcltynm,
        performancegenrenm,
      });
      console.log("isLiked ok");
    }

    await isCountRefetch();
  };

  return (
    <View style={styles.buttonWrapper}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={handlePress}
        disabled={isLoading || !user}
      >
        <Ionicons
          name={isLiked ? "heart" : "heart-outline"}
          size={size}
          color={isLiked ? "#FF3B30" : "#FFF7E9"}
        />
        {showCount && <Text style={styles.count}>{likeCount}</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  actionButton: {
    width: 55,
    height: 55,
    borderRadius: 20,
    backgroundColor: "rgba(22, 22, 22, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  count: {
    fontSize: 14,
    color: "#FFF7E9",
    marginTop: 2,
  },
});

export default LikeButton;
