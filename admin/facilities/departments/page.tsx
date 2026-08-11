'use client';

import React, { useEffect, useState } from 'react';

export default function AdminDepartments() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Form States
  const [title, setTitle] = useState('');
  const [establishedDate, setEstablishedDate] = useState('');
  const [image, setImage] = useState('');
  const [btnLink, setBtnLink] = useState('#');

  const API_URL = '/api/facilities/departments';

  // Fetch All Departments with Finally Block Fix
  const fetchDepartments = async () => {
    setIsFetching(true);
    try {
      const res = await fetch(API_URL, { cache: 'no-store' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setDepartments(json.data);
      } else {
        console.error('Fetch Failed:', json.error);
      }
    } catch (err) {
      console.error('Fetch Error:', err);
    } finally {
      setIsFetching(false); // লোডার বন্ধ নিশ্চিত করার ফিক্স
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Image Upload with Auto-Compress
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600;
          const scaleFactor = MAX_WIDTH / img.width;

          if (scaleFactor < 1) {
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleFactor;
          } else {
            canvas.width = img.width;
            canvas.height = img.height;
          }

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setImage(compressedBase64);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Modal for Add/Edit
  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingId(item._id);
      setTitle(item.title);
      setEstablishedDate(item.establishedDate);
      setImage(item.image);
      setBtnLink(item.btnLink || '#');
    } else {
      setEditingId(null);
      setTitle('');
      setEstablishedDate('');
      setImage('');
      setBtnLink('#');
    }
    setIsOpen(true);
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return alert('Please upload an image!');

    setLoading(true);
    const payload = { title, establishedDate, image, btnLink };

    try {
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        alert(`Failed to save: ${json.error || 'Server error'}`);
        return;
      }

      alert(editingId ? 'Department Updated Successfully!' : 'Department Saved to Database!');
      
      setIsOpen(false);
      setTitle('');
      setEstablishedDate('');
      setImage('');
      setBtnLink('#');

      // ডাটাবেজ থেকে রি-ফেচ
      await fetchDepartments();

    } catch (err: any) {
      console.error('Submit Error:', err);
      alert('Network error or server failed to respond!');
    } finally {
      setLoading(false);
    }
  };

  // Delete Handler
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const json = await res.json();

      if (json.success) {
        alert('Deleted successfully!');
        await fetchDepartments();
      } else {
        alert(`Delete failed: ${json.error}`);
      }
    } catch (err) {
      console.error('Delete Error:', err);
      alert('Failed to delete department!');
    }
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-8">
      {/* Header Bar */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Department Management</h1>
          <p className="text-xs text-gray-500 mt-1">Add, edit, or delete facility departments</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#00873E] text-white px-5 py-2.5 rounded-lg font-medium shadow hover:bg-green-700 transition"
        >
          + Add New Department
        </button>
      </div>

      {/* Grid List with Fixed Loading Condition */}
      {isFetching && departments.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-medium">Loading departments...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {departments.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border border-dashed">
              <p className="text-gray-400 italic">No departments added yet to the database.</p>
            </div>
          ) : (
            departments.map((item) => (
              <div key={item._id} className="bg-white border rounded-lg p-3 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-full h-36 bg-gray-100 rounded overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800 line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{item.establishedDate}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t text-xs">
                  <button onClick={() => handleOpenModal(item)} className="text-blue-600 font-bold hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="text-red-600 font-bold hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal Form */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-5 shadow-2xl my-8">
            <h2 className="text-xl font-bold border-b pb-2 text-gray-800">
              {editingId ? 'Edit Department' : 'Add New Department'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Department Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Department of Cardiology"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border p-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00873E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Established Date Text</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Established: February 10, 2020"
                  value={establishedDate}
                  onChange={(e) => setEstablishedDate(e.target.value)}
                  className="w-full border p-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00873E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Button Link URL (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. /facilities/departments/cardiology or #"
                  value={btnLink}
                  onChange={(e) => setBtnLink(e.target.value)}
                  className="w-full border p-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00873E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Department Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full border p-2 text-sm rounded-lg text-gray-600"
                />
              </div>

              {/* Live Preview */}
              {image && (
                <div className="border p-3 rounded-lg bg-gray-50 space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Card Live Preview</span>
                  <div className="bg-white p-3 rounded border w-60 mx-auto space-y-2 shadow-sm">
                    <img src={image} alt="Preview" className="w-full h-28 object-cover rounded" />
                    <h5 className="text-xs font-bold truncate">{title || 'Department Title'}</h5>
                    <p className="text-[10px] text-gray-500">{establishedDate || 'Established Date'}</p>
                    <span className="inline-block bg-[#00873E] text-white text-[10px] px-2 py-1 rounded">
                      Learn More
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-[#00873E] text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Saving...' : editingId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}