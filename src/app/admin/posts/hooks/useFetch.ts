'use client'

import useSWR from 'swr'

// 認証付き fetcher
const fetcherWithToken = async (url: string, token: string): Promise<T>=> {//urlは呼び出し元（useFetch）から渡される APIのエンドポイント　例：'/api/admin/posts'
  if (!token) throw new Error('No token found')// 未ログイン扱い

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`HTTP ${res.status} - ${text}`)
  }
  return res.json();// ここでAPIから返ってきたレスポンスデータをjson化
}

// カスタムフック
export const useFetch = <T>(url: string | null, token?: string) => {
    const shouldFetch = Boolean(url && token);//ここで「URL と token が両方あるか」をチェック。
    const { data, error, isLoading, mutate } = useSWR<T>(
      shouldFetch ? [url, token] : null,//両方揃った時だけ発動！
      ([url, token]) => fetcherWithToken<T>(url, token!)//両方揃っているならfetcherWithToken が呼ばれAPIを叩く！ url と token は配列 [url, token] から分解されて、(url, token!)に渡される
    )
  
    return { data, error, isLoading, mutate }
}

export default fetcherWithToken;