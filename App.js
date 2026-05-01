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
};

export default function App() {
  const [screen, setScreen] = useState("pokedex");
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  return screen === "pokedex" ? (
    <PokedexScreen
      goBattle={(poke) => {
        setSelectedPokemon(poke);
        setScreen("battle");
      }}
    />
  ) : (
    <BattleScreen
      goBack={() => setScreen("pokedex")}
      playerPokemon={selectedPokemon}
    />
  );
}


function PokedexScreen({ goBattle }) {
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

      const descricao = species.flavor_text_entries
        .find((e) => e.language.name === "en")
        ?.flavor_text.replace(/\f/g, " ");

      setPokemon({
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
        descricao: descricao,
      });

      setId(data.id);
    } catch {}
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
    } catch {}
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
        toValue: 0,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const mainColor = pokemon
    ? typeColors[pokemon.tipo1] || "#dc2626"
    : "#dc2626";

  return (
    <View style={[styles.container, { backgroundColor: mainColor }]}>
      {pokemon && (
        <>
          <Text style={styles.name}>{pokemon.nome}</Text>

          <Animated.Image
            source={{ uri: pokemon.gif || pokemon.imagem }}
            style={[styles.image, { transform: [{ translateX: anim }] }]}
          />

          <Text style={styles.info}>#{pokemon.id}</Text>
          <Text style={styles.info}>Tipo: {pokemon.tipo1}</Text>
          <Text style={styles.info}>Geração: {pokemon.geracao}</Text>
          <Text style={styles.info}>Região: {pokemon.regiao}</Text>
          <Text style={styles.info}>Categoria: {pokemon.categoria}</Text>

          <Text style={styles.description}>{pokemon.descricao}</Text>

          <TouchableOpacity style={styles.soundButton} onPress={playSound}>
            <Text style={styles.buttonText}>🔊 Som</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.attackButton}
            onPress={attackAnimation}
          >
            <Text style={styles.buttonText}>⚔️ Atacar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.battleButton}
            onPress={() => goBattle(pokemon)}
          >
            <Text style={styles.buttonText}>⚔️ Ir pra batalha</Text>
          </TouchableOpacity>
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Buscar..."
        placeholderTextColor="#ccc"
        value={search}
        onChangeText={setSearch}
      />

      <TouchableOpacity
        onPress={() => fetchPokemon(search.toLowerCase())}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>

      <StatusBar style="light" />
    </View>
  );
}



function BattleScreen({ goBack, playerPokemon }) {
  const [enemy, setEnemy] = useState(null);
  const [playerHP, setPlayerHP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(100);
  const [log, setLog] = useState("");

  useEffect(() => {
    const getEnemy = async () => {
      const id = Math.floor(Math.random() * 151) + 1;
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await res.json();

      setEnemy({
        nome: data.name.toUpperCase(),
        gif: data.sprites.versions["generation-v"]["black-white"].animated
          .front_default,
      });
    };

    getEnemy();
  }, []);

  const attack = () => {
    if (playerHP <= 0 || enemyHP <= 0) return;

    const dmg = Math.floor(Math.random() * 20) + 5;
    const enemyDmg = Math.floor(Math.random() * 20) + 5;

    const newEnemyHP = Math.max(enemyHP - dmg, 0);
    const newPlayerHP = Math.max(playerHP - enemyDmg, 0);

    setEnemyHP(newEnemyHP);
    setPlayerHP(newPlayerHP);

    if (newEnemyHP === 0) setLog("Você venceu!");
    else if (newPlayerHP === 0) setLog("Você perdeu!");
    else setLog(`Você causou ${dmg} e recebeu ${enemyDmg}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚔️ BATALHA</Text>

      <View style={styles.battleRow}>
        <View style={styles.pokemonBox}>
          <Text>{playerPokemon.nome}</Text>
          <Image source={{ uri: playerPokemon.gif }} style={styles.image} />
          <Text>HP: {playerHP}</Text>
        </View>

        {enemy && (
          <View style={styles.pokemonBox}>
            <Text>{enemy.nome}</Text>
            <Image source={{ uri: enemy.gif }} style={styles.image} />
            <Text>HP: {enemyHP}</Text>
          </View>
        )}
      </View>

      <Text style={{ margin: 10 }}>{log}</Text>

      <TouchableOpacity style={styles.attackButton} onPress={attack}>
        <Text style={styles.buttonText}>⚔️ Atacar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={goBack}>
        <Text style={styles.buttonText}>⬅ Voltar</Text>
      </TouchableOpacity>
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

  title: {
    fontSize: 22,
    color: "#fff",
  },

  name: {
    fontSize: 24,
    color: "#fff",
  },

  image: {
    width: 120,
    height: 120,
    marginVertical: 10,
  },

  info: {
    color: "#fff",
  },

  description: {
    marginTop: 10,
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
  },

  input: {
    backgroundColor: "#1f2937",
    color: "#fff",
    width: "100%",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },

  button: {
    backgroundColor: "#374151",
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
  },

  soundButton: {
    backgroundColor: "#16a34a",
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
  },

  attackButton: {
    backgroundColor: "#f97316",
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
  },

  battleButton: {
    backgroundColor: "#ef4444",
    padding: 12,
    marginTop: 10,
    borderRadius: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  battleRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },

  pokemonBox: {
    alignItems: "center",
  },
});
