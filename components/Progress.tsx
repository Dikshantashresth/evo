"use client"
import * as React from "react"
import { Progress } from "@/components/ui/progress"
export function ProgressBar({progressNumber}:{progressNumber:number}) {
  
  return <Progress value={progressNumber} className="w-[100%]" />
}