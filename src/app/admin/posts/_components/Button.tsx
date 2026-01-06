//一覧画面の新規作成　ボタンデザイン

"use client"

import React from 'react'

type Props = {
  children:  React.ReactNode
};


export const Button: React.FC<Props> = ({ children }) => {
  return (
    <button
      className="p-2 text-white font-bold bg-blue-500 border rounded-lg">
        {children}
    </button>
  )
}

export default Button;