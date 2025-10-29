import React, { useState, useEffect } from 'react';
import { calculate, Generations, Pokemon, Move, Field } from '@smogon/calc';
import { TypeName } from '@smogon/calc/dist/data/interface';
import { Weather, Terrain } from '@smogon/calc/dist/data/interface';
import Tooltip from './Tooltip';
import { PokemonInfo, fetchPokemonByName, fetchAllPokemonNames, fetchAllAbilitiesWithTranslations, fetchAllMovesWithTranslations, STAT_LABELS, StatKey, ItemInfo, fetchMoveDetails, MoveInfo } from '../services/pokeapi';
import { ITEMS } from '../data/items';

const gen = Generations.get(8);

interface PokemonDetails {
  name: string;
  level: number;
  nature: string;
  evs: string;
  ivs: string;
  ability: string;
  item: string;
  teraType: string;
}

interface PokemonInputFormProps {
  title: string;
  pokemon: PokemonDetails;
  onChange: (details: PokemonDetails) => void;
  allPokemonNames: string[];
  abilityTranslations: Map<string, string>;
  onPokemonHover: (name: string, event: React.MouseEvent<HTMLLIElement>) => void;
  setHoveredPokemonData: React.Dispatch<React.SetStateAction<PokemonInfo | null>>;
  setHoveredPokemonPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number; } | null>>;
  onItemHover: (itemName: string, event: React.MouseEvent<HTMLLIElement>) => void;
  onItemLeave: () => void;
}

function formatName(name: string): string {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatAbilityName(name: string): string {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function PokemonInputForm({ title, pokemon, onChange, allPokemonNames, abilityTranslations, onPokemonHover, setHoveredPokemonData, setHoveredPokemonPosition, onItemHover, onItemLeave }: PokemonInputFormProps) {
  const [abilities, setAbilities] = useState<string[]>([]);
  const [searchQueryPokemon, setSearchQueryPokemon] = useState('');
  const [filteredPokemon, setFilteredPokemon] = useState<string[]>(allPokemonNames);
  const [isPokemonDropdownOpen, setIsPokemonDropdownOpen] = useState(false);
  const [isItemDropdownOpen, setIsItemDropdownOpen] = useState(false);
  const [searchQueryItem, setSearchQueryItem] = useState('');

  useEffect(() => {
    setFilteredPokemon(allPokemonNames);
  }, [allPokemonNames]);

  useEffect(() => {
    if (pokemon.name) {
      fetchPokemonByName(pokemon.name)
        .then(data => {
          const abilityNames = data.abilities.map(a => a.ability.name);
          setAbilities(abilityNames);
          if (abilityNames.length > 0 && !abilityNames.includes(pokemon.ability)) {
            handleChange('ability', abilityNames[0]);
          }
        })
        .catch(err => {
          console.error(err);
          setAbilities([]);
        });
    }
  }, [pokemon.name]);

  const handleChange = (field: keyof PokemonDetails, value: string | number) => {
    onChange({
      ...pokemon,
      [field]: value,
    });
  };

  const handlePokemonSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQueryPokemon(query);
    if (query) {
      setFilteredPokemon(
        allPokemonNames.filter(name =>
          name.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setFilteredPokemon(allPokemonNames);
    }
    handleChange('name', query);
    setIsPokemonDropdownOpen(true);
  };

  const handleSelectPokemon = (name: string) => {
    setSearchQueryPokemon(name);
    handleChange('name', name);
    setIsPokemonDropdownOpen(false);
    setHoveredPokemonData(null);
    setHoveredPokemonPosition(null);
  };

  const handleItemSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQueryItem(query);
    handleChange('item', query);
    setIsItemDropdownOpen(true);
  };

  const handleSelectItem = (value: string) => {
    setSearchQueryItem(value);
    handleChange('item', value);
    setIsItemDropdownOpen(false);
    onItemLeave(); // Hide tooltip immediately on selection
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="relative">
        <label className="text-neutral-400">Pokémon:</label>
        <input
          type="text"
          value={searchQueryPokemon || pokemon.name}
          onChange={handlePokemonSearchChange}
          onFocus={() => {
            setSearchQueryPokemon('');
            setFilteredPokemon(allPokemonNames);
            setIsPokemonDropdownOpen(true);
          }}
          onBlur={() => setTimeout(() => setIsPokemonDropdownOpen(false), 200)}
          className="p-2 rounded-md bg-neutral-800 text-white w-full"
        />
        {isPokemonDropdownOpen && filteredPokemon.length > 0 && (
          <ul className="bg-neutral-800 rounded-md mt-1 max-h-48 overflow-y-auto absolute z-10 w-full top-full">
            {filteredPokemon.map(name => (
              <li
                key={name}
                onMouseDown={() => handleSelectPokemon(name)}
                onMouseEnter={(e) => onPokemonHover(name, e)}
                onMouseLeave={() => { setHoveredPokemonData(null); setHoveredPokemonPosition(null); }}
                className="p-2 cursor-pointer hover:bg-neutral-700"
              >
                {formatName(name)}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-neutral-400">Nivel:</label>
        <input
          type="number"
          value={pokemon.level}
          onChange={e => handleChange('level', parseInt(e.target.value) || 100)}
          className="p-2 rounded-md bg-neutral-800 text-white"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-neutral-400">Naturaleza:</label>
        <select
          value={pokemon.nature}
          onChange={e => handleChange('nature', e.target.value)}
          className="p-2 rounded-md bg-neutral-800 text-white"
        >
          {[
            { name: 'None', inc: '-', dec: '-' },
            { name: 'Adamant', inc: 'Atk', dec: 'SpA' },
            { name: 'Bashful', inc: '-', dec: '-' },
            { name: 'Bold', inc: 'Def', dec: 'Atk' },
            { name: 'Brave', inc: 'Atk', dec: 'Spe' },
            { name: 'Calm', inc: 'SpD', dec: 'Atk' },
            { name: 'Careful', inc: 'SpD', dec: 'SpA' },
            { name: 'Docile', inc: '-', dec: '-' },
            { name: 'Gentle', inc: 'SpD', dec: 'Def' },
            { name: 'Hardy', inc: '-', dec: '-' },
            { name: 'Hasty', inc: 'Spe', dec: 'Def' },
            { name: 'Impish', inc: 'Def', dec: 'SpA' },
            { name: 'Jolly', inc: 'Spe', dec: 'SpA' },
            { name: 'Lax', inc: 'Def', dec: 'SpD' },
            { name: 'Lonely', inc: 'Atk', dec: 'Def' },
            { name: 'Mild', inc: 'SpA', dec: 'Def' },
            { name: 'Modest', inc: 'SpA', dec: 'Atk' },
            { name: 'Naive', inc: 'Spe', dec: 'SpD' },
            { name: 'Naughty', inc: 'Atk', dec: 'SpD' },
            { name: 'Quiet', inc: 'SpA', dec: 'Spe' },
            { name: 'Quirky', inc: '-', dec: '-' },
            { name: 'Rash', inc: 'SpA', dec: 'SpD' },
            { name: 'Relaxed', inc: 'Def', dec: 'Spe' },
            { name: 'Sassy', inc: 'SpD', dec: 'Spe' },
            { name: 'Serious', inc: '-', dec: '-' },
            { name: 'Timid', inc: 'Spe', dec: 'Atk' },
          ].map(nature => (
            <option key={nature.name} value={nature.name}>
              {nature.name} (+{nature.inc}, -{nature.dec})
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-neutral-400">EVs (ej. 252 HP / 252 Atk):</label>
        <input
          type="text"
          value={pokemon.evs}
          onChange={e => handleChange('evs', e.target.value)}
          className="p-2 rounded-md bg-neutral-800 text-white"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-neutral-400">IVs (ej. 31 HP / 31 Atk):</label>
        <input
          type="text"
          value={pokemon.ivs}
          onChange={e => handleChange('ivs', e.target.value)}
          className="p-2 rounded-md bg-neutral-800 text-white"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-neutral-400">Habilidad:</label>
        <select
          value={pokemon.ability}
          onChange={e => handleChange('ability', e.target.value)}
          className="p-2 rounded-md bg-neutral-800 text-white"
        >
          {abilities.map(ability => (
            <option key={ability} value={ability}>
              {formatName(abilityTranslations.get(ability) || ability)}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-neutral-400">Objeto:</label>
        <div className="relative">
          <input
            type="text"
            value={searchQueryItem || pokemon.item}
            onChange={handleItemSearchChange}
            onFocus={() => { setSearchQueryItem(''); setIsItemDropdownOpen(true); }}
            onBlur={() => setTimeout(() => setIsItemDropdownOpen(false), 200)}
            className="p-2 rounded-md bg-neutral-800 text-white w-full"
          />
          {isItemDropdownOpen && (
            <ul className="bg-neutral-800 rounded-md mt-1 max-h-48 overflow-y-auto absolute z-10 w-full top-full">
              {ITEMS.filter(item =>
                item.name.toLowerCase().includes(searchQueryItem.toLowerCase()) ||
                item.value.toLowerCase().includes(searchQueryItem.toLowerCase())
              ).map(item => (
                <li
                  key={item.value}
                  onMouseDown={() => handleSelectItem(item.value)}
                  onMouseEnter={(e) => onItemHover(item.value, e)}
                  onMouseLeave={onItemLeave}
                  className="p-2 cursor-pointer hover:bg-neutral-700"
                >
                  {item.name} ({item.value})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-neutral-400">Tera Tipo:</label>
        <select
          value={pokemon.teraType}
          onChange={e => handleChange('teraType', e.target.value)}
          className="p-2 rounded-md bg-neutral-800 text-white"
        >
          {[
            'Normal',
            'Fire',
            'Water',
            'Grass',
            'Electric',
            'Ice',
            'Fighting',
            'Poison',
            'Ground',
            'Flying',
            'Psychic',
            'Bug',
            'Rock',
            'Ghost',
            'Dragon',
            'Steel',
            'Dark',
            'Fairy',
          ].map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function DamageCalculator() {
  const [attacker, setAttacker] = useState<PokemonDetails>({
    name: 'Cinderace',
    level: 100,
    nature: 'Jolly',
    evs: '252 Atk / 4 SpD / 252 Spe',
    ivs: '31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe',
    ability: 'blaze',
    item: 'Choice Band',
    teraType: 'Normal',
  });
  const [defender, setDefender] = useState<PokemonDetails>({
    name: 'Dragapult',
    level: 100,
    nature: 'Timid',
    evs: '252 SpA / 4 SpD / 252 Spe',
    ivs: '31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe',
    ability: 'clear-body',
    item: 'Choice Scarf',
    teraType: 'Normal',
  });
  const [moveName, setMoveName] = useState('Pyro Ball');
  const [moveType, setMoveType] = useState('Fire');
  const [moveCategory, setMoveCategory] = useState('Physical');
  const [movePower, setMovePower] = useState(120);
  const [moveAccuracy, setMoveAccuracy] = useState<number | null>(100);
  const [moveDescription, setMoveDescription] = useState<string>('');
  const [weather, setWeather] = useState<string>('None');
  const [terrain, setTerrain] = useState<string>('None');
  const [isReflect, setIsReflect] = useState(false);
  const [isLightScreen, setIsLightScreen] = useState(false);
  const [result, setResult] = useState('');
  const [allPokemonNames, setAllPokemonNames] = useState<string[]>([]);
  const [abilityTranslations, setAbilityTranslations] = useState<Map<string, string>>(new Map());
  const [moveTranslations, setMoveTranslations] = useState<Map<string, string>>(new Map());
  const [allMoves, setAllMoves] = useState<string[]>([]);
  const [searchQueryMove, setSearchQueryMove] = useState('');
  const [filteredMoves, setFilteredMoves] = useState<string[]>(allMoves);
  const [isMoveDropdownOpen, setIsMoveDropdownOpen] = useState(false);
  const [hoveredPokemonData, setHoveredPokemonData] = useState<PokemonInfo | null>(null);
  const [hoveredPokemonPosition, setHoveredPokemonPosition] = useState<{ x: number, y: number } | null>(null);
  const [hoveredItemData, setHoveredItemData] = useState<ItemInfo | null>(null);
  const [hoveredItemPosition, setHoveredItemPosition] = useState<{ x: number, y: number } | null>(null);

  useEffect(() => {
    setFilteredMoves(allMoves);
  }, [allMoves]);

  const handlePokemonHover = async (name: string, event: React.MouseEvent<HTMLLIElement>) => {
    try {
      const data = await fetchPokemonByName(name);
      setHoveredPokemonData(data);
      setHoveredPokemonPosition({ x: event.clientX, y: event.clientY });
    } catch (error) {
      console.error("Failed to fetch Pokémon data on hover:", error);
      setHoveredPokemonData(null);
      setHoveredPokemonPosition(null);
    }
  };

  const handleItemHover = (itemName: string, event: React.MouseEvent<HTMLLIElement>) => {
    const item = ITEMS.find(i => i.value === itemName);
    if (item && item.description) {
      setHoveredItemData({ name: item.name, description: item.description });
      setHoveredItemPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleItemLeave = () => {
    setHoveredItemData(null);
    setHoveredItemPosition(null);
  };

  const handlePokemonLeave = () => {
    setHoveredPokemonData(null);
    setHoveredPokemonPosition(null);
  };

  useEffect(() => {
    fetchAllPokemonNames().then(setAllPokemonNames).catch(console.error);
    fetchAllAbilitiesWithTranslations().then(setAbilityTranslations).catch(console.error);
    fetchAllMovesWithTranslations().then(translations => {
      setMoveTranslations(translations);
      setAllMoves(Array.from(translations.keys()).sort());
      console.log('All moves fetched and translated:', translations.keys());
    }).catch(console.error);
  }, []);

  const handleMoveSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQueryMove(query);
    if (query) {
      setFilteredMoves(
        allMoves.filter(move =>
          (moveTranslations.get(move) || move).toLowerCase().includes(query.toLowerCase()) ||
          move.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setFilteredMoves(allMoves);
    }
    setIsMoveDropdownOpen(true);
  };

  const handleSelectMove = async (move: string) => {
    const displayName = `${moveTranslations.get(move) || move} (${formatName(move)})`;
    setSearchQueryMove(displayName);
    setMoveName(move);
    setIsMoveDropdownOpen(false);

    try {
      const details = await fetchMoveDetails(move);
      console.log("Fetched move details:", details);
      setMoveType(details.type);
      setMoveCategory(details.category);
      setMovePower(details.power || 0);
      setMoveAccuracy(details.accuracy);
      setMoveDescription(details.description);
      console.log("Move states updated:", { type: details.type, category: details.category, power: details.power, accuracy: details.accuracy });
    } catch (error) {
      console.error("Failed to fetch move details:", error);
      // Optionally reset move details or show an error to the user
    }
  };

  const parseEVs = (evsString: string) => {
    const evs: Record<string, number> = {};
    evsString.split('/').forEach(part => {
      const [value, stat] = part.trim().split(' ');
      if (value && stat) {
        evs[stat.toLowerCase()] = parseInt(value);
      }
    });
    return evs;
  };

  const parseIVs = (ivsString: string) => {
    const ivs: Record<string, number> = {};
    ivsString.split('/').forEach(part => {
      const [value, stat] = part.trim().split(' ');
      if (value && stat) {
        ivs[stat.toLowerCase()] = parseInt(value);
      }
    });
    return ivs;
  };

  const performCalculation = () => {
    try {
      const attackerPokemon = new Pokemon(gen, attacker.name, {
        level: attacker.level,
        nature: attacker.nature,
        evs: parseEVs(attacker.evs),
        ivs: parseIVs(attacker.ivs),
        ability: formatAbilityName(attacker.ability),
        item: attacker.item,
        teraType: attacker.teraType as TypeName,
      });
      const defenderPokemon = new Pokemon(gen, defender.name, {
        level: defender.level,
        nature: defender.nature,
        evs: parseEVs(defender.evs),
        ivs: parseIVs(defender.ivs),
        ability: formatAbilityName(defender.ability),
        item: defender.item,
        teraType: defender.teraType as TypeName,
      });
      const move = new Move(gen, moveName);
      const field = new Field({
        weather:
          weather === 'None' ? undefined : weather === 'Sunny' ? 'Sun' : (weather as Weather),
        terrain: terrain === 'None' ? undefined : (terrain as Terrain),
        defenderSide: {
          isReflect: isReflect,
          isLightScreen: isLightScreen,
        },
      });

      const calculateResult = calculate(gen, attackerPokemon, defenderPokemon, move, field);

      if (calculateResult.damage) {
        const damageText = Array.isArray(calculateResult.damage)
          ? `${calculateResult.damage[0]} - ${calculateResult.damage[calculateResult.damage.length - 1]}`
          : calculateResult.damage;
        setResult(`Damage: ${damageText} (${calculateResult.desc()})`);
      } else {
        setResult('No damage calculated.');
      }
    } catch (e: unknown) {
      setResult(`Error: ${(e as Error).message}`);
    }
  };

  return (
    <section className="space-y-6">
      <h2 className="text-3xl md:text-4xl font-bold">⚔️ Calculadora de Daño Pokémon</h2>
      <div className="glass rounded-2xl p-6 space-y-4">
        <p className="text-neutral-300">Calcula el daño entre Pokémon.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <PokemonInputForm title="Atacante" pokemon={attacker} onChange={setAttacker} allPokemonNames={allPokemonNames} abilityTranslations={abilityTranslations} onPokemonHover={handlePokemonHover} setHoveredPokemonData={setHoveredPokemonData} setHoveredPokemonPosition={setHoveredPokemonPosition} onItemHover={handleItemHover} onItemLeave={handleItemLeave} />
          <PokemonInputForm title="Defensor" pokemon={defender} onChange={setDefender} allPokemonNames={allPokemonNames} abilityTranslations={abilityTranslations} onPokemonHover={handlePokemonHover} setHoveredPokemonData={setHoveredPokemonData} setHoveredPokemonPosition={setHoveredPokemonPosition} onItemHover={handleItemHover} onItemLeave={handleItemLeave} />
        </div>

        <div className="flex flex-col gap-2 relative">
          <label className="text-neutral-400">Movimiento:</label>
          <input
            type="text"
            value={searchQueryMove || moveName}
            onChange={handleMoveSearchChange}
            onFocus={() => {
              setFilteredMoves(allMoves);
              setIsMoveDropdownOpen(true);
            }}
            onBlur={() => setTimeout(() => setIsMoveDropdownOpen(false), 200)}
            className="p-2 rounded-md bg-neutral-800 text-white"
          />
          {isMoveDropdownOpen && filteredMoves.length > 0 && (
            <ul className="bg-neutral-800 rounded-md mt-1 max-h-48 overflow-y-auto absolute z-10 w-full top-full">
              {filteredMoves.map(move => (
                <li
                  key={move}
                  onMouseDown={() => handleSelectMove(move)}
                  className="p-2 cursor-pointer hover:bg-neutral-700"
                >
                  {moveTranslations.get(move) || move} ({formatName(move)})
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-neutral-400">Tipo de Movimiento:</label>
          <div className="p-2 rounded-md bg-neutral-800 text-white">
            {moveType}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-neutral-400">Categoría de Movimiento:</label>
          <div className="p-2 rounded-md bg-neutral-800 text-white">
            {moveCategory}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-neutral-400">Poder Base del Movimiento:</label>
          <input
            type="number"
            value={movePower}
            readOnly
            className="p-2 rounded-md bg-neutral-800 text-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-neutral-400">Precisión del Movimiento:</label>
          <input
            type="number"
            value={moveAccuracy || '--'}
            readOnly
            className="p-2 rounded-md bg-neutral-800 text-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-neutral-400">Descripción del Movimiento:</label>
          <div className="p-2 rounded-md bg-neutral-800 text-white h-24 overflow-y-auto">
            {moveDescription}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Condiciones del Campo</h3>
          <div className="flex flex-col gap-1">
            <label className="text-neutral-400">Clima:</label>
            <select
              value={weather}
              onChange={e => setWeather(e.target.value)}
              className="p-2 rounded-md bg-neutral-800 text-white"
            >
              {['None', 'Sunny', 'Rain', 'Sand', 'Hail', 'Snow'].map(w => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-neutral-400">Terreno:</label>
            <select
              value={terrain}
              onChange={e => setTerrain(e.target.value)}
              className="p-2 rounded-md bg-neutral-800 text-white"
            >
              {['None', 'Electric', 'Grassy', 'Misty', 'Psychic'].map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isReflect}
              onChange={e => setIsReflect(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label className="text-neutral-400">Reflejo (Reflect)</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isLightScreen}
              onChange={e => setIsLightScreen(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label className="text-neutral-400">Pantalla Luz (Light Screen)</label>
          </div>
        </div>

        <button
          onClick={performCalculation}
          className="rounded-xl px-4 py-2 font-semibold bg-white text-neutral-900 hover:opacity-90 transition"
        >
          Calcular Daño
        </button>
        {result && <p className="text-neutral-200 mt-4">{result}</p>}
      </div>
      {hoveredPokemonData && hoveredPokemonPosition && (
        <Tooltip
            content={
                <div className="flex flex-col items-center p-2">
                    <img src={hoveredPokemonData.sprite} alt={hoveredPokemonData.name} className="w-24 h-24 mb-2 bg-gray-700 rounded-full" />
                    <h4 className="text-md font-bold capitalize text-white mb-1">{hoveredPokemonData.name}</h4>
                    <div className="grid grid-cols-2 gap-x-4 text-neutral-300">
                        {Object.entries(hoveredPokemonData.stats).map(([statName, statValue]) => (
                            <p key={statName} className="text-sm">
                                {STAT_LABELS[statName as StatKey]}: {statValue}
                            </p>
                        ))}
                    </div>
                </div>
            }
            isVisible={true}
            x={hoveredPokemonPosition.x}
            y={hoveredPokemonPosition.y}
        />
      )}

      {hoveredItemData && hoveredItemPosition && (
          <Tooltip
              content={
                  <div className="flex flex-col items-center p-2">
                      <h4 className="text-md font-bold capitalize text-white mb-1">{hoveredItemData.name}</h4>
                      <p className="text-sm text-neutral-300 text-center">{hoveredItemData.description}</p>
                  </div>
              }
              isVisible={true}
              x={hoveredItemPosition.x}
              y={hoveredItemPosition.y}
          />
      )}
    </section>
  );
}
