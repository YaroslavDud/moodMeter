import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { useColorScheme } from "react-native";

import Home from "@/app/home";
import SignUp from "@/app/sign-up";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const Stack = createStackNavigator();
  const [user, setUser] = useState(null);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      // Get user stored info
      (async () => {
        const storedUser = await AsyncStorage.getItem("@user");
        if (!storedUser) return;
        setUser(JSON.parse(storedUser));
      })();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <NavigationContainer independent={true}>
        <Stack.Navigator>
          {user ? (
            <Stack.Screen name="Home">
              {(props) => <Home {...props} user={user} setUser={setUser} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="SignUp">
              {(props) => <SignUp {...props} setUser={setUser} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
