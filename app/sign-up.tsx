import { useEffect } from "react";
import { Button, StyleSheet } from "react-native";

import { View } from "@/components/Themed";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";

WebBrowser.maybeCompleteAuthSession();

export default function SignUp({ setUser }) {
  // Facebook SignIn
  const [fbReq, fbRes, fbPromt] = Facebook.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_FACEBOOK_CLIENT_ID,
  });

  // Google SignIn
  const [glReq, glRes, glPromt] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  });

  // Store user Facebook info
  useEffect(() => {
    if (fbRes && fbRes.type === "success" && fbRes.authentication) {
      (async () => {
        const userInfoRes = await fetch(
          `${process.env.EXPO_PUBLIC_FACEBOOK_API_URL}?access_token=${fbRes.authentication?.accessToken}&fields=id,name,email`,
        );
        const userInfo = await userInfoRes.json();
        setUser(userInfo);
        await AsyncStorage.setItem("@user", JSON.stringify(userInfo));
      })();
    }
  }, [fbRes]);

  // Store user Google info
  useEffect(() => {
    if (glRes && glRes.type === "success" && glRes.authentication) {
      (async () => {
        const userInfoRes = await fetch(
          `${process.env.EXPO_PUBLIC_GOOGLE_API_URL}`,
          {
            headers: {
              Authorization: `Bearer ${glRes.authentication?.accessToken}`,
            },
          },
        );
        const userInfo = await userInfoRes.json();
        setUser(userInfo);
        await AsyncStorage.setItem("@user", JSON.stringify(userInfo));
      })();
    }
  }, [glRes]);

  const handleSignWithFacebook = async () => {
    const result = await fbPromt();
    if (result?.type !== "success") {
      alert("Something went wrong");
      return;
    }
  };

  const handleSignWithGoogle = async () => {
    const result = await glPromt();
    if (result?.type !== "success") {
      alert("Something went wrong");
      return;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.button}>
        <Button
          title="Sign in with Facebook"
          onPress={handleSignWithFacebook}
          disabled={!fbReq}
        />
      </View>
      <Button
        title="Sign in with Google"
        onPress={handleSignWithGoogle}
        disabled={!glReq}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginBottom: 15,
  },
});
