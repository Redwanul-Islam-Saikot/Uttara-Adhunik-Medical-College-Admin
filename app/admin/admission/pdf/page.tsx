'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Eye, FileText } from 'lucide-react';

interface IPDFItem {
  sl?: string;
  date: string;
  title: string;
  pdfUrl: string;
}

interface ICategoryData {
  _id?: string;
  category: 'papers' | 'forms' | 'results';
  mainTitle: string;
  subTitle: string;
  sectionHeader: string;
  footerNote: string;
  items: IPDFItem[];
}

const CATEGORIES: { key: 'papers' | 'forms' | 'results'; title: string }[] = [
  { key: 'papers', title: 'Admission Papers' },
  { key: 'forms', title: 'Application Form' },
  { key: 'results', title: 'Admission Results' },
];

export default function PDFAdminDashboard() {
  const [dashboardData, setDashboardData] = useState<Record<string, ICategoryData>>({});
  const [loading, setLoading] = useState(true);

  // Active Category State for Modal
  const [activeCategory, setActiveCategory] = useState<'papers' | 'forms' | 'results' | null>(null);
  const [formData, setFormData] = useState<ICategoryData>({
    category: 'papers',
    mainTitle: '',
    subTitle: '',
    sectionHeader: '',
    footerNote: '',
    items: [],
  });

  // Modal Item Input State
  const [itemInput, setItemInput] = useState<IPDFItem>({ sl: '', date: '', title: '', pdfUrl: '' });
  const [editItemIndex, setEditItemIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  // সব ক্যাটাগরির ডাটা একসাথে ফেচ করা
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const updatedMap: Record<string, ICategoryData> = {};
      for (const cat of CATEGORIES) {
        const res = await fetch(`/api/admission/pdf?category=${cat.key}`);
        const result = await res.json();
        if (result.success && result.data.length > 0) {
          updatedMap[cat.key] = result.data[0];
        } else {
          updatedMap[cat.key] = {
            category: cat.key,
            mainTitle: '',
            subTitle: '',
            sectionHeader: '',
            footerNote: '',
            items: [],
          };
        }
      }
      setDashboardData(updatedMap);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // মডাল ওপেন করা (Add New / Edit)
  const handleOpenModal = (catKey: 'papers' | 'forms' | 'results') => {
    setActiveCategory(catKey);
    const existing = dashboardData[catKey];
    setFormData(
      existing || {
        category: catKey,
        mainTitle: '',
        subTitle: '',
        sectionHeader: '',
        footerNote: '',
        items: [],
      }
    );
    setItemInput({ sl: '', date: '', title: '', pdfUrl: '' });
    setEditItemIndex(null);
  };

  // PDF আপলোড হ্যান্ডলার
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setItemInput((prev) => ({ ...prev, pdfUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // মডালের ভেতর টেবিল আইটেম যোগ/এডিট করা (যেকোনো ফিল্ড খালি রেখেই যোগ করা যাবে)
  const handleAddOrUpdateItem = () => {
    const updatedItems = [...formData.items];
    if (editItemIndex !== null) {
      updatedItems[editItemIndex] = itemInput;
    } else {
      updatedItems.push({
        ...itemInput,
      });
    }

    setFormData({ ...formData, items: updatedItems });
    setItemInput({ sl: '', date: '', title: '', pdfUrl: '' });
    setEditItemIndex(null);
  };

  // আইটেম মুছে ফেলা
  const handleRemoveItem = (index: number) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  // ডাটা সার্ভারে সেভ করা
  const handleSaveCategory = async () => {
    try {
      const res = await fetch('/api/admission/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        alert('Data saved and published successfully!');
        setActiveCategory(null);
        fetchAllData();
      } else {
        alert('Failed to save data.');
      }
    } catch (err) {
      alert('An error occurred while saving.');
    }
  };

  // নির্দিষ্ট ক্যাটাগরির সকল ডাটা ডিলিট করা
  const handleDeleteCategoryData = async (catKey: string, id?: string) => {
    if (!id) return;
    if (confirm(`Are you sure you want to clear all data for this card?`)) {
      await fetch(`/api/admission/pdf/${id}`, { method: 'DELETE' });
      fetchAllData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admission PDF Dashboard</h1>
          <p className="text-sm text-gray-500">Manage and publish PDF notices for different sections</p>
        </div>
      </div>

      {/* Grid Dashboard */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => {
          const data = dashboardData[cat.key];
          const hasItems = data && data.items && data.items.length > 0;

          return (
            <div
              key={cat.key}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 border-b bg-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText className="text-[#00873E]" size={20} />
                  <h2 className="font-bold text-gray-800 text-lg">{cat.title}</h2>
                </div>
                <span className="text-xs bg-emerald-100 text-[#00873E] px-2.5 py-1 rounded-full font-semibold">
                  {hasItems ? `${data.items.length} Items` : 'Empty'}
                </span>
              </div>

              <div className="p-5 flex-1 space-y-3 text-sm">
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase">Main Title</span>
                  <p className="font-medium text-gray-800 truncate">{data?.mainTitle || ''}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase">Section Header</span>
                  <p className="font-medium text-gray-800 truncate">{data?.sectionHeader || ''}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase">Total Files</span>
                  <p className="text-gray-600">{data?.items?.length || 0} PDF(s) attached</p>
                </div>
              </div>

              <div className="p-4 border-t bg-gray-50/50 flex gap-2">
                <button
                  onClick={() => handleOpenModal(cat.key)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#00873E] text-white py-2 px-3 rounded-lg text-xs font-semibold hover:bg-emerald-700 transition"
                >
                  {hasItems ? <Edit size={14} /> : <Plus size={14} />}
                  {hasItems ? 'Edit Data' : 'Add New'}
                </button>
                {data?._id && (
                  <button
                    onClick={() => handleDeleteCategoryData(cat.key, data._id)}
                    className="p-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Clear Category Data"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pop-up Modal Form + Live Preview Split View */}
      {activeCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b flex justify-between items-center bg-gray-900 text-white">
              <div>
                <h3 className="text-lg font-bold">
                  Manage Content: {CATEGORIES.find((c) => c.key === activeCategory)?.title}
                </h3>
                <p className="text-xs text-gray-400">Fill in details and preview in real-time</p>
              </div>
              <button
                onClick={() => setActiveCategory(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Body: Split 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto flex-1">
              {/* Form Input Side (Left Column) */}
              <div className="lg:col-span-6 p-5 border-r space-y-5 overflow-y-auto max-h-[70vh]">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Page Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Main Title</label>
                      <input
                        type="text"
                        value={formData.mainTitle}
                        onChange={(e) => setFormData({ ...formData, mainTitle: e.target.value })}
                        className="w-full p-2 border rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Sub Title</label>
                      <input
                        type="text"
                        value={formData.subTitle}
                        onChange={(e) => setFormData({ ...formData, subTitle: e.target.value })}
                        className="w-full p-2 border rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Section Header</label>
                      <input
                        type="text"
                        value={formData.sectionHeader}
                        onChange={(e) => setFormData({ ...formData, sectionHeader: e.target.value })}
                        className="w-full p-2 border rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Footer Note</label>
                      <input
                        type="text"
                        value={formData.footerNote}
                        onChange={(e) => setFormData({ ...formData, footerNote: e.target.value })}
                        className="w-full p-2 border rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>

                <hr />

                {/* PDF Item Form */}
                <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h4 className="text-xs font-bold text-gray-700 uppercase">
                    {editItemIndex !== null ? 'Edit PDF Item' : 'Add New PDF Item'}
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">SL No.</label>
                      <input
                        type="text"
                        value={itemInput.sl}
                        onChange={(e) => setItemInput({ ...itemInput, sl: e.target.value })}
                        className="w-full p-2 border rounded-lg text-xs bg-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Date</label>
                      <input
                        type="text"
                        value={itemInput.date}
                        onChange={(e) => setItemInput({ ...itemInput, date: e.target.value })}
                        className="w-full p-2 border rounded-lg text-xs bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Title</label>
                    <input
                      type="text"
                      value={itemInput.title}
                      onChange={(e) => setItemInput({ ...itemInput, title: e.target.value })}
                      className="w-full p-2 border rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">PDF File</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileUpload}
                      className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-[#00873E]"
                    />
                  </div>
                  <button
                    onClick={handleAddOrUpdateItem}
                    className="w-full bg-[#00873E] text-white py-2 rounded-lg text-xs font-semibold hover:bg-emerald-700 transition"
                  >
                    {editItemIndex !== null ? 'Update Item in List' : 'Add Item to Table'}
                  </button>
                </div>
              </div>

              {/* Live Preview Side (Right Column) */}
              <div className="lg:col-span-6 p-5 bg-gray-50 overflow-y-auto max-h-[70vh]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                  <Eye size={14} /> Live Frontend Preview
                </div>

                <div className="bg-white border rounded-xl p-4 shadow-xs space-y-4 font-sans text-gray-800">
                  {(formData.mainTitle || formData.subTitle) && (
                    <div className="text-center space-y-1">
                      {formData.mainTitle && (
                        <h1 className="text-xl font-serif font-bold text-gray-900">{formData.mainTitle}</h1>
                      )}
                      {formData.subTitle && <p className="text-xs text-gray-500">{formData.subTitle}</p>}
                    </div>
                  )}

                  {formData.sectionHeader && (
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-5 bg-[#00873E] inline-block rounded-xs" />
                      <h2 className="text-sm font-serif font-bold text-gray-900">{formData.sectionHeader}</h2>
                    </div>
                  )}

                  <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-[#EAF4EE] text-gray-800 font-semibold border-b">
                          <th className="p-2 w-10">No.</th>
                          <th className="p-2 w-24">Date</th>
                          <th className="p-2">Title</th>
                          <th className="p-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {formData.items.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="p-4 text-center text-xs text-gray-400">
                              No items added yet.
                            </td>
                          </tr>
                        ) : (
                          formData.items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="p-2 text-gray-500">{item.sl || ''}</td>
                              <td className="p-2 text-gray-700 whitespace-nowrap">{item.date || ''}</td>
                              <td className="p-2 text-gray-900 font-medium">{item.title || ''}</td>
                              <td className="p-2 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => {
                                      setEditItemIndex(idx);
                                      setItemInput(item);
                                    }}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                    title="Edit Item"
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleRemoveItem(idx)}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                    title="Delete Item"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {formData.footerNote && (
                    <div className="border-l-2 border-[#00873E] bg-gray-50 p-2 text-[11px] text-gray-600">
                      <span className="font-bold text-gray-900">Note: </span>
                      {formData.footerNote}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setActiveCategory(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                className="px-6 py-2 text-xs font-semibold bg-[#00873E] text-white rounded-lg hover:bg-emerald-700 transition"
              >
                Save & Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}