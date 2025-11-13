'use client'
import { AuthButton } from "@/components/auth-button";
import { useSupabase } from "@/hooks/useSupabase";


import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default  function Home() {
  const {supabase} = useSupabase();

  const router = useRouter();
  useEffect(() => {
    const route = async () => {
      const data  = await supabase.auth.getUser();
      if (data.data.user?.id) {
        const {data:Check} = await supabase.from('users').select('initial').eq('id',data.data.user.id);
        console.log(Check)
        if(Check){
            router.push('/goals')
        }
        else{
          router.push('/dashboard/home')
        }
      }
    };
    route();
  }, [supabase]);

  return (
    <div>
 
    </div>
  );
}
