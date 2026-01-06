//管理画面　記事新規作成
"use client";

import React, { useEffect, useState } from 'react';
import PostForm from '../_components/PostForm';
import handleImageChange from '../_components/handleImageChange';
import useSupacaseSession from '../hooks/useSupabaseSession';
import useToggleCategory from '../hooks/toggleCategory';
import { useForm,Control } from 'react-hook-form';
import { PostFormData } from "@_types/post"; 
import { Category } from '@prisma/client';


const New = () => {

  const { register,control,setValue,handleSubmit,watch,formState : {errors} ,reset } = useForm<PostFormData>(
    {defaultValues:{//ここでフォームの初期値を設定
      title:"",
      content:"",
      categories:[],
      thumbnailImageKey:"",
      thumbnailImageUrl: "",
      thumbnailImageName: "",
    }
  });

    // watchでプレビューを監視
    const thumbnailImageUrl = watch("thumbnailImageUrl")
    const thumbnailImageName = watch("thumbnailImageName")
  
  
  
  const [isOpen,setIsOpen]=useState<boolean>(false);//カテゴリ選択欄（プルダウン開閉箇所）
  const [loading,setLoading]=useState<boolean>(false);
  const {token} = useSupacaseSession()



  //カテゴリをAPIから取得
  const[categories,setCategories] = useState<Category[]>([]);
    
    useEffect(()=>{
      if(!token) return

      const fetchCategories = async() => {
      setLoading(true);

        try{
          const res = await fetch('/api/admin/categories',{
            headers : {
              'Content-Type' : 'application/json', 
              Authorization : token, 
            },
          });
        

        if(!res.ok){
          const text = await res.text();
          throw new Error (`HTTP ${res.status}-${text}`)
        }

          const data = await res.json();
          setCategories(data.posts);

        }catch(err:any){

          console.error(err.message);

        } finally {

          setLoading(false);

        }
      }
        fetchCategories();
  },[token]);

  //カテゴリの選択動作　関連
  const selectedCategories = watch("categories");//現在のフォーム状態のcategoriesを常に監視

  //カスタムフックをセット
  const {toggleCategory} = useToggleCategory(
    setValue, // RHF の値を更新する関数
    ()=>selectedCategories);//カスタムフックに２つの情報を渡してる


  //新規作成のAPI
  const onSubmit = async (data:PostFormData) => {
    setLoading(true);

    console.log("データ", data) 

    try {//ここで書いた処理を実行してエラーだったらcatchに飛ばす        
      const res = await fetch('/api/admin/posts', {  
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization : token,
        },
        body:JSON.stringify({
          title:data.title,
          content:data.content,
          categories:data.categories.map((c) => ({ id: c.id })), // idだけ送る
          thumbnailImageKey: data.thumbnailImageKey,  // Supabaseパス
          thumbnailImageUrl: data.thumbnailImageUrl,  // 表示URL
          thumbnailImageName: data.thumbnailImageName, // ← 元のファイル名
        })
      });
     
 

      if (!res.ok) { //fetchのレスポンスオブジェクトが持ってるプロパティ（HTTPステータスコードが200-299の時trueになる
        const text = await res.text();
        throw new Error (`HTTP ${res.status}-${text}`)
      }

      const result : PostFormData  = await res.json();
      
      console.log("結果:", result);

      // フォーム全体を初期値に戻す
      reset({
        title: "",
        content: "",
        categories: [],
        thumbnailImageKey: "",
        thumbnailImageUrl: "",
        thumbnailImageName: "",
      });
      setIsOpen(false); //プルダウンも閉じる
    
      alert("記事を作成しました！");

    } catch (err:any) {


      console.error(err.message);
      
    } finally { //エラーが発生してもしなくても必ず最後に実行される処理
      setLoading(false);//読み込み中を消す
    }
  };

  if(loading){
    return <p>読み込み中...</p>
  };

  return(
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex  w-full mt-8 mx-8">

      <div className="container flex flex-col w-full">
        <p className="text-2xl font-bold ">新規作成</p>

        <PostForm
          setValue={setValue}
          register={register}
          watch={watch}
          control={control}
          errors={errors}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleImageChange={handleImageChange}
          thumbnailImageUrl={thumbnailImageUrl}
          thumbnailImageName={thumbnailImageName}
          categories={categories}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          mode="create"
          loading={loading}
         />
   
      </div>
    </form>

  );

}

export default New;