import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <ShieldX className="mx-auto h-24 w-24 text-red-500 mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">ไม่มีสิทธิ์เข้าถึง</h1>
        <p className="text-lg text-gray-600 mb-8">
          คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้
        </p>
        <Link to="/">
          <Button>กลับสู่หน้าหลัก</Button>
        </Link>
      </div>
    </div>
  );
};