import { useState } from 'react';
import { gymLeaders } from '../data/leaders';

export default function GymLeaders() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-3xl md:text-4xl font-bold">Líderes de Gimnasio</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex rounded-xl px-4 py-2 bg-white/10 text-white font-semibold hover:bg-white/20 transition"
        >
          {isOpen ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>

      {isOpen && (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {gymLeaders.map((leader) => (
            <li key={leader.type} className="glass rounded-2xl p-4 text-center">
              <p className="font-bold text-lg">{leader.type}</p>
              <p className="text-neutral-300">{leader.name}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
