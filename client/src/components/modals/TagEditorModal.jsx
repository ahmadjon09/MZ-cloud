/**
 * Colored Tags Editor Modal
 * Add and remove tags on any Saved Message file item
 */
import React from 'react';
import {
  X,
  Tag,
  Plus,
  Save,
  Trash2
} from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useUpdateFile } from '../../hooks/useFiles';

export default function TagEditorModal() {
  const { activeTagModalFile: file, closeTagEditor } = useUIStore();
  const updateFile = useUpdateFile();

  const [tags, setTags] = React.useState([]);
  const [newTag, setNewTag] = React.useState('');

  React.useEffect(() => {
    if (file) {
      try {
        if (Array.isArray(file.tags)) {
          setTags(file.tags);
        } else {
          setTags(JSON.parse(file.tags || '[]'));
        }
      } catch (e) {
        setTags([]);
      }
    }
  }, [file]);

  if (!file) return null;

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!newTag || !newTag.trim()) return;
    const clean = newTag.trim().toLowerCase().replace(/^#/, '');
    if (!tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setNewTag('');
  };

  const handleRemoveTag = (t) => {
    setTags(tags.filter((item) => item !== t));
  };

  const handleSave = async () => {
    await updateFile.mutateAsync({
      id: file.id,
      data: { tags }
    });
    closeTagEditor();
  };

  const presetTags = ['work', 'personal', 'important', 'uzbekistan', 'project', 'telegram', 'archive'];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-telegram-light-card dark:bg-telegram-dark-card border border-telegram-light-border dark:border-telegram-dark-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-telegram-light-border dark:border-telegram-dark-border flex items-center justify-between bg-telegram-light dark:bg-telegram-dark/50">
          <div className="flex items-center space-x-2.5">
            <Tag className="w-5 h-5 text-telegram-blue" />
            <div>
              <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                Manage Colored Tags
              </h3>
              <span className="text-xs text-slate-400">
                {file.fileName}
              </span>
            </div>
          </div>

          <button onClick={closeTagEditor} className="p-1.5 text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Tag input form */}
          <form onSubmit={handleAddTag} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type new tag and press enter (e.g. #travel)..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-telegram-light dark:bg-telegram-dark border border-telegram-light-border dark:border-telegram-dark-border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:border-telegram-blue"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-telegram-blue hover:bg-telegram-blue-hover text-white text-xs font-semibold rounded-xl flex items-center space-x-1 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>

          {/* Current tags badge array */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
              Assigned Tags ({tags.length})
            </label>
            {tags.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No tags assigned.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-telegram-blue/10 text-telegram-blue border border-telegram-blue/20"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Preset quick tag suggestions */}
          <div className="pt-2 border-t border-telegram-light-border dark:border-telegram-dark-border">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Quick Suggestions
            </label>
            <div className="flex flex-wrap gap-1.5">
              {presetTags.map((p) => {
                const isSelected = tags.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      if (!isSelected) setTags([...tags, p]);
                    }}
                    disabled={isSelected}
                    className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
                      isSelected
                        ? 'bg-telegram-blue text-white border-telegram-blue opacity-50'
                        : 'bg-telegram-light dark:bg-telegram-dark text-slate-600 dark:text-slate-300 border-telegram-light-border dark:border-telegram-dark-border hover:border-telegram-blue'
                    }`}
                  >
                    +{p}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-telegram-light-border dark:border-telegram-dark-border bg-telegram-light dark:bg-telegram-dark/50 flex items-center justify-end space-x-3">
          <button
            onClick={closeTagEditor}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={updateFile.isPending}
            className="flex items-center space-x-1.5 px-5 py-2 bg-telegram-blue hover:bg-telegram-blue-hover text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{updateFile.isPending ? 'Saving...' : 'Save Tags'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
