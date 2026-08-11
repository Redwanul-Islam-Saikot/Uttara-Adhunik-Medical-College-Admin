'use client';

import React, { useState, useEffect } from 'react';

interface Category {
  title: string;
  points: string[];
}

interface AimObjectiveData {
  _id?: string;
  aimTitle: string;
  aimDescription: string;
  objectiveTitle: string;
  imageUrl: string;
  categories: Category[];
  footerText: string;
}

export default function AdminAimObjective() {
  const [list, setList] = useState<AimObjectiveData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<AimObjectiveData>({
    aimTitle: 'Aim',
    aimDescription: '',
    objectiveTitle: 'Objective',
    imageUrl: '',
    categories: [{ title: '', points: [''] }],
    footerText: '',
  });

  const fetchData = async () => {
    try {
      const res = await fetch('/api/about/aim-objective');
      const result = await res.json();
      if (result.success) setList(result.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      aimTitle: 'Aim',
      aimDescription: '',
      objectiveTitle: 'Objective',
      imageUrl: '',
      categories: [{ title: '', points: [''] }],
      footerText: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: AimObjectiveData) => {
    if (!item._id) return;
    setEditingId(item._id);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleImageResize = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1000;
          const scaleFactor = MAX_WIDTH / img.width;

          canvas.width = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
          canvas.height = img.width > MAX_WIDTH ? img.height * scaleFactor : img.height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          setFormData((prev) => ({ ...prev, imageUrl: canvas.toDataURL('image/jpeg', 0.8) }));
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const url = editingId ? `/api/about/aim-objective/${editingId}` : '/api/about/aim-objective';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        alert(editingId ? 'Updated successfully!' : 'Added successfully!');
        setIsModalOpen(false);
        fetchData();
      } else {
        alert(result.message || 'Error occurred');
      }
    } catch (error) {
      console.error(error);
      alert('Operation failed');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm('Delete this entry?')) return;
    try {
      const res = await fetch(`/api/about/aim-objective/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        alert('Deleted successfully!');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full lg:pl-80 pr-4 sm:pr-6 pt-6">
      <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Aim & Objective Dashboard</h1>
          <p className="text-sm text-gray-500">Manage Aim, Objective, Banner & Category Bullet Points</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="bg-[#00873E] hover:bg-[#006e33] text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow"
        >
          + Add Content
        </button>
      </div>

      {loading ? (
        <p className="text-center py-10">Loading...</p>
      ) : list.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">No content available. Click "+ Add Content" to add.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {list.map((item) => (
            <div key={item._id} className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
              <div className="flex justify-between items-start border-b pb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{item.aimTitle}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{item.aimDescription}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenEditModal(item)} className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-semibold">Edit</button>
                  <button onClick={() => handleDelete(item._id)} className="px-3 py-1 bg-red-50 text-red-600 rounded text-xs font-semibold">Delete</button>
                </div>
              </div>
              <img src={item.imageUrl} alt="Banner" className="w-full h-32 object-cover rounded-md" />
              <div className="text-xs text-gray-600">
                <strong>Categories:</strong> {item.categories?.length || 0} Listed
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 lg:pl-80">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-gray-800">{editingId ? 'Edit Content' : 'Add Content'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-2xl font-bold">&times;</button>
            </div>

            <form id="aimForm" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600">Aim Section Title</label>
                  <input
                    type="text"
                    value={formData.aimTitle}
                    onChange={(e) => setFormData({ ...formData, aimTitle: e.target.value })}
                    className="w-full border p-2 rounded text-sm mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600">Objective Section Title</label>
                  <input
                    type="text"
                    value={formData.objectiveTitle}
                    onChange={(e) => setFormData({ ...formData, objectiveTitle: e.target.value })}
                    className="w-full border p-2 rounded text-sm mt-1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600">Aim Description</label>
                <textarea
                  rows={3}
                  value={formData.aimDescription}
                  onChange={(e) => setFormData({ ...formData, aimDescription: e.target.value })}
                  className="w-full border p-2 rounded text-sm mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600">Banner Image</label>
                <input type="file" accept="image/*" onChange={handleImageResize} className="w-full border p-2 rounded text-sm mt-1" required={!editingId && !formData.imageUrl} />
              </div>

              {/* Dynamic Categories */}
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-xs text-gray-500 uppercase">Objective Categories</h4>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, categories: [...formData.categories, { title: '', points: [''] }] })}
                    className="text-xs bg-emerald-50 text-[#00873E] px-3 py-1 rounded font-bold"
                  >
                    + Add Category
                  </button>
                </div>

                {formData.categories.map((cat, catIdx) => (
                  <div key={catIdx} className="p-4 bg-gray-50 rounded-lg border space-y-3">
                    <div className="flex justify-between gap-2">
                      <input
                        type="text"
                        placeholder="Category Title (e.g. Academic Excellence)"
                        value={cat.title}
                        onChange={(e) => {
                          const updated = [...formData.categories];
                          updated[catIdx].title = e.target.value;
                          setFormData({ ...formData, categories: updated });
                        }}
                        className="w-full border p-2 rounded text-sm bg-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.categories.filter((_, i) => i !== catIdx);
                          setFormData({ ...formData, categories: updated });
                        }}
                        className="text-red-500 font-bold px-2 text-sm"
                      >
                        &times;
                      </button>
                    </div>

                    {/* Bullet Points */}
                    <div className="pl-4 space-y-2 border-l-2 border-emerald-500">
                      {cat.points.map((point, ptIdx) => (
                        <div key={ptIdx} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Bullet Point Text"
                            value={point}
                            onChange={(e) => {
                              const updated = [...formData.categories];
                              updated[catIdx].points[ptIdx] = e.target.value;
                              setFormData({ ...formData, categories: updated });
                            }}
                            className="w-full border p-1.5 rounded text-xs bg-white"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...formData.categories];
                              updated[catIdx].points = updated[catIdx].points.filter((_, i) => i !== ptIdx);
                              setFormData({ ...formData, categories: updated });
                            }}
                            className="text-red-400 text-xs font-bold"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...formData.categories];
                          updated[catIdx].points.push('');
                          setFormData({ ...formData, categories: updated });
                        }}
                        className="text-[11px] text-blue-600 font-semibold"
                      >
                        + Add Bullet Point
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600">Footer Note Text</label>
                <input
                  type="text"
                  value={formData.footerText}
                  onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                  className="w-full border p-2 rounded text-sm mt-1"
                />
              </div>
            </form>

            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600">Cancel</button>
              <button form="aimForm" type="submit" disabled={submitLoading} className="bg-[#00873E] text-white px-5 py-2 rounded text-sm font-medium">
                {submitLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}