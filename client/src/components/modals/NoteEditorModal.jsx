/**
 * Private Notes Markdown Editor Modal
 * Attach private notes, links, and checkable task lists to any file item
 */
import React from 'react';
import {
  X,
  FileText,
  Save,
  Eye,
  Edit3,
  CheckSquare,
  Link as LinkIcon
} from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-telegram-light-card dark:bg-telegram-dark-card border border-telegram-light-border dark:border-telegram-dark-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-telegram-light-border dark:border-telegram-dark-border flex items-center justify-between bg-telegram-light dark:bg-telegram-dark/50">
          <div className="flex items-center space-x-2.5">
            <FileText className="w-5 h-5 text-telegram-blue" />
            <div>
              <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                Private Notes & Caption
              </h3>
              <span className="text-xs text-slate-400">
                File: {file.fileName}
              </span>
            </div>
          </div>

          <button onClick={closeNoteEditor} className="p-1.5 text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Telegram Caption Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Telegram Caption
            </label>
            <input
              type="text"
              placeholder="Add or edit caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-telegram-light dark:bg-telegram-dark border border-telegram-light-border dark:border-telegram-dark-border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:border-telegram-blue"
            />
          </div>

          {/* Private Notes Editor Toolbar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Private Markdown Notes (Checklists supported)
              </label>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={insertChecklist}
                  className="flex items-center space-x-1 px-2 py-1 text-[11px] rounded bg-telegram-blue/10 text-telegram-blue hover:bg-telegram-blue hover:text-white transition-colors"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>+ Checklist</span>
                </button>
                <button
                  type="button"
                  onClick={insertLink}
                  className="flex items-center space-x-1 px-2 py-1 text-[11px] rounded bg-telegram-blue/10 text-telegram-blue hover:bg-telegram-blue hover:text-white transition-colors"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>+ Link</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreview(!isPreview)}
                  className="flex items-center space-x-1 px-2 py-1 text-[11px] rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-telegram-blue hover:text-white transition-colors"
                >
                  {isPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{isPreview ? 'Edit' : 'Preview'}</span>
                </button>
              </div>
            </div>

            {isPreview ? (
              <div className="w-full h-48 p-4 bg-telegram-light dark:bg-telegram-dark/80 border border-telegram-light-border dark:border-telegram-dark-border rounded-xl text-xs overflow-y-auto whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200">
                {notes ? notes : <span className="text-slate-400 italic">No notes written.</span>}
              </div>
            ) : (
              <textarea
                rows="7"
                placeholder="Write private notes, markdown check-items (- [ ] Task 1), or reference links..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 text-xs font-mono bg-telegram-light dark:bg-telegram-dark border border-telegram-light-border dark:border-telegram-dark-border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:border-telegram-blue resize-none"
              />
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-telegram-light-border dark:border-telegram-dark-border bg-telegram-light dark:bg-telegram-dark/50 flex items-center justify-end space-x-3">
          <button
            onClick={closeNoteEditor}
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
            <span>{updateFile.isPending ? 'Saving...' : 'Save Notes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
