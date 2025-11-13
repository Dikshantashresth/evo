import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import Link from "next/link";
import { Button } from "./ui/button";
import { CheckLine, Circle, Home, LogOut, Target, Trophy, User } from "lucide-react";


const items = [
  { title: "Home", icon: Home, url: "/dashboard/home" },
  { title: "Missions", icon: CheckLine, url: "/dashboard/missions" },
  { title: "Quests", icon: Target, url: "/dashboard/quest" },
  { title: "Leaderboard", icon: Trophy, url: "/dashboard/leaderboard" },
  {title:"Evo",icon:Circle,url:'/evo'},
  { title: "Profile", icon: User, url: "/dashboard/profile" },
];
const SideBar = () => {
  return (
    <Sidebar className="w-[160px] fixed">
      <SidebarContent className="bg-zinc-950 flex flex-col h-full justify-between">
        <SidebarGroup>
          <SidebarGroupLabel className="text-3xl font-bold mb-4 text-white">
            Evo.ai
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className="scale-110 p-2 hover:bg-zinc-900 rounded-lg"
                >
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* --- Logout Button --- */}
        <SidebarFooter className="mt-auto border-t border-zinc-800 pt-3">
          <Button
            variant="destructive"
            className="w-full flex items-center justify-center gap-2"
          >
            <LogOut size={18} /> Logout
          </Button>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
};

export default SideBar;
