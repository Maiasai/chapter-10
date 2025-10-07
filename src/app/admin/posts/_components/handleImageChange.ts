//ユーザーが画像ファイルを選択したときに呼ばれるハンドラー。Supabase ストレージにアップロードして、そのファイルのキーを状態に保存するもの
import { supabase } from "../../../../utils/supabase"
import { v4 as uuidv4 } from 'uuid'  // 固有IDを生成するライブラリ


interface HandleImageChangeProps {
  event: ChangeEvent<HTMLInputElement>;
  setThumbnailImageKey: React.Dispatch<React.SetStateAction<string>>;
  
}

//画像入力欄 (<input type="file">) の変更イベントを受け取る関数
const handleImageChange = async ({
  event,
  setThumbnailImageKey

 }: HandleImageChangeProps) : Promise<void> => {
    if (! event.target.files || event.target.files.length === 0 ) {
    // event.target.files が存在しないか、ファイル数が 0 の場合は return
      return;
    }
  

  const file = event.target.files[0]// ユーザーが選択した画像を取得（File オブジェクトになる）
  const uuid = uuidv4();
  const filePath = `private/${uuid}`;

  const { data,error } = await supabase.storage
    .from('post_thumbnail')//Supabaseの管理画面で作成したバケットの名前を指定
    .upload(filePath,file, { // ここで Supabase ストレージにファイルを保存
      cacheControl : '3600',//キャッシュの有効期限を秒単位で指定（これにより同じファイルを再取得するときの通信量を減らせる）
      upsert : false,// 同じファイル名がある場合は上書きしない
    })
    //結果：data にファイル情報、error にエラー情報が返る

    // アップロードに失敗したらエラーを表示して終了
    if (error) {
      alert(error.message)
      return
    }

    // data.pathに、画像固有のkeyが入っているので、thumbnailImageKeyに格納する

    console.log("アップロード後のpath:", data.path)
    setThumbnailImageKey(data.path) // ← key 更新のみ
}


export default handleImageChange;