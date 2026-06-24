import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import BattleScreen from "../screens/BattleScreen";
import CadastroScreen from "../screens/CadastroScreen";
import ListaScreen from "../screens/ListaScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen name="Battle" component={BattleScreen} />

        <Stack.Screen name="Cadastro" component={CadastroScreen} />

        <Stack.Screen name="Lista" component={ListaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
