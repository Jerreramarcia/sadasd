function searchPokemon(pokemonName = null) {
    if (!pokemonName) {
        pokemonName = document.getElementById('search-box').value.trim().toLowerCase();
    }
    const url = `/scrape?pokemon=${pokemonName}`;

    // Ocultar el contenedor de Pokémon aleatorios
    document.getElementById('random-pokemon-container').style.display = 'none';
    // Mostrar el botón "Volver"
    document.getElementById('back-button').style.display = 'block';
    // Limpiar el campo de búsqueda
    document.getElementById('search-box').value = '';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('pokemon-display').innerHTML = data.error;
            } else {
                displayPokemon(data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('pokemon-display').innerHTML = 'Error al obtener los datos.';
        });

    document.getElementById('title-image-container').style.display = 'none';
    document.getElementById('back-button').style.display = 'block';
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function displayPokemon(data) {
    const pokemonDisplay = document.getElementById('pokemon-display');
    const capitalizedPokemonName = capitalizeFirstLetter(data.name);

    // Traducción de tipos de Pokémon
    const spanishTypes = {
        normal: 'Normal',
        fire: 'Fuego',
        water: 'Agua',
        electric: 'Eléctrico',
        grass: 'Planta',
        ice: 'Hielo',
        fighting: 'Lucha',
        poison: 'Veneno',
        ground: 'Tierra',
        flying: 'Volador',
        psychic: 'Psíquico',
        bug: 'Bicho',
        rock: 'Roca',
        ghost: 'Fantasma',
        dragon: 'Dragón',
        dark: 'Siniestro',
        steel: 'Acero',
        fairy: 'Hada'
        // Agrega más tipos según sea necesario
    };

    // Traduce los tipos del Pokémon
    const translatedTypes = data.types.map(type => spanishTypes[type]);

    pokemonDisplay.innerHTML = `
        <h1>${capitalizedPokemonName}</h1>
        <img src="${data.image}" alt="${capitalizedPokemonName}">
        <h2>Descripción</h2>
        <p>${data.description}</p>
        <h2>Estadísticas</h2>
        ${data.additional_info ? `<p>${data.additional_info}</p>` : ''}
        <p>Peso: ${data.weight / 10} kg</p>
        <p>Altura: ${data.height / 10} m</p>
        <p>Tipos: ${translatedTypes.join(', ')}</p>
    `;
    // Asegurarse de que el contenedor de visualización de Pokémon sea visible
    document.getElementById('pokemon-display').style.display = 'block';
}


document.addEventListener('DOMContentLoaded', loadRandomPokemons);

async function loadRandomPokemons() {
    document.getElementById('search-section').classList.remove('active'); // Asegura que la barra de búsqueda regrese a su posición original
    for (let i = 0; i < 8; i++) {
        const pokemonId = Math.floor(Math.random() * 898) + 1;
        const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayRandomPokemon(data);
            })
            .catch(error => {
                console.error('Error loading random Pokémon:', error);
            });
    }
    // Mostrar el contenedor de Pokémon aleatorios
    document.getElementById('random-pokemon-container').style.display = 'flex';
}

function displayRandomPokemon(pokemon) {
    const pokemonContainer = document.getElementById('random-pokemon-container');
    const pokemonImg = document.createElement('img');
    pokemonImg.src = pokemon.sprites.front_default;
    pokemonImg.alt = pokemon.name;
    pokemonImg.className = 'pokemon-image';
    pokemonImg.onclick = () => {
        searchPokemon(pokemon.name);
    };
    pokemonContainer.appendChild(pokemonImg);
}

function reloadRandomPokemons() {
    document.getElementById('pokemon-display').style.display = 'none';
    document.getElementById('pokemon-display').innerHTML = '';
    document.getElementById('back-button').style.display = 'none'; // Ocultar el botón "Volver"
    document.getElementById('random-pokemon-container').innerHTML = '';
    document.getElementById('random-pokemon-container').style.display = 'flex';
    loadRandomPokemons();
    // Asegurarse de que la barra de búsqueda sea visible y limpia
    document.getElementById('search-section').style.display = 'block';
    document.getElementById('search-box').value = '';
    document.getElementById('title-image-container').style.display = 'flex';
    document.getElementById('back-button').style.display = 'none';
    document.getElementById('pokemon-display').innerHTML = '';
    document.getElementById('pokemon-compare-display').style.display = 'none';
    document.getElementById('compare-search').style.display = 'none';
}

