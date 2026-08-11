'use client';

import { useState, useEffect } from 'react';

// API Endpoint Path
const API_PATH = '/api/admission/admission-procedure/students';

// Interfaces
interface IFeeItem {
  sl: string;
  particulars: string;
  amount: string;
}

interface ISubSection {
  title: string;
  content: string;
  bulletPoints: string[];
}

interface IStudentCategory {
  categoryTitle: string;
  subSections: ISubSection[];
  highlightNote: string;
  feeSessionTitle: string;
  fees: IFeeItem[];
  totalPayable: string;
  additionalNotes: string[];
}

interface IStudentsData {
  _id?: string;
  categories: IStudentCategory[];
  contactInfo: {
    title: string;
    collegeName: string;
    address: string;
  };
}

const defaultFormData: IStudentsData = {
  categories: [
    {
      categoryTitle: 'For BD/National Student',
      subSections: [
        {
          title: 'Eligibility',
          content: 'Applicants must meet the criteria set by the Directorate General of Medical Education (DGME) under the Ministry of Health and Family Welfare, Government of Bangladesh.',
          bulletPoints: [],
        },
        {
          title: 'Selection & Admission',
          content: '',
          bulletPoints: [
            'Admission is based on the results of the DGME national medical admission test.',
            'Selection follows candidate preference and merit list as per DGME guidelines.',
            'Final selection is done by the admission committee formed by DGME.',
          ],
        },
      ],
      highlightNote: 'Selected students must complete admission within the declared deadline. Failure to do so will result in cancellation, and seats will be filled from the waiting list.',
      feeSessionTitle: 'Fee Structure (Session 2024-2025)',
      fees: [
        { sl: '01', particulars: 'Admission Fee', amount: '18,44,800/-' },
        { sl: '02', particulars: 'Internship Fee', amount: '1,80,000/-' },
      ],
      totalPayable: '20,24,800/-',
      additionalNotes: ['Monthly Tuition Fee: 10,000 until course', 'VAT applicable as per government rules'],
    },
  ],
  contactInfo: {
    title: 'Contact for Admission',
    collegeName: 'Uttara Adhunik Medical College',
    address: '🏢 House # 34, Road # 4, Sector # 9,\nSonargaon Janapath, Uttara Model Town,\nDhaka-1230, Bangladesh',
  },
};

export default function StudentsAdminPage() {
  const [list, setList] = useState<IStudentsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<IStudentsData>(defaultFormData);

  // Fetch All Records
  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_PATH, { cache: 'no-store' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setList(json.data);
      } else {
        setList([]);
      }
    } catch (err) {
      console.error('Failed to fetch students data:', err);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData(JSON.parse(JSON.stringify(defaultFormData)));
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: IStudentsData) => {
    setEditingId(item._id || null);
    setFormData(JSON.parse(JSON.stringify(item)));
    setIsModalOpen(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      const res = await fetch(`${API_PATH}/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        fetchList();
      } else {
        alert(json.message || 'Delete failed');
      }
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `${API_PATH}/${editingId}` : API_PATH;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        fetchList();
      } else {
        alert(json.error || 'Operation failed');
      }
    } catch (err) {
      console.error('Failed to save data:', err);
    }
  };

  // Helper Functions for Dynamic State Changes in Popup Form
  const updateCategory = (catIdx: number, field: string, value: any) => {
    const updated = { ...formData };
    updated.categories[catIdx] = { ...updated.categories[catIdx], [field]: value };
    setFormData(updated);
  };

  const addCategory = () => {
    setFormData({
      ...formData,
      categories: [
        ...formData.categories,
        {
          categoryTitle: 'For Foreign Students',
          subSections: [],
          highlightNote: '',
          feeSessionTitle: 'Fee Structure (Session 2024-2025)',
          fees: [],
          totalPayable: '',
          additionalNotes: [],
        },
      ],
    });
  };

  const removeCategory = (catIdx: number) => {
    const updated = { ...formData };
    updated.categories.splice(catIdx, 1);
    setFormData(updated);
  };

  const addSubSection = (catIdx: number) => {
    const updated = { ...formData };
    updated.categories[catIdx].subSections.push({ title: 'New Title', content: '', bulletPoints: [] });
    setFormData(updated);
  };

  const updateSubSection = (catIdx: number, subIdx: number, field: string, value: any) => {
    const updated = { ...formData };
    updated.categories[catIdx].subSections[subIdx] = {
      ...updated.categories[catIdx].subSections[subIdx],
      [field]: value,
    };
    setFormData(updated);
  };

  const removeSubSection = (catIdx: number, subIdx: number) => {
    const updated = { ...formData };
    updated.categories[catIdx].subSections.splice(subIdx, 1);
    setFormData(updated);
  };

  const addFeeItem = (catIdx: number) => {
    const updated = { ...formData };
    const len = updated.categories[catIdx].fees.length + 1;
    updated.categories[catIdx].fees.push({
      sl: len < 10 ? `0${len}` : `${len}`,
      particulars: '',
      amount: '',
    });
    setFormData(updated);
  };

  const updateFeeItem = (catIdx: number, feeIdx: number, field: string, value: string) => {
    const updated = { ...formData };
    updated.categories[catIdx].fees[feeIdx] = {
      ...updated.categories[catIdx].fees[feeIdx],
      [field]: value,
    };
    setFormData(updated);
  };

  const removeFeeItem = (catIdx: number, feeIdx: number) => {
    const updated = { ...formData };
    updated.categories[catIdx].fees.splice(feeIdx, 1);
    setFormData(updated);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto font-sans bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Student Admission & Fees Admin</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            API Route: <code className="bg-gray-200 px-1.5 py-0.5 rounded text-green-700">{API_PATH}</code>
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="bg-[#00873E] hover:bg-green-800 text-white px-5 py-2.5 rounded-lg font-medium shadow-md transition-all flex items-center gap-2 text-sm"
        >
          <span className="text-lg leading-none">+</span> Add New Record
        </button>
      </div>

      {/* Modern Square Cards Grid Container */}
      {loading ? (
        <div className="flex justify-center items-center p-16 text-gray-400 bg-white rounded-xl border border-gray-200">
          Loading records...
        </div>
      ) : list.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
          No records added yet. Click &quot;Add New Record&quot; to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between aspect-square group"
            >
              {/* Card Header & Content */}
              <div className="space-y-4 overflow-hidden">
                <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                      Admission Record
                    </span>
                    <h3 className="font-bold text-gray-900 text-base mt-2 line-clamp-1">
                      {item.contactInfo?.collegeName || 'N/A'}
                    </h3>
                  </div>
                </div>

                {/* Categories Badges */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Categories</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.categories && item.categories.length > 0 ? (
                      item.categories.map((cat, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md border border-gray-200 line-clamp-1"
                        >
                          {cat.categoryTitle}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">No categories</span>
                    )}
                  </div>
                </div>

                {/* Address Snippet */}
                {item.contactInfo?.address && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Address</p>
                    <p className="text-xs text-gray-600 line-clamp-3 whitespace-pre-line leading-relaxed">
                      {item.contactInfo.address}
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 mt-2 border-t border-gray-100 flex items-center justify-end gap-2 shrink-0">
                <button
                  onClick={() => handleOpenEditModal(item)}
                  className="px-3.5 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-semibold transition-all duration-150 border border-blue-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="px-3.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg text-xs font-semibold transition-all duration-150 border border-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* POPUP MODAL WITH FORM & LIVE PREVIEW */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-7xl max-h-[92vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-gray-200">
            {/* Modal Header */}
            <div className="p-4 bg-gray-900 text-white flex justify-between items-center shrink-0">
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
                {editingId ? 'Edit Admission & Fees Data' : 'Add Admission & Fees Data'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white text-xl font-bold px-2 rounded"
              >
                ✕
              </button>
            </div>

            {/* Split Screen Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
              {/* Left Column: Form Controls (7 cols) */}
              <form onSubmit={handleSubmit} className="lg:col-span-7 p-4 sm:p-6 overflow-y-auto space-y-6 border-r border-gray-200 bg-white">
                
                {/* Categories Loop */}
                {formData.categories.map((cat, catIdx) => (
                  <div key={catIdx} className="p-4 border border-gray-300 rounded-xl bg-gray-50 space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                      <h3 className="font-bold text-gray-800 text-sm">Category #{catIdx + 1} Section</h3>
                      {formData.categories.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCategory(catIdx)}
                          className="text-red-600 hover:text-red-800 text-xs font-bold"
                        >
                          Remove Category
                        </button>
                      )}
                    </div>

                    {/* Category Title */}
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Category Title (Main Header)</label>
                      <input
                        type="text"
                        className="w-full border p-2 rounded text-sm bg-white"
                        placeholder="e.g. For BD/National Student"
                        value={cat.categoryTitle}
                        onChange={(e) => updateCategory(catIdx, 'categoryTitle', e.target.value)}
                        required
                      />
                    </div>

                    {/* SubSections */}
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-gray-700">Sub-Sections (Eligibility, Selection, etc.)</label>
                        <button
                          type="button"
                          onClick={() => addSubSection(catIdx)}
                          className="text-xs text-green-700 font-bold hover:underline"
                        >
                          + Add Sub-Section
                        </button>
                      </div>

                      {cat.subSections.map((sub, subIdx) => (
                        <div key={subIdx} className="p-3 border rounded bg-white space-y-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-600">Sub-Section #{subIdx + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeSubSection(catIdx, subIdx)}
                              className="text-red-500 font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="Title (e.g. Eligibility)"
                            className="w-full border p-1.5 rounded"
                            value={sub.title}
                            onChange={(e) => updateSubSection(catIdx, subIdx, 'title', e.target.value)}
                          />
                          <textarea
                            placeholder="Normal Text Content (Optional)"
                            className="w-full border p-1.5 rounded"
                            rows={2}
                            value={sub.content}
                            onChange={(e) => updateSubSection(catIdx, subIdx, 'content', e.target.value)}
                          />
                          <textarea
                            placeholder="Bullet Points (comma separated)"
                            className="w-full border p-1.5 rounded"
                            rows={2}
                            value={sub.bulletPoints.join(', ')}
                            onChange={(e) =>
                              updateSubSection(
                                catIdx,
                                subIdx,
                                'bulletPoints',
                                e.target.value.split(',').map((s) => s.trim())
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>

                    {/* Highlight Note */}
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Highlight Note (Green Left Border Box)</label>
                      <textarea
                        className="w-full border p-2 rounded text-sm bg-white"
                        rows={2}
                        value={cat.highlightNote}
                        onChange={(e) => updateCategory(catIdx, 'highlightNote', e.target.value)}
                      />
                    </div>

                    {/* Fee Structure */}
                    <div className="space-y-3 pt-2">
                      <label className="text-xs font-bold text-gray-700 block">Fee Structure Configuration</label>
                      <input
                        type="text"
                        placeholder="Fee Header Title (e.g. Fee Structure (Session 2024-2025))"
                        className="w-full border p-2 rounded text-sm bg-white"
                        value={cat.feeSessionTitle}
                        onChange={(e) => updateCategory(catIdx, 'feeSessionTitle', e.target.value)}
                      />

                      {/* Fees Table Inputs */}
                      <div className="space-y-2">
                        {cat.fees.map((fee, feeIdx) => (
                          <div key={feeIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="SL"
                              className="w-12 border p-1.5 rounded text-xs text-center"
                              value={fee.sl}
                              onChange={(e) => updateFeeItem(catIdx, feeIdx, 'sl', e.target.value)}
                            />
                            <input
                              type="text"
                              placeholder="Particulars (e.g. Admission Fee)"
                              className="flex-1 border p-1.5 rounded text-xs"
                              value={fee.particulars}
                              onChange={(e) => updateFeeItem(catIdx, feeIdx, 'particulars', e.target.value)}
                            />
                            <input
                              type="text"
                              placeholder="Amount"
                              className="w-28 border p-1.5 rounded text-xs"
                              value={fee.amount}
                              onChange={(e) => updateFeeItem(catIdx, feeIdx, 'amount', e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() => removeFeeItem(catIdx, feeIdx)}
                              className="text-red-500 font-bold px-1"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addFeeItem(catIdx)}
                          className="text-xs text-blue-600 font-bold hover:underline"
                        >
                          + Add Fee Row
                        </button>
                      </div>

                      <div className="pt-1">
                        <label className="text-xs font-bold text-gray-700 block mb-1">Total Payable Amount</label>
                        <input
                          type="text"
                          placeholder="e.g. 20,24,800/-"
                          className="w-full border p-2 rounded text-sm bg-white"
                          value={cat.totalPayable}
                          onChange={(e) => updateCategory(catIdx, 'totalPayable', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Additional Fee Notes (comma separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. Monthly Tuition Fee: 10,000, VAT applicable"
                          className="w-full border p-2 rounded text-sm bg-white"
                          value={cat.additionalNotes.join(', ')}
                          onChange={(e) =>
                            updateCategory(
                              catIdx,
                              'additionalNotes',
                              e.target.value.split(',').map((s) => s.trim())
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addCategory}
                  className="w-full py-2.5 border-2 border-dashed border-gray-300 text-gray-700 rounded-xl font-bold text-xs hover:border-green-600 hover:text-green-700 transition"
                >
                  + Add Another Category (e.g. Foreign Student)
                </button>

                {/* Contact Information Section */}
                <div className="p-4 border border-gray-300 rounded-xl bg-gray-50 space-y-3">
                  <h3 className="font-bold text-gray-800 text-sm border-b pb-2">Contact Information Section</h3>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Section Title</label>
                    <input
                      type="text"
                      className="w-full border p-2 rounded text-sm bg-white"
                      value={formData.contactInfo.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactInfo: { ...formData.contactInfo, title: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">College Name</label>
                    <input
                      type="text"
                      className="w-full border p-2 rounded text-sm bg-white"
                      value={formData.contactInfo.collegeName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactInfo: { ...formData.contactInfo, collegeName: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Address Detail</label>
                    <textarea
                      className="w-full border p-2 rounded text-sm bg-white"
                      rows={3}
                      value={formData.contactInfo.address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactInfo: { ...formData.contactInfo, address: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#00873E] hover:bg-green-800 text-white py-3.5 rounded-xl font-bold text-sm shadow transition"
                >
                  Save All Changes
                </button>
              </form>

              {/* Right Column: Realtime Live Preview (5 cols) */}
              <div className="lg:col-span-5 p-4 sm:p-6 bg-gray-100 overflow-y-auto border-t lg:border-t-0">
                <div className="sticky top-0 bg-gray-100 pb-3 mb-2 border-b border-gray-300 flex justify-between items-center z-10">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span> Live Preview
                  </span>
                  <span className="text-[11px] text-gray-500">1:1 Design Matching</span>
                </div>

                {/* Frontend Mock Container */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-8 font-sans text-gray-800 text-xs sm:text-sm">
                  {formData.categories.map((cat, idx) => (
                    <div key={idx} className="space-y-4">
                      {/* Title */}
                      <div className="flex items-center gap-2">
                        <span className="w-1 h-6 bg-[#00873E] inline-block rounded-xs" />
                        <h2 className="text-lg sm:text-xl font-serif font-bold text-gray-800">
                          {cat.categoryTitle || 'Category Title'}
                        </h2>
                      </div>

                      {/* Subsections */}
                      {cat.subSections.map((sub, sIdx) => (
                        <div key={sIdx} className="space-y-1">
                          {sub.title && <h3 className="font-bold text-gray-900 text-xs sm:text-sm">{sub.title}</h3>}
                          {sub.content && <p className="text-gray-600 text-xs leading-relaxed">{sub.content}</p>}
                          {sub.bulletPoints.length > 0 && sub.bulletPoints[0] !== '' && (
                            <ul className="list-disc list-inside text-xs text-gray-600 space-y-0.5 pl-1">
                              {sub.bulletPoints.map((bp, bIdx) => (
                                <li key={bIdx}>{bp}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}

                      {/* Highlight Box */}
                      {cat.highlightNote && (
                        <div className="border-l-2 border-[#00873E] bg-[#F2F8F5] p-2.5 text-xs text-gray-700">
                          {cat.highlightNote}
                        </div>
                      )}

                      {/* Fees Table */}
                      {cat.fees.length > 0 && (
                        <div className="space-y-2 pt-1">
                          {cat.feeSessionTitle && (
                            <h3 className="font-serif font-bold text-gray-800 text-xs sm:text-sm">{cat.feeSessionTitle}</h3>
                          )}
                          <table className="w-full text-xs text-left border-collapse">
                            <thead>
                              <tr className="bg-[#EAF4EE] text-gray-700 font-semibold border-b">
                                <th className="p-2 w-8">Sl.</th>
                                <th className="p-2">Particulars</th>
                                <th className="p-2 text-right">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {cat.fees.map((fee, fIdx) => (
                                <tr key={fIdx} className="border-b border-gray-100">
                                  <td className="p-2">{fee.sl}</td>
                                  <td className="p-2">{fee.particulars}</td>
                                  <td className="p-2 text-right font-medium">{fee.amount}</td>
                                </tr>
                              ))}
                              {cat.totalPayable && (
                                <tr className="border-t font-bold text-gray-900">
                                  <td colSpan={2} className="p-2 text-right">Total Payable</td>
                                  <td className="p-2 text-right">{cat.totalPayable}</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Notes */}
                      {cat.additionalNotes.length > 0 && cat.additionalNotes[0] !== '' && (
                        <div className="text-xs text-gray-600 space-y-0.5">
                          {cat.additionalNotes.map((note, nIdx) => (
                            <p key={nIdx}>{note}</p>
                          ))}
                        </div>
                      )}

                      {idx < formData.categories.length - 1 && <hr className="my-4 border-gray-200" />}
                    </div>
                  ))}

                  {/* Contact Preview */}
                  {formData.contactInfo && (
                    <div className="space-y-2 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="w-1 h-6 bg-[#00873E] inline-block rounded-xs" />
                        <h2 className="text-lg font-serif font-bold text-gray-800">
                          {formData.contactInfo.title || 'Contact for Admission'}
                        </h2>
                      </div>
                      <div className="text-xs text-gray-700 space-y-1 pl-3 border-l-2 border-gray-200">
                        <p className="font-bold">{formData.contactInfo.collegeName}</p>
                        <p className="whitespace-pre-line text-gray-600">{formData.contactInfo.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}