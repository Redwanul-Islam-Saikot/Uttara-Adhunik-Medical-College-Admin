'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus, Upload, X, ArrowUpRight } from 'lucide-react';

interface CampusCard {
  _id?: string;
  id?: string;
  sectionTitle: string;
  sectionSubtitle: string;
  cardTitle: string;
  cardImage: string;
  cardLink: string;
}

export default function AdminCampusLife() {
  const [cards, setCards] = useState<CampusCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const initialForm = {
    sectionTitle: 'Campus Life',
    sectionSubtitle: 'Building a vibrant community of creative and accomplished people from around the world',
    cardTitle: '',
    cardImage: '',
    cardLink: '#',
  };

  const [formData, setFormData] = useState(initialForm);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Base64 ইমেজ সাইজ ৯০০px এ স্কেল ডাউন ও কমপ্রেস করার ফাংশন
  const compressImage = (base64Str: string, maxWidth = 900): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (maxWidth * height) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); // 70% Quality
      };
    });
  };

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/campus-life');
      const data = await res.json();
      if (data.success) setCards(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressedImage = await compressImage(reader.result as string);
        setFormData((prev) => ({ ...prev, cardImage: compressedImage }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    const url = editingId ? `/api/campus-life/${editingId}` : '/api/campus-life';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();
      if (resData.success) {
        showToast(editingId ? 'Card updated successfully!' : 'Card created successfully!');
        resetForm();
        fetchCards();
      } else {
        showToast(resData.error || 'Operation failed!');
      }
    } catch (err) {
      showToast('Network Error!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: CampusCard) => {
    const targetId = item._id || item.id;
    if (!targetId) return;

    setEditingId(targetId);
    setFormData({
      sectionTitle: item.sectionTitle || 'Campus Life',
      sectionSubtitle: item.sectionSubtitle || '',
      cardTitle: item.cardTitle || '',
      cardImage: item.cardImage || '',
      cardLink: item.cardLink || '#',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item: CampusCard) => {
    const targetId = item._id || item.id;
    if (!targetId || !confirm('Are you sure you want to delete this item?')) return;

    try {
      const res = await fetch(`/api/campus-life/${targetId}`, { method: 'DELETE' });
      const resData = await res.json();
      if (resData.success) {
        showToast('Card deleted successfully!');
        fetchCards();
      } else {
        showToast(resData.error || 'Delete failed!');
      }
    } catch (err) {
      showToast('Delete request failed!');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 relative font-sans">
      
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl transition-all">
          {toastMessage}
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Campus Life Admin Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage front-end cards, titles, images and links</p>
          </div>
          <button
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-[#008751] text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-emerald-700 transition cursor-pointer"
          >
            <Plus size={16} /> Add New Card
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading cards...</div>
        ) : cards.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 text-slate-400 text-xs">
            No cards added yet. Click "Add New Card" to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((item) => (
              <div key={item._id || item.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
                    <img src={item.cardImage} alt={item.cardTitle} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 space-y-1">
                    <h3 className="font-bold text-slate-900 flex items-center justify-between text-base">
                      {item.cardTitle} <ArrowUpRight size={16} className="text-slate-400" />
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate">Link: {item.cardLink}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 p-3 border-t border-slate-100 bg-slate-50">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex items-center justify-center gap-1 bg-white border border-slate-200 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="flex items-center justify-center gap-1 bg-rose-50 border border-rose-100 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b pb-3 border-slate-100">
                <h2 className="font-bold text-slate-900 text-sm">{editingId ? 'Edit Card' : 'Add Card'}</h2>
                <button onClick={resetForm} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Upload Card Image *</label>
                  <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition p-2">
                    {formData.cardImage ? (
                      <img src={formData.cardImage} alt="Preview" className="h-full object-cover rounded-lg" />
                    ) : (
                      <div className="text-center text-slate-400 text-xs flex flex-col items-center gap-1">
                        <Upload size={18} /> Click to upload image
                      </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Card Title *</label>
                  <input
                    type="text"
                    name="cardTitle"
                    value={formData.cardTitle}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Student Life"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Link URL</label>
                  <input
                    type="text"
                    name="cardLink"
                    value={formData.cardLink}
                    onChange={handleChange}
                    placeholder="/student-life"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button type="button" onClick={resetForm} className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600">Cancel</button>
                  <button 
                    type="submit" 
                    disabled={submitting} 
                    className="px-5 py-2 bg-[#008751] text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save Card'}
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