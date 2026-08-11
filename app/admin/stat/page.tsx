'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, Edit, Trash2, Save, X, RefreshCw, UploadCloud, ImageIcon, Eye } from 'lucide-react';

interface IStat {
  _id?: string;
  value: string;
  label: string;
  bgImage?: string;
  order?: number;
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<IStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Background State
  const [sectionBg, setSectionBg] = useState<string>('');
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [bgPreview, setBgPreview] = useState<string>('');
  const [uploadingBg, setUploadingBg] = useState(false);

  const initialFormState: IStat = { value: '', label: '', bgImage: '', order: 0 };
  const [formData, setFormData] = useState<IStat>(initialFormState);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/stats', { cache: 'no-store' });
      const result = await res.json();

      if (res.ok && result?.success) {
        setStats(result.data || []);
        if (result.sectionBg) {
          setSectionBg(result.sectionBg);
        }
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleAddNew = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleEdit = (item: IStat) => {
    if (item._id) setEditingId(item._id);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return alert('Item ID missing!');
    if (!confirm('Are you sure you want to delete this stat?')) return;

    try {
      const res = await fetch(`/api/stats/${id}`, { method: 'DELETE' });
      const result = await res.json();

      if (res.ok && result?.success) {
        alert('Deleted successfully!');
        fetchStats();
      } else {
        alert(`Failed: ${result?.message}`);
      }
    } catch (err: any) {
      alert(`Delete Error: ${err.message}`);
    }
  };

  // Image File Select
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBgFile(file);
      setBgPreview(URL.createObjectURL(file));
    }
  };

  // Upload to Cloudinary & Save to Database
  const handleSaveSectionBg = async () => {
    if (!bgFile) return alert('Please select an image file first!');

    try {
      setUploadingBg(true);

      const uploadData = new FormData();
      uploadData.append('file', bgFile);
      uploadData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'maheen-accessories');

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'bylxfdh4';
      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: uploadData,
      });

      const cloudJson = await cloudRes.json();
      if (!cloudRes.ok) throw new Error(cloudJson.error?.message || 'Cloudinary upload failed');

      const uploadedImageUrl = cloudJson.secure_url;

      const res = await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: 'SECTION_BG',
          label: 'Section Background Image',
          bgImage: uploadedImageUrl,
        }),
      });

      if (res.ok) {
        setSectionBg(uploadedImageUrl);
        setBgFile(null);
        setBgPreview('');
        alert('Section Background Saved Successfully!');
        fetchStats();
      } else {
        alert('Failed to save background');
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setUploadingBg(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingId ? `/api/stats/${editingId}` : '/api/stats';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok && result?.success !== false) {
        alert(editingId ? 'Updated successfully!' : 'Added successfully!');
        setIsModalOpen(false);
        fetchStats();
      } else {
        alert(`Error: ${result?.message}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Active Background Image for Preview
  const activeBg = bgPreview || sectionBg || '/doctors-bg.jpg';

  // Compute live stats list including currently editing item inside modal
  const previewStatsList = editingId
    ? stats.map((item) => (item._id === editingId ? { ...item, ...formData } : item))
    : [...stats, formData.value || formData.label ? { ...formData, _id: 'preview_id' } : null].filter(Boolean) as IStat[];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Stats Banner Management</h1>
          <p className="text-slate-500 text-sm">Manage key achievement figures and section background</p>
        </div>
        <button onClick={handleAddNew} className="flex items-center gap-2 bg-[#008751] text-white px-4 py-2 rounded-lg text-sm font-medium">
          <Plus size={18} /> Add New Stat Item
        </button>
      </div>

      {/* Background Image Upload */}
      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <ImageIcon size={20} className="text-[#008751]" /> Full Section Background Image
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8">
            <label className="border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-slate-100 transition">
              <UploadCloud className="text-slate-400 mb-1" size={28} />
              <span className="text-xs font-bold text-slate-700">
                {bgFile ? bgFile.name : 'Click to Upload / Choose New Background Image'}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          <div className="md:col-span-4 flex flex-col gap-2">
            <button
              onClick={handleSaveSectionBg}
              disabled={uploadingBg || !bgFile}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-slate-800 transition"
            >
              {uploadingBg ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              <span>Save Background</span>
            </button>
          </div>
        </div>

        {/* Saved Background Preview */}
        {sectionBg && !bgPreview && (
          <div className="relative h-20 w-full rounded-lg overflow-hidden border">
            <img src={sectionBg} alt="Active Background" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Table List */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
          <h3 className="font-bold text-slate-700">All Stats Items</h3>
          <button onClick={fetchStats} className="text-slate-500 hover:text-slate-800"><RefreshCw size={16} /></button>
        </div>
        {loading ? (
          <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[#008751]" size={32} /></div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-100 text-slate-800 uppercase text-xs font-bold">
              <tr>
                <th className="p-4">Value</th>
                <th className="p-4">Label</th>
                <th className="p-4">Order</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-[#008751] text-base">{item.value}</td>
                  <td className="p-4">{item.label}</td>
                  <td className="p-4">{item.order}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleEdit(item)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(item._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pop-up Modal (Form + Live Preview only inside) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 space-y-5 my-8 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-bold text-slate-800">{editingId ? 'Edit Stat Item' : 'Add New Stat Item'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            {/* Modal Live Preview */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <Eye size={14} className="text-[#008751]" /> Live Card Preview
              </div>
              <div className="relative w-full overflow-hidden rounded-xl bg-slate-900 py-6 px-4 border">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 transition-all duration-300"
                  style={{ backgroundImage: `url('${activeBg}')` }}
                />
                <div className="relative">
                  <div className="bg-[#1C8246]/90 backdrop-blur-sm py-4 px-4 rounded-lg border border-emerald-500/20 shadow-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-emerald-400/30">
                      {previewStatsList.map((item, idx) => (
                        <div
                          key={item._id || idx}
                          className={`flex flex-col items-center justify-center text-center px-1 pt-2 sm:pt-0 ${
                            item._id === 'preview_id' || item._id === editingId
                              ? 'ring-2 ring-yellow-400 rounded p-1 bg-black/20'
                              : ''
                          }`}
                        >
                          <h2 className="text-2xl font-serif text-white tracking-wide mb-1">
                            {item.value || '0+'}
                          </h2>
                          <p className="text-yellow-400 font-bold uppercase text-[10px] tracking-wider leading-tight">
                            {item.label || 'Your Label'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700">Value (Highlight)</label>
                  <input
                    type="text"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="e.g. 50+ or 10,000+"
                    className="w-full border p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008751]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700">Display Order</label>
                  <input
                    type="number"
                    value={formData.order || 0}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full border p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008751]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700">Label (Description)</label>
                <textarea
                  rows={2}
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g. Expert Doctors & Surgeons"
                  className="w-full border p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008751]"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#008751] text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-[#007043] transition"
                >
                  {submitting ? <Loader2 className="animate-spin" size={16} /> : 'Save Stat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}