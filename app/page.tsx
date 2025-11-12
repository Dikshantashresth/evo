import { AuthButton } from "@/components/auth-button";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";


export default async function Home() {
  const supabase =  createClient();
  
    const { data } = await supabase.auth.getClaims();
    if (data?.claims) {
      redirect("/dashboard/home");
    }
  
  return (
    <div>
      <AuthButton/>
    </div>
  );
}
