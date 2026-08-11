'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Edit3, Trash2, Loader2, UploadCloud, ArrowRight, Layers, Sparkles } from 'lucide-react';

interface AdmissionBannerData {
  _id?: string;
  highlightTitle: string;
  mainTitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
}

const initialData: AdmissionBannerData = {
  highlightTitle: 'UAMC',
  mainTitle: 'Admission',
  description:
    'Uttara Adhunik Medical College (UAMC) was established in 2003 with a vision to provide quality medical education and healthcare services. Founded through the dedicated efforts of medical professionals and social leaders, UAMC is committed to training future doctors while ensuring affordable healthcare for the community.',
  buttonText: 'Learn More',
  buttonLink: '#',
  backgroundImage: '',
};

export default function AdminAdmissionBannerDashboard() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [banners, setBanners] = useState<AdmissionBannerData[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<AdmissionBannerData>(initialData);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admission-banner');
      const result = await res.json();
      if (result?.success && result?.data) {
        setBanners(Array.isArray(result.data) ? result.data : [result.data]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'bylxfdh4';
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'maheen-accessories';

      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('upload_preset', uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: uploadData,
      });

      const data = await res.json();
      if (res.ok && data.secure_url) {
        setFormData((prev) => ({ ...prev, backgroundImage: data.secure_url }));
      } else {
        alert('Image upload failed!');
      }
    } catch (err) {
      alert('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleOpenEditModal = (item: AdmissionBannerData) => {
    if (!item._id) return;
    setEditingId(item._id);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.backgroundImage) {
      alert('Please upload a background image first!');
      return;
    }
    setSubmitting(true);

    try {
      const isUpdating = Boolean(editingId && editingId !== 'undefined');
      const url = isUpdating ? `/api/admission-banner/${editingId}` : '/api/admission-banner';
      const method = isUpdating ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        alert(isUpdating ? 'Banner Updated Successfully!' : 'Banner Created Successfully!');
        setIsModalOpen(false);
        fetchData();
      } else {
        alert(json.message || 'Failed!');
      }
    } catch (err: any) {
      alert(err.message || 'Error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm('Are you sure you want to delete this banner?')) return;
    try {
      const res = await fetch(`/api/admission-banner/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Deleted successfully!');
        fetchData();
      }
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Admission Banner Manager</h1>
            <p className="text-xs text-slate-500">Manage Admission hero section with custom background image.</p>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData(initialData);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#008751] hover:bg-[#007043] text-white text-xs font-bold px-5 py-3 rounded-xl transition"
          >
            <Plus size={16} /> Add Banner
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500 font-semibold flex justify-center items-center gap-2">
            <Loader2 className="animate-spin text-[#008751]" size={24} /> Loading...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {banners.map((item) => (
              <div key={item._id} className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                <div
                  className="relative w-full h-56 rounded-xl overflow-hidden bg-cover bg-center p-6 flex flex-col justify-center items-center text-center text-white"
                  style={{ backgroundImage: `url(${item.backgroundImage})` }}
                >
                  <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-[1px]" />
                  <div className="relative z-10 space-y-2 max-w-2xl">
                    <h2 className="text-2xl font-serif tracking-wide">
                      <span className="text-[#ffc107] font-bold">{item.highlightTitle}</span> {item.mainTitle}
                    </h2>
                    <p className="text-xs text-slate-200 line-clamp-2">{item.description}</p>
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-2 bg-[#008751] text-white text-xs px-4 py-2 rounded-md font-semibold">
                        {item.buttonText} <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-600 hover:text-white transition"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-4 py-2 rounded-lg hover:bg-rose-600 hover:text-white transition"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border my-6">
              <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50">
                <h3 className="text-sm font-bold text-slate-800">
                  {editingId ? 'Edit Admission Banner' : 'Add Admission Banner'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700">Highlight Title</label>
                      <input
                        type="text"
                        required
                        value={formData.highlightTitle}
                        onChange={(e) => setFormData({ ...formData, highlightTitle: e.target.value })}
                        className="w-full border p-2 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700">Main Title</label>
                      <input
                        type="text"
                        required
                        value={formData.mainTitle}
                        onChange={(e) => setFormData({ ...formData, mainTitle: e.target.value })}
                        className="w-full border p-2 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700">Description</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full border p-2 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700">Button Text</label>
                      <input
                        type="text"
                        value={formData.buttonText}
                        onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                        className="w-full border p-2 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700">Button Link</label>
                      <input
                        type="text"
                        value={formData.buttonLink}
                        onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                        className="w-full border p-2 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  {/* Background Image Upload Option */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 mb-1 block">Background Image Upload</label>
                    <label className="border-2 border-dashed border-slate-200 hover:border-[#008751] bg-slate-50 p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer transition">
                      {uploadingImage ? (
                        <div className="flex items-center gap-2 text-xs text-[#008751] font-bold">
                          <Loader2 size={16} className="animate-spin" /> Uploading Background...
                        </div>
                      ) : (
                        <div className="text-center space-y-1">
                          <UploadCloud size={20} className="mx-auto text-slate-400" />
                          <p className="text-xs font-semibold text-slate-600">
                            {formData.backgroundImage ? 'Change Background Image' : 'Upload Background Image'}
                          </p>
                        </div>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2 text-xs font-bold bg-[#008751] text-white rounded-lg flex items-center gap-1.5"
                    >
                      {submitting && <Loader2 size={14} className="animate-spin" />} Save Banner
                    </button>
                  </div>
                </form>

                {/* Live Preview exact same to provided image */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Live Preview</span>
                  <div
                    className="relative w-full h-[320px] rounded-2xl overflow-hidden bg-cover bg-center p-6 flex flex-col justify-center items-center text-center text-white border"
                    style={{ backgroundImage: `url(${formData.backgroundImage || 'https://via.placeholder.com/800x400'})` }}
                  >
                    <div className="absolute inset-0 bg-[#06331e]/80 backdrop-blur-[2px]" />
                    <div className="relative z-10 space-y-3 max-w-md">
                      <h2 className="text-3xl font-serif">
                        <span className="text-[#ffc107] font-bold">{formData.highlightTitle || 'UAMC'}</span>{' '}
                        {formData.mainTitle || 'Admission'}
                      </h2>
                      <p className="text-[11px] leading-relaxed text-slate-200">{formData.description}</p>
                      <div className="pt-2">
                        <a
                          href="#"
                          className="inline-flex items-center gap-2 bg-[#008751] hover:bg-[#007043] text-white text-xs font-medium px-5 py-2.5 rounded-md transition"
                        >
                          {formData.buttonText || 'Learn More'} <ArrowRight size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}