'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Upload, MapPin, Mail, Phone, Loader2, Globe } from 'lucide-react';

interface HeaderData {
  _id?: string;
  addressLine1: string;
  addressLine2: string;
  email: string;
  phone: string;
  collegeName: string;
  collegeSubtitle: string;
  logoUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
}

export default function AdminHeaderInfoPage() {
  const [items, setItems] = useState<HeaderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<HeaderData>({
    addressLine1: 'House - 34, Road - 4, Sector - 9,',
    addressLine2: 'Sonargaon Janapath, Uttara Model Town',
    email: 'info@uamc.com',
    phone: '+880 1700-220000',
    collegeName: 'Uttara Adhunik',
    collegeSubtitle: 'Medical College (UAMC)',
    logoUrl: '/Nav.png',
    facebookUrl: '#',
    youtubeUrl: '#',
    linkedinUrl: '#',
    instagramUrl: '#'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/header-info');
      const json = await res.json();
      if (json.success) setItems(json.data);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/header-info/${editingId}` : '/api/header-info';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (data.success) {
        alert(editingId ? 'Updated successfully!' : 'Saved successfully!');
        resetForm();
        fetchData();
      } else {
        alert('Operation failed: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong!');
    }
  };

  const handleEdit = (item: HeaderData) => {
    setEditingId(item._id || null);
    setForm({
      ...item,
      facebookUrl: item.facebookUrl || '#',
      youtubeUrl: item.youtubeUrl || '#',
      linkedinUrl: item.linkedinUrl || '#',
      instagramUrl: item.instagramUrl || '#'
    });
  };

  const handleDelete = async (id?: string) => {
    if (!id) {
      alert('Invalid Item ID');
      return;
    }

    if (confirm('Are you sure you want to delete this configuration?')) {
      try {
        const res = await fetch(`/api/header-info/${id}`, { method: 'DELETE' });
        const data = await res.json();

        if (data.success) {
          alert('Deleted successfully!');
          fetchData();
        } else {
          alert('Delete failed: ' + (data.message || data.error));
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('An error occurred while deleting.');
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      addressLine1: '',
      addressLine2: '',
      email: '',
      phone: '',
      collegeName: '',
      collegeSubtitle: '',
      logoUrl: '',
      facebookUrl: '#',
      youtubeUrl: '#',
      linkedinUrl: '#',
      instagramUrl: '#'
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 font-sans">
      <h1 className="text-2xl font-bold text-gray-800">Manage Header & Branding Info</h1>

      {/* FORM SECTION */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border space-y-5">
        <h2 className="font-bold text-lg text-gray-700">{editingId ? 'Edit Header Config' : 'Add New Header Config'}</h2>

        {/* Logo Box */}
        <div className="flex items-center gap-4 border p-4 rounded-xl bg-gray-50">
          <div className="w-14 h-14 border rounded-lg bg-white flex items-center justify-center p-1 shrink-0">
            {form.logoUrl ? <img src={form.logoUrl} alt="Logo Preview" className="max-h-full object-contain" /> : <Globe className="text-gray-400" />}
          </div>
          <div>
            <label className="bg-[#008751] text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center gap-2 hover:bg-[#006e42]">
              <Upload size={14} /> Upload Logo
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
            <p className="text-[11px] text-gray-400 mt-1">Select an image or paste direct URL below.</p>
          </div>
        </div>

        {/* Grid Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Logo URL</label>
            <input required value={form.logoUrl} onChange={e => setForm({ ...form, logoUrl: e.target.value })} className="w-full border p-2.5 rounded-xl outline-none" />
          </div>
          <div>
            <label className="font-semibold text-gray-600 block mb-1">College Name</label>
            <input required value={form.collegeName} onChange={e => setForm({ ...form, collegeName: e.target.value })} className="w-full border p-2.5 rounded-xl outline-none" />
          </div>
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Subtitle</label>
            <input required value={form.collegeSubtitle} onChange={e => setForm({ ...form, collegeSubtitle: e.target.value })} className="w-full border p-2.5 rounded-xl outline-none" />
          </div>
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Address Line 1</label>
            <input required value={form.addressLine1} onChange={e => setForm({ ...form, addressLine1: e.target.value })} className="w-full border p-2.5 rounded-xl outline-none" />
          </div>
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Address Line 2</label>
            <input required value={form.addressLine2} onChange={e => setForm({ ...form, addressLine2: e.target.value })} className="w-full border p-2.5 rounded-xl outline-none" />
          </div>
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Email</label>
            <input required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border p-2.5 rounded-xl outline-none" />
          </div>
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Phone</label>
            <input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border p-2.5 rounded-xl outline-none" />
          </div>
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Facebook URL</label>
            <input value={form.facebookUrl} onChange={e => setForm({ ...form, facebookUrl: e.target.value })} className="w-full border p-2.5 rounded-xl outline-none" placeholder="#" />
          </div>
          <div>
            <label className="font-semibold text-gray-600 block mb-1">YouTube URL</label>
            <input value={form.youtubeUrl} onChange={e => setForm({ ...form, youtubeUrl: e.target.value })} className="w-full border p-2.5 rounded-xl outline-none" placeholder="#" />
          </div>
          <div>
            <label className="font-semibold text-gray-600 block mb-1">LinkedIn URL</label>
            <input value={form.linkedinUrl} onChange={e => setForm({ ...form, linkedinUrl: e.target.value })} className="w-full border p-2.5 rounded-xl outline-none" placeholder="#" />
          </div>
          <div>
            <label className="font-semibold text-gray-600 block mb-1">Instagram URL</label>
            <input value={form.instagramUrl} onChange={e => setForm({ ...form, instagramUrl: e.target.value })} className="w-full border p-2.5 rounded-xl outline-none" placeholder="#" />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button type="submit" className="bg-[#008751] text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
            {editingId ? <Edit3 size={15} /> : <Plus size={15} />} {editingId ? 'Update Config' : 'Save Config'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-bold">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* CARDS LIST SECTION */}
      <div>
        <h2 className="font-bold text-lg text-gray-800 mb-4">Saved Configurations</h2>
        {loading ? (
          <div className="p-8 text-center text-gray-400 flex justify-center items-center gap-2">
            <Loader2 className="animate-spin" /> Loading...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((card) => (
              <div key={card._id} className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-3">
                    <img src={card.logoUrl} alt="Logo" className="w-10 h-10 object-contain" />
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">{card.collegeName}</h3>
                      <p className="text-[11px] text-gray-500">{card.collegeSubtitle}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(card)} className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100">
                      <Edit3 size={15} />
                    </button>
                    <button onClick={() => handleDelete(card._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                    <span>{card.addressLine1} {card.addressLine2}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-400 shrink-0" />
                    <span>{card.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-400 shrink-0" />
                    <span>{card.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}