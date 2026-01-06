//フロント　記事詳細画面
"use client";

import React from 'react';
import {useEffect,useState } from 'react';
import Image from "next/image";
import { supabase } from "../../../utils/supabase"
import useSWR from 'swr';


type Post = {
  title : string
  content : string
  createdAt :  string
  thumbnailImageKey : string | null 
  categories : {id:number; name:string}[]
 }


type Props = { 
  params:{id:string}
};

const fetcher = async(url:string)=>{
  const res = await fetch(url)
  if (!res.ok){
    const text = await res.text()
    throw new Error (`HTTP ${res.status}-${text}`)
  }
  return res.json()
}


const ArticlePage= ({params}:Props) => {
  //URLパラメータ（ルートパラメータ）を取得するためのもの(クリックされた記事のidがここに入る)
  const { id } = params;
  const { data , error , isLoading  } = useSWR(`/api/posts/${id}`,fetcher)
  const [thumbnailUrl,setThumbnailUrl] = useState<string | null >(null);

  useEffect(() => {
    if (data?.posts?.thumbnailImageKey) {
      const { data: urlData, error } = supabase.storage
        .from("post_thumbnail")
        .getPublicUrl(data.posts.thumbnailImageKey);

        if (error) {
          console.error(error.message);

        } else {
          setThumbnailUrl(urlData.publicUrl);
        }
    
  }}, [data])
  

  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました: {error}</p>;
  if (!data?.posts) return <p>データが見つかりませんでした</p>;

          
  console.log("SWRのdata:", data, "isLoading:", isLoading, "error:", error)

  return(
    <div className='p-10'>
    
    <div className='w-full max-w-3xl mx-auto '>

    <div className='flex items-center justify-center relative w-full h-96'>
    {thumbnailUrl && (
      <Image
        src={thumbnailUrl}
        alt="thumbnail" 
        fill
        priority
      />
    )}
    </div>

    </div>

    <div className='w-full max-w-3xl mx-auto p-4 m-0'>
    <div className='flex justify-between'>
      <p className='text-gray-400 text-[12.8px] list-none'>{new Date(data.posts.createdAt).toLocaleDateString('ja-JP')}</p>
          

      <ul className='flex'>
        {data.posts.postCategories?.map((cat=> (
          <li key={cat.category.id} 
          className='text-blue-600 text-[12.8px] mr-2 py-1  px-2 border border-blue-500 rounded list-none'>{cat.category.name}</li>
        )))}
      </ul>

        
      </div>
        <p className='text-black text-2xl mt-2 mb-4'>{data.posts.title}</p>
        <p className='text-black '
          dangerouslySetInnerHTML={{ __html:data.posts.content }}/>
      </div>

    </div>

  );

}

export default ArticlePage;
