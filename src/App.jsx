import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://njqdwgkaywutklrcjpbu.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qcWR3Z2theXd1dGtscmNqcGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0ODY0MjIsImV4cCI6MjA2NjA2MjQyMn0.nVlCUoohdYGmqn0y-l-Ae7aldDZSY9yyFgJp7d68484";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
console.log("✅ App component mounted");
  const [votes, setVotes] = useState({ doge: 0, chihuahua: 0 });
  const [formData, setFormData] = useState({ name: "", meme: null });

  useEffect(() => {
  const fetchVotes = async () => {
    try {
      const { data, error } = await supabase.from("votes").select("option, count");
      if (error) {
        console.error("❌ Error fetching votes from Supabase:", error);
        return;
      }
      console.log("✅ Votes fetched successfully:", data);
      const mapped = data.reduce((acc, row) => {
        acc[row.option] = row.count;
        return acc;
      }, {});
      setVotes({ doge: mapped.doge || 0, chihuahua: mapped.chihuahua || 0 });
    } catch (err) {
      console.error("❌ Unexpected fetch error:", err);
    }
  };
  fetchVotes();
}, []);

  const vote = async (choice) => {
    const newCount = votes[choice] + 1;
    const { error } = await supabase
      .from("votes")
      .update({ count: newCount })
      .eq("option", choice);
    if (error) {
      console.error("Error updating vote:", error);
      return;
    }
    setVotes((prev) => ({ ...prev, [choice]: newCount }));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "meme") {
      setFormData((prev) => ({ ...prev, meme: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.meme) {
      alert("Please enter your name and select a meme file.");
      return;
    }
    console.log("Meme submitted:", formData);
    alert("✅ Meme submitted! (This is a demo, no backend yet)");
    setFormData({ name: "", meme: null });
    e.target.reset();
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

      <section className="max-w-md mx-auto bg-purple-950/50 p-6 rounded-2xl shadow-xl mt-12">
        <h2 className="text-2xl font-semibold mb-4">🖼️ Submit Your Meme</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Your Twitter or Wallet"
            className="p-2 rounded bg-purple-800 text-white placeholder-purple-300"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="file"
            name="meme"
            accept="image/*"
            className="p-2 rounded bg-purple-800 text-white"
            onChange={handleChange}
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-black font-semibold py-2 rounded-xl"
          >
            Submit Meme
          </button>
        </form>
      </section>
    </main>
  );
}
