"use client";

import React from 'react';
import { useState } from 'react';
import ErrorMessage from './_components/ErrorMessage';
import FormGroup from './_components/FormGroup';
import Textinput from './_components/TextInput';


type FormData = {
  name: string;
  email: string;
  message: string;
}


type NewErrors = {
  name?: string;
  email?: string;
  message?: string;

}

const Contact: React.FC = () => {
  const [text, setText] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState<NewErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleForm = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
    const { name, value } = e.target;

    //ここの処理でvalue={text.name} などの入力欄の値が更新されて表示される
    setText(prev => ({
      ...prev,
      [name]: value
    }));

    // 入力した項目のエラーはリセットする
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  //クリア押した時に入力欄を空にするコード
  const handleClear = () => {
    setText({name: '',email: '',message: ''});
  };




  //バリデ
  const validateForm  = (text : FormData ):NewErrors => {
    const newErrors: NewErrors = {};

    if (!text.name?.trim()) {
      newErrors.name = 'お名前は必須です';

    } else if (text.name.length > 30) {
      newErrors.name = 'お名前は30文字以内で入力してください';
    }

    if (!text.email.trim()) {
      newErrors.email = 'メールアドレスは必須です';

    } else if (!/\S+@\S+\.\S+/.test(text.email)) {
      newErrors.email = '正しいメールアドレスを入力してください';
    }

    if (!text.message.trim()) {
      newErrors.message = '本文は必須です';

    } else if (text.message.length > 500) {
      newErrors.message = '本文は500文字以内で入力してください';
    }

    return newErrors;

  };

  
  const handleSubmit = async (e:React.FormEvent< HTMLFormElement >):Promise<void> => {
    e.preventDefault();  //ページリロード防止
    setIsLoading(true);  //ボタンを無効化したりローディング表示

    const isValid : NewErrors = validateForm(text); //validateFormでtextの内容をチェック＞エラーがあれば Errors オブジェクトを返す

    //もしもエラ＝があるなら、setErrosに渡してReactの状態にセット、ここでエラー表示をする。
    if (Object.keys(isValid).length > 0) {
      setErrors(isValid); // ← 必ずここでまとめてセット
      setIsLoading(false);//送信中処理
      return;
    }

    //エラーなければ下記でfetchAPIで送信処理
    if (!isValid) return;
      try {
        const responce = await fetch(
          "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(text), //入力したデータjsonにして送る
          }
        );

        // 成功時の処理
        //フォーム初期化してもOK
        alert("送信しました");   
        handleClear(); // 成功時のみクリア
    
      } catch(err) {

        alert("送信に失敗しました");

      } finally {
        setIsLoading(false); // ローディング解除。成功・失敗関係なく再び有効にする
      }
  };

  return (
    <div className='max-w-3xl mx-auto px-4 my-10 font-light'>
      <h1 className='font-black mb-10 text-xl'>問い合わせフォーム</h1>

      <form onSubmit={handleSubmit}>
        <ul>
          <FormGroup>
            <p className='w-1/4'>お名前</p>

            <div className='w-3/4'>
              <Textinput
                type="text"
                name="name"
                disabled={isLoading}
                value={text.name}
                onChange={handleForm}
              />

              <ErrorMessage message={errors.name} />
            </div>
          </FormGroup>

          <FormGroup>
            <p className='w-1/4'>メールアドレス</p>

            <div className='w-3/4'>
              <Textinput
                type="text"
                name="email"
                disabled={isLoading}
                value={text.email}
                onChange={handleForm}
              />

              <ErrorMessage message={errors.email} />
            </div>
          </FormGroup>

          <FormGroup>
            <p className='w-1/4'>本文</p>

            <div className='w-3/4 h-[226px]'>
              <Textinput
                name="message"
                disabled={isLoading}
                value={text.message}
                onChange={handleForm}
              />

              <ErrorMessage message={errors.message} />
            </div>
          </FormGroup>
        </ul>

        <div className='flex justify-center h-10'>
          <button
            className='whitespace-nowrap w-[64px] h-full mt-8 mr-4 py-2 px-4 border bg-black text-white  rounded-lg'
            type="submit"
            disabled={isLoading}
          >
            送信
          </button>

          <input
            className='w-[80px] h-full mt-8  bg-gray-200 text-blackrounded-lg'
            type="reset"
            value="クリア"
            onClick={handleClear}
          />
        </div>
      </form>
    </div>
  );
};


export default Contact;