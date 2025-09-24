
import { NextRequest,NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";


//管理者_カテゴリ一覧取得API
const prisma = new PrismaClient()

export const GET = async (request:NextRequest)=>{
  try{
    const posts = await prisma.category.findMany({
      orderBy:{
        createdAt:'desc',
      },
    })

    return NextResponse.json({status:'OK',posts},{status:200})
    
  } catch(error){ //データベースからデータ取得の際にエラーが出たらここでキャッチ！
    if (error instanceof Error){ //キャッチされたエラーが「Error」インスタンスであるかを確認
      return NextResponse.json(//エラーメッセージと HTTP ステータスコードを含む JSON レスポンスを生成
        {status:error.message},
        {status:400})
    }
  }
}



//管理者_カテゴリ新規作成API
interface CreateCategoryRequestBody {
  name : string
}

export const POST = async (request:NextRequest)=>{
  try{
    const body = await request.json()
    const {name} : CreateCategoryRequestBody = body
    
    const data = await prisma.category.create({
        data :{name},  //nameというオブジェクトからnameプロパティを取り出して、同名の変数nameに代入する→{ "name": "文字列" }
    })
    
      return NextResponse.json({
        status:'OK',
        message:'作成が完了しました',
        data:data.id,
      })
    
  } catch (error){
    if (error instanceof Error){
      return NextResponse.json ({status:error.message},{status:400})
    }
  }
}
