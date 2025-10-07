//フロント　記事一覧画面

"use client";

import React from 'react';
import { useEffect,useState } from 'react';
import Link from "next/link";
import { supabase } from '../utils/supabase';


type Post = {
  title : string
  content : string
  categories : {id:number; name:string}[]
  thumbnailImageKey : string
}


const TopPage: React.FC = () => {
  const [loading, setLoading] = useState< boolean >(false);
  const [error, setError] = useState< string | null >(null);
  const [posts, setPosts] = useState<Post[]>([]);


  // APIから記事データを取得してjsonに変換→postsに渡してる
  useEffect(() => {
    const fetcher = async () => {
    setLoading(true);

    try{
      const res = await fetch('/api/posts')

      if(!res.ok){
        const text = await res.text();
        throw new Error(`HTTP ${res.status}-${text}`)
      }
      const data = await res.json();

      console.log("API Response:", data.posts);
      console.log("最初の記事のカテゴリ:", data.posts[0].postCategories[0].category.name);

      setPosts(data.posts);

    } catch (err: any) {

      setError(err.message);

    } finally {

      setLoading(false); 

    }
  };
    fetcher()
  }, [])

  
  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました: {error}</p>;
  if (!posts) return <p>データが見つかりませんでした</p>;



  return(
    <>
    <div className='px-4 my-10 max-w-3xl mx-auto'>
      
      {posts.map((post) => (
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