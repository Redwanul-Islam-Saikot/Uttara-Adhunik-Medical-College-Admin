'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus, Upload, X, Image as ImageIcon } from 'lucide-react';

interface PrincipalMessageData {
  _id?: string;
  id?: string;
  subHeading: string;
  titleBlack: string;
  titleYellow: string;
  honorableText: string;
  name: string;
  designationMain: string;
  designationSub: string;
  tagline: string;
  description: string;
  signatureImage: string;
  principalImage: string;
  buttonText: string;
  buttonLink: string;
}

export default function AdminPrincipalMessage() {
  const [messages, setMessages] = useState<PrincipalMessageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const initialFormState = {
    subHeading: 'KNOWLEDGE MEETS INNOVATION',
    titleBlack: 'Message from the',
    titleYellow: 'Principal',
    honorableText: 'Honorable',
    name: '',
    designationMain: 'Principal',
    designationSub: '(In Charge)',
    tagline: 'Ensuring Quality Healthcare & Medical Education',
    description: '',
    signatureImage: '',
    principalImage: '',
    buttonText: 'Read More',
    buttonLink: '/principal-message',
  };

  const [formData, setFormData] = useState(initialFormState);

  // Fetch Data
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/principal-message');
      const data = await res.json();
      if (data.success) {
        setMessages(data.data ? (Array.isArray(data.data) ? data.data : [data.data]) : []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'signatureImage' | 'principalImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [fieldName]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Form (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/principal-message/${editingId}` : '/api/principal-message';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();
      if (resData.success) {
        alert(editingId ? 'Successfully Updated!' : 'Successfully Created!');
        resetForm();
        fetchMessages();
      } else {
        alert('Server Error: ' + (resData.error || 'Operation failed'));
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Network Error!');
    }
  };

  // Edit Button Handler Fix
  const handleEdit = (msg: PrincipalMessageData) => {
    const targetId = msg._id || msg.id;

    if (!targetId) {
      alert('Error: Document Mongo ID (_id) not found!');
      return;
    }

    setEditingId(String(targetId));
    setFormData({
      subHeading: msg.subHeading || '',
      titleBlack: msg.titleBlack || '',
      titleYellow: msg.titleYellow || '',
      honorableText: msg.honorableText || '',
      name: msg.name || '',
      designationMain: msg.designationMain || '',
      designationSub: msg.designationSub || '',
      tagline: msg.tagline || '',
      description: msg.description || '',
      signatureImage: msg.signatureImage || '',
      principalImage: msg.principalImage || '',
      buttonText: msg.buttonText || '',
      buttonLink: msg.buttonLink || '',
    });
    setIsModalOpen(true);
  };

  // Delete Button Handler Fix
  const handleDelete = async (msg: PrincipalMessageData) => {
    const targetId = msg._id || msg.id;

    if (!targetId) {
      alert('Error: Message ID missing!');
      return;
    }

    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const res = await fetch(`/api/principal-message/${targetId}`, { method: 'DELETE' });
      const resData = await res.json();

      if (resData.success) {
        alert('Deleted successfully!');
        if (editingId === targetId) resetForm();
        fetchMessages();
      } else {
        alert('Delete Failed: ' + (resData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Delete operation failed via API!');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] p-6 text-slate-800">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Principal Message Management</h1>
            <p className="text-xs font-semibold text-slate-400 mt-1">
              Total Active Items: <span className="text-emerald-600 font-bold">{messages.length}</span>
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-[#008751] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 cursor-pointer"
          >
            <Plus size={18} /> Add New Entry
          </button>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="py-12 text-center text-sm text-slate-500">Loading Content...</div>
        ) : messages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-400">
            No Principal Message records found. Click "Add New Entry" to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages.map((item, idx) => (
              <div key={item._id || item.id || idx} className="overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
                
                {/* Image Box */}
                <div className="relative h-56 w-full bg-slate-900 overflow-hidden flex items-center justify-center">
                  {item.principalImage ? (
                    <img src={item.principalImage} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-slate-500 text-xs flex flex-col items-center gap-1">
                      <ImageIcon size={32} /> No Principal Photo
                    </div>
                  )}
                  {item.signatureImage && (
                    <div className="absolute bottom-2 right-2 bg-white/90 p-1 rounded-lg border border-slate-200 shadow-sm">
                      <img src={item.signatureImage} alt="Signature" className="h-8 object-contain" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 space-y-3 flex-1">
                  {item.subHeading && (
                    <span className="inline-block rounded-md bg-emerald-50 px-2.5 py-1 text-[10px] font-bold tracking-wider text-emerald-700 uppercase">
                      {item.subHeading}
                    </span>
                  )}
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {item.titleBlack} <span className="text-amber-500">{item.titleYellow}</span>
                  </h3>
                  <div className="border-t border-slate-100 pt-2">
                    <p className="text-xs text-amber-600 font-semibold uppercase">{item.honorableText}</p>
                    <p className="text-sm font-bold text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.designationMain} {item.designationSub}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 p-3 bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition cursor-pointer"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-red-50/60 py-2 text-xs font-semibold text-rose-600 hover:bg-red-100 shadow-sm transition cursor-pointer"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Modal Window */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl overflow-hidden my-8">
              
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <h2 className="text-base font-bold text-slate-900">
                  {editingId ? 'Edit Principal Message' : 'Add New Principal Message'}
                </h2>
                <button onClick={resetForm} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                <div className="lg:col-span-7 p-6 space-y-4 max-h-[75vh] overflow-y-auto border-r border-slate-100">
                  
                  {/* Image Uploads */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Principal Image</label>
                      <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition p-2">
                        {formData.principalImage ? (
                          <img src={formData.principalImage} alt="Principal Preview" className="h-full object-contain rounded-lg" />
                        ) : (
                          <div className="text-center text-slate-400">
                            <Upload size={20} className="mx-auto mb-1" />
                            <span className="text-[11px] font-medium">Click to upload photo</span>
                          </div>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'principalImage')} />
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Signature Image</label>
                      <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition p-2">
                        {formData.signatureImage ? (
                          <img src={formData.signatureImage} alt="Signature Preview" className="h-full object-contain" />
                        ) : (
                          <div className="text-center text-slate-400">
                            <Upload size={20} className="mx-auto mb-1" />
                            <span className="text-[11px] font-medium">Click to upload signature</span>
                          </div>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'signatureImage')} />
                      </label>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sub Heading Tag</label>
                    <input
                      type="text"
                      name="subHeading"
                      value={formData.subHeading}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Title Main</label>
                      <input
                        type="text"
                        name="titleBlack"
                        value={formData.titleBlack}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Title Highlight (Yellow)</label>
                      <input
                        type="text"
                        name="titleYellow"
                        value={formData.titleYellow}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none font-semibold text-amber-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Honorable Label</label>
                      <input
                        type="text"
                        name="honorableText"
                        value={formData.honorableText}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Principal Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Main Designation</label>
                      <input
                        type="text"
                        name="designationMain"
                        value={formData.designationMain}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sub Designation</label>
                      <input
                        type="text"
                        name="designationSub"
                        value={formData.designationSub}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tagline</label>
                    <input
                      type="text"
                      name="tagline"
                      value={formData.tagline}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Button Text</label>
                      <input
                        type="text"
                        name="buttonText"
                        value={formData.buttonText}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Button Link</label>
                      <input
                        type="text"
                        name="buttonLink"
                        value={formData.buttonLink}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Description *</label>
                    <textarea
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                    ></textarea>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-[#008751] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition cursor-pointer"
                    >
                      {editingId ? 'Update Section' : 'Save Section'}
                    </button>
                  </div>

                </div>

                {/* Live Preview Panel */}
                <div className="lg:col-span-5 bg-[#030712] p-6 flex flex-col justify-between text-white">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 mb-4 block">LIVE PREVIEW</span>
                    <div className="space-y-4">
                      {formData.subHeading && (
                        <span className="inline-block rounded-full bg-emerald-950 border border-emerald-800 px-3 py-1 text-[10px] font-semibold text-emerald-300">
                          {formData.subHeading}
                        </span>
                      )}
                      <h2 className="text-xl font-bold tracking-tight text-white">
                        {formData.titleBlack || 'Title'} <span className="text-amber-400">{formData.titleYellow || 'Highlight'}</span>
                      </h2>
                      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 space-y-2">
                        <span className="text-[10px] uppercase text-amber-400 font-semibold">{formData.honorableText}</span>
                        <h4 className="text-base font-bold text-white">{formData.name || 'Principal Name'}</h4>
                        <p className="text-xs text-slate-400">{formData.designationMain} {formData.designationSub}</p>
                        <p className="text-xs text-slate-300 italic pt-1 border-t border-slate-800/80 line-clamp-3">
                          "{formData.description || 'Description message preview...'}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}