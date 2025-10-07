//管理者画面へのアクセス制限の実装（認可）
//このhookをimportしたコンポーネントでは、コンポーネントの初回レンダリング時にこの処理が発火

import { useRouter } from "next/navigation"
import useSupacaseSession from "./useSupabaseSession"
import { useEffect } from "react"


const useRouteGuard = () => {
  const router = useRouter()
  const { session } = useSupacaseSession() // sessionを取り出す

  useEffect(()=>{
    if (session === undefined) return //sessionがundefinedの場合は読み込み中なので何もしない
      
    const fetcher = async () => {
      if (session === null ) { // session がnullの場合（未ログイン）はログインページに遷移するようにする
        router.replace('/login')
      }
    }

    fetcher()
      
  },[router,session])

}

export default useRouteGuard;