
import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import { UserProfile } from "@/app/types/ProfileType";
interface authstate{
    user:UserProfile | null,
    loading:boolean,
    error:string|null

}
const initialState : authstate={
    user:null,
    loading:false,
    error:null

}
export const  getprofile = createAsyncThunk<UserProfile>('profile/getInfo',async()=>{
   const response = await axios.get('/api/profile');
   const data:UserProfile = response.data.userData?.[0]
    const info:UserProfile = {
        id: data.id,
        email: data.email,
        username:data.username,
        xp:data.xp,
        level:data.level,
        title:data.title,
        goals_achieved:data.goals_achieved
    }
    return info
    
})
export const userSlice = createSlice({
    name:"profile",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getprofile.pending,(state)=>{
            state.loading = true
        })
        .addCase(getprofile.fulfilled,(state, action)=>{
            state.loading = false;
            state.user = action.payload;
        })
        
    }
})
export default userSlice.reducer