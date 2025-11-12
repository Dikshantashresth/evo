import React from 'react'
import { Card, CardContent, CardTitle } from './ui/card'
import { Flame} from 'lucide-react'

const StreakComponent = () => {
  return (
    <Card className='bg-zinc-950 border-zinc-800 flex flex-col items-center justify-center text-white shadow-lg rounded-2xl p-4 h-full'>
        <CardTitle className='font-bold text-2xl'>Streak</CardTitle>
        <CardContent className='flex items-center  h-[65px] mt-2 justify-center'>
            <span className='text-5xl font-bold'>1</span> <Flame size={50} stroke='none' className='fill-yellow-500'/>
        </CardContent>

    </Card>
  )
}

export default StreakComponent