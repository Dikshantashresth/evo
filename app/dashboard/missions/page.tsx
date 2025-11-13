"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { getprofile } from "@/app/redux/features/userSlice";

interface Mission {
  id: string;
  title: string;
  description?: string;
  goal: string | null;
  completed: boolean;
  date: string;
  xp_reward: number;
}

const motivationalQuotes = [
  "Discipline beats motivation — every single time.",
  "Small steps daily lead to massive change.",
  "Don’t count the days. Make the days count.",
  "Every rep, every page, every line — it adds up.",
  "You are what you repeatedly do. Excellence is a habit.",
];

const Missions = () => {
  const { supabase } = useSupabase();
  const { user } = useSelector((state: RootState) => state.profile);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  const [quote] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  const userId = user?.id;

useEffect(()=>{
if(!userId){
  dispatch(getprofile())
}
},[dispatch])
  useEffect(() => {
    const fetchMissions = async () => {
      if (!userId) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("user_missions")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false });
      if (!error && data) setMissions(data);
      setLoading(false);
    };

    fetchMissions();
  }, [userId, supabase]);

 const handleComplete = async (id: string, xpReward: number) => {
  if (!userId) return;

  
  const updated = missions.map((m) =>
    m.id === id ? { ...m, completed: true } : m
  );
  setMissions(updated);


  const {error: missionError } = await supabase
    .from("user_missions")
    .update({ completed: true })
    .eq("id", id);

  if (missionError) {
    console.error("Mission update failed:", missionError.message);
    return;
  }

  

  const newXP = user.xp+ xpReward;


  const { error: userUpdateError } = await supabase
    .from("users")
    .update({ xp: newXP })
    .eq("id", userId);

  if (userUpdateError) {
    console.error("Failed to update user XP:", userUpdateError.message);
  } else {
    console.log(`User XP updated: +${xpReward}, total ${newXP}`);
  }
};
const handleUndo = async (id: string, xpReward: number) => {
  if (!userId) return;


  const updated = missions.map((m) =>
    m.id === id ? { ...m, completed: false } : m
  );
  setMissions(updated);

  const { error: missionError } = await supabase
    .from("user_missions")
    .update({ completed: false })
    .eq("id", id);

  if (missionError) {
    console.error("Mission undo failed:", missionError.message);
    return;
  }

  // Deduct XP from user
  const newXP = Math.max(0, (user.xp || 0) - xpReward); // Prevents negative XP

  const { error: userUpdateError } = await supabase
    .from("users")
    .update({ xp: newXP })
    .eq("id", userId);

  if (userUpdateError) {
    console.error("Failed to update user XP:", userUpdateError.message);
  } else {
    console.log(`User XP reverted: -${xpReward}, total ${newXP}`);
  }
};


  const total = missions.length;
  const completed = missions.filter((m) => m.completed).length;
  const progress = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="m-3 h-[90%] flex flex-col gap-4">
      {/* Header with motivational quote */}
      <div className="relative bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold tracking-wide">Missions</h2>
        <p className="text-zinc-400 mt-2 italic">“{quote}”</p>

        <div className="mt-5 flex items-center gap-4">
          <Progress value={progress} className="w-2/3 h-2 bg-zinc-800" />
          <span className="text-sm text-zinc-400">
            {completed}/{total} completed
          </span>
        </div>
      </div>

      {/* Missions List */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 shadow-lg p-5 text-white">
        {loading ? (
          <div className="text-center text-zinc-500 mt-10">Loading missions...</div>
        ) : missions.length === 0 ? (
          <div className="text-center text-zinc-500 mt-10">
            No missions yet. Start your first quest today.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {missions.map((mission) => (
              <div
                key={mission.id}
                className={cn(
                  "border border-zinc-800 bg-zinc-900 rounded-xl p-4 flex flex-col justify-between transition-all hover:bg-zinc-800",
                  mission.completed && "opacity-70"
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{mission.title}</h3>
                    {mission.completed ? (
                      <CheckCircle2 className="text-green-500" />
                    ) : (
                      <Target className="text-zinc-500" />
                    )}
                  </div>
                  {mission.description && (
                    <p className="text-zinc-400 text-sm mb-3">
                      {mission.description}
                    </p>
                  )}
                  <div className="flex items-center text-xs text-zinc-500 gap-2">
                    <Clock className="size-4" />{" "}
                    {new Date(mission.date).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-yellow-500">
                    +{mission.xp_reward} XP
                  </span>
                  {!mission.completed ? (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleComplete(mission.id,mission.xp_reward)}
                    >
                      Mark Done
                    </Button>
                  ):<Button onClick={()=>handleUndo(mission.id,mission.xp_reward)}>undo</Button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Missions;
