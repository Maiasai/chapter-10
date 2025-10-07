//登録画面の作成　作成ボタンデザイン

"use client"

import React from 'react'

type Props = {
  children:  React.ReactNode
};


export const CreateButton: React.FC<Props> = ({ children,...props }) => {
  return (
    <button
      {...props} //ここでonClickを受け渡す
      className="border mt-16 mr-4 w-16 h-10 rounded-lg text-white bg-indigo-500">
        {children}
    </button>
  )
}

export default CreateButton;