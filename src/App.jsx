import Logo from "./assets/clashlogo.png"; 
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

import dogeImg from "./assets/doge.png";
import chihuahuaImg from "./assets/chihuahua.png";
import pepeImg from "./assets/pepe.png";
import shibaImg from "./assets/shiba.png";
import bonkImg from "./assets/bonk.png";
import flokiImg from "./assets/floki.png";

const supabaseUrl = "https://njqdwgkaywutklrcjpbu.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qcWR3Z2theXd1dGtscmNqcGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0ODY0MjIsImV4cCI6MjA2NjA2MjQyMn0.nVlCUoohdYGmqn0y-l-Ae7aldDZSY9yyFgJp7d68484";

const supabase = createClient(supabaseUrl, supabaseKey);

const battles = [
  { id: "doge_vs_chihuahua", a: "Doge", b: "Chihuahua", aImg: dogeImg, bImg: chihuahuaImg },
  { id: "pepe_vs_shiba", a: "Pepe", b: "Shiba", aImg: pepeImg, bImg: shibaImg },
  { id: "bonk_vs_floki", a: "Bonk", b: "Floki", aImg: bonkImg, bImg: flokiImg },
];

export default function App() {
  const CONTRACT_ADDRESS = "HMqwfmq6XqyvgeuHuoLyitULiKJb5xzNDSbFuKFcpump";
  const [copied, setCopied] = useState(false);
  const [wallet, setWallet] = useState("");
  const [votes, setVotes] = useState({});
  const [modalMeme, setModalMeme] = useState(null);
  const [submittedMemes, setSubmittedMemes] = useState([]);
  const [memeName, setMemeName] = useState("");
  const [memeUrl, setMemeUrl] = useState("");

  useEffect(() => {
    const fetchVotes = async () => {
      const { data, error } = await supabase.from("battle_votes").select("battle, option, count");
      if (error) {
        console.error("❌ Error fetching votes:", error);
        return;
      }
      const organized = {};
      data.forEach(({ battle, option, count }) => {
        if (!organized[battle]) organized[battle] = {};
        organized[battle][option] = count;
      });
      setVotes(organized);
    };

    fetchVotes();


    const fetchSubmittedMemes = async () => {
  const { data, error } = await supabase
    .from("submitted_memes")
    .select("*")
    .eq("approved", true); // only approved memes

  if (error) {
    console.error("❌ Error fetching submitted memes:", error);
    return;
  }
  setSubmittedMemes(data);
};

  fetchVotes();
fetchSubmittedMemes();
}, []); // finish useeffect



const vote = async (battleId, choice) => {
  if (!wallet) {
    alert("Please enter your wallet or X handle to vote.");
    return;
  }

  // Verifica si ya votó este usuario en este battle
  const { data: existingVote, error } = await supabase
    .from("battle_log")
    .select("*")
    .eq("username", wallet)
    .eq("battle", battleId)
    .maybeSingle();

  if (error) {
    console.error("❌ Error checking vote:", error);
    return;
  }

  if (existingVote) {
    alert("⛔ You already voted in this battle.");
    return;
  }

  const current = votes?.[battleId]?.[choice] || 0;

  // Usa UPSERT (insert or update)
  const { error: upsertError } = await supabase
    .from("battle_votes")
    .upsert(
      { battle: battleId, option: choice, count: current + 1 },
      { onConflict: ["battle", "option"] }
    );

  if (upsertError) {
    console.error("❌ Failed to upsert vote:", upsertError);
    alert("Failed to register vote.");
    return;
  }

  await supabase.from("battle_log").insert({ username: wallet, battle: battleId, option: choice });

  setVotes((prev) => ({
    ...prev,
    [battleId]: {
      ...prev[battleId],
      [choice]: current + 1,
    },
  }));

  alert("✅ Vote counted!");
};




 const submitMeme = async () => {
  if (!memeName || !memeUrl) {
    alert("Please provide both name and image URL.");
    return;
  }

  if (!/\.(jpg|jpeg|png|gif|webp)$/i.test(memeUrl)) {
    alert("Please enter a valid image URL (jpg, png, gif, webp, etc.)");
    return;
  }

  const duplicate = submittedMemes.some(
    (meme) => meme.name.toLowerCase() === memeName.toLowerCase() || meme.url === memeUrl
  );

  if (duplicate) {
    alert("This meme has already been submitted.");
    return;
  }

  const { error } = await supabase
    .from("submitted_memes")
    .insert({ name: memeName, url: memeUrl, approved: false });

  if (error) {
    alert("Failed to submit meme.");
    return;
  }

  alert("✅ Meme submitted for review!");
  setMemeName("");
  setMemeUrl("");
};



  return (
    <>
    
<header className="flex justify-end items-center p-4 bg-black text-white text-sm w-full">
  <div className="flex items-center gap-4">
    <img src={Logo} alt="Clash Arena Logo" className="h-12" /> {/* cambia la altura del logo */}
    <div className="flex flex-col">
      <span className="text-white text-base font-bold">$CLASH Contract:</span>
      <span className="font-mono text-lg truncate max-w-xs">{CONTRACT_ADDRESS}</span> {/* text-base para agrandar */}
    </div>
    <div className="relative">
      <button
        onClick={() => {
          navigator.clipboard.writeText(CONTRACT_ADDRESS);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 text-xs"
        title="Copy to clipboard"
      >
        Copy
      </button>
      {copied && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-white text-xs bg-black px-2 py-1 rounded shadow-lg">
          Copied!
        </div>
      )}
    </div>
  </div>
</header>

      <main className="min-h-screen bg-gradient-to-br from-purple-900 to-black text-white p-6">
        <section className="text-center py-10">
          <h1 className="text-4xl font-bold mb-4">🔥 Meme Battle Arena</h1>
          <input
            type="text"
            className="mb-6 p-2 rounded bg-purple-800 placeholder-purple-300"
            placeholder="Your Wallet or X Handle"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {battles.map(({ id, a, b, aImg, bImg }) => (
              <div key={id} className="bg-purple-800/20 p-4 rounded-xl text-center shadow-md">
                <h3 className="text-lg font-semibold mb-3">{a} vs {b}</h3>
                <div className="flex justify-center gap-6 mb-3">
                  <div className="flex flex-col items-center">
                    <img src={aImg} alt={a} className="w-24 h-24 rounded-full object-cover mb-2" />
                    <button onClick={() => vote(id, a.toLowerCase())} className="bg-purple-700 px-4 py-1 rounded-xl">
                      {a} ({votes?.[id]?.[a.toLowerCase()] || 0})
                    </button>
                  </div>
                  <div className="flex flex-col items-center">
                    <img src={bImg} alt={b} className="w-24 h-24 rounded-full object-cover mb-2" />
                    <button onClick={() => vote(id, b.toLowerCase())} className="bg-purple-700 px-4 py-1 rounded-xl">
                      {b} ({votes?.[id]?.[b.toLowerCase()] || 0})
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

       



        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">🔥 Meme Arena</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{ title: "Trumps Charts", image: "/assets/memes/trumpstrading.png" },
              { title: "Bitkong", image: "/assets/memes/bitkong.png" },
              { title: "Hodl", image: "/assets/memes/hodl.png" },
              { title: "Relax", image: "/assets/memes/relax.png" },
              { title: "Rugzilla", image: "/assets/memes/rugzilla.png" },
              { title: "Polite", image: "/assets/memes/polite.png" },
            ].map((meme, index) => (
              <div key={index} className="bg-purple-950/60 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <img src={meme.image} alt={meme.title} className="w-full h-48 object-contain" />
              <div className="p-4 text-center">
  <h3 className="text-white font-semibold text-lg">{meme.title}</h3>
  <button
    onClick={() => setModalMeme(meme)}
    className="mt-2 bg-purple-700 text-white px-4 py-1 rounded hover:bg-purple-800 text-sm"
  >
    View
  </button>
</div>
              </div>
            ))}
          </div>
        </section>


<section className="max-w-6xl mx-auto px-4 py-12">
  <h2 className="text-3xl font-bold text-white mb-6 text-center">🌐 Submitted Memes</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {(submittedMemes.length > 0 ? submittedMemes : [
      { name: "Bit Guru", url: "/assets/memes/gurucoin.png" },
      { name: "BitFrog", url: "/assets/memes/bitfrog.png" },
      { name: "Astrelon", url: "/assets/memes/pokelon.png" }
    ]).map((meme, index) => (
      <div key={index} className="bg-purple-950/60 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
        <img src={meme.url} alt={meme.name} className="w-full h-48 object-contain" />
        <div className="p-4 text-center">
          <h3 className="text-white font-semibold text-lg truncate">{meme.name}</h3>
        </div>
      </div>
    ))}
  </div>
</section>


<section className="max-w-xl mx-auto px-4 py-12">
  <h2 className="text-2xl font-bold text-white mb-4 text-center">📤 Submit Your Meme</h2>
  <div className="bg-purple-950 p-6 rounded-xl shadow-md">
    <input
      type="text"
      placeholder="Meme Name"
      value={memeName}
      onChange={(e) => setMemeName(e.target.value)}
      className="w-full mb-4 p-2 rounded bg-purple-800 placeholder-purple-300 text-white"
    />
    <input
      type="text"
      placeholder="Image URL (e.g. https://...)"
      value={memeUrl}
      onChange={(e) => setMemeUrl(e.target.value)}
      className="w-full mb-4 p-2 rounded bg-purple-800 placeholder-purple-300 text-white"
    />
    <button
      onClick={submitMeme}
      className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800"
    >
      Submit Meme
    </button>
  </div>
</section>


 {modalMeme && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-purple-950 rounded-xl p-6 relative max-w-lg w-full">
              <button
                onClick={() => setModalMeme(null)}
                className="absolute top-2 right-3 text-white text-xl"
              >
                ✖
              </button>
              <img src={modalMeme.image} alt={modalMeme.title} className="w-full h-auto mb-4 rounded" />
              <h3 className="text-white text-2xl font-bold mb-2 text-center">{modalMeme.title}</h3>
            </div>
          </div>
        )}
   
      </main>


<footer className="bg-purple-950 text-white px-6 py-12 mt-16 text-sm">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
    <div className="md:col-span-1">
      <h3 className="text-xl font-bold mb-2">Clash Arena</h3>
      <p className="text-purple-300">The ultimate destination for meme lovers to share, vote, and discover the funniest content on the internet. Clash Arena $CLASH is the meme coin</p>
    </div>
    <div>
      <h4 className="font-semibold mb-2">Explore</h4>
      <ul className="space-y-1 text-purple-400">
        <li><a href="#">Meme Battles</a></li>
        <li><a href="#">Submit a Meme</a></li>
        <li><a href="#">Top Memes</a></li>
      </ul>
    </div>
    <div>
      <h4 className="font-semibold mb-2">Community</h4>
      <ul className="space-y-1 text-purple-400">
           <li><a href="https://twitter.com/clasharenamemes" target="_blank" rel="noopener noreferrer">Twitter / X</a></li>
  
      </ul>
    </div>
    <div>
      <h4 className="font-semibold mb-2">Support</h4>
      <ul className="space-y-1 text-purple-400">
        <li><a href="#">FAQ</a></li>
        <li><a href="#">Contact</a></li>
        <li><a href="#">Help Center</a></li>
      </ul>
    </div>
  </div>
  <div className="text-center mt-12 text-purple-400 border-t border-purple-700 pt-6">
    © 2025 Clash Arena. All rights reserved. — <a href="#" className="underline">Privacy Policy</a> · <a href="#" className="underline">Terms of Service</a>
  </div>
</footer>




    </>
  );
}
