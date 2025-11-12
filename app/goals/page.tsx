"use client";
import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client"; 

const GoalSetupPage = () => {
  const supabase = createClient();

  const [goals, setGoals] = useState([
    { title: "", missions: "", category: "", target_date: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleGoalChange = (index: number, field: string, value: string) => {
    const updated = [...goals];
    updated[index][field as keyof typeof updated[0]] = value;
    setGoals(updated);
  };

  const addGoalField = () => {
    if (goals.length < 3) {
      setGoals([...goals, { title: "", missions: "", category: "", target_date: "" }]);
    }
  };

  const removeGoal = (index: number) => {
    const updated = [...goals];
    updated.splice(index, 1);
    setGoals(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("User not authenticated");
      setLoading(false);
      return;
    }

    const userId = user.id;

    try {
      const { error } = await supabase.from("user_goals").insert(
        goals.map((g) => ({
          user_id: userId,
          title: g.title,
          category: g.category,
          target_date: g.target_date || null,
        }))
      );

      if (error) throw error;
      setSuccessMsg("Goals created successfully!");
      setGoals([{ title: "", missions: "", category: "", target_date: "" }]);
    } catch (err: any) {
      console.error(err);
      alert("Error saving goals: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-zinc-950 border border-zinc-600 text-white rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-2 text-center">
        Your First-Time Goal Setup
      </h1>
      <p className="text-gray-400 mb-6 text-center">
        You can set up to 3 goals to chase this year. Think big, start now.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {goals.map((goal, index) => (
          <div key={index} className="p-4 rounded-xl bg-zinc-800 border-zinc-700 border relative">
            <h2 className="text-lg font-semibold mb-3">Goal {index + 1}</h2>

            <input
              type="text"
              placeholder="Title (e.g. Get shredded)"
              className="w-full p-2 mb-2 rounded bg-zinc-950 border-zinc-700 border"
              value={goal.title}
              onChange={(e) => handleGoalChange(index, "title", e.target.value)}
              required
            />

            <input
              placeholder="Mission"
              className="w-full p-2 mb-2 rounded bg-zinc-950 border-zinc-700 border"
              value={goal.missions}
              onChange={(e) =>
                handleGoalChange(index, "description", e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Category (e.g. Fitness, Study, Career)"
              className="w-full p-2 mb-2 rounded bg-zinc-950 border-zinc-700 border"
              value={goal.category}
              onChange={(e) => handleGoalChange(index, "category", e.target.value)}
            />

            <label className="text-sm text-gray-400">Target Date</label>
            <input
              type="date"
              className="w-full p-2 mb-2 rounded bg-zinc-700"
              value={goal.target_date}
              onChange={(e) =>
                handleGoalChange(index, "target_date", e.target.value)
              }
            />

            {goals.length > 1 && (
              <button
                type="button"
                onClick={() => removeGoal(index)}
                className="absolute top-2 right-3 text-red-400 hover:text-red-600"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        {goals.length < 3 && (
          <button
            type="button"
            onClick={addGoalField}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md"
          >
            + Add Another Goal
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 w-full py-2 rounded-md mt-4"
        >
          {loading ? "Saving..." : "Save Goals"}
        </button>

        {successMsg && (
          <p className="text-green-400 mt-3 text-center">{successMsg}</p>
        )}
      </form>
    </div>
  );
};

export default GoalSetupPage;
