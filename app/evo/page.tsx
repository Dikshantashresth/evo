"use client";

import React, { useEffect, useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/button";

type Msg = {
  id?: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
};

export default function EvoPage() {
  const { supabase } = useSupabase();
  const [userId, setUserId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.id) setUserId(data.user.id);
    };
    load();
  }, [supabase]);


  const fetchUserContext = async (uid: string) => {
    const { data: goals } = await supabase
      .from("user_goals")
      .select("id, title, category")
      .eq("user_id", uid);

    const { data: missions } = await supabase
      .from("user_missions")
      .select("id, title, goal_id")
      .eq("user_id", uid);

    return { goals: goals || [], missions: missions || [] };
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (!userId) {
      alert("You must be logged in");
      return;
    }

    const userMsg: Msg = { role: "user", content: input };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    setInput("");

    try {
      const ctx = await fetchUserContext(userId);

      const r = await fetch("/api/evoai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          prompt: input,
          userGoals: ctx.goals,
          userMissions: ctx.missions,
        }),
      });

      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "AI failed");

      const assistant = j.assistant as string;
      const assistantMsg: Msg = { role: "assistant", content: assistant };
      setMessages((m) => [...m, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Sorry — AI failed to respond. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    const container = document.getElementById("chat-scroll");
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages]);

  return (
    <div className="p-6 min-h-screen bg-zinc-950 text-white">
      <h1 className="text-2xl font-bold mb-4">Evo — Goal Coach</h1>

      <div className="border rounded-xl p-4 mb-4 bg-zinc-900">
        <div className="mb-3 text-sm text-zinc-400">
          Ask Evo for specific help — he'll use your goals & missions to give focused
          suggestions (100–400 words).
        </div>

        <div
          id="chat-scroll"
          className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 scroll-smooth"
        >
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
              <div
                className={`inline-block max-w-[80%] p-3 rounded-2xl ${
                  m.role === "user"
                    ? "bg-blue-700 text-white"
                    : "bg-zinc-800 text-zinc-100"
                }`}
              >
                <div
                  className="whitespace-pre-line leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: m.content
                      // bold text support
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      // numbered list (1., 2., etc.)
                      .replace(/(?:^|\n)(\d+)\.\s+/g, "<br><strong>$1.</strong> ")
                      // line breaks
                      .replace(/\n/g, "<br>"),
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="mt-4 p-4 bg-zinc-800 rounded-lg flex items-center gap-3">
            <div className="w-6 h-6 animate-spin border-2 border-t-transparent rounded-full border-white/60" />
            <div className="text-sm text-zinc-400">Evo is thinking…</div>
          </div>
        )}

        <div className="mt-4 flex gap-3">
          <input
            className="flex-1 p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400"
            placeholder="Describe what help you want (e.g., 'How to finish my portfolio in 2 weeks?')"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <Button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-5"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
