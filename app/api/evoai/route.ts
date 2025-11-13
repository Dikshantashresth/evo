import { NextResponse } from "next/server";
import axios from "axios";
import { createClient } from "@/lib/supabase/server";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "meta-llama/llama-3.3-70b-instruct:free";
const API_KEY = process.env.OPEN_ROUTER_KEY;

const countWords = (s: string) =>
  s.trim().length ? s.trim().split(/\s+/).length : 0;

export async function POST(req: Request) {
  const supabase = await createClient();

  try {
    const { userId, prompt, userGoals = [], userMissions = [] } = await req.json();

    if (!userId)
      return NextResponse.json({ ok: false, error: "Missing userId" }, { status: 400 });
    if (!prompt || typeof prompt !== "string")
      return NextResponse.json({ ok: false, error: "Missing prompt" }, { status: 400 });

    // 🔧 Refined system prompt
    const systemPrompt = `
You are **Evo**, a calm and insightful planning assistant who helps the user improve themselves.
You know their goals and missions and respond like a smart, supportive coach.

Behavior rules:
- If the user greets you (e.g., "hi", "hello", "hey", "yo"), greet them back warmly with a short, friendly message (no longer than 2 sentences).
- If they ask about plans, self-improvement, or progress, respond with **practical, actionable** advice.
- Use up to 5 bullet points for clarity when suggesting tasks or tips.
- Keep the total response between **100 and 1000 words**.
- Avoid robotic phrasing. Write like a calm human coach — concise but encouraging.
- Include a little personality and optimism without being overly chatty.
- Never say you are an AI or model.
`;

    const compactGoals = userGoals
      .map((g: any) => `- ${g.title}${g.category ? ` (${g.category})` : ""}`)
      .join("\n");
    const compactMissions = userMissions.map((m: any) => `- ${m.title}`).join("\n");

    const fullPrompt = `
User message:
${prompt}

User goals:
${compactGoals || "(none)"}

User missions:
${compactMissions || "(none)"}
---
Answer as Evo using the behavioral rules above.
`.trim();

  
    await supabase.from("messages").insert([
      {
        user_id: userId,
        role: "user",
        content: prompt,
        words: countWords(prompt),
      },
    ]);

 
    const aiResponse = await axios.post(
      OPENROUTER_URL,
      {
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: fullPrompt },
        ],
        max_tokens: 2000, 
        temperature: 0.4, 
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    let assistant =
      aiResponse.data?.choices?.[0]?.message?.content ||
      aiResponse.data?.choices?.[0]?.text ||
      "";

    assistant = String(assistant).trim();

    const words = assistant.split(/\s+/);
    if (words.length > 1000)
      assistant = words.slice(0, 1000).join(" ") + " …";

    await supabase.from("messages").insert([
      {
        user_id: userId,
        role: "assistant",
        content: assistant,
        words: countWords(assistant),
      },
    ]);

    return NextResponse.json({ ok: true, assistant });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("AI route Axios error:", error.response?.data || error.message);
      return NextResponse.json(
        { ok: false, error: error.response?.data || error.message },
        { status: 500 }
      );
    } else if (error instanceof Error) {
      console.error("AI route general error:", error.message);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    } else {
      console.error("AI route unknown error:", error);
      return NextResponse.json({ ok: false, error: "Unknown server error" }, { status: 500 });
    }
  }
}

export async function GET() {
  return NextResponse.json({ error: "Use POST method" }, { status: 405 });
}
