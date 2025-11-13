import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Sword, Trophy } from "lucide-react";

const SideCard = () => {
  return (
    <div className=" flex flex-col gap-3 h-full">
      <Card className="bg-gradient-to-r h-full  from-zinc-950 via-zinc-900 to-zinc-950 border-zinc-800 text-white shadow-lg rounded-2xl p-2">
        <CardHeader className="flex flex-row items-center gap-4 text-xl font-bold">
          <Trophy /> Leaderboard
        </CardHeader>
        <CardContent className="flex flex-col ">
          <div className="font-semibold">Raj - 50xp</div>
          <div className="font-semibold">John - 20xp</div>
          <div className="font-semibold">Aryan - 10xp</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-r h-full  from-zinc-950 via-zinc-900 to-zinc-950 border-zinc-800 text-white shadow-lg rounded-2xl p-2">
        <CardHeader className="flex flex-row items-center gap-4 text-xl font-bold ">
          <Sword /> Challenges
        </CardHeader>
        <CardContent className="text-center">
           <div className="text-l text-zinc-600">No Events or any Challenges</div> 
        </CardContent>
      </Card>
    </div>
  );
};

export default SideCard;
