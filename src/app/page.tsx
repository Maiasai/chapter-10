//フロント　記事一覧画面

"use client";

import React from 'react';
import Link from "next/link";
import useSWR from 'swr';


type Post = {
  title : string
  content : string
  categories : {id:number; name:string}[]
  thumbnailImageKey : string
}

const fetcher = async(url:string)=>{
  const res = await fetch(url)
  if (!res.ok){
    const text = await res.text()
    throw new Error (`HTTP ${res.status}-${text}`)
  }
  return res.json()
}

const TopPage: React.FC = () => {
  const { data , error , isLoading  } = useSWR('/api/posts',fetcher)

  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました: {error}</p>;
  if (!data?.posts) return <p>データが見つかりませんでした</p>;//data がまだない、または posts プロパティが空ならこのメッセージを表示する



  return(
    <>
    <div className='px-4 my-10 max-w-3xl mx-auto'>
      
      {data.posts.map((post) => (
        <Link key={post.id}
          href={`/posts/${post.id}`}
          
          className='text-black mb-8 p-4 border border-gray-300 block'>
            <div className='flex justify-between'>
              <li className='text-gray-400 text-[12.8px] list-none'>{new Date(post.createdAt).toLocaleDateString('ja-JP')}</li>
            
              <ul className='flex'>
                {post.postCategories.map(cat=>(
                  <li 
                    key={cat.category.id}
                    className='text-blue-600 text-[12.8px] mr-2 py-1  px-2 border border-blue-500 rounded list-none'
                  >{cat.category.name}</li>
                ))}

              </ul>
            </div>
          

            <p className='text-black text-2xl mt-2 mb-4'>{post.title}</p>
            <p className='text-black line-clamp-2'
              dangerouslySetInnerHTML={{ __html:post.content }}/>


        </Link>
      ))}
    </div>
    </>
  );
};

export default TopPage; 