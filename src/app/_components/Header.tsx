"use client";

import React from 'react';
import Link from "next/link";
import useSupacaseSession from '../admin/posts/hooks/useSupabaseSession';
import { supabase } from '../../utils/supabase';


const Header : React.FC = () =>  {
  const handleLogout = async () => {
    await supabase.auth.signOut() //Supabase の認証機能を使ってログアウト処理(サーバー上でトークン削除やセッション終了などが行われる)
    window.location.href = '/' //ログアウト後にページをトップ（/）へリダイレクト
  }

  const { session , isLoading } = useSupacaseSession() //Supabase のセッション取得ロジック

  return (
    <nav className="bg-black/80 flex h-16 items-center justify-between ">
      <Link href="/" className="text-white ml-6">
        Blog
      </Link>
      {!isLoading && (
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href = "/admin/posts" className="text-white">
                管理画面
              </Link>
              <button 
                className = "text-white"
                onClick={handleLogout}>
                  ログアウト
              </button>
            </>
          ) : (
            <>
              <div className="flex w-ful">
              <Link href="/contact" className="text-white">
                お問い合わせ
              </Link>
              <Link href="/login" className="text-white ml-6 mr-6">
                ログイン
              </Link>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Header;
