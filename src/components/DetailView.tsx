import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Pokemon } from '../types/Pokemon';
import { pokemonService } from '../services/pokemonService';
import './DetailView.css';

const DetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [allPokemonIds, setAllPokemonIds] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemonData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const pokemonData = await pokemonService.getPokemonById(id);
        setPokemon(pokemonData);

        // Get all Pokemon IDs for navigation
        const response = await pokemonService.getAllPokemon(151);
        const ids = response.results.map(p => {
          const pokemonId = parseInt(p.url.split('/').slice(-2, -1)[0]);
          return pokemonId;
        });
        setAllPokemonIds(ids);
        setCurrentIndex(ids.indexOf(parseInt(id)));
      } catch (err) {
        setError('Failed to fetch Pokemon data');
        console.error('Error fetching Pokemon:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, [id]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevId = allPokemonIds[currentIndex - 1];
      navigate(`/pokemon/${prevId}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < allPokemonIds.length - 1) {
      const nextId = allPokemonIds[currentIndex + 1];
      navigate(`/pokemon/${nextId}`);
    }
  };

  const getStatName = (statName: string): string => {
    const statMap: { [key: string]: string } = {
      'hp': 'HP',
      'attack': 'Attack',
      'defense': 'Defense',
      'special-attack': 'Sp. Attack',
      'special-defense': 'Sp. Defense',
      'speed': 'Speed'
    };
    return statMap[statName] || statName;
  };

  const getStatColor = (statName: string): string => {
    const colorMap: { [key: string]: string } = {
      'hp': '#ff6b6b',
      'attack': '#ff8c42',
      'defense': '#4ecdc4',
      'special-attack': '#45b7d1',
      'special-defense': '#96ceb4',
      'speed': '#feca57'
    };
    return colorMap[statName] || '#95a5a6';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Pokemon details...</p>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="error-container">
        <p>Error: {error || 'Pokemon not found'}</p>
        <Link to="/" className="back-link">Back to List</Link>
      </div>
    );
  }

  return (
    <div className="detail-view">
      <div className="detail-header">
        <Link to="/" className="back-link">← Back to List</Link>
        <div className="navigation-controls">
          <button 
            onClick={handlePrevious} 
            disabled={currentIndex <= 0}
            className="nav-btn prev-btn"
          >
            ← Previous
          </button>
          <span className="pokemon-counter">
            {currentIndex + 1} of {allPokemonIds.length}
          </span>
          <button 
            onClick={handleNext} 
            disabled={currentIndex >= allPokemonIds.length - 1}
            className="nav-btn next-btn"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="pokemon-detail">
        <div className="pokemon-main">
          <div className="pokemon-image-section">
            <div className="main-image">
              <img
                src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                alt={pokemon.name}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = pokemon.sprites.front_default;
                }}
              />
            </div>
            <div className="image-variants">
              <div className="image-variant">
                <img src={pokemon.sprites.front_default} alt={`${pokemon.name} normal`} />
                <span>Normal</span>
              </div>
              <div className="image-variant">
                <img src={pokemon.sprites.front_shiny} alt={`${pokemon.name} shiny`} />
                <span>Shiny</span>
              </div>
            </div>
          </div>

          <div className="pokemon-info">
            <h1 className="pokemon-name">
              #{pokemon.id.toString().padStart(3, '0')} {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </h1>
            
            <div className="pokemon-types">
              {pokemon.types.map((type) => (
                <span key={type.slot} className={`type-badge type-${type.type.name}`}>
                  {type.type.name}
                </span>
              ))}
            </div>

            <div className="pokemon-basic-info">
              <div className="info-item">
                <span className="info-label">Height:</span>
                <span className="info-value">{(pokemon.height / 10).toFixed(1)} m</span>
              </div>
              <div className="info-item">
                <span className="info-label">Weight:</span>
                <span className="info-value">{(pokemon.weight / 10).toFixed(1)} kg</span>
              </div>
              <div className="info-item">
                <span className="info-label">Base Experience:</span>
                <span className="info-value">{pokemon.base_experience}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pokemon-details">
          <div className="stats-section">
            <h3>Base Stats</h3>
            <div className="stats-grid">
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name} className="stat-item">
                  <div className="stat-header">
                    <span className="stat-name">{getStatName(stat.stat.name)}</span>
                    <span className="stat-value">{stat.base_stat}</span>
                  </div>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill"
                      style={{
                        width: `${(stat.base_stat / 255) * 100}%`,
                        backgroundColor: getStatColor(stat.stat.name)
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="abilities-section">
            <h3>Abilities</h3>
            <div className="abilities-grid">
              {pokemon.abilities.map((ability) => (
                <div key={ability.ability.name} className={`ability-item ${ability.is_hidden ? 'hidden' : ''}`}>
                  <span className="ability-name">
                    {ability.ability.name.replace('-', ' ')}
                  </span>
                  {ability.is_hidden && <span className="hidden-badge">Hidden</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;
