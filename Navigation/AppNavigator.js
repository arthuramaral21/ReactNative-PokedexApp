import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import HomeScreen from "../Screens/HomeScreen";
import CadastroScreen from "../Screens/CadastroScreen";
import ListaScreen from "../Screens/ListaScreen";
import { useAppTheme } from "../Context/AppThemeContext";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { colors, isDark, toggleTheme } = useAppTheme();

  return (
    <NavigationContainer
      theme={{
        ...(isDark ? DarkTheme : DefaultTheme),
        dark: isDark,
        colors: {
          ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
          primary: "#dc2626",
          background: colors.background,
          card: colors.background,
          text: colors.text,
          border: colors.border,
          notification: "#dc2626",
        },
        fonts: {},
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerShadowVisible: false,
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: "800",
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
          headerRight: () => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={toggleTheme}
              style={[
                styles.themeButton,
                { backgroundColor: colors.navButton },
              ]}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  { color: colors.navButtonText },
                ]}
              >
                {isDark ? "Claro" : "Noite"}
              </Text>
            </TouchableOpacity>
          ),
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Pokédex" }}
        />

        <Stack.Screen
          name="Cadastro"
          component={CadastroScreen}
          options={{ title: "Cadastrar Pokémon" }}
        />

        <Stack.Screen
          name="Lista"
          component={ListaScreen}
          options={{ title: "Meus Pokémons" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  themeButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  themeButtonText: {
    fontSize: 12,
    fontWeight: "900",
  },
});
