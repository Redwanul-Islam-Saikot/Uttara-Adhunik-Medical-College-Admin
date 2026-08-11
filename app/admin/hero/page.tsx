'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
  Image as ImageIcon,
  UploadCloud,
  Eye,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';

export default function AdminHeroDashboard() {
  const [banners, setBanners] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    tagline: '',
    titleWhite1: '',
    titleYellow: '',
    titleWhite2: '',
    buttonText: '',
    buttonLink: '',
    programSectionTitle: '',
    programs: [] as { title: string; description: string }[],
  });

  const [programInput, setProgramInput] = useState({ title: '', description: '' });

  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');

  // SAFE FETCH FUNCTION
  const fetchBanners = async () => {
    try {
      setFetching(true);
      const res = await fetch('/api/hero', { cache: 'no-store' });

      const text = await res.text();
      if (!text) {
        setBanners([]);
        return;
      }

      const data = JSON.parse(text);

      if (data.success && Array.isArray(data.data)) {
        setBanners(data.data);
      } else if (Array.isArray(data)) {
        setBanners(data);
      } else {
        setBanners([]);
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error);
      setBanners([]);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFile(null);
    setFilePreview(null);
    setCurrentImageUrl('');
    setFormData({
      tagline: '',
      titleWhite1: '',
      titleYellow: '',
      titleWhite2: '',
      buttonText: '',
      buttonLink: '',
      programSectionTitle: '',
      programs: [],
    });
    setProgramInput({ title: '', description: '' });
  };

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setFilePreview(null);
    }
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    const targetId = item._id || item.id;
    setEditingId(targetId);
    setCurrentImageUrl(item.bgImage || item.imageUrl || '');
    setFormData({
      tagline: item.tagline || '',
      titleWhite1: item.titleWhite1 || '',
      titleYellow: item.titleYellow || '',
      titleWhite2: item.titleWhite2 || '',
      buttonText: item.buttonText || '',
      buttonLink: item.buttonLink || '',
      programSectionTitle: item.programSectionTitle || '',
      programs: item.programs || [],
    });
    setFile(null);
    setFilePreview(null);
    setIsModalOpen(true);
  };

  const handleAddProgram = () => {
    if (!programInput.title || !programInput.description)
      return alert('Enter program title & description');
    setFormData({
      ...formData,
      programs: [...formData.programs, programInput],
    });
    setProgramInput({ title: '', description: '' });
  };

  const handleRemoveProgram = (index: number) => {
    setFormData({
      ...formData,
      programs: formData.programs.filter((_, idx) => idx !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      let bgImage = currentImageUrl;

      if (file) {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'bylxfdh4';
        const uploadPreset =
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'maheen-accessories';

        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('upload_preset', uploadPreset);

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: uploadData,
          }
        );

        const cloudData = await cloudRes.json();

        if (!cloudRes.ok) {
          throw new Error(cloudData.error?.message || 'Cloudinary upload failed!');
        }

        bgImage = cloudData.secure_url;
      }

      const payload = { ...formData, bgImage };

      if (editingId) {
        const res = await fetch(`/api/hero/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        let result = null;
        const responseText = await res.text();
        if (responseText) {
          try {
            result = JSON.parse(responseText);
          } catch (e) {
            console.error('Invalid JSON:', responseText);
          }
        }

        if (res.ok) {
          alert('Hero Banner updated successfully!');
          fetchBanners();
          setIsModalOpen(false);
          resetForm();
        } else {
          alert(result?.error || 'Failed to update data!');
        }
      } else {
        const res = await fetch('/api/hero', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, _id: Date.now().toString() }),
        });

        const result = await res.json();

        if (res.ok) {
          alert('Hero Slide added successfully!');
          fetchBanners();
          setIsModalOpen(false);
          resetForm();
        } else {
          alert(result.error || 'Failed to save data!');
        }
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      const res = await fetch(`/api/hero/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBanners((prev) => prev.filter((item) => (item._id || item.id) !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 p-4 md:p-8 lg:pl-72 w-full overflow-x-hidden">
      <div className="w-full space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/80 w-full">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hero Section Management
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Total Active Slides:{' '}
              <span className="text-[#008751] font-bold">{banners.length}</span>
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-[#008751] hover:bg-[#006e42] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg shrink-0"
          >
            <Plus size={20} strokeWidth={2.5} />
            <span>Add New Slide</span>
          </button>
        </div>

        {/* Content Section */}
        {fetching ? (
          <div className="flex items-center justify-center py-24 text-slate-400 gap-3">
            <Loader2 className="animate-spin text-[#008751]" size={28} />
            <span className="font-semibold text-slate-600">Loading Hero Banners...</span>
          </div>
        ) : banners.length === 0 ? (
          <div className="bg-white p-16 rounded-2xl border-2 border-dashed border-slate-300 text-center space-y-4 w-full">
            <ImageIcon className="mx-auto text-slate-300" size={56} />
            <p className="text-slate-600 text-base font-semibold">
              No Hero Section added yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
            {banners.map((item: any) => {
              const bannerId = item._id || item.id;
              return (
                <div
                  key={bannerId}
                  className="group bg-white border border-slate-200 hover:border-[#008751]/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="p-3 bg-slate-900 border-b border-slate-100 relative aspect-[16/9] flex items-center justify-center overflow-hidden">
                      {item.bgImage ? (
                        <img
                          src={item.bgImage}
                          alt={item.titleWhite1 || 'Hero Slide'}
                          className="w-full h-full object-cover opacity-80 rounded-lg transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <span className="text-xs text-slate-500">No Image</span>
                      )}
                    </div>

                    <div className="p-6 space-y-3">
                      {item.tagline && (
                        <span className="inline-block px-3 py-1 bg-[#008751]/10 text-[#008751] text-xs font-extrabold uppercase tracking-wider rounded-md">
                          {item.tagline}
                        </span>
                      )}

                      <h2 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2">
                        {item.titleWhite1}{' '}
                        <span className="text-amber-500">{item.titleYellow}</span>{' '}
                        {item.titleWhite2}
                      </h2>

                      <p className="text-sm text-slate-500 font-medium">
                        Cards/Programs:{' '}
                        <span className="font-bold text-slate-800">
                          {item.programs?.length || 0} items
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/80">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-200/80 hover:bg-[#008751] text-slate-800 hover:text-white rounded-xl transition-all duration-200 text-xs font-bold shadow-sm"
                    >
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(bannerId)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-100/70 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200/60 hover:border-rose-600 rounded-xl transition-all duration-200 text-xs font-bold shadow-sm"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="font-bold text-slate-900 text-lg">
                {editingId ? 'Edit Hero Banner' : 'Add New Hero Slide'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
              <form onSubmit={handleSubmit} className="lg:col-span-7 p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Background Image
                  </label>

                  {filePreview || currentImageUrl ? (
                    <div className="relative border-2 border-slate-200 rounded-xl p-2 bg-slate-50 flex items-center justify-center group h-32">
                      <img
                        src={filePreview || currentImageUrl}
                        alt="Preview"
                        className="max-h-full max-w-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setFilePreview(null);
                          setCurrentImageUrl('');
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50">
                      <UploadCloud className="text-slate-400 mb-1" size={24} />
                      <span className="text-xs font-bold text-slate-700">
                        Click to upload image
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) =>
                      setFormData({ ...formData, tagline: e.target.value })
                    }
                    className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-[#008751]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Title Part 1
                    </label>
                    <input
                      type="text"
                      value={formData.titleWhite1}
                      onChange={(e) =>
                        setFormData({ ...formData, titleWhite1: e.target.value })
                      }
                      className="w-full border border-slate-200 p-2 rounded-xl text-xs focus:outline-none focus:border-[#008751]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Title Highlight
                    </label>
                    <input
                      type="text"
                      value={formData.titleYellow}
                      onChange={(e) =>
                        setFormData({ ...formData, titleYellow: e.target.value })
                      }
                      className="w-full border border-slate-200 p-2 rounded-xl text-xs focus:outline-none focus:border-[#008751] text-amber-600 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Title Part 2
                    </label>
                    <input
                      type="text"
                      value={formData.titleWhite2}
                      onChange={(e) =>
                        setFormData({ ...formData, titleWhite2: e.target.value })
                      }
                      className="w-full border border-slate-200 p-2 rounded-xl text-xs focus:outline-none focus:border-[#008751]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={formData.buttonText}
                      onChange={(e) =>
                        setFormData({ ...formData, buttonText: e.target.value })
                      }
                      className="w-full border border-slate-200 p-2 rounded-xl text-xs focus:outline-none focus:border-[#008751]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Button Link
                    </label>
                    <input
                      type="text"
                      value={formData.buttonLink}
                      onChange={(e) =>
                        setFormData({ ...formData, buttonLink: e.target.value })
                      }
                      className="w-full border border-slate-200 p-2 rounded-xl text-xs focus:outline-none focus:border-[#008751]"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Side Cards Section Title
                  </label>
                  <input
                    type="text"
                    value={formData.programSectionTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, programSectionTitle: e.target.value })
                    }
                    className="w-full border border-slate-200 p-2 rounded-xl text-xs focus:outline-none focus:border-[#008751]"
                  />
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-700">
                    Add Side Cards / Items
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Card Title"
                      value={programInput.title}
                      onChange={(e) =>
                        setProgramInput({ ...programInput, title: e.target.value })
                      }
                      className="border border-slate-200 p-2 rounded-lg text-xs bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Card Description"
                      value={programInput.description}
                      onChange={(e) =>
                        setProgramInput({
                          ...programInput,
                          description: e.target.value,
                        })
                      }
                      className="border border-slate-200 p-2 rounded-lg text-xs bg-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddProgram}
                    className="w-full py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg"
                  >
                    + Add Card Item
                  </button>

                  {formData.programs.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      {formData.programs.map((p, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200 text-xs"
                        >
                          <div>
                            <p className="font-bold text-slate-800">{p.title}</p>
                            <p className="text-[10px] text-slate-500 line-clamp-1">
                              {p.description}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveProgram(idx)}
                            className="text-red-500 p-1"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-[#008751] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingId ? 'Update Slide' : 'Save Slide'}</span>
                    )}
                  </button>
                </div>
              </form>

              {/* Preview */}
              <div className="lg:col-span-5 bg-gray-950 p-6 flex flex-col justify-between text-white relative overflow-hidden">
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-2">
                      <Eye size={16} /> Hero Section Live Preview
                    </span>
                  </div>

                  <div className="border border-white/10 rounded-2xl p-5 space-y-4 bg-black/40 backdrop-blur-sm relative overflow-hidden min-h-[360px] flex flex-col justify-between">
                    {(filePreview || currentImageUrl) && (
                      <img
                        src={filePreview || currentImageUrl}
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
                      />
                    )}

                    <div className="relative z-10 space-y-3">
                      {formData.tagline && (
                        <div className="flex items-center gap-1.5 text-emerald-300 text-[11px] font-semibold">
                          <GraduationCap size={14} className="text-amber-400" />
                          <span>{formData.tagline}</span>
                        </div>
                      )}

                      <h3 className="text-lg font-extrabold text-white leading-snug">
                        {formData.titleWhite1 || 'Main Title'}{' '}
                        <span className="text-amber-400">
                          {formData.titleYellow || 'Highlight'}
                        </span>{' '}
                        {formData.titleWhite2}
                      </h3>

                      {formData.buttonText && (
                        <div className="pt-1">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-emerald-950 font-bold text-[10px] rounded-md shadow">
                            <span>{formData.buttonText}</span>
                            <ArrowRight size={12} />
                          </span>
                        </div>
                      )}
                    </div>

                    {formData.programs.length > 0 && (
                      <div className="relative z-10 bg-white/10 border border-white/15 p-3 rounded-xl space-y-2">
                        {formData.programSectionTitle && (
                          <h4 className="text-amber-400 font-bold text-xs border-b border-white/10 pb-1">
                            {formData.programSectionTitle}
                          </h4>
                        )}
                        <div className="space-y-1.5">
                          {formData.programs.map((p, idx) => (
                            <div key={idx} className="space-y-0.5">
                              <p className="text-xs font-bold text-white flex items-center justify-between">
                                <span>{p.title}</span>
                                <ArrowRight size={10} className="text-gray-400" />
                              </p>
                              <p className="text-[10px] text-gray-300 line-clamp-1">
                                {p.description}
                              </p>
                            </div>
                          ))}
                        </div>
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