import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { Search, Tag, Folder, Plus, Trash2, RefreshCw, CheckCircle2, Sparkles, Database } from 'lucide-react';
import { safeFetchJson } from '../utils/safeFetch';
import {
  queryClientNotes,
  getClientNotesMetadata,
  createClientNote,
  deleteClientNote,
  resetClientNotes
} from '../utils/clientNoteStorage';

export const NoteAppBenchTab: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  // Form State for creating new note with category and tags
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Work');
  const [newTagsInput, setNewTagsInput] = useState('urgent, roadmap');

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedTag) params.append('tag', selectedTag);

      const res = await safeFetchJson<Note[]>(`/api/notes?${params.toString()}`, undefined, []);
      if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
        setNotes(res.data);
      } else {
        // Client fallback (Vercel static hosting)
        const clientNotes = queryClientNotes({
          search: searchQuery,
          category: selectedCategory,
          tag: selectedTag
        });
        setNotes(clientNotes);
      }

      // Fetch metadata
      const metaRes = await safeFetchJson<{ categories?: string[]; tags?: string[] }>('/api/notes/meta', undefined, {});
      if (metaRes.ok && metaRes.data && metaRes.data.categories) {
        setCategories(metaRes.data.categories || []);
        setTags(metaRes.data.tags || []);
      } else {
        const clientMeta = getClientNotesMetadata();
        setCategories(clientMeta.categories);
        setTags(clientMeta.tags);
      }
    } catch (err) {
      console.error('Error fetching notes, using client storage:', err);
      const clientNotes = queryClientNotes({
        search: searchQuery,
        category: selectedCategory,
        tag: selectedTag
      });
      setNotes(clientNotes);
      const clientMeta = getClientNotesMetadata();
      setCategories(clientMeta.categories);
      setTags(clientMeta.tags);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [searchQuery, selectedCategory, selectedTag]);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    try {
      const res = await safeFetchJson('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle || 'Untitled Note',
          content: newContent,
          category: newCategory,
          tags: newTagsInput,
        }),
      });

      if (!res.ok) {
        // Fallback for Vercel static hosting
        createClientNote({
          title: newTitle || 'Untitled Note',
          content: newContent,
          category: newCategory,
          tags: newTagsInput
        });
      }

      setNewTitle('');
      setNewContent('');
      setShowAddModal(false);
      fetchNotes();
    } catch (err) {
      console.warn('Server create note failed, saving to client storage:', err);
      createClientNote({
        title: newTitle || 'Untitled Note',
        content: newContent,
        category: newCategory,
        tags: newTagsInput
      });
      setNewTitle('');
      setNewContent('');
      setShowAddModal(false);
      fetchNotes();
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const res = await safeFetchJson(`/api/notes/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        deleteClientNote(id);
      }
      fetchNotes();
    } catch (err) {
      console.warn('Server delete note failed, deleting from client storage:', err);
      deleteClientNote(id);
      fetchNotes();
    }
  };

  const handleResetDemo = async () => {
    try {
      await safeFetchJson('/api/notes/reset', { method: 'POST' });
    } catch (err) {
      console.warn('Server reset note failed:', err);
    }
    resetClientNotes();
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTag('');
    fetchNotes();
  };

  return (
    <div className="space-y-6">
      {/* Target App Live Header */}
      <div className="bg-[#21222D] border border-[#2A2C3A] rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
        <div>
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <Sparkles className="w-5 h-5 text-[#ACD1FD]" />
            <h2 className="text-base font-bold text-white">
              Target Note App - Live API Testing Bench
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
              <Database className="w-3 h-3" />
              <span>SQLite 3 DB (WAL Mode)</span>
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Live persistent CRUD and search queries powered by <code className="text-[#ACD1FD] font-mono bg-[#191A23] px-2 py-0.5 rounded-full">node:sqlite</code> database storage.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#958CE8] hover:bg-[#8378E5] text-white font-semibold text-xs rounded-xl transition-all flex items-center space-x-1.5 shadow-md shadow-[#958CE8]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create Note (with Tags)</span>
          </button>

          <button
            onClick={handleResetDemo}
            className="px-3.5 py-2 bg-[#2A2C3A] hover:bg-[#343748] text-slate-200 font-medium text-xs rounded-xl border border-slate-600/50 transition-all flex items-center space-x-1"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#ACD1FD]" />
            <span>Reset Demo Notes</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white border border-[#DBDBE5] rounded-2xl p-5 space-y-4 shadow-sm">
        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes across title, content, category, or tags..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#F4F5F8] border border-[#DBDBE5] rounded-xl text-xs text-[#21222D] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#958CE8] font-mono"
          />
        </div>

        {/* Categories & Tags Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-[#DBDBE5] pt-3">
          {/* Categories */}
          <div className="flex items-center space-x-2 overflow-x-auto py-1">
            <span className="text-[#21222D] font-bold flex items-center space-x-1 shrink-0">
              <Folder className="w-3.5 h-3.5 text-[#958CE8]" />
              <span>Category:</span>
            </span>
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1 rounded-full transition-all shrink-0 text-xs ${
                !selectedCategory
                  ? 'bg-[#21222D] text-white font-semibold'
                  : 'bg-[#F4F5F8] text-slate-600 hover:text-[#21222D]'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                className={`px-3 py-1 rounded-full transition-all shrink-0 text-xs ${
                  selectedCategory === cat
                    ? 'bg-[#958CE8] text-white font-semibold'
                    : 'bg-[#F4F5F8] text-slate-700 hover:text-[#21222D]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Tags */}
          <div className="flex items-center space-x-2 overflow-x-auto py-1">
            <span className="text-[#21222D] font-bold flex items-center space-x-1 shrink-0">
              <Tag className="w-3.5 h-3.5 text-[#958CE8]" />
              <span>Tag:</span>
            </span>
            <button
              onClick={() => setSelectedTag('')}
              className={`px-2.5 py-0.5 rounded-full transition-all shrink-0 text-xs ${
                !selectedTag ? 'bg-[#21222D] text-white font-semibold' : 'bg-[#F4F5F8] text-slate-600'
              }`}
            >
              All
            </button>
            {tags.map((tg) => (
              <button
                key={tg}
                onClick={() => setSelectedTag(selectedTag === tg ? '' : tg)}
                className={`px-2.5 py-0.5 rounded-full transition-all shrink-0 text-xs ${
                  selectedTag === tg
                    ? 'bg-[#ACD1FD] text-[#21222D] font-bold'
                    : 'bg-[#F4F5F8] text-slate-700 hover:text-[#21222D]'
                }`}
              >
                #{tg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <div
            key={note._id}
            className="bg-white border border-[#DBDBE5] hover:border-[#958CE8] rounded-2xl p-5 flex flex-col justify-between space-y-3 transition-all shadow-sm"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-sm text-[#21222D]">{note.title}</h3>
                <span className="px-2.5 py-0.5 bg-[#ACD1FD]/30 text-[#21222D] border border-[#ACD1FD] rounded-full text-[10px] font-mono font-semibold shrink-0">
                  {note.category || 'General'}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                {note.content}
              </p>
            </div>

            <div className="pt-2 border-t border-[#DBDBE5] flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {(note.tags || []).map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1 px-2 py-0.5 bg-[#F4F5F8] text-[#21222D] border border-[#DBDBE5] rounded-full text-[10px] font-mono font-medium"
                  >
                    <span>#{t}</span>
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleDeleteNote(note._id)}
                className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                title="Delete Note"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {notes.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-[#DBDBE5]">
            <p className="text-xs italic">No notes matched your search filters.</p>
          </div>
        )}
      </div>

      {/* Create Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#21222D]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#DBDBE5] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-[#21222D]">
            <h3 className="text-base font-bold text-[#21222D] flex items-center space-x-2">
              <Plus className="w-5 h-5 text-[#958CE8]" />
              <span>Create Note with Categories & Tags</span>
            </h3>

            <form onSubmit={handleCreateNote} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-bold">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Q3 Architecture Plan"
                  className="w-full bg-[#F4F5F8] border border-[#DBDBE5] rounded-xl px-3.5 py-2 text-[#21222D] focus:outline-none focus:ring-2 focus:ring-[#958CE8]"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-bold">Content</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={3}
                  placeholder="Note details..."
                  className="w-full bg-[#F4F5F8] border border-[#DBDBE5] rounded-xl px-3.5 py-2 text-[#21222D] focus:outline-none focus:ring-2 focus:ring-[#958CE8]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Category</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#F4F5F8] border border-[#DBDBE5] rounded-xl px-3.5 py-2 text-[#21222D] focus:outline-none focus:ring-2 focus:ring-[#958CE8]"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newTagsInput}
                    onChange={(e) => setNewTagsInput(e.target.value)}
                    placeholder="urgent, express"
                    className="w-full bg-[#F4F5F8] border border-[#DBDBE5] rounded-xl px-3.5 py-2 text-[#21222D] focus:outline-none focus:ring-2 focus:ring-[#958CE8]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#F4F5F8] text-slate-700 hover:bg-slate-200 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#958CE8] hover:bg-[#8378E5] text-white rounded-xl font-semibold shadow-md"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
