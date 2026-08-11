'use client';

import { useState, useEffect } from 'react';
import {
  Save,
  Trash2,
  Edit,
  Plus,
  X,
  Eye,
  Upload,
  Loader2,
  Building2,
  Layout,
  GraduationCap,
  Bell,
  PhoneCall,
} from 'lucide-react';

interface HeroBannerData {
  _id?: string;
  page: string;
  breadcrumb: string;
  titleRegular: string;
  titleBold: string;
  logoUrl: string;
  bgImageUrl: string;
}

export default function AdminHeroManager() {
  // Support: 'overview' | 'facilities' | 'admission' | 'notice' | 'contact'
  const [activeSection, setActiveSection] = useState<string>('overview');

  const [list, setList] = useState<HeroBannerData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const API_URL = '/api/overview/hero-banner';

  // Helper to set default values per section tab
  const getDefaultValues = (section: string) => {
    switch (section) {
      case 'facilities':
        return {
          breadcrumb: 'HOME > FACILITIES >> ',
          titleRegular: 'FACILITIES',
          titleBold: 'UAMC',
        };
      case 'admission':
        return {
          breadcrumb: 'HOME > ADMISSION >> ',
          titleRegular: 'Admission',
          titleBold: 'UAMC',
        };
      case 'notice':
        return {
          breadcrumb: 'HOME > NOTICE & MEDIA >> ',
          titleRegular: 'Notice',
          titleBold: 'UAMC',
        };
      case 'contact':
        return {
          breadcrumb: 'HOME > CONTACT US >> ',
          titleRegular: 'Contact',
          titleBold: 'UAMC',
        };
      default:
        return {
          breadcrumb: 'HOME > ABOUT UAMC >> ',
          titleRegular: 'About',
          titleBold: 'UAMC',
        };
    }
  };

  const emptyFormState: HeroBannerData = {
    page: activeSection,
    ...getDefaultValues(activeSection),
    logoUrl: '',
    bgImageUrl: '',
  };

  const [form, setForm] = useState<HeroBannerData>(emptyFormState);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}?page=${activeSection}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success) setList(data.data || []);
      else setList([]);
    } catch (error) {
      console.error('Fetch error:', error);
      setList([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeSection]);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'logoUrl' | 'bgImageUrl'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAddModal = () => {
    setEditId(null);
    setForm({
      page: activeSection,
      ...getDefaultValues(activeSection),
      logoUrl: '',
      bgImageUrl: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: HeroBannerData) => {
    if (!item._id) return alert('Error: Banner ID not found!');
    setEditId(item._id);
    setForm({
      page: item.page || activeSection,
      breadcrumb: item.breadcrumb || '',
      titleRegular: item.titleRegular || '',
      titleBold: item.titleBold || '',
      logoUrl: item.logoUrl || '',
      bgImageUrl: item.bgImageUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const method = editId ? 'PUT' : 'POST';
      const url = editId ? `${API_URL}/${editId}` : API_URL;
      const payload = { ...form, page: activeSection };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsModalOpen(false);
        setEditId(null);
        fetchData();
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (err) {
      alert('Network or Server error!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id?: string) => {
    e.stopPropagation();
    if (!id) return;

    if (confirm('Are you sure you want to delete this hero banner?')) {
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (res.ok && data.success) fetchData();
        else alert(data.message || 'Delete failed');
      } catch (err) {
        alert('Could not delete item.');
      }
    }
  };

  return (
    <div className="lg:ml-72 p-6 space-y-6 transition-all duration-300 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Hero Banner Manager
          </h1>
          <p className="text-xs text-gray-500">
            Managing banners via <code className="text-[#008751] font-mono">/api/overview/hero-banner</code>
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-[#008751] hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition shadow-sm"
        >
          <Plus size={16} /> Add {activeSection.toUpperCase()} Banner
        </button>
      </div>

      {/* Dynamic Tabs */}
      <div className="flex flex-wrap gap-2 bg-gray-100 p-1.5 rounded-xl w-fit border border-gray-200">
        <button
          type="button"
          onClick={() => setActiveSection('overview')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition ${
            activeSection === 'overview'
              ? 'bg-white text-[#008751] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Layout size={15} /> Overview
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('facilities')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition ${
            activeSection === 'facilities'
              ? 'bg-white text-[#008751] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Building2 size={15} /> Facilities
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('admission')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition ${
            activeSection === 'admission'
              ? 'bg-white text-[#008751] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <GraduationCap size={15} /> Admission
        </button>

        {/* Notice & Media Tab */}
        <button
          type="button"
          onClick={() => setActiveSection('notice')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition ${
            activeSection === 'notice'
              ? 'bg-white text-[#008751] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Bell size={15} /> Notice & Media
        </button>

        {/* Contact Us Tab */}
        <button
          type="button"
          onClick={() => setActiveSection('contact')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition ${
            activeSection === 'contact'
              ? 'bg-white text-[#008751] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <PhoneCall size={15} /> Contact Us
        </button>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {list.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between"
          >
            <div
              className="w-full bg-cover bg-center p-6 min-h-[160px] flex justify-between items-center relative"
              style={{ backgroundImage: item.bgImageUrl ? `url(${item.bgImageUrl})` : 'none' }}
            >
              <div className="bg-[#a3d9be]/90 p-4 rounded-lg w-full flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-gray-800 uppercase">
                    {item.breadcrumb}
                  </p>
                  <h3 className="text-xl font-serif text-gray-800 mt-1">
                    <span className="font-light">{item.titleRegular}</span>{' '}
                    <span className="font-bold text-[#008751]">
                      {item.titleBold}
                    </span>
                  </h3>
                </div>
                {item.logoUrl && (
                  <img
                    src={item.logoUrl}
                    alt="Logo"
                    className="w-12 h-12 object-contain shrink-0"
                  />
                )}
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">
                Target: <span className="font-bold uppercase text-[#008751]">{item.page}</span>
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  <Edit size={16} />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, item._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <div className="col-span-full bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
            No banners found for <strong>{activeSection}</strong>. Click "Add New" to create one.
          </div>
        )}
      </div>

      {/* Modal Container */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border overflow-hidden my-8">
            <div className="flex justify-between items-center p-5 border-b bg-gray-50">
              <h2 className="text-base font-bold text-gray-800 capitalize">
                {editId ? 'Edit' : 'Add'} {activeSection} Hero Banner
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700">Breadcrumb Text</label>
                  <input
                    type="text"
                    value={form.breadcrumb}
                    onChange={(e) => setForm({ ...form, breadcrumb: e.target.value })}
                    className="w-full border p-2.5 rounded-lg text-xs mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700">Title (Regular Text)</label>
                  <input
                    type="text"
                    value={form.titleRegular}
                    onChange={(e) => setForm({ ...form, titleRegular: e.target.value })}
                    className="w-full border p-2.5 rounded-lg text-xs mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700">Title (Bold Text)</label>
                  <input
                    type="text"
                    value={form.titleBold}
                    onChange={(e) => setForm({ ...form, titleBold: e.target.value })}
                    className="w-full border p-2.5 rounded-lg text-xs mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Logo Image</label>
                  <label className="cursor-pointer bg-gray-50 border p-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 hover:bg-gray-100 transition">
                    <Upload size={14} /> Choose Logo File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'logoUrl')}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-700 block mb-1">Background Image / Pattern</label>
                  <label className="cursor-pointer bg-gray-50 border p-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 hover:bg-gray-100 transition">
                    <Upload size={14} /> Choose Background Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'bgImageUrl')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Live Preview */}
              {(form.breadcrumb || form.titleRegular || form.titleBold || form.logoUrl || form.bgImageUrl) && (
                <div className="border border-gray-200 rounded-xl p-4 bg-slate-50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                    <Eye size={14} /> Live Preview ({activeSection.toUpperCase()})
                  </div>
                  <div
                    className="w-full bg-cover bg-center rounded-lg p-6 border flex justify-between items-center"
                    style={{ backgroundImage: form.bgImageUrl ? `url(${form.bgImageUrl})` : 'none' }}
                  >
                    <div className="bg-[#a3d9be]/90 p-4 rounded-lg w-full flex justify-between items-center shadow-sm">
                      <div>
                        <p className="text-[10px] font-bold text-gray-800 uppercase">
                          {form.breadcrumb || 'BREADCRUMB PREVIEW'}
                        </p>
                        <h3 className="text-xl font-serif text-gray-800 mt-1">
                          <span className="font-light">{form.titleRegular} </span>
                          <span className="font-bold text-[#008751]">{form.titleBold}</span>
                        </h3>
                      </div>
                      {form.logoUrl && (
                        <img
                          src={form.logoUrl}
                          alt="Logo"
                          className="w-12 h-12 object-contain shrink-0"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#008751] hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition"
                >
                  {submitting ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  {editId ? 'Save Changes' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}