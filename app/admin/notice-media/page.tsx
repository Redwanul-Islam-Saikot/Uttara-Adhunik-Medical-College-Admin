'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Upload } from 'lucide-react';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({ title: '', subtitle: '', imageUrl: '' });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notice-media');
      if (res.ok) {
        const data = await res.json();
        if (data.success) setEvents(data.data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Image File to Base64 Conversion
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 5MB এর বেশি ফাইল সাইজ হলে অ্যালার্ট দেবে
      if (file.size > 5 * 1024 * 1024) {
        alert('File size is too large! Please select an image under 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: '', subtitle: '', imageUrl: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item._id);
    setFormData({ title: item.title, subtitle: item.subtitle || '', imageUrl: item.imageUrl });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      alert('Please select an image file!');
      return;
    }

    try {
      if (editingId) {
        await fetch(`/api/notice-media/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch('/api/notice-media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await fetch(`/api/notice-media/${id}`, { method: 'DELETE' });
      fetchEvents();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-xs">
        <h1 className="text-2xl font-bold text-gray-800">Event Gallery Dashboard</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#008751] text-white px-4 py-2 rounded-md font-bold hover:bg-[#006e42] transition"
        >
          <Plus size={18} /> Add New
        </button>
      </div>

      {/* Admin Cards Grid */}
      {loading ? (
        <div className="text-center py-10">Loading Admin Dashboard...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-10 text-gray-500 font-semibold bg-gray-50 rounded-lg">
          No events added yet. Click "Add New" to publish.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {events.map((item) => (
            <div key={item._id} className="bg-white border rounded-lg overflow-hidden shadow-xs relative group flex flex-col justify-between">
              <div>
                <div className="aspect-square w-full overflow-hidden bg-gray-100">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="bg-[#008751] text-white p-2.5">
                  <h3 className="text-sm font-bold truncate">{item.title}</h3>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-2 flex justify-end gap-2 bg-gray-50 border-t">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pop-up Modal with Live Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-4 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
              {editingId ? 'Edit Event' : 'Add New Event'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form Input */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border rounded-md p-2 text-sm focus:outline-[#008751]"
                    placeholder="Enter Title..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Subtitle / Category</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full border rounded-md p-2 text-sm focus:outline-[#008751]"
                    placeholder="Enter Subtitle..."
                  />
                </div>

                {/* Direct File Upload Field */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Upload Image File</label>
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-md p-3 text-sm cursor-pointer hover:border-[#008751] transition bg-gray-50">
                    <Upload size={18} className="text-gray-600" />
                    <span className="text-gray-600 font-semibold text-xs">
                      {formData.imageUrl ? 'Change Selected Image' : 'Choose File'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#008751] text-white py-2.5 rounded-md font-bold hover:bg-[#006e42] transition"
                >
                  {editingId ? 'Update Event' : 'Save Event'}
                </button>
              </form>

              {/* Live Preview Section */}
              <div className="space-y-2 border-l pl-0 md:pl-6">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Live Card Preview</span>
                <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
                  <div className="aspect-square w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {formData.imageUrl ? (
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-gray-400 flex flex-col items-center gap-1">
                        <ImageIcon size={32} />
                        <span className="text-xs">No Image Selected</span>
                      </div>
                    )}
                  </div>
                  <div className="bg-[#008751] text-white p-3">
                    <h4 className="text-sm font-bold truncate">
                      {formData.title || 'Event Title Preview'}
                    </h4>
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