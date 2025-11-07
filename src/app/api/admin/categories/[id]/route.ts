
//管理者_カテゴリ詳細取得API
import { NextRequest,NextResponse } from "next/server";
import { Category,PrismaClient } from "@prisma/client";
import { supabase } from "../../../../../utils/supabase";

const prisma = new PrismaClient()

export const GET = async ( request : NextRequest,
  {params}:{params:{id:string}})=>{
    const {id} = params

    const token = request.headers.get('Authorization') ?? ''

    const { error } = await supabase.auth.getUser(token)

    if( error )
      return NextResponse.json({ status:error.message },{ status:400 })

  try{
    const post = await prisma.category.findUnique({
      where:{
        id: parseInt(id) //数値に変換する
      },
    })
      return NextResponse.json({status:'OK',post},{status:200})

  } catch(error){
    if(error instanceof Error){
      return NextResponse.json({status:error.message},{status:400})
    }
  }

}


//管理者_カテゴリ更新API
interface UpdateCategoryRequestBody{
    name : string
}

export const PUT = async (request:NextRequest,
  { params } : { params :{id : string }})=> {
    const {id} = params

    const {name}:UpdateCategoryRequestBody = await request.json()

    const token = request.headers.get('Authorization') ?? ''

    const { error } = await supabase.auth.getUser(token)

    if( error )
      return NextResponse.json({ status:error.message },{ status:400 })


  try{
    const data = await prisma.category.update({
      where : {
        id : parseInt(id),
      },
      data : {
        name,
      },
    })

    return NextResponse.json({status:'OK',data},{status:200})

   } catch (error){
    if(error instanceof Error){
      return NextResponse.json({status:error.message},{status:400})  
    }
   }

  }

  //管理者_カテゴリ削除API
export const DELETE = async (request:NextRequest,
  { params } : {params :{id:string}})=>{
  
  const {id} = params

  const token = request.headers.get('Authorization') ?? ''

  const { error } = await supabase.auth.getUser(token)

  if( error )
    return NextResponse.json({ status:error.message },{ status:400 })

    
  try{
    await prisma.category.delete({
      where : {
        id : parseInt(id),
      },
    })
    return NextResponse.json({status:'OK'},{status:200})

  } catch (error) {
    if(error instanceof Error){
      return NextResponse.json({status:error.message},{status:400})
    }
  }
}