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
      <View style={styles.imageFrame}>
        <Image
          source={{ uri: pokemon.imagem }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{pokemon.nome}</Text>
          <Text style={styles.number}>#{pokemon.pokemonId}</Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{pokemon.tipo}</Text>
          </View>
        </View>

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
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    flexDirection: "row",
    marginBottom: 12,
    padding: 12,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    width: "100%",
  },

  imageFrame: {
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    height: 86,
    justifyContent: "center",
    marginRight: 12,
    width: 86,
  },

  image: {
    height: 76,
    width: 76,
  },

  content: {
    flex: 1,
  },

  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  name: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
    flex: 1,
    paddingRight: 8,
  },

  number: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "900",
  },

  metaRow: {
    flexDirection: "row",
    marginTop: 6,
  },

  typeBadge: {
    backgroundColor: "#e0f2fe",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  typeText: {
    color: "#075985",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "capitalize",
  },

  nickname: {
    color: "#334155",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 8,
  },

  input: {
    backgroundColor: "#f8fafc",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: 1,
    color: "#111827",
    marginTop: 8,
    padding: 10,
  },

  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },

  editButton: {
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 8,
    flex: 1,
    minWidth: 78,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  deleteButton: {
    alignItems: "center",
    backgroundColor: "#dc2626",
    borderRadius: 8,
    flex: 1,
    minWidth: 78,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  saveButton: {
    alignItems: "center",
    backgroundColor: "#0f766e",
    borderRadius: 8,
    flex: 1,
    minWidth: 78,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  cancelButton: {
    alignItems: "center",
    backgroundColor: "#64748b",
    borderRadius: 8,
    flex: 1,
    minWidth: 78,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
