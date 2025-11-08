//管理者カテゴリ一覧ページ

"use client";

import Link from 'next/link';
import Button from '../_components/Button';
import useSupacaseSession from '../hooks/useSupabaseSession';
import { useFetch } from '../hooks/useFetch';
import { Category } from '@prisma/client';

type Cat = {
  id:number; 
  name:string
};


const categoriesList = () =>{
  const {token} = useSupacaseSession()
  const { data:categories , error , isLoading } = useFetch<Category[]>(
    '/api/admin/categories',token
  );


  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました</p>;
  if (!categories?.posts) return <p>データが見つかりませんでした</p>;//初回レンダーのタイミングでcategiresにはデータがまだきていない状態なのでそこをスルーするために「？」をつける
  
  console.log("token:", token)
  console.log('API Response:', categories)


return(
  <div className="w-full mt-8 mx-8">
    <div className="flex justify-between">
      <h1 className="text-2xl font-bold">カテゴリー一覧</h1>
      <Link href="/admin/posts/categories/new">
      <Button>新規作成</Button>
      </Link>
    </div>
      <div className="flex flex-col">
        {categories.posts.map((c)=> (
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