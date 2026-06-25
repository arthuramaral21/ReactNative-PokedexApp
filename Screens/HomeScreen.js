import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>POKÉDEX</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Battle")}
      >
        <Text style={styles.text}>Ir para batalha</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Cadastro")}
      >
        <Text style={styles.text}>Cadastrar Pokémon</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Lista")}
      >
        <Text style={styles.text}>Meus Pokémons</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: 220,
  },

  text: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});