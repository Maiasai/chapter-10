"use client"

import React from 'react'

type Props = {
  children: React.ReactNode
}

export const FormGroup: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex justify-between items-center mb-6">{children}</div>
  )
}

export default FormGroup;