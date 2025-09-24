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

  const [Loading,setLoading] = useState<boolean>(true);
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
      setErrors(err.message);  
 
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

  const [errors,setErrors] = useState<PostCategoryErrors>({});

  //バリデ
  const validateForm = (formData) => {
    const errors = {};

  if(!formData.name.trim()){
    errors.name = "カテゴリー名は必須です"
  }  

  setLoading(false);
  return errors;
  }

  //更新のAPI
  const handleSubmit = async(e:React.FormEvent)=>{
    e.preventDefault();
    const isValid:PostCategoryErrors = validateForm(formData);

    if(Object.keys(isValid).length>0){
      setErrors(isValid);
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
        setErrors(err.message);
        
    } finally {
        setLoading(false);
    }
   };

   if(Loading){
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
    setErrors(err.message);
   } finally{
    setLoading(false);
   }
   }

   if(Loading) return <p>読み込み中...</p>;
   

return(
  <form
    onSubmit = {handleSubmit}>
    <div>
      <h1>カテゴリー更新</h1>

      <CategoryForm   
        name= "name"
        value={formData.name}
        onChange={handleForm}
      >

      </CategoryForm>
      {errors.name && <p className="text-red-500">{errors.name}</p>}


      <CreateButton
        type="submit"
        disabled={Loading}
      >
        更新
      </CreateButton>

      <DeleteButton
        type="submit"
        onClick={()=>handleDelete(formData.id)}// ここで記事IDを渡す
        disabled={Loading}
      >
        削除
      </DeleteButton>

    </div>
  </form>

)

};
    



export default categoriesEdit;
