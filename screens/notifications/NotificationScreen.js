import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../supabase/supabase";
import { useAuthStore } from "../../store/authStore";
import { useNavigation } from "@react-navigation/native";

const NotificationScreen = () => {
  const { user } = useAuthStore.getState();
  const { user: userinfo } = useAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("sent_at", { ascending: false });

      if (error) {
        console.error("알림을 가져오는 중 오류 발생:", error.message);
      } else {
        setNotifications(data || []);
      }
    } catch (error) {
      console.error("알림을 가져오는 중 오류 발생:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  // 알림 읽음 처리 함수
  const markAsRead = async (id) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", id);

      if (error) {
        console.error("읽음 처리 실패:", error.message);
      } else {
        // 로컬 상태 업데이트
        setNotifications(
          notifications.map((notification) =>
            notification.id === id
              ? { ...notification, read: true }
              : notification
          )
        );
      }
    } catch (error) {
      console.error("읽음 처리 중 오류 발생:", error);
    }
  };

  // 모든 알림 읽음 처리 함수
  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.read);
      if (unreadNotifications.length === 0) return;

      const unreadIds = unreadNotifications.map((n) => n.id);

      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .in("id", unreadIds);

      if (error) {
        console.error("일괄 읽음 처리 실패:", error.message);
      } else {
        // 로컬 상태 업데이트
        setNotifications(
          notifications.map((notification) => ({ ...notification, read: true }))
        );
      }
    } catch (error) {
      console.error("일괄 읽음 처리 중 오류 발생:", error);
    }
  };

  // 알림 삭제 함수
  const deleteNotification = async (id) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("알림 삭제 실패:", error.message);
      } else {
        // 로컬 상태 업데이트
        setNotifications(
          notifications.filter((notification) => notification.id !== id)
        );
      }
    } catch (error) {
      console.error("알림 삭제 중 오류 발생:", error);
    }
  };

  const getNotificationIcon = (title) => {
    if (title.includes("공연") || title.includes("오픈")) {
      return <Ionicons name="musical-notes" size={24} color="#3498db" />;
    } else if (title.includes("예매") || title.includes("확인")) {
      return <Ionicons name="checkmark-circle" size={24} color="#2ecc71" />;
    } else if (title.includes("마감") || title.includes("임박")) {
      return <Ionicons name="alert-circle" size={24} color="#f39c12" />;
    } else if (title.includes("리뷰")) {
      return <Ionicons name="create" size={24} color="#9b59b6" />;
    } else if (title.includes("할인") || title.includes("이벤트")) {
      return <Ionicons name="pricetag" size={24} color="#e74c3c" />;
    } else {
      return <Ionicons name="notifications" size={24} color="#7f8c8d" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `오늘 ${date.getHours()}:${String(date.getMinutes()).padStart(
        2,
        "0"
      )}`;
    } else if (diffDays === 1) {
      return "어제";
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else {
      return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    }
  };

  // 알림 렌더링 함수
  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        item.read ? styles.readNotification : styles.unreadNotification,
      ]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.iconContainer}>
        {getNotificationIcon(item.title)}
        {!item.read && <View style={styles.unreadDot} />}
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.body}</Text>
        <Text style={styles.notificationDate}>{formatDate(item.sent_at)}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteNotification(item.id)}
      >
        <Ionicons name="close-circle" size={20} color="#95a5a6" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6c5ce7" />
        <Text style={styles.loadingText}>알림을 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {userinfo
            ? `${userinfo?.nickname}님, 알림을 확인해주세요`
            : "로그인을 해주세요"}
        </Text>
        {!userinfo && (
          <TouchableOpacity
            style={styles.markAllButtonContainer}
            onPress={() => navigation.navigate("Auth")}
          >
            <Text style={styles.markAllButton}>로그인</Text>
          </TouchableOpacity>
        )}
        {notifications.filter((n) => !n.read).length > 0 && (
          <TouchableOpacity
            style={styles.markAllButtonContainer}
            onPress={markAllAsRead}
          >
            <Text style={styles.markAllButton}>모두 읽음</Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="notifications-off-outline"
            size={60}
            color="#a0a0a0"
          />
          <Text style={styles.emptyText}>알림이 없습니다</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.notificationList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#6c5ce7"]}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#ffffff",
    elevation: 2,
  },
  headerTitle: {
    fontFamily: "Pretendard",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: -1,
    color: "#333333",
  },
  markAllButtonContainer: {
    backgroundColor: "#6c5ce7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  markAllButton: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Pretendard",
    letterSpacing: -0.5,
  },
  notificationList: {
    paddingVertical: 8,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: 4,
    borderRadius: 12,
    marginHorizontal: 12,
  },
  readNotification: {
    backgroundColor: "#ffffff",
  },
  unreadNotification: {
    backgroundColor: "#f0f4fe",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    marginRight: 16,
  },
  unreadDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#6c5ce7",
  },
  contentContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    fontFamily: "Pretendard",
    letterSpacing: -0.5,
    color: "#333333",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#555555",
    marginBottom: 8,
    fontFamily: "Pretendard",
    letterSpacing: -0.5,
    lineHeight: 20,
  },
  notificationDate: {
    fontSize: 12,
    color: "#888888",
    fontFamily: "Pretendard",
    letterSpacing: -0.5,
  },
  deleteButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555555",
    fontFamily: "Pretendard",
    letterSpacing: -0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#a0a0a0",
    fontFamily: "Pretendard",
    letterSpacing: -0.5,
  },
});

export default NotificationScreen;
