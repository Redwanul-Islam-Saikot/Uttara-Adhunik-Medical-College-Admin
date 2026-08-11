'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus, Upload, X, Image as ImageIcon, Calendar } from 'lucide-react';

interface EventItem {
  _id?: string;
  title: string;
  date: string;
  time: string;
  location: string;
  eventImage?: string;
  link?: string;
}

export default function AdminAlumniEvents() {
  const [activeTab, setActiveTab] = useState<'events' | 'banner'>('events');
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Banner State
  const [bannerUrl, setBannerUrl] = useState<string>('');

  const initialForm: EventItem = {
    title: '',
    date: '',
    time: '',
    location: '',
    link: '#',
  };

  const [formData, setFormData] = useState<EventItem>(initialForm);

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
        if (width > 1200) {
          height = (1200 * height) / width;
          width = 1200;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    });
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/alumni-events');
      const data = await res.json();
      if (data.success) {
        setEvents(data.data || []);
        if (data.data && data.data.length > 0 && data.data[0].eventImage) {
          setBannerUrl(data.data[0].eventImage);
        } else {
          setBannerUrl('');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle Event Card Form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    const url = editingId ? `/api/alumni-events/${editingId}` : '/api/alumni-events';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();
      if (resData.success) {
        showToast(editingId ? 'Event updated!' : 'Event created!');
        resetForm();
        fetchEvents();
      } else {
        showToast(resData.error || 'Failed');
      }
    } catch (err) {
      showToast('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Banner Upload & Update
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setBannerUrl(compressed);
        
        // Save banner image
        if (events.length > 0 && events[0]._id) {
          await fetch(`/api/alumni-events/${events[0]._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...events[0], eventImage: compressed }),
          });
          showToast('Banner Image Saved Successfully!');
          fetchEvents();
        } else {
          showToast('Please add at least one event first to attach the banner image.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Banner Delete
  const handleBannerDelete = async () => {
    if (!confirm('Are you sure you want to delete the banner image?')) return;

    if (events.length > 0 && events[0]._id) {
      try {
        await fetch(`/api/alumni-events/${events[0]._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...events[0], eventImage: '' }),
        });
        setBannerUrl('');
        showToast('Banner Image Deleted!');
        fetchEvents();
      } catch (err) {
        showToast('Failed to delete image!');
      }
    } else {
      setBannerUrl('');
    }
  };

  const handleEdit = (item: EventItem) => {
    if (!item._id) return;
    setEditingId(item._id);
    setFormData({
      title: item.title,
      date: item.date,
      time: item.time,
      location: item.location,
      link: item.link || '#',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm('Delete this event?')) return;
    try {
      const res = await fetch(`/api/alumni-events/${id}`, { method: 'DELETE' });
      const resData = await res.json();
      if (resData.success) {
        showToast('Event deleted!');
        fetchEvents();
      }
    } catch (err) {
      showToast('Delete failed!');
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
        
        {/* Navigation Tabs Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-xs border border-slate-100 gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Alumni Events Admin Panel</h1>
            <p className="text-xs text-slate-500">Manage Section Image and Events Cards separately</p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition ${
                activeTab === 'events' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar size={15} /> Cards Section
            </button>
            <button
              onClick={() => setActiveTab('banner')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition ${
                activeTab === 'banner' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon size={15} /> Image Section
            </button>
          </div>
        </div>

        {/* SECTION 1: EVENT CARDS MANAGEMENT */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-700">Events List ({events.length})</h2>
              <button
                onClick={() => { resetForm(); setIsModalOpen(true); }}
                className="flex items-center gap-2 bg-[#008751] text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-emerald-700 transition cursor-pointer"
              >
                <Plus size={16} /> Add New Event Card
              </button>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading events...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((item, index) => (
                  <div key={item._id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex justify-between items-start gap-4">
                    <div className="flex gap-4 items-center">
                      <span className="text-2xl font-bold text-emerald-600/40">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="space-y-1">
                        <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                        <p className="text-xs text-slate-500">{item.date} | {item.time}</p>
                        <p className="text-xs text-slate-400">{item.location}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(item)} className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(item._id)} className="p-2 border border-rose-100 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: RIGHT BANNER IMAGE MANAGEMENT */}
        {activeTab === 'banner' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-800">Section Featured Image</h2>
                <p className="text-xs text-slate-500">Upload, edit, or delete the main banner image displayed on the right side</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 bg-[#008751] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-emerald-700 transition cursor-pointer">
                  {bannerUrl ? <Pencil size={14} /> : <Plus size={14} />}
                  <span>{bannerUrl ? 'Edit / Change Image' : 'Add Image'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
                </label>

                {bannerUrl && (
                  <button
                    onClick={handleBannerDelete}
                    className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-600 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-rose-100 transition cursor-pointer"
                  >
                    <Trash2 size={14} />
                    <span>Delete Image</span>
                  </button>
                )}
              </div>
            </div>

            {/* Image Box Container */}
            <div className="max-w-2xl">
              {bannerUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs group">
                  <img src={bannerUrl} className="w-full h-80 object-cover" alt="Featured Banner" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                    <label className="flex items-center gap-1.5 bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-semibold shadow-md cursor-pointer hover:bg-slate-100">
                      <Pencil size={14} /> Change
                      <input type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
                    </label>
                    <button
                      onClick={handleBannerDelete}
                      className="flex items-center gap-1.5 bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md hover:bg-rose-700 cursor-pointer"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl h-64 cursor-pointer p-4 hover:bg-slate-50 transition text-slate-400 hover:text-emerald-600">
                  <Upload size={32} className="mb-2" />
                  <span className="text-xs font-semibold">No Image Uploaded</span>
                  <span className="text-[11px] text-slate-400 mt-1">Click to upload a new banner image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
                </label>
              )}
            </div>
          </div>
        )}

        {/* Event Card Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="font-bold text-slate-900 text-sm">{editingId ? 'Edit Event Card' : 'Add Event Card'}</h2>
                <button onClick={resetForm} className="cursor-pointer"><X size={18} className="text-slate-400" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Event Title"
                  className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-emerald-600"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    placeholder="e.g. August 20, 2024"
                    className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-emerald-600"
                  />
                  <input
                    type="text"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 4:27 am"
                    className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-emerald-600"
                  />
                </div>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Location"
                  className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-emerald-600"
                />
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="Target Link URL"
                  className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-emerald-600"
                />

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-xl text-xs cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="px-5 py-2 bg-[#008751] text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-emerald-700 transition">
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