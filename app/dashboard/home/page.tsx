"use client";

import { getprofile } from "@/app/redux/features/userSlice";
import { AppDispatch, RootState } from "@/app/redux/store";
import Header from "@/components/Header";
import MissionList from "@/components/MissionList";
import SideCard from "@/components/SideCard";
import StreakComponent from "@/components/StreakComponent";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.profile);
  const userId = user?.id;
  useEffect(() => {
    if (!userId) {
      dispatch(getprofile());
    }
  }, [dispatch, userId]);

  return (
    <div className="m-2 h-[70%]">
      <div className="m-2 w-full gap-3 flex flex-row">
        <div className="w-full">{user ? <Header userData={user} /> : null}</div>

        <div className="w-[35%]">
          <StreakComponent />
        </div>
      </div>
      <div className="m-2 w-full h-full gap-3 flex flex-row">
    <div className="w-full h-full bg-slate-500">
      <MissionList/>
    </div>
        <div className="w-[35%]">
         <StreakComponent/>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
