'use client';

import React, { useEffect, useState } from 'react';
import { 
  Loader2 as Spinner, 
  Save as SaveIcon, 
  Trash2 as TrashIcon, 
  Plus, 
  Edit3, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Globe, 
  X 
} from 'lucide-react';

interface ContactData {
  _id?: string;
  phone: string;
  email: string;
  location: string;
  openHoursWeekday: string;
  openHoursWeekend: string;
  facebook: string;
  youtube: string;
  linkedin: string;
  instagram: string;
}

const emptyFormState: ContactData = {
  phone: '',
  email: '',
  location: '',
  openHoursWeekday: '',
  openHoursWeekend: '',
  facebook: '',
  youtube: '',
  linkedin: '',
  instagram: '',
};

export default function AdminContactDashboard() {
  const [contactInfo, setContactInfo] = useState<ContactData | null>(null);
  const [formData, setFormData] = useState<ContactData>(emptyFormState);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Contact Details from Database
  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/contact-info');
      const json = await res.json();
      if (json.success && json.data) {
        setContactInfo(json.data);
      } else {
        setContactInfo(null);
      }
    } catch (err) {
      console.error('Failed to fetch contact details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactInfo();
  }, []);

  // Open modal for Create or Edit
  const handleOpenModal = (data?: ContactData) => {
    if (data) {
      setFormData(data);
    } else {
      setFormData(emptyFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(emptyFormState);
  };

  // Submit Handler (Create / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const endpoint = formData._id
        ? `/api/contact-info/${formData._id}`
        : `/api/contact-info`;
      const method = formData._id ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        alert('Contact details saved successfully!');
        setContactInfo(json.data);
        handleCloseModal();
      } else {
        alert(json.message || 'Failed to save details.');
      }
    } catch (err) {
      alert('An error occurred while saving.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Handler
  const handleDelete = async () => {
    if (!contactInfo?._id || !confirm('Are you sure you want to delete this contact info?')) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/contact-info/${contactInfo._id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        alert('Contact information deleted successfully!');
        setContactInfo(null);
      } else {
        alert(json.message || 'Failed to delete');
      }
    } catch (err) {
      alert('Failed to delete contact info');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Spinner className="animate-spin text-[#00873E]" size={36} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Contact Info Dashboard</h1>
          <p className="text-xs text-gray-500 mt-1">Manage public contact details for the frontend page.</p>
        </div>

        {!contactInfo && (
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-[#00873E] hover:bg-[#006e33] text-white px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-md"
          >
            <Plus size={16} /> Add Contact Info
          </button>
        )}
      </div>

      {/* DASHBOARD CARD AREA */}
      {contactInfo ? (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition relative">
            {/* Card Action Buttons */}
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <span className="bg-emerald-50 text-[#00873E] text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                Active Details
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal(contactInfo)}
                  className="flex items-center gap-1 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition"
                >
                  <Edit3 size={14} /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
                >
                  <TrashIcon size={14} /> Delete
                </button>
              </div>
            </div>

            {/* Card Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-700">
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <Phone size={16} className="text-[#00873E] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-500">Phone</p>
                    <p className="font-semibold text-gray-800">{contactInfo.phone || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail size={16} className="text-[#00873E] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-500">Email</p>
                    <p className="font-semibold text-gray-800">{contactInfo.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-[#00873E] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-500">Location</p>
                    <p className="font-semibold text-gray-800">{contactInfo.location || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <Clock size={16} className="text-[#00873E] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-500">Open Hours</p>
                    <p className="font-semibold text-gray-800">{contactInfo.openHoursWeekday || 'N/A'}</p>
                    {contactInfo.openHoursWeekend && (
                      <p className="font-semibold text-gray-800">{contactInfo.openHoursWeekend}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Globe size={16} className="text-[#00873E] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-500">Social Links</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {contactInfo.facebook && <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px]">Facebook</span>}
                      {contactInfo.youtube && <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px]">YouTube</span>}
                      {contactInfo.linkedin && <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px]">LinkedIn</span>}
                      {contactInfo.instagram && <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px]">Instagram</span>}
                      {!contactInfo.facebook && !contactInfo.youtube && !contactInfo.linkedin && !contactInfo.instagram && (
                        <span className="text-gray-400">None</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center bg-gray-50">
          <p className="text-sm font-bold text-gray-700">No Contact Information Stored</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">Add contact details to display on the contact page.</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-[#00873E] hover:bg-[#006e33] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-sm"
          >
            <Plus size={16} /> Add Contact Info
          </button>
        </div>
      )}

      {/* FORM MODAL (CREATE / EDIT) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-base font-bold text-gray-800">
                {formData._id ? 'Edit Contact Information' : 'Add Contact Information'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-gray-700">Phone No</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 0255080711"
                    className="w-full border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#00873E]"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-gray-700">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. uamcoffice08@yahoo.com"
                    className="w-full border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#00873E]"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-gray-700">Location Address</label>
                <textarea
                  rows={2}
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Address details..."
                  className="w-full border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#00873E]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-gray-700">Open Hours (Weekday)</label>
                  <input
                    type="text"
                    value={formData.openHoursWeekday}
                    onChange={(e) => setFormData({ ...formData, openHoursWeekday: e.target.value })}
                    placeholder="e.g. Monday - Friday: 8:00 am - 5:00 pm"
                    className="w-full border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#00873E]"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-gray-700">Open Hours (Weekend)</label>
                  <input
                    type="text"
                    value={formData.openHoursWeekend}
                    onChange={(e) => setFormData({ ...formData, openHoursWeekend: e.target.value })}
                    placeholder="e.g. Saturday - Sunday: 8:00 am - 5:00 pm"
                    className="w-full border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#00873E]"
                  />
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs font-bold text-gray-800 mb-3">Social Links (URLs)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Facebook URL"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    className="w-full border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#00873E]"
                  />
                  <input
                    type="text"
                    placeholder="YouTube URL"
                    value={formData.youtube}
                    onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                    className="w-full border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#00873E]"
                  />
                  <input
                    type="text"
                    placeholder="LinkedIn URL"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="w-full border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#00873E]"
                  />
                  <input
                    type="text"
                    placeholder="Instagram URL"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="w-full border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#00873E]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-[#00873E] hover:bg-[#006e33] text-white px-5 py-2.5 rounded-xl font-bold transition shadow-sm"
                >
                  {submitting ? <Spinner size={16} className="animate-spin" /> : <SaveIcon size={16} />}
                  <span>Save Info</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}