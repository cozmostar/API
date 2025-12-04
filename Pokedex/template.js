// POKEMON KARTEN TEMPLATE
function getCardHTML(pokemonDetails) {
  return `
      <section class="contentStyle" onclick="showPokemonDetails(${pokemonDetails.id})">
          <div>
              <h2>${pokemonDetails.name}</h2>
              <p>#${pokemonDetails.id}</p>
            </div>
          <img src="${pokemonDetails.sprites.other["official-artwork"].front_default}" alt="${pokemonDetails.name}">
      </section>
      `;
}

// POKEMON DETAIL TEMPLATE
function getPokemonDetailHTML(pokemon, description, types, abilities) {
  return `
    <div class="pokemon-detail-view">
      <div class="detail-header">
        <h2>${pokemon.name.toUpperCase()}</h2>
        <span class="pokemon-id">#${String(pokemon.id).padStart(3, "0")}</span>
      </div>
      
      <div class="detail-content">
        <div class="detail-image">
          <img src="${
            pokemon.sprites.other["official-artwork"].front_default
          }" alt="${pokemon.name}">
        </div>
        
        <div class="detail-info">
          <div class="info-section">
            <h3>Beschreibung</h3>
            <p>${description}</p>
          </div>
          
          <div class="info-section">
            <h3>Typ</h3>
            <div class="types-container">${types}</div>
          </div>
          
          <div class="info-section">
            <h3>Eigenschaften</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-label">Größe:</span>
                <span class="stat-value">${pokemon.height / 10} m</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Gewicht:</span>
                <span class="stat-value">${pokemon.weight / 10} kg</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Fähigkeiten:</span>
                <span class="stat-value">${abilities}</span>
              </div>
            </div>
          </div>
          
          <div class="info-section">
            <h3>Statuswerte</h3>
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
        <span class="stat-name">${translateStatName(stat.stat.name)}</span>
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

// Statuswerte Übersetzung
function translateStatName(statName) {
  const translations = {
    hp: "HP",
    attack: "Angriff",
    defense: "Verteidigung",
    "special-attack": "Spez. Angriff",
    "special-defense": "Spez. Verteidigung",
    speed: "Initiative",
  };
  return translations[statName] || statName;
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
