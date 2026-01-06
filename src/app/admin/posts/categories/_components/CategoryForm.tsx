//カテゴリー新規作成と編集（子）

import React from "react";
import CreateButton from "../../_components/CreateButton";
import DeleteButton from "../../_components/DeleteButton";
import { useForm, UseFormRegisterReturn, UseFormWatch } from "react-hook-form";
import { PostCategoryData } from "@_types/postcategorydata";
import { PostFormData } from "@_types/post";


//親から受け取るデータと関数の型を定義
interface Props {
  register: UseFormRegisterReturn<"name">;
  error? : string
  isSubmitting: boolean
  watch: UseFormWatch<PostCategoryData>;
  mode?: "create" | "edit"; //コードを指定（デフォルトはcreate)
  handleDelete? : (id:number)=> void; //削除用
  loading : boolean;
}


const CategoryForm:React.FC<Props>=({
  register,error,isSubmitting,watch,mode,handleDelete,loading
})=>{


  return(
    <div className="space-y-4">
      <div>
        <label className="mt-4">
          カテゴリー名
        </label>

        <input 
          type = "text"
          {...register}
          disabled={loading}
          className="border w-full h-8 p-2"
        />
              
        {error && <p className="text-red-500">{error}</p>}



      
        <CreateButton 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
          ? (mode === "create" ? "作成中..." : "更新中...")
          : (mode === "create" ? "作成" : "更新")}

        </CreateButton>

        {mode !== "create" && (
        <DeleteButton
          type="button"
          onClick={()=>handleDelete?.(Number(watch("id")))}//「もし handleDelete が 存在する（＝undefinedじゃない） なら呼び出す。もし存在しないなら 何もしない（スルーする）」
        >
        削除
        </DeleteButton>
        )}

      </div>

    </div>

  )
    
};

export default CategoryForm;