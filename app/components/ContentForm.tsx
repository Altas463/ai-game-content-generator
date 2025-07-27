"use client";

import { useState } from "react";
import { fetchContent, approveContent } from "@/app/utils/api";
import ResultCard from "./ResultCard";

const MODEL_OPTIONS = [
  { value: "openai/gpt-3.5-turbo", label: "OpenRouter GPT‑3.5 Turbo" },
  { value: "openai/gpt-4", label: "OpenRouter GPT‑4" },
  { value: "anthropic/claude-3-sonnet", label: "Claude 3 Sonnet (paid)" },
  { value: "anthropic/claude-3-sonnet:beta", label: "Claude 3 Sonnet (self‑moderated beta)" },
  { value: "google/gemma-7b-it:free", label: "Google Gemma 7B (Free)" },
  { value: "mistralai/mistral-7b-instruct", label: "Mistral 7B Instruct" },
  { value: "mistralai/mixtral-8x7b-instruct", label: "Mixtral 8x7B Instruct (MoE)" },
  { value: "meta-llama/llama-3-8b-instruct", label: "LLaMA 3 8B Instruct" },
  { value: "nousresearch/nous-hermes-2-mistral-7b-dpo", label: "Nous Hermes 7B DPO" },
  { value: "openchat/openchat-7b:free", label: "OpenChat 7B (Free)" },
  { value: "gryphe/mythomax-l2-13b:nitro", label: "MythoMax L2 13B Nitro" },
  { value: "deepseek/deepseek-r1:free", label: "DeepSeek R1 (Free, rất chậm)" },
];

const TYPE_OPTIONS = [
  { value: "Game Description", label: "Game Description" },
  { value: "Item", label: "Item" },
  { value: "Character", label: "Character" },
  { value: "Story", label: "Story" },
  { value: "Dialogue", label: "Dialogue" },
];

export default function ContentForm() {
  const [type, setType] = useState("Game Description");
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("openai/gpt-3.5-turbo");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [pendingApproval, setPendingApproval] = useState<{
    prompt: string;
    type: string;
    model: string;
    content: string;
  } | null>(null);
  const [approved, setApproved] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResult("");
    setPendingApproval(null);
    setApproved(false);
    
    try {
      const res = await fetchContent({ prompt, type, model });
      setResult(res.result || res.content || "No result returned.");
      
      // Lưu thông tin để approval sau
      const content = res.result || res.content || "";
      if (content) {
        setPendingApproval({
          prompt,
          type,
          model,
          content
        });
      }
      
    } catch (err) {
      setResult("Error generating content. Please try again.");
      console.error(err);
    }
    setLoading(false);
  };

  const handleApprove = async () => {
    if (!pendingApproval) return;
    
    setApproving(true);
    try {
      console.log('Sending approval data:', pendingApproval);
      const res = await approveContent(pendingApproval);
      console.log('Approval response:', res);
      
      if (res.success) {
        setApproved(true);
        setPendingApproval(null);
      } else {
        throw new Error(res.message || 'Approval failed');
      }
    } catch (err) {
      console.error("Error approving content:", err);
      alert(`Error approving content: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
    setApproving(false);
  };

  const handleReject = () => {
    setPendingApproval(null);
    setResult("");
    setApproved(false);
  };

  return (
    <div className="w-full bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-200 dark:border-gray-800 transition-all duration-300">
      <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2">
        🎮 AI Game Content Generator
      </h2>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
        Instantly generate creative game content using AI models via n8n.
      </p>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Prompt
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition"
            placeholder="Enter your prompt, e.g., Viết một mô tả về game hành động giả tưởng"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Content Type
          </label>
          <select
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Model
          </label>
          <select
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            {MODEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-lg font-bold transition ${
            loading
              ? "bg-gradient-to-r from-blue-300 to-purple-300 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          } text-white shadow-lg`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Generating...
            </span>
          ) : (
            "Generate Content"
          )}
        </button>
      </div>

      {/* Generated Content Display */}
      {!loading && result !== "" && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 text-center">Generated Result</h3>
          <ResultCard content={result} />
          
          {/* Approval Buttons */}
          {pendingApproval && !approved && (
            <div className="mt-8 flex flex-col items-center">
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleApprove}
                  disabled={approving}
                  className={`px-6 py-3 rounded-lg font-semibold text-base transition shadow
                    ${approving
                      ? "bg-blue-300 cursor-not-allowed text-white"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    }`}
                >
                  {approving ? "Đang duyệt..." : "Duyệt & Lưu Notion"}
                </button>
                <button
                  onClick={handleReject}
                  className="px-6 py-3 rounded-lg font-semibold text-base transition shadow bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
                >
                  Từ chối
                </button>
              </div>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                Bạn có muốn lưu nội dung này vào Notion không?
              </p>
            </div>
          )}
          
          {/* Approval Success Message */}
          {approved && (
            <div className="mt-6 p-4 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-600 rounded-lg text-center">
              <p className="text-green-800 dark:text-green-200 font-semibold">
                 Content approved and saved to Notion successfully!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}