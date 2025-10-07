//管理者カテゴリ一覧ページ

"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Button from '../_components/Button';
import useSupacaseSession from '../hooks/useSupabaseSession';

type Cat = {
  id:number; 
  name:string
};

const categoriesList = () =>{
  
  const [catdata,setCatData] = useState<Cat[]>([]);
  const [loading,setLoading] = useState<boolean>(false);
  const [error,setError] = useState<string|null>(null);
  const {token} = useSupacaseSession()

  useEffect(()=>{
    if(!token) return
    setLoading(true);

    const fetchData = async () => {

      try{
        const res = await fetch('/api/admin/categories',{
          headers : {
            'Content-Type' : 'application/json',
            Authorization :token,
          }
        });

      if(!res.ok){ //true　→　ステータスコードが 200–299 のとき。それ以外（400系エラー、500系エラーなど）のときは false
        //HTTP 4xx,5xxは自分でエラーにする
        const text = await res.text(); //レスポンスボディをテキスト形式で取得
        throw new Error (`HTTP ${res.status} - ${text}`)//throw: エラーを発生させる構文。resの内容が埋め込まれる→"HTTP 400 - カテゴリ名が空です"
      }

        const data : Cat = await res.json();
        console.log("APIのレスポンス:", data);
        setCatData(data.posts || [] );

      } catch(err:any){

        setError(err.message);
 
      } finally {

        setLoading(false); //読み込み中を消す
        
      }
      };

    fetchData();//ここで関数が呼び出されて初めて動く

  },[token]);

  if(loading) return <p>読み込み中...</p>;
  if(error) return <p>エラーが発生しました</p>;


return(
  <div className="w-full mt-8 mx-8">
    <div className="flex justify-between">
      <h1 className="text-2xl font-bold">カテゴリー一覧</h1>
      <Link href="/admin/posts/categories/new">
      <Button>新規作成</Button>
      </Link>
    </div>
      <div className="flex flex-col">
        {catdata.map((c)=> (
          <div key={c.id}
            className="font-bold border-b last:border-b-0 p-6 w-full"
          >
          <Link href={`/admin/posts/categories/${c.id}`}>
            <h2>{c.name}</h2>
          </Link>
          </div>
        ))}
      </div>
  </div>
  )
}


export  default categoriesList;