//管理画面（サイドバー含む）

"use client";

import Link from 'next/link';
import React from 'react';
import useRouteGuard from './hooks/useRouteGuard';
import { usePathname } from 'next/navigation';// Next.js 13 以降の App Router 専用フック


const dashboard = ({ children }: { children: React.ReactNode }) => {

  useRouteGuard() //全ての管理者用ページ(当コンポーネントの配下ページにアクセスした時に、ここの関数内のuseEffectが必ず発火する

  const pathname = usePathname()//ブラウザで現在開いている URL の パス部分を返してくれる
  const isSelected = (href:string) => { //hrefにチェックしたいパスを渡す。
    return pathname.includes(href)//pathnameの中にhrefが含まれていたらtureを返す。
  }

  return(
    <div className="flex min-h-screen">
       {/* サイドバー */}    
        <aside className="flex flex-col h-auto min-h-screen  bg-gray-200 w-1/4 ">
        <Link href= "/admin/posts"
          className = {`p-4 text-lg  hover:bg-blue-200 ${
            isSelected('/admin/posts') && 'bg-blue-100'
          }`}
        >
            記事一覧
        </Link>
        <Link href="/admin/posts/categories"
          className = {`p-4 text-lg hover:bg-blue-200 ${
            isSelected('/admin/categories')&&'bg-blue-100'
          }`}
        >
            カテゴリ一覧
        </Link>
      </aside>
       {/* サイドバー */}
      {children} 
    </div>
  )
}

export default dashboard;