"use client";
import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";

import SideBar from "@/components/SideBar";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";


const AppLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { state } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <div className="flex w-full">
      <div>
        <SideBar/>
      </div>
      <main
        className={`max-w-full ${
          isMobile || state == "collapsed" ? "ml-0" : "ml-40"
        } flex-1 `}
      >
        <SidebarTrigger/>
        <Provider store={store}>{children}</Provider>
      </main>
    </div>
  );
};

export default AppLayout;
