import { useState } from "react";

export default function App() {
  const [votes, setVotes] = useState({ doge: 0, chihuahua: 0 });

  const vote = (choice) => {
    setVotes((prev) => ({ ...prev, [choice]: prev[choice] + 1 }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 to-black text-white p-6">
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold mb-4">🐶 FunPump Meme Wars</h1>
        <p className="text-xl mb-6 text-purple-300">
          Vote the funniest meme into glory.
        </p>
        <div className="flex flex-col items-center gap-4">
          <button onClick={() => vote('doge')} className="bg-purple-700 px-6 py-2 rounded-xl">
            Vote Doge ({votes.doge})
          </button>
          <button onClick={() => vote('chihuahua')} className="bg-purple-700 px-6 py-2 rounded-xl">
            Vote Chihuahua ({votes.chihuahua})
          </button>
        </div>
      </section>
    </main>
  );
}
