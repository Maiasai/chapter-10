//管理者カテゴリー新規作成ページ

"use client";

import React, { useState } from 'react';
import CategoryForm from '../_components/CategoryForm';
import CreateButton from '../../_components/CreateButton';


//型宣言
interface PostCategoryData  {
  name : string;
}

interface PostCategoryError  {
  name? : string;
}


const categoriesNew = () =>{

  const[loading,setLoading]=useState<boolean>(false);//送信中かどうかの状態
  const[error,setError]=useState<PostCategoryError>("");// エラー表示用


  const [categoryName,setCategoryName]=useState<PostCategoryData>({ name: "" });// 入力欄の状態を保持(入力欄１つの場合この形でOK)


  const handleForm = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setCategoryName ({...categoryName,
      name : e.target.value}); //今入力された値を追加/上書き（入力欄が一つだけであれば左記のような書き方でOK）
  };


  //作成ボタン押下後＞送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ページリロード防止（←忘れると画面がリロードされて反応しないように見える）

    if(!categoryName.name.trim()){ //categoryNameはオブジェクトなのでnameで指定してからtrim
      setError("カテゴリ名を入力してください");
      return;
    }

    setError(""); //エラー解除

    //APIの呼び出し
    setLoading(true);

    try{     
      const res = await fetch("/api/admin/categories",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body : JSON.stringify({name:categoryName.name.trim()}),//JSON形式にするためにオブジェクト化
      });
  
    if (!res.ok) { //fetchのレスポンスオブジェクトが持ってるプロパティ（HTTPステータスコードが200-299の時trueになる
      const text = await res.text();
      throw new Error (`HTTP ${res.status}-${text}`)
    }


    //成功だった場合の処理
    const data = await res.json();
    console.log("レスポンス:", res.status, data); // ←ここで原因わかる


    alert("カテゴリを作成しました！");
    setCategoryName({name:""}); //成功したら入力欄をクリア
      
    } catch(err:any){
      setError(err.message);

    }finally{
      setLoading(false);

    }

  };

  if(loading){
    return <p>読み込み中...</p>
  };


    return(
      <form
        onSubmit={handleSubmit}
        className="w-full m-10">

        <h1 className="font-bold">カテゴリー作成</h1>

        <CategoryForm
          value={categoryName.name}//categoryName はオブジェクトだけど、表示したいのは name プロパティ
          onChange={handleForm}
          loading={loading}
          mode="create"
          error={error}
        />





      </form>

      

    )
  
};



export  default categoriesNew;