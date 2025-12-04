function getCardHTML(pokemon) {
  const types = getTypeBadges(pokemon.types);
  const image = getPokemonImage(pokemon);
  const name = getPokemonName(pokemon);
  const id = getPokemonId(pokemon);

  return (
    '<div class="pokemon-card" onclick="showPokemonDetails(' + pokemon.id + ')">' + image + name + id + '<div class="pokemon-types">' + types + "</div>" + "</div>"
  );
}

function getModalHTML(pokemon) {
  const header = getModalHeader(pokemon);
  const stats = getStatsSection(pokemon.stats);

  return header + stats;
}

function getModalHeader(pokemon) {
  const types = getTypeBadges(pokemon.types);
  const image = getPokemonImageLarge(pokemon);
  const name = getPokemonNameLarge(pokemon);
  const id = getPokemonId(pokemon);

  return (
    '<div class="modal-pokemon-header">' 
    + image + name + id + 
    '<div class="pokemon-types">' 
    + types +
    "</div>" +
    "</div>"
  );
}

function getStatsSection(stats) {
  const statsHTML = getStatsHTML(stats);

  return (
    '<div class="pokemon-stats">' + "<h3>Stats</h3>" + statsHTML + "</div>"
  );
}

function getTypeBadges(types) {
  let html = "";
  for (let i = 0; i < types.length; i++) {
    const typeName = types[i].type.name;
    html +=
      '<span class="type-badge type-' + typeName + '">' + typeName + "</span>";
  }
  return html;
}

function getPokemonImage(pokemon) {
  return (
    '<img src="' + pokemon.sprites.other["official-artwork"].front_default + 
    '" alt="' + pokemon.name + '" loading="lazy">'
  );
}

function getPokemonImageLarge(pokemon) {
  return (
    '<img src="' + pokemon.sprites.other["official-artwork"].front_default + 
    '" alt="' + pokemon.name + '" class="modal-pokemon-image">'
  );
}

function getPokemonName(pokemon) {
  return (
    '<h3 class="pokemon-name">' + capitalizeFirstLetter(pokemon.name) + "</h3>"
  );
}

function getPokemonNameLarge(pokemon) {
  return (
    '<h2 class="modal-pokemon-name">' + capitalizeFirstLetter(pokemon.name) + "</h2>"
  );
}

function getPokemonId(pokemon) {
  return (
    '<p class="pokemon-id">#' + String(pokemon.id).padStart(3, "0") + "</p>"
  );
}

function getStatsHTML(stats) {
  let html = "";
  for (let i = 0; i < stats.length; i++) {
    html += getStatRow(stats[i]);
  }
  return html;
}

function getStatRow(stat) {
  const name = formatStatName(stat.stat.name);
  const value = stat.base_stat;
  const barWidth = (value / 255) * 100;

  return (
    '<div class="stat-row">' +
    '<div class="stat-name">' +
    name +
    "</div>" +
    '<div class="stat-bar-container">' +
    '<div class="stat-bar" style="width: ' +
    barWidth +
    '%"></div>' +
    "</div>" +
    '<div class="stat-value">' +
    value +
    "</div>" +
    "</div>"
  );
}

function formatStatName(statName) {
  if (statName === "hp") return "HP";
  if (statName === "special-attack") return "Sp. Attack";
  if (statName === "special-defense") return "Sp. Defense";
  return capitalizeFirstLetter(statName);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
