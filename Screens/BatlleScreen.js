import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function BattleScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de batalha</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.text}>Voltar</Text>
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
    backgroundColor: "#f97316",
    padding: 15,
    borderRadius: 10,
  },

  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});