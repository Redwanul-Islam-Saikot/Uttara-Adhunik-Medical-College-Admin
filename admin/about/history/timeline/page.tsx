'use client';

import { useState, useEffect } from 'react';

export default function AdminTimelinePage() {
  const [header, setHeader] = useState({ mainTitle: '', subtitle: '', description: '' });
  const [items, setItems] = useState<any[]>([]);
  const [itemForm, setItemForm] = useState({ year: '', title: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const API_URL = '/api/about/timeline';

  const loadData = async () => {
    try {
      const res = await fetch(API_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);

      const data = await res.json();
      if (data.success) {
        setHeader(data.data.header || { mainTitle: '', subtitle: '', description: '' });
        setItems(data.data.items || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleHeaderSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'header', ...header }),
      });
      alert('Header config saved successfully!');
      loadData();
    } catch (error) {
      alert('Failed to save header');
    }
  };

  const handleHeaderDelete = async () => {
    if (confirm('Are you sure you want to delete header details?')) {
      setHeader({ mainTitle: '', subtitle: '', description: '' });
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'header', mainTitle: '', subtitle: '', description: '' }),
      });
      loadData();
    }
  };

  const handleItemSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editId) {
        await fetch(`${API_URL}/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemForm),
        });
        setEditId(null);
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'item', ...itemForm }),
        });
      }

      setItemForm({ year: '', title: '' });
      loadData();
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const res = await fetch(`${API_URL}/${itemId}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          setItems((prev) => prev.filter((item) => (item._id || item.id) !== itemId));
          loadData();
        } else {
          alert('Failed to delete item');
        }
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const hasHeaderData = header.mainTitle || header.subtitle || header.description;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 font-sans">
      <h1 className="text-2xl font-bold text-gray-800">Timeline Section Manager</h1>

      {/* HEADER INPUT FORM */}
      <form onSubmit={handleHeaderSave} className="bg-white p-6 rounded-lg border space-y-4 shadow-sm">
        <h2 className="font-bold text-lg text-gray-700">1. Header Configuration</h2>
        <input
          type="text"
          placeholder="Main Title (e.g. Timeline of UAMC's Evolution)"
          value={header.mainTitle}
          onChange={(e) => setHeader({ ...header, mainTitle: e.target.value })}
          className="w-full border p-2 rounded text-sm"
        />
        <input
          type="text"
          placeholder="Subtitle (e.g. Since - 1984)"
          value={header.subtitle}
          onChange={(e) => setHeader({ ...header, subtitle: e.target.value })}
          className="w-full border p-2 rounded text-sm"
        />
        <textarea
          placeholder="Description"
          value={header.description}
          onChange={(e) => setHeader({ ...header, description: e.target.value })}
          className="w-full border p-2 rounded text-sm h-20"
        />
        <button type="submit" className="bg-[#00873E] text-white px-4 py-2 rounded text-sm font-semibold">
          Save Header
        </button>
      </form>

      {/* HEADER DISPLAY CARD */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="font-bold text-lg text-gray-700 mb-4">Saved Header Card Preview</h2>
        {hasHeaderData ? (
          <div className="p-5 border rounded-lg bg-emerald-50/50 border-emerald-200 relative">
            <div className="pr-16">
              <span className="text-xs font-bold text-[#00873E] uppercase tracking-wider">Active Header Config</span>
              <h3 className="text-xl font-bold text-gray-800 mt-1">{header.mainTitle || 'No Title'}</h3>
              <p className="text-sm font-semibold text-[#00873E] mt-0.5">{header.subtitle || 'No Subtitle'}</p>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">{header.description || 'No Description'}</p>
            </div>
            <button
              type="button"
              onClick={handleHeaderDelete}
              className="absolute top-4 right-4 text-xs font-semibold text-red-600 hover:underline"
            >
              Clear Header
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-400">No active header configured yet.</p>
        )}
      </div>

      {/* ITEM INPUT FORM */}
      <form onSubmit={handleItemSave} className="bg-white p-6 rounded-lg border space-y-4 shadow-sm">
        <h2 className="font-bold text-lg text-gray-700">{editId ? 'Edit Item' : '2. Add Timeline Item'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Year (e.g. 1984)"
            value={itemForm.year}
            onChange={(e) => setItemForm({ ...itemForm, year: e.target.value })}
            className="border p-2 rounded text-sm"
            required
          />
          <input
            type="text"
            placeholder="Title / Description"
            value={itemForm.title}
            onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
            className="border p-2 rounded text-sm md:col-span-2"
            required
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#00873E] text-white px-4 py-2 rounded text-sm font-semibold disabled:opacity-50"
          >
            {loading ? 'Saving...' : editId ? 'Update Item' : 'Add Item'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setItemForm({ year: '', title: '' });
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-semibold"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* TIMELINE ITEMS DASHBOARD CARDS */}
      <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
        <h2 className="font-bold text-lg text-gray-700">Timeline Cards Dashboard ({items.length})</h2>
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item) => {
              const currentId = item._id || item.id;
              return (
                <div key={currentId} className="p-4 border rounded-lg bg-gray-50 flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-[#00873E] text-lg">[{item.year}]</span>
                    <p className="text-sm font-medium text-gray-700 mt-1">{item.title}</p>
                  </div>
                  <div className="flex justify-end gap-3 mt-4 pt-2 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setEditId(currentId);
                        setItemForm({ year: item.year, title: item.title });
                      }}
                      className="text-blue-600 text-xs font-semibold hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(currentId)}
                      className="text-red-600 text-xs font-semibold hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No items found.</p>
        )}
      </div>
    </div>
  );
}