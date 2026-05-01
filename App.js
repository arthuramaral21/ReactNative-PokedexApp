import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Animated,
} from "react-native";
import { useState, useEffect } from "react";
import { Audio } from "expo-av";

const typeColors = {
  grass: "#22c55e",
  fire: "#ef4444",
  water: "#3b82f6",
  electric: "#facc15",
  psychic: "#a855f7",
  ice: "#67e8f9",
  dragon: "#7c3aed",
  dark: "#111827",
  fairy: "#f472b6",
  normal: "#a8a29e",
  fighting: "#b91c1c",
  flying: "#60a5fa",
  poison: "#9333ea",
  ground: "#92400e",
  rock: "#78716c",
  bug: "#84cc16",
  ghost: "#6d28d9",
  steel: "#6b7280",
};

export default function App() {
  const [pokemon, setPokemon] = useState(null);
  const [id, setId] = useState(1);
  const [search, setSearch] = useState("");
  const [anim] = useState(new Animated.Value(0));

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
    try {
      const res1 = await fetch(`https://pokeapi.co/api/v2/pokemon/${value}`);
      const data = await res1.json();

      const res2 = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${value}`,
      );
      const species = await res2.json();

      let categoria = "Comum";
      if (species.is_legendary) categoria = "Lendário";
      if (species.is_mythical) categoria = "Mítico";

      const poke = {
        id: data.id,
        nome: data.name.toUpperCase(),
        imagem: data.sprites.front_default,
        gif: data.sprites.versions["generation-v"]["black-white"].animated
          .front_default,
        tipo1: data.types[0]?.type.name,
        tipo2: data.types[1]?.type.name,
        geracao: species.generation.name
          .replace("generation-", "")
          .toUpperCase(),
        regiao: getRegion(species.generation.name),
        categoria: categoria,
      };

      setPokemon(poke);
      setId(data.id);
    } catch (error) {
      console.log("Erro ao buscar Pokémon");
    }
  };

  useEffect(() => {
    fetchPokemon(id);
  }, []);

  const playSound = async () => {
    if (!pokemon) return;

    try {
      const { sound } = await Audio.Sound.createAsync({
        uri: `https://play.pokemonshowdown.com/audio/cries/${pokemon.nome.toLowerCase()}.mp3`,
      });
      await sound.playAsync();
    } catch {
      console.log("Erro no som");
    }
  };

  const attackAnimation = () => {
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 20,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: -20,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 15,
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

  const nextPokemon = () => {
    const newId = id + 1;
    setId(newId);
    fetchPokemon(newId);
  };

  const prevPokemon = () => {
    if (id > 1) {
      const newId = id - 1;
      setId(newId);
      fetchPokemon(newId);
    }
  };

  const goToStart = () => {
    setId(1);
    fetchPokemon(1);
  };

  const searchPokemon = () => {
    if (search.trim() !== "") {
      fetchPokemon(search.toLowerCase());
      setSearch("");
    }
  };

  const mainColor = pokemon
    ? typeColors[pokemon.tipo1] || "#dc2626"
    : "#dc2626";

  return (
    <View style={[styles.container, { backgroundColor: mainColor }]}>
      <View style={styles.screen}>
        {pokemon && (
          <>
            <Text style={styles.name}>{pokemon.nome}</Text>

            <View style={styles.imageContainer}>
              <Animated.Image
                source={{ uri: pokemon.gif || pokemon.imagem }}
                style={[styles.image, { transform: [{ translateX: anim }] }]}
              />
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.id}>#{pokemon.id}</Text>

              <Text style={styles.infoLine}>
                <Text style={styles.label}>TIPO: </Text>
                {pokemon.tipo1.toUpperCase()}
              </Text>

              <Text style={styles.infoLine}>
                <Text style={styles.label}>GERAÇÃO: </Text>
                {pokemon.geracao}
              </Text>

              <Text style={styles.infoLine}>
                <Text style={styles.label}>REGIÃO: </Text>
                {pokemon.regiao}
              </Text>

              <Text style={styles.infoLine}>
                <Text style={styles.label}>CATEGORIA: </Text>
                {pokemon.categoria}
              </Text>
            </View>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.soundButton} onPress={playSound}>
        <Text style={styles.buttonText}>🔊 Som</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.attackButton} onPress={attackAnimation}>
        <Text style={styles.buttonText}>⚔️ Atacar</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Nome ou ID..."
        placeholderTextColor="#ccc"
        value={search}
        onChangeText={setSearch}
      />

      <TouchableOpacity style={styles.searchButton} onPress={searchPokemon}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={prevPokemon}>
          <Text style={styles.buttonText}>◀</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={nextPokemon}>
          <Text style={styles.buttonText}>▶</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={goToStart}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  screen: {
    width: "100%",
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginBottom: 15,
  },

  name: {
    fontSize: 24,
    fontWeight: "bold",
  },

  imageContainer: {
    backgroundColor: "#cbd5f5",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },

  image: {
    width: 120,
    height: 120,
  },

  infoBox: {
    width: "100%",
    backgroundColor: "#94a3b8",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },

  id: {
    fontWeight: "bold",
  },

  infoLine: {
    marginVertical: 2,
  },

  label: {
    fontWeight: "bold",
  },

  input: {
    backgroundColor: "#1f2937",
    color: "#fff",
    width: "100%",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  searchButton: {
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  soundButton: {
    backgroundColor: "#16a34a",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  attackButton: {
    backgroundColor: "#f97316",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  buttons: {
    flexDirection: "row",
  },

  button: {
    backgroundColor: "#111827",
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 50,
  },

  resetButton: {
    backgroundColor: "#000",
    padding: 10,
    marginTop: 15,
    borderRadius: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
