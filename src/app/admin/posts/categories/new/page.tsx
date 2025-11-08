//管理者カテゴリー新規作成ページ

"use client";

import React, { useState } from 'react';
import CategoryForm from '../_components/CategoryForm';
import CreateButton from '../../_components/CreateButton';
import useSupacaseSession from '../../hooks/useSupabaseSession';
import { useForm } from 'react-hook-form';
import { PostCategoryData } from '@_types/postcategorydata';


const categoriesNew = () =>{
  const { register,handleSubmit,formState: {errors} , reset } = useForm<PostCategoryData>();

  const [loading,setLoading]=useState<boolean>(false);//送信中かどうかの状態
  const {token} = useSupacaseSession()


  //作成ボタン押下後＞送信処理
  const onSubmit = async (data : PostCategoryData) => {
    setLoading(true);


    try{     
      const res = await fetch('/api/admin/categories',{
        method:"POST",
        headers:{
          'Content-Type':'application/json',
          Authorization : token,
        },

        body : JSON.stringify({name:data.name.trim()}),//JSON形式にするためにオブジェクト化
      });

      console.log(res) 
  
    if (!res.ok) { //fetchのレスポンスオブジェクトが持ってるプロパティ（HTTPステータスコードが200-299の時trueになる
      const text = await res.text();
      throw new Error (`HTTP ${res.status}-${text}`)
    }


    //成功だった場合の処理
    const d = await res.json();
    console.log("レスポンス:", res.status, d); // ←ここで原因わかる

    alert("カテゴリを作成しました！");
    reset(); //成功したら入力欄をクリア
      
    } catch(err:any){
      console.error(err.message);
    }finally{
      setLoading(false);
    }
  };

  if(loading){
    return <p>読み込み中...</p>
  };


    return(
      <form
        onSubmit={handleSubmit(onSubmit)}//フォーム送信＞ここが呼ばれると、register() で登録されたすべてのフィールドをチェック
        className="w-full m-10">

        <h1 className="font-bold">カテゴリー作成</h1>

        <CategoryForm
          register = {register(
            "name",{  //nameというフィールドをフォーム管理に登録（もし空ならエラーもセットしてねって意味）
            required:"カテゴリ名は必須です" //ここに書いたエラーが、自動的に「formState.errors」に格納される
          })}
          error = {errors.name?.message}
          loading = {loading}
          mode = "create"
        />
      </form>
    )  
};



export  default categoriesNew;