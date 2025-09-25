//ログイン

"use client";

import React from 'react';
import Link from 'next/link';

const login = ()=>{
  

return(
  <div className = "flex min-h-screen items-center justify-center" >
    <div className = "flex flex-col w-full max-w-md">
      <p className = "" >メールアドレス</p>
      <input className = "border rounded-lg w-full h-10 mt-2 pl-4" placeholder="name@company.com"></input>

      <p className = "mt-6">パスワード</p>  
      <input className = "border rounded-lg w-full h-10 mt-2 pl-4" placeholder="• • • • • • • •"></input>

      <Link href="/admin/posts"><button className = "border rounded-lg w-full h-10 mt-6 bg-blue-600 text-white">ログイン</button></Link>
    </div>
  </div>
)
}

export default login; 