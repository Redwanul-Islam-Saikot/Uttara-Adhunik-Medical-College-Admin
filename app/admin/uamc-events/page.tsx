'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2, X, Upload, Image as ImageIcon } from 'lucide-react';

interface EventItem {
  _id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  status: 'Upcoming' | 'Past';
  speaker?: string;
  description: string;
  image?: string;
}

export default function UAMCEventsAdmin() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Academic',
    date: '',
    time: '',
    location: '',
    status: 'Upcoming' as 'Upcoming' | 'Past',
    speaker: '',
    description: '',
    image: '',
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/uamc-events');
      const data = await res.json();
      if (Array.isArray(data)) setEvents(data);
    } catch (err) {
      console.error('Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // LOCAL FILE READ & LIVE PREVIEW (Base64)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ১ MB-এর বড় ফাইল হলে ওয়ার্নিং দেবে
    if (file.size > 1024 * 1024) {
      alert('File size is too large! Please upload an image under 1MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleOpenModal = (event?: EventItem) => {
    if (event) {
      setEditingId(event._id);
      setFormData({
        title: event.title,
        category: event.category,
        date: event.date,
        time: event.time,
        location: event.location,
        status: event.status,
        speaker: event.speaker || '',
        description: event.description,
        image: event.image || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        category: 'Academic',
        date: '',
        time: '',
        location: '',
        status: 'Upcoming',
        speaker: '',
        description: '',
        image: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const url = editingId ? `/api/uamc-events/${editingId}` : '/api/uamc-events';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok && result.success !== false) {
        setIsModalOpen(false);
        fetchEvents();
      } else {
        alert(result.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Submit Error:', error);
      alert('Failed to save data.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const res = await fetch(`/api/uamc-events/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (res.ok && result.success) fetchEvents();
      else alert(result.message || 'Failed to delete');
    } catch (error) {
      console.error('Delete Error:', error);
      alert('Failed to delete event.');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">UAMC Events Management</h1>
          <p className="text-xs text-gray-500">Add, edit or remove campus events</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#00873E] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#006e33] transition"
        >
          <Plus size={16} /> Add New Event
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#00873E]" size={32} />
        </div>
      ) : (
        <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b text-gray-600 font-semibold uppercase">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-gray-700">
                {events.length > 0 ? (
                  events.map((evt) => (
                    <tr key={evt._id} className="hover:bg-gray-50">
                      <td className="p-4">
                        {evt.image ? (
                          <img src={evt.image} alt={evt.title} className="w-10 h-10 object-cover rounded-lg border" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                            <ImageIcon size={18} />
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-bold text-gray-900">{evt.title}</td>
                      <td className="p-4">
                        <span className="bg-emerald-50 text-[#00873E] px-2 py-0.5 rounded font-bold">
                          {evt.category}
                        </span>
                      </td>
                      <td className="p-4">{evt.date} | {evt.time}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded font-bold ${evt.status === 'Upcoming' ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-600'}`}>
                          {evt.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleOpenModal(evt)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(evt._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400">
                      No events added yet. Click "Add New Event" to publish one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-xl relative max-h-[90vh] overflow-y-auto text-xs">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400">
              <X size={18} />
            </button>
            <h2 className="text-base font-bold mb-4">{editingId ? 'Edit Event' : 'Add New Event'}</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="font-semibold block mb-1">Event Title</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border p-2.5 rounded-xl outline-none focus:border-[#00873E]"
                />
              </div>

              {/* IMAGE UPLOAD & LIVE PREVIEW SECTION */}
              <div>
                <label className="font-semibold block mb-1">Event Image</label>
                
                {/* LIVE PREVIEW BOX */}
                {formData.image ? (
                  <div className="relative w-full h-36 rounded-xl overflow-hidden border mb-2 group">
                    <img src={formData.image} alt="Live Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <X size={14} /> Remove Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-200 hover:border-[#00873E] p-4 rounded-xl flex flex-col items-center gap-1 cursor-pointer transition bg-gray-50 text-center">
                    <Upload size={20} className="text-gray-400" />
                    <span className="text-gray-600 font-semibold">Click to upload image</span>
                    <span className="text-[10px] text-gray-400">PNG, JPG, WEBP (Max 1MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}

                {/* OR URL INPUT */}
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Or paste Image URL directly"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full border p-2 rounded-xl text-[11px] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border p-2.5 rounded-xl outline-none"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Upcoming' | 'Past' })}
                    className="w-full border p-2.5 rounded-xl outline-none"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Past">Past</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Date</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. 25 August, 2026"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full border p-2.5 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Time</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. 09:00 AM - 02:00 PM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full border p-2.5 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Location</label>
                <input
                  required
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full border p-2.5 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Speaker (Optional)</label>
                <input
                  type="text"
                  value={formData.speaker}
                  onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                  className="w-full border p-2.5 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border p-2.5 rounded-xl outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#00873E] text-white py-3 rounded-xl font-bold mt-2 hover:bg-[#006e33] transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {editingId ? 'Update Event' : 'Publish Event'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}