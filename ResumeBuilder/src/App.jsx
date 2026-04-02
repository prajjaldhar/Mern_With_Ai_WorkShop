import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generateAI = async () => {
    if (!input.trim()) return;
     
    setInput("");
    setLoading(true);
    setOutput("");

    try {
      const res = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      setOutput(data.result);
    } catch (error) {
      setOutput("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex justify-center items-center px-4">
      <div className="w-full max-w-3xl h-[85vh] bg-[#1a1a1a] rounded-xl shadow-lg flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-800 px-6 py-4">
          <h1 className="text-lg font-medium text-gray-200 text-center">AI Assistant</h1>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {output && (
            <div className="bg-[#222222] text-gray-200 p-4 rounded-lg leading-relaxed text-sm whitespace-pre-wrap">
              {output}
            </div>
          )}

          {loading && (
            <div className="text-gray-400 text-sm">Generating response...</div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex items-end gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              rows={2}
              className="flex-1 bg-[#111111] text-gray-200 placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-1 focus:ring-gray-500"
            />

            <button
              onClick={generateAI}
              disabled={loading}
              className="bg-gray-200 text-black px-4 py-3 rounded-lg text-sm font-medium hover:bg-white transition disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
