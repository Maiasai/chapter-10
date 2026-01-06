"use client"

import { UseFormSetValue } from "react-hook-form";
import { PostFormData } from "./post";


export interface HandleImageChangeProps {
  event: React.ChangeEvent<HTMLInputElement>;
  setValue: UseFormSetValue<PostFormData>; 
}