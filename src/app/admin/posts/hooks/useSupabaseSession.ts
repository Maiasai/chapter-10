//現在のログイン状態をチェックして、ヘッダーの内容の出し分け
//ログイン状態をチェックするために作成するカスタムhook

import { supabase } from "../../../../utils/supabase"
import { Session } from "@supabase/supabase-js" //Supabase が提供している「認証セッションの型」
import { useEffect, useState } from "react"


const useSupacaseSession = ()=>{
  const [session,setSession] = useState<Session | null | undefined > (undefined)
  const [token,setToken] = useState <string| null>(null)
  const [isLoading,setIsLoading] = useState (true)

  useEffect(()=>{
    const fetcher = async () =>{
      const {
        data : {session},
      } = await supabase.auth.getSession()//現在ログイン中かどうかのチェックが可能（ログイン中だったらログインユーザーの情報がオブジェクトで取得、未ログインはnullが返却
      setSession(session)
      setToken(session?.access_token || null) //「もし session が null または undefined なら安全に undefined を返す.session が存在すれば session.access_token を返す
      
      setIsLoading(false)
    }
    
    fetcher()

  },[])

    return {session,isLoading,token}

    }

  export default useSupacaseSession;