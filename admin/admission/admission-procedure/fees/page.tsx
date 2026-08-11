'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Upload, Loader2, Save, X, Eye } from 'lucide-react';

interface FeesData {
  _id?: string;
  titleGreen: string;
  titleBlack: string;
  descBold: string;
  descNormal: string;
  badgeText: string;
  logoUrl: string;
  imageUrl: string;
}

const emptyForm: FeesData = {
  titleGreen: 'Admission',
  titleBlack: 'Procedure & Fees',
  descBold: 'Uttara Adhunik Medical College (UAMC)',
  descNormal: 'is the teaching and training hospital of the college located in Uttara, Dhaka.',
  badgeText: 'Admission ___',
  logoUrl: '',
  imageUrl: '',
};

// Original Color preserving Image Compression Helper (Supports PNG Transparency & Colors)
const compressImage = (
  file: File,
  maxWidth = 1000,
  quality = 0.8,
  isLogo = false
): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
        }

        // Logo এর জন্য PNG ফরম্যাট ব্যবহার করা হয়েছে যেন কালার এবং ব্যাকগ্রাউন্ড ট্রান্সপারেন্সি ঠিক থাকে
        const mimeType = isLogo || file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        resolve(canvas.toDataURL(mimeType, quality));
      };
    };
  });
};

export default function AdminFeesManager() {
  const [list, setList] = useState<FeesData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FeesData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Optimized Fetch Data
  const fetchData = useCallback(async () => {
    try {
      setFetching(true);
      const res = await fetch('/api/admission/admission-procedure/fees', {
        cache: 'no-store',
      });
      const data = await res.json();
      if (data.success) {
        setList(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch fees data:', err);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fast Compressed File Upload
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'logoUrl' | 'imageUrl'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const isLogo = field === 'logoUrl';
      const compressedBase64 = await compressImage(
        file,
        isLogo ? 400 : 1200,
        0.8,
        isLogo
      );
      setForm((prev) => ({ ...prev, [field]: compressedBase64 }));
    }
  };

  // Edit Action
  const handleEdit = (item: FeesData) => {
    if (!item._id) return;
    setEditId(item._id);
    setForm({
      titleGreen: item.titleGreen || '',
      titleBlack: item.titleBlack || '',
      descBold: item.descBold || '',
      descNormal: item.descNormal || '',
      badgeText: item.badgeText || '',
      logoUrl: item.logoUrl || '',
      imageUrl: item.imageUrl || '',
    });
    setIsModalOpen(true);
  };

  // Delete Action
  const handleDelete = async (id?: string) => {
    if (!id) {
      alert('Invalid ID for deletion');
      return;
    }

    if (!confirm('Are you sure you want to delete this content permanently?')) return;

    try {
      const res = await fetch(`/api/admission/admission-procedure/fees/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        setList((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert(data.message || 'Delete failed from server');
      }
    } catch (err) {
      alert('Network error while deleting');
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editId ? 'PUT' : 'POST';
      const url = editId
        ? `/api/admission/admission-procedure/fees/${editId}`
        : '/api/admission/admission-procedure/fees';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsModalOpen(false);
        setEditId(null);
        setForm(emptyForm);
        fetchData();
      } else {
        alert(data.message || 'Saving failed!');
      }
    } catch (err) {
      alert('Error saving data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:ml-72 p-4 sm:p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Fees Section Manager
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your frontend Admission Procedure & Fees dynamic section content.
          </p>
        </div>

        <button
          onClick={() => {
            setEditId(null);
            setForm(emptyForm);
            setIsModalOpen(true);
          }}
          className="bg-[#008751] hover:bg-[#007043] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-emerald-600/20 active:scale-95"
        >
          <Plus size={18} /> Add New Section
        </button>
      </div>

      {/* Dashboard Content Grid */}
      {fetching ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 size={36} className="animate-spin text-[#008751]" />
          <p className="text-xs font-semibold text-gray-500">Fast Loading Content...</p>
        </div>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 bg-emerald-50 text-[#008751] rounded-full flex items-center justify-center mx-auto">
            <Plus size={24} />
          </div>
          <h3 className="text-base font-bold text-gray-800">No Content Added Yet</h3>
          <p className="text-xs text-gray-500">
            Frontend is currently blank. Click below to add admission fees banner data.
          </p>
          <button
            onClick={() => {
              setEditId(null);
              setForm(emptyForm);
              setIsModalOpen(true);
            }}
            className="text-xs bg-[#008751] text-white px-4 py-2 rounded-lg font-bold inline-block"
          >
            Create First Section
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {list.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5 space-y-4">
                {/* Header & Controls */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-3">
                    {item.logoUrl ? (
                      <img
                        src={item.logoUrl}
                        alt="Logo"
                        className="w-10 h-10 object-contain p-1 border rounded-lg bg-white"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                        No Logo
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900 text-base leading-snug">
                        <span className="text-[#008751]">{item.titleGreen}</span>{' '}
                        {item.titleBlack}
                      </h3>
                      <span className="text-[10px] font-semibold bg-emerald-100 text-[#008751] px-2 py-0.5 rounded-full inline-block mt-0.5">
                        Active on Frontend
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border">
                    <button
                      onClick={() => handleEdit(item)}
                      title="Edit"
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      title="Delete"
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-white rounded-lg transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Text Description */}
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                  <strong className="text-gray-900">{item.descBold} </strong>
                  {item.descNormal}
                </p>

                {/* Banner Thumbnail */}
                {item.imageUrl && (
                  <div className="relative rounded-xl overflow-hidden h-36 bg-gray-100 border">
                    <img
                      src={item.imageUrl}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                    {item.badgeText && (
                      <div className="absolute right-0 bottom-3 bg-[#FFC72C] text-gray-900 px-3 py-1 font-bold text-xs rounded-l-md shadow">
                        {item.badgeText}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Popup with Live Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#008751]" />
                <h2 className="font-bold text-gray-900 text-lg">
                  {editId ? 'Edit Fees Section' : 'Create Fees Section'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body: Grid split into Inputs & Live Preview */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Input Section */}
              <form onSubmit={handleSubmit} id="feesForm" className="lg:col-span-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Title (Green Part)
                    </label>
                    <input
                      type="text"
                      value={form.titleGreen}
                      onChange={(e) => setForm({ ...form, titleGreen: e.target.value })}
                      className="w-full border rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#008751] outline-none"
                      placeholder="Admission"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Title (Black Part)
                    </label>
                    <input
                      type="text"
                      value={form.titleBlack}
                      onChange={(e) => setForm({ ...form, titleBlack: e.target.value })}
                      className="w-full border rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#008751] outline-none"
                      placeholder="Procedure & Fees"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Description (Bold Part)
                  </label>
                  <textarea
                    rows={2}
                    value={form.descBold}
                    onChange={(e) => setForm({ ...form, descBold: e.target.value })}
                    className="w-full border rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#008751] outline-none"
                    placeholder="College Name or Highlighted text..."
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Description (Normal Part)
                  </label>
                  <textarea
                    rows={3}
                    value={form.descNormal}
                    onChange={(e) => setForm({ ...form, descNormal: e.target.value })}
                    className="w-full border rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#008751] outline-none"
                    placeholder="Normal detail text description..."
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Yellow Badge Text
                  </label>
                  <input
                    type="text"
                    value={form.badgeText}
                    onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
                    className="w-full border rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#008751] outline-none"
                    placeholder="Admission ___"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Left Logo/Icon
                    </label>
                    <label className="border-2 border-dashed rounded-xl p-3 flex flex-col items-center justify-center gap-1 cursor-pointer bg-gray-50 hover:bg-emerald-50/50 hover:border-[#008751] transition">
                      <Upload size={16} className="text-gray-500" />
                      <span className="text-[11px] font-semibold text-gray-600">
                        Upload Logo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'logoUrl')}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Main Banner Image
                    </label>
                    <label className="border-2 border-dashed rounded-xl p-3 flex flex-col items-center justify-center gap-1 cursor-pointer bg-gray-50 hover:bg-emerald-50/50 hover:border-[#008751] transition">
                      <Upload size={16} className="text-gray-500" />
                      <span className="text-[11px] font-semibold text-gray-600">
                        Upload Banner
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'imageUrl')}
                      />
                    </label>
                  </div>
                </div>
              </form>

              {/* Real-time Live Preview Section */}
              <div className="lg:col-span-6 bg-[#f8faf9] border rounded-2xl p-4 flex flex-col space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xs font-extrabold text-[#008751] flex items-center gap-1.5 uppercase tracking-wider">
                    <Eye size={14} /> Live Frontend Preview
                  </span>
                  <span className="text-[10px] bg-gray-200 text-gray-600 font-bold px-2 py-0.5 rounded">
                    Real-time
                  </span>
                </div>

                <div className="bg-[#EBF5F0] rounded-xl p-4 space-y-4 scale-[0.98] origin-top">
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-6 flex items-center gap-2">
                      {form.logoUrl && (
                        <img
                          src={form.logoUrl}
                          alt="Logo"
                          className="w-8 h-8 object-contain shrink-0"
                        />
                      )}
                      <h4 className="text-lg font-serif font-bold leading-tight">
                        <span className="text-[#00873E]">{form.titleGreen || 'Title'} </span>
                        <span className="text-gray-900">{form.titleBlack}</span>
                      </h4>
                    </div>
                    <div className="col-span-6 text-[10px] text-gray-700 leading-tight">
                      <strong>{form.descBold} </strong>
                      {form.descNormal}
                    </div>
                  </div>

                  {form.imageUrl ? (
                    <div className="relative rounded-lg overflow-hidden h-36 bg-gray-200">
                      <img
                        src={form.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      {form.badgeText && (
                        <div className="absolute right-0 bottom-3 bg-[#FFC72C] text-gray-900 px-3 py-1 font-bold text-xs rounded-l-md">
                          {form.badgeText}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-400">
                      Upload Banner Image to See Preview
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="flex justify-end items-center gap-3 px-6 py-4 border-t bg-gray-50/50">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="feesForm"
                disabled={loading}
                className="px-6 py-2.5 bg-[#008751] hover:bg-[#007043] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md shadow-emerald-600/20"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save size={15} /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}