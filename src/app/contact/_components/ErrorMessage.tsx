"use client"

import React from 'react'

type Props = {
  message: string
}

const ErrorMessage: React.FC<Props> = ({ message }) => {
    if (!message) return null
  
    return <p className="text-red-500 text-sm mt-1">{message}</p>
  }


export default ErrorMessage;