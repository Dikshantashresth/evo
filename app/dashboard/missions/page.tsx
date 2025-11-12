"use client";
import React, { useState } from "react";

interface Mission {
  id: string;
  title: string;
  description?: string;
  goal: string;
  completed: boolean;
  date: string;
}

const motivationalQuotes = [
  "Discipline beats motivation — every single time.",
  "Small steps daily lead to massive change.",
  "Don’t count the days. Make the days count.",
  "Every rep, every page, every line — it adds up.",
  "You are what you repeatedly do. Excellence is a habit."
];

const Missions = () => {
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: crypto.randomUUID(),
      title: "Workout for 1 hour",
      goal: "Get shredded",
      description: "Focus on core and cardio today.",
      completed: false,
      date: "2025-11-12",
    },
    {
      id: crypto.randomUUID(),
      title: "Study 1 hour of DSA",
      goal: "Ace final term",
      description: "Practice problems on recursion.",
      completed: true,
      date: "2025-11-11",
    },
  ]);

  const [newMission, setNewMission] = useState({
    title: "",
    description: "",
    goal: "",
  });

  const quote =
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const addMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMission.title || !newMission.goal) {
      alert("Add both a goal and mission title.");
      return;
    }
    const mission: Mission = {
      id: crypto.randomUUID(),
      title: newMission.title,
      description: newMission.description,
      goal: newMission.goal,
      completed: false,
      date: new Date().toISOString().split("T")[0],
    };
    setMissions([mission, ...missions]);
    setNewMission({ title: "", description: "", goal: "" });
  };

  const toggleCompletion = (id: string) => {
    setMissions((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, completed: !m.completed } : m
      )
    );
  };

  const deleteMission = (id: string) => {
    setMissions((prev) => prev.filter((m) => m.id !== id));
  };

  const editMission = (id: string, newTitle: string) => {
    setMissions((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, title: newTitle } : m
      )
    );
  };

  return (
    <div className="  mt-4 p-6 w-full text-white rounded-2xl shadow-lg">
    
      <div className="mb-8 p-2 bg-zinc-900 border-zinc-700 border rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Missions</h1>
        <p className="text-gray-400 italic">{quote}</p>
      </div>

      {/* Add Mission Form */}
      <form onSubmit={addMission} className="mb-8 space-y-3">
        <input
          type="text"
          value={newMission.goal}
          onChange={(e) =>
            setNewMission({ ...newMission, goal: e.target.value })
          }
          placeholder="Goal (e.g. Get shredded)"
          className="w-full p-2 bg-zinc-800 rounded focus:outline-none"
        />
        <input
          type="text"
          value={newMission.title}
          onChange={(e) =>
            setNewMission({ ...newMission, title: e.target.value })
          }
          placeholder="Mission title (e.g. Workout for 1 hour)"
          className="w-full p-2 bg-zinc-800 rounded focus:outline-none"
        />
        <textarea
          value={newMission.description}
          onChange={(e) =>
            setNewMission({ ...newMission, description: e.target.value })
          }
          placeholder="Description (optional)"
          className="w-full p-2 bg-zinc-800 rounded focus:outline-none"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-md font-semibold"
        >
          Add Mission
        </button>
      </form>

      {/* Missions List */}
      {missions.length === 0 ? (
        <p className="text-gray-500 text-center">No missions yet. Add one!</p>
      ) : (
        missions.map((m) => (
          <div
            key={m.id}
            className={`mb-3 p-4 rounded-xl flex justify-between items-start transition-all ${
              m.completed ? "bg-green-900/40" : "bg-zinc-800"
            }`}
          >
            <div className="flex gap-3 items-start">
              <input
                type="checkbox"
                checked={m.completed}
                onChange={() => toggleCompletion(m.id)}
                className="mt-1 accent-blue-500"
              />
              <div>
                <h2
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => editMission(m.id, e.target.textContent || "")}
                  className={`font-semibold text-lg outline-none ${
                    m.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {m.title}
                </h2>
                <p className="text-sm text-gray-400">{m.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Goal: {m.goal} • {m.date}
                </p>
              </div>
            </div>
            <button
              onClick={() => deleteMission(m.id)}
              className="text-red-400 hover:text-red-600 transition"
            >
              ✕
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Missions;
