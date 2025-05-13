import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addLike,
  removeLike,
  checkIfLiked,
  getLikeCount,
  getLikedPerformances,
} from "../supabase/supabase";
import { useAuthStore } from "../store/authStore";

export function useLikeStatus(performanceId) {
  const { user } = useAuthStore();
  const profileId = user?.id;
  console.log("user: ", profileId);

  return useQuery({
    queryKey: ["likeStatus", performanceId, profileId],
    queryFn: () => checkIfLiked(performanceId, profileId),
    enabled: !!profileId, // 로그인 정보 없으면 enabled
  });
}

export function useLikeCount(performanceId) {
  return useQuery({
    queryKey: ["likeCount", performanceId],
    queryFn: () => getLikeCount(performanceId),
  });
}

export function useLikeMutation() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const profileId = user?.id;

  const addLikeMutation = useMutation({
    mutationFn: ({
      performanceId,
      performanceName,
      performancePoster,
      performanceprfpdfrom,
      performanceprfpdto,
      performancefcltynm,
      performancegenrenm,
    }) =>
      addLike(
        performanceId,
        profileId,
        performanceName,
        performancePoster,
        performanceprfpdfrom,
        performanceprfpdto,
        performancefcltynm,
        performancegenrenm
      ),
    onSuccess: (_, performanceId) => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries(["likeStatus", performanceId, profileId]);
      queryClient.invalidateQueries(["likeCount", performanceId]);
      queryClient.invalidateQueries(["likedPerformances", profileId]);
    },
  });

  const removeLikeMutation = useMutation({
    mutationFn: (performanceId) => removeLike(performanceId, profileId),
    onSuccess: (_, performanceId) => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries(["likeStatus", performanceId, profileId]);
      queryClient.invalidateQueries(["likeCount", performanceId]);
      queryClient.invalidateQueries(["likedPerformances", profileId]);
    },
  });

  return {
    addLike: addLikeMutation.mutate,
    removeLike: removeLikeMutation.mutate,
    isLoading: addLikeMutation.isPending || removeLikeMutation.isPending,
  };
}

export function useLikedPerformances() {
  const { user } = useAuthStore();
  const profileId = user?.id;

  return useQuery({
    queryKey: ["likedPerformances", profileId],
    queryFn: () => getLikedPerformances(profileId),
    enabled: !!profileId,
  });
}
