import { Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Text, View } from "@/components/Themed";

export default function Home({ user, setUser }) {
  // Delete user stored info
  const handleSignOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem("@user");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User email: {user?.email}</Text>
      <Button title="Sign out" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
});
