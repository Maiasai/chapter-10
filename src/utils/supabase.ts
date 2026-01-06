//Supabase初期設定のファイル
//.env.local に書いた環境変数を読み込んで、supabase クライアントを作る場所(.env.localにもURLとKEYを記載する必要あり)

import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)
