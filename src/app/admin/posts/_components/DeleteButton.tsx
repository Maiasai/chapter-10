//登録画面の作成　削除ボタンデザイン

"use client"

import React from 'react'

type Props = {
  children:  React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};


export const DeleteButton: React.FC<Props> = ({ children,...props }) => {
  return (
    <button
      {...props} //ここでonClickを受け渡す
      className="border mt-16 w-16 h-10 rounded-lg text-white bg-red-500">
        {children}
    </button>
  )
}

export default DeleteButton;