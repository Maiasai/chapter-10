//ログイン画面

"use client";
import { useRouter } from 'next/navigation'
import { supabase } from '../../utils/supabase';
import Link from 'next/link';
import { useForm } from 'react-hook-form';


interface loginData {
  email : string;
  password : string;
}

const login = () => {
  const {register,handleSubmit,formState:{errors}}=useForm<loginData>();

  const router = useRouter()

  const onSubmit = async (data:loginData )=> {

    const { email,password } = data;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert("ログインに失敗しました")

    }else{
      router.replace("/admin/posts")//成功であれば /admin/posts に遷移
    }
    }
  

  

  return(
    <div className = "flex min-h-screen items-center justify-center" >
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="space-y-4 w-full max-w-[400px]"
      >

        <div 
          className = "flex flex-col w-full max-w-md"
        >
        <label
        htmlFor="email"
          className = "" >
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
          className = "border rounded-lg w-full h-10 mt-2 pl-4" 
          placeholder="name@company.com"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}   

        <label
          htmlFor="password"
          className = "mt-6">
            パスワード
        </label>  

        <input 
          type="password"
          id="password"
          {...register("password",{
            required:"パスワードは必須です",
          })}
          className = "border rounded-lg w-full h-10 mt-2 pl-4" 
          placeholder="••••••••"
        />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          <div>
            <button 
              type="submit"
              className = "border rounded-lg w-full h-10 mt-6 bg-blue-600 text-white">
                ログイン
            </button>

            <Link 
              href="/signup"
              type="submit"
              className = "flex items-center justify-center w-full h-10 mt-6 underline ">
                新規会員登録はこちら
            </Link>

          </div>
        </div>
      </form>
    </div>
  )
}

export default login; 