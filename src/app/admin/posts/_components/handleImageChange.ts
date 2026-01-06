"use client";

//ユーザーが画像ファイルを選択したときに呼ばれるハンドラー。Supabase ストレージにアップロードして、そのファイルのキーを状態に保存するもの
import { useForm, UseFormSetValue } from "react-hook-form";
import { supabase } from "../../../../utils/supabase"
import { v4 as uuidv4 } from 'uuid'  // 固有IDを生成するライブラリ
import { PostFormData } from "@_types/post";
import { HandleImageChangeProps } from "@_types/form";


//画像入力欄 (<input type="file">) の変更イベントを受け取る関数
const handleImageChange = async ({
  event,//ファイル選択イベント (<input type="file"> が変化した時の情報)
  setValue
}: HandleImageChangeProps) : Promise<void> => {
  if (! event.target.files || event.target.files.length === 0 ) {
  // event.target.files が存在しないか、ファイル数が 0 の場合は return（誤クリックやキャンセル時の防止処理）
    return;
  }
  

  let file = event.target.files[0]// ユーザーが選択した画像を取得（File オブジェクトになる）
  console.log("ファイル",file)
  const uuid = uuidv4();//ランダムな一意のIDを作る関数
  const fileName = file.name;
  const filePath = `private/${uuid}_${fileName}`;//「post_thumbnail バケット内の private フォルダにこのID名で保存」。

  //supabaseにUUID名で保存
  const { data,error } = await supabase.storage
    .from('post_thumbnail')//Supabaseの管理画面で作成したバケットの名前を指定
    .upload(filePath,file, { // ここで Supabase ストレージにファイルを保存
      cacheControl : '3600',//キャッシュの有効期限を秒単位で指定（これにより同じファイルを再取得するときの通信量を減らせる）
      upsert : false,// 同じファイル名があっても上書きしない
    })
    //結果：data にファイル情報、error にエラー情報が返る

    // アップロードに失敗したらエラーを表示して終了
    if (error) {
      alert(error.message)
      return
    }

    //ここで公開URLを取得
    const publicUrl = supabase.storage
      .from("post_thumbnail")
      .getPublicUrl(data.path).data.publicUrl;// Supabase上の data.path（＝ファイルのキー）から、「外部アクセス可能なURL」を取得する。


      // ReactHookFormのフォームの状態を更新
      setValue("thumbnailImageKey", data.path);
      setValue("thumbnailImageUrl", publicUrl);
      setValue("thumbnailImageName", file.name);
}


export default handleImageChange;