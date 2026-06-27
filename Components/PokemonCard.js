import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PokemonCard({ pokemon, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newNickname, setNewNickname] = useState(pokemon.apelido || "");

  const handleSave = () => {
    onUpdate(pokemon.id, newNickname);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewNickname(pokemon.apelido || "");
    setIsEditing(false);
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: pokemon.imagem }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.name}>{pokemon.nome}</Text>
        <Text style={styles.info}>ID: #{pokemon.pokemonId}</Text>
        <Text style={styles.info}>Tipo: {pokemon.tipo}</Text>

        {isEditing ? (
          <TextInput
            style={styles.input}
            value={newNickname}
            onChangeText={setNewNickname}
            placeholder="Novo apelido"
            placeholderTextColor="#94a3b8"
          />
        ) : (
          <Text style={styles.nickname}>
            Apelido: {pokemon.apelido || "Sem apelido"}
          </Text>
        )}

        {isEditing ? (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDelete(pokemon.id)}
            >
              <Text style={styles.buttonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    flexDirection: "row",
    marginBottom: 12,
    padding: 12,
    width: "100%",
  },

  image: {
    height: 82,
    marginRight: 12,
    width: 82,
  },

  content: {
    flex: 1,
  },

  name: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "bold",
  },

  info: {
    color: "#475569",
    fontSize: 14,
    marginTop: 2,
    textTransform: "capitalize",
  },

  nickname: {
    color: "#1f2937",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 6,
  },

  input: {
    backgroundColor: "#f1f5f9",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: 1,
    color: "#111827",
    marginTop: 8,
    padding: 8,
  },

  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },

  editButton: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  deleteButton: {
    backgroundColor: "#dc2626",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  saveButton: {
    backgroundColor: "#16a34a",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  cancelButton: {
    backgroundColor: "#64748b",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
