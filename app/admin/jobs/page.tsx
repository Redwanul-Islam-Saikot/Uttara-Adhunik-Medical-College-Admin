'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Loader2, RefreshCw, X, Eye } from 'lucide-react';

interface Job {
  _id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  deadline: string;
  experience: string;
  description: string;
  requirements: string[];
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialFormState = {
    title: '',
    department: 'Medical',
    type: 'Full-time',
    location: '',
    deadline: '',
    experience: '',
    description: '',
    requirements: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  // ১. ডাটাবেজ থেকে সব জব লোড করা
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      if (Array.isArray(data)) {
        setJobs(data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ২. ফর্ম বা মডাল ওপেন/ক্লোজ করা
  const openNewJobModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  // ৩. নতুন জব যোগ করা অথবা আপডেট করা
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      requirements: formData.requirements
        .split(',')
        .map((req) => req.trim())
        .filter((req) => req !== ''),
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/jobs/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          alert('Job updated successfully!');
        } else {
          alert('Failed to update job.');
        }
      } else {
        const res = await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          alert('Job published successfully!');
        } else {
          alert('Failed to publish job.');
        }
      }

      closeModal();
      await fetchJobs();
    } catch (error) {
      console.error('Submit Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ৪. এডিট বাটন
  const handleEdit = (job: Job) => {
    setEditingId(job._id);
    setFormData({
      title: job.title,
      department: job.department,
      type: job.type,
      location: job.location,
      deadline: job.deadline,
      experience: job.experience,
      description: job.description,
      requirements: Array.isArray(job.requirements) ? job.requirements.join(', ') : '',
    });
    setIsModalOpen(true);
  };

  // ৫. ডিলিট বাটন
  const handleDelete = async (id: string) => {
    if (!id) {
      alert('Error: Invalid Job ID');
      return;
    }

    if (confirm('Are you sure you want to delete this job posting?')) {
      try {
        const res = await fetch(`/api/jobs/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          await fetchJobs();
        } else {
          alert('Failed to delete job.');
        }
      } catch (error) {
        console.error('Delete Error:', error);
      }
    }
  };

  // ৬. ফর্ম রিসেট
  const resetForm = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  // লাইভ প্রিভিউ প্রসেসিং
  const parsedRequirements = formData.requirements
    .split(',')
    .map((r) => r.trim())
    .filter((r) => r !== '');

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      
      {/* HEADER WITH ADD NEW BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Job Management Panel</h1>
          <p className="text-xs text-gray-500 mt-1">Manage all active career circulars and postings</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchJobs} 
            className="p-2.5 bg-white border rounded-xl hover:bg-gray-100 transition shadow-sm text-gray-600"
            title="Refresh Data"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={openNewJobModal}
            className="bg-[#00873E] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#006e33] transition flex items-center gap-2 shadow-sm"
          >
            <Plus size={16} /> Add New Job
          </button>
        </div>
      </div>

      {/* JOBS LIST MAIN VIEW */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="font-bold text-base text-gray-900 mb-4">Active Circulars ({jobs.length})</h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-[#00873E]" size={28} />
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-xs border border-dashed rounded-xl">
            No job circulars found. Click &quot;Add New Job&quot; button above!
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="flex flex-col sm:flex-row justify-between sm:items-center p-4 border rounded-xl hover:bg-gray-50 transition gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-[#00873E] bg-emerald-50 px-2 py-0.5 rounded">
                      {job.department}
                    </span>
                    <span className="text-xs text-gray-400">• Deadline: {job.deadline}</span>
                  </div>
                  <p className="font-bold text-gray-900 text-sm mt-1">{job.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{job.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(job)}
                    className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                    title="Edit Job"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                    title="Delete Job"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* POPUP MODAL WITH LIVE PREVIEW */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
              <h2 className="font-bold text-base text-gray-900">
                {editingId ? '✏️ Edit Job Circular' : '➕ Create Job Circular'}
              </h2>
              <button 
                onClick={closeModal} 
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content - Split View */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* FORM SECTION */}
              <form id="jobForm" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Job Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Medical Officer"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full p-2.5 border rounded-xl text-xs bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-[#00873E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Department *</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full p-2.5 border rounded-xl text-xs bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-[#00873E]"
                    >
                      <option value="Medical">Medical</option>
                      <option value="Nursing">Nursing</option>
                      <option value="Diagnostics">Diagnostics</option>
                      <option value="Administration">Administration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Job Type *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full p-2.5 border rounded-xl text-xs bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-[#00873E]"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contractual">Contractual</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Location *</label>
                    <input
                      type="text"
                      placeholder="e.g. Uttara, Dhaka"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full p-2.5 border rounded-xl text-xs bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-[#00873E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Deadline *</label>
                    <input
                      type="text"
                      placeholder="e.g. 30 Aug 2026"
                      required
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="w-full p-2.5 border rounded-xl text-xs bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-[#00873E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Experience *</label>
                    <input
                      type="text"
                      placeholder="e.g. 2-3 Years"
                      required
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full p-2.5 border rounded-xl text-xs bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-[#00873E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Requirements (Comma Separated) *</label>
                  <input
                    type="text"
                    placeholder="e.g. MBBS Degree, BMDC Registered, Clinical exp"
                    required
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-xs bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-[#00873E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Job Description *</label>
                  <textarea
                    placeholder="Write job description here..."
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-xs bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-[#00873E]"
                  />
                </div>
              </form>

              {/* LIVE PREVIEW SECTION */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mb-4 border-b pb-2">
                    <Eye size={14} /> Live Card Preview
                  </div>

                  {/* Card Simulation */}
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[10px] uppercase font-bold text-[#00873E] bg-emerald-50 px-2 py-0.5 rounded">
                        {formData.department || 'Department'}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                        {formData.type || 'Type'}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900 text-base">
                        {formData.title || 'Job Title Preview'}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        📍 {formData.location || 'Location'} • ⏳ Deadline: {formData.deadline || 'Date'}
                      </p>
                    </div>

                    <div className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <p className="font-semibold text-gray-700 mb-0.5">Experience:</p>
                      <p>{formData.experience || 'Not specified'}</p>
                    </div>

                    <div className="text-xs text-gray-600">
                      <p className="font-semibold text-gray-700 mb-1">Description:</p>
                      <p className="line-clamp-2 text-gray-500">
                        {formData.description || 'Job description preview will appear here...'}
                      </p>
                    </div>

                    {parsedRequirements.length > 0 && (
                      <div className="text-xs">
                        <p className="font-semibold text-gray-700 mb-1">Requirements:</p>
                        <ul className="list-disc list-inside space-y-0.5 text-gray-500">
                          {parsedRequirements.map((req, idx) => (
                            <li key={idx} className="line-clamp-1">{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-gray-400 text-center mt-4">
                  * Dynamic user view representation
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="jobForm"
                disabled={submitting}
                className="bg-[#00873E] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#006e33] transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>{editingId ? 'Save Changes' : 'Publish Job'}</>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}