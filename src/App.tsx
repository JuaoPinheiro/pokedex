import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Container, Flex, Heading, Input } from '@chakra-ui/react';
import CardPokemon from './components/CardPokemon';
import getEvolutionData from './components/EvolutionsChain';
import Stats from './components/Stats';

import './styles/styles.css';
import './styles/responsibleStyle.css';

interface Pokemon {
  name: string;
  url: string;
  stats: {
    stat: {
      name: string;
    };
    base_stat: number;
  }[];
  types: {
    slot: number;
    type: {
      name: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
  }[];
  id: number;
  height: number;
  weight: number;
  species: {
    url: string;
  };
}

interface EvolutionData {
  spriteURL: string;
}

function App(): JSX.Element {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [pokemonSelected, setPokemonSelected] = useState<Pokemon | null>(null);
  const [showFrontSprite, setShowFrontSprite] = useState<boolean>(true);
  const [evolutionData, setEvolutionData] = useState<EvolutionData[]>([]);

  useEffect(() => {
    axios
      .get('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then((response) => {
        setPokemons(response.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const getName = (pokemon: Pokemon): string => {
    return pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  };

  const fetchEvolutionData = (speciesUrl: string): void => {
    axios
      .get(speciesUrl)
      .then((speciesResponse) => {
        axios
          .get(speciesResponse.data.evolution_chain.url)
          .then((evolutionResponse) => {
            getEvolutionData(evolutionResponse.data.chain)
              .then((evolutionData) => {
                setEvolutionData(evolutionData);
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const showPokemon = (id: number): void => {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then((response) => {
        const pokemonData: Pokemon = response.data;
        const { height, weight } = pokemonData;
        setPokemonSelected({
          ...pokemonData,
          height: height / 10,
          weight: weight / 10,
        });
        setShowModal(!showModal);
        fetchEvolutionData(response.data.species.url);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const filteredPokemons = pokemons.filter((item) => {
    return item.name.includes(search);
  });

  return (
    <Container>
      <Box as="header">
        <Heading as="h1" className="text-h1">
          Pokedex
        </Heading>
      </Box>

      <Box as="main">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-search"
          placeholder="Pesquisar"
        />
        <Flex className="principal">
          {filteredPokemons.map((pokemon: Pokemon) => (
            <CardPokemon
              key={pokemon.name}
              pokemon={pokemon}
              clicked={showPokemon}
            />
          ))}
        </Flex>
      </Box>

      <Box as="section">
        {showModal && (
          <Box
            width="800"
            className="modal-overlay"
            onClick={() => setShowModal(false)}
          >
            {pokemonSelected && (
              <Box className="modal" onClick={(e) => e.stopPropagation()}>
                <Box className="info-pokemon">
                  <img
                    src={
                      showFrontSprite
                        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonSelected.id}.png`
                        : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokemonSelected.id}.png`
                    }
                    alt={pokemonSelected.name}
                    onClick={() => setShowFrontSprite(!showFrontSprite)}
                  />
                  <Box className="text-info">
                    <Heading as="h2">{getName(pokemonSelected)}</Heading>
                    <Flex className="div-types">
                      {pokemonSelected.types.map((type) => (
                        <div
                          key={type.slot}
                          className={`label-types ${type.type.name}`}
                        >
                          {type.type.name}
                        </div>
                      ))}
                    </Flex>
                    <Flex className="div-size-pokemon">
                      <Box className="label">
                        Altura{' '}
                        {pokemonSelected.height < 1
                          ? (pokemonSelected.height * 100).toFixed(0) + ' cm'
                          : pokemonSelected.height.toFixed(1) + ' m'}
                      </Box>
                      <Box className="label">
                        Peso {pokemonSelected.weight.toFixed(1)} kg
                      </Box>
                    </Flex>
                  </Box>
                </Box>
                {pokemonSelected && (
                  <div className="skill-div">
                    <h3>Habilidades:</h3>
                    <ul>
                      {pokemonSelected.abilities.map((ability) => (
                        <li className="skill" key={ability.ability.name}>
                          {ability.ability.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <Heading as="h2" className="stats-h2">
                  Stats
                </Heading>
                <Stats pokemon={pokemonSelected} />

                <Box>
                  <h2 className="evolution-h2">Evolução:</h2>
                  <Box>
                    {evolutionData.length > 0 ? (
                      <ul className="box-evolution">
                        {evolutionData
                          .slice(0, 3)
                          .map((evolution: EvolutionData, index: number) => (
                            <li key={index}>
                              <img
                                src={evolution.spriteURL}
                                alt={`Evolução ${index + 1}`}
                              />
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p>Nenhuma evolução disponível.</p>
                    )}
                  </Box>
                </Box>

                <button
                  onClick={() => setShowModal(false)}
                  className="btn-closed"
                >
                  Fechar
                </button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default App;
