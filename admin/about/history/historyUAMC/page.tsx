'use client';

import React, { useState, useEffect } from 'react';

interface HistoryItem {
  _id?: string;
  titleRegular: string;
  titleBold: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  createdAt?: string;
}

export default function AdminHistoryDashboard() {
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);

  // ফাইল স্টোরেজ ও ইনপুট স্টেট
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  const [formData, setFormData] = useState<Omit<HistoryItem, '_id' | 'imageUrl'>>({
    titleRegular: '',
    titleBold: '',
    subtitle: '',
    description: '',
  });

  // Fetch History List
  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/about/history');
      const result = await res.json();
      if (result.success) {
        setHistoryList(result.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // নতুন ডাটা তৈরির জন্য মোডাল ওপেন
  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({ titleRegular: '', titleBold: '', subtitle: '', description: '' });
    setSelectedFile(null);
    setPreviewUrl('');
    setIsModalOpen(true);
  };

  // এডিটের জন্য মোডাল ওপেন
  const handleOpenEditModal = (item: HistoryItem) => {
    if (!item._id) return;
    setEditingId(item._id);
    setFormData({
      titleRegular: item.titleRegular,
      titleBold: item.titleBold,
      subtitle: item.subtitle,
      description: item.description,
    });
    setPreviewUrl(item.imageUrl);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  // ইমেজ সিলেক্ট এবং প্রিভিউ হ্যান্ডলার
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form Submit (Create or Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!previewUrl) {
      alert('Please upload an image!');
      return;
    }

    setSubmitLoading(true);

    try {
      const payload = {
        ...formData,
        imageUrl: previewUrl,
      };

      const url = editingId ? `/api/about/history/${editingId}` : '/api/about/history';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert(editingId ? 'History updated successfully!' : 'History content added successfully!');
        setIsModalOpen(false);
        
        setFormData({
          titleRegular: '',
          titleBold: '',
          subtitle: '',
          description: '',
        });
        setSelectedFile(null);
        setPreviewUrl('');
        setEditingId(null);
        
        fetchHistory();
      } else {
        alert(result.message || 'Operation failed. Check API validation fields.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('An error occurred during save.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Delete Item
  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      const res = await fetch(`/api/about/history/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        alert('Deleted successfully!');
        fetchHistory();
      } else {
        alert(result.message || 'Failed to delete record.');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    // lg:pl-80 এবং pr-6 ব্যবহার করে ড্যাশবোর্ডকে আরেকটু ডানে সরিয়ে দুইপাশে মার্জিন ব্যালেন্স করা হয়েছে
    <div className="w-full lg:pl-80 pr-4 sm:pr-6 pt-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">History Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage and preview history section content</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="bg-[#00873E] hover:bg-[#006e33] text-white px-5 py-2.5 rounded-lg font-medium shadow-md transition flex items-center gap-2 text-sm"
        >
          <span className="text-lg font-bold">+</span> Add New History
        </button>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-gray-200 rounded-xl aspect-square border border-gray-200"></div>
          ))}
        </div>
      ) : historyList.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">No records found. Click "Add New History" to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {historyList.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 overflow-hidden flex flex-col justify-between aspect-square transition-all duration-200 group"
            >
              <div className="h-1/2 w-full relative overflow-hidden bg-gray-100">
                <img
                  src={item.imageUrl}
                  alt={item.titleBold}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide truncate">
                    {item.titleRegular}
                  </h3>
                  <h2 className="text-sm font-bold text-[#00873E] truncate mt-0.5">
                    {item.titleBold}
                  </h2>
                  <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                    {item.subtitle}
                  </p>
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-100 mt-2">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="flex-1 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 text-center py-1.5 rounded text-xs font-semibold transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex-1 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 text-center py-1.5 rounded text-xs font-semibold transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 lg:pl-80 overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">
                {editingId ? 'Edit History Content' : 'Add New History Content'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Form */}
              <form id="historyForm" onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-semibold text-xs text-gray-400 uppercase tracking-wider border-b pb-2">1. Input Details</h3>
                
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Title Regular</label>
                  <input
                    type="text"
                    value={formData.titleRegular}
                    onChange={(e) => setFormData({ ...formData, titleRegular: e.target.value })}
                    className="w-full border p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-[#00873E] outline-none"
                    placeholder="e.g. History of"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Title Bold (Green Highlight)</label>
                  <input
                    type="text"
                    value={formData.titleBold}
                    onChange={(e) => setFormData({ ...formData, titleBold: e.target.value })}
                    className="w-full border p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-[#00873E] outline-none font-semibold text-[#00873E]"
                    placeholder="e.g. Uttara Adhunik Medical College"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full border p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-[#00873E] outline-none"
                    placeholder="Enter subtitle details..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-[#00873E] outline-none"
                    placeholder="Enter full description here..."
                    required
                  />
                </div>

                {/* File Upload Element */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Upload Image File</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border p-2 rounded-lg text-sm bg-white file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-[#00873E] hover:file:bg-emerald-100 cursor-pointer"
                    required={!editingId}
                  />
                </div>
              </form>

              {/* Preview */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="font-semibold text-xs text-gray-400 uppercase tracking-wider">2. Live Preview</h3>
                  <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded">Realtime</span>
                </div>

                <div className="bg-[#eaf4ed] p-4 rounded-lg space-y-3 shadow-inner">
                  <div>
                    <p className="text-base font-serif font-semibold text-gray-900 leading-tight">
                      {formData.titleRegular || 'Title Regular Preview'}
                    </p>
                    <p className="text-lg font-serif font-bold text-[#00873E] leading-tight mt-0.5">
                      {formData.titleBold || 'Title Bold Preview'}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-800">
                      {formData.subtitle || 'Subtitle preview will appear here...'}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-3">
                      {formData.description || 'Description preview will appear here as you type...'}
                    </p>
                  </div>

                  <div className="w-full h-36 rounded overflow-hidden bg-gray-200 border border-emerald-100 flex items-center justify-center">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">No Image Uploaded Yet</span>
                    )}
                  </div>
                </div>
              </div>

            </div>

            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                form="historyForm"
                type="submit"
                disabled={submitLoading}
                className="bg-[#00873E] hover:bg-[#006e33] text-white px-6 py-2 rounded-lg text-sm font-medium shadow-md transition"
              >
                {submitLoading
                  ? 'Saving...'
                  : editingId
                  ? 'Update Record'
                  : 'Save Record'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}