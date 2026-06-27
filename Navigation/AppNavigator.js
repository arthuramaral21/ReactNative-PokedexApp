import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../Screens/HomeScreen";
import CadastroScreen from "../Screens/CadastroScreen";
import ListaScreen from "../Screens/ListaScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#f8fafc",
          },
          headerShadowVisible: false,
          headerTintColor: "#111827",
          headerTitleStyle: {
            fontWeight: "800",
          },
          contentStyle: {
            backgroundColor: "#f8fafc",
          },
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
