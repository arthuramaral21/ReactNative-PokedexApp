import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { createPokemon } from "../Services/pokemonService";

export default function CadastroScreen({ route, navigation }) {
  const pokemon = route.params?.pokemon;
  const [apelido, setApelido] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!pokemon) return;

    if (!apelido.trim()) {
      Alert.alert("Atenção", "Digite um apelido para o Pokémon.");
      return;
    }

    try {
      setLoading(true);
      await createPokemon(pokemon, apelido);
      Alert.alert("Sucesso", "Pokémon cadastrado na sua coleção.");
      navigation.navigate("Lista");
    } catch {
      Alert.alert("Erro", "Não foi possível salvar o Pokémon.");
    } finally {
      setLoading(false);
    }
  };

  if (!pokemon) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Nenhum Pokémon selecionado</Text>
        <Text style={styles.description}>
          Volte para a Pokédex, escolha um Pokémon e toque em cadastrar.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>Voltar para Pokédex</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Pokémon</Text>

      <Image
        source={{ uri: pokemon.imagem }}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.name}>{pokemon.nome}</Text>
      <Text style={styles.info}>ID: #{pokemon.id}</Text>
      <Text style={styles.info}>Tipo: {pokemon.tipo1}</Text>

      <TextInput
        style={styles.input}
        placeholder="Apelido"
        placeholderTextColor="#94a3b8"
        value={apelido}
        onChangeText={setApelido}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Salvar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#f8fafc",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  title: {
    color: "#111827",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 18,
    textAlign: "center",
  },

  image: {
    height: 150,
    marginBottom: 10,
    width: 150,
  },

  name: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "bold",
  },

  info: {
    color: "#475569",
    fontSize: 16,
    marginTop: 4,
    textTransform: "capitalize",
  },

  description: {
    color: "#475569",
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    backgroundColor: "#fff",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: 1,
    color: "#111827",
    marginTop: 24,
    padding: 14,
    width: "100%",
  },

  button: {
    alignItems: "center",
    backgroundColor: "#dc2626",
    borderRadius: 8,
    marginTop: 14,
    padding: 14,
    width: "100%",
  },

  disabledButton: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
