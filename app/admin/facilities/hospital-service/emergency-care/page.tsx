'use client';

import React, { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [services, setServices] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'emergency' | 'diagnostic' | 'additional'>('emergency');

  // Correct API Endpoint Path
  const API_URL = '/api/facilities/hospital-service/emergency-care';

  const fetchServices = async () => {
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      if (json.success) setServices(json.data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenModal = (item?: any, defaultCat?: any) => {
    if (item) {
      setEditingId(item._id);
      setTitle(item.title);
      setCategory(item.category);
    } else {
      setEditingId(null);
      setTitle('');
      setCategory(defaultCat || 'emergency');
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title, category };

    try {
      if (editingId) {
        // Edit Request
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!json.success) alert('Failed to update: ' + json.error);
      } else {
        // Add Request
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!json.success) alert('Failed to create: ' + json.error);
      }

      setIsOpen(false);
      fetchServices();
    } catch (error) {
      console.error('Failed to save service:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        fetchServices();
      } else {
        alert('Failed to delete: ' + json.error);
      }
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-8">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Services Admin Dashboard</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#00873E] text-white px-5 py-2.5 rounded-lg font-medium shadow hover:bg-green-700 transition"
        >
          + Add New Item
        </button>
      </div>

      {/* 3 Add Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CategoryAdminCard
          title="Emergency Care"
          cat="emergency"
          items={services.filter((s) => s.category === 'emergency')}
          onAdd={() => handleOpenModal(null, 'emergency')}
          onEdit={(item: any) => handleOpenModal(item)}
          onDelete={handleDelete}
        />
        <CategoryAdminCard
          title="Diagnostic Services"
          cat="diagnostic"
          items={services.filter((s) => s.category === 'diagnostic')}
          onAdd={() => handleOpenModal(null, 'diagnostic')}
          onEdit={(item: any) => handleOpenModal(item)}
          onDelete={handleDelete}
        />
        <CategoryAdminCard
          title="Additional Services"
          cat="additional"
          items={services.filter((s) => s.category === 'additional')}
          onAdd={() => handleOpenModal(null, 'additional')}
          onEdit={(item: any) => handleOpenModal(item)}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal Popup with Live Preview */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 space-y-6 shadow-2xl">
            <h2 className="text-xl font-bold border-b pb-2">
              {editingId ? 'Edit Service Item' : 'Add New Service Item'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Section</label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00873E]"
                >
                  <option value="emergency">Emergency & Specialized Care</option>
                  <option value="diagnostic">Diagnostic & Imaging Services</option>
                  <option value="additional">Additional Services</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 24/7 Emergency Services"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00873E]"
                />
              </div>

              {/* LIVE PREVIEW SECTION */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Live Preview
                </p>
                <div className="bg-[#EBF4EE] p-4 rounded-md flex items-center justify-between text-gray-800 font-medium text-sm">
                  <span>{title || 'Service Title Preview...'}</span>
                  <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#00873E] text-xs font-bold shadow-sm">
                    ➔
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00873E] text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  {editingId ? 'Update Item' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryAdminCard({ title, items, onAdd, onEdit, onDelete }: any) {
  return (
    <div className="bg-white border rounded-xl p-5 space-y-4 shadow-sm">
      <div className="flex justify-between items-center border-b pb-3">
        <h3 className="font-bold text-gray-800 text-sm sm:text-base">{title}</h3>
        <button
          onClick={onAdd}
          className="text-xs bg-[#EBF4EE] text-[#00873E] font-bold px-3 py-1.5 rounded-md hover:bg-[#DDECE2]"
        >
          + Add
        </button>
      </div>

      <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
        {items.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No items added yet.</p>
        ) : (
          items.map((item: any) => (
            <div
              key={item._id}
              className="bg-gray-50 p-3 rounded-lg border flex items-center justify-between gap-2"
            >
              <span className="text-xs font-medium text-gray-700 truncate">{item.title}</span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onEdit(item)}
                  className="text-xs text-blue-600 font-semibold hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item._id)}
                  className="text-xs text-red-600 font-semibold hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}