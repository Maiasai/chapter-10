
//カテゴリを複数選択できるようにするカスタムフック


interface Category {
    id: number;
    name: string;
  }
  
  interface FormData {
    title: string;
    content: string;
    categories: Category[];
    thumbnailImageKey?: string;
  }

const useToggleCategory = (
  setFormData:React.Dispatch<React.SetStateAction<FormData>>,
  setSelectedCategories:React.Dispatch<React.SetStateAction<Category[]>>) => {
  
  const toggleCategory = (cat : Category) => {

    setSelectedCategories ( prev => {

      const exists = prev.some(c => Number(c.id) === Number(cat.id)); //条件を満たす要素が一つでもあればtrue
      let newSelected: Category[];

    //過去に選んだカテゴリの中に、今回クリックしたカテゴリがあるか確認。→であれば削除
    if(exists){
      newSelected = prev.filter ( c => Number(c.id)  !== Number(cat.id));//ここで同じidを持つものを取り除く

    } else {
    //選択されていなければ追加
    newSelected = [...prev,{id:Number(cat.id) ,name:cat.name}];

    }

    setFormData(prevForm => ({ //「記事送信フォームに使うデータ」にも反映。
    ...prevForm,
    categories: newSelected.map(c => ({ id: Number(c.id), name: c.name}))


    }));

      return newSelected;//最終的に更新した配列を返す
      
    });
  }
      
  return { toggleCategory};
  
};

  export default useToggleCategory;

//setFormData をカスタムフックに渡すと、カスタムフックは親コンポーネントの状態を直接更新できるため。setFormDataは親に渡す記載はなくてOK