//ログイン画面

"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import { supabase } from '../../utils/supabase';
import Link from 'next/link';

const login = () => {
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (event:React.FormEvent<HTMLFormElement> )=> {
    event.preventDefault()  //ブラウザのデフォルトのフォーム送信（ページリロード）を防ぐ。 SPA では必須。

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert("ログインに失敗しました")
    }else{
      router.replace("/admin/posts")//成功であれば /admin/posts に遷移
    }
    }
  

  

  return(
    <div className = "flex min-h-screen items-center justify-center" >
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-[400px]">
      <div className = "flex flex-col w-full max-w-md">
        <label
        htmlFor="email"
          className = "" >
          メールアドレス
        </label>
        <input 
          type="email"
          name="email"
          id="email"
          className = "border rounded-lg w-full h-10 mt-2 pl-4" 
          placeholder="name@company.com"
          required//空だと送信できないようにする（ブラウザ側チェック）
          onChange={(e)=>setEmail(e.target.value)}
        />

        <label
          htmlFor="password"
          className = "mt-6">
            パスワード
        </label>  

        <input 
          type="password"
          name="password"
          id="password"
          placeholder="••••••••"
          className = "border rounded-lg w-full h-10 mt-2 pl-4" 
          required
          onChange={(e)=>setPassword(e.target.value)}
        />

        <div>
          <button 
            type="submit"
            className = "border rounded-lg w-full h-10 mt-6 bg-blue-600 text-white">
              ログイン
          </button>

          <Link 
            href="/signup"
            type="submit"
            className = "flex items-center justify-center w-full h-10 mt-6 underline ">
              新規会員登録はこちら
          </Link>

        </div>
      </div>
      </form>
    </div>
  )
}

export default login; 