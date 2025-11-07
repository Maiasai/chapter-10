//登録ページの実装

'use client'

import { useForm } from 'react-hook-form';
import { supabase } from '../../utils/supabase' // 前の工程で作成したファイル


//型宣言
interface PageData  {
  email : string;
  password : string;
}


const Page = () =>  {
  const {register,handleSubmit,formState:{errors},reset} = useForm<PageData>();

  const onSubmit = async (data: PageData) => {

    const { email,password } = data;
    const { error } = await supabase.auth.signUp({ //ここでemailとpasswordを送信することで登録を行う
      email,
      password,
      options: {
        emailRedirectTo: `http://localhost:3000/login`,//送信するとメールアドレスの検証メールが送られ、そのメール内に載せる登録完了ページ用のURLを指定できる
      },
    })


    if (error) {
      alert('登録に失敗しました')

    } else {
      reset();
      alert('確認メールを送信しました。')
    }
  };

  return (
    <div className="flex justify-center pt-[240px]">
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="space-y-4 w-full max-w-[400px]"
      >
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              {...register("email",{
                required:"メールアドレスは必須です",
                pattern : {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message:"メールアドレスの形式が正しくありません"
                },
              })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="name@company.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}   
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              パスワード
            </label>
            <input
              type="password"
              id="password"
              {...register("password",{
                required:"パスワードは必須です",
                minLength : {value:8,message:"8文字以上で入力してください"},
              })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="••••••••"
            />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              登録
            </button>
          </div>
      </form>
    </div>
  )
}

export default Page;
