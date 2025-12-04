let pokemonCache = {};
let allPokemon = [];
let currentOffset = 0;
let currentPokemonIndex = 0;
let isLoading = false;
const POKEMON_PER_PAGE = 30;

let pokedexGrid;
let searchInput;
let loadingSpinner;
let loadMoreBtn;
let modalElement;
let modalBody;

function init() {
  pokedexGrid = document.getElementById("pokedex-grid");
  searchInput = document.getElementById("search-input");
  loadingSpinner = document.getElementById("loading");
  loadMoreBtn = document.getElementById("load-more-btn");
  modalElement = document.getElementById("pokemon-modal");
  modalBody = document.getElementById("modal-body");

  loadPokemon();
}

async function loadPokemon() {
  if (isLoading) {
    return;
  }

  try {
    startLoading();
    const url = buildPokemonUrl();
    const response = await fetch(url);
    const data = await response.json();
    const pokemonArray = await createPokemonPromises(data);
    handlePokemonData(pokemonArray);
  } catch (error) {
    handleLoadError(error);
  }
}

function startLoading() {
  isLoading = true;
  showLoading();
  disableLoadMoreButton();
}

function buildPokemonUrl() {
  return (
    "https://pokeapi.co/api/v2/pokemon?limit=" +
    POKEMON_PER_PAGE +
    "&offset=" +
    currentOffset
  );
}

async function createPokemonPromises(data) {
  let promises = [];
  for (let i = 0; i < data.results.length; i++) {
    const pokemonUrl = data.results[i].url;
    const pokemonId = getPokemonIdFromUrl(pokemonUrl);
    promises.push(fetchPokemonData(pokemonId));
  }
  return await Promise.all(promises);
}

function handlePokemonData(pokemonArray) {
  addPokemonToList(pokemonArray);
  renderPokemonCards(pokemonArray);
  currentOffset += POKEMON_PER_PAGE;
  finishLoading();
}

function addPokemonToList(pokemonArray) {
  for (let i = 0; i < pokemonArray.length; i++) {
    allPokemon.push(pokemonArray[i]);
  }
}

function finishLoading() {
  hideLoading();
  enableLoadMoreButton();
  isLoading = false;
}

function handleLoadError(error) {
  console.error("Error loading Pokemon:", error);
  finishLoading();
}

function loadMorePokemon() {
  loadPokemon();
}

async function fetchPokemonData(id) {
  if (pokemonCache[id]) {
    return pokemonCache[id];
  }

  const url = "https://pokeapi.co/api/v2/pokemon/" + id;
  const response = await fetch(url);
  const data = await response.json();
  pokemonCache[id] = data;
  return data;
}

function renderPokemonCards(pokemonArray) {
  for (let i = 0; i < pokemonArray.length; i++) {
    const cardHTML = getCardHTML(pokemonArray[i]);
    pokedexGrid.innerHTML += cardHTML;
  }
}

async function showPokemonDetails(id) {
  currentPokemonIndex = findPokemonIndexById(id);
  const pokemon = await fetchPokemonData(id);
  modalBody.innerHTML = getModalHTML(pokemon);
  modalElement.classList.add("show");
  document.body.classList.add("modal-open");
}

function closeModal() {
  modalElement.classList.remove("show");
  document.body.classList.remove("modal-open");
}

function closeModalOnOverlay(event) {
  if (event.target.id === "pokemon-modal") {
    closeModal();
  }
}

async function nextPokemon() {
  if (currentPokemonIndex < allPokemon.length - 1) {
    currentPokemonIndex++;
    const nextPokemonId = allPokemon[currentPokemonIndex].id;
    await updateModalContent(nextPokemonId);
  }
}

async function previousPokemon() {
  if (currentPokemonIndex > 0) {
    currentPokemonIndex--;
    const prevPokemonId = allPokemon[currentPokemonIndex].id;
    await updateModalContent(prevPokemonId);
  }
}

async function updateModalContent(id) {
  const pokemon = await fetchPokemonData(id);
  modalBody.innerHTML = getModalHTML(pokemon);
}

function searchPokemon() {
  const query = searchInput.value.trim().toLowerCase();

  if (query.length < 3) {
    alert("Please enter at least 3 characters to search");
    return;
  }

  pokedexGrid.innerHTML = "";
  const foundPokemon = filterPokemon(query);
  displaySearchResults(foundPokemon);
}

function filterPokemon(query) {
  let foundPokemon = [];
  for (let i = 0; i < allPokemon.length; i++) {
    const pokemon = allPokemon[i];
    if (pokemon.name.includes(query) || String(pokemon.id).includes(query)) {
      foundPokemon.push(pokemon);
    }
  }
  return foundPokemon;
}

function displaySearchResults(foundPokemon) {
  if (foundPokemon.length === 0) {
    pokedexGrid.innerHTML =
      '<div class="no-results">No Pokemon found. Try another search.</div>';
  } else {
    renderPokemonCards(foundPokemon);
  }
}

function showLoading() {
  loadingSpinner.style.display = "block";
}

function hideLoading() {
  loadingSpinner.style.display = "none";
}

function disableLoadMoreButton() {
  loadMoreBtn.disabled = true;
}

function enableLoadMoreButton() {
  loadMoreBtn.disabled = false;
}

function findPokemonIndexById(id) {
  for (let i = 0; i < allPokemon.length; i++) {
    if (allPokemon[i].id === id) {
      return i;
    }
  }
  return 0;
}

function getPokemonIdFromUrl(url) {
  const urlParts = url.split("/");
  return parseInt(urlParts[urlParts.length - 2]);
}
