//記事一覧取得API

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GETという命名にすることで、GETリクエストの時にこの関数が呼ばれる
export const GET = async (request: NextRequest) => {
  try {
    // Postの一覧をDBから取得
    const posts = await prisma.post.findMany({
      include : {
        // カテゴリーも含めて取得  
        postCategories : {
          include: {
            category : {
              select : {
                id:true,
                name:true,
              },
            },
          },
        },
      },    
      orderBy : {
      createdAt : 'desc',
      },
    })
  

  return NextResponse.json({status:'OK',posts:posts},{status:200})
    }catch(error){
      if(error instanceof Error)
        return NextResponse.json({status:error.message},{status:400})
    }  

}

