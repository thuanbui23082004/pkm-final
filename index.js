const app = document.querySelector(".app");
const button = document.querySelector(".button");
const input = document.querySelector(".search");
let start = 0;
let limit = 18;
let pokemons = [];
let filteredPokemons = [];

const typeColors = {
    grass: "#78cd54",
    poison: "#a33ea1",
    fire: "#ff421c",
    flying: "#a98ff3",
    water: "#6390f0",
    bug: "#a6b91a",
    normal: "#a8a77a",
    electric: "#f7d02c",
    ground: "#e2bf65",
    fairy: "#d685ad",
    fighting: "#c22e28",
    psychic: "#f95587",
    rock: "#b6a136",
    ghost: "#735797",
    ice: "#96d9d6",
    dragon: "#6f35fc",
    dark: "#705746",
    steel: "#b7b7ce",
};

async function cFetch(URL) {
    try {
        const response = await fetch(URL);
        return await response.json();
    } catch (error) {
        console.log("error", error);
        return null;
    }
}

function createPokemonType(types) {
    return types
        .map((type) => {
            const color = typeColors[type.type.name] || "#ccc";
            return `<div class="${type.type.name}" style="background-color: ${color}">${type.type.name}</div>`;
        })
        .join("");
}

async function render() {
    if (!button) return;
    button.style.display = "block";

    const pokePromises = [];
    for (; start < limit; start++) {
        const pokemon = filteredPokemons[start];
        if (!pokemon) {
            button.style.display = "none";
            break;
        }
        pokePromises.push(cFetch(pokemon.url));
    }

    const pokeData = await Promise.all(pokePromises);
    pokeData.forEach((pokemon) => {
        if (pokemon) {
            app.innerHTML += `
        <div class="pokemon">
          <div class="id">#${pokemon.id}</div>
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
              pokemon.id
          }.png" alt="${pokemon.name}">
          <div class="name">${pokemon.name}</div>
          <div class="type">${createPokemonType(pokemon.types)}</div>
        </div>
      `;
        }
    });

    limit += 18;
}

async function fetchPokemons() {
    const data = await cFetch(
        "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=898"
    );
    if (data) {
        pokemons = data.results;
        filteredPokemons = data.results;
        app.innerHTML = "";
        render();
    }
}

function handleSearch() {
    filteredPokemons = pokemons.filter((pokemon) =>
        pokemon.name.includes(input.value.toLowerCase())
    );

    app.innerHTML = "";
    start = 0;
    limit = 18;
    render();
}

input.addEventListener("input", handleSearch);
button.addEventListener("click", render);
fetchPokemons();
