import React from 'react';
import Header from './_components/Header';
import '../styles/index.css';


const RootLayout : React.FC = ({ children }: { children: React.ReactNode }) =>  {

  return (
    <html lang="ja">
      <body>
        <Header />              {/* 共通ヘッダー */}
        {children}              {/* 各 page.tsx の内容がここに入る */}
      </body>
    </html>
  );
}

export default RootLayout; 