'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, CheckCircle, Globe, Phone, MapPin, Image as ImageIcon, Building, Calendar } from 'lucide-react';

export default function AdminFooterPage() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const initialSettings = {
    logo: '',
    title: '',
    subtitle: '',
    description: '',
    address: '',
    phone: '',
    copyrightText: '',
  };

  const [settingsForm, setSettingsForm] = useState(initialSettings);

  const [posts, setPosts] = useState<any[]>([]);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postForm, setPostForm] = useState({
    title: '',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    image: '',
    link: '#',
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > 600) {
            height = (600 * height) / width;
            width = 600;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
      };
    });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/footer', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      const data = await res.json();
      if (data.success) {
        if (data.settings) setSettingsForm(data.settings);
        setPosts(data.posts || []);
      }
    } catch (err) {
      showToast('API Route Error or Database connection failed!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/footer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'settings', data: settingsForm }),
      });
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      if (data.success) {
        showToast('Footer Settings Saved!');
        setIsSettingsModalOpen(false);
        await fetchData();
      }
    } catch (err) {
      showToast('Error updating settings');
    }
  };

  const handleClearSettings = async () => {
    if (!confirm('Are you sure you want to clear/delete all General Settings data?')) return;

    try {
      const res = await fetch('/api/footer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'settings', data: initialSettings }),
      });

      if (!res.ok) throw new Error('Failed to reset settings');

      const data = await res.json();
      if (data.success) {
        setSettingsForm(initialSettings);
        showToast('General Settings cleared!');
        setIsSettingsModalOpen(false);
        await fetchData();
      }
    } catch (err) {
      showToast('Error clearing settings');
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.image) return showToast('Please upload a post image');

    try {
      const url = editingPostId ? `/api/footer/${editingPostId}` : '/api/footer';
      const method = editingPostId ? 'PUT' : 'POST';
      const body = editingPostId ? JSON.stringify(postForm) : JSON.stringify({ type: 'post', data: postForm });

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (!res.ok) throw new Error('Save post failed');

      const data = await res.json();
      if (data.success) {
        showToast(editingPostId ? 'Post updated successfully!' : 'Post created successfully!');
        setIsPostModalOpen(false);
        setEditingPostId(null);
        setPostForm({
          title: '',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          image: '',
          link: '#',
        });
        await fetchData();
      }
    } catch (err) {
      showToast('Error saving post');
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/footer/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      const data = await res.json();
      if (data.success) {
        showToast('Post deleted!');
        setPosts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      showToast('Delete failed');
    }
  };

  const openEditPostModal = (post: any) => {
    setEditingPostId(post._id);
    setPostForm({
      title: post.title,
      date: post.date,
      image: post.image,
      link: post.link || '#',
    });
    setIsPostModalOpen(true);
  };

  if (loading) return <div className="p-10 ml-64 text-center text-slate-500 font-medium">Loading Footer Management...</div>;

  return (
    <div className="ml-64 w-[calc(100%-16rem)] min-h-screen p-6 space-y-6 box-border">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium">
          <CheckCircle size={18} /> {toast}
        </div>
      )}

      {/* Top Header Card */}
      <div className="w-full bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Footer Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Total Active Posts: <span className="font-bold text-emerald-600">{posts.length}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="bg-slate-100 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-200 transition flex items-center gap-2 cursor-pointer"
          >
            <Edit3 size={14} /> Edit General Settings
          </button>
          <button
            onClick={() => {
              setEditingPostId(null);
              setPostForm({
                title: '',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                image: '',
                link: '#',
              });
              setIsPostModalOpen(true);
            }}
            className="bg-[#059669] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#047857] transition flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Plus size={16} /> Add New Post
          </button>
        </div>
      </div>

      {/* Single General Settings Dashboard Box */}
      <div className="w-full bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Building size={14} className="text-emerald-600" /> General Settings Overview
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClearSettings}
              className="text-[11px] font-semibold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Trash2 size={12} /> Clear Data
            </button>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="text-[11px] font-semibold text-emerald-600 hover:underline cursor-pointer flex items-center gap-1"
            >
              <Edit3 size={12} /> Edit Settings
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Logo & Institution Details */}
          <div className="md:col-span-1 flex items-center gap-4">
            {settingsForm.logo ? (
              <img src={settingsForm.logo} alt="Logo" className="w-14 h-14 object-contain bg-slate-900 p-2 rounded-2xl shrink-0" />
            ) : (
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shrink-0">
                <ImageIcon size={24} />
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-slate-800 line-clamp-1">{settingsForm.title || 'No Title Set'}</h3>
              <p className="text-xs text-emerald-600 font-semibold line-clamp-1">{settingsForm.subtitle || 'No Subtitle'}</p>
              <p className="text-xs text-slate-500 line-clamp-2 mt-1">{settingsForm.description || 'No Description'}</p>
            </div>
          </div>

          {/* Address & Phone */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Address</span>
              <p className="font-medium text-slate-700 flex items-center gap-1.5 truncate">
                <MapPin size={14} className="text-emerald-600 shrink-0" /> {settingsForm.address || 'N/A'}
              </p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Phone</span>
              <p className="font-medium text-slate-700 flex items-center gap-1.5 truncate">
                <Phone size={14} className="text-emerald-600 shrink-0" /> {settingsForm.phone || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Copyright Banner */}
        <div className="text-xs font-mono text-slate-500 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Globe size={12} className="text-slate-400" /> Copyright Line:
          </span>
          <span className="text-slate-700 font-medium">{settingsForm.copyrightText || 'No Copyright Text Set'}</span>
        </div>
      </div>

      {/* Recent Posts List */}
      <div className="space-y-4 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Recent Posts List</h2>
          <span className="text-xs text-slate-400">{posts.length} Items</span>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white p-8 text-center text-xs text-slate-400 rounded-2xl border border-slate-200/80">
            No posts found. Click "+ Add New Post" to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-28 bg-slate-100 overflow-hidden">
                    {post.image ? (
                      <img src={post.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ImageIcon size={24} />
                      </div>
                    )}
                    <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                      <Calendar size={10} /> {post.date}
                    </span>
                  </div>

                  <div className="p-3">
                    <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-relaxed" title={post.title}>
                      {post.title}
                    </h3>
                  </div>
                </div>

                <div className="p-3 pt-0">
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => openEditPostModal(post)}
                      className="flex-1 bg-slate-100 text-slate-700 text-[11px] font-semibold py-1.5 rounded-lg hover:bg-slate-200 transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Edit3 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="flex-1 bg-rose-50 text-rose-600 text-[11px] font-semibold py-1.5 rounded-lg hover:bg-rose-100 transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL 1: EDIT GENERAL SETTINGS */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800">Edit General Settings</h2>
              <button onClick={() => setIsSettingsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSettingsSubmit} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Logo</label>
                <div className="flex items-center gap-3">
                  {settingsForm.logo && <img src={settingsForm.logo} alt="" className="h-10 w-10 object-contain bg-slate-900 p-1 rounded-lg" />}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files?.[0]) {
                        const img = await compressImage(e.target.files[0]);
                        setSettingsForm({ ...settingsForm, logo: img });
                      }
                    }}
                    className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-slate-100 file:text-xs"
                  />
                  {settingsForm.logo && (
                    <button
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, logo: '' })}
                      className="text-xs text-rose-500 font-semibold hover:underline"
                    >
                      Remove Logo
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={settingsForm.title}
                    onChange={(e) => setSettingsForm({ ...settingsForm, title: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={settingsForm.subtitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, subtitle: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={settingsForm.description}
                  onChange={(e) => setSettingsForm({ ...settingsForm, description: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Copyright Text</label>
                <input
                  type="text"
                  value={settingsForm.copyrightText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, copyrightText: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <button
                  type="button"
                  onClick={handleClearSettings}
                  className="px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={13} /> Clear All Data
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsSettingsModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 cursor-pointer">
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT RECENT POST */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-2">
            <div className="p-5 space-y-3.5 border-r border-slate-100">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-sm font-bold text-slate-800">{editingPostId ? 'Edit Recent Post' : 'Add New Recent Post'}</h2>
                <button onClick={() => setIsPostModalOpen(false)} className="text-slate-400 hover:text-slate-600 md:hidden cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handlePostSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Post Title</label>
                  <input
                    type="text"
                    value={postForm.title}
                    onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                    placeholder="Enter post title..."
                    className="w-full border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="text"
                    value={postForm.date}
                    onChange={(e) => setPostForm({ ...postForm, date: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Image Upload</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          const img = await compressImage(e.target.files[0]);
                          setPostForm({ ...postForm, image: img });
                        }
                      }}
                      className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:bg-slate-100 file:text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsPostModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 cursor-pointer">
                    {editingPostId ? 'Update Post' : 'Save Post'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-slate-950 p-5 flex flex-col justify-between text-white relative">
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="absolute top-3 right-3 text-slate-400 hover:text-white hidden md:block cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="space-y-3">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Globe size={12} /> Live Card Preview
                </span>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-3 space-y-2">
                  {postForm.image ? (
                    <img src={postForm.image} alt="Preview" className="w-full h-28 object-cover rounded-lg" />
                  ) : (
                    <div className="w-full h-28 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 text-xs">
                      No Image Uploaded
                    </div>
                  )}

                  <div className="space-y-0.5">
                    <span className="text-[9px] text-emerald-400 font-semibold">{postForm.date}</span>
                    <h4 className="text-xs font-bold text-slate-100 line-clamp-2 leading-snug">
                      {postForm.title || 'Your Post Title Here'}
                    </h4>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 pt-3 border-t border-slate-900">
                This shows how your compact post card will appear on the dashboard.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}