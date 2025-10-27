import React, { useState } from 'react';
import { calculate, Generations, Pokemon, Move, Field } from '@smogon/calc';

const gen = Generations.get(8); // Use Generation 8 (Sword/Shield) for example

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
}

function PokemonInputForm({ title, pokemon, onChange }: PokemonInputFormProps) {
  const handleChange = (field: keyof PokemonDetails, value: string | number) => {
    onChange({
      ...pokemon,
      [field]: value,
    });
  };

  return (
    <div className="glass rounded-2xl p-4 space-y-2">
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="flex flex-col gap-1">
        <label className="text-neutral-400">Nombre:</label>
        <input
          type="text"
          value={pokemon.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="p-2 rounded-md bg-neutral-800 text-white"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-neutral-400">Nivel:</label>
        <input
          type="number"
          value={pokemon.level}
          onChange={(e) => handleChange('level', parseInt(e.target.value) || 100)}
          className="p-2 rounded-md bg-neutral-800 text-white"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-neutral-400">Naturaleza:</label>
        <input
          type="text"
          value={pokemon.nature}
          onChange={(e) => handleChange('nature', e.target.value)}
          className="p-2 rounded-md bg-neutral-800 text-white"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-neutral-400">EVs (ej. 252 HP / 252 Atk):</label>
        <input
          type="text"
          value={pokemon.evs}
          onChange={(e) => handleChange('evs', e.target.value)}
          className="p-2 rounded-md bg-neutral-800 text-white"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-neutral-400">IVs (ej. 31 HP / 31 Atk):</label>
        <input
          type="text"
          value={pokemon.ivs}
          onChange={(e) => handleChange('ivs', e.target.value)}
          className="p-2 rounded-md bg-neutral-800 text-white"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-neutral-400">Habilidad:</label>
        <input
          type="text"
          value={pokemon.ability}
          onChange={(e) => handleChange('ability', e.target.value)}
          className="p-2 rounded-md bg-neutral-800 text-white"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-neutral-400">Objeto:</label>
        <input
          type="text"
          className="p-2 rounded-md bg-neutral-800 text-white"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-neutral-400">Tera Tipo:</label>
        <select
          value={pokemon.teraType}
          onChange={(e) => handleChange('teraType', e.target.value)}
          className="p-2 rounded-md bg-neutral-800 text-white"
        >
          {[
            'Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting', 'Poison',
            'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Steel', 'Dark', 'Fairy',
          ].map((type) => (
            <option key={type} value={type}>{type}</option>
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
    ability: 'Blaze',
    item: 'Choice Band',
    teraType: 'Normal',
  });
  const [defender, setDefender] = useState<PokemonDetails>({
    name: 'Dragapult',
    level: 100,
    nature: 'Timid',
    evs: '252 SpA / 4 SpD / 252 Spe',
    ivs: '31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe',
    ability: 'Clear Body',
    item: 'Choice Scarf',
    teraType: 'Normal',
  });
  const [moveName, setMoveName] = useState('Pyro Ball');
  const [moveType, setMoveType] = useState('Fire');
  const [moveCategory, setMoveCategory] = useState('Physical');
  const [movePower, setMovePower] = useState(120);
  const [weather, setWeather] = useState<string>('None');
  const [terrain, setTerrain] = useState<string>('None');
  const [isReflect, setIsReflect] = useState(false);
  const [isLightScreen, setIsLightScreen] = useState(false);
  const [result, setResult] = useState('');

  const parseEVs = (evsString: string) => {
    const evs: { [stat: string]: number } = {};
    evsString.split('/').forEach(part => {
      const [value, stat] = part.trim().split(' ');
      if (value && stat) {
        evs[stat.toLowerCase()] = parseInt(value);
      }
    });
    return evs;
  };

  const parseIVs = (ivsString: string) => {
    const ivs: { [stat: string]: number } = {};
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
        ability: attacker.ability,
        item: attacker.item,
        teraType: attacker.teraType as any,
      });
      const defenderPokemon = new Pokemon(gen, defender.name, {
        level: defender.level,
        nature: defender.nature,
        evs: parseEVs(defender.evs),
        ivs: parseIVs(defender.ivs),
        ability: defender.ability,
        item: defender.item,
        teraType: defender.teraType as any,
      });
      const move = new Move(gen, moveName);
      const field = new Field({
        weather: weather === 'None' ? undefined : (weather === 'Sunny' ? 'Sun' : weather as any),
        terrain: terrain === 'None' ? undefined : terrain as any,
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
        setResult(
          `Damage: ${damageText} (${calculateResult.desc()})`
        );
      } else {
        setResult('No damage calculated.');
      }
    } catch (e: any) {
      setResult(`Error: ${e.message}`);
    }
  };

  return (
    <section className="space-y-6">
      <h2 className="text-3xl md:text-4xl font-bold">⚔️ Calculadora de Daño Pokémon</h2>
      <div className="glass rounded-2xl p-6 space-y-4">
        <p className="text-neutral-300">Calcula el daño entre Pokémon.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <PokemonInputForm title="Atacante" pokemon={attacker} onChange={setAttacker} />
          <PokemonInputForm title="Defensor" pokemon={defender} onChange={setDefender} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-neutral-400">Movimiento:</label>
          <input
            type="text"
            value={moveName}
            onChange={(e) => setMoveName(e.target.value)}
            className="p-2 rounded-md bg-neutral-800 text-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-neutral-400">Tipo de Movimiento:</label>
          <select
            value={moveType}
            onChange={(e) => setMoveType(e.target.value)}
            className="p-2 rounded-md bg-neutral-800 text-white"
          >
            {[
              'Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting', 'Poison',
              'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Steel', 'Dark', 'Fairy',
            ].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-neutral-400">Categoría de Movimiento:</label>
          <select
            value={moveCategory}
            onChange={(e) => setMoveCategory(e.target.value)}
            className="p-2 rounded-md bg-neutral-800 text-white"
          >
            {['Physical', 'Special', 'Status'].map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-neutral-400">Poder Base del Movimiento:</label>
          <input
            type="number"
            value={movePower}
            onChange={(e) => setMovePower(parseInt(e.target.value) || 0)}
            className="p-2 rounded-md bg-neutral-800 text-white"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Condiciones del Campo</h3>
          <div className="flex flex-col gap-1">
            <label className="text-neutral-400">Clima:</label>
            <select
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              className="p-2 rounded-md bg-neutral-800 text-white"
            >
              {['None', 'Sunny', 'Rain', 'Sand', 'Hail', 'Snow'].map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-neutral-400">Terreno:</label>
            <select
              value={terrain}
              onChange={(e) => setTerrain(e.target.value)}
              className="p-2 rounded-md bg-neutral-800 text-white"
            >
              {['None', 'Electric', 'Grassy', 'Misty', 'Psychic'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isReflect}
              onChange={(e) => setIsReflect(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label className="text-neutral-400">Reflejo (Reflect)</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isLightScreen}
              onChange={(e) => setIsLightScreen(e.target.checked)}
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
    </section>
  );
}
