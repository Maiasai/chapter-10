//カテゴリを複数選択できるようにするカスタムフック

import { Category } from "@prisma/client";
import { UseFormSetValue } from "react-hook-form";

  

interface UseCategoryProps {
  setValue:UseFormSetValue<{ categories: Category[] }>;
  selectedCategories: Category[];
}

const useToggleCategory = (
  setValue,
  selectedCategories
) => {

  const toggleCategory = (cat : Category) => { //catはクリックされたカテゴリオブジェクト
    const prev = selectedCategories(); //現在選択されているカテゴリの配列を取得
    const exists = prev.some( c=> c.id === cat.id);//配列内に同じidを持つカテゴリがあるかを判定

    const newSelected = exists 
      ? prev.filter( c => c.id !== cat.id )//← 同じidは除外して削除
      :[...prev,{id:cat.id,name:cat.name}]; //そうでない場合　→　配列に追加 (...prev)

    setValue("categories",newSelected)//useForm の setValue を使って、フォームの categories を更新。
  }
      
  return { toggleCategory };
  
};

export default useToggleCategory;
//setFormData をカスタムフックに渡すと、カスタムフックは親コンポーネントの状態を直接更新できるため。setFormDataは親に渡す記載はなくてOK