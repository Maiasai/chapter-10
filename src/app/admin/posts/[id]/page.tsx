//管理画面　記事新編集/削除
"use client";

import PostForm from '../_components/PostForm';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import handleImageChange from '../_components/handleImageChange';
import useSupacaseSession from '../hooks/useSupabaseSession';
import useToggleCategory from '../hooks/toggleCategory';
import { useForm } from 'react-hook-form';
import { Category } from "@_types/category";
import { useFetch } from '../hooks/useFetch';


interface PostFormData {
    title : string
    content : string
    categories : {id:number; name:string}[]
    thumbnailImageKey : string
    thumbnailImageUrl : string;
    thumbnailImageName : string;
  }

  type PostResponse = {
    tatus: string;      // "OK" など
    post: PostFormData; // post が実際のデータ
  };


//記事のidから取得
const Edit: React.FC = () => {
  const {session, isLoading: sessionLoading} = useSupacaseSession();
  const {id} = useParams(); //URL記事のID

  const [isOpen,setIsOpen]=useState<boolean>(false);//カテゴリ選択欄（プルダウン開閉箇所）
  const [loading,setLoading]=useState<boolean>(false);
  const [categories,setCategories] = useState<Category[]>([]);

  //SWRの実行条件と呼び出し
  const { data, error, isLoading } = useFetch<PostResponse>(
    id ? `/api/admin/posts/${id}` : null
  );//shouldFetch?がtrueならAPIのURLを返す。falseならnullを返す

  console.log("data:", data);
  console.log("error:", error);
  console.log("isLoading:", isLoading);
  
  const {register,control,setValue,handleSubmit,watch,formState:{errors},reset} = useForm<PostFormData>(
    {defaultValues:{
      title: "",
      content: "",
      categories: [],
      thumbnailImageKey: "",
      thumbnailImageUrl: "",
      thumbnailImageName: "",
    }
  });
  // watchでプレビューを監視
  const thumbnailImageUrl = watch("thumbnailImageUrl")
  const thumbnailImageName = watch("thumbnailImageName")


  //カテゴリの選択動作　関連
  const selectedCategories = watch("categories");//現在のフォーム状態のcategoriesを常に監視

  const { toggleCategory } = useToggleCategory(
    setValue,
    ()=>selectedCategories);

  //APIを叩いてフォームの初期値を設定
  useEffect(()=>{
    const fetchPost = async () => {
    
    try{
      if(!id || !token)return
      const res = await fetch(`/api/admin/posts/${id}`,{
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

    if(data?.post){

      console.log("取得データ＞カテゴリ内容", data.post.postCategories.map(c=>({id:c.category.id,
        name: c.category.name}))
      ) 

    // フォームに初期値を反映
    reset({ //ここでフォームに取得した記事内容を反映する(入力欄用)
      title: data.post.title|| "",
      content: data.post.content|| "",
      thumbnailImageKey: data.post.thumbnailImageKey|| "",
      thumbnailImageUrl: data.post.thumbnailImageUrl || "",
      thumbnailImageName: data.post.thumbnailImageName || "",
      categories: 
        data.post.postCategories.map( c => ({
          id: Number(c.category.id),
          name: c.category.name
      })),// // (例) → [{id:10, name:"カテゴリ"}, {id:11, name:"別のカテゴリ"}]
    })};

  } catch (err:any) {
    console.error(err.message);
  } 
  };
    fetchPost();
  },[id]);

 
  //カテゴリをAPIから取得

  useEffect(()=>{
    if(!id)return; //idがない場合は何もしない
    const fetchCategories = async() => {
      try{
        const res = await fetch("/api/admin/categories",{
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
        
        setCategories(data.posts.map(allcat => ({
          id: Number(allcat.id),
          name: allcat.name,
        })));
    
      }catch(err:any){
        console.error(err.message);
      } 
    }
   fetchCategories();
  },[id]);

  // categories の更新後を監視
  useEffect(() => {
    console.log("categories 更新後:", categories);
  }, [categories]);


//更新のAPI
const onSubmit = async(data:PostFormData) => {
  setLoading(true);

  try{
    const payload = {
      ...data,
      categories: data.categories.map(c => ({ id: c.id })),
    };


    const res = await fetch(`/api/admin/posts/${id}`,{
      method : "PUT",
      headers : {
        'Content-Type' : 'application/json',
        Authorization : token,
      },
      body : JSON.stringify(payload),//javaScript のオブジェクトや配列を JSON 文字列に変換する関数
    });

    if(!res.ok){
      const text = await res.text();//レスポンスボディをテキストとして読み取る。サーバーが JSON で返しているか不明なときに安全に中身を取る方法。
      throw new Error (`HTTP ${res.status}-${text}`)
    }
    const result = await res.json();
    console.log("res",res)

    setIsOpen(false); //プルダウンも閉じる

    alert("記事を更新しました！");

    // 更新成功後：フォームを最新状態に更新
    reset({
      title: result.post.title,
      content: result.post.content,
      thumbnailImageKey: result.post.thumbnailImageKey,
      thumbnailImageUrl: result.post.thumbnailImageUrl,
      thumbnailImageName: result.post.thumbnailImageName,
      categories: result.post.postCategories.map((c: any) => ({
        id: c.category.id,
        name: c.category.name,
      })),
    });


  } catch (err) {

    console.error(err.message);
      
  } finally {
    setLoading(false);
  }
};

  if(loading){

    return <p>読み込み中...</p>
    
  };


//削除API
const handleDelete = async (postId:number)=> {
  if (!confirm("本当に削除しますか？")) return;
  setLoading(true);

  try{
    const res = await fetch(`/api/admin/posts/${id}`,{
      method : "DELETE",
      headers: {
        Authorization: token,
      }});

  
  if(!res.ok){
    const text = await res.text();
    console.error("削除エラー:",res.status, text);
    throw new Error (`HTTP${res.status}-${text}`)
  }


    alert("記事を削除しました！");
    window.location.href = "/admin/posts";// 削除後に一覧ページへ遷移

  }catch (err:any) {

    console.error(err.message);
      

  }finally{
    setLoading(false);
  }  
};

  if (isLoading) return <p>初期データ読み込み中...</p>;
  if (loading) return <p>処理中...</p>;
  if(error)return<p>エラーが発生しました</p>;
  if (!data?.post) return <p>データが見つかりませんでした</p>;

 
  console.log('API Response:', data)

return (

  <form 
    onSubmit={handleSubmit(onSubmit)}
    className="flex  w-full mt-8 mx-8">

      <div className="container flex flex-col w-full">
        <p className="text-2xl font-bold ">記事編集</p>


        <PostForm
          id={Number(id)} 
          setValue={setValue}
          register={register}
          watch={watch}
          control={control}
          errors={errors}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleImageChange={handleImageChange}
          categories={categories}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          mode="edit"
          handleDelete={handleDelete}
          loading={loading}
          thumbnailImageUrl={thumbnailImageUrl}      
          thumbnailImageName={thumbnailImageName}      
         />
        
      </div>
    </form>

  );

};

export default Edit;