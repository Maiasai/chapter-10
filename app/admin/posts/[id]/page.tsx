//管理画面　記事新編集/削除
"use client";

import PostForm from '../_components/PostForm';
import CreateButton from '../_components/CreateButton';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DeleteButton from '../_components/DeleteButton';


interface PostFormData {
    title : string
    content : string
    categories : {id:number; name:string}[]
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

//記事のidから取得
const Edit: React.FC = () => {
  const {id} = useParams(); //URL記事のID

  const [loading,setLoading] = useState<boolean>(true);
  const [categories,setCategories] = useState<Category[]>([]);
  const [formData,setFormData]=useState<PostFormData>({ //一瞬空欄で描画→そのあとサーバーから記事データを取ってきて上書き 
    title: "",
    content: "",
    categories: [],
    thumbnailUrl: ""
  });


  //APIを叩いてフォームの初期値を設定
  useEffect(()=>{
    const fetchPost = async () => {
    try{
      if(!id)return
      console.log("fetch前 id=", id);
      const res = await fetch(`/api/admin/posts/${id}`);

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
      thumbnailUrl: data.post.thumbnailUrl|| "",
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

    setLoading(false);

  } catch (err:any) {

    setErrors(err.message)


  } finally {
    setIsLoading(false);
  }
  };
    fetchPost();
  },[id]);

 
  //カテゴリをAPIから取得

  useEffect(()=>{
    if(!id)return; //idがない場合は何もしない
    const fetchCategories = async() => {

    try{
      const res = await fetch("/api/admin/categories");


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
    }
    }
   fetchCategories();
  },[id]);//[]内（第二引数）が変化した場合、再度APIを呼ぶ


  // categories の更新後を監視
  useEffect(() => {
    console.log("categories 更新後:", categories);
  }, [categories]);


  //カテゴリを複数選択できるようにする
  //選択週のカテゴリを管理
  const [selectedCategories,setSelectedCategories] = useState<Category[]>([]);

  const toggleCategory = (cat : Category) => {
    setSelectedCategories ( prev => {
        console.log("前の選択状態 prev", prev);
        console.log("クリックしたカテゴリ cat", cat);

      const exists = prev.some(c => Number(c.id) === Number(cat.id)); //条件を満たす要素が一つでもあればtrue

      let newSelected: Category[];

    //過去に選んだカテゴリの中に、今回クリックしたカテゴリがあるか確認。→であれば削除
    if(exists){
      newSelected = prev.filter ( c => Number(c.id)  !== Number(cat.id));//ここで同じidを持つものを取り除く

    } else {
    //選択されていなければ追加
    newSelected = [...prev,{id:Number(cat.id) ,name:cat.name}];

    }

    console.log("新しい選択状態:", newSelected);
    console.log("前formData.categories:", newSelected.map(c => ({id: c.id, name: c.name})));

    setFormData(prevForm => ({ //「記事送信フォームに使うデータ」にも反映。
    ...prevForm,
    categories: newSelected.map(c => ({ id: Number(c.id), name: c.name}))


    }));
    console.log("後formData.categories:", newSelected.map(c => ({id: c.id, name: c.name})));

      setIsLoading(false); // return の前に必ず実行！
      return newSelected;//最終的に更新した配列を返す
      
    });
  };



  const [isOpen,setIsOpen]=useState<boolean>(false);//カテゴリ選択欄（プルダウン開閉箇所）
  const [isLoading,setIsLoading]=useState<boolean>(false);
  const [errors, setErrors] = useState<PostFormErrors>({});

//バリデ
const validateForm = (formData:PostFormData) : PostFormErrors => {
  const errors : PostFormErrors = {};

  if(!formData.title.trim()){
    errors.title = "タイトルは必須です"
  }
  if(!formData.content.trim()){
    errors.content = "内容は必須です"
  }
  if(!formData.thumbnailUrl.trim()){
    errors.thumbnailUrl = "画像は必須です"
  }
  if(formData.categories.length === 0){
    errors.categories = "カテゴリを選択してください"
  }
  
  setIsLoading(false); // return の前に必ず実行！
  return errors;
}

  const handleForm = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
    setFormData({...formData,  // 既存データを保持
      [e.target.name]:e.target.value
    }) // name に対応する項目を更新
  }

//更新のAPI
const handleSubmit = async(e:React.FormEvent) => {
  e.preventDefault();
  const isValid:PostFormErrors = validateForm(formData);

  if(Object.keys(isValid).length>0){
  setErrors(isValid);
  setIsLoading(false);
  return;
  }

  setIsLoading(true);
  setSuccess(false);

if(!isValid)return;

  try{
    // ここで payload を作る
    const payload = {
      title: formData.title,
      content: formData.content,
      thumbnailUrl: formData.thumbnailUrl,
      categories: formData.categories.map(c => ({ id : c.id })), // ←idだけ送ればサーバー側でそのidに紐づくカテゴリ名はDBから取得できる
    };

    console.log("更新でAPI叩く時",payload)
    const res = await fetch(`/api/admin/posts/${id}`,{
      method : "PUT",
      headers : {
        "Content-Type" : "application/json",
      },
      body : JSON.stringify(payload),//avaScript のオブジェクトや配列を JSON 文字列に変換する関数
    });

  if(!res.ok){
    const text = await res.text();//レスポンスボディをテキストとして読み取る。サーバーが JSON で返しているか不明なときに安全に中身を取る方法。
    throw new Error (`HTTP ${res.status}-${text}`)
  }
  

  setIsOpen(false); //プルダウンも閉じる

  alert("記事を作成しました！");

} catch (err) {
  setErrors(err.message);
  
} finally {
  setIsLoading(false);
}
};

if(isLoading){
  return <p>読み込み中...</p>
};


//削除API
const handleDelete = async (postId:number)=> {
  if (!confirm("本当に削除しますか？")) return;

  try{
    const res = await fetch(`/api/admin/posts/${id}`,{
      method : "DELETE",
    });

    console.log("削除レスポンス",res);
  
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
    setIsLoading(false);
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
           setIsOpen={setIsOpen}
           categories={categories} //プルダウン用
           selectedCategories={selectedCategories} //選択状態用
           toggleCategory={toggleCategory}
         />
        
        <div className="flex">
          <CreateButton
            type="submit"
            disabled={isLoading}
            >
            更新
          </CreateButton>

          <DeleteButton
            type="submit"
            onClick={()=>handleDelete(formData.id)}// ここで記事IDを渡す
            disabled={isLoading}
          >
            削除
          </DeleteButton>
        </div>
      </div>
    </form>

  );

};

export default Edit;