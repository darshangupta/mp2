import axios from 'axios';
import { Pokemon, PokemonListResponse, PokemonTypesResponse } from '../types/Pokemon';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const pokemonService = {
  getAllPokemon: async (limit: number = 151, offset: number = 0): Promise<PokemonListResponse> => {
    const response = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  getPokemonById: async (id: string | number): Promise<Pokemon> => {
    const response = await api.get(`/pokemon/${id}`);
    return response.data;
  },

  getPokemonTypes: async (): Promise<PokemonTypesResponse> => {
    const response = await api.get('/type');
    return response.data;
  },

  getPokemonByType: async (type: string): Promise<Pokemon[]> => {
    const response = await api.get(`/type/${type}`);
    const pokemonPromises = response.data.pokemon
      .slice(0, 20)
      .map((pokemon: any) => pokemonService.getPokemonById(pokemon.pokemon.name));
    
    return Promise.all(pokemonPromises);
  },

  searchPokemon: async (query: string, allPokemon: Pokemon[]): Promise<Pokemon[]> => {
    if (!query.trim()) return allPokemon;
    
    return allPokemon.filter(pokemon => 
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );
  }
};
