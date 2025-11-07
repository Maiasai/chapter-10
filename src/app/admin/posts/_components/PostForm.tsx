"use client";

//記事新規作成と編集に渡す用(見た目と入力操作)

import React, { useEffect, useState } from "react";
import CreateButton from "./CreateButton";
import DeleteButton from "./DeleteButton";
import { supabase } from "../../../../utils/supabase";
import Image from "next/image";
import { Control, Controller, FieldErrors, FieldValues, useForm, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { PostFormData } from "@_types/post";
import handleImageChange, { HandleImageChangeProps } from "./handleImageChange";
import { Category } from "@_types/category";

//親から受け取るデータと関数の型を定義
interface Props {
  id? : number;
  setValue : UseFormSetValue<PostFormData>;
  register : UseFormRegister<PostFormData>;
  watch : UseFormWatch<PostFormData>;
  control:Control<PostFormData>,
  errors : FieldErrors<PostFormData>;
  isOpen : boolean;
  setIsOpen : React.Dispatch<React.SetStateAction<boolean>>;
  handleImageChange: (args: HandleImageChangeProps) => Promise<void>;//「handleImageChange は、HandleImageChangeProps 型の引数を受け取り、非同期（Promise）で何も返さない (void) 関数です」
  thumbnailImageKey:string;
  setThumbnailImageKey:React.Dispatch<React.SetStateAction<string>>;
  thumbnailImageUrl:string;
  setThumbnailImageUrl:React.Dispatch<React.SetStateAction<string>>;
  thumbnailImageName:string;
  categories : Category[];
  selectedCategories : Category[];
  toggleCategory : (cat: Category) => void;
  mode?: "create" | "edit"; //コードを指定（デフォルトはcreate)
  handleDelete? : (id:number)=> void; //削除用
  loading : boolean;
}


const PostForm:React.FC<Props> = ({
  id,
  setValue,
  register,
  watch,
  control,
  errors,
  isOpen,
  setIsOpen,
  handleImageChange,
  thumbnailImageKey,
  thumbnailImageUrl,
  thumbnailImageName,
  categories,
  selectedCategories,
  toggleCategory,
  mode="create",
  handleDelete,
  loading,
}:Props) => {


// サムネイルのURL取得(thumbnailImageKeyが更新されたタイミングで実行)
  useEffect(() => {
    if (!thumbnailImageKey) return;

    const fetcher = async () => {
      const {
        data: { publicUrl }, //結果は { data: { publicUrl: "https://..." } } の形で返ってくる
      } = await supabase.storage
        .from("post_thumbnail")
        .getPublicUrl(thumbnailImageKey);// Supabase に保存された画像の 公開用 URL を取得するメソッド。

      setValue("thumbnailImageUrl", publicUrl);
    };

    fetcher();
  }, [thumbnailImageKey,setValue]);  

  console.log("watchの型:", typeof watch);


  return(
    <div>
      <p className="mt-4">タイトル</p>
      <input className="border h-10 p-2 rounded-lg w-full"
        type="text"
        name = "title"
        {...register("title",{
          required : "タイトルは必須です"
        })}
        disabled={loading}
      />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}

      <p className="mt-4">内容</p>
      <textarea className="border h-20 p-2 rounded-lg w-full"
        type="text"
        name = "content"
        {...register("content",{
          required : "内容は必須です"
        })}
        disabled={loading}
      />
      {errors.content && <p className="text-red-500">{errors.content.message}</p>}


  {/* 画像 */}
    <Controller
      name="thumbnail"
      control={control}
      rules= {mode==="create"?{ required:"画像は必須です"}:{}}
      render={({field})=>(

        <>
          <p className="mt-4">サムネイル画像</p>
          <div className="flex">

            <label className="inline-block cursor-pointer text-xs px-4 py-2 bg-gray-600 text-white rounded-md">
              ファイル選択
              
              <input  
                type = "file"
                accept="image/*"
                onChange={(e) => {//①画像選択時、このonChangeが発火

                  field.onChange(e); // ②RHF に「thumbnailフィールドが変化した」ことを通知

                    handleImageChange({//④自分で定義した画像アップロード関数を実行
                    event:e,
                    // 画像を変更したタイミングでフォームの値を最新に更新している 処理
                    setValue,
                  });
                }}
                style={{ display: "none" }}
                disabled={loading}
              />
              
            </label>
            <p className="text-base mt-1.5 ml-2">
              {watch("thumbnailImageName") || "ファイルを選択してください" }
            </p>
          </div>

          {errors.thumbnail && <p className="text-red-500">{errors.thumbnail.message}</p>}

          {watch("thumbnailImageUrl") && ( //ここで選ばれたファイルのプレビューを表示
          <div className="mt-2">
            <Image 
              src={watch("thumbnailImageUrl")} 
              alt="thumbnail" 
              width={400} 
              height={400} />
          </div> 
          )}  
        </>
      )}
    />

      

      {/* カテゴリー */}
      <p className="mt-4">カテゴリー</p>

      
      <div //プルダウンの見た目。押下することでプルダウン開閉ができる
        className="flex flex-wrap items-center border 
        min-h-[40px] rounded-lg cursor-pointer  gap-1 px-2 p-2"
        {...register("categories",{
          required : "カテゴリを選択してください"
        })}
        onClick={() => setIsOpen(prev => !prev)}
        >

        
        {selectedCategories.length === 0 ? ( //未選択の場合のプレースホルダー
        <span className="text-gray-400">カテゴリを選択</span>
        ) : (
          selectedCategories.map(cat => ( //ここで選択されたカテゴリをバッジとして描画

        <span
          key={cat.id}
          className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-sm flex items-center gap-1"
          onClick={(e) => {
            e.stopPropagation(); // プルダウンの開閉を阻止(親に伝わらないようにする命令)
            toggleCategory({ 
              id: Number(cat.id), 
              name: cat.name 
            });  // クリックで解除
          }}
          >
          {cat.name} ×
        </span>
          ))
        )}
        <svg
          className={`w-4 h-4 ml-auto self-center transition-transform 
            ${isOpen ? "rotate-180" : "rotate-0"}`}//条件 ? 真のとき : 偽のとき(ここでは isOpen が条件)
          viewBox="0 0 24 24"
          >
              
          <path d="M7 10l5 5 5-5z" /> {/* →ここで矢印を作成 */}
        </svg>
      </div>


      {isOpen && ( //isOpenがtrueの場合のみ以下を実行
      <div className="absolute z-10 bg-white border rounded-lg mt-2 max-h-40 overflow-y-auto w-full">
        {categories.map(allcat => (
          <div
            key={allcat.id}
            className="px-2 py-1 hover:bg-gray-100 cursor-pointer" //当てた箇所に色をつける
            onClick={() => 
              toggleCategory({ 
                id: Number(allcat.id), 
                name: allcat.name
                })} //クリックされたら親の関数を実行、カテゴリを追加・削除する
          >
            {allcat.name}
          </div>
        ))}
      </div>
      )}

    {errors.categories && <p className="text-red-500">{errors.categories.message}</p>}


      <div className="flex mb-10">
        <CreateButton
          type="submit"
          disabled={loading}
          >
          {mode === "create" ? "作成" : "更新"}
        </CreateButton>

        {mode !== "create" && (
          <DeleteButton
            type="button"
            onClick={()=>handleDelete(id)}// ここで記事IDを渡す（Number() は JavaScript の組み込み関数で、引数を 数値に変換 するためのもの）
            disabled={loading}
          >
          削除
          </DeleteButton>
        )}
      </div>
    </div>
  )
};

export default PostForm;