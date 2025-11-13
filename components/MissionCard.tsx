"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useSupabase } from "@/hooks/useSupabase";
import { getprofile } from "@/app/redux/features/userSlice";

interface MissionType {
  id: string;
  title: string;
  xp_reward: number;
  goal_id: string;
  completed: boolean;
}

const MissionCard = () => {
  const [missions, setMissions] = useState<MissionType[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.profile);
  const userId = user?.id;
  const { supabase } = useSupabase();

  // Ensure user is loaded
  useEffect(() => {
    if (!userId) dispatch(getprofile());
  }, [dispatch, userId]);

  // Fetch missions from Supabase
  useEffect(() => {
    const getMissions = async () => {
      if (!supabase || !userId) return;
      const { data: fetchMissions, error } = await supabase
        .from("user_missions")
        .select("id, title, xp_reward, goal_id, completed")
        .eq("user_id", userId);

      if (error) {
        console.error("Failed to fetch missions:", error);
        return;
      }
      setMissions(fetchMissions || []);
    };
    getMissions();
  }, [supabase, userId]);

  // ✅ Handle mission completion
  const handleToggle = async (mission: MissionType) => {
    if (!userId) return;

    const isCompleting = !mission.completed;
    const newMissions = missions.map((m) =>
      m.id === mission.id ? { ...m, completed: isCompleting } : m
    );
    setMissions(newMissions);

    // Update mission status in DB
    const { error: missionError } = await supabase
      .from("user_missions")
      .update({ completed: isCompleting })
      .eq("id", mission.id);

    if (missionError) {
      console.error("Mission update failed:", missionError.message);
      return;
    }

    // Update XP
    const currentXP = user?.xp || 0;
    const newXP = isCompleting
      ? currentXP + mission.xp_reward
      : Math.max(0, currentXP - mission.xp_reward);

    const { error: userError } = await supabase
      .from("users")
      .update({ xp: newXP })
      .eq("id", userId);

    if (userError) {
      console.error("XP update failed:", userError.message);
    } else {
      console.log(
        `Mission ${isCompleting ? "completed" : "undone"}: ${
          mission.title
        } (${isCompleting ? "+" : "-"}${mission.xp_reward} XP)`
      );
    }

    // Refresh profile XP in Redux
    dispatch(getprofile());
  };

  return (
    <div className="py-2 text-white shadow-md rounded-2xl">
      {missions.length === 0 ? (
        <p className="text-gray-400 text-center">No missions yet.</p>
      ) : (
        <ul className="space-y-3">
          {missions.map((mission) => (
            <li
              key={mission.id}
              className={`flex items-center justify-between bg-zinc-800 rounded-xl p-3 border border-zinc-700 transition-all ${
                mission.completed ? "opacity-70" : "hover:bg-zinc-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={mission.completed}
                  onChange={() => handleToggle(mission)}
                  className="w-5 h-5 accent-green-500 cursor-pointer"
                />
                <span
                  className={`font-medium ${
                    mission.completed ? "line-through text-zinc-400" : ""
                  }`}
                >
                  {mission.title}
                </span>
              </div>
              <span className="text-green-400 font-semibold text-sm">
                +{mission.xp_reward} XP
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MissionCard;
