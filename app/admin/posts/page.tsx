//管理画面　記事一覧

"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Button from './_components/Button';

type Post = {
  id: number
  title: string
  createdAt : string
}

const ArticleList = () =>{

  const [postData,setPostData] = useState<Post[]>([]);
  const [isloading,setIsLoading] = useState< boolean >(true);
  const [error,setError] = useState< string | null >(null);


  //記事一覧をAPIから取得
  useEffect(()=> {
    const fetchData = async() =>{
  
      try{
        const res = await fetch("/api/admin/posts");

        if(!res.ok){
          const text = await res.text();
          throw new Error(`HTTP ${res.status}-${text}`)
        }

        const data : Post  =await res.json()
        console.log("APIのレスポンスdata:", data); 
        setPostData(data.posts || [] );

      } catch(err:any) {

        setError(err.message);

      } finally {

        setIsLoading(false);//読み込み中を消す

      }
    };
      fetchData();
  },[]);

  if(isloading)return<p>読み込み中…</p>;
  if(error)return<p>エラーが発生しました</p>;
  
  
  return(
    <div className="w-full mt-8 mx-8">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">記事一覧</h1>
        <Link href='posts/new'><Button>新規作成</Button></Link>
      
      </div>

      
      <div className="space-y-2 w-full">
        {postData.map((d) =>(
          <div key={d.id}
            className="border-b last:border-b-0 pb-8 w-full"
          >
        <Link href={`/admin/posts/${d.id}`} >
            <h2 className="font-bold mt-8 text-xl">{d.title}</h2>
            <time className="text-gray-500 ">{new Date(d.createdAt).toLocaleDateString("ja-JP")}</time>
        </Link>
        </div>
        ))}
      </div>


    </div>
  )
}

export default ArticleList;