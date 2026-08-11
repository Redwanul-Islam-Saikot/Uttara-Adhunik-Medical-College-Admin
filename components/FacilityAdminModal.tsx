'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Eye, Image as ImageIcon, Loader2 } from 'lucide-react';

interface FacilityAdminModalProps {
  slug: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FacilityAdminModal({ slug, isOpen, onClose, onSuccess }: FacilityAdminModalProps) {
  const [docId, setDocId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>({
    logo: '',
    titlePrefix: '',
    titleHighlight: '',
    subTitleBold: '',
    subTitleNormal: '',
    descriptionBold: '',
    descriptionNormal: '',
    image1: '',
    image2: '',
    subSections: [],
    footerNote: '', // New field added
  });

  // Fetch Existing Data
  useEffect(() => {
    if (isOpen && slug) {
      fetch(`/api/facilities/reusable?slug=${slug}`)
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success && resData.data) {
            setFormData({
              ...resData.data,
              footerNote: resData.data.footerNote || '',
            });
            setDocId(resData.data._id || null);
          } else {
            setDocId(null);
            setFormData({
              logo: '',
              titlePrefix: '',
              titleHighlight: '',
              subTitleBold: '',
              subTitleNormal: '',
              descriptionBold: '',
              descriptionNormal: '',
              image1: '',
              image2: '',
              subSections: [],
              footerNote: '',
            });
          }
        })
        .catch((err) => console.error("Error fetching facility data:", err));
    }
  }, [slug, isOpen]);

  if (!isOpen) return null;

  // Auto-Compress and Convert Image to Base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleFactor = MAX_WIDTH / img.width;
        
        canvas.width = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
        canvas.height = img.width > MAX_WIDTH ? img.height * scaleFactor : img.height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedBase64 = canvas.toDataURL('image/png');
        setFormData((prev: any) => ({ ...prev, [fieldName]: compressedBase64 }));
      };
    };
  };

  // Add New Section (Container for Card Items)
  const addSubSection = () => {
    setFormData((prev: any) => ({
      ...prev,
      subSections: [
        ...(prev.subSections || []),
        { sectionTitle: '', items: [{ title: '', description: '' }] }
      ],
    }));
  };

  const removeSubSection = (sIdx: number) => {
    const updated = [...formData.subSections];
    updated.splice(sIdx, 1);
    setFormData({ ...formData, subSections: updated });
  };

  // Add New Card Item inside a Section
  const addItem = (sIdx: number) => {
    const updated = [...formData.subSections];
    if (!updated[sIdx].items) updated[sIdx].items = [];
    updated[sIdx].items.push({ title: '', description: '' });
    setFormData({ ...formData, subSections: updated });
  };

  const removeItem = (sIdx: number, iIdx: number) => {
    const updated = [...formData.subSections];
    updated[sIdx].items.splice(iIdx, 1);
    setFormData({ ...formData, subSections: updated });
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let res;
      if (docId) {
        res = await fetch(`/api/facilities/reusable/${docId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, pageSlug: slug }),
        });
      } else {
        res = await fetch('/api/facilities/reusable', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, pageSlug: slug }),
        });
      }

      const json = await res.json();
      if (json.success) {
        alert('Data saved successfully!');
        onSuccess();
        onClose();
      } else {
        alert(`Failed: ${json.message || 'Something went wrong!'}`);
      }
    } catch (err: any) {
      console.error(err);
      alert('Upload failed! Check network tab or payload size.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!docId) return;
    if (!confirm('Are you sure you want to delete this page data?')) return;

    try {
      const res = await fetch(`/api/facilities/reusable/${docId}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        alert('Deleted successfully!');
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex justify-center items-center p-2 md:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-7xl max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b bg-gray-50">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 capitalize">Manage Page: {slug}</h2>
            <p className="text-xs text-gray-500">Update content and preview changes live</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-gray-200 p-1 rounded-lg xl:hidden">
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${activeTab === 'form' ? 'bg-white shadow text-gray-800' : 'text-gray-600'}`}
              >
                Form
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-1 ${activeTab === 'preview' ? 'bg-white shadow text-[#00873E]' : 'text-gray-600'}`}
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
            </div>
            <button type="button" onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 xl:grid-cols-12 divide-y xl:divide-y-0 xl:divide-x">
          
          {/* FORM SECTION */}
          <div className={`p-6 space-y-6 xl:col-span-7 ${activeTab === 'preview' ? 'hidden xl:block' : 'block'}`}>
            <form id="facilityForm" onSubmit={handleSubmit} className="space-y-6">
              
              {/* Logo Upload Section */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Logo Image</label>
                <div className="flex items-center gap-4">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo" className="w-16 h-16 object-contain border p-1 bg-white rounded-lg" />
                  ) : (
                    <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'logo')}
                      className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-[#00873E] hover:file:bg-emerald-100 cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="Or paste image URL..."
                      value={formData.logo}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      className="w-full border p-2 rounded-lg text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Titles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Title Prefix</label>
                  <input
                    type="text"
                    placeholder="e.g. Training"
                    value={formData.titlePrefix}
                    onChange={(e) => setFormData({ ...formData, titlePrefix: e.target.value })}
                    className="w-full border p-2.5 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Title Highlight</label>
                  <input
                    type="text"
                    placeholder="e.g. Facilities"
                    value={formData.titleHighlight}
                    onChange={(e) => setFormData({ ...formData, titleHighlight: e.target.value })}
                    className="w-full border p-2.5 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* SubTitles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">SubTitle (Bold Lead)</label>
                  <input
                    type="text"
                    placeholder="Bold lead text..."
                    value={formData.subTitleBold}
                    onChange={(e) => setFormData({ ...formData, subTitleBold: e.target.value })}
                    className="w-full border p-2.5 rounded-lg text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">SubTitle (Normal Text)</label>
                  <input
                    type="text"
                    placeholder="Regular subtitle text..."
                    value={formData.subTitleNormal}
                    onChange={(e) => setFormData({ ...formData, subTitleNormal: e.target.value })}
                    className="w-full border p-2.5 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Description (Bold Lead)</label>
                  <textarea
                    rows={3}
                    placeholder="Bold starting description..."
                    value={formData.descriptionBold}
                    onChange={(e) => setFormData({ ...formData, descriptionBold: e.target.value })}
                    className="w-full border p-2.5 rounded-lg text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Description (Normal Text)</label>
                  <textarea
                    rows={3}
                    placeholder="Regular description..."
                    value={formData.descriptionNormal}
                    onChange={(e) => setFormData({ ...formData, descriptionNormal: e.target.value })}
                    className="w-full border p-2.5 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Banner Images Section */}
              <div className="border-t pt-4 space-y-4">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Banner Images</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Image 1 */}
                  <div className="bg-gray-50 p-3 rounded-xl border space-y-2">
                    <span className="text-xs font-semibold text-gray-600 block">Banner Image 1</span>
                    {formData.image1 && <img src={formData.image1} alt="Banner 1" className="w-full h-28 object-cover rounded-md" />}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'image1')}
                      className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-emerald-50 file:text-[#00873E] cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="Or Image 1 URL..."
                      value={formData.image1}
                      onChange={(e) => setFormData({ ...formData, image1: e.target.value })}
                      className="w-full border p-2 rounded-lg text-xs bg-white"
                    />
                  </div>

                  {/* Image 2 */}
                  <div className="bg-gray-50 p-3 rounded-xl border space-y-2">
                    <span className="text-xs font-semibold text-gray-600 block">Banner Image 2 (Optional)</span>
                    {formData.image2 && <img src={formData.image2} alt="Banner 2" className="w-full h-28 object-cover rounded-md" />}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'image2')}
                      className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-emerald-50 file:text-[#00873E] cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="Or Image 2 URL..."
                      value={formData.image2}
                      onChange={(e) => setFormData({ ...formData, image2: e.target.value })}
                      className="w-full border p-2 rounded-lg text-xs bg-white"
                    />
                  </div>

                </div>
              </div>

              {/* SubSections & Card List */}
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-bold text-gray-800">Card Sections</h3>
                    <p className="text-xs text-gray-500">Create subsections and add items</p>
                  </div>
                  <button
                    type="button"
                    onClick={addSubSection}
                    className="flex items-center gap-1.5 bg-[#00873E] hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                  >
                    <Plus className="w-4 h-4" /> Add Section
                  </button>
                </div>

                {formData.subSections?.map((section: any, sIdx: number) => (
                  <div key={sIdx} className="bg-gray-50 border p-4 rounded-xl space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => removeSubSection(sIdx)}
                      className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Section Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Facilities Overview"
                        value={section.sectionTitle}
                        onChange={(e) => {
                          const updated = [...formData.subSections];
                          updated[sIdx].sectionTitle = e.target.value;
                          setFormData({ ...formData, subSections: updated });
                        }}
                        className="w-full border p-2 rounded-lg text-sm bg-white"
                      />
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-700">Card Items</span>
                        <button
                          type="button"
                          onClick={() => addItem(sIdx)}
                          className="text-xs text-[#00873E] font-bold flex items-center gap-1 hover:underline"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Card Item
                        </button>
                      </div>

                      {section.items?.map((item: any, iIdx: number) => (
                        <div key={iIdx} className="flex gap-2 items-center bg-white p-2 rounded border">
                          <input
                            type="text"
                            placeholder="Title (Bold)"
                            value={item.title}
                            onChange={(e) => {
                              const updated = [...formData.subSections];
                              updated[sIdx].items[iIdx].title = e.target.value;
                              setFormData({ ...formData, subSections: updated });
                            }}
                            className="w-1/3 border p-1.5 rounded text-xs font-bold"
                          />
                          <input
                            type="text"
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => {
                              const updated = [...formData.subSections];
                              updated[sIdx].items[iIdx].description = e.target.value;
                              setFormData({ ...formData, subSections: updated });
                            }}
                            className="w-2/3 border p-1.5 rounded text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => removeItem(sIdx, iIdx)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* NEW FIELD: Bottom Footer Note */}
              <div className="border-t pt-4 space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Bottom Note Text (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. More detailed scopes and training outlines are available in the Academic Activities section."
                  value={formData.footerNote || ''}
                  onChange={(e) => setFormData({ ...formData, footerNote: e.target.value })}
                  className="w-full border p-2.5 rounded-lg text-xs bg-white"
                />
              </div>

            </form>
          </div>

          {/* REAL-TIME PREVIEW */}
          <div className={`p-6 bg-gray-100 xl:col-span-5 overflow-y-auto ${activeTab === 'form' ? 'hidden xl:block' : 'block'}`}>
            <div className="sticky top-0 mb-4 bg-white/80 backdrop-blur p-2 rounded-lg border flex items-center justify-between z-10 shadow-sm">
              <span className="text-xs font-bold text-[#00873E] uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4" /> Live Preview
              </span>
              <span className="text-[10px] text-gray-400">Updates live</span>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border space-y-6 text-left">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {formData.logo && <img src={formData.logo} alt="Logo" className="w-14 h-14 object-contain shrink-0" />}
                  <div>
                    {formData.titlePrefix && <h2 className="text-2xl font-serif text-[#00873E] font-bold leading-tight">{formData.titlePrefix}</h2>}
                    {formData.titleHighlight && <h2 className="text-2xl font-serif text-[#00873E] font-bold leading-tight">{formData.titleHighlight}</h2>}
                  </div>
                </div>

                {(formData.subTitleBold || formData.subTitleNormal) && (
                  <p className="text-sm text-gray-800">
                    {formData.subTitleBold && <strong className="font-bold">{formData.subTitleBold} </strong>}
                    {formData.subTitleNormal}
                  </p>
                )}

                {(formData.descriptionBold || formData.descriptionNormal) && (
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {formData.descriptionBold && <strong className="font-bold text-gray-800">{formData.descriptionBold} </strong>}
                    {formData.descriptionNormal}
                  </p>
                )}
              </div>

              {(formData.image1 || formData.image2) && (
                <div className={`grid gap-3 ${formData.image1 && formData.image2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {formData.image1 && (
                    <div className="h-32 rounded-lg overflow-hidden bg-gray-100">
                      <img src={formData.image1} alt="Banner 1" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {formData.image2 && (
                    <div className="h-32 rounded-lg overflow-hidden bg-gray-100">
                      <img src={formData.image2} alt="Banner 2" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}

              {formData.subSections?.map((section: any, idx: number) => (
                <div key={idx} className="space-y-3 pt-2">
                  {section.sectionTitle && (
                    <h3 className="text-lg font-serif font-bold text-gray-800 border-b pb-1">{section.sectionTitle}</h3>
                  )}
                  <div className="space-y-2">
                    {section.items?.map((item: any, iIdx: number) => (
                      <div key={iIdx} className="bg-[#EAF3EC] p-3 rounded-lg flex items-center justify-between gap-2">
                        <p className="text-xs text-gray-700">
                          {item.title && <strong className="font-bold text-gray-900">{item.title}</strong>}
                          {item.description ? `: ${item.description}` : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* LIVE PREVIEW: Bottom Note Text */}
              {formData.footerNote && (
                <div className="pt-4 border-t text-center">
                  <p className="text-xs text-gray-700 italic">
                    {formData.footerNote}
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
          {docId ? (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition"
            >
              Delete Page Data
            </button>
          ) : <div />}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="facilityForm"
              disabled={isSubmitting}
              className="bg-[#00873E] hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-xs font-semibold shadow transition flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {docId ? 'Update Data' : 'Save Data'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}