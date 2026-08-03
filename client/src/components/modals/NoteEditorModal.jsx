/**
 * Private Notes Markdown Editor Modal (MZ-CLOUD - react-icons/fi)
 * Attach private notes, links, and checkable task lists to any file item
 * 100% Mobile Responsive
 */
import React from 'react';
import {
  FiX,
  FiFileText,
  FiSave,
  FiEye,
  FiEdit3,
  FiCheckSquare,
  FiLink
} from 'react-icons/fi';
import { useUIStore } from '../../store/useUIStore';
import { useUpdateFile } from '../../hooks/useFiles';

export default function NoteEditorModal() {
  const { activeNoteModalFile: file, closeNoteEditor } = useUIStore();
  const updateFile = useUpdateFile();

  const [notes, setNotes] = React.useState('');
  const [caption, setCaption] = React.useState('');
  const [isPreview, setIsPreview] = React.useState(false);

  React.useEffect(() => {
    if (file) {
      setNotes(file.userNotes || '');
      setCaption(file.caption || '');
    }
  }, [file]);

  if (!file) return null;

  const handleSave = async () => {
    await updateFile.mutateAsync({
      id: file.id,
      data: {
        userNotes: notes,
        caption: caption
      }
    });
    closeNoteEditor();
  };

  const insertChecklist = () => {
    setNotes((prev) => prev + '\n- [ ] New checklist item\n');
  };

  const insertLink = () => {
    setNotes((prev) => prev + '\n[Link Title](https://example.com)\n');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200 font-sans">
      <div
        className="w-full max-w-lg sm:max-w-2xl bg-[#1e2329] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 flex items-center justify-between bg-[#17212b]">
          <div className="flex items-center space-x-2.5">
            <FiFileText className="w-5 h-5 text-[#2481cc]" />
            <div>
              <h3 className="font-semibold text-xs sm:text-sm text-white">
                Private Notes & Caption
              </h3>
              <span className="text-[10px] sm:text-xs text-slate-400">
                File: {file.fileName}
              </span>
            </div>
          </div>

          <button onClick={closeNoteEditor} className="p-1.5 text-slate-400 hover:text-slate-200">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Telegram Caption Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Telegram Caption
            </label>
            <input
              type="text"
              placeholder="Add or edit caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#17212b] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2481cc]"
            />
          </div>

          {/* Private Notes Editor Toolbar */}
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Private Markdown Notes
              </label>

              <div className="flex items-center flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={insertChecklist}
                  className="flex items-center space-x-1 px-2 py-1 text-[11px] rounded bg-[#2481cc]/10 text-[#2481cc] hover:bg-[#2481cc] hover:text-white transition-colors"
                >
                  <FiCheckSquare className="w-3.5 h-3.5" />
                  <span>+ Checklist</span>
                </button>
                <button
                  type="button"
                  onClick={insertLink}
                  className="flex items-center space-x-1 px-2 py-1 text-[11px] rounded bg-[#2481cc]/10 text-[#2481cc] hover:bg-[#2481cc] hover:text-white transition-colors"
                >
                  <FiLink className="w-3.5 h-3.5" />
                  <span>+ Link</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreview(!isPreview)}
                  className="flex items-center space-x-1 px-2 py-1 text-[11px] rounded bg-slate-700 text-slate-300 hover:bg-[#2481cc] hover:text-white transition-colors"
                >
                  {isPreview ? <FiEdit3 className="w-3.5 h-3.5" /> : <FiEye className="w-3.5 h-3.5" />}
                  <span>{isPreview ? 'Edit' : 'Preview'}</span>
                </button>
              </div>
            </div>

            {isPreview ? (
              <div className="w-full h-44 sm:h-48 p-4 bg-[#17212b]/80 border border-white/10 rounded-xl text-xs overflow-y-auto whitespace-pre-wrap leading-relaxed text-slate-200">
                {notes ? notes : <span className="text-slate-400 italic">No notes written.</span>}
              </div>
            ) : (
              <textarea
                rows="6"
                placeholder="Write private notes, markdown check-items (- [ ] Task 1), or reference links..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 text-xs font-mono bg-[#17212b] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2481cc] resize-none"
              />
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-white/10 bg-[#17212b] flex items-center justify-end space-x-3">
          <button
            onClick={closeNoteEditor}
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
            <span>{updateFile.isPending ? 'Saving...' : 'Save Notes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
