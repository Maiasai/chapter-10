//管理画面　記事新規作成
"use client";

import React, { useEffect, useState } from 'react';
import PostForm from '../_components/PostForm';
import handleImageChange from '../_components/handleImageChange';
import useSupacaseSession from '../hooks/useSupabaseSession';
import useToggleCategory from '../hooks/toggleCategory';
import ValidateForm from '../_components/validateForm';


interface PostFormData {
  title : string
  content : string
  categories : {id:number}[]
  thumbnailImageKey : string
}

interface PostFormErrors {
  title? : string
  content? : string
  categories? : string
  thumbnailImageKey? : string
}

interface Category {
  id: number;
  name: string;
}

const New = () => {
  
  const [isOpen,setIsOpen]=useState<boolean>(false);//カテゴリ選択欄（プルダウン開閉箇所）
  const [loading,setLoading]=useState<boolean>(false);
  const [errors, setErrors] = useState<PostFormErrors>({});
  const [selectedCategories,setSelectedCategories] = useState<Category[]>([]);
  const [thumbnailImageKey,setThumbnailImageKey] = useState<PostFormData>("");
  const {token} = useSupacaseSession()
  const [formData,setFormData] = useState<PostFormData>({
    title : "",
    content : "",
    categories : [],
    thumbnailImageKey:  '', // ファイル選択用
  });

  const { toggleCategory } = useToggleCategory(setFormData,setSelectedCategories);
  const { validateForm } = ValidateForm();

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

        }catch(err){

          setErrors(err.message);

        } finally {

          setLoading(false);

        }
      }
        fetchCategories();

  },[token]);




  // thumbnailImageKey 監視用
  useEffect(() => {
    if (thumbnailImageKey) {
      setFormData(prev => ({
        ...prev,
        thumbnailImageKey : thumbnailImageKey,//formData.thumbnailImageKey に thumbnailImageKey の値がセットされる
      }));
    }
  }, [thumbnailImageKey]); // ← thumbnailImageKey が変化したときだけ実行
  

  const handleForm = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
    setFormData({
      ...formData,  // 既存データを保持
      [e.target.name]:e.target.value}) // name に対応する項目を更新
  }

  const payload = {
    title: formData.title,
    content: formData.content,
    categories: formData.categories,
    thumbnailImageKey: thumbnailImageKey, 
  };

  //新規作成のAPI
  const handleSubmit = async (e:React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    
    const isValid:PostFormErrors = validateForm(formData);
    console.log("payload.thumbnail", payload.thumbnailImageKey) 

    if(Object.keys(isValid).length>0){ //Object.keys(isValid); は、そのオブジェクトのキーだけの配列を返す["title", "content"]
      console.log(isValid)
      setErrors(isValid);
      setLoading(false);
      return;
    }
  
    setErrors({});

    try {//ここで書いた処理を実行してエラーだったらcatchに飛ばす        
      const res = await fetch('/api/admin/posts', {  
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization : token,
        },
        body: JSON.stringify(payload),
      });


      console.log("ログ:", res);

      if (!res.ok) { //fetchのレスポンスオブジェクトが持ってるプロパティ（HTTPステータスコードが200-299の時trueになる
        const text = await res.text();
        throw new Error (`HTTP ${res.status}-${text}`)
      }

      const data : PostFormData  = await res.json();
      console.log("作成成功:", payload);

      // 投稿後にフォームをリセット
      setFormData({
        title: "",
        content: "",
        categories: [],
        thumbnailImageKey: undefined, // ファイル選択用
      });

      setSelectedCategories([]); //カテゴリもリセット
      setIsOpen(false); //プルダウンも閉じる
    
      alert("記事を作成しました！");

    } catch (err:any) {

      console.error("通信エラー:", err);
      setErrors(err.message);
      
    } finally { //エラーが発生してもしなくても必ず最後に実行される処理
      setLoading(false);//読み込み中を消す
    }
  };

  if(loading){
    return <p>読み込み中...</p>
  };

  return(
    <form
      onSubmit={handleSubmit}
      className="flex  w-full mt-8 mx-8">

      <div className="container flex flex-col w-full">
        <p className="text-2xl font-bold ">新規作成</p>

        <PostForm
          formData={formData}
          errors={errors}
          isOpen={isOpen}
          handleForm={handleForm}
          handleImageChange={handleImageChange}
          setThumbnailImageKey={setThumbnailImageKey}
          setIsOpen={setIsOpen}
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