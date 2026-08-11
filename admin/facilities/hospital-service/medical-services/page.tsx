'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AdminMedicalServices() {
  const [services, setServices] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const initialForm = {
    categoryNumber: '01',
    categoryTitle: 'MEDICAL SERVICES',
    categoryGroup: 'main', // 'main' | 'clinical_medicine' | 'clinical_surgical'
    title: '',
    description: '',
    logo: '',
  };

  const [form, setForm] = useState(initialForm);

  // API Path Update (s যোগ করা হয়েছে)
  const API_URL = '/api/facilities/hospital-service/medical-service'; 

  const fetchServices = async () => {
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      if (json.success) setServices(json.data || []);
    } catch (err) {
      console.error('Fetch Error:', err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '01') {
      setForm((prev) => ({
        ...prev,
        categoryNumber: '01',
        categoryTitle: 'MEDICAL SERVICES',
        categoryGroup: 'main',
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        categoryNumber: '02',
        categoryTitle: 'CLINICAL DEPARTMENTS',
        categoryGroup: 'clinical_medicine',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (json.success) {
        alert(editingId ? 'Updated Successfully!' : 'Created Successfully!');
        closeModal();
        fetchServices();
      } else {
        alert(json.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error('Submit Error:', error);
      alert('Failed to submit form.');
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item._id);
    setForm({
      categoryNumber: item.categoryNumber,
      categoryTitle: item.categoryTitle,
      categoryGroup: item.categoryGroup || 'main',
      title: item.title,
      description: item.description,
      logo: item.logo || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const json = await res.json();
      
      if (json.success) {
        alert('Deleted successfully!');
        fetchServices();
      } else {
        alert(json.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('Delete Error:', error);
      alert('Failed to delete item.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(initialForm);
  };

  const filteredServices = services.filter((item) => {
    if (filterCategory === '01') return item.categoryNumber === '01';
    if (filterCategory === '02') return item.categoryNumber === '02';
    return true;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto my-6 space-y-6">
      {/* Header Dashboard */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl border shadow-sm gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Medical Services Dashboard</h2>
          <p className="text-xs text-gray-500">Manage 01. Medical Services & 02. Clinical Departments dynamic cards.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setForm(initialForm);
            setIsModalOpen(true);
          }}
          className="bg-[#00873E] hover:bg-[#006e32] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition"
        >
          + Add New Service
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b pb-3">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-4 py-1.5 rounded-md text-xs font-bold ${
            filterCategory === 'all' ? 'bg-[#00873E] text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          All Items ({services.length})
        </button>
        <button
          onClick={() => setFilterCategory('01')}
          className={`px-4 py-1.5 rounded-md text-xs font-bold ${
            filterCategory === '01' ? 'bg-[#00873E] text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          01. Medical Services ({services.filter((s) => s.categoryNumber === '01').length})
        </button>
        <button
          onClick={() => setFilterCategory('02')}
          className={`px-4 py-1.5 rounded-md text-xs font-bold ${
            filterCategory === '02' ? 'bg-[#00873E] text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          02. Clinical Depts ({services.filter((s) => s.categoryNumber === '02').length})
        </button>
      </div>

      {/* Item Grid List */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border">
          <p className="text-sm text-gray-400">No services added yet. Click "+ Add New Service" to insert one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredServices.map((item) => (
            <div key={item._id} className="bg-white p-5 border rounded-xl shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] bg-emerald-50 text-[#00873E] border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                    {item.categoryNumber} - {item.categoryTitle}
                  </span>
                  
                  {/* Item Logo without invert/effect */}
                  {item.logo && (
                    <div className="relative w-8 h-8 rounded-full border bg-white flex items-center justify-center p-1">
                      <Image src={item.logo} alt="Logo" fill className="object-contain p-1" />
                    </div>
                  )}
                </div>
                <h4 className="font-bold text-gray-800 text-base">{item.title}</h4>
                <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
              </div>

              <div className="flex gap-2 border-t pt-3">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 py-1.5 rounded text-xs font-semibold transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 py-1.5 rounded text-xs font-semibold transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pop-up Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h3 className="text-lg font-bold text-gray-800">
                {editingId ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">
                &times;
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Form Input Area (7 Cols) */}
              <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
                {/* Section Selection */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Select Main Section</label>
                  <select
                    value={form.categoryNumber}
                    onChange={handleCategoryChange}
                    className="w-full border p-2.5 rounded-lg text-sm bg-white focus:border-[#00873E] outline-none"
                  >
                    <option value="01">01. MEDICAL SERVICES</option>
                    <option value="02">02. CLINICAL DEPARTMENTS</option>
                  </select>
                </div>

                {/* Sub Group for 02 */}
                {form.categoryNumber === '02' && (
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Sub Department Type</label>
                    <select
                      value={form.categoryGroup}
                      onChange={(e) => setForm({ ...form, categoryGroup: e.target.value })}
                      className="w-full border p-2.5 rounded-lg text-sm bg-white focus:border-[#00873E] outline-none"
                    >
                      <option value="clinical_medicine">MEDICINE RELATED</option>
                      <option value="clinical_surgical">SURGICAL RELATED</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Service Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. General Medicine / Surgery"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full border p-2.5 rounded-lg text-sm outline-none focus:border-[#00873E]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Upload Icon / Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-green-50 file:text-[#00873E]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Description</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Short description..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full border p-2.5 rounded-lg text-sm outline-none focus:border-[#00873E] resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="bg-[#00873E] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700">
                    Save Changes
                  </button>
                  <button type="button" onClick={closeModal} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200">
                    Cancel
                  </button>
                </div>
              </form>

              {/* Static Preview Area (5 Cols) - No Hover Effects, Natural Logo */}
              <div className="lg:col-span-5 bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase">Live Preview</span>
                  <span className="text-[10px] bg-green-100 text-[#00873E] font-bold px-2 py-0.5 rounded">
                    Frontend View
                  </span>
                </div>

                {/* Simulated Static Card */}
                <div className="bg-[#DDECE2]/60 border border-dashed border-[#8EC3A1] rounded-2xl p-6 min-h-[160px] flex flex-col justify-between space-y-4">
                  {/* Circle Icon */}
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-2.5 shadow-sm border border-gray-100">
                    {form.logo ? (
                      <div className="relative w-full h-full">
                        {/* Original Image Color, No Invert */}
                        <Image src={form.logo} alt="Preview Icon" fill className="object-contain" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 bg-gray-300 rounded-full" />
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-base text-gray-900 leading-tight">
                      {form.title || 'Service Title Preview'}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                      {form.description || 'Description preview will appear here as you type.'}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}