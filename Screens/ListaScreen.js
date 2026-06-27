import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import PokemonCard from "../Components/PokemonCard";
import {
  deletePokemon,
  subscribePokemons,
  updatePokemonNickname,
} from "../Services/pokemonService";

export default function ListaScreen({ navigation }) {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribePokemons(
      (pokemonList) => {
        setPokemons(pokemonList);
        setLoading(false);
      },
      () => {
        Alert.alert("Erro", "Não foi possível carregar sua coleção.");
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const handleUpdate = async (id, apelido) => {
    if (!apelido.trim()) {
      Alert.alert("Atenção", "Digite um apelido válido.");
      return;
    }

    try {
      await updatePokemonNickname(id, apelido);
      Alert.alert("Sucesso", "Apelido atualizado.");
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar o apelido.");
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Excluir Pokémon",
      "Deseja remover este Pokémon da sua coleção?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePokemon(id);
            } catch {
              Alert.alert("Erro", "Não foi possível excluir o Pokémon.");
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color="#dc2626" size="large" />
        <Text style={styles.loadingText}>Carregando coleção...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Coleção</Text>

      <FlatList
        data={pokemons}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <PokemonCard
            pokemon={item}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Sua coleção está vazia</Text>
            <Text style={styles.emptyText}>
              Busque um Pokémon na Pokédex e cadastre para vê-lo aqui.
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.buttonText}>Ir para Pokédex</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e2e8f0",
    flex: 1,
    padding: 16,
  },

  centerContainer: {
    alignItems: "center",
    backgroundColor: "#e2e8f0",
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#111827",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },

  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  loadingText: {
    color: "#475569",
    marginTop: 10,
  },

  emptyContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingTop: 80,
  },

  emptyTitle: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },

  emptyText: {
    color: "#475569",
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 18,
    textAlign: "center",
  },

  button: {
    alignItems: "center",
    backgroundColor: "#dc2626",
    borderRadius: 8,
    padding: 14,
    width: "100%",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
