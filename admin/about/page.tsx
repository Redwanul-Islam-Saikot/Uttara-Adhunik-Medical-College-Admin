'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  Image as ImageIcon,
  Upload,
  Info,
  Sparkles,
  GraduationCap,
} from 'lucide-react';

export default function AdminAboutDashboard() {
  const [aboutSections, setAboutSections] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    tagline: 'knowledge meets innovation',
    taglineLogo: '',
    titlePrefix: 'About ',
    titleHighlight: 'UAMC',
    description1Bold: '', // Bold part for description 1
    description1: '',     // Normal part for description 1
    description2: '',
    missionText: 'College Mission Statement',
    missionLogo: '',
    visionText: 'College Vision Achievement',
    visionLogo: '',
    buttonText: 'View Our Program',
    buttonLink: '/program',
    image1: '',
    image2: '',
    logo: '',
  });

  // Local Image File States
  const [image1File, setImage1File] = useState<File | null>(null);
  const [image2File, setImage2File] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [taglineLogoFile, setTaglineLogoFile] = useState<File | null>(null);
  const [missionLogoFile, setMissionLogoFile] = useState<File | null>(null);
  const [visionLogoFile, setVisionLogoFile] = useState<File | null>(null);

  // Image Preview States
  const [image1Preview, setImage1Preview] = useState<string | null>(null);
  const [image2Preview, setImage2Preview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [taglineLogoPreview, setTaglineLogoPreview] = useState<string | null>(null);
  const [missionLogoPreview, setMissionLogoPreview] = useState<string | null>(null);
  const [visionLogoPreview, setVisionLogoPreview] = useState<string | null>(null);

  const fetchAboutSections = async () => {
    try {
      setFetching(true);
      const res = await fetch('/api/about', { cache: 'no-store' });
      const text = await res.text();
      if (!text) {
        setAboutSections([]);
        return;
      }

      const data = JSON.parse(text);

      if (data.success && Array.isArray(data.data)) {
        setAboutSections(data.data);
      } else if (Array.isArray(data)) {
        setAboutSections(data);
      } else if (data && typeof data === 'object') {
        setAboutSections(Array.isArray(data.data) ? data.data : [data]);
      } else {
        setAboutSections([]);
      }
    } catch (error) {
      console.error('Failed to fetch about data:', error);
      setAboutSections([]);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchAboutSections();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setImage1File(null);
    setImage2File(null);
    setLogoFile(null);
    setTaglineLogoFile(null);
    setMissionLogoFile(null);
    setVisionLogoFile(null);

    setImage1Preview(null);
    setImage2Preview(null);
    setLogoPreview(null);
    setTaglineLogoPreview(null);
    setMissionLogoPreview(null);
    setVisionLogoPreview(null);

    setFormData({
      tagline: 'knowledge meets innovation',
      taglineLogo: '',
      titlePrefix: 'About ',
      titleHighlight: 'UAMC',
      description1Bold: '',
      description1: '',
      description2: '',
      missionText: 'College Mission Statement',
      missionLogo: '',
      visionText: 'College Vision Achievement',
      visionLogo: '',
      buttonText: 'View Our Program',
      buttonLink: '/program',
      image1: '',
      image2: '',
      logo: '',
    });
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    const targetId = item._id || item.id;
    if (!targetId) {
      alert('Cannot edit: Invalid item ID.');
      return;
    }
    setEditingId(String(targetId));

    setFormData({
      tagline: item.tagline || 'knowledge meets innovation',
      taglineLogo: item.taglineLogo || '',
      titlePrefix: item.titlePrefix || 'About ',
      titleHighlight: item.titleHighlight || 'UAMC',
      description1Bold: item.description1Bold || '',
      description1: item.description1 || '',
      description2: item.description2 || '',
      missionText: item.missionText || 'College Mission Statement',
      missionLogo: item.missionLogo || '',
      visionText: item.visionText || 'College Vision Achievement',
      visionLogo: item.visionLogo || '',
      buttonText: item.buttonText || 'View Our Program',
      buttonLink: item.buttonLink || '/program',
      image1: item.image1 || '',
      image2: item.image2 || '',
      logo: item.logo || '',
    });

    setImage1Preview(item.image1 || null);
    setImage2Preview(item.image2 || null);
    setLogoPreview(item.logo || null);
    setTaglineLogoPreview(item.taglineLogo || null);
    setMissionLogoPreview(item.missionLogo || null);
    setVisionLogoPreview(item.visionLogo || null);

    setIsModalOpen(true);
  };

  const uploadToCloudinary = async (file: File) => {
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
    if (!res.ok) throw new Error(data.error?.message || 'Cloudinary upload failed!');
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description1 || !formData.description2) {
      alert('Description 1 and Description 2 are required!');
      return;
    }

    try {
      setLoading(true);

      let image1Url = image1File ? await uploadToCloudinary(image1File) : formData.image1;
      let image2Url = image2File ? await uploadToCloudinary(image2File) : formData.image2;
      let logoUrl = logoFile ? await uploadToCloudinary(logoFile) : formData.logo;
      let taglineLogoUrl = taglineLogoFile ? await uploadToCloudinary(taglineLogoFile) : formData.taglineLogo;
      let missionLogoUrl = missionLogoFile ? await uploadToCloudinary(missionLogoFile) : formData.missionLogo;
      let visionLogoUrl = visionLogoFile ? await uploadToCloudinary(visionLogoFile) : formData.visionLogo;

      if (!image1Url || !image2Url || !logoUrl) {
        alert('Please upload Main Logo, Image 1, and Image 2.');
        setLoading(false);
        return;
      }

      const payload = {
        ...formData,
        image1: image1Url,
        image2: image2Url,
        logo: logoUrl,
        taglineLogo: taglineLogoUrl,
        missionLogo: missionLogoUrl,
        visionLogo: visionLogoUrl,
      };

      if (editingId) {
        const res = await fetch(`/api/about/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          alert('Updated successfully!');
          await fetchAboutSections();
          setIsModalOpen(false);
          resetForm();
        } else {
          const errData = await res.json().catch(() => ({}));
          alert(errData?.error || errData?.message || 'Failed to update section');
        }
      } else {
        const res = await fetch('/api/about', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          alert('Created successfully!');
          await fetchAboutSections();
          setIsModalOpen(false);
          resetForm();
        } else {
          const errData = await res.json().catch(() => ({}));
          alert(errData.error || errData.message || 'Failed to save section');
        }
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) {
      alert('Invalid ID for deletion!');
      return;
    }
    if (!confirm('Are you sure you want to delete this Section?')) return;

    try {
      const res = await fetch(`/api/about/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Deleted successfully!');
        setAboutSections((prev) => prev.filter((item) => (item._id || item.id) !== id));
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'Failed to delete item.');
      }
    } catch (err) {
      console.error('Delete Error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12 lg:p-16 lg:pl-80 w-full antialiased">
      <div className="max-w-[1500px] mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200/60">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="p-3 bg-emerald-50 text-[#008751] rounded-2xl">
                <Info size={24} />
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                About Section Management
              </h1>
            </div>
            <p className="text-sm md:text-base text-slate-500 font-medium pl-1">
              Configure landing page about details matching your Mongoose Schema.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#008751] hover:bg-[#007043] text-white font-semibold text-base px-6 py-4 rounded-2xl transition-all shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            <span>Create New Section</span>
          </button>
        </div>

        {/* Listing Grid */}
        {fetching ? (
          <div className="flex flex-col items-center justify-center py-40 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
            <Loader2 className="animate-spin text-[#008751] mb-4" size={40} />
            <span className="text-base font-semibold text-slate-600">Loading data...</span>
          </div>
        ) : aboutSections.length === 0 ? (
          <div className="bg-white p-16 text-center rounded-3xl border border-dashed border-slate-300 space-y-4">
            <ImageIcon size={48} className="mx-auto text-slate-400" />
            <h3 className="text-lg font-bold text-slate-800">No About Data Found</h3>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 bg-[#008751] text-white text-sm px-5 py-2.5 rounded-xl font-semibold"
            >
              <Plus size={18} /> Add First Section
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aboutSections.map((item: any, index: number) => {
              const itemId = item._id || item.id;
              return (
                <div
                  key={itemId || index}
                  className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="p-8 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      {item.logo ? (
                        <img src={item.logo} alt="Logo" className="h-10 object-contain" />
                      ) : (
                        <span className="text-xs text-slate-400">No Logo</span>
                      )}
                      <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg">
                        {item.taglineLogo && (
                          <img src={item.taglineLogo} alt="Tagline Logo" className="w-4 h-4 object-contain" />
                        )}
                        <span className="text-xs font-bold text-[#008751] uppercase">
                          {item.tagline}
                        </span>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900">
                      {item.titlePrefix} <span className="text-[#008751]">{item.titleHighlight}</span>
                    </h2>

                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {item.description1Bold && (
                        <strong className="font-bold text-slate-900 mr-1">{item.description1Bold}</strong>
                      )}
                      {item.description1}
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-3">
                      {item.image1 && (
                        <img src={item.image1} alt="Img 1" className="w-full h-28 object-cover rounded-2xl" />
                      )}
                      {item.image2 && (
                        <img src={item.image2} alt="Img 2" className="w-full h-28 object-cover rounded-2xl" />
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="flex items-center justify-center gap-2 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-100"
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(itemId)}
                      className="flex items-center justify-center gap-2 py-3 bg-white text-rose-600 border border-slate-200 rounded-xl text-xs font-semibold hover:bg-rose-50"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-10 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Sparkles size={22} className="text-[#008751]" />
                <h2 className="font-bold text-slate-900 text-lg">
                  {editingId ? 'Edit About Section' : 'Create About Section'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
              {/* Form Input Section */}
              <form onSubmit={handleSubmit} className="lg:col-span-7 p-8 space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Main Images Upload (Required)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Main Logo */}
                    <div className="border border-dashed border-slate-200 p-3 rounded-2xl text-center bg-slate-50 relative">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">
                        Main Logo
                      </span>
                      {logoPreview ? (
                        <div className="relative h-16">
                          <img
                            src={logoPreview}
                            className="w-full h-full object-contain rounded-lg"
                            alt="Main Logo"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setLogoFile(null);
                              setLogoPreview(null);
                              setFormData({ ...formData, logo: '' });
                            }}
                            className="absolute -top-1 -right-1 bg-rose-600 text-white p-1 rounded-full"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer block py-3">
                          <Upload size={18} className="mx-auto text-slate-400" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                setLogoFile(f);
                                setLogoPreview(URL.createObjectURL(f));
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>

                    {/* Image 1 */}
                    <div className="border border-dashed border-slate-200 p-3 rounded-2xl text-center bg-slate-50 relative">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">
                        Image 1
                      </span>
                      {image1Preview ? (
                        <div className="relative h-16">
                          <img
                            src={image1Preview}
                            className="w-full h-full object-cover rounded-lg"
                            alt="Image 1"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImage1File(null);
                              setImage1Preview(null);
                              setFormData({ ...formData, image1: '' });
                            }}
                            className="absolute -top-1 -right-1 bg-rose-600 text-white p-1 rounded-full"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer block py-3">
                          <Upload size={18} className="mx-auto text-slate-400" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                setImage1File(f);
                                setImage1Preview(URL.createObjectURL(f));
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>

                    {/* Image 2 */}
                    <div className="border border-dashed border-slate-200 p-3 rounded-2xl text-center bg-slate-50 relative">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">
                        Image 2
                      </span>
                      {image2Preview ? (
                        <div className="relative h-16">
                          <img
                            src={image2Preview}
                            className="w-full h-full object-cover rounded-lg"
                            alt="Image 2"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImage2File(null);
                              setImage2Preview(null);
                              setFormData({ ...formData, image2: '' });
                            }}
                            className="absolute -top-1 -right-1 bg-rose-600 text-white p-1 rounded-full"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer block py-3">
                          <Upload size={18} className="mx-auto text-slate-400" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                setImage2File(f);
                                setImage2Preview(URL.createObjectURL(f));
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tagline & Tagline Logo */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center p-3 border border-slate-200 bg-slate-50/50 rounded-2xl">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      className="w-full border border-slate-200 p-3 rounded-xl text-xs outline-none bg-white focus:border-[#008751]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Tagline Icon/Logo
                    </label>
                    <div className="flex items-center gap-2">
                      {taglineLogoPreview ? (
                        <div className="relative w-12 h-12 border rounded-xl overflow-hidden shrink-0 bg-white">
                          <img
                            src={taglineLogoPreview}
                            className="w-full h-full object-contain p-1"
                            alt="Tagline Logo"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setTaglineLogoFile(null);
                              setTaglineLogoPreview(null);
                              setFormData({ ...formData, taglineLogo: '' });
                            }}
                            className="absolute top-0 right-0 bg-rose-600 text-white p-0.5 rounded-full"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer border border-dashed border-slate-300 bg-white p-2.5 rounded-xl w-full text-center hover:bg-slate-50">
                          <Upload size={16} className="mx-auto text-slate-500" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                setTaglineLogoFile(f);
                                setTaglineLogoPreview(URL.createObjectURL(f));
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Title Prefix
                    </label>
                    <input
                      type="text"
                      value={formData.titlePrefix}
                      onChange={(e) => setFormData({ ...formData, titlePrefix: e.target.value })}
                      className="w-full border border-slate-200 p-3 rounded-xl text-xs outline-none focus:border-[#008751]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Title Highlight
                    </label>
                    <input
                      type="text"
                      value={formData.titleHighlight}
                      onChange={(e) => setFormData({ ...formData, titleHighlight: e.target.value })}
                      className="w-full border border-slate-200 p-3 rounded-xl text-xs font-bold text-[#008751] outline-none focus:border-[#008751]"
                    />
                  </div>
                </div>

                {/* Description 1 Inputs (Bold Part + Normal Part) */}
                <div className="space-y-3 p-4 border border-slate-200 bg-slate-50/50 rounded-2xl">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Description 1 (Split Section)
                  </span>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Description 1 (Bold / Lead Text)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Welcome to UAMC College,"
                      value={formData.description1Bold}
                      onChange={(e) => setFormData({ ...formData, description1Bold: e.target.value })}
                      className="w-full border border-slate-200 p-3 rounded-xl text-xs font-bold outline-none bg-white focus:border-[#008751]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Description 1 (Normal Text) *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="e.g. where education meets excellence..."
                      value={formData.description1}
                      onChange={(e) => setFormData({ ...formData, description1: e.target.value })}
                      className="w-full border border-slate-200 p-3 rounded-xl text-xs outline-none bg-white resize-none focus:border-[#008751]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Description 2 *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description2}
                    onChange={(e) => setFormData({ ...formData, description2: e.target.value })}
                    className="w-full border border-slate-200 p-3 rounded-xl text-xs outline-none resize-none focus:border-[#008751]"
                  />
                </div>

                {/* Mission & Vision Section */}
                <div className="p-4 border border-slate-200 bg-slate-50/50 rounded-2xl space-y-4">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Mission & Vision Options
                  </span>

                  {/* Mission */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Mission Statement
                      </label>
                      <input
                        type="text"
                        value={formData.missionText}
                        onChange={(e) => setFormData({ ...formData, missionText: e.target.value })}
                        className="w-full border border-slate-200 p-2.5 rounded-xl text-xs outline-none bg-white focus:border-[#008751]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Mission Logo
                      </label>
                      <div className="flex items-center gap-2">
                        {missionLogoPreview ? (
                          <div className="relative w-12 h-12 border rounded-xl overflow-hidden shrink-0 bg-white">
                            <img
                              src={missionLogoPreview}
                              className="w-full h-full object-contain p-1"
                              alt="Mission Logo"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setMissionLogoFile(null);
                                setMissionLogoPreview(null);
                                setFormData({ ...formData, missionLogo: '' });
                              }}
                              className="absolute top-0 right-0 bg-rose-600 text-white p-0.5 rounded-full"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer border border-dashed border-slate-300 bg-white p-2.5 rounded-xl w-full text-center hover:bg-slate-50">
                            <Upload size={16} className="mx-auto text-slate-500" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) {
                                  setMissionLogoFile(f);
                                  setMissionLogoPreview(URL.createObjectURL(f));
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Vision */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-2">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Vision Statement
                      </label>
                      <input
                        type="text"
                        value={formData.visionText}
                        onChange={(e) => setFormData({ ...formData, visionText: e.target.value })}
                        className="w-full border border-slate-200 p-2.5 rounded-xl text-xs outline-none bg-white focus:border-[#008751]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Vision Logo
                      </label>
                      <div className="flex items-center gap-2">
                        {visionLogoPreview ? (
                          <div className="relative w-12 h-12 border rounded-xl overflow-hidden shrink-0 bg-white">
                            <img
                              src={visionLogoPreview}
                              className="w-full h-full object-contain p-1"
                              alt="Vision Logo"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setVisionLogoFile(null);
                                setVisionLogoPreview(null);
                                setFormData({ ...formData, visionLogo: '' });
                              }}
                              className="absolute top-0 right-0 bg-rose-600 text-white p-0.5 rounded-full"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer border border-dashed border-slate-300 bg-white p-2.5 rounded-xl w-full text-center hover:bg-slate-50">
                            <Upload size={16} className="mx-auto text-slate-500" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) {
                                  setVisionLogoFile(f);
                                  setVisionLogoPreview(URL.createObjectURL(f));
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Button Action Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={formData.buttonText}
                      onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                      className="w-full border border-slate-200 p-3 rounded-xl text-xs outline-none focus:border-[#008751]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Button Link
                    </label>
                    <input
                      type="text"
                      value={formData.buttonLink}
                      onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                      className="w-full border border-slate-200 p-3 rounded-xl text-xs outline-none focus:border-[#008751]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="px-6 py-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 bg-[#008751] hover:bg-[#007043] text-white px-8 py-3 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    {loading && <Loader2 className="animate-spin" size={16} />}
                    {editingId ? 'Update Section' : 'Create Section'}
                  </button>
                </div>
              </form>

              {/* Realtime Preview Section */}
              <div className="lg:col-span-5 bg-slate-900 text-white p-8 space-y-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <GraduationCap size={16} />
                    <span>Live Component Preview</span>
                  </div>

                  <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-4">
                    {/* Header preview */}
                    <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                      {logoPreview ? (
                        <img src={logoPreview} className="h-8 object-contain" alt="Preview Logo" />
                      ) : (
                        <span className="text-xs text-slate-500">Logo PlaceHolder</span>
                      )}
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase font-bold tracking-wider">
                        {formData.tagline || 'TAGLINE'}
                      </span>
                    </div>

                    {/* Title preview */}
                    <h3 className="text-xl font-bold text-white">
                      {formData.titlePrefix}
                      <span className="text-emerald-400"> {formData.titleHighlight}</span>
                    </h3>

                    {/* Descriptions preview */}
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {formData.description1Bold && (
                        <strong className="text-white mr-1">{formData.description1Bold}</strong>
                      )}
                      {formData.description1 || 'Description 1 text preview will render here...'}
                    </p>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {formData.description2 || 'Description 2 text preview will render here...'}
                    </p>

                    {/* Images preview */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="h-24 bg-slate-700/50 rounded-xl overflow-hidden border border-slate-700">
                        {image1Preview ? (
                          <img src={image1Preview} className="w-full h-full object-cover" alt="Image 1" />
                        ) : (
                          <div className="h-full flex items-center justify-center text-[10px] text-slate-500">Image 1</div>
                        )}
                      </div>
                      <div className="h-24 bg-slate-700/50 rounded-xl overflow-hidden border border-slate-700">
                        {image2Preview ? (
                          <img src={image2Preview} className="w-full h-full object-cover" alt="Image 2" />
                        ) : (
                          <div className="h-full flex items-center justify-center text-[10px] text-slate-500">Image 2</div>
                        )}
                      </div>
                    </div>

                    {/* Mission Vision preview */}
                    <div className="space-y-2 pt-2">
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/50 flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">{formData.missionText}</span>
                        {missionLogoPreview && (
                          <img src={missionLogoPreview} className="w-5 h-5 object-contain" alt="Mission" />
                        )}
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/50 flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">{formData.visionText}</span>
                        {visionLogoPreview && (
                          <img src={visionLogoPreview} className="w-5 h-5 object-contain" alt="Vision" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400">
                  Changes will update directly on the active website upon submitting.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}