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

import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import PokemonCard from "../Components/PokemonCard";
import { useAppTheme } from "../Context/AppThemeContext";
import {
  deletePokemon,
  subscribePokemons,
  updatePokemonNickname,
} from "../Services/pokemonService";

export default function ListaScreen({ navigation }) {
  const { colors, isDark } = useAppTheme();
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
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
      >
        <View
          style={[
            styles.centerContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <ActivityIndicator color="#dc2626" size="large" />
          <Text style={[styles.loadingText, { color: colors.muted }]}>
            Carregando coleção...
          </Text>
        </View>
        <StatusBar style={isDark ? "light" : "dark"} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>Pokémons salvos</Text>
            <Text style={[styles.title, { color: colors.text }]}>
              Minha Coleção
            </Text>
          </View>

          <View style={styles.counter}>
            <Text style={styles.counterNumber}>{pokemons.length}</Text>
            <Text style={styles.counterLabel}>total</Text>
          </View>
        </View>

        <FlatList
          data={pokemons}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PokemonCard
              pokemon={item}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          )}
          ListEmptyComponent={
            <View
              style={[
                styles.emptyContainer,
                { backgroundColor: colors.surface },
              ]}
            >
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                Sua coleção está vazia
              </Text>
              <Text style={[styles.emptyText, { color: colors.body }]}>
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
      <StatusBar style={isDark ? "light" : "dark"} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    padding: 18,
  },

  centerContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },

  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  headerText: {
    flex: 1,
    paddingRight: 12,
  },

  eyebrow: {
    color: "#dc2626",
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
  },

  title: {
    color: "#111827",
    fontSize: 30,
    fontWeight: "900",
  },

  counter: {
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 8,
    minWidth: 62,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  counterNumber: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },

  counterLabel: {
    color: "#cbd5e1",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },

  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  loadingText: {
    color: "#475569",
    fontWeight: "700",
    marginTop: 10,
  },

  emptyContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    justifyContent: "center",
    marginTop: 40,
    padding: 24,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },

  emptyTitle: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "900",
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
