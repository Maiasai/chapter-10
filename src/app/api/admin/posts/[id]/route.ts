

import { NextRequest,NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

//管理者_記事詳細取得API
const prisma = new PrismaClient()

export const GET = async (request:NextRequest,
  { params } : {params:{id:string}}) =>{
    const {id} = params
 
  try {
    const post = await prisma.post.findUnique({
      where : {
        id : parseInt(id),
      },
      
      include : {
        postCategories : {
          include : {
            category : {
              select : {
                id :true,
                name : true
              },
            },
          },
        },
      },
    })

    return NextResponse.json({status:'OK',post:post},{status:200})

  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({status:error.message},{status:400})
  }
}


//管理者_記事更新API
interface UpdatePostRequestBody {
  title : string
  content : string
  categories : {id:number}[]
  thumbnailImageKey : string
}

export const PUT = async (request:NextRequest,
  { params } : { params : {id: string }}) => {
    const {id} = params  // ← URLの [id] がここに入る
    const {title,content,categories,thumbnailImageKey}:UpdatePostRequestBody = await request.json()

  try{
     // idを指定して、Postを更新(Prisma が返してくる更新済み記事レコード )
    const post = await prisma.post.update({
      where : {
        id : parseInt(id), //どの記事を更新するか指定
      },
      data : {
        title,content,thumbnailImageKey,
      }
    })

    // 一旦、記事とカテゴリーの中間テーブルのレコードを全て削除
    const data = await prisma.postCategory.deleteMany({
      where : {
        postId : parseInt(id)
      },
    })


    // 記事とカテゴリーの中間テーブルのレコードをDBに生成
    // 本来複数同時生成には、createManyというメソッドがあるが、sqliteではcreateManyが使えないので、for文1つずつ実施
    for(const category of categories){
      await prisma.postCategory.create({
        data : {
          postId: post.id, // 更新中の記事のID
          categoryId: category.id, // ← フロントから渡されたカテゴリID
        },
      })
    }

    return NextResponse.json({status:'OK',post:data },{status:200})

  } catch (error){
    if(error instanceof Error){
      return NextResponse.json({status:error.message},{status:400})
    }
  }
  }

//管理者_記事削除PI
export const DELETE = async (request:NextRequest,
  { params } : { params : {id:string}}) => {
    const {id} = params

    try{
      await prisma.post.delete({
        where : {
          id :parseInt(id),
        },
      })

      return NextResponse.json({status:'OK'},{status:200})

    } catch (error) {
      if(error instanceof Error){
        return NextResponse.json({status:error.message},{status:400})
      }
    }
  }