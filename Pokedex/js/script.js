// GLOBALE VARIABLEN
const content = document.getElementById("pokedex-grid");
let currentOffset = 0;
const limit = 20;
let isLoading = false;
let allPokemonLoaded = false;

// INITIALISIERUNG
function init() {
  renderCards();
  setupInfiniteScroll();
  setupModal();
}

// POKEMON KARTEN - HAUPT-RENDERING
async function renderCards() {
  if (isLoading || allPokemonLoaded) return;

  isLoading = true;
  showLoadingIndicator();

  try {
    const data = await fetchPokemonBatch();
    if (!data || data.results.length === 0) {
      handleNoMorePokemon();
      return;
    }

    await renderPokemonList(data.results);
    updatePaginationState();
  } catch (error) {
    console.error("Error loading Pokemon:", error);
  } finally {
    isLoading = false;
    hideLoadingIndicator();
  }
}

async function renderPokemonList(pokemonList) {
  for (let i = 0; i < pokemonList.length; i++) {
    await renderSinglePokemon(pokemonList[i]);
  }
}

async function renderSinglePokemon(pokemon) {
  const detailResponse = await fetch(pokemon.url);
  const pokemonDetails = await detailResponse.json();
  const html = getCardHTML(pokemonDetails);
  content.innerHTML += html;
}

// POKEMON KARTEN - API CALLS
async function fetchPokemonBatch() {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${currentOffset}`
  );
  return await response.json();
}

// POKEMON KARTEN - LOGIK
function handleNoMorePokemon() {
  allPokemonLoaded = true;
  hideLoadingIndicator();
}

function updatePaginationState() {
  currentOffset += limit;
  if (currentOffset >= 151) {
    allPokemonLoaded = true;
  }
}

// POKEMON DETAILS - MODAL
async function showPokemonDetails(pokemonId) {
  const modal = document.getElementById("pokemon-modal");
  const modalBody = document.getElementById("modal-body");

  showModalLoading(modalBody, modal);

  try {
    const pokemon = await fetchPokemonById(pokemonId);
    displayPokemonDetails(modalBody, pokemon);
  } catch (error) {
    console.error("Error loading Pokemon details:", error);
    modalBody.innerHTML = '<p class="error">Error loading details.</p>';
  }
}

function showModalLoading(modalBody, modal) {
  modalBody.innerHTML = '<div class="loading">Loading Details...</div>';
  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

function displayPokemonDetails(modalBody, pokemon) {
  const types = getTypesHTML(pokemon.types);
  const abilities = getAbilitiesText(pokemon.abilities);
  modalBody.innerHTML = getPokemonDetailHTML(pokemon, types, abilities);
}

// POKEMON DETAILS - API CALLS
async function fetchPokemonById(pokemonId) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
  );
  return await response.json();
}

// MODAL SETUP
function setupModal() {
  const modal = document.getElementById("pokemon-modal");
  const closeBtn = document.querySelector(".close-btn");

  closeBtn.onclick = function () {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  };

  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  };
}

// POKEMON NAVIGATION
function navigateToPrevious(currentId) {
  if (currentId > 1) {
    showPokemonDetails(currentId - 1);
  }
}

function navigateToNext(currentId) {
  if (currentId < 151) {
    showPokemonDetails(currentId + 1);
  }
}

// INFINITE SCROLL
function setupInfiniteScroll() {
  window.addEventListener("scroll", handleScroll);
}

function handleScroll() {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
    !isLoading &&
    !allPokemonLoaded
  ) {
    renderCards();
  }
}

// LOADING INDICATOR
function showLoadingIndicator() {
  const loadingDiv = document.createElement("div");
  loadingDiv.id = "loading-indicator";
  loadingDiv.className = "loading";
  loadingDiv.textContent = "Loading Pokemon...";
  document.body.appendChild(loadingDiv);
}

function hideLoadingIndicator() {
  const loadingDiv = document.getElementById("loading-indicator");
  if (loadingDiv) {
    loadingDiv.remove();
  }
}
