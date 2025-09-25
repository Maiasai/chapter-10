//カテゴリー新規作成と編集（子）

import React from "react";
import CreateButton from "../../_components/CreateButton";
import DeleteButton from "../../_components/DeleteButton";

//親から受け取るデータと関数の型を定義
interface Props {
  value : string;
  error : PostCategoryError;
  onChange : (e: React.ChangeEvent<HTMLInputElement>) => void;
  mode?: "create" | "edit"; //コードを指定（デフォルトはcreate)
  handleDelete? : (id:number)=> void; //削除用
  loading : boolean;
}


const CategoryForm:React.FC<Props>=({value,error,onChange,mode,handleDelete,loading})=>{

//子はUIの描画を描くだけ。処理は親に任せている。子側では入力欄に関するvalueとonChangeは必要
  return(
    <div className="space-y-4">
    <div>
      <label className="mt-4">
        カテゴリー名
      </label>

      <input 
        type = "text"
        name = "category"
        value = {value} //inputは文字列で使う
        onChange = {onChange}
        disabled={loading}
        className="border w-full h-8 p-2"
      />
            
      {error.name && <p className="text-red-500">{error.name}</p>}




      <CreateButton 
        type="submit"
        disabled={loading}
      >
        {mode === "create" ? "作成" : "更新"}

      </CreateButton>

      <DeleteButton
        type="button"
        onClick={()=>handleDelete(value.id)}// ここで記事IDを渡す
        disabled={loading}
      >
        削除
      </DeleteButton>

    </div>

    </div>

  )
    
};

export default CategoryForm;