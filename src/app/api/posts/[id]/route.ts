//記事詳細取得API

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const GET = async (request: NextRequest,
  { params } : {params : {id:string}}) => {
    const{ id } = params

  try{
    const posts = await prisma.post.findUnique({
      where : {
        id : parseInt(id),
      },  

      include : {
        postCategories:{
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
    })

      return NextResponse.json({status:'OK',posts:posts},{ status: 200 })

    } catch (error) {
      if(error instanceof Error){
        return NextResponse.json({status:error.message},{ status: 400 })
      }
    }
  }