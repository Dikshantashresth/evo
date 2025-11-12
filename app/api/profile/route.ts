import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(){
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id
    if(!user || !userId){
        return
    }
    const {data:userData} = await supabase.from("users").select("*").eq('id',userId);
    return NextResponse.json({userData})

}