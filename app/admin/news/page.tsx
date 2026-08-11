'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus, Upload, X } from 'lucide-react';

interface NewsItem {
  _id?: string;
  title: string;
  category: string;
  description: string;
  image: string;
  author: string;
  date: string;
  link?: string;
}

export default function AdminNewsManager() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const initialForm: NewsItem = {
    title: '',
    category: 'Education',
    description: '',
    image: '',
    author: 'admin',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    link: '#',
  };

  const [formData, setFormData] = useState<NewsItem>(initialForm);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > 800) {
          height = (800 * height) / width;
          width = 800;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      if (data.success) setNews(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setFormData((prev) => ({ ...prev, image: compressed }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) return showToast('Please upload an image');

    setSubmitting(true);
    const url = editingId ? `/api/news/${editingId}` : '/api/news';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();
      if (resData.success) {
        showToast(editingId ? 'News updated successfully!' : 'News created successfully!');
        resetForm();
        fetchNews();
      } else {
        showToast(resData.error || 'Failed to submit');
      }
    } catch (err) {
      showToast('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: NewsItem) => {
    if (!item._id) return;
    setEditingId(item._id);
    setFormData({
      title: item.title,
      category: item.category,
      description: item.description,
      image: item.image,
      author: item.author,
      date: item.date,
      link: item.link || '#',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) {
      showToast('Invalid ID');
      return;
    }
    if (!confirm('Are you sure you want to delete this news item?')) return;

    try {
      const res = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const resData = await res.json();

      if (resData.success) {
        showToast('News deleted successfully!');
        fetchNews();
      } else {
        showToast(resData.error || 'Delete failed');
      }
    } catch (err) {
      showToast('Delete failed due to server error');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 relative font-sans">
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Latest News Admin Panel</h1>
            <p className="text-xs text-slate-500">Manage news cards with category, image & details</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#008751] text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-emerald-700 transition cursor-pointer"
          >
            <Plus size={16} /> Add News
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading news...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {news.map((item, index) => (
              <div
                key={item._id}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex gap-4 items-center justify-between relative overflow-hidden"
              >
                <div className="flex gap-3 items-center">
                  {/* Serial Number Badge */}
                  <div className="flex items-center justify-center bg-slate-100 text-slate-700 font-bold text-xs w-7 h-7 rounded-lg shrink-0">
                    {index + 1}
                  </div>

                  {/* News Image */}
                  <img src={item.image} alt="" className="w-20 h-20 object-cover rounded-xl shrink-0" />

                  {/* News Content */}
                  <div className="space-y-1">
                    <span className="inline-block bg-[#F2C94C] text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-xs">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-slate-400">{item.author} | {item.date}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 border border-rose-100 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Form */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="font-bold text-slate-900 text-sm">
                  {editingId ? 'Edit News Card' : 'Add News Card'}
                </h2>
                <button onClick={resetForm} className="cursor-pointer">
                  <X size={18} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="News Title"
                  className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-emerald-600"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    placeholder="Category (e.g. Education)"
                    className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-emerald-600"
                  />
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                    placeholder="Author Name"
                    className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-emerald-600"
                  />
                </div>

                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  placeholder="Date (e.g. August 6, 2024)"
                  className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-emerald-600"
                />

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={2}
                  placeholder="Short Description..."
                  className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-emerald-600"
                />

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">News Image</label>
                  <label className="flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl h-24 cursor-pointer p-2 hover:bg-slate-50 transition">
                    {formData.image ? (
                      <img src={formData.image} className="h-full object-cover rounded-lg" alt="Preview" />
                    ) : (
                      <Upload size={20} className="text-slate-400" />
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-xl text-xs cursor-pointer">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-[#008751] text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition cursor-pointer"
                  >
                    {submitting ? 'Saving...' : 'Save News'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}