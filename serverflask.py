from flask import Flask, jsonify, request
from flask_cors import CORS  # Importa CORS aquí
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)  # Configura CORS aquí

@app.route('/scrape', methods=['GET'])
def scrape():
    pokemon_name = request.args.get('pokemon').lower()

    # Obtener información desde la PokeAPI
    pokeapi_url = f'https://pokeapi.co/api/v2/pokemon/{pokemon_name}'
    pokeapi_response = requests.get(pokeapi_url)
    if pokeapi_response.status_code != 200:
        return jsonify({'error': 'Pokémon no encontrado en PokeAPI'}), 404

    pokeapi_data = pokeapi_response.json()
    pokemon_data = {
        'name': pokeapi_data['name'],
        'image': pokeapi_data['sprites']['front_default'],
        'weight': pokeapi_data['weight'],
        'height': pokeapi_data['height'],
        'types': [type_info['type']['name'] for type_info in pokeapi_data['types']]
    }

    # Realizar web scraping para obtener la descripción
    fandom_url = f'https://www.wikidex.net/wiki/{pokemon_name}'
    fandom_response = requests.get(fandom_url)
    if fandom_response.status_code == 200:
        soup = BeautifulSoup(fandom_response.content, 'html.parser')
        description_tag = soup.find('p')
        description = description_tag.get_text() if description_tag else 'Descripción no disponible'
    else:
        description = 'Descripción no disponible'

    # Realizar web scraping para obtener la tabla de estadísticas base
    base_stats_url = f'https://bulbapedia.bulbagarden.net/wiki/{pokemon_name}_(Pok%C3%A9mon)#Base_stats'
    base_stats_response = requests.get(base_stats_url)
    if base_stats_response.status_code == 200:
        soup = BeautifulSoup(base_stats_response.content, 'html.parser')
        base_stats_section = soup.find(id='Base_stats')
        table = base_stats_section.find_next('table')
        # Eliminar las últimas dos filas de la tabla
        rows_to_remove = table.find_all('tr')[-2:]
        for row in rows_to_remove:
            row.extract()
        table_html = str(table) if table else 'Tabla de estadísticas base no disponible'
    else:
        table_html = 'Tabla de estadísticas base no disponible'

    # Combinar datos y devolver como JSON
    pokemon_data['description'] = description
    pokemon_data['additional_info'] = table_html

    return jsonify(pokemon_data)

if __name__ == '__main__':
    app.run(debug=True)
