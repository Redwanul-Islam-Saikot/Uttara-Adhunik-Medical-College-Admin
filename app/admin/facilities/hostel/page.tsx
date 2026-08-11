'use client';

import React, { useState } from 'react';
import FacilityAdminModal from '@/components/FacilityAdminModal';
import { Edit3 } from 'lucide-react';

export default function HostelAdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="lg:ml-72 p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hostel Services Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage hostel accommodation details and rules</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#008751] hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg flex items-center gap-2 transition"
        >
          <Edit3 size={16} /> Edit Hostel Content
        </button>
      </div>

      <FacilityAdminModal
        slug="hostel"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setIsModalOpen(false)}
      />
    </div>
  );
}