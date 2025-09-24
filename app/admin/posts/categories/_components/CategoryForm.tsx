//カテゴリー新規作成UIのみ（子）

import React from "react";

//親から受け取るデータと関数の型を定義
interface Props {
  value : string;
  onChange : (e: React.ChangeEvent<HTMLInputElement>) => void;
}


const CategoryForm:React.FC<Props>=({value,onChange})=>{

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
        className="border w-full h-8 p-2"
      />
    </div>

    </div>

  )
    
};

export default CategoryForm;