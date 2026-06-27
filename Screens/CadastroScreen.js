import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

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
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.title}>Nenhum Pokémon selecionado</Text>
          <Text style={styles.description}>
            Volte para a Pokédex, escolha um Pokémon e toque em cadastrar.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.buttonText}>Voltar para Pokédex</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="dark" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardArea}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Nova captura</Text>
            <Text style={styles.title}>Cadastrar Pokémon</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.imageFrame}>
              <Image
                source={{ uri: pokemon.imagem }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.name}>{pokemon.nome}</Text>

            <View style={styles.metaRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>#{pokemon.id}</Text>
              </View>

              <View style={[styles.badge, styles.typeBadge]}>
                <Text style={[styles.badgeText, styles.typeText]}>
                  {pokemon.tipo1}
                </Text>
              </View>
            </View>

            <Text style={styles.label}>Apelido</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: parceiro, campeão..."
              placeholderTextColor="#94a3b8"
              value={apelido}
              onChangeText={setApelido}
            />

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.disabledButton]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Salvar na coleção</Text>
              )}
            </TouchableOpacity>
          </View>

          <StatusBar style="dark" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#f8fafc",
    flex: 1,
  },

  keyboardArea: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 18,
  },

  emptyContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 18,
  },

  header: {
    marginBottom: 16,
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

  card: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
    padding: 18,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },

  imageFrame: {
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    height: 176,
    justifyContent: "center",
    marginBottom: 14,
    width: "100%",
  },

  image: {
    height: 150,
    width: 150,
  },

  name: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "900",
  },

  metaRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },

  badge: {
    backgroundColor: "#fef3c7",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  typeBadge: {
    backgroundColor: "#e0f2fe",
  },

  badgeText: {
    color: "#92400e",
    fontWeight: "900",
  },

  typeText: {
    color: "#075985",
    textTransform: "capitalize",
  },

  description: {
    color: "#475569",
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: "center",
  },

  label: {
    alignSelf: "flex-start",
    color: "#334155",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 8,
    marginTop: 24,
  },

  input: {
    backgroundColor: "#f8fafc",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: 1,
    color: "#111827",
    marginTop: 0,
    padding: 14,
    width: "100%",
  },

  primaryButton: {
    alignItems: "center",
    backgroundColor: "#dc2626",
    borderRadius: 8,
    elevation: 2,
    marginTop: 16,
    padding: 14,
    shadowColor: "#dc2626",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
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
