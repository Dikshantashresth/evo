"use client";
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useSupabase } from "@/hooks/useSupabase";
import { getprofile } from "@/app/redux/features/userSlice";

interface MissionType {
  id?: string;
  title: string;
  xp_reward: number;
  goal_id: string;
}

const MissionCard = () => {
  const [missions, setMissions] = useState<MissionType[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.profile);
  const userId = user?.id;
  const { supabase } = useSupabase();

  useEffect(() => {
    if (!userId) dispatch(getprofile());
  }, [dispatch, userId]);

  // Fetch missions from Supabase
  useEffect(() => {
    const getMissions = async () => {
      if (!supabase || !userId) return;
      const { data: fetchMissions, error } = await supabase
        .from("user_missions")
        .select("id, title, xp_reward, goal_id")
        .eq("user_id", userId);

      if (error) {
        console.error("Failed to fetch missions:", error);
        return;
      }
      setMissions(fetchMissions || []);
    };
    getMissions();
  }, [supabase, userId]);

  return (
    <div className="py-2  text-white shadow-md rounded-2xl ">

       

        {missions.length === 0 ? (
          <p className="text-gray-400 text-center">No missions yet.</p>
        ) : (
          <ul className="space-y-3">
            {missions.map((mission) => (
              <li
                key={mission.id}
                className="flex items-center justify-between  bg-zinc-800 rounded-xl p-3 border border-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
               
                    className="w-5 h-5 accent-green-500 cursor-pointer"
                  />
                  <span className="font-medium">{mission.title}</span>
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
