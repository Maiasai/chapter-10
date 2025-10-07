import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { supabase } from '../../../../utils/supabase'


const prisma = new PrismaClient()

//管理者　記事一覧API
export const GET = async (request:NextRequest) => {
  const token = request.headers.get('Authorization') ?? ''//ログイン済みユーザーか確認するためのトークン。

  //supabaseに対してtokenを送る
  const {error} = await supabase.auth.getUser(token)

 // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
 if (error)
  return NextResponse.json({ status: error.message }, { status: 400 })


// tokenが正しい場合、以降が実行される
  try{

    const posts = await prisma.post.findMany({
      include : {
        postCategories : {
          include : {
            category : {
              select : {
                id:true,
                name:true
              },
            },
          },
        },
      },
      orderBy : {createdAt : 'desc' },
    })

    return NextResponse.json({status:'OK',posts},{status:200})

  } catch(error) {
    if (error instanceof Error)
      return NextResponse.json({status:error.message},{status:400})
  }
}

//管理者　記事新規作成
interface CreatePostRequestBody{
  title : string
  content :string
  categories : {id : number}[]
  thumbnailImageKey : string;
}

export const POST = async (request:NextRequest)=>{
  try{
    const body = await request.json()
    const {title,content,categories,thumbnailImageKey}:CreatePostRequestBody = body


    const post = await prisma.post.create({
      data : {
        title,content,thumbnailImageKey,
      },
    })

    for ( const category of categories){
      await prisma.postCategory.create({
        data : {
          postId : post.id,
          categoryId  : category.id
        },
      })
    }
    return NextResponse.json({status:'OK',message:'作成しました',id:post.id})


  } catch (error) {
    if(error instanceof Error){
      return NextResponse.json({status:error.message},{status:400})
    }
  }
}
  
