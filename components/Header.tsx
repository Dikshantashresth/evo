"use client";

import { UserProfile } from "@/app/types/ProfileType";
import { Card, CardContent } from "@/components/ui/card";

import { Trophy, Star } from "lucide-react";
import { ProgressBar } from "./Progress";

interface UserProp {
  userData: UserProfile;
}

const Header = ({ userData }: UserProp) => {
  const xpNeeded = 100;
  const progress = Math.min(((userData.xp % xpNeeded) / xpNeeded) * 100, 100);

  return (
    <Card className="bg-gradient-to-r  from-zinc-950 via-zinc-900 to-zinc-950 border-zinc-800 text-white shadow-lg rounded-2xl p-2">
      <CardContent className="flex flex-row md:flex-col gap-6">
        {/* Left: Level & Title */}
        <div className="flex items-center gap-4 ">
          <div className="flex flex-col ">
            <div className="text-3xl font-bold">Lv. {userData.level}</div>
            <div className="text-sm uppercase tracking-widest text-zinc-400">
              {userData.title}
            </div>
          </div>
        </div>
        <div className="flex-1  w-full">
          <div className="flex justify-around items-center text-xs text-zinc-400 mb-1 gap-5">
            <ProgressBar progressNumber={progress} />

            <div className="flex flex-row gap-2">
              <span>
                {userData.xp}/{xpNeeded - (userData.xp % xpNeeded)}
              </span>
              <div>xp</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Header;
