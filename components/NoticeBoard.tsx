'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Clock,
  RotateCcw,
  FileText,
  Loader2,
  X,
  ExternalLink,
  Calendar,
  Eye,
} from 'lucide-react';

interface Props {
  title: string;
  apiEndpoint: string;
}

export default function NoticeBoard({ title, apiEndpoint }: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // ১. টাইটেল থেকে নিখুঁত Enum Category বের করার ফাংশন
  const getCleanCategory = (rawTitle: string) => {
    const lower = rawTitle.toLowerCase();
    if (lower.includes('journal')) return 'Journal';
    if (lower.includes('tender')) return 'Tenders';
    if (lower.includes('admission')) return 'Admission Notice';
    if (lower.includes('job')) return 'Job Circular';
    if (lower.includes('report')) return 'Reports';
    return 'General Notice';
  };

  // ২. Base URL এবং Query Params আলাদা করা
  const getBaseApiUrl = () => {
    return apiEndpoint.split('?')[0];
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const monthYear = now
      .toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      .replace(' ', ' ');
    const time = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return { day, monthYear, time };
  };

  const [formData, setFormData] = useState({
    title: '',
    day: '',
    monthYear: '',
    time: '',
    pdfUrl: '',
  });

  const fetchItems = async () => {
    try {
      setFetching(true);
      const res = await fetch(apiEndpoint, { cache: 'no-store' });
      const text = await res.text();
      const json = text ? JSON.parse(text) : null;

      if (json && json.success && Array.isArray(json.data)) {
        setItems(json.data);
      } else if (Array.isArray(json)) {
        setItems(json);
      } else {
        setItems([]);
      }
    } catch (e) {
      console.error('Fetch error:', e);
      setItems([]);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [apiEndpoint]);

  const resetForm = () => {
    const autoDateTime = getCurrentDateTime();
    setFormData({
      title: '',
      day: autoDateTime.day,
      monthYear: autoDateTime.monthYear,
      time: autoDateTime.time,
      pdfUrl: '',
    });
    setEditingId(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setEditingId(item._id || item.id);
    setFormData({
      title: item.title || '',
      day: item.day || '',
      monthYear: item.monthYear || '',
      time: item.time || '',
      pdfUrl: item.pdfUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert('Notice Title is required!');
    setLoading(true);

    try {
      const baseUrl = getBaseApiUrl();
      const url = editingId ? `${baseUrl}/${editingId}` : baseUrl;
      const method = editingId ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        category: getCleanCategory(title),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && (data.success || data._id)) {
        alert(editingId ? 'Notice updated successfully!' : 'Notice created successfully!');
        setIsModalOpen(false);
        resetForm();
        await fetchItems();
      } else {
        alert(`Error: ${data.error || 'Operation failed'}`);
      }
    } catch (err: any) {
      console.error('Submit Error:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;

    try {
      const baseUrl = getBaseApiUrl();
      const res = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok && (data.success || res.status === 200)) {
        await fetchItems();
      } else {
        alert(`Delete failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.error('Delete Error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 p-4 md:p-8 lg:pl-72 w-full overflow-x-hidden">
      <div className="w-full space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/80 w-full">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              {title} Management
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Total Published Items:{' '}
              <span className="text-[#008751] font-bold">{items.length}</span>
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-[#008751] hover:bg-[#006e42] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg shrink-0"
          >
            <Plus size={20} strokeWidth={2.5} />
            <span>Add New Entry</span>
          </button>
        </div>

        {/* Content Section */}
        {fetching ? (
          <div className="flex items-center justify-center py-24 text-slate-400 gap-3">
            <Loader2 className="animate-spin text-[#008751]" size={28} />
            <span className="font-semibold text-slate-600">Loading Notices...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white p-16 rounded-2xl border-2 border-dashed border-slate-300 text-center space-y-4 w-full">
            <FileText className="mx-auto text-slate-300" size={56} />
            <p className="text-slate-600 text-base font-semibold">
              No notices published yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
            {items.map((item: any) => {
              const itemId = item._id || item.id;
              return (
                <div
                  key={itemId}
                  className="group bg-white border border-slate-200 hover:border-[#008751]/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60">
                        <Calendar size={14} className="text-[#008751]" />
                        <span className="text-xs font-bold text-slate-800">
                          {item.day} {item.monthYear}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                        <Clock size={13} />
                        <span>{item.time}</span>
                      </div>
                    </div>

                    <h2 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                      {item.title}
                    </h2>

                    {item.pdfUrl ? (
                      <a
                        href={item.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008751] hover:underline pt-1"
                      >
                        <FileText size={14} />
                        <span>View Attachment PDF</span>
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="inline-block text-[11px] text-slate-400 italic">
                        No attached document
                      </span>
                    )}
                  </div>

                  <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/80">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-200/80 hover:bg-[#008751] text-slate-800 hover:text-white rounded-xl transition-all duration-200 text-xs font-bold shadow-sm"
                    >
                      <Edit2 size={16} />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(itemId)}
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

      {/* Modal Section */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="font-bold text-slate-900 text-lg">
                {editingId ? `Edit ${title}` : `Add New ${title}`}
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
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-500">Notice Details</span>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs text-[#008751] hover:underline font-bold flex items-center gap-1"
                  >
                    <RotateCcw size={12} /> Reset to Current Time
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Notice Title
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter notice title here..."
                    className="w-full border border-slate-200 p-3 rounded-xl text-xs font-medium focus:outline-none focus:border-[#008751]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Day
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.day}
                      onChange={(e) =>
                        setFormData({ ...formData, day: e.target.value })
                      }
                      className="w-full border border-slate-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-[#008751]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Month & Year
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.monthYear}
                      onChange={(e) =>
                        setFormData({ ...formData, monthYear: e.target.value })
                      }
                      className="w-full border border-slate-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-[#008751]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Time
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      className="w-full border border-slate-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-[#008751]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    PDF Document URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.pdfUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, pdfUrl: e.target.value })
                    }
                    placeholder="https://example.com/document.pdf"
                    className="w-full border border-slate-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-[#008751]"
                  />
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
                    className="flex items-center gap-2 bg-[#008751] hover:bg-[#006e42] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md disabled:opacity-50 transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingId ? 'Update Notice' : 'Save Notice'}</span>
                    )}
                  </button>
                </div>
              </form>

              {/* Live Preview Side */}
              <div className="lg:col-span-5 bg-slate-900 p-6 flex flex-col justify-between text-white relative overflow-hidden">
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-2">
                      <Eye size={16} /> Live Card Preview
                    </span>
                  </div>

                  <div className="bg-white text-slate-800 rounded-2xl p-5 space-y-3 shadow-lg border border-slate-100">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <span className="px-2.5 py-1 bg-emerald-50 text-[#008751] font-bold text-[11px] rounded-lg">
                        {formData.day || '01'} {formData.monthYear || 'Jan 24'}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                        <Clock size={12} />
                        {formData.time || '10:00 AM'}
                      </span>
                    </div>

                    <p className="text-sm font-bold text-slate-800 leading-snug">
                      {formData.title || 'Notice Title Preview Will Appear Here...'}
                    </p>

                    {formData.pdfUrl && (
                      <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-[#008751]">
                        <FileText size={14} />
                        <span>Download PDF</span>
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