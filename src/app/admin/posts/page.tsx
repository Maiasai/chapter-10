//管理画面　記事一覧

"use client";

import Link from 'next/link';
import Button from './_components/Button';
import { useFetch } from './hooks/useFetch';

type Post = {
  id: number
  title: string
  createdAt : string
}


const ArticleList = () =>{
 const { data : post , error , isLoading } = useFetch<Post>(
    '/api/admin/posts');//useFetchに渡るURLとtoken

  if(isLoading)return<p>読み込み中…</p>;
  if(error)return<p>エラーが発生しました</p>;
  if (!post?.posts) return <p>データが見つかりませんでした</p>;
  
  console.log('API Response:', post)

  return(
    <div className="w-full mt-8 mx-8">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">記事一覧</h1>
        <Link href='posts/new'><Button>新規作成</Button></Link>
      
      </div>
      
      <div className="space-y-2 w-full">
        {post.posts.map((d) =>(
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