import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Audio } from "expo-av";

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
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: mainColor }]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>POKÉDEX</Text>

      {loading && <ActivityIndicator color="#fff" size="large" />}

      {pokemon && (
        <View style={styles.card}>
          <Text style={styles.name}>{pokemon.nome}</Text>

          <TouchableOpacity activeOpacity={0.8} onPress={animatePokemon}>
            <Animated.Image
              source={{ uri: pokemon.gif || pokemon.imagem }}
              style={[styles.image, { transform: [{ translateX: anim }] }]}
            />
          </TouchableOpacity>

          <Text style={styles.info}>#{pokemon.id}</Text>
          <Text style={styles.info}>
            Tipo: {pokemon.tipo1}
            {pokemon.tipo2 ? ` / ${pokemon.tipo2}` : ""}
          </Text>
          <Text style={styles.info}>Geração: {pokemon.geracao}</Text>
          <Text style={styles.info}>Região: {pokemon.regiao}</Text>
          <Text style={styles.info}>Categoria: {pokemon.categoria}</Text>

          <Text style={styles.description}>{pokemon.descricao}</Text>

          <TouchableOpacity style={styles.soundButton} onPress={playSound}>
            <Text style={styles.buttonText}>Som do Pokémon</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.searchArea}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por nome ou ID"
          placeholderTextColor="#cbd5e1"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={() => fetchPokemon(search)}
        />

        <TouchableOpacity
          onPress={() => fetchPokemon(search)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={goToCadastro}
      >
        <Text style={styles.buttonText}>Cadastrar Pokémon</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate("Lista")}
      >
        <Text style={styles.buttonText}>Minha Coleção</Text>
      </TouchableOpacity>

      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <StatusBar style="light" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    alignItems: "center",
    width: "100%",
  },

  name: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 4,
  },

  image: {
    width: 140,
    height: 140,
    marginVertical: 10,
  },

  info: {
    color: "#fff",
    fontSize: 15,
    marginTop: 4,
    textTransform: "capitalize",
  },

  description: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
    textAlign: "center",
  },

  searchArea: {
    width: "100%",
    marginTop: 24,
  },

  input: {
    backgroundColor: "#1f2937",
    borderRadius: 10,
    color: "#fff",
    padding: 12,
    width: "100%",
  },

  button: {
    alignItems: "center",
    backgroundColor: "#374151",
    borderRadius: 10,
    marginTop: 10,
    padding: 13,
    width: "100%",
  },

  soundButton: {
    alignItems: "center",
    backgroundColor: "#16a34a",
    borderRadius: 10,
    marginTop: 14,
    padding: 12,
    width: "100%",
  },

  primaryButton: {
    backgroundColor: "#dc2626",
    marginTop: 16,
  },

  secondaryButton: {
    backgroundColor: "#111827",
    marginBottom: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },

  error: {
    color: "#fff",
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
});
