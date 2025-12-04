// POKEMON KARTEN TEMPLATE
function getCardHTML(pokemonDetails) {
  const capitalizedName =
    pokemonDetails.name.charAt(0).toUpperCase() + pokemonDetails.name.slice(1);
  return `
      <section class="contentStyle" onclick="showPokemonDetails(${pokemonDetails.id})">
          <div>
              <h2>${capitalizedName}</h2>
              <p>#${pokemonDetails.id}</p>
              <div class="types-container">${getTypesHTML(pokemonDetails.types)}</div>
          </div>
          <img src="${pokemonDetails.sprites.other["official-artwork"].front_default}" alt="${pokemonDetails.name}">
      </section>
      `;
}

// POKEMON DETAIL TEMPLATE
function getPokemonDetailHTML(pokemon, types, abilities) {
  return `
    <div class="pokemon-detail-view">
      <div class="detail-header">
        <button class="nav-btn prev-btn" onclick="navigateToPrevious(${
          pokemon.id
        })" ${pokemon.id <= 1 ? "disabled" : ""}>
          ← Previous
        </button>
        <div class="detail-title">
          <h2>${pokemon.name.toUpperCase()}</h2>
          <span class="pokemon-id">#${String(pokemon.id).padStart(
            3,
            "0"
          )}</span>
        </div>
        <button class="nav-btn next-btn" onclick="navigateToNext(${
          pokemon.id
        })" ${pokemon.id >= 151 ? "disabled" : ""}>
          Next →
        </button>
      </div>
      
      <div class="detail-content">
        <div class="detail-image">
          <img src="${
            pokemon.sprites.other["official-artwork"].front_default
          }" alt="${pokemon.name}">
        </div>
        
        <div class="detail-info">
          <div class="info-section">
            <h3>Type</h3>
            <div class="types-container">${types}</div>
          </div>
          
          <div class="info-section">
            <h3>Properties</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-label">Height:</span>
                <span class="stat-value">${pokemon.height / 10} m</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Weight:</span>
                <span class="stat-value">${pokemon.weight / 10} kg</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Abilities:</span>
                <span class="stat-value">${abilities}</span>
              </div>
            </div>
          </div>
          
          <div class="info-section">
            <h3>Stats</h3>
            <div class="stats-bars">
              ${getStatsHTML(pokemon.stats)}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// HELPER TEMPLATES
// Statuswerte
function getStatsHTML(stats) {
  let html = "";
  for (let i = 0; i < stats.length; i++) {
    let stat = stats[i];
    html += `
      <div class="stat-bar-container">
        <span class="stat-name">${stat.stat.name}</span>
        <div class="stat-bar-bg">
          <div class="stat-bar-fill" style="width: ${Math.min(
            stat.base_stat / 2,
            100
          )}%"></div>
        </div>
        <span class="stat-number">${stat.base_stat}</span>
      </div>
    `;
  }
  return html;
}

// Pokemon Typen
function getTypesHTML(types) {
  let html = "";
  for (let i = 0; i < types.length; i++) {
    html += `<span class="type-badge type-${types[i].type.name}">${types[i].type.name}</span>`;
  }
  return html;
}

// Pokemon Fähigkeiten
function getAbilitiesText(abilities) {
  let names = [];
  for (let i = 0; i < abilities.length; i++) {
    names.push(abilities[i].ability.name);
  }
  return names.join(", ");
}
