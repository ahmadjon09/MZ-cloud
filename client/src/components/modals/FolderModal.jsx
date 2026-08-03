/**
 * Create & Edit Folder Modal (MZ-CLOUD - Vector Icons Only)
 * Customize folder name, vector icon preset, color accent, and smart folder filter rules
 * Includes comprehensive error handling & toast notifications
 */
import React from 'react';
import {
  FiX,
  FiFolder,
  FiBriefcase,
  FiFilm,
  FiMusic,
  FiBook,
  FiCode,
  FiLock,
  FiStar,
  FiGlobe,
  FiSave
} from 'react-icons/fi';
import { useUIStore } from '../../store/useUIStore';
import { useCreateFolder, useUpdateFolder } from '../../hooks/useFolders';
import { useUploadStore } from '../../store/useUploadStore';

export default function FolderModal() {
  const { isFolderModalOpen, activeFolderModalFolder: folder, closeFolderModal } = useUIStore();
  const createFolder = useCreateFolder();
  const updateFolder = useUpdateFolder();
  const uploadStore = useUploadStore();

  const [name, setName] = React.useState('');
  const [emoji, setEmoji] = React.useState('Folder');
  const [color, setColor] = React.useState('#2481cc');
  const [isSmart, setIsSmart] = React.useState(false);
  const [smartFilter, setSmartFilter] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');

  React.useEffect(() => {
    if (folder) {
      setName(folder.name || '');
      setEmoji(folder.emoji || 'Folder');
      setColor(folder.color || '#2481cc');
      setIsSmart(Boolean(folder.isSmart));
      setSmartFilter(folder.smartFilter || '');
    } else {
      setName('');
      setEmoji('Folder');
      setColor('#2481cc');
      setIsSmart(false);
      setSmartFilter('');
    }
    setErrorMsg('');
  }, [folder, isFolderModalOpen]);

  if (!isFolderModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Iltimos papka nomini kiriting.');
      return;
    }

    try {
      if (folder) {
        await updateFolder.mutateAsync({
          id: folder.id,
          data: { name: name.trim(), emoji, color }
        });
      } else {
        await createFolder.mutateAsync({
          name: name.trim(),
          emoji,
          color,
          isSmart,
          smartFilter: isSmart ? smartFilter : null
        });
      }
      closeFolderModal();
    } catch (err) {
      const msg = err.message || 'Papkani saqlashda xatolik yuz berdi';
      setErrorMsg(msg);
      uploadStore.addNotification(msg, 'error');
    }
  };

  const iconPresets = [
    { name: 'Folder', icon: FiFolder },
    { name: 'Briefcase', icon: FiBriefcase },
    { name: 'Film', icon: FiFilm },
    { name: 'Music', icon: FiMusic },
    { name: 'Book', icon: FiBook },
    { name: 'Code', icon: FiCode },
    { name: 'Lock', icon: FiLock },
    { name: 'Star', icon: FiStar },
    { name: 'Globe', icon: FiGlobe }
  ];

  const colorPresets = ['#2481cc', '#e53935', '#43a047', '#fbc02d', '#8e24aa', '#00acc1'];

  const renderIcon = (iconName, className = 'w-5 h-5') => {
    const preset = iconPresets.find((p) => p.name === iconName) || iconPresets[0];
    const IconComp = preset.icon;
    return <IconComp className={className} />;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#1e2329] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#17212b]">
          <div className="flex items-center space-x-2.5">
            <span className="text-[#2481cc]">{renderIcon(emoji, 'w-6 h-6')}</span>
            <div>
              <h3 className="font-semibold text-sm text-white">
                {folder ? 'Papkani Tahrirlash / Edit Folder' : 'Yangi Papka / New Folder'}
              </h3>
              <span className="text-xs text-slate-400">
                MZ-CLOUD Telegram CDN Storage
              </span>
            </div>
          </div>

          <button onClick={closeFolderModal} className="p-1.5 text-slate-400 hover:text-slate-200">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Folder Name / Papka Nomi
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Work & Projects..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#17212b] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2481cc]"
            />
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Folder Vector Icon
            </label>
            <div className="grid grid-cols-5 gap-2">
              {iconPresets.map((preset) => {
                const Icon = preset.icon;
                const isSelected = emoji === preset.name;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setEmoji(preset.name)}
                    className={`h-10 rounded-xl flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#2481cc] text-white shadow-md scale-105'
                        : 'bg-[#17212b] text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Accent Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Folder Accent Color
            </label>
            <div className="flex items-center space-x-2">
              {colorPresets.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    color === c ? 'scale-125 border-white shadow-md' : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Smart Folder Option (New Only) */}
          {!folder && (
            <div className="p-3 bg-[#17212b]/60 rounded-xl border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center space-x-1.5">
                  <FiStar className="w-3.5 h-3.5 text-amber-500" />
                  <span>Smart Folder Filter (Avtomatik filtrlash)</span>
                </span>
                <input
                  type="checkbox"
                  checked={isSmart}
                  onChange={(e) => setIsSmart(e.target.checked)}
                  className="w-4 h-4 accent-[#2481cc] cursor-pointer"
                />
              </div>

              {isSmart && (
                <div className="mt-2">
                  <select
                    value={smartFilter}
                    onChange={(e) => setSmartFilter(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 bg-[#1e2329] border border-white/10 rounded-lg text-white"
                  >
                    <option value="category:PHOTO">Photos Only</option>
                    <option value="category:VIDEO">Videos Only</option>
                    <option value="isFavorite:true">Favorited Files</option>
                  </select>
                </div>
              )}
            </div>
          )}

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={closeFolderModal}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-400 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createFolder.isPending || updateFolder.isPending}
              className="flex items-center space-x-1.5 px-5 py-2 bg-[#2481cc] hover:bg-[#2f88d2] text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              <FiSave className="w-4 h-4" />
              <span>
                {createFolder.isPending || updateFolder.isPending ? 'Saving...' : folder ? 'Update Folder' : 'Create Folder'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
