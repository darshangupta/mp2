import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pokemon } from '../types/Pokemon';
import { pokemonService } from '../services/pokemonService';
import './ListView.css';

const ListView: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'id' | 'height' | 'weight'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const response = await pokemonService.getAllPokemon(151); // First 151 Pokemon
        const pokemonData = await Promise.all(
          response.results.map(async (p) => {
            const pokemonId = p.url.split('/').slice(-2, -1)[0];
            return pokemonService.getPokemonById(pokemonId);
          })
        );
        setPokemon(pokemonData);
        setFilteredPokemon(pokemonData);
      } catch (err) {
        setError('Failed to fetch Pokemon data');
        console.error('Error fetching Pokemon:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  useEffect(() => {
    let filtered = pokemon;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = pokemon.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'height':
          aValue = a.height;
          bValue = b.height;
          break;
        case 'weight':
          aValue = a.weight;
          bValue = b.weight;
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' 
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });

    setFilteredPokemon(filtered);
  }, [pokemon, searchQuery, sortBy, sortOrder]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Pokemon...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="list-view">
      <div className="controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Pokemon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="sort-controls">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="sort-select"
          >
            <option value="id">ID</option>
            <option value="name">Name</option>
            <option value="height">Height</option>
            <option value="weight">Weight</option>
          </select>
          
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="sort-select"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div className="pokemon-grid">
        {filteredPokemon.map((p) => (
          <Link key={p.id} to={`/pokemon/${p.id}`} className="pokemon-card">
            <div className="pokemon-image">
              <img
                src={p.sprites.front_default}
                alt={p.name}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = p.sprites.other['official-artwork'].front_default;
                }}
              />
            </div>
            <div className="pokemon-info">
              <h3 className="pokemon-name">
                #{p.id.toString().padStart(3, '0')} {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
              </h3>
              <div className="pokemon-types">
                {p.types.map((type) => (
                  <span key={type.slot} className={`type-badge type-${type.type.name}`}>
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredPokemon.length === 0 && searchQuery && (
        <div className="no-results">
          <p>No Pokemon found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};

export default ListView;
