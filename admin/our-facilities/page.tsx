'use client';

import { useState, useEffect } from 'react';
import { Loader2, Save, UploadCloud, Plus, Eye, Edit3, Trash2, X, ExternalLink } from 'lucide-react';

interface FacilityData {
  _id?: string;
  title: string;
  heading: string;
  fullDescription: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  slug?: string;
}

interface ComponentProps {
  categoryName: string;
  apiSlug: string;
}

export default function FacilitySubSectionForm({ categoryName, apiSlug }: ComponentProps) {
  const [mounted, setMounted] = useState(false);
  const [facilitiesList, setFacilitiesList] = useState<FacilityData[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState: FacilityData = {
    title: categoryName,
    heading: `${categoryName} Facilities`,
    fullDescription: '',
    buttonText: 'View Details',
    buttonLink: '#',
    image: '',
  };

  const [formData, setFormData] = useState<FacilityData>(initialFormState);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/our-facilities?slug=${apiSlug}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setFacilitiesList(json.data);
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    fetchData();
  }, [apiSlug, mounted]);

  const handleOpenNewForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: FacilityData) => {
    setFormData(item);
    setEditingId(item._id || null);
    setIsFormOpen(true);
  };

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
        setFormData((prev) => ({ ...prev, image: data.secure_url }));
      }
    } catch (err) {
      alert('Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const endpoint = editingId 
        ? `/api/our-facilities/${editingId}` 
        : `/api/our-facilities`;

      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, slug: apiSlug }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        alert(`${categoryName} saved successfully!`);
        setIsFormOpen(false);
        fetchData();
      } else {
        alert(json.message || 'Failed to save data');
      }
    } catch (err: any) {
      console.error('Save error:', err);
      alert(err.message || 'Error occurred while saving');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm('Are you sure you want to delete this facility?')) return;
    try {
      const res = await fetch(`/api/our-facilities/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (res.ok && json.success) {
        alert('Deleted successfully!');
        fetchData();
      }
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{categoryName} Dashboard</h1>
            <p className="text-xs text-slate-500">Manage and preview all content for {categoryName}.</p>
          </div>
          <button
            onClick={handleOpenNewForm}
            className="flex items-center gap-2 bg-[#008751] hover:bg-[#007043] text-white text-xs font-bold px-5 py-3 rounded-xl transition shadow-md"
          >
            <Plus size={16} />
            <span>Add New {categoryName}</span>
          </button>
        </div>

        {/* Dashboard Items */}
        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <Loader2 className="animate-spin text-[#008751]" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilitiesList.length > 0 ? (
              facilitiesList.map((item, idx) => (
                <div key={item._id || idx} className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
                    {item.image ? (
                      <img src={item.image} alt={item.heading} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-slate-400">No Image Uploaded</div>
                    )}
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#008751] bg-emerald-50 px-2.5 py-1 rounded-md">
                      {item.title || categoryName}
                    </span>
                    <h3 className="font-bold text-slate-800 text-base line-clamp-1">{item.heading}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{item.fullDescription}</p>
                    
                    <div className="pt-4 flex items-center justify-between border-t gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#008751] font-semibold transition"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      {item._id && (
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-700 font-semibold transition"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white p-12 text-center rounded-2xl border text-slate-400 space-y-3">
                <p className="text-sm">No items added yet in {categoryName}.</p>
                <button
                  onClick={handleOpenNewForm}
                  className="inline-flex items-center gap-2 bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl"
                >
                  <Plus size={14} /> Create First Entry
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal Form */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 overflow-y-auto">
            <div className="bg-white rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl my-auto max-h-[90vh] flex flex-col">
              
              <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
                <h2 className="font-bold text-slate-800 text-lg">
                  {editingId ? `Edit ${categoryName}` : `Add New ${categoryName}`}
                </h2>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 overflow-y-auto p-6 gap-8">
                
                {/* Form */}
                <form id="facility-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Tab Name</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full border p-3 rounded-xl text-xs bg-slate-50 outline-none focus:border-[#008751]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Main Heading</label>
                      <input
                        type="text"
                        value={formData.heading}
                        onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                        className="w-full border p-3 rounded-xl text-xs bg-slate-50 outline-none focus:border-[#008751]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Description</label>
                    <textarea
                      rows={5}
                      value={formData.fullDescription}
                      onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                      className="w-full border p-3 rounded-xl text-xs bg-slate-50 outline-none focus:border-[#008751]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Button Text</label>
                      <input
                        type="text"
                        value={formData.buttonText}
                        onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                        className="w-full border p-3 rounded-xl text-xs bg-slate-50 outline-none focus:border-[#008751]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Button Link</label>
                      <input
                        type="text"
                        value={formData.buttonLink}
                        onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                        className="w-full border p-3 rounded-xl text-xs bg-slate-50 outline-none focus:border-[#008751]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">Image</label>
                    <label className="border-2 border-dashed border-slate-200 hover:border-[#008751] bg-slate-50 p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer transition">
                      {uploadingImage ? (
                        <div className="flex items-center gap-2 text-xs text-[#008751] font-bold">
                          <Loader2 size={16} className="animate-spin" /> Uploading...
                        </div>
                      ) : (
                        <div className="text-center space-y-1">
                          <UploadCloud size={20} className="mx-auto text-slate-400" />
                          <p className="text-xs font-semibold text-slate-600">
                            {formData.image ? 'Change Image' : 'Upload Image'}
                          </p>
                        </div>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                </form>

                {/* Live Preview */}
                <div className="bg-slate-100 p-5 rounded-2xl border space-y-3">
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-wider mb-2">
                    <Eye size={14} /> Live Preview
                  </div>

                  <div className="bg-white border rounded-2xl overflow-hidden shadow-sm space-y-0">
                    <div className="h-44 w-full bg-slate-200 overflow-hidden relative">
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-slate-400">
                          Image preview will display here
                        </div>
                      )}
                    </div>
                    <div className="p-5 space-y-3">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-[#008751] bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
                        {formData.title || 'Tab Title'}
                      </span>
                      <h3 className="font-bold text-slate-800 text-lg leading-snug">
                        {formData.heading || 'Main Heading Preview'}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-4">
                        {formData.fullDescription || 'Full description content text will render here...'}
                      </p>
                      <div className="pt-2">
                        <span className="inline-flex items-center gap-1.5 bg-[#008751] text-white text-xs font-bold px-4 py-2 rounded-xl">
                          {formData.buttonText || 'View Details'} <ExternalLink size={12} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  form="facility-form"
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-[#008751] hover:bg-[#007043] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition shadow-md"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  <span>Save Entry</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}