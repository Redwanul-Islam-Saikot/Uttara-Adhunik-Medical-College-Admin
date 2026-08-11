'use client';

import React, { useEffect, useState } from 'react';

export default function AdminLibrary() {
  const [list, setList] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Form States
  const [openHours, setOpenHours] = useState('8:00AM - 9:00PM');
  const [studyAreas, setStudyAreas] = useState('Separate Study Area');
  const [titlePrefix, setTitlePrefix] = useState('About the');
  const [titleHighlight, setTitleHighlight] = useState('Library');
  const [logo, setLogo] = useState('');
  const [image, setImage] = useState('');
  const [boldDescription, setBoldDescription] = useState('');
  const [normalDescription, setNormalDescription] = useState('');
  const [totalBooks, setTotalBooks] = useState('3,371+');
  const [totalJournals, setTotalJournals] = useState('1,187+');
  const [bottomNote, setBottomNote] = useState('');

  const API_URL = '/api/facilities/library';

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const res = await fetch(API_URL, { cache: 'no-store' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setList(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'image') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxW = type === 'logo' ? 200 : 800;
          const scale = maxW / img.width;

          canvas.width = scale < 1 ? maxW : img.width;
          canvas.height = scale < 1 ? img.height * scale : img.height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          const compressed = canvas.toDataURL('image/jpeg', 0.75);
          if (type === 'logo') setLogo(compressed);
          else setImage(compressed);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingId(item._id);
      setOpenHours(item.openHours || '');
      setStudyAreas(item.studyAreas || '');
      setTitlePrefix(item.titlePrefix || 'About the');
      setTitleHighlight(item.titleHighlight || 'Library');
      setLogo(item.logo || '');
      setImage(item.image || '');
      setBoldDescription(item.boldDescription || '');
      setNormalDescription(item.normalDescription || '');
      setTotalBooks(item.totalBooks || '');
      setTotalJournals(item.totalJournals || '');
      setBottomNote(item.bottomNote || '');
    } else {
      setEditingId(null);
      setOpenHours('8:00AM - 9:00PM');
      setStudyAreas('Separate Study Area');
      setTitlePrefix('About the');
      setTitleHighlight('Library');
      setLogo('');
      setImage('');
      setBoldDescription('');
      setNormalDescription('');
      setTotalBooks('3,371+');
      setTotalJournals('1,187+');
      setBottomNote('');
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logo || !image) return alert('Please upload both Logo and Main Image!');

    setLoading(true);
    const payload = {
      openHours,
      studyAreas,
      titlePrefix,
      titleHighlight,
      logo,
      image,
      boldDescription,
      normalDescription,
      totalBooks,
      totalJournals,
      bottomNote,
    };

    try {
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) return alert(`Error: ${json.error}`);

      alert(editingId ? 'Updated Successfully!' : 'Saved Successfully!');
      setIsOpen(false);
      await fetchData();
    } catch (err) {
      alert('Network Error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        alert('Deleted successfully!');
        await fetchData();
      } else alert(`Failed: ${json.error}`);
    } catch (err) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Library Section Management</h1>
          <p className="text-xs text-gray-500">Manage About Library content dynamically</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#00873E] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
        >
          + Add New Library Content
        </button>
      </div>

      {isFetching && list.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-medium">Loading contents...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {list.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border border-dashed">
              <p className="text-gray-400 italic">No Library data added yet to the database.</p>
            </div>
          ) : (
            list.map((item) => (
              <div key={item._id} className="bg-white border rounded-lg p-4 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <img src={item.logo} alt="Logo" className="w-10 h-10 object-contain bg-gray-50 p-1 border rounded" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-800">{item.titlePrefix} {item.titleHighlight}</h4>
                    <p className="text-xs text-green-700 font-medium">{item.openHours}</p>
                  </div>
                </div>

                <div className="w-full h-40 bg-gray-100 rounded overflow-hidden">
                  <img src={item.image} alt="Library" className="w-full h-full object-cover" />
                </div>

                <p className="text-xs font-bold text-gray-800 line-clamp-1">{item.boldDescription}</p>

                <div className="flex justify-between items-center pt-2 border-t text-xs">
                  <button onClick={() => handleOpenModal(item)} className="text-blue-600 font-bold hover:underline">
                    Edit ([id])
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="text-red-600 font-bold hover:underline">
                    Delete ([id])
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl my-8">
            <h2 className="text-xl font-bold border-b pb-2 text-gray-800">
              {editingId ? 'Edit Library Section' : 'Add Library Section'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Open Hours Text</label>
                  <input
                    type="text"
                    value={openHours}
                    onChange={(e) => setOpenHours(e.target.value)}
                    className="w-full border p-2 text-sm rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Study Area Badge</label>
                  <input
                    type="text"
                    value={studyAreas}
                    onChange={(e) => setStudyAreas(e.target.value)}
                    className="w-full border p-2 text-sm rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Title Prefix</label>
                  <input
                    type="text"
                    value={titlePrefix}
                    onChange={(e) => setTitlePrefix(e.target.value)}
                    className="w-full border p-2 text-sm rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Title Highlight (Green)</label>
                  <input
                    type="text"
                    value={titleHighlight}
                    onChange={(e) => setTitleHighlight(e.target.value)}
                    className="w-full border p-2 text-sm rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Upload Logo Image (Icon)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'logo')}
                  className="w-full border p-1.5 text-xs rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Upload Main Library Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'image')}
                  className="w-full border p-1.5 text-xs rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Bold Description Text</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Bold heading description..."
                  value={boldDescription}
                  onChange={(e) => setBoldDescription(e.target.value)}
                  className="w-full border p-2 text-sm rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Normal Description Text</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Regular detail description..."
                  value={normalDescription}
                  onChange={(e) => setNormalDescription(e.target.value)}
                  className="w-full border p-2 text-sm rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Total Books Count</label>
                  <input
                    type="text"
                    value={totalBooks}
                    onChange={(e) => setTotalBooks(e.target.value)}
                    className="w-full border p-2 text-sm rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Total Journals Count</label>
                  <input
                    type="text"
                    value={totalJournals}
                    onChange={(e) => setTotalJournals(e.target.value)}
                    className="w-full border p-2 text-sm rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Bottom Disclaimer Note</label>
                <input
                  type="text"
                  placeholder="Optional note at the bottom..."
                  value={bottomNote}
                  onChange={(e) => setBottomNote(e.target.value)}
                  className="w-full border p-2 text-sm rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-[#00873E] text-white rounded-lg text-sm font-semibold hover:bg-green-700"
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