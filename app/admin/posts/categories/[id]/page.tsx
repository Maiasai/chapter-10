//管理者カテゴリ編集/削除
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CreateButton from "../../_components/CreateButton";
import CategoryForm from "../_components/CategoryForm";
import DeleteButton from "../../_components/DeleteButton";

//型宣言
interface PostCategoryData  {
  name : string
}  


interface PostCategoryErrors {
  name? :string
}

interface Catgory {
  id : number;
  name : string;
}

//カテゴリのidから取得
const categoriesEdit : React.FC = ()=>{
  const {id} = useParams<{ id: string }>();
  console.log(id);

  const [loading,setLoading] = useState<boolean>(true);
  const [formData,setFormData] = useState<PostCategoryData>({
    name:"",
  })

  //API叩いてフォームの初期値を設定
  useEffect(()=>{
    const fetchCategory = async() => {
    try{
      const res = await fetch(`/api/admin/categories/${id}`);


    if(!res.ok){
      const text = await res.text();
      throw new Error (`HTTP ${res.status}-${text}`)
    }

      const data = await res.json();
      console.log("取得データ post:", data);

      if(data.post){
        setFormData({name:data.post.name});  
        
        setLoading(false);
      }
    } catch(err){
      setLoading(false);
      setError(err.message);  
 
    } finally {
      setLoading(false);
    }

    };
      fetchCategory();
    },[id]);
  
  const handleForm = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
    setFormData(prev => ({
      ...prev,
      name:e.target.value,
    })
    );
  }

  const [error,setError] = useState<PostCategoryErrors>({});

  //バリデ
  const validateForm = (formData) => {
    const error = {};

  if(!formData.name.trim()){
    error.name = "カテゴリー名は必須です"
  }  

  setLoading(false);
  return error;
  }

  //更新のAPI
  const handleSubmit = async(e:React.FormEvent)=>{
    e.preventDefault();
    const isValid:PostCategoryErrors = validateForm(formData);

    if(Object.keys(isValid).length>0){
      setError(isValid);
      setLoading(false);
      return;
    }

    try{
      const catdata = {
        name : formData.name
      }

      console.log("入力フォームデータ",catdata);
      
      const res = await fetch(`/api/admin/categories/${id}`,{
        method : "PUT",
        headers : {
          "Content-Type" : "application/json",       
        },
        body : JSON.stringify(catdata),
    })

    if(!res.ok){
        const text = await res.text();//レスポンスボディをテキストとして読み取る。サーバーが JSON で返しているか不明なときに安全に中身を取る方法。
        console.error("サーバーエラー:",res.status,text);

        throw new Error (`HTTP ${res.status}-${text}`)
      }

      alert("カテゴリー名を更新しました！");

    } catch (err) {
        setError(err.message);
        
    } finally {
        setLoading(false);
    }
   };

   if(loading){
    return <p>読み込み中....</p>
   };
   
   //削除API
   const handleDelete = async (postId:number)=>{
    if (!confirm("本当に削除しますか？")) return;

    try{
      const res = await fetch(`/api/admin/categories/${id}`,{
        method : "DELETE",
      });
  
      console.log("削除レスポンス",res);
    
    if(!res.ok){
      const text = await res.text();
      console.error("削除エラー:",res.status, text);
      throw new Error (`HTTP ${res.status}-${text}`)
    }
  
      alert("カテゴリーを削除しました！");
      window.location.href = "/admin/posts/categories";// 削除後に一覧ページへ遷移
    
    }catch (err) {
      setError(err.message);
   } finally{
      setLoading(false);
   }
   }

   if(loading) return <p>読み込み中...</p>;


return(
  <form
    onSubmit = {handleSubmit}>
    <div>
      <h1>カテゴリー更新</h1>

      <CategoryForm   
        name= "name"
        value={formData.name}
        onChange={handleForm}
        mode="edit"
        handleDelete={handleDelete}
        loading={loading}
        error={error}
      >

      </CategoryForm>


    </div>
  </form>

)

};
    



export default categoriesEdit;
