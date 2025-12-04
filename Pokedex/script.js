const content = document.getElementById("pokedex-grid");
let currentOffset = 0;
const limit = 20; // Lade 20 Pokemon 
let isLoading = false;
let allPokemonLoaded = false;

function init() {
  renderCards();
  setupInfiniteScroll();
}

async function renderCards() {
  if (isLoading || allPokemonLoaded) return;

  isLoading = true;
  showLoadingIndicator();

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${currentOffset}`
    );
    const data = await response.json();

    if (data.results.length === 0) {
      allPokemonLoaded = true;
      hideLoadingIndicator();
      return;
    }

    for (let i = 0; i < data.results.length; i++) {
      let pokemon = data.results[i];

      const detailResponse = await fetch(pokemon.url);
      const pokemonDetails = await detailResponse.json();

      let html = getCardHTML(pokemonDetails);
      content.innerHTML += html;
    }

    currentOffset += limit;

    if (currentOffset >= 151) {
      allPokemonLoaded = true;
    }
  } catch (error) {
    console.error("Fehler beim Laden der Pokemon:", error);
  } finally {
    isLoading = false;
    hideLoadingIndicator();
  }
}

function getCardHTML(pokemonDetails) {
  return `
      <section class="contentStyle">
          <div>
              <h2>${pokemonDetails.name}</h2>
              <p>#${pokemonDetails.id}</p>
            </div>
          <img src="${pokemonDetails.sprites.other["official-artwork"].front_default}" alt="${pokemonDetails.name}">
      </section>
      `;
}

function setupInfiniteScroll() {
  window.addEventListener("scroll", function () {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      !isLoading &&
      !allPokemonLoaded
    ) {
      renderCards();
    }
  });
}

function showLoadingIndicator() {
  const loadingDiv = document.createElement("div");
  loadingDiv.id = "loading-indicator";
  loadingDiv.className = "loading";
  loadingDiv.textContent = "Lade Pokemon...";
  document.body.appendChild(loadingDiv);
}

function hideLoadingIndicator() {
  const loadingDiv = document.getElementById("loading-indicator");
  if (loadingDiv) {
    loadingDiv.remove();
  }
}
