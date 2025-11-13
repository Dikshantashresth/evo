"use client";

import { getprofile } from "@/app/redux/features/userSlice";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useSupabase } from "@/hooks/useSupabase";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Edit, Flame, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddGoals from "@/components/AddGoals";

interface GoalType {
  id?: string;
  title: string;
  category: string;
  completed: boolean;
  progress: number;
  created_at: string;
  exp_reward: number;
}

const Quests = () => {
  const [limit, setLimit] = useState<boolean>(false);
  const [Goals, setGoals] = useState<GoalType[]>([]);
  const { supabase } = useSupabase();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.profile);

  const userId = user?.id;

  useEffect(() => {
    if (!userId) dispatch(getprofile());
  }, [dispatch, userId]);

  useEffect(() => {
    const getUserGoals = async () => {
      if (!userId) return;
      const { data: userGoals } = await supabase
        .from("user_goals")
        .select("*")
        .eq("user_id", userId);

      if (!userGoals || userGoals.length === 0) return;
      if (userGoals.length == 3) {
        setLimit(true);
      }
      setGoals(userGoals);
    };
    getUserGoals();
  }, [userId, supabase]);

  // derived values
  const completedGoals = useMemo(
    () => Goals.filter((goal) => goal.completed).length,
    [Goals]
  );

  const averageProgress = useMemo(
    () =>
      Goals.length
        ? Math.round(
            Goals.reduce((acc, g) => acc + g.progress, 0) / Goals.length
          )
        : 0,
    [Goals]
  );
  const handleDelete = async (goal_id: string) => {
    const { error } = await supabase
      .from("user_goals")
      .delete()
      .eq("id", goal_id)
      .eq("user_id", userId);
    await supabase
      .from("user_missions")
      .delete()
      .eq("goal_id", goal_id)
      .eq("user_id", userId);
    if (error) {
      console.error("Failed to delete goal:", error);
      return;
    }
    setGoals((prev) => prev.filter((goal) => goal.id !== goal_id));
  };
  return (
    <div className="m-3 h-[80%] flex flex-col gap-3 text-white">
      <Card className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Flame className="text-orange-500" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-lg font-medium">Goals Completed</div>
              <div className="text-3xl font-bold">{completedGoals}</div>
            </div>
            <div>
              <div className="text-lg font-medium">Total XP</div>
              <div className="text-3xl font-bold text-yellow-400">
                {user?.xp}
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Overall Progress</span>
              <span>{averageProgress}%</span>
            </div>
            <Progress value={averageProgress} className="h-3 bg-zinc-800" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 shadow-lg rounded-2xl flex-1 overflow-y-auto">
        <CardHeader className="flex flex-row justify-between">
          <CardTitle className="text-2xl font-bold">Quests</CardTitle>
          <AddGoals
            userId={userId!}
            limit={limit}
            onSuccess={() => {
              // Refetch goals after adding
              const getUserGoals = async () => {
                const { data } = await supabase
                  .from("user_goals")
                  .select("*")
                  .eq("user_id", userId);
                if (data) setGoals(data);
              };
              getUserGoals();
            }}
          />
        </CardHeader>
        <CardContent className="space-y-3">
          {Goals.length === 0 && (
            <div className="text-zinc-400 text-center py-10">
              No quests available yet.
            </div>
          )}

          {Goals.map((goal, index) => (
            <div key={index} className="border border-zinc-800 p-3 rounded-xl bg-zinc-900/40 hover:bg-zinc-900/60 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-lg flex items-center gap-2">
                    {goal.completed ? (
                      <CheckCircle2 className="text-green-500" />
                    ) : (
                      <span className="w-4 h-4 border-2 border-zinc-500 rounded-full inline-block" />
                    )}
                    {goal.title}
                  </div>
                  <Badge
                    variant="outline"
                    className="mt-1 text-xs border-zinc-700 text-zinc-300"
                  >
                    {goal.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-yellow-400 text-sm font-semibold">
                    +{goal.exp_reward} XP
                  </div>
                  <div className="text-xs text-zinc-400">{goal.created_at}</div>

                  <div className="flex flex-row  justify-end gap-3 ">
                    <div className="p-1 rounded-lg cursor-pointer">
                      <Button
                        className="bg-red-700 text-white"
                        onClick={() => goal.id && handleDelete(goal.id)}
                      >
                        <Trash />
                      </Button>
                    </div>
                    <div className=" p-1 rounded-lg cursor-pointer">
                      <Button className="bg-blue-700 text-white">
                        <Edit />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <Progress value={goal.progress} className="h-2 bg-zinc-800" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Quests;
