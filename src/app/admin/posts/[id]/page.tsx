//管理画面　記事新編集/削除
"use client";

import PostForm from '../_components/PostForm';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import handleImageChange from '../_components/handleImageChange';
import useSupacaseSession from '../hooks/useSupabaseSession';
import useToggleCategory from '../hooks/toggleCategory';
import ValidateForm from '../_components/validateForm';

interface PostFormData {
    title : string
    content : string
    categories : {id:number; name:string}[]
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

//記事のidから取得
const Edit: React.FC = () => {
  const {id} = useParams(); //URL記事のID

  const [isOpen,setIsOpen]=useState<boolean>(false);//カテゴリ選択欄（プルダウン開閉箇所）
  const [loading,setLoading]=useState<boolean>(false);
  const [errors, setErrors] = useState<PostFormErrors>({});
  const [selectedCategories,setSelectedCategories] = useState<Category[]>([]);
  const [categories,setCategories] = useState<Category[]>([]);
  const [thumbnailImageKey, setThumbnailImageKey] = useState<PostFormData>("");
  const {token} = useSupacaseSession()
  const [formData,setFormData]=useState<PostFormData>({ //一瞬空欄で描画→そのあとサーバーから記事データを取ってきて上書き 
    title: "",
    content: "",
    categories: [],
    thumbnailImageKey: undefined,
  });

  const { toggleCategory } = useToggleCategory(setFormData,setSelectedCategories);
  const { validateForm } = ValidateForm();

  //APIを叩いてフォームの初期値を設定
  useEffect(()=>{
    const fetchPost = async () => {
    setLoading(true);
    
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

      
    if(data.post){

      console.log("取得データ＞カテゴリ内容", data.post.postCategories.map(c=>({id:c.category.id,
        name: c.category.name}))) 

    // フォームに初期値を反映
    setFormData({ //ここでフォームに取得した記事内容を反映する(入力欄用)
      title: data.post.title|| "",
      content: data.post.content|| "",
      thumbnailImageKey: data.post.thumbnailImageKey|| "",
      categories: data.post.postCategories.map( c => ({
        id: Number(c.category.id),
        name: c.category.name
      })),// // (例) → [{id:10, name:"カテゴリ"}, {id:11, name:"別のカテゴリ"}]
    })};
    
    setSelectedCategories( //選択状態表示用（ここでも表示しないと選択済みのカテゴリは表示できない！）
      data.post.postCategories.map( c => ({
        id: Number(c.category.id),
        name: c.category.name,
      }))
    );

  } catch (err:any) {

    setErrors(err.message)


  } finally {
    setLoading(false);
  }
  };
    fetchPost();
  },[id,token]);

 
  //カテゴリをAPIから取得

  useEffect(()=>{
    if(!id || !token )return; //idがない場合は何もしない
    const fetchCategories = async() => {
    setLoading(true);

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

        setErrors(err.message);

      } finally{

        setLoading(false);

      }
    }
   fetchCategories();
  },[id,token]);//[]内（第二引数）が変化した場合、再度APIを呼ぶ


  // categories の更新後を監視
  useEffect(() => {
    console.log("categories 更新後:", categories);
  }, [categories]);


  const handleForm = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
    setFormData({...formData,  // 既存データを保持
      [e.target.name]:e.target.value
    }) // name に対応する項目を更新
  }

//更新のAPI
const handleSubmit = async(e:React.FormEvent) => {
  setLoading(true);
  e.preventDefault();
  const isValid:PostFormErrors = validateForm(formData);

  if(Object.keys(isValid).length>0){
    setErrors(isValid);
    setLoading(false);
    return;
  }

  setErrors({});

  try{
    // ここで payload を作る
    const payload = {
      title: formData.title,
      content: formData.content,
      thumbnailImageKey: formData.thumbnailImageKey,
      categories: formData.categories.map(c => ({ id : c.id })), // ←idだけ送ればサーバー側でそのidに紐づくカテゴリ名はDBから取得できる
    };


    const res = await fetch(`/api/admin/posts/${id}`,{
      method : "PUT",
      headers : {
        'Content-Type' : 'application/json',
        Authorization : token,
      },
      body : JSON.stringify(payload),//avaScript のオブジェクトや配列を JSON 文字列に変換する関数
    });

    if(!res.ok){
      const text = await res.text();//レスポンスボディをテキストとして読み取る。サーバーが JSON で返しているか不明なときに安全に中身を取る方法。
      throw new Error (`HTTP ${res.status}-${text}`)
    }
    
    setIsOpen(false); //プルダウンも閉じる
    alert("記事を更新しました！");

  } catch (err) {

    setErrors(err.message);
    
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
    });

  
  if(!res.ok){
    const text = await res.text();
    console.error("削除エラー:",res.status, text);
    throw new Error (`HTTP${res.status}-${text}`)
  }

    alert("記事を削除しました！");
    window.location.href = "/admin/posts";// 削除後に一覧ページへ遷移

  }catch (err:any) {
    console.log("通信エラー:",err);
    setErrors(err.message);

  }finally{
    setLoading(false);
  }  
};

if(loading){
  return <p>読み込み中...</p>
}

return (

  <form 
    onSubmit={handleSubmit}
    className="flex  w-full mt-8 mx-8">

      <div className="container flex flex-col w-full">
        <p className="text-2xl font-bold ">記事編集</p>


        <PostForm
           formData={formData}
           errors={errors}
           isOpen={isOpen}
           handleForm={handleForm}
           handleImageChange={handleImageChange}
           setThumbnailImageKey={setThumbnailImageKey}
           setIsOpen={setIsOpen}
           categories={categories} //プルダウン用
           selectedCategories={selectedCategories} //選択状態用
           toggleCategory={toggleCategory}
           mode="edit"
           handleDelete={handleDelete}
           loading={loading}
         />
        
      </div>
    </form>

  );

};

export default Edit;