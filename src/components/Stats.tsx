import { Box } from '@chakra-ui/react';
import '../styles/labelTypes.css';

const getStatClass = (statName) => {
  switch (statName) {
    case 'hp':
      return 'stat-hp';
    case 'attack':
      return 'stat-attack';
    case 'defense':
      return 'stat-defense';
    case 'special-attack':
      return 'stat-special-attack';
    case 'special-defense':
      return 'stat-special-defense';
    case 'speed':
      return 'stat-speed';
    default:
      return '';
  }
};

function Stats({ pokemon }) {
  const transformName = (name) => {
    if (name.includes('-')) {
      let parts = name.split('-');
      return `${parts[0].charAt(0).toUpperCase()} ${parts[1]
        .charAt(0)
        .toUpperCase()}${parts[1].slice(1)}`;
    }
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <article>
      <Box className="pokemon-stats">
        {pokemon.stats.map((stat, index) => (
          <span
            key={stat.stat.name}
            className={`label-stats ${getStatClass(stat.stat.name)}`}
          >
            {transformName(stat.stat.name)} {stat.base_stat}
          </span>
        ))}
      </Box>
    </article>
  );
}
export default Stats;
