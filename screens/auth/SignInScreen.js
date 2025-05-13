import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { useAuthStore } from "../../store/authStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideEmail = useRef(new Animated.Value(50)).current;
  const slidePassword = useRef(new Animated.Value(50)).current;
  const passwordRef = useRef(null);

  const signIn = useAuthStore((state) => state.signIn);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideEmail, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const showPasswordInput = () => {
    if (email.trim() && !validateEmail(email)) {
      Alert.alert("유효하지 않은 이메일", "올바른 이메일 형식을 입력해주세요.");
      return;
    }

    if (email.trim()) {
      setCurrentStep(1);
      Animated.timing(slidePassword, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        passwordRef.current?.focus();
      });
    } else {
      Alert.alert("이메일 필요", "로그인을 위해 이메일을 입력해주세요.");
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("오류", "이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        Alert.alert("로그인 오류", error.message);
      }
    } catch (error) {
      Alert.alert("오류 발생", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <Animated.View
            style={[styles.headerContainer, { opacity: fadeAnim }]}
          >
            <Text style={styles.welcomeText}>환영합니다 👋</Text>
            <Text style={styles.title}>계정에 로그인하세요</Text>
            <Text style={styles.subtitle}>
              더욱 다양한 서비스를 이용하기 위해 로그인해주세요
            </Text>
          </Animated.View>

          <View style={styles.formContainer}>
            <Animated.View
              style={[
                styles.inputContainer,
                { transform: [{ translateY: slideEmail }] },
              ]}
            >
              <Text style={styles.inputLabel}>이메일</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  onSubmitEditing={showPasswordInput}
                  blurOnSubmit={false}
                />
              </View>
            </Animated.View>

            {currentStep >= 1 && (
              <Animated.View
                style={[
                  styles.inputContainer,
                  { transform: [{ translateY: slidePassword }] },
                ]}
              >
                <Text style={styles.inputLabel}>비밀번호</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    ref={passwordRef}
                    style={styles.input}
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleSignIn}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={styles.eyeIconText}>
                      {showPassword ? (
                        <MaterialCommunityIcons
                          name="eye-off-outline"
                          size={24}
                          color="black"
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name="eye-outline"
                          size={24}
                          color="black"
                        />
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.forgotPassword}
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  <Text style={styles.forgotPasswordText}>
                    비밀번호를 잊으셨나요?
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>

          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.signInButton}
              onPress={currentStep === 0 ? showPasswordInput : handleSignIn}
              disabled={
                currentStep >= 1
                  ? loading || !email || !password
                  : loading || !email
              }
            >
              {currentStep === 0 ? (
                <Text style={styles.signInButtonText}>다음</Text>
              ) : loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signInButtonText}>로그인</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>또는</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={styles.signUpButton}
              onPress={() => navigation.navigate("SignUp")}
            >
              <Text style={styles.signUpButtonText}>
                계정이 없으신가요?{" "}
                <Text style={styles.signUpHighlight}>회원가입</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  innerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  headerContainer: {
    marginTop: 40,
  },
  welcomeText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 16,
    color: "#3498db",
    fontWeight: "600",
    marginBottom: 4,
  },
  title: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 16,
    color: "#666",
  },
  formContainer: {
    marginVertical: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
    height: 56,
  },
  input: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    paddingHorizontal: 16,
  },
  eyeIconText: {
    fontSize: 20,
  },
  nextButton: {
    backgroundColor: "#3498db",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#3498db",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  actionContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  signInButton: {
    backgroundColor: "#3498db",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3498db",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  signInButtonText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 40,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  dividerText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    paddingHorizontal: 16,
    color: "#999",
    fontSize: 14,
  },
  signUpButton: {
    alignItems: "center",
    paddingVertical: 60,
  },
  signUpButtonText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    color: "#666",
    fontSize: 15,
  },
  signUpHighlight: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    color: "#3498db",
    fontWeight: "600",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  forgotPasswordText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    color: "#3498db",
    fontSize: 14,
  },
});
