import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import { Audio } from "expo-av";

export default function App() {
  const [pokemon, setPokemon] = useState(null);
  const [id, setId] = useState(1);
  const [search, setSearch] = useState("");

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
    } catch (error) {
      console.log("Erro ao tocar som");
    }
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

  return (
    <View style={styles.container}>
      {/* TOPO */}
      <View style={styles.topBar}>
        <View style={styles.blueLight} />
        <View style={styles.smallLights}>
          <View style={[styles.light, { backgroundColor: "#ef4444" }]} />
          <View style={[styles.light, { backgroundColor: "#eab308" }]} />
          <View style={[styles.light, { backgroundColor: "#22c55e" }]} />
        </View>
      </View>

      {/* VISOR */}
      <View style={styles.screen}>
        {pokemon && (
          <>
            <Text style={styles.name}>{pokemon.nome}</Text>

            <View style={styles.imageContainer}>
              <Image source={{ uri: pokemon.imagem }} style={styles.image} />
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.id}>#{pokemon.id}</Text>

              <Text style={styles.infoLine}>
                <Text style={styles.label}>TIPO: </Text>
                {pokemon.tipo1.toUpperCase()}{" "}
                {pokemon.tipo2 ? `/ ${pokemon.tipo2.toUpperCase()}` : ""}
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

      {/* SOM */}
      <TouchableOpacity style={styles.soundButton} onPress={playSound}>
        <Text style={styles.buttonText}>🔊 Som</Text>
      </TouchableOpacity>

      {/* BUSCA */}
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

      {/* BOTÕES */}
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
    backgroundColor: "#dc2626",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  blueLight: {
    width: 50,
    height: 50,
    backgroundColor: "#3b82f6",
    borderRadius: 25,
    borderWidth: 4,
    borderColor: "#1e3a8a",
    marginRight: 10,
  },

  smallLights: {
    flexDirection: "row",
  },

  light: {
    width: 15,
    height: 15,
    borderRadius: 10,
    marginHorizontal: 3,
  },

  screen: {
    width: "100%",
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    borderWidth: 5,
    borderColor: "#991b1b",
    marginBottom: 15,
  },

  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    letterSpacing: 2,
  },

  imageContainer: {
    backgroundColor: "#cbd5f5",
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#64748b",
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 5,
  },

  infoLine: {
    fontSize: 14,
    color: "#020617",
    marginVertical: 2,
  },

  label: {
    fontWeight: "bold",
    color: "#1e293b",
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
    marginBottom: 15,
  },

  soundButton: {
    backgroundColor: "#16a34a",
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
