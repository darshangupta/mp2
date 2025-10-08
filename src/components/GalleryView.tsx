import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pokemon } from '../types/Pokemon';
import { pokemonService } from '../services/pokemonService';
import './GalleryView.css';

const GalleryView: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const response = await pokemonService.getAllPokemon(151);
        const pokemonData = await Promise.all(
          response.results.map(async (p) => {
            const pokemonId = p.url.split('/').slice(-2, -1)[0];
            return pokemonService.getPokemonById(pokemonId);
          })
        );
        setPokemon(pokemonData);
        setFilteredPokemon(pokemonData);

        // Extract unique types
        const types = new Set<string>();
        pokemonData.forEach(p => {
          p.types.forEach(type => {
            types.add(type.type.name);
          });
        });
        setAvailableTypes(Array.from(types).sort());
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

    // Apply type filter
    if (selectedTypes.length > 0) {
      filtered = pokemon.filter(p => 
        p.types.some(type => selectedTypes.includes(type.type.name))
      );
    }

    setFilteredPokemon(filtered);
  }, [pokemon, selectedTypes]);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Pokemon Gallery...</p>
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
    <div className="gallery-view">
      <div className="gallery-header">
        <h2>Pokemon Gallery</h2>
        <p>Click on any Pokemon to view details</p>
      </div>

      <div className="filter-section">
        <div className="filter-header">
          <h3>Filter by Type</h3>
          <button onClick={clearFilters} className="clear-filters-btn">
            Clear Filters
          </button>
        </div>
        
        <div className="type-filters">
          {availableTypes.map(type => (
            <button
              key={type}
              onClick={() => handleTypeToggle(type)}
              className={`type-filter-btn ${selectedTypes.includes(type) ? 'active' : ''} type-${type}`}
            >
              {type}
            </button>
          ))}
        </div>
        
        {selectedTypes.length > 0 && (
          <div className="active-filters">
            <span>Active filters: </span>
            {selectedTypes.map(type => (
              <span key={type} className="active-filter">
                {type}
                <button onClick={() => handleTypeToggle(type)}>×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="gallery-grid">
        {filteredPokemon.map((p) => (
          <Link key={p.id} to={`/pokemon/${p.id}`} className="gallery-card">
            <div className="gallery-image">
              <img
                src={p.sprites.other['official-artwork'].front_default || p.sprites.front_default}
                alt={p.name}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = p.sprites.front_default;
                }}
              />
            </div>
            <div className="gallery-info">
              <h3 className="gallery-name">
                #{p.id.toString().padStart(3, '0')} {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
              </h3>
              <div className="gallery-types">
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

      {filteredPokemon.length === 0 && selectedTypes.length > 0 && (
        <div className="no-results">
          <p>No Pokemon found with the selected types</p>
        </div>
      )}

      <div className="gallery-stats">
        <p>Showing {filteredPokemon.length} of {pokemon.length} Pokemon</p>
      </div>
    </div>
  );
};

export default GalleryView;
