
import React from 'react';

const Header = () => {
  return (
    <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white py-6 px-4 shadow-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          {/* French Header */}
          <div className="text-left">
            <div className="text-sm font-semibold leading-tight">
              <div>ROYAUME DU MAROC</div>
              <div>MINISTÈRE DE L'INTÉRIEUR</div>
              <div>RÉGION BENI MELLAL-KHENIFRA</div>
              <div>PROVINCE DE KHENIFRA</div>
              <div className="text-red-300">COMMUNE DE KHENIFRA</div>
            </div>
          </div>

          {/* Moroccan Flag Colors Accent */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="w-4 h-12 bg-red-600 rounded"></div>
            <div className="w-4 h-12 bg-emerald-600 rounded"></div>
          </div>

          {/* Arabic Header */}
          <div className="text-right" dir="rtl">
            <div className="text-sm font-semibold leading-tight">
              <div>المملكة المغربية</div>
              <div>وزارة الداخلية</div>
              <div>جهة بني ملال - خنيفرة</div>
              <div>إقليم خنيفرة</div>
              <div className="text-red-300">جماعة خنيفرة</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
