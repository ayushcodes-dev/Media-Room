 import AppTextLogo from "@/component/logo/app.logo.jsx";

export default function Header2() {
  return (
    <div className="mb-12 text-center z-10 transition-all duration-700 transform hover:scale-105">
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="w-12 h-12 bg-linear-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(14,165,233,0.4)]">
          <img src="/appLogo.png" />
        </div>
        <AppTextLogo fontSize="text-4xl" />
      </div>
    </div>
  );
}
// import React from 'react';

// Google Fonts: 'Outfit' (900 weight) or 'Syne' (800 weight)
// Make sure to add these to your index.html:
// <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@900&family=Syne:wght@800&display=swap" rel="stylesheet">
