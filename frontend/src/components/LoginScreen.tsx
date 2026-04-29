import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";

import styles from "../style/auth/LoginStyle";
import useAuthStore from "../store/useAuthStore";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { redirectByRole } from "../utils/redirectByRole"

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);


  const navigation = useNavigation<NavigationProp>();

  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);


  useEffect(() => {
    const bootstrap = async () => {
      const user = await useAuthStore.getState().checkAuth();
      if (user) {
        redirectByRole(user.role, navigation);
      }
      setCheckingSession(false);
    };
    bootstrap();
  }, []);

  
  const handleLogin = async () => {
      
      if (!email.trim()) return setEmailError("Email is required");
      if (!password.trim()) return setPasswordError("Password is required");

      setEmailError("");
      setPasswordError("");

      setCheckingSession(true);
      const res = await login(email, password);

      if (res?.error) return;
      
      const user = await useAuthStore.getState().checkAuth();
      setCheckingSession(false);

      if (user) {
          redirectByRole(user.role, navigation);
      }
  };

  
  if (checkingSession) return (<Text style={styles.checkinSesiion}>Loading....</Text>);

  return (
    <ImageBackground
      source={require("../assets/login-bg.webp")}
      style={styles.container}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <Image
            source={require("../assets/homenursery.png")}
            style={styles.appLogo}
          />

          <View style={styles.inputContainer}>
            <Text style={styles.emailText}>Email</Text>
            <TextInput
              style={styles.emailInput}
              value={email}
              placeholder="Enter email"
              onChangeText={setEmail}
            />
            {emailError && (
              <Text style={{ color: "red", marginTop: -10, marginBottom: 15 }}>
                {emailError}
              </Text>
            )}

            <View style={styles.passwordContainer}>
              <Text style={styles.passwordText}>Password</Text>
              <TextInput
                style={styles.passwordInput}
                value={password}
                secureTextEntry={!showPassword}
                placeholder="Enter password"
                onChangeText={setPassword}
              />

              <TouchableOpacity
                style={styles.showPass}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text>{showPassword ? "hide" : "show"}</Text>
              </TouchableOpacity>
            </View>

            {passwordError && (
              <Text style={{ color: "red", marginTop: -20, marginBottom: 15 }}>
                {passwordError}
              </Text>
            )}

            {error && <Text style={{ color: "red" }}>{error}</Text>}

            <Button
              title={loading ? "Loading..." : "Login"}
              onPress={handleLogin}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default LoginScreen;