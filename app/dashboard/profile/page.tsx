"use client";

import { getprofile } from "@/app/redux/features/userSlice";
import { AppDispatch, RootState } from "@/app/redux/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const categories = [
  { id: "physical", label: "Physical" },
  { id: "mental", label: "Mental" },
  { id: "career", label: "Career" },
  { id: "spiritual", label: "Spiritual" },
  { id: "learning", label: "Learning" },
  { id: "creative", label: "Creative" },
];

// dummy data fallback
const dummyData = [
  { subject: "Physical", value: 95, fullMark: 100 },
  { subject: "Mental", value: 70, fullMark: 100 },
  { subject: "Career", value: 60, fullMark: 100 },
  { subject: "Spiritual", value: 0, fullMark: 100 },
  { subject: "Learning", value: 40, fullMark: 100 },
  { subject: "Creative", value: 0, fullMark: 100 },
];

export default function ProfileRadar() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.profile);

  // fetch profile if not loaded
  useEffect(() => {
    if (!user) {
      dispatch(getprofile());
    }
  }, [dispatch, user]);

  // map user stats to radar data, fallback to dummy
  const data = dummyData;

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-screen bg-zinc-950 text-white">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-zinc-400">Your Life Progress Overview</p>
      </div>

      <div className="w-full max-w-md bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-800">
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart outerRadius={130} data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="subject" stroke="#fff" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.4)" />
            <Radar
              name="EXP"
              dataKey="value"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ResponsiveContainer>

        <div className="mt-6 text-center">
          <p className="text-sm text-zinc-400">
            Level {user?.level || 1} — EXP: {user?.xp || 0} / 100
          </p>
          <div className="h-2 bg-zinc-800 rounded-full mt-2">
            <div
              className="h-2 bg-blue-500 rounded-full"
              style={{ width: `${Math.min((user?.xp || 0), 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
