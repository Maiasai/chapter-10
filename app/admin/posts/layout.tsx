//管理画面（サイドバー含む）

"use client";

import Link from 'next/link';
import React from 'react';


const dashboard = ({ children }: { children: React.ReactNode }) => {
  return(
    <div className="flex h-screen">
       {/* サイドバー */}    
        <aside className="flex flex-col  bg-gray-200 w-1/4 h-full">
        <Link href= "/admin/posts"><nav className = "p-4 text-lg  hover:bg-blue-200">記事一覧</nav></Link>
        <Link href="/admin/posts/categories"><nav className = "p-4 text-lg hover:bg-blue-200">カテゴリ一覧</nav></Link>
      </aside>
       {/* サイドバー */}

      {children} 
    </div>
  )
}

export default dashboard;