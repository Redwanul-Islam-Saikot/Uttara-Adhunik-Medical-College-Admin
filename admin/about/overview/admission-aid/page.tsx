'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Loader2, Upload } from 'lucide-react';

export default function AdminAdmissionAid() {
  const [list, setList] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emptyForm = {
    title: '',
    description: '',
    image1: '',
    image2: '',
    image3: '',
    links: [
      { label: 'Process Overview', url: '#' },
      { label: 'Fees & Financial Information', url: '#' },
      { label: 'How To Apply', url: '#' },
    ],
  };

  const [form, setForm] = useState(emptyForm);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/overview/admission-aid');
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
    field: 'image1' | 'image2' | 'image3'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size too large! Max 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLinkChange = (index: number, field: 'label' | 'url', value: string) => {
    const newLinks = [...form.links];
    newLinks[index][field] = value;
    setForm({ ...form, links: newLinks });
  };

  const addLink = () => {
    setForm({ ...form, links: [...form.links, { label: '', url: '#' }] });
  };

  const removeLink = (index: number) => {
    setForm({ ...form, links: form.links.filter((_, i) => i !== index) });
  };

  const handleEdit = (item: any) => {
    setEditId(item._id);
    setForm({
      title: item.title || '',
      description: item.description || '',
      image1: item.image1 || '',
      image2: item.image2 || '',
      image3: item.image3 || '',
      links: item.links?.length ? item.links : emptyForm.links,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    const res = await fetch(`/api/overview/admission-aid/${id}`, { method: 'DELETE' });
    if (res.ok) fetchData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/overview/admission-aid/${editId}` : '/api/overview/admission-aid';

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
        <h1 className="text-2xl font-bold text-gray-800">Admission & Aid Management</h1>
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
              {item.image1 && <img src={item.image1} alt="Left" className="w-12 h-12 object-cover rounded border" />}
              {item.image2 && <img src={item.image2} alt="Top Right" className="w-12 h-12 object-cover rounded border" />}
              {item.image3 && <img src={item.image3} alt="Bottom Right" className="w-12 h-12 object-cover rounded border" />}
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
                <label className="font-bold text-gray-700">Section Title</label>
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

              {/* Image Uploads */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Tall Image (Left)</label>
                  <label className="cursor-pointer bg-gray-50 border-2 border-dashed p-2 rounded-lg flex flex-col items-center justify-center h-20">
                    <Upload size={16} className="text-gray-500" />
                    <span className="text-[10px]">Upload</span>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image1')} className="hidden" />
                  </label>
                  {form.image1 && <img src={form.image1} alt="Img 1" className="mt-2 w-full h-12 object-cover rounded" />}
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Top Right Image</label>
                  <label className="cursor-pointer bg-gray-50 border-2 border-dashed p-2 rounded-lg flex flex-col items-center justify-center h-20">
                    <Upload size={16} className="text-gray-500" />
                    <span className="text-[10px]">Upload</span>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image2')} className="hidden" />
                  </label>
                  {form.image2 && <img src={form.image2} alt="Img 2" className="mt-2 w-full h-12 object-cover rounded" />}
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Bottom Right Image</label>
                  <label className="cursor-pointer bg-gray-50 border-2 border-dashed p-2 rounded-lg flex flex-col items-center justify-center h-20">
                    <Upload size={16} className="text-gray-500" />
                    <span className="text-[10px]">Upload</span>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image3')} className="hidden" />
                  </label>
                  {form.image3 && <img src={form.image3} alt="Img 3" className="mt-2 w-full h-12 object-cover rounded" />}
                </div>
              </div>

              {/* Dynamic Links */}
              <div className="space-y-2 pt-2 border-t">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-gray-700">Action Links</label>
                  <button type="button" onClick={addLink} className="text-blue-600 font-semibold text-[11px]">
                    + Add Link
                  </button>
                </div>
                {form.links.map((link, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Label"
                      value={link.label}
                      onChange={(e) => handleLinkChange(idx, 'label', e.target.value)}
                      className="w-1/2 border p-2 rounded-md"
                      required
                    />
                    <input
                      type="text"
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => handleLinkChange(idx, 'url', e.target.value)}
                      className="w-1/2 border p-2 rounded-md"
                      required
                    />
                    {form.links.length > 1 && (
                      <button type="button" onClick={() => removeLink(idx)} className="text-red-500 p-1">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
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