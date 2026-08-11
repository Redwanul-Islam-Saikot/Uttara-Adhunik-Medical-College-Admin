'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AdminHospitalInfo() {
  const [items, setItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialFormState = {
    title: 'About the Hospital',
    boldHeader: '',
    description: '',
    icon: '',
    mainImage: '',
    stat1Number: '',
    stat1Label: '',
    stat1Subtext: '',
    stat2Number: '',
    stat2Label: '',
    stat2Subtext: '',
    additionalStructures: '',
  };

  const [form, setForm] = useState(initialFormState);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/facilities/hospital-service/hospital-info');
      const json = await res.json();
      if (json.success) setItems(json.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'icon' | 'mainImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `/api/facilities/hospital-service/hospital-info/${editingId}`
      : '/api/facilities/hospital-service/hospital-info';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form), // boldHeader-সহ পুরো ডাটা পাঠানো হচ্ছে
      });

      const json = await res.json();
      if (json.success) {
        alert(editingId ? 'Updated Successfully!' : 'Added Successfully!');
        closeModal();
        fetchData();
      } else {
        alert('Operation failed: ' + json.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong!');
    }
  };

  const handleEdit = (item: any) => {
    const id = item._id || item.id;
    setEditingId(id);
    setForm({
      title: item.title || '',
      boldHeader: item.boldHeader || '',
      description: item.description || '',
      icon: item.icon || '',
      mainImage: item.mainImage || '',
      stat1Number: item.stat1Number || '',
      stat1Label: item.stat1Label || '',
      stat1Subtext: item.stat1Subtext || '',
      stat2Number: item.stat2Number || '',
      stat2Label: item.stat2Label || '',
      stat2Subtext: item.stat2Subtext || '',
      additionalStructures: item.additionalStructures || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!id) return alert('Invalid ID!');
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      const res = await fetch(`/api/facilities/hospital-service/hospital-info/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        alert('Deleted Successfully!');
        fetchData();
      } else {
        alert('Delete failed: ' + json.message);
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Error deleting item!');
    }
  };

  const openNewModal = () => {
    setEditingId(null);
    setForm(initialFormState);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(initialFormState);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto my-6">
      {/* Top Header */}
      <div className="flex flex-wrap justify-between items-center bg-white p-6 rounded-lg shadow-sm border mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Hospital Info Dashboard</h2>
          <p className="text-sm text-gray-500">Manage About Hospital section content and live previews.</p>
        </div>
        <button
          onClick={openNewModal}
          className="bg-[#00873E] hover:bg-[#006e32] text-white px-5 py-2.5 rounded-md font-medium text-sm transition-all shadow-sm flex items-center gap-2 mt-4 sm:mt-0"
        >
          <span>+</span> Add New Hospital Info
        </button>
      </div>

      {/* Item Grid List - Beautiful Square Shape Cards */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-bold text-gray-700 mb-6 text-lg">Existing Sections ({items.length})</h3>
        {items.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-gray-500 text-sm">No hospital info records found.</p>
            <button onClick={openNewModal} className="mt-3 text-sm text-[#00873E] font-medium hover:underline">
              Click here to add new entry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              const itemId = item._id || item.id;
              return (
                <div 
                  key={itemId} 
                  className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between aspect-square p-5 relative group"
                >
                  <div className="space-y-3 overflow-hidden">
                    {/* Header Banner or Icon */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {item.icon ? (
                          <div className="relative w-10 h-10 flex-shrink-0 bg-gray-50 border p-1 rounded-lg">
                            <Image src={item.icon} alt="Icon" fill className="object-contain" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center text-xs text-[#00873E] font-bold">
                            H
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-gray-800 text-base line-clamp-1">{item.title}</h4>
                          <span className="text-[10px] text-gray-400 font-mono">ID: {itemId.slice(-6)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Image Preview if Available */}
                    {item.mainImage && (
                      <div className="relative w-full h-24 rounded-lg overflow-hidden border bg-gray-50">
                        <Image src={item.mainImage} alt="Main Image" fill className="object-cover" />
                      </div>
                    )}

                    {/* Text Details */}
                    <div className="text-xs text-gray-600 space-y-1">
                      {item.boldHeader && (
                        <p className="font-bold text-gray-900 line-clamp-1 border-b pb-1">
                          {item.boldHeader}
                        </p>
                      )}
                      <p className="line-clamp-2 text-gray-500 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar at Bottom */}
                  <div className="pt-3 border-t flex gap-2 justify-end mt-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-1.5 rounded-md text-xs transition border border-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(itemId)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-1.5 rounded-md text-xs transition border border-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal - Unchanged Form Structure with Full Functionality */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
            
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">
                {editingId ? 'Edit Hospital Info' : 'Add New Hospital Info'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">
                &times;
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 overflow-y-auto p-6 gap-8">
              
              {/* Form Side */}
              <form onSubmit={handleSubmit} className="space-y-4 border-b lg:border-b-0 lg:border-r pb-6 lg:pb-0 lg:pr-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      required
                      className="w-full border p-2 rounded text-sm focus:ring-1 focus:ring-[#00873E] outline-none"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Icon/Logo Upload</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full text-xs"
                      onChange={(e) => handleFileUpload(e, 'icon')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Description Bold Line / Header</label>
                  <input
                    type="text"
                    placeholder="e.g. Uttara Adhunik Medical College Hospital (UAMCH)"
                    className="w-full border p-2 rounded text-sm font-bold focus:ring-1 focus:ring-[#00873E] outline-none"
                    value={form.boldHeader}
                    onChange={(e) => setForm({ ...form, boldHeader: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Description Body</label>
                  <textarea
                    required
                    rows={3}
                    className="w-full border p-2 rounded text-sm focus:ring-1 focus:ring-[#00873E] outline-none"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Main Banner Image Upload</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-xs"
                    onChange={(e) => handleFileUpload(e, 'mainImage')}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border p-3 rounded-lg bg-gray-50">
                  <div className="space-y-2">
                    <h5 className="font-semibold text-xs text-[#00873E]">Stat 1</h5>
                    <input
                      type="text"
                      placeholder="Number"
                      className="w-full border p-1.5 rounded text-xs"
                      value={form.stat1Number}
                      onChange={(e) => setForm({ ...form, stat1Number: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Label"
                      className="w-full border p-1.5 rounded text-xs"
                      value={form.stat1Label}
                      onChange={(e) => setForm({ ...form, stat1Label: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Subtext"
                      className="w-full border p-1.5 rounded text-xs"
                      value={form.stat1Subtext}
                      onChange={(e) => setForm({ ...form, stat1Subtext: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-semibold text-xs text-[#00873E]">Stat 2</h5>
                    <input
                      type="text"
                      placeholder="Number"
                      className="w-full border p-1.5 rounded text-xs"
                      value={form.stat2Number}
                      onChange={(e) => setForm({ ...form, stat2Number: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Label"
                      className="w-full border p-1.5 rounded text-xs"
                      value={form.stat2Label}
                      onChange={(e) => setForm({ ...form, stat2Label: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Subtext"
                      className="w-full border p-1.5 rounded text-xs"
                      value={form.stat2Subtext}
                      onChange={(e) => setForm({ ...form, stat2Subtext: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Additional Structures Note</label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded text-sm focus:ring-1 focus:ring-[#00873E] outline-none"
                    value={form.additionalStructures}
                    onChange={(e) => setForm({ ...form, additionalStructures: e.target.value })}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="bg-[#00873E] hover:bg-[#006e32] text-white px-6 py-2 rounded-md text-sm font-medium">
                    {editingId ? 'Update Info' : 'Save Info'}
                  </button>
                  <button type="button" onClick={closeModal} className="bg-gray-300 text-gray-700 px-5 py-2 rounded-md text-sm font-medium">
                    Cancel
                  </button>
                </div>
              </form>

              {/* Preview Side */}
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Live Preview (Real-time)</span>
                <div className="border rounded-xl bg-[#EBF4EC] p-4 sm:p-6 shadow-inner space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                    <div className="flex items-center gap-2 sm:col-span-1">
                      {form.icon ? (
                        <div className="relative w-8 h-8 flex-shrink-0">
                          <Image src={form.icon} alt="Icon" fill className="object-contain" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-green-200 border border-dashed border-green-500 rounded flex items-center justify-center text-[10px] text-green-700 font-bold">
                          Icon
                        </div>
                      )}
                      <h4 className="text-lg font-bold text-gray-800 leading-tight">
                        {form.title ? form.title.split(' ')[0] : 'About'} <br />
                        <span className="text-[#00873E]">
                          {form.title ? form.title.split(' ').slice(1).join(' ') : 'Hospital'}
                        </span>
                      </h4>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed sm:col-span-2">
                      {form.boldHeader && <strong className="font-bold text-gray-900 mr-1">{form.boldHeader} </strong>}
                      {form.description || 'Description preview will appear here as you type...'}
                    </p>
                  </div>

                  <div className="relative w-full h-[180px] bg-gray-200 rounded-lg overflow-hidden border border-dashed border-gray-300 flex items-center justify-center">
                    {form.mainImage ? (
                      <Image src={form.mainImage} alt="Main Image" fill className="object-cover" />
                    ) : (
                      <span className="text-xs text-gray-400">Hospital Banner Image Preview</span>
                    )}
                  </div>

                  <div className="flex justify-center items-center gap-6 text-center pt-1">
                    <div>
                      <span className="text-lg font-extrabold text-[#00873E] block">{form.stat1Number || '00'}</span>
                      {form.stat1Subtext && <span className="text-[10px] text-gray-500 block">{form.stat1Subtext}</span>}
                      <span className="text-[11px] font-semibold text-gray-800">{form.stat1Label || 'Stat Label'}</span>
                    </div>
                    <div className="w-[1px] h-8 bg-gray-300" />
                    <div>
                      <span className="text-lg font-extrabold text-[#00873E] block">{form.stat2Number || '00'}</span>
                      {form.stat2Subtext && <span className="text-[10px] text-gray-500 block">{form.stat2Subtext}</span>}
                      <span className="text-[11px] font-semibold text-gray-800">{form.stat2Label || 'Stat Label'}</span>
                    </div>
                  </div>

                  {form.additionalStructures && (
                    <p className="text-[11px] text-center text-gray-600 font-medium border-t pt-2 border-gray-200">
                      <strong className="text-gray-800">Additional Structures:</strong> {form.additionalStructures}
                    </p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}