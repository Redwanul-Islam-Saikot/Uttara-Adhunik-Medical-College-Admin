'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Loader2, Upload } from 'lucide-react';

export default function AdminVisiting() {
  const [list, setList] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emptyForm = {
    title: '',
    paragraph1: '',
    paragraph2: '',
    phone: '',
    phoneSubtext: '',
    buttonText: '',
    buttonUrl: '',
    departmentCount: '',
    departmentSubtext: '',
    image1: '',
    image2: '',
    badgeLogo: '',
  };

  const [form, setForm] = useState(emptyForm);

  const fetchData = async () => {
    try {
      // API URL আপডেটেড
      const res = await fetch('/api/overview/visiting');
      if (!res.ok) {
        console.error('API Error:', res.status);
        return;
      }
      const data = await res.json();
      if (data.success) setList(data.data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'image1' | 'image2' | 'badgeLogo'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size too large! Please upload under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (item: any) => {
    setEditId(item._id);
    setForm({
      title: item.title || '',
      paragraph1: item.paragraph1 || '',
      paragraph2: item.paragraph2 || '',
      phone: item.phone || '',
      phoneSubtext: item.phoneSubtext || '',
      buttonText: item.buttonText || '',
      buttonUrl: item.buttonUrl || '',
      departmentCount: item.departmentCount || '',
      departmentSubtext: item.departmentSubtext || '',
      image1: item.image1 || '',
      image2: item.image2 || '',
      badgeLogo: item.badgeLogo || '',
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    // API URL আপডেটেড
    const res = await fetch(`/api/overview/visiting/${id}`, { method: 'DELETE' });
    if (res.ok) fetchData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const method = editId ? 'PUT' : 'POST';
    // API URL আপডেটেড
    const url = editId ? `/api/overview/visiting/${editId}` : '/api/overview/visiting';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setIsOpen(false);
        setEditId(null);
        setForm(emptyForm);
        fetchData();
      } else {
        alert(data.message || 'Error occurred');
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Visiting Section Management</h1>
        <button
          onClick={() => {
            setEditId(null);
            setForm(emptyForm);
            setIsOpen(true);
          }}
          className="bg-[#00873E] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-[#006e32]"
        >
          <Plus size={16} /> Add New Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {list.map((item) => (
          <div key={item._id} className="border rounded-xl p-5 bg-white shadow-sm space-y-3">
            <h3 className="font-bold text-lg text-gray-800">{item.title || 'Untitled'}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{item.paragraph1}</p>
            
            <div className="flex gap-2 pt-2 items-center">
              {item.image1 && <img src={item.image1} alt="Img1" className="w-12 h-10 object-cover rounded border" />}
              {item.image2 && <img src={item.image2} alt="Img2" className="w-12 h-10 object-cover rounded border" />}
              {item.badgeLogo && <img src={item.badgeLogo} alt="Logo" className="w-10 h-10 object-contain rounded border bg-slate-50 p-1" />}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDelete(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white max-w-2xl w-full rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="font-bold text-lg">{editId ? 'Edit Section' : 'Add Section'}</h2>
              <button onClick={() => setIsOpen(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border p-2.5 rounded-md mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700">Paragraph 1</label>
                  <textarea
                    value={form.paragraph1}
                    onChange={(e) => setForm({ ...form, paragraph1: e.target.value })}
                    className="w-full border p-2.5 rounded-md mt-1 h-20"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700">Paragraph 2</label>
                  <textarea
                    value={form.paragraph2}
                    onChange={(e) => setForm({ ...form, paragraph2: e.target.value })}
                    className="w-full border p-2.5 rounded-md mt-1 h-20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700">Phone</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border p-2.5 rounded-md mt-1"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700">Phone Subtext</label>
                  <input
                    type="text"
                    value={form.phoneSubtext}
                    onChange={(e) => setForm({ ...form, phoneSubtext: e.target.value })}
                    className="w-full border p-2.5 rounded-md mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700">Button Text</label>
                  <input
                    type="text"
                    value={form.buttonText}
                    onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                    className="w-full border p-2.5 rounded-md mt-1"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700">Button URL</label>
                  <input
                    type="text"
                    value={form.buttonUrl}
                    onChange={(e) => setForm({ ...form, buttonUrl: e.target.value })}
                    className="w-full border p-2.5 rounded-md mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700">Department Count</label>
                  <input
                    type="text"
                    value={form.departmentCount}
                    onChange={(e) => setForm({ ...form, departmentCount: e.target.value })}
                    className="w-full border p-2.5 rounded-md mt-1"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700">Department Subtext</label>
                  <input
                    type="text"
                    value={form.departmentSubtext}
                    onChange={(e) => setForm({ ...form, departmentSubtext: e.target.value })}
                    className="w-full border p-2.5 rounded-md mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Image 1</label>
                  <label className="cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 p-2 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-gray-100 transition h-20">
                    <Upload size={16} className="text-gray-500" />
                    <span className="text-[10px] text-gray-600">Upload Img 1</span>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image1')} className="hidden" />
                  </label>
                  {form.image1 && <img src={form.image1} alt="Preview 1" className="mt-2 w-full h-12 object-cover rounded border" />}
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Image 2</label>
                  <label className="cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 p-2 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-gray-100 transition h-20">
                    <Upload size={16} className="text-gray-500" />
                    <span className="text-[10px] text-gray-600">Upload Img 2</span>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image2')} className="hidden" />
                  </label>
                  {form.image2 && <img src={form.image2} alt="Preview 2" className="mt-2 w-full h-12 object-cover rounded border" />}
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Badge Logo</label>
                  <label className="cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 p-2 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-gray-100 transition h-20">
                    <Upload size={16} className="text-gray-500" />
                    <span className="text-[10px] text-gray-600">Upload Logo</span>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'badgeLogo')} className="hidden" />
                  </label>
                  {form.badgeLogo && <img src={form.badgeLogo} alt="Logo Preview" className="mt-2 h-12 object-contain mx-auto rounded border bg-slate-50 p-1" />}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 border rounded-md">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="bg-[#00873E] text-white px-5 py-2 rounded-md flex items-center gap-2 font-bold">
                  {loading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}