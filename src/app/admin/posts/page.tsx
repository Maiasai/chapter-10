//管理画面　記事一覧

"use client";

import Link from 'next/link';
import Button from './_components/Button';
import useSupacaseSession from './hooks/useSupabaseSession';
import useSWR from 'swr';

type Post = {
  id: number
  title: string
  createdAt : string
}


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

const ArticleList = () =>{
  const {token} = useSupacaseSession() //カスタムフックが返すオブジェクトから token を分割代入で取る
  const { data , error , isLoading } = useSWR(
    token ? ['/api/admin/posts',token]:null,
    ([url,token]) => fetcher(url,token)
  );


  if(isLoading)return<p>読み込み中…</p>;
  if(error)return<p>エラーが発生しました</p>;
  if (!data?.posts) return <p>データが見つかりませんでした</p>;
  
  console.log("token:", token)
  console.log('API Response:', data)

  return(
    <div className="w-full mt-8 mx-8">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">記事一覧</h1>
        <Link href='posts/new'><Button>新規作成</Button></Link>
      
      </div>

      
      <div className="space-y-2 w-full">
        {data.posts.map((d) =>(
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