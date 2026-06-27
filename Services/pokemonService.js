import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebaseConfig";

const COLLECTION_NAME = "pokemons";

export async function createPokemon(pokemon, apelido) {
  return addDoc(collection(db, COLLECTION_NAME), {
    nome: pokemon.nome,
    apelido: apelido.trim(),
    pokemonId: pokemon.id,
    imagem: pokemon.imagem,
    tipo: pokemon.tipo1,
  });
}

export function subscribePokemons(onSuccess, onError) {
  return onSnapshot(
    collection(db, COLLECTION_NAME),
    (snapshot) => {
      const pokemons = snapshot.docs
        .map((pokemonDoc) => ({
          id: pokemonDoc.id,
          ...pokemonDoc.data(),
        }))
        .sort((firstPokemon, secondPokemon) => {
          return firstPokemon.pokemonId - secondPokemon.pokemonId;
        });

      onSuccess(pokemons);
    },
    onError,
  );
}

export async function updatePokemonNickname(id, apelido) {
  const pokemonRef = doc(db, COLLECTION_NAME, id);

  return updateDoc(pokemonRef, {
    apelido: apelido.trim(),
  });
}

export async function deletePokemon(id) {
  const pokemonRef = doc(db, COLLECTION_NAME, id);

  return deleteDoc(pokemonRef);
}
