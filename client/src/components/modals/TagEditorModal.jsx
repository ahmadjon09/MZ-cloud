/**
 * Colored Tags Editor Modal (MZ-CLOUD - react-icons/fi)
 * Add and remove tags on any Saved Message file item
 * 100% Mobile Responsive
 */
import React from 'react';
import {
  FiX,
  FiTag,
  FiPlus,
  FiSave
} from 'react-icons/fi';
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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200 font-sans">
      <div
        className="w-full max-w-md bg-[#1e2329] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 flex items-center justify-between bg-[#17212b]">
          <div className="flex items-center space-x-2.5">
            <FiTag className="w-5 h-5 text-[#2481cc]" />
            <div>
              <h3 className="font-semibold text-xs sm:text-sm text-white">
                Manage Colored Tags
              </h3>
              <span className="text-[10px] sm:text-xs text-slate-400">
                {file.fileName}
              </span>
            </div>
          </div>

          <button onClick={closeTagEditor} className="p-1.5 text-slate-400 hover:text-slate-200">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Tag input form */}
          <form onSubmit={handleAddTag} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type new tag and press enter (e.g. #travel)..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-[#17212b] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2481cc]"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-[#2481cc] hover:bg-[#2f88d2] text-white text-xs font-semibold rounded-xl flex items-center space-x-1 shadow-sm"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>

          {/* Current tags badge array */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Assigned Tags ({tags.length})
            </label>
            {tags.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No tags assigned.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#2481cc]/10 text-[#2481cc] border border-[#2481cc]/20"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Preset quick tag suggestions */}
          <div className="pt-2 border-t border-white/10">
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
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                      isSelected
                        ? 'bg-[#2481cc] text-white border-[#2481cc] opacity-50'
                        : 'bg-[#17212b] text-slate-300 border-white/10 hover:border-[#2481cc]'
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
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-white/10 bg-[#17212b] flex items-center justify-end space-x-3">
          <button
            onClick={closeTagEditor}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-400 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={updateFile.isPending}
            className="flex items-center space-x-1.5 px-5 py-2 bg-[#2481cc] hover:bg-[#2f88d2] text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            <FiSave className="w-4 h-4" />
            <span>{updateFile.isPending ? 'Saving...' : 'Save Tags'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
