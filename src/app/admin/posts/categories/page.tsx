//管理者カテゴリ一覧ページ

"use client";

import Link from 'next/link';
import Button from '../_components/Button';
import useSupacaseSession from '../hooks/useSupabaseSession';
import useSWR from 'swr';

type Cat = {
  id:number; 
  name:string
};


const fetcher = async (url: string , token:string) => {
  if (!token) throw new Error('No token found'); // 未ログイン扱い

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} - ${text}`);
  }

  return res.json();
};

const categoriesList = () =>{
  const {token} = useSupacaseSession()
  const { data , error , isLoading } = useSWR(
    token ? ['/api/admin/categories',token]:null,
    ([url,token]) => fetcher(url,token)
  );


  if(isLoading) return <p>読み込み中...</p>;
  if(error) return <p>エラーが発生しました</p>;
  if (!data?.posts) return <p>データが見つかりませんでした</p>;
  
  console.log("token:", token)
  console.log('API Response:', data)


return(
  <div className="w-full mt-8 mx-8">
    <div className="flex justify-between">
      <h1 className="text-2xl font-bold">カテゴリー一覧</h1>
      <Link href="/admin/posts/categories/new">
      <Button>新規作成</Button>
      </Link>
    </div>
      <div className="flex flex-col">
        {data.posts.map((c)=> (
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