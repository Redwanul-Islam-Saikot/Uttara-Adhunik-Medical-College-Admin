'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  X,
  Edit3,
  Trash2,
  Loader2,
  Search,
  ArrowRight,
  Sparkles,
  LayoutGrid,
  GraduationCap,
  Layers,
  Tag,
  UploadCloud,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';

interface DepartmentSectionData {
  _id?: string;
  title: string;
  description: string;
  searchPlaceholder: string;
  popularSearchTags: string;
  popularProgramTitle: string;
  popularProgramImage: string;
  badgeValue: string;
  badgeLabel: string;
  badgeLogo: string;
  imageRight1: string;
  imageRight2: string;
}

const initialData: DepartmentSectionData = {
  title: 'Find Your Department',
  description:
    'Use the search bar below to explore our comprehensive MBBS program and discover the perfect path to kickstart your medical career. Join UAMC and embark on a journey of academic excellence!',
  searchPlaceholder: 'Find your program like "Department of Phycology"',
  popularSearchTags:
    'Department of Microbiology, Department of Community Medicine, Department of Pathology',
  popularProgramTitle: 'Department of Microbiology',
  popularProgramImage: '',
  badgeValue: '28+',
  badgeLabel: 'Department Available For Student',
  badgeLogo: '',
  imageRight1: '',
  imageRight2: '',
};

export default function AdminDepartmentDashboard() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [sections, setSections] = useState<DepartmentSectionData[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<DepartmentSectionData>(initialData);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/department-section');
      const result = await res.json();

      let dataList: DepartmentSectionData[] = [];
      if (result?.success && result?.data) {
        dataList = Array.isArray(result.data) ? result.data : [result.data];
      } else if (Array.isArray(result)) {
        dataList = result;
      }

      const formattedList = dataList.map((item) => ({
        ...item,
        badgeLogo: item.badgeLogo || '',
        popularSearchTags: Array.isArray(item.popularSearchTags)
          ? item.popularSearchTags.join(', ')
          : item.popularSearchTags || '',
      }));

      setSections(formattedList);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: keyof DepartmentSectionData
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(fieldKey);
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
        setFormData((prev) => ({ ...prev, [fieldKey]: data.secure_url }));
      } else {
        alert(data.error?.message || 'Image upload failed!');
      }
    } catch (err) {
      console.error('Upload Error:', err);
      alert('Error uploading image to server');
    } finally {
      setUploadingImage(null);
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData(initialData);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: DepartmentSectionData) => {
    if (!item._id) {
      alert('ID not found for this card. Try refreshing the page.');
      return;
    }
    setEditingId(item._id);
    setFormData({
      ...item,
      badgeLogo: item.badgeLogo || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      popularSearchTags: typeof formData.popularSearchTags === 'string'
        ? formData.popularSearchTags.split(',').map((t) => t.trim()).filter(Boolean)
        : formData.popularSearchTags,
    };

    try {
      const isUpdating = Boolean(editingId && editingId !== 'undefined');
      const url = isUpdating ? `/api/department-section/${editingId}` : '/api/department-section';
      const method = isUpdating ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok && json.success) {
        alert(isUpdating ? 'Section Updated Successfully!' : 'Section Created Successfully!');
        setIsModalOpen(false);
        fetchData();
      } else {
        alert(json.message || 'Operation failed!');
      }
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || 'Something went wrong!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this section card?')) return;

    try {
      const res = await fetch(`/api/department-section/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Deleted successfully!');
        fetchData();
      } else {
        alert('Failed to delete.');
      }
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || 'Deletion error');
    }
  };

  const parsedTags = typeof formData.popularSearchTags === 'string'
    ? formData.popularSearchTags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200/80">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <LayoutGrid className="text-[#008751]" size={30} />
              Department Sections Manager
            </h1>
            <p className="text-sm font-medium text-slate-500">
              Manage website cards easily with direct file upload and live preview.
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-2xl">
              <div className="p-2 bg-[#008751] text-white rounded-xl shadow-sm">
                <Layers size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Total Cards</p>
                <p className="text-xl font-black text-[#008751] leading-none mt-0.5">{sections.length}</p>
              </div>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 bg-[#008751] hover:bg-[#007043] text-white font-bold text-sm px-6 py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-emerald-900/20 active:scale-95 shrink-0"
            >
              <Plus size={20} />
              <span>Add New Section</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-20 text-center text-slate-500 font-semibold flex justify-center items-center gap-3">
            <Loader2 className="animate-spin text-[#008751]" size={28} />
            <span className="text-base">Loading Cards Dashboard...</span>
          </div>
        ) : sections.length === 0 ? (
          <div className="bg-white p-16 text-center rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Layers size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-700">No Cards Added Yet</h3>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 bg-[#008751] text-white font-bold text-xs px-5 py-3 rounded-xl mt-2"
            >
              <Plus size={16} /> Add First Card
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sections.map((item, index) => {
              const tags = item.popularSearchTags
                ? item.popularSearchTags.split(',').map((t) => t.trim())
                : [];

              return (
                <div
                  key={item._id || index}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 p-6 md:p-8 space-y-6 flex flex-col justify-between"
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <span className="text-xs font-black uppercase text-[#008751] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        Card #{index + 1}
                      </span>
                      {item.badgeValue && (
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
                          {item.badgeLogo && (
                            <img src={item.badgeLogo} alt="Logo" className="w-4 h-4 object-contain" />
                          )}
                          {item.badgeValue} Badge
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-slate-900 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="bg-slate-50/80 border border-slate-200/80 p-4 rounded-2xl flex items-center gap-4">
                      {item.popularProgramImage ? (
                        <img
                          src={item.popularProgramImage}
                          alt="Program"
                          className="w-14 h-14 object-cover rounded-xl border border-white shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-slate-200 rounded-xl shrink-0 flex items-center justify-center text-slate-400">
                          <ImageIcon size={20} />
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                          Featured Program
                        </span>
                        <h4 className="text-sm font-bold text-slate-800 truncate mt-1">
                          {item.popularProgramTitle || 'No Program Title'}
                        </h4>
                      </div>
                    </div>

                    {tags.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <Tag size={12} className="text-slate-400 mr-1" />
                        {tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg"
                          >
                            {tag}
                          </span>
                        ))}
                        {tags.length > 3 && (
                          <span className="text-[10px] font-bold text-slate-400">
                            +{tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-5 border-t border-slate-100 grid grid-cols-2 gap-3 mt-4">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white transition-all border border-indigo-200/80 shadow-sm active:scale-95"
                    >
                      <Edit3 size={16} />
                      <span>Edit Card</span>
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white transition-all border border-rose-200/80 shadow-sm active:scale-95"
                    >
                      <Trash2 size={16} />
                      <span>Delete Card</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-7xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-6">
              <div className="flex items-center justify-between px-8 py-5 border-b bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-100 text-[#008751] rounded-xl">
                    <Sparkles size={20} />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">
                    {editingId ? 'Edit Department Section Card' : 'Add New Department Section Card'}
                  </h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 max-h-[82vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="lg:col-span-5 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full border border-slate-200 p-3 rounded-xl text-xs font-medium focus:outline-none focus:border-[#008751]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full border border-slate-200 p-3 rounded-xl text-xs font-medium focus:outline-none focus:border-[#008751]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Search Placeholder</label>
                    <input
                      type="text"
                      value={formData.searchPlaceholder}
                      onChange={(e) => setFormData({ ...formData, searchPlaceholder: e.target.value })}
                      className="w-full border border-slate-200 p-3 rounded-xl text-xs font-medium focus:outline-none focus:border-[#008751]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Popular Search Tags</label>
                    <input
                      type="text"
                      value={formData.popularSearchTags}
                      onChange={(e) => setFormData({ ...formData, popularSearchTags: e.target.value })}
                      className="w-full border border-slate-200 p-3 rounded-xl text-xs font-medium focus:outline-none focus:border-[#008751]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Popular Program Title</label>
                    <input
                      type="text"
                      value={formData.popularProgramTitle}
                      onChange={(e) => setFormData({ ...formData, popularProgramTitle: e.target.value })}
                      className="w-full border border-slate-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-[#008751]"
                    />
                  </div>

                  <div className="pt-2 border-t">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Program Image Upload</label>
                    <label className="border-2 border-dashed border-slate-200 hover:border-[#008751] bg-slate-50 hover:bg-emerald-50/50 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition text-center group">
                      {uploadingImage === 'popularProgramImage' ? (
                        <div className="flex items-center gap-2 text-xs text-[#008751] font-bold">
                          <Loader2 size={18} className="animate-spin" /> Uploading...
                        </div>
                      ) : formData.popularProgramImage ? (
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                          <CheckCircle2 size={18} /> Uploaded Successfully
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <UploadCloud size={24} className="mx-auto text-slate-400 group-hover:text-[#008751]" />
                          <p className="text-xs font-bold text-slate-600">Click to upload image</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'popularProgramImage')}
                      />
                    </label>
                  </div>

                  <div className="space-y-3 pt-2 border-t">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Badge Value</label>
                        <input
                          type="text"
                          value={formData.badgeValue}
                          onChange={(e) => setFormData({ ...formData, badgeValue: e.target.value })}
                          className="w-full border border-slate-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-[#008751]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Badge Label</label>
                        <input
                          type="text"
                          value={formData.badgeLabel}
                          onChange={(e) => setFormData({ ...formData, badgeLabel: e.target.value })}
                          className="w-full border border-slate-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-[#008751]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Badge Icon / Logo Upload</label>
                      <label className="border-2 border-dashed border-slate-200 hover:border-[#008751] bg-slate-50 hover:bg-emerald-50/50 rounded-2xl p-3 flex items-center justify-between cursor-pointer transition">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                          {formData.badgeLogo ? (
                            <img src={formData.badgeLogo} alt="Badge Logo" className="w-6 h-6 object-contain rounded" />
                          ) : (
                            <UploadCloud size={18} className="text-slate-400" />
                          )}
                          <span>{formData.badgeLogo ? 'Change Badge Logo' : 'Upload Badge Logo/Icon'}</span>
                        </div>
                        {uploadingImage === 'badgeLogo' && <Loader2 size={16} className="animate-spin text-[#008751]" />}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'badgeLogo')}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Right Image 1 Upload</label>
                    <label className="border-2 border-dashed border-slate-200 hover:border-[#008751] bg-slate-50 hover:bg-emerald-50/50 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <UploadCloud size={18} className="text-slate-400" />
                        <span>{formData.imageRight1 ? 'Change Right Image 1' : 'Upload Right Image 1'}</span>
                      </div>
                      {uploadingImage === 'imageRight1' && <Loader2 size={16} className="animate-spin text-[#008751]" />}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'imageRight1')}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Right Image 2 Upload</label>
                    <label className="border-2 border-dashed border-slate-200 hover:border-[#008751] bg-slate-50 hover:bg-emerald-50/50 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <UploadCloud size={18} className="text-slate-400" />
                        <span>{formData.imageRight2 ? 'Change Right Image 2' : 'Upload Right Image 2'}</span>
                      </div>
                      {uploadingImage === 'imageRight2' && <Loader2 size={16} className="animate-spin text-[#008751]" />}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'imageRight2')}
                      />
                    </label>
                  </div>

                  <div className="pt-4 border-t flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 text-xs font-bold bg-[#008751] hover:bg-[#007043] text-white rounded-xl shadow-md transition flex items-center gap-2"
                    >
                      {submitting && <Loader2 size={16} className="animate-spin" />}
                      Save Card Changes
                    </button>
                  </div>
                </form>

                <div className="lg:col-span-7 bg-slate-50 border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-start">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2 flex items-center gap-2">
                    <Sparkles size={14} className="text-[#008751]" /> Exact Live Visual Preview
                  </div>

                  <div className="w-full bg-white p-6 md:p-8 rounded-2xl border border-slate-200/60 shadow-lg grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-7 space-y-4">
                      <h2 className="text-2xl font-black text-[#008751] tracking-tight">
                        {formData.title || 'Find Your Department'}
                      </h2>

                      <p className="text-xs text-slate-500 leading-relaxed">
                        {formData.description || 'Description text placeholder...'}
                      </p>

                      <div className="bg-[#eaedfa]/80 p-3 rounded-xl flex items-center gap-2 text-slate-400 text-xs border border-slate-100">
                        <Search size={16} className="text-[#008751]" />
                        <span className="truncate">{formData.searchPlaceholder}</span>
                      </div>

                      {parsedTags.length > 0 && (
                        <div className="text-xs text-slate-600 leading-normal">
                          <span className="font-bold text-[#008751]">Popular Search: </span>
                          {parsedTags.map((tag, idx) => (
                            <span key={idx} className="underline cursor-pointer mr-1.5">
                              {tag}{idx < parsedTags.length - 1 ? ',' : ''}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="border border-dashed border-[#008751]/50 bg-[#f1f8f4] p-3 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {formData.popularProgramImage ? (
                            <img
                              src={formData.popularProgramImage}
                              alt="Program"
                              className="w-14 h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-14 h-12 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                              <ImageIcon size={18} />
                            </div>
                          )}
                          <div>
                            <span className="bg-[#ffc107] text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded">
                              Popular Program
                            </span>
                            <h4 className="text-xs font-bold text-[#008751] mt-1">
                              {formData.popularProgramTitle}
                            </h4>
                          </div>
                        </div>

                        <div className="bg-[#008751] text-white p-2.5 rounded-lg">
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-5 grid grid-cols-2 gap-2.5 relative">
                      <div className="col-span-1 h-32 rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-slate-100 flex items-center justify-center">
                        {formData.imageRight1 ? (
                          <img src={formData.imageRight1} className="w-full h-full object-cover" alt="R1" />
                        ) : (
                          <ImageIcon className="text-slate-300" size={24} />
                        )}
                      </div>

                      <div className="col-span-1 row-span-2 h-full rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-slate-100 flex items-center justify-center">
                        {formData.imageRight2 ? (
                          <img src={formData.imageRight2} className="w-full h-full object-cover" alt="R2" />
                        ) : (
                          <ImageIcon className="text-slate-300" size={24} />
                        )}
                      </div>

                      <div className="col-span-1 bg-[#6ab089] text-white p-3 rounded-xl flex items-center gap-2 shadow-sm">
                        {formData.badgeLogo ? (
                          <img src={formData.badgeLogo} alt="Badge Logo" className="w-7 h-7 object-contain shrink-0" />
                        ) : (
                          <GraduationCap size={28} className="shrink-0" />
                        )}
                        <div>
                          <div className="text-base font-black">{formData.badgeValue}</div>
                          <div className="text-[9px] leading-tight opacity-90">{formData.badgeLabel}</div>
                        </div>
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