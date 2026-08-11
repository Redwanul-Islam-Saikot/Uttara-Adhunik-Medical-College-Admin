'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AdminFacilityServices() {
  const [items, setItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialForm = {
    tabTitle: '',
    title: '',
    description: '',
    image: '',
    buttonText: 'Learn More',
    buttonUrl: '#',
    order: 0,
  };

  const [form, setForm] = useState(initialForm);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/facilities/hospital-service/uamc-facilities');
      const json = await res.json();
      if (json.success) setItems(json.data || []);
    } catch (err) {
      console.error('Fetch Error:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `/api/facilities/hospital-service/uamc-facilities/${editingId}`
      : '/api/facilities/hospital-service/uamc-facilities';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (json.success) {
        alert(editingId ? 'Updated Successfully!' : 'Added Successfully!');
        closeModal();
        fetchData();
      } else {
        alert('Failed: ' + json.message);
      }
    } catch (error) {
      console.error('Submit Error:', error);
      alert('Error submitting form');
    }
  };

  const handleEdit = (item: any) => {
    const targetId = item._id || item.id;
    if (!targetId) {
      alert('Error: Item ID is missing');
      return;
    }
    setEditingId(targetId);
    setForm({
      tabTitle: item.tabTitle || '',
      title: item.title || '',
      description: item.description || '',
      image: item.image || '',
      buttonText: item.buttonText || 'Learn More',
      buttonUrl: item.buttonUrl || '#',
      order: item.order || 0,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item: any) => {
    const targetId = item._id || item.id;
    if (!targetId) {
      alert('Error: Invalid Item ID');
      return;
    }

    if (!confirm('Are you sure you want to delete this facility?')) return;

    try {
      const res = await fetch(`/api/facilities/hospital-service/uamc-facilities/${targetId}`, {
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
      console.error('Delete Error:', error);
      alert('Error deleting item');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(initialForm);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto my-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-lg border shadow-sm mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            UAMCH Facilities & Services Admin
          </h2>
          <p className="text-xs text-gray-500">
            Manage tabs, content, images and buttons dynamically.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setForm(initialForm);
            setIsModalOpen(true);
          }}
          className="bg-[#00873E] hover:bg-[#006e32] text-white px-4 py-2 rounded text-sm font-medium transition"
        >
          + Add New Facility
        </button>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item._id || item.id}
            className="bg-white border rounded-xl p-5 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-3">
              <span className="text-[10px] bg-green-100 text-[#00873E] px-2 py-0.5 rounded font-bold uppercase">
                Tab: {item.tabTitle}
              </span>
              <h4 className="font-bold text-gray-800 text-base line-clamp-1">
                {item.title}
              </h4>
              {item.image && (
                <div className="relative w-full h-28 rounded border overflow-hidden">
                  <Image
                    src={item.image}
                    alt="Service Image"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <p className="text-xs text-gray-500 line-clamp-2">
                {item.description}
              </p>
            </div>

            <div className="flex gap-2 border-t pt-3 mt-4">
              <button
                onClick={() => handleEdit(item)}
                className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 py-1.5 rounded text-xs font-medium transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item)}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-1.5 rounded text-xs font-medium transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal with Live Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center p-4 sm:p-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {editingId ? 'Edit Facility' : 'Add New Facility'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Form (7 Cols) */}
              <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Left Tab Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Intensive Care Unit (ICU)"
                    className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-[#00873E]"
                    value={form.tabTitle}
                    onChange={(e) =>
                      setForm({ ...form, tabTitle: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Main Header Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Intensive Care Unit (ICU)"
                    className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-[#00873E]"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write details..."
                    className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-[#00873E]"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-[#00873E] hover:file:bg-green-100"
                    onChange={handleImageUpload}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Button Text
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-[#00873E]"
                      value={form.buttonText}
                      onChange={(e) =>
                        setForm({ ...form, buttonText: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Button URL
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-[#00873E]"
                      value={form.buttonUrl}
                      onChange={(e) =>
                        setForm({ ...form, buttonUrl: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="submit"
                    className="bg-[#00873E] hover:bg-[#006e32] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              {/* Right Live Preview Area (5 Cols) */}
              <div className="lg:col-span-5 bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 sticky top-0">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Live Preview
                  </span>
                  <span className="text-[10px] bg-green-100 text-[#00873E] font-semibold px-2 py-0.5 rounded">
                    Real-time
                  </span>
                </div>

                {/* Left Tab Button Preview */}
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-medium">Tab Button:</span>
                  <div className="w-full py-2.5 px-4 rounded-md text-xs font-semibold bg-gradient-to-r from-[#00873E] via-[#00873E] to-emerald-50/10 text-white shadow-sm truncate">
                    {form.tabTitle || 'Tab Title Preview'}
                  </div>
                </div>

                {/* Main Card Content Preview */}
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-medium">Card Component:</span>
                  <div className="bg-white border rounded-xl shadow-sm overflow-hidden p-3 flex flex-col space-y-3">
                    {/* Preview Image */}
                    <div className="relative w-full h-36 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border">
                      {form.image ? (
                        <Image
                          src={form.image}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">No Image Selected</span>
                      )}
                    </div>

                    {/* Preview Text */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-gray-800 line-clamp-1">
                        {form.title || 'Header Title Preview'}
                      </h4>
                      <p className="text-[11px] text-gray-600 line-clamp-3 leading-relaxed">
                        {form.description || 'Description preview will appear here.'}
                      </p>
                    </div>

                    {/* Preview Button */}
                    {form.buttonText && (
                      <div className="pt-1">
                        <span className="inline-flex items-center gap-1.5 bg-[#00873E] text-white text-[11px] font-medium px-3 py-1.5 rounded transition">
                          {form.buttonText} &rarr;
                        </span>
                      </div>
                    )}
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