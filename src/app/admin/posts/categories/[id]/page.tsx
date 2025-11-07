//管理者カテゴリ編集/削除
"use client";

import { useParams } from "next/navigation";
import CreateButton from "../../_components/CreateButton";
import CategoryForm from "../_components/CategoryForm";
import DeleteButton from "../../_components/DeleteButton";
import useSupacaseSession from "../../hooks/useSupabaseSession";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { PostCategoryData } from "@_types/postcategorydata";


//fetcher関数
const fetcher = async (url: string , token:string) => {
  console.log("fetcher開始:", url, token);
  if (!token) throw new Error('No token found'); // 未ログイン扱い

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });

  console.log("fetcherレスポンスステータス:", res.status);

  if (!res.ok) {
    const text = await res.text();
    console.log("fetcherレスポンス:", text); 
    throw new Error(`HTTP ${res.status} - ${text}`);
  }

  const json = await res.json();
  console.log("fetcher成功レスポンス:", json);
  return json;
};


//カテゴリのidから取得
const categoriesEdit : React.FC = ()=>{
  const { session, token, isLoading: sessionLoading } = useSupacaseSession(); // ←先に取得
  const {id} = useParams<{ id: string }>();

  const { register,watch,handleSubmit,formState : {errors, isSubmitting} ,reset } = useForm<PostCategoryData>({
    defaultValues : {name:""},
  });

  //SWRの実行条件と呼び出し
  const numericId = id ? Number(id) : null;//、「id が存在するなら数値に変換して使う」「なければ null にする」
  const shouldFetch = Boolean(token && !sessionLoading && numericId);//トークンがあって、セッション読み込みが完了してて　URLパラメータにカテゴリIDがあるならデータを取得してOK
  const { data, error, isLoading } = useSWR(
    shouldFetch ? [`/api/admin/categories/${numericId}`, token] : null,//shouldFetchがtrueの時だけSWRが発火（falseだとSWRの実行がされない）
    ([url, token]) => fetcher(url, token)//ここでfetcher関数を叩いてる
  );
    const [loading,setLoading]=useState<boolean>(false);

  //初期データ反映
  useEffect(() => {
    if (data?.post?.name) reset({ name: data.post.name });
  }, [data, reset]);


  //更新のAPI
  const onSubmit = async(data:PostCategoryData)=> {
    setLoading(true);

    try{
      const res = await fetch(`/api/admin/categories/${id}`,{
        method : "PUT",
        headers : {
          "Content-Type" : "application/json",   
          ...(token ? { Authorization: token } : {}), // → token が null の時は空オブジェクト {} になる。 
        },
        body : JSON.stringify({name:data.name.trim()}),
    })

    console.log(res)

    if(!res.ok){
        const text = await res.text();//レスポンスボディをテキストとして読み取る。サーバーが JSON で返しているか不明なときに安全に中身を取る方法。
        console.error("サーバーエラー:",res.status,text);

        throw new Error (`HTTP ${res.status}-${text}`)
      }
      alert("カテゴリー名を更新しました！");


    } catch (err:any) {
      console.error(err.message);
        
    } finally {
      setLoading(false);
    }
   };

   
   //削除API（SWR外で実行）
   const handleDelete = async (postId:number)=>{
    if (!confirm("本当に削除しますか？")) return;
      setLoading(true);

      try{
        const res = await fetch(`/api/admin/categories/${id}`,{
          method : "DELETE",
          headers : {
            ...(token ? { Authorization: token } : {}), // ← tokenがある時だけ追加
          },
        });
    
        console.log("削除レスポンス",res);
      
      if(!res.ok){
        const text = await res.text();
        console.error("削除エラー:",res.status, text);
        throw new Error (`HTTP ${res.status}-${text}`)
      }

        alert("カテゴリーを削除しました！");
        window.location.href = "/admin/posts/categories";// 削除後に一覧ページへ遷移
      
      }catch (err:any) {
      console.error(err.message);
    }finally {
      setLoading(false);
    }
   }

    if (isLoading) return <p>初期データ読み込み中...</p>;
    if (loading) return <p>処理中...</p>;
    if(error)return<p>エラーが発生しました</p>;
    if (!data?.post) return <p>データが見つかりませんでした</p>;
   
    console.log("token:", token)
    console.log('API Response:', data)
 

return(
  <form
    onSubmit = {handleSubmit(onSubmit)}
    className="w-full m-10">
      
    <div>
      <h1>カテゴリー更新</h1>

      <CategoryForm   
        register= {register(
          "name",{
            required:"カテゴリ名は必須です"
          }//ここのnameにすでに「name: "name",」が含まれている
        )}
        isSubmitting={isSubmitting}
        watch={watch}
        handleDelete={handleDelete}
        error={errors.name?.message}
        mode="edit"
      >

      </CategoryForm>
    </div>
  </form>
)};
    

export default categoriesEdit;
