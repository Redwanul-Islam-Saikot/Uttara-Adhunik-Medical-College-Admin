'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, X, Image as ImageIcon } from 'lucide-react';

export default function FacilityAdminPanel() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState = {
    titlePrefix: 'Medical Education',
    titleHighlight: 'Unit (MEU)',
    subTitle: 'Enhancing Learning Through Technology & Collaboration',
    description: 'The Medical Education Unit (MEU) is an educational support center...',
    logo: '',
    mainImage: '',
    footerNote: 'These activities are regularly organized under MEU...',
    subSections: [
      {
        sectionTitle: 'Facilities & Resources',
        items: [
          { title: 'Computer Lab', description: 'Domain-based computers equipped with internet access' },
        ],
      },
    ],
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/facilities/me-unit', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setItems(Array.isArray(json.data) ? json.data : [json.data]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'mainImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addSubSection = () => {
    setFormData((prev) => ({
      ...prev,
      subSections: [
        ...prev.subSections,
        { sectionTitle: '', items: [{ title: '', description: '' }] },
      ],
    }));
  };

  const removeSubSection = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      subSections: prev.subSections.filter((_, i) => i !== index),
    }));
  };

  const updateSectionTitle = (index: number, value: string) => {
    const updated = [...formData.subSections];
    updated[index].sectionTitle = value;
    setFormData({ ...formData, subSections: updated });
  };

  const addItemToSection = (sIndex: number) => {
    const updated = [...formData.subSections];
    updated[sIndex].items.push({ title: '', description: '' });
    setFormData({ ...formData, subSections: updated });
  };

  const removeItemFromSection = (sIndex: number, iIndex: number) => {
    const updated = [...formData.subSections];
    updated[sIndex].items = updated[sIndex].items.filter((_, i) => i !== iIndex);
    setFormData({ ...formData, subSections: updated });
  };

  const updateItemData = (sIndex: number, iIndex: number, key: 'title' | 'description', value: string) => {
    const updated = [...formData.subSections];
    updated[sIndex].items[iIndex][key] = value;
    setFormData({ ...formData, subSections: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/facilities/me-unit/${editingId}` : '/api/facilities/me-unit';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        alert(editingId ? 'Updated successfully!' : 'Created successfully!');
        setIsModalOpen(false);
        setEditingId(null);
        setFormData(initialFormState);
        fetchFacilities();
      } else {
        alert(json.message || 'Failed to save data.');
      }
    } catch (error) {
      console.error('Submit Error:', error);
      alert('An error occurred while saving.');
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item._id || item.id);
    setFormData({
      titlePrefix: item.titlePrefix || '',
      titleHighlight: item.titleHighlight || '',
      subTitle: item.subTitle || '',
      description: item.description || '',
      logo: item.logo || '',
      mainImage: item.mainImage || '',
      footerNote: item.footerNote || '',
      subSections: item.subSections && item.subSections.length > 0 
        ? item.subSections 
        : [{ sectionTitle: '', items: [{ title: '', description: '' }] }],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this facility?')) return;

    try {
      const res = await fetch(`/api/facilities/me-unit/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();

      if (res.ok && json.success) {
        alert('Deleted successfully!');
        fetchFacilities();
      } else {
        alert(json.message || 'Failed to delete item.');
      }
    } catch (error) {
      console.error('Delete Error:', error);
      alert('An error occurred while deleting.');
    }
  };

  const openNewModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Facility Manager</h1>
        <button
          onClick={openNewModal}
          className="bg-[#00873E] text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium hover:bg-green-700 transition"
        >
          <Plus className="w-4 h-4" /> Add New Facility
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b text-xs font-semibold uppercase text-gray-600">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Sub Title</th>
              <th className="p-4">Sub-Sections</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm text-gray-700">
            {!loading && items.map((item) => (
              <tr key={item._id || item.id} className="hover:bg-gray-50">
                <td className="p-4 font-bold">{item.titlePrefix} {item.titleHighlight}</td>
                <td className="p-4 text-gray-500 max-w-xs truncate">{item.subTitle}</td>
                <td className="p-4 font-medium text-gray-600">{item.subSections?.length || 0} Sections</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item._id || item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {loading && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-400">Loading data...</td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-400">No facilities found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-gray-800">{editingId ? 'Edit Facility' : 'Add Facility'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="border p-3 rounded-md bg-gray-50">
                <label className="text-xs font-semibold text-gray-700 block mb-1">Logo</label>
                <div className="flex items-center gap-4">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo" className="w-12 h-12 object-contain border bg-white p-1 rounded" />
                  ) : (
                    <div className="w-12 h-12 border border-dashed rounded flex items-center justify-center bg-gray-100 text-gray-400">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'logo')}
                    className="text-xs text-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Title Prefix</label>
                  <input
                    className="w-full border rounded p-2 text-sm"
                    value={formData.titlePrefix}
                    onChange={(e) => setFormData({ ...formData, titlePrefix: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Title Highlight</label>
                  <input
                    className="w-full border rounded p-2 text-sm"
                    value={formData.titleHighlight}
                    onChange={(e) => setFormData({ ...formData, titleHighlight: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Sub Title</label>
                <input
                  className="w-full border rounded p-2 text-sm"
                  value={formData.subTitle}
                  onChange={(e) => setFormData({ ...formData, subTitle: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Main Description</label>
                <textarea
                  className="w-full border rounded p-2 text-sm"
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="border p-3 rounded-md bg-gray-50">
                <label className="text-xs font-semibold text-gray-700 block mb-1">Main Banner Image</label>
                <div className="space-y-2">
                  {formData.mainImage && (
                    <img src={formData.mainImage} alt="Banner" className="w-full h-32 object-cover rounded border" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'mainImage')}
                    className="text-xs text-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase text-gray-600">Sub-Sections</span>
                  <button
                    type="button"
                    onClick={addSubSection}
                    className="text-xs bg-green-100 text-[#00873E] px-3 py-1 rounded font-bold hover:bg-green-200"
                  >
                    + Add SubSection
                  </button>
                </div>

                {formData.subSections.map((sec, sIdx) => (
                  <div key={sIdx} className="bg-gray-50 p-4 rounded-md border space-y-3">
                    <div className="flex justify-between gap-2">
                      <input
                        className="w-full border p-2 rounded text-xs font-bold"
                        placeholder="Section Title (e.g. Facilities & Resources)"
                        value={sec.sectionTitle}
                        onChange={(e) => updateSectionTitle(sIdx, e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeSubSection(sIdx)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2 pl-3 border-l-2 border-[#00873E]">
                      <span className="text-[11px] font-semibold text-gray-500 block">Items</span>
                      {sec.items.map((item, iIdx) => (
                        <div key={iIdx} className="flex gap-2 items-center">
                          <input
                            placeholder="Title"
                            className="w-1/3 border p-1.5 rounded text-xs font-medium"
                            value={item.title}
                            onChange={(e) => updateItemData(sIdx, iIdx, 'title', e.target.value)}
                            required
                          />
                          <input
                            placeholder="Description (Optional)"
                            className="w-2/3 border p-1.5 rounded text-xs"
                            value={item.description}
                            onChange={(e) => updateItemData(sIdx, iIdx, 'description', e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => removeItemFromSection(sIdx, iIdx)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addItemToSection(sIdx)}
                        className="text-[11px] text-[#00873E] font-bold hover:underline"
                      >
                        + Add Item
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Footer Note</label>
                <input
                  className="w-full border rounded p-2 text-sm"
                  value={formData.footerNote}
                  onChange={(e) => setFormData({ ...formData, footerNote: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#00873E] text-white py-2.5 rounded-md font-bold hover:bg-green-700 transition"
              >
                {editingId ? 'Update Facility' : 'Save Facility'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}