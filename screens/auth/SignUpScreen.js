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
  ScrollView,
} from "react-native";
import { useAuthStore } from "../../store/authStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [stepCount, setStepCount] = useState(0);

  const [currentStep, setCurrentStep] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideEmail = useRef(new Animated.Value(50)).current;
  const slideNickname = useRef(new Animated.Value(50)).current;
  const slidePassword = useRef(new Animated.Value(50)).current;
  const slideConfirmPassword = useRef(new Animated.Value(50)).current;

  const nicknameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const signUp = useAuthStore((state) => state.signUp);

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

  // 이메일 검증
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const showNextInput = (step) => {
    if (step === 1) {
      if (!email.trim()) {
        Alert.alert("이메일 필요", "회원가입을 위해 이메일을 입력해주세요.");
        return;
      }

      if (!validateEmail(email)) {
        Alert.alert(
          "유효하지 않은 이메일",
          "올바른 이메일 형식을 입력해주세요."
        );
        return;
      }

      setCurrentStep(1);
      Animated.timing(slideNickname, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        nicknameRef.current?.focus();
      });
    } else if (step === 2) {
      if (!nickname.trim()) {
        Alert.alert("닉네임 필요", "닉네임을 입력해주세요.");
        return;
      }

      setCurrentStep(2);
      Animated.timing(slidePassword, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        passwordRef.current?.focus();
      });
    } else if (step === 3) {
      if (!password.trim() || password.length < 6) {
        Alert.alert("비밀번호 오류", "비밀번호는 최소 6자 이상이어야 합니다.");
        return;
      }

      setCurrentStep(3);
      Animated.timing(slideConfirmPassword, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        confirmPasswordRef.current?.focus();
      });
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !nickname) {
      Alert.alert("오류", "모든 필드를 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("오류", "비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("비밀번호 오류", "비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    try {
      const { error } = await signUp(email, password, nickname);
      if (error) {
        Alert.alert("회원가입 오류", error.message);
      } else {
        Alert.alert("회원가입 성공", "이메일 확인 후 로그인해주세요.", [
          { text: "확인", onPress: () => navigation.navigate("SignIn") },
        ]);
      }
    } catch (error) {
      Alert.alert("오류 발생", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "", color: "#e0e0e0" };
    if (password.length < 6)
      return { strength: 1, text: "매우 약함", color: "#ff3b30" };
    if (password.length < 8)
      return { strength: 2, text: "약함", color: "#ff9500" };

    let score = password.length >= 8 ? 2 : 0;
    score += /[A-Z]/.test(password) ? 1 : 0;
    score += /[a-z]/.test(password) ? 1 : 0;
    score += /[0-9]/.test(password) ? 1 : 0;
    score += /[^A-Za-z0-9]/.test(password) ? 1 : 0;

    if (score >= 5) return { strength: 5, text: "매우 강함", color: "#34c759" };
    if (score === 4) return { strength: 4, text: "강함", color: "#30d158" };
    if (score === 3) return { strength: 3, text: "보통", color: "#ffcc00" };

    return { strength: 2, text: "약함", color: "#ff9500" };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.innerContainer}>
            <Animated.View
              style={[styles.headerContainer, { opacity: fadeAnim }]}
            >
              <Text style={styles.welcomeText}>계정 생성</Text>
              <Text style={styles.title}>회원가입</Text>
              <Text style={styles.subtitle}>
                간단한 정보 입력 후 withCulture를 이용해보세요
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
                    onSubmitEditing={() => showNextInput(1)}
                    blurOnSubmit={false}
                  />
                </View>
                {currentStep === 0 && (
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => showNextInput(1)}
                  >
                    <Text style={styles.nextButtonText}>다음</Text>
                  </TouchableOpacity>
                )}
              </Animated.View>

              {currentStep >= 1 && (
                <Animated.View
                  style={[
                    styles.inputContainer,
                    { transform: [{ translateY: slideNickname }] },
                  ]}
                >
                  <Text style={styles.inputLabel}>닉네임</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      ref={nicknameRef}
                      style={styles.input}
                      placeholder="사용하실 닉네임을 입력하세요"
                      value={nickname}
                      onChangeText={setNickname}
                      autoCapitalize="none"
                      returnKeyType="next"
                      onSubmitEditing={() => showNextInput(2)}
                      blurOnSubmit={false}
                    />
                  </View>
                  {currentStep === 1 && (
                    <TouchableOpacity
                      style={styles.nextButton}
                      onPress={() => showNextInput(2)}
                    >
                      <Text style={styles.nextButtonText}>다음</Text>
                    </TouchableOpacity>
                  )}
                </Animated.View>
              )}

              {currentStep >= 2 && (
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
                      placeholder="비밀번호를 입력하세요 (6자 이상)"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      returnKeyType="next"
                      onSubmitEditing={() => showNextInput(3)}
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

                  {password.length > 0 && (
                    <View style={styles.passwordStrength}>
                      <View style={styles.strengthMeterContainer}>
                        {[1, 2, 3, 4, 5].map((level) => (
                          <View
                            key={level}
                            style={[
                              styles.strengthBar,
                              {
                                backgroundColor:
                                  level <= passwordStrength.strength
                                    ? passwordStrength.color
                                    : "#e0e0e0",
                              },
                            ]}
                          />
                        ))}
                      </View>
                      <Text
                        style={[
                          styles.strengthText,
                          { color: passwordStrength.color },
                        ]}
                      >
                        {passwordStrength.text}
                      </Text>
                    </View>
                  )}

                  {currentStep === 2 && (
                    <TouchableOpacity
                      style={styles.nextButton}
                      onPress={() => showNextInput(3)}
                      disabled={password.length < 6}
                    >
                      <Text style={styles.nextButtonText}>다음</Text>
                    </TouchableOpacity>
                  )}
                </Animated.View>
              )}

              {currentStep >= 3 && (
                <Animated.View
                  style={[
                    styles.inputContainer,
                    { transform: [{ translateY: slideConfirmPassword }] },
                  ]}
                >
                  <Text style={styles.inputLabel}>비밀번호 확인</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      ref={confirmPasswordRef}
                      style={styles.input}
                      placeholder="비밀번호를 다시 입력하세요"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      returnKeyType="done"
                      onSubmitEditing={handleSignUp}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <Text style={styles.eyeIconText}>
                        {showConfirmPassword ? (
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

                  {confirmPassword.length > 0 && (
                    <Text
                      style={[
                        styles.passwordMatch,
                        {
                          color:
                            password === confirmPassword
                              ? "#34c759"
                              : "#ff3b30",
                          opacity: confirmPassword ? 1 : 0,
                        },
                      ]}
                    >
                      {password === confirmPassword
                        ? "비밀번호가 일치합니다."
                        : "비밀번호가 일치하지 않습니다."}
                    </Text>
                  )}
                </Animated.View>
              )}
            </View>

            <View style={styles.actionContainer}>
              {currentStep === 3 && (
                <TouchableOpacity
                  style={[
                    styles.signUpButton,
                    !email ||
                    !password ||
                    !confirmPassword ||
                    !nickname ||
                    password !== confirmPassword
                      ? styles.disabledButton
                      : {},
                  ]}
                  onPress={handleSignUp}
                  disabled={
                    loading ||
                    !email ||
                    !password ||
                    !confirmPassword ||
                    !nickname ||
                    password !== confirmPassword
                  }
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.signUpButtonText}>회원가입</Text>
                  )}
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.signInLinkButton}
                onPress={() => navigation.navigate("SignIn")}
              >
                <Text style={styles.signInLinkText}>
                  이미 계정이 있으신가요?
                  <Text style={styles.signInHighlight}>로그인</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  headerContainer: {
    marginTop: 40,
    marginBottom: 20,
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
    marginVertical: 16,
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
  signUpButton: {
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
  disabledButton: {
    backgroundColor: "#a5d5f5",
    shadowOpacity: 0.1,
  },
  signUpButtonText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  signInLinkButton: {
    alignItems: "center",
    paddingVertical: 20,
  },
  signInLinkText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    color: "#666",
    fontSize: 15,
  },
  signInHighlight: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    color: "#3498db",
    fontWeight: "600",
  },
  passwordStrength: {
    marginTop: 12,
  },
  strengthMeterContainer: {
    flexDirection: "row",
    height: 4,
    marginBottom: 8,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    marginHorizontal: 2,
    borderRadius: 2,
  },
  strengthText: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 12,
    textAlign: "right",
  },
  passwordMatch: {
    fontFamily: "Pretendard",
    letterSpacing: -1,
    fontSize: 12,
    marginTop: 8,
    textAlign: "right",
  },
});
