import { Box, Heading } from '@chakra-ui/react';
import '../styles/styles.css';

interface Pokemon {
  url: string;
  name: string;
}

interface CardPokemonProps {
  pokemon: Pokemon;
  clicked: (id: number) => void;
}

function CardPokemon({ pokemon, clicked }: CardPokemonProps) {
  const getId = (pokemon: Pokemon) => {
    return Number(pokemon.url.split('/')[6]);
  };

  const getName = (pokemon: Pokemon) => {
    return pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  };

  const handleShowPokemon = () => {
    const id = getId(pokemon);
    clicked(id);
  };

  return (
    <Box onClick={handleShowPokemon}>
      <Box className="div-person">
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getId(
            pokemon
          )}.png`}
          alt={pokemon.name}
        />
        <Heading as="h2">{getName(pokemon)}</Heading>
      </Box>
    </Box>
  );
}

export default CardPokemon;
