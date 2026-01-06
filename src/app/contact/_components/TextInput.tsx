"use client"

import React from 'react'

type Props = {
  prop:  React.ReactNode
};


export const Textinput: React.FC<Props> = ({ prop }) => {
  return (
    <input
      className="w-full h-full p-4 border border-gray-300 rounded-lg"
    />
  )
}

export default Textinput;