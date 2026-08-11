'use client';

import React, { useState } from 'react';
import FacilityAdminModal from '@/components/FacilityAdminModal';
import { Sparkles, Edit3, CheckCircle } from 'lucide-react';

const facilityList = [
  { slug: 'training', title: 'Training Facilities Management' },
  { slug: 'seminar', title: 'Seminar & Event Management' },
  { slug: 'hostel', title: 'Hostel Services Management' },
  { slug: 'laboratory', title: 'Laboratory Tests & Services' },
  { slug: 'cafeteria', title: 'Cafeteria & Dining Services' },
];

export default function AdminFacilitiesPage() {
  const [activeTab, setActiveTab] = useState('training');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeFacility = facilityList.find((f) => f.slug === activeTab);

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 overflow-x-auto space-x-2">
        {facilityList.map((item) => (
          <button
            key={item.slug}
            onClick={() => setActiveTab(item.slug)}
            className={`py-3 px-5 text-sm font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
              activeTab === item.slug
                ? 'border-[#008751] text-[#008751] bg-emerald-50'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* Selected Page Control Panel */}
      <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{activeFacility?.title}</h2>
            <p className="text-xs text-gray-500 mt-1">Slug Identifier: <code className="bg-gray-100 px-2 py-0.5 rounded">{activeTab}</code></p>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#008751] hover:bg-emerald-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg flex items-center gap-2 transition"
          >
            <Edit3 size={16} /> Open {activeFacility?.title} Form
          </button>
        </div>

        <div className="p-4 bg-gray-50 border rounded-lg flex items-center gap-3">
          <CheckCircle className="text-[#008751]" size={20} />
          <span className="text-sm text-gray-600">
            এই ফর্মটি সাবমিট করলে সরাসরি <strong>`/facilities/{activeTab}`</strong> পেজের ডাটা আপডেট হবে।
          </span>
        </div>
      </div>

      {/* Dynamic Popup Modal for Selected Tab */}
      {isModalOpen && (
        <FacilityAdminModal
          slug={activeTab}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => alert(`${activeFacility?.title} সফলভাবে আপডেট হয়েছে!`)}
        />
      )}
    </div>
  );
}