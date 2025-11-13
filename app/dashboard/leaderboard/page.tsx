"use client";

import { Trophy } from "lucide-react";

const leaderboardData = [
  { id: 1, name: "Raju", xp: 1000, level: 10 },
  { id: 2, name: "John", xp: 860, level: 9 },
  { id: 3, name: "Aryan", xp: 820, level: 9 },
  { id: 4, name: "Sita", xp: 770, level: 8 },
  { id: 5, name: "Aman", xp: 690, level: 7 },
  { id: 6, name: "Kiran", xp: 630, level: 7 },
  { id: 7, name: "Bishal", xp: 580, level: 6 },
  { id: 8, name: "Ritika", xp: 540, level: 6 },
];

const Leaderboard = () => {
  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-zinc-900 text-white rounded-2xl shadow-lg">
      <div className="flex items-center gap-7">
        {" "}
        <Trophy />{" "}
        <h1 className="text-2xl font-bold text-center"> Leaderboard</h1>
      </div>

      <table className="w-full text-sm border-separate border-spacing-y-2">
        <thead>
          <tr className="text-zinc-400">
            <th className="text-left pl-4">Rank</th>
            <th className="text-left">Name</th>
            <th className="text-right pr-4">xp</th>
            <th className="text-right pr-4">Level</th>
          </tr>
        </thead>

        <tbody>
          {leaderboardData.map((user, index) => (
            <tr
              key={user.id}
              className={`${
                index === 0
                  ? "bg-yellow-500/10 border-l-4 border-yellow-500"
                  : index === 1
                  ? "bg-gray-400/10 border-l-4 border-gray-400"
                  : index === 2
                  ? "bg-amber-700/10 border-l-4 border-amber-700"
                  : "bg-zinc-800"
              } hover:bg-zinc-700 transition-all`}
            >
              <td className="pl-4 py-2 font-semibold">{index + 1}</td>
              <td className="py-2 font-medium">{user.name}</td>
              <td className="text-right py-2 pr-4">{user.xp}</td>
              <td className="text-right py-2 pr-4">{user.level}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-xs text-zinc-500 text-center mt-4">
        Keep completing missions to climb up the leaderboard!
      </p>
    </div>
  );
};

export default Leaderboard;
