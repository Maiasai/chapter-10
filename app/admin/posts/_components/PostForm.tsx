//記事新規作成と編集に渡す用(見た目と入力操作)

import React from "react";


//親から受け取るデータと関数の型を定義
interface Props {
  formData : PostFormData;
  errors : PostFormErrors;
  isOpen : boolean;
  setIsOpen : React.Dispatch<React.SetStateAction<boolean>>;
  handleForm :  (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  categories : Category[];
  selectedCategories : Category[];
  toggleCategory : (cat: Category) => void;
}


const PostForm:React.FC<Props> = ({
  formData,errors,isOpen,setIsOpen,handleForm,handleSubmit,categories,selectedCategories,toggleCategory}) => {


    return(
      <div>
        <p className="mt-4">タイトル</p>
        <input className="border h-10 p-2 rounded-lg w-full"
          type="text"
          name = "title"
          value={formData.title}//formDataから反映
          onChange={handleForm}
          />
        {errors.title && <p className="text-red-500">{errors.title}</p>}

        <p className="mt-4">内容</p>
        <textarea className="border h-20 p-2 rounded-lg w-full"
          name = "content"
          value = {formData.content}
          onChange={handleForm}/>
        {errors.content && <p className="text-red-500">{errors.content}</p>}


        <p className="mt-4">サムネイルURL</p>
        <input  className="border h-10 p-2 rounded-lg w-full"
          type = "text"
          name = "thumbnailUrl"
          value={formData.thumbnailUrl}
          onChange={handleForm}/>
        {errors.thumbnailUrl && <p className="text-red-500">{errors.thumbnailUrl}</p>}

        {/* カテゴリー */}
        <p className="mt-4">カテゴリー</p>

        
        <div //プルダウンの見た目。押下することでプルダウン開閉ができる
          className="flex flex-wrap items-center border min-h-[40px] rounded-lg cursor-pointer  gap-1 px-2 p-2"
          onClick={() => setIsOpen(prev => !prev)}
          >
        
          {selectedCategories.length === 0 ? ( //未選択の場合のプレースホルダー

          
          <span className="text-gray-400">カテゴリを選択</span>
          ) : (
            selectedCategories.map(cat => ( //ここで選択されたカテゴリをバッジとして描画

          <span
            key={cat.id}
            className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-sm flex items-center gap-1"
            onClick={(e) => {
              e.stopPropagation(); // プルダウンの開閉を阻止(親に伝わらないようにする命令)
              toggleCategory({ id: Number(cat.id), name: cat.name });  // クリックで解除
            }}
            >
            {cat.name} ×
          </span>
            ))
          )}
          <svg
            className={`w-4 h-4 ml-auto self-center transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}//条件 ? 真のとき : 偽のとき(ここでは isOpen が条件)
            viewBox="0 0 24 24"
            >
                
            <path d="M7 10l5 5 5-5z" /> {/* →ここで矢印を作成 */}
          </svg>
        </div>

        {isOpen && ( //isOpenがtrueの場合のみ以下を実行
        <div className="absolute z-10 bg-white border rounded-lg mt-2 max-h-40 overflow-y-auto w-full">
          {categories.map(allcat => (
            <div
              key={allcat.id}
              className="px-2 py-1 hover:bg-gray-100 cursor-pointer" //当てた箇所に色をつける
              onClick={() => toggleCategory({ id: Number(allcat.id), name: allcat.name })} //クリックされたら親の関数を実行、カテゴリを追加・削除する
            >
              {allcat.name}
            </div>
          ))}
        </div>
        )}

        {errors.categories && <p className="text-red-500">{errors.categories}</p>}
            
        
      </div>

    )

};

export default PostForm;