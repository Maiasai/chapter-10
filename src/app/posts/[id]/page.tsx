//フロント　記事詳細画面
"use client";

import React from 'react';
import {useEffect,useState } from 'react';
import Image from "next/image";
import { supabase } from "../../../utils/supabase"


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



const ArticlePage= ({params}:Props) => {
  //URLパラメータ（ルートパラメータ）を取得するためのもの(クリックされた記事のidがここに入る)
  const { id } = params;

  const [loading, setLoading] = useState< boolean >(false);
  const [error, setError] = useState< string | null >(null);
  const [post, setPost] = useState< Post | null>(null);
  const [thumbnailUrl,setThumbnailUrl] = useState<string | null >(null);

  useEffect(() => {
    const fetcher = async () : Promise < void > => {
      try {  
        setLoading(true)
        const res = await fetch(`/api/posts/${id}`)

        if(!res.ok){
          const text = await res.text();
          throw new Error(`HTTP ${res.status}-${text}`)
        }

        const data: Post = await res.json()
        console.log("取得データ", data.posts);

        setPost(data) // dataをそのままセット

        if (data.posts.thumbnailImageKey) {
          const { data: urlData, error } = supabase.storage
            .from("post_thumbnail")
            .getPublicUrl(data.posts.thumbnailImageKey);

            if (error) {
              console.error(error.message);

            } else {

              setThumbnailUrl(urlData.publicUrl);
            }
          }

      } catch (err) { 
        setError(err.message);

      } finally {  
        setLoading(false)
      }
    };

    fetcher()
  }, [id])
  

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました: {error}</p>;
  if (!post) return <p>データが見つかりませんでした</p>;

          


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
      <p className='text-gray-400 text-[12.8px] list-none'>{new Date(post.posts.createdAt).toLocaleDateString('ja-JP')}</p>
          

      <ul className='flex'>
        {post.posts.postCategories?.map((cat=> (
          <li key={cat.category.id} 
          className='text-blue-600 text-[12.8px] mr-2 py-1  px-2 border border-blue-500 rounded list-none'>{cat.category.name}</li>
        )))}
      </ul>

        
      </div>
        <p className='text-black text-2xl mt-2 mb-4'>{post.posts.title}</p>
        <p className='text-black '
          dangerouslySetInnerHTML={{ __html:post.posts.content }}/>
      </div>

    </div>

  );

}

export default ArticlePage;
