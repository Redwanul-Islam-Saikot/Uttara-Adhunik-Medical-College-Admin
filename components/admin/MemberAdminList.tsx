'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

interface Member {
  _id?: string;
  id?: string;
  name: string;
  designation: string;
  description?: string;
  image: string;
  category: 'founder' | 'ec' | 'gb';
  order: number;
}

interface Props {
  category: 'founder' | 'ec' | 'gb';
  title: string;
}

export default function MemberAdminList({ category, title }: Props) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Form States
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [order, setOrder] = useState(0);
  const [uploading, setUploading] = useState(false);

  // GET: Fetch Members
  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/about/members?category=${category}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMembers(data.data || []);
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Modal (New or Edit)
  const openModal = (member?: Member) => {
    if (member) {
      setEditingMember(member);
      setName(member.name);
      setDesignation(member.designation);
      setDescription(member.description || '');
      setImage(member.image);
      setOrder(member.order || 0);
    } else {
      setEditingMember(null);
      setName('');
      setDesignation('');
      setDescription('');
      setImage('');
      setOrder(0);
    }
    setIsModalOpen(true);
  };

  // POST & PUT Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert('Please upload an image first');
      return;
    }

    // ID চেক (_id অথবা id)
    const targetId = editingMember?._id || editingMember?.id;

    const payload = {
      name,
      designation,
      description,
      image,
      category,
      order,
    };

    try {
      const url = targetId
        ? `/api/about/members/${targetId}`
        : '/api/about/members';

      const method = targetId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchMembers();
      } else {
        alert(data.message || 'Operation failed.');
      }
    } catch (err: any) {
      alert(err.message || 'Error occurred');
    }
  };

  // DELETE Handler
  const handleDelete = async (id?: string) => {
    if (!id) {
      alert('Member ID not found!');
      return;
    }

    if (!confirm('Are you sure you want to delete this member?')) return;

    try {
      const res = await fetch(`/api/about/members/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        setMembers((prev) =>
          prev.filter((item) => (item._id || item.id) !== id)
        );
      } else {
        alert(data.message || 'Failed to delete member');
      }
    } catch (err: any) {
      alert('Error deleting member');
    }
  };

  return (
    <div className="ml-0 md:ml-64 lg:ml-72 p-6 bg-white rounded-lg shadow-sm min-h-[calc(100vh-3rem)]">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">{title} Management</h2>
        <button
          onClick={() => openModal()}
          className="bg-[#00873E] hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-all"
        >
          + Add New Member
        </button>
      </div>

      {loading ? (
        <p className="text-center py-8 text-gray-500">Loading members...</p>
      ) : members.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-500 text-sm">No members added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {members.map((member) => {
            const memberId = member._id || member.id;
            return (
              <div
                key={memberId || member.name}
                className="border rounded-lg p-4 bg-[#EBF4EC]"
              >
                <div className="relative w-full h-[300px] rounded overflow-hidden mb-3">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-bold text-gray-900 text-base">
                  {member.name}
                </h3>
                <p className="text-xs text-[#00873E] font-semibold mt-1">
                  {member.designation}
                </p>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => openModal(member)}
                    className="flex-1 bg-blue-600 text-white text-xs py-2 rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(memberId)}
                    className="flex-1 bg-red-600 text-white text-xs py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold">
              {editingMember ? 'Edit Member' : 'Add New Member'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border p-2 rounded text-sm mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold">Designation</label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full border p-2 rounded text-sm mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border p-2 rounded text-sm mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full border p-2 rounded text-sm mt-1"
                />
                {image && (
                  <div className="relative w-20 h-24 mt-2 border rounded overflow-hidden">
                    <Image
                      src={image}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs font-semibold">Display Order</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-full border p-2 rounded text-sm mt-1"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-xs rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-[#00873E] text-white text-xs rounded hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}