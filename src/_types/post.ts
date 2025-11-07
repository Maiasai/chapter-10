"use client"

export interface PostFormData  { 
  title : string;
  content : string;
  categories : { id : number} [];
  thumbnailImageKey : string;
  thumbnailImageUrl : string;
  thumbnailImageName : string;
};
