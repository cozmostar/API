const content = document.getElementById("content");

function init() {
  renderCards();
}

async function renderCards() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  const data = await response.json();

  for (let i = 0; i < data.results.length; i++) {
    let pokemon = data.results[i];

    // Details für jedes Pokemon
    const detailResponse = await fetch(pokemon.url);
    const pokemonDetails = await detailResponse.json();

    let html = `
        <section class="contentStyle">
            <div>
                <h2>${pokemonDetails.name}</h2>
                <p>#${pokemonDetails.id}</p>
              </div>
            <img src="${pokemonDetails.sprites.other["official-artwork"].front_default}" alt="${pokemonDetails.name}">
        </section>
        `;
    content.innerHTML += html;
  }
}