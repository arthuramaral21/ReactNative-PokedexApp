import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../Screens/HomeScreen";
import BattleScreen from "../Screens/BattleScreen";
import CadastroScreen from "../Screens/CadastroScreen";
import ListaScreen from "../Screens/ListaScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Pokédex" }}
        />

        <Stack.Screen
          name="Battle"
          component={BattleScreen}
          options={{ title: "Batalha" }}
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
