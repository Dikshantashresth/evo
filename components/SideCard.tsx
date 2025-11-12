import React from 'react'
import { Card, CardContent } from './ui/card'

const SideCard = () => {
  return (
   <Card className='bg-gradient-to-r  from-zinc-950 via-zinc-900 to-zinc-950 border-zinc-800 text-white shadow-lg rounded-2xl p-2'>
    <CardContent className=''>
        <div>
            Leaderboard
        </div>
        <div>
            Challenges
        </div>
    </CardContent>
   </Card>
  )
}

export default SideCard