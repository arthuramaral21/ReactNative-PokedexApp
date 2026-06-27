# Pokédex App

Aplicativo mobile desenvolvido com React Native e Expo para consulta de Pokémons e gerenciamento de uma coleção pessoal usando Firebase Firestore.

O projeto consome dados da PokéAPI, permite cadastrar Pokémons na coleção, listar os registros salvos, editar apelidos e excluir Pokémons cadastrados.

## Tecnologias Utilizadas

- React Native
- Expo SDK 54
- JavaScript
- React Navigation
- Firebase Firestore
- PokéAPI
- Expo AV
- React Native Animated

## Funcionalidades

- Consulta de Pokémons por nome ou ID.
- Consumo da API pública PokéAPI.
- Exibição de informações do Pokémon:
  - Nome
  - ID
  - Imagem/GIF
  - Tipo
  - Geração
  - Região
  - Categoria
  - Descrição
- Reprodução do som do Pokémon.
- Cadastro de Pokémon na coleção.
- Listagem dos Pokémons cadastrados.
- Edição de apelido.
- Exclusão de Pokémon da coleção.
- Modo claro e modo noturno.
- Animação na imagem do Pokémon.

## Requisitos Técnicos Atendidos

### Navegação Roteada

O projeto utiliza React Navigation com Stack Navigator e possui três telas principais:

- `Home`: Pokédex com busca na API.
- `Cadastro`: cadastro do Pokémon selecionado.
- `Lista`: coleção de Pokémons salvos.

### Consumo de API Externa

A tela inicial consome a PokéAPI usando `fetch`.

API utilizada:

```text
https://pokeapi.co/api/v2/pokemon
```

### CRUD com Firebase Firestore

A coleção utilizada no Firestore é:

```text
pokemons
```

Operações implementadas:

- Create: cadastrar Pokémon.
- Read: listar Pokémons cadastrados.
- Update: editar apelido.
- Delete: excluir Pokémon.

Modelo do documento salvo:

```js
{
  nome: pokemon.nome,
  apelido: apelido,
  pokemonId: pokemon.id,
  imagem: pokemon.imagem,
  tipo: pokemon.tipo1
}
```

### Animações

O app utiliza a API `Animated` do React Native para animar a imagem do Pokémon ao tocar nela.

## Estrutura do Projeto

```text
pokedex/
├── assets/
├── Components/
│   └── PokemonCard.js
├── Context/
│   └── AppThemeContext.js
├── Navigation/
│   └── AppNavigator.js
├── Screens/
│   ├── HomeScreen.js
│   ├── CadastroScreen.js
│   └── ListaScreen.js
├── Services/
│   ├── firebaseConfig.js
│   └── pokemonService.js
├── App.js
├── app.json
├── index.js
└── package.json
```

## Como Rodar o Projeto

Instale as dependências:

```bash
npm install
```

Inicie o projeto:

```bash
npm start
```

Depois, abra no Expo Go ou em um emulador Android/iOS.

## Scripts Disponíveis

```bash
npm start
```

Inicia o Expo.

```bash
npm run android
```

Inicia o projeto no Android.

```bash
npm run ios
```

Inicia o projeto no iOS.

```bash
npm run web
```

Inicia o projeto no navegador.

## Fluxo de Uso

1. Abra a tela `Home`.
2. Busque um Pokémon por nome ou ID.
3. Toque em `Cadastrar`.
4. Informe um apelido.
5. Salve o Pokémon na coleção.
6. Acesse `Minha Coleção`.
7. Edite o apelido ou exclua o Pokémon, se desejar.

## Firebase

O Firebase está configurado em:

```text
Services/firebaseConfig.js
```

O serviço responsável pelas operações no Firestore está em:

```text
Services/pokemonService.js
```

## Observações

- O projeto utiliza nomes de pastas com inicial maiúscula, como `Screens`, `Services`, `Components` e `Navigation`.
- Em sistemas Linux, os imports devem respeitar exatamente letras maiúsculas e minúsculas.
- A coleção `pokemons` pode ser criada automaticamente no Firestore ao salvar o primeiro Pokémon.
