//管理画面　記事新規作成
"use client";

import React, { useEffect, useState } from 'react';
import PostForm from '../_components/PostForm';
import CreateButton from '../_components/CreateButton';


interface PostFormData {
  title : string
  content : string
  categories : {id:number}[]
  thumbnailUrl : string
}

interface PostFormErrors {
  title? : string
  content? : string
  categories? : string
  thumbnailUrl? : string 
}

interface Category {
  id: number;
  name: string;
}

const New = () => {
  
  const [isOpen,setIsOpen]=useState<boolean>(false);//カテゴリ選択欄（プルダウン開閉箇所）
  const [loading,setLoading]=useState<boolean>(false);
  const [errors, setErrors] = useState<PostFormErrors>({});

  //カテゴリをAPIから取得
  const[categories,setCategories] = useState<Category[]>([]);
    
    useEffect(()=>{
      const fetchCategories = async() => {
      try{
        const res = await fetch("/api/admin/categories");
      

      if(!res.ok){
        const text = await res.text();
        throw new Error (`HTTP ${res.status}-${text}`)
      }

        const data = await res.json();
        console.log("カテゴリAPIの返り値:", data);
        setCategories(data.posts);

      }catch(err){
        setErrors(err.message);
      }
      }
        fetchCategories();
  },[]);
  
  const [formData,setFormData] = useState<PostFormData>({
    title : "",
    content : "",
    categories : [],
    thumbnailUrl : "",
  });


  //カテゴリを複数選択できるようにする
  //選択週のカテゴリを管理
  const [selectedCategories,setSelectedCategories] = useState<Category[]>([]);

  const toggleCategory = (cat : Category) => {
    setSelectedCategories ( prev => {
      let newSelected : Category[];

      //過去に選んだカテゴリの中に、今回クリックしたカテゴリがあるか確認。→であれば削除
      if(prev.find(c => c.id === cat.id)){
        newSelected = prev.filter(c => c.id !== cat.id); //ここで同じidを持つものを取り除く
      } else {
      //選択されていなければ追加
      newSelected = [...prev,cat];
    }
    
    setFormData(prevForm => ({ //「記事送信フォームに使うデータ」にも反映。
      ...prevForm,
      categories : newSelected.map(c => ({ id: c.id })) // {id:number} の形に
      }));

    setLoading(false); // return の前に必ず実行！
    return newSelected; //最終的に更新した配列を返す
   });
  };



  //バリデ
  const validateForm = (data:PostFormData): PostFormErrors => {
    const errors : PostFormErrors = {};
  
    if(!data.title.trim()){
      errors.title = "タイトルは必須です"
    }
    if(!data.content.trim()){
      errors.content = "内容は必須です"
    }
   if(!data.thumbnailUrl.trim()){
      errors.thumbnailUrl = "画像は必須です"
   }
   if(data.categories.length === 0){
      errors.categories = "カテゴリを選択してください"
   }
   setLoading(false); // return の前に必ず実行！
   return errors;
  }


  const handleForm = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
    setFormData({...formData,  // 既存データを保持
      [e.target.name]:e.target.value}) // name に対応する項目を更新
  }


  //新規作成のAPI
  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    
    const isValid:PostFormErrors = validateForm(formData);
    
    if(Object.keys(isValid).length>0){ //Object.keys(isValid); は、そのオブジェクトのキーだけの配列を返す["title", "content"]
      setErrors(isValid);
      setLoading(false);
      return;
    }

    setLoading(true);
  
  if(!isValid)return;
    try {//ここで書いた処理を実行してエラーだったらcatchに飛ばす
      const res = await fetch("/api/admin/posts", {  
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) { //fetchのレスポンスオブジェクトが持ってるプロパティ（HTTPステータスコードが200-299の時trueになる
        const text = await res.text();
        throw new Error (`HTTP ${res.status}-${text}`)
      }

      const data : PostFormData  = await res.json();
      console.log("作成成功:", data);

      // 投稿後にフォームをリセット
      setFormData({
        title: "",
        content: "",
        categories: [],
        thumbnailUrl: "",
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