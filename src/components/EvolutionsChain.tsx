import axios from 'axios';

const getEvolutionData = async (evolutionChain) => {
  const data = [];
  let evolutionCount = 0;

  const getEvolutionDetails = async (speciesUrl) => {
    const response = await axios.get(speciesUrl);
    const pokemonData = response.data;

    return {
      spriteURL: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.id}.png`,
    };
  };

  const traverseEvolutions = async (evolution) => {
    const speciesUrl = evolution.species?.url;

    if (speciesUrl) {
      const details = await getEvolutionDetails(speciesUrl);
      data.push(details);
      evolutionCount++;
    }

    if (
      evolution.evolves_to &&
      evolution.evolves_to.length > 0 &&
      evolutionCount < 3
    ) {
      for (const nextEvolution of evolution.evolves_to) {
        await traverseEvolutions(nextEvolution);
      }
    }
  };

  if (evolutionChain) {
    await traverseEvolutions(evolutionChain);
  }

  return data;
};

export default getEvolutionData;
