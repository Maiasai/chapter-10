"use client";

import React from 'react';
import Link from "next/link";



const Header: React.FC = () =>  {

  return (
    <nav className="bg-black/80 flex h-16 items-center justify-between ">
      <ul>
        <li className="text-white ml-6"><Link href="/">Blog</Link></li>
      </ul>
      <ul className="flex w-ful">
        <li className="text-white"><Link href="/contact">お問い合わせ</Link></li>
        <li className="text-white ml-6 mr-6"><Link href="/login">ログイン</Link></li>
      </ul>
      </nav>
  );
}

export default Header;
