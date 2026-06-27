import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Audio } from "expo-av";
import { SafeAreaView } from "react-native-safe-area-context";

const typeColors = {
  normal: "#a8a29e",
  grass: "#22c55e",
  fire: "#ef4444",
  water: "#3b82f6",
  electric: "#facc15",
  psychic: "#a855f7",
  ice: "#67e8f9",
  dragon: "#7c3aed",
  dark: "#111827",
  fairy: "#f472b6",
  fighting: "#b91c1c",
  flying: "#60a5fa",
  poison: "#9333ea",
  ground: "#ca8a04",
  rock: "#78716c",
  bug: "#65a30d",
  ghost: "#6d28d9",
  steel: "#64748b",
};

export default function HomeScreen({ navigation }) {
  const [pokemon, setPokemon] = useState(null);
  const [id, setId] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [anim] = useState(new Animated.Value(0));
  const soundRef = useRef(null);

  const getRegion = (gen) => {
    const map = {
      "generation-i": "Kanto",
      "generation-ii": "Johto",
      "generation-iii": "Hoenn",
      "generation-iv": "Sinnoh",
      "generation-v": "Unova",
      "generation-vi": "Kalos",
      "generation-vii": "Alola",
      "generation-viii": "Galar",
      "generation-ix": "Paldea",
    };

    return map[gen] || "Desconhecida";
  };

  const fetchPokemon = async (value) => {
    const pokemonSearch = String(value).trim().toLowerCase();

    if (!pokemonSearch) {
      setErrorMessage("Digite um nome ou ID para buscar.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const pokemonResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonSearch}`,
      );

      if (!pokemonResponse.ok) {
        throw new Error("Pokémon não encontrado.");
      }

      const data = await pokemonResponse.json();

      const speciesResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${data.id}`,
      );
      const species = await speciesResponse.json();

      let categoria = "Comum";
      if (species.is_legendary) categoria = "Lendário";
      if (species.is_mythical) categoria = "Mítico";

      const descricao = species.flavor_text_entries
        .find((entry) => entry.language.name === "en")
        ?.flavor_text.replace(/\f/g, " ")
        .replace(/\n/g, " ");

      setPokemon({
        id: data.id,
        nome: data.name.toUpperCase(),
        imagem: data.sprites.front_default,
        gif:
          data.sprites.versions["generation-v"]["black-white"].animated
            .front_default || data.sprites.front_default,
        tipo1: data.types[0]?.type.name,
        tipo2: data.types[1]?.type.name,
        geracao: species.generation.name
          .replace("generation-", "")
          .toUpperCase(),
        regiao: getRegion(species.generation.name),
        categoria,
        descricao,
      });

      setId(data.id);
    } catch (error) {
      setErrorMessage(error.message || "Não foi possível buscar o Pokémon.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon(id);
  }, []);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const playSound = async () => {
    if (!pokemon) return;

    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync({
        uri: `https://play.pokemonshowdown.com/audio/cries/${pokemon.nome.toLowerCase()}.mp3`,
      });

      soundRef.current = sound;
      await sound.playAsync();
    } catch {
      setErrorMessage("Não foi possível reproduzir o som desse Pokémon.");
    }
  };

  const animatePokemon = () => {
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 18,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: -18,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 0,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const goToCadastro = () => {
    if (!pokemon) {
      setErrorMessage("Busque um Pokémon antes de cadastrar.");
      return;
    }

    navigation.navigate("Cadastro", { pokemon });
  };

  const mainColor = pokemon
    ? typeColors[pokemon.tipo1] || "#dc2626"
    : "#dc2626";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { backgroundColor: mainColor }]}>
          <View>
            <Text style={styles.eyebrow}>Pokedex App</Text>
            <Text style={styles.title}>Pokédex</Text>
          </View>

          <TouchableOpacity
            style={styles.collectionButton}
            onPress={() => navigation.navigate("Lista")}
          >
            <Text style={styles.collectionButtonText}>Coleção</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchArea}>
          <TextInput
            style={styles.input}
            placeholder="Nome ou ID do Pokémon"
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={() => fetchPokemon(search)}
          />

          <TouchableOpacity
            onPress={() => fetchPokemon(search)}
            style={styles.searchButton}
          >
            <Text style={styles.buttonText}>Buscar</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingCard}>
            <ActivityIndicator color={mainColor} size="large" />
            <Text style={styles.loadingText}>Carregando Pokémon...</Text>
          </View>
        )}

        {pokemon && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.name}>{pokemon.nome}</Text>
                <Text style={styles.number}>#{pokemon.id}</Text>
              </View>

              <View style={[styles.typeBadge, { backgroundColor: mainColor }]}>
                <Text style={styles.typeText}>{pokemon.tipo1}</Text>
              </View>
            </View>

            <TouchableOpacity activeOpacity={0.85} onPress={animatePokemon}>
              <View style={styles.imageFrame}>
                <Animated.Image
                  source={{ uri: pokemon.gif || pokemon.imagem }}
                  style={[styles.image, { transform: [{ translateX: anim }] }]}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>

            <View style={styles.infoGrid}>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Geração</Text>
                <Text style={styles.infoValue}>{pokemon.geracao}</Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Região</Text>
                <Text style={styles.infoValue}>{pokemon.regiao}</Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Categoria</Text>
                <Text style={styles.infoValue}>{pokemon.categoria}</Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Tipo 2</Text>
                <Text style={styles.infoValue}>{pokemon.tipo2 || "Nenhum"}</Text>
              </View>
            </View>

            <Text style={styles.description}>{pokemon.descricao}</Text>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.soundButton} onPress={playSound}>
                <Text style={styles.buttonText}>Som</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: mainColor }]}
                onPress={goToCadastro}
              >
                <Text style={styles.buttonText}>Cadastrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

        <StatusBar style="dark" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#f8fafc",
    flex: 1,
  },

  container: {
    flexGrow: 1,
    padding: 18,
    paddingBottom: 28,
  },

  hero: {
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    padding: 18,
  },

  eyebrow: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  title: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "900",
  },

  collectionButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderColor: "rgba(255,255,255,0.35)",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  collectionButtonText: {
    color: "#fff",
    fontWeight: "800",
  },

  searchArea: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
    width: "100%",
  },

  input: {
    backgroundColor: "#fff",
    borderColor: "#e2e8f0",
    borderRadius: 8,
    borderWidth: 1,
    color: "#111827",
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },

  searchButton: {
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 18,
  },

  loadingCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    padding: 18,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },

  loadingText: {
    color: "#475569",
    fontWeight: "700",
    marginTop: 8,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
    padding: 18,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    width: "100%",
  },

  cardHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  name: {
    color: "#111827",
    fontSize: 26,
    fontWeight: "900",
  },

  number: {
    color: "#64748b",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 2,
  },

  typeBadge: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  typeText: {
    color: "#fff",
    fontWeight: "900",
    textTransform: "capitalize",
  },

  imageFrame: {
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    justifyContent: "center",
    marginVertical: 18,
    minHeight: 174,
  },

  image: {
    height: 152,
    width: 152,
  },

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  infoBox: {
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: "48%",
    flexGrow: 1,
    padding: 12,
  },

  infoLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 4,
    textTransform: "uppercase",
  },

  infoValue: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "800",
    textTransform: "capitalize",
  },

  description: {
    color: "#334155",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 16,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  soundButton: {
    alignItems: "center",
    backgroundColor: "#0f766e",
    borderRadius: 8,
    flex: 1,
    padding: 14,
  },

  primaryButton: {
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
    padding: 14,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },

  error: {
    backgroundColor: "#fee2e2",
    borderColor: "#fecaca",
    borderRadius: 8,
    borderWidth: 1,
    color: "#991b1b",
    fontWeight: "800",
    marginTop: 12,
    padding: 12,
    textAlign: "center",
  },
});
