'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Loader2, Upload } from 'lucide-react';

export default function AdminSustainability() {
  const [list, setList] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emptyForm = {
    title: 'Sustainability at UAMC',
    description:
      'Uttara Adhunik Medical College (UAMC) is committed to sustainability by integrating innovative solutions in healthcare and education while minimizing its environmental impact.',
    bgImage: '',
    image1: '',
    image2: '',
    features: [
      {
        title: 'Eco-Friendly Campus',
        description:
          'UAMC integrates energy-efficient infrastructure and waste management to promote a greener learning environment.',
      },
      {
        title: 'Sustainable Healthcare Practices',
        description:
          'The institution adopts responsible resource management to reduce environmental impact in medical education and patient care.',
      },
      {
        title: 'Innovation & Collaboration',
        description:
          'UAMC explores partnerships and modern solutions to enhance long-term sustainability in healthcare and education.',
      },
    ],
  };

  const [form, setForm] = useState(emptyForm);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/overview/sustainability');
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
    field: 'bgImage' | 'image1' | 'image2'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size max 2MB!');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFeatureChange = (index: number, field: 'title' | 'description', value: string) => {
    const newFeatures = [...form.features];
    newFeatures[index][field] = value;
    setForm({ ...form, features: newFeatures });
  };

  const addFeature = () => {
    setForm({ ...form, features: [...form.features, { title: '', description: '' }] });
  };

  const removeFeature = (index: number) => {
    setForm({ ...form, features: form.features.filter((_, i) => i !== index) });
  };

  const handleEdit = (item: any) => {
    setEditId(item._id);
    setForm({
      title: item.title || '',
      description: item.description || '',
      bgImage: item.bgImage || '',
      image1: item.image1 || '',
      image2: item.image2 || '',
      features: item.features?.length ? item.features : emptyForm.features,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this?')) return;
    const res = await fetch(`/api/overview/sustainability/${id}`, { method: 'DELETE' });
    if (res.ok) fetchData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const method = editId ? 'PUT' : 'POST';
    const url = editId
      ? `/api/overview/sustainability/${editId}`
      : '/api/overview/sustainability';

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
        <h1 className="text-2xl font-bold text-gray-800">Sustainability Section Management</h1>
        <button
          onClick={() => {
            setEditId(null);
            setForm(emptyForm);
            setIsOpen(true);
          }}
          className="bg-[#00873E] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-[#006e32]"
        >
          <Plus size={16} /> Add Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {list.map((item) => (
          <div key={item._id} className="border rounded-xl p-5 bg-white shadow-sm space-y-3">
            <h3 className="font-bold text-lg text-[#00873E]">{item.title}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
            <div className="flex gap-2 pt-2">
              {item.bgImage && (
                <img src={item.bgImage} alt="BG" className="w-12 h-12 object-cover rounded border" />
              )}
              {item.image1 && (
                <img src={item.image1} alt="Img 1" className="w-12 h-12 object-cover rounded border" />
              )}
              {item.image2 && (
                <img src={item.image2} alt="Img 2" className="w-12 h-12 object-cover rounded border" />
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => handleEdit(item)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
              >
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
              <h2 className="font-bold text-lg">
                {editId ? 'Edit Section' : 'Add Section'}
              </h2>
              <button onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border p-2.5 rounded-md mt-1"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border p-2.5 rounded-md mt-1 h-20"
                  required
                />
              </div>

              {/* 3 Images Upload Option */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Background Banner/Img</label>
                  <label className="cursor-pointer bg-gray-50 border-2 border-dashed p-2 rounded-lg flex flex-col items-center justify-center h-20">
                    <Upload size={16} className="text-gray-500" />
                    <span className="text-[10px]">Upload BG</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'bgImage')}
                      className="hidden"
                    />
                  </label>
                  {form.bgImage && (
                    <img src={form.bgImage} alt="BG" className="mt-2 w-full h-12 object-cover rounded" />
                  )}
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Front Image (Student)</label>
                  <label className="cursor-pointer bg-gray-50 border-2 border-dashed p-2 rounded-lg flex flex-col items-center justify-center h-20">
                    <Upload size={16} className="text-gray-500" />
                    <span className="text-[10px]">Upload Img 1</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'image1')}
                      className="hidden"
                    />
                  </label>
                  {form.image1 && (
                    <img src={form.image1} alt="Img 1" className="mt-2 w-full h-12 object-cover rounded" />
                  )}
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Back Right Image</label>
                  <label className="cursor-pointer bg-gray-50 border-2 border-dashed p-2 rounded-lg flex flex-col items-center justify-center h-20">
                    <Upload size={16} className="text-gray-500" />
                    <span className="text-[10px]">Upload Img 2</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'image2')}
                      className="hidden"
                    />
                  </label>
                  {form.image2 && (
                    <img src={form.image2} alt="Img 2" className="mt-2 w-full h-12 object-cover rounded" />
                  )}
                </div>
              </div>

              {/* Dynamic Feature Checklist */}
              <div className="space-y-3 pt-2 border-t">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-gray-700">Features Checklist</label>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-blue-600 font-semibold text-[11px]"
                  >
                    + Add Feature
                  </button>
                </div>
                {form.features.map((feature, idx) => (
                  <div key={idx} className="border p-2.5 rounded-lg space-y-2 relative bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-600">Feature #{idx + 1}</span>
                      {form.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(idx)}
                          className="text-red-500"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Title"
                      value={feature.title}
                      onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)}
                      className="w-full border p-2 rounded-md bg-white"
                      required
                    />
                    <textarea
                      placeholder="Description"
                      value={feature.description}
                      onChange={(e) => handleFeatureChange(idx, 'description', e.target.value)}
                      className="w-full border p-2 rounded-md bg-white h-14"
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#00873E] text-white px-5 py-2 rounded-md flex items-center gap-2 font-bold"
                >
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