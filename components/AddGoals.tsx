"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { CategorySelect } from "./CategorySelect";
import { useSupabase } from "@/hooks/useSupabase";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface AddGoalDialogProps {
  userId: string;
  limit:boolean;
  onSuccess?: () => void;
}

const AddGoals = ({ userId,limit, onSuccess }: AddGoalDialogProps) => {
  const { supabase } = useSupabase();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [mission, setMission] = useState("");
  const [category, setCategory] = useState("");
  const [targetDate, setTargetDate] = useState<Date | null>(null);
    
  const handleAdd = async () => {
    if (!title || !category || !userId) return;
    setLoading(true);

    const isMission =
      category.toLowerCase().includes("mission") ||
      category.toLowerCase().includes("daily");
    const expReward = isMission ? 10 : 50;

    try {

      const { data: goalData, error: goalError } = await supabase
        .from("user_goals")
        .insert([
          {
            user_id: userId,
            title,
            category,
            target_date: targetDate ? targetDate.toISOString() : null,
            exp_reward: expReward,
            progress: 0,
            completed: false,
            created_at: new Date().toISOString(),
          },
        ])
        .select("id")
        .single();

      if (goalError) throw goalError;
      const goalId = goalData.id;
        

      if (mission.trim().length > 0) {
        const { error: missionError } = await supabase
          .from("user_missions")
          .insert([
            {
              user_id: userId,
              goal_id: goalId,
              title: mission.trim(),
            },
          ]);

        if (missionError) throw missionError;
      }

 
      setTitle("");
      setMission("");
      setCategory("");
      setTargetDate(null);
      setOpen(false);
      onSuccess?.();
    } catch (err: any) {
      console.error("Error saving goal/mission:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl">
          + Add Goal
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-zinc-950 text-white border border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create a New Goal
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Add a new quest — optionally with a mission to complete.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              placeholder="e.g. Lose Weight"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="mission">Mission (optional)</Label>
            <Input
              id="mission"
              placeholder="e.g. Walk 10000 steps"
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <CategorySelect value={category} onChange={setCategory} />
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Target Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800",
                    !targetDate && "text-zinc-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {targetDate ? format(targetDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-zinc-950 border-zinc-800 text-white"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={targetDate ?? undefined}
                  onSelect={(date) => setTargetDate(date ?? null)}
                  required={false}
                  className="w-[200px]"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleAdd}
            disabled={loading || limit}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? "Saving..." : "Add Goal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddGoals;
