/**
 * Create & Edit Folder Modal (Vector Icons Only - Lucide React)
 * Customize folder name, vector icon preset, color accent, and smart folder filter rules
 */
import React from 'react';
import {
  X,
  Folder as FolderIcon,
  Briefcase,
  Film,
  Music,
  Book,
  Code,
  Lock,
  Star,
  Rocket,
  Globe,
  Sparkles,
  Save
} from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useCreateFolder, useUpdateFolder } from '../../hooks/useFolders';

export default function FolderModal() {
  const { isFolderModalOpen, activeFolderModalFolder: folder, closeFolderModal } = useUIStore();
  const createFolder = useCreateFolder();
  const updateFolder = useUpdateFolder();

  const [name, setName] = React.useState('');
  const [emoji, setEmoji] = React.useState('Folder');
  const [color, setColor] = React.useState('#2481cc');
  const [isSmart, setIsSmart] = React.useState(false);
  const [smartFilter, setSmartFilter] = React.useState('');

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
  }, [folder, isFolderModalOpen]);

  if (!isFolderModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

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
  };

  const iconPresets = [
    { name: 'Folder', icon: FolderIcon },
    { name: 'Briefcase', icon: Briefcase },
    { name: 'Film', icon: Film },
    { name: 'Music', icon: Music },
    { name: 'Book', icon: Book },
    { name: 'Code', icon: Code },
    { name: 'Lock', icon: Lock },
    { name: 'Star', icon: Star },
    { name: 'Rocket', icon: Rocket },
    { name: 'Globe', icon: Globe }
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
        className="w-full max-w-md bg-telegram-light-card dark:bg-telegram-dark-card border border-telegram-light-border dark:border-telegram-dark-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-telegram-light-border dark:border-telegram-dark-border flex items-center justify-between bg-telegram-light dark:bg-telegram-dark/50">
          <div className="flex items-center space-x-2.5">
            <span className="text-telegram-blue">{renderIcon(emoji, 'w-6 h-6')}</span>
            <div>
              <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                {folder ? 'Edit Folder' : 'Create New Folder'}
              </h3>
              <span className="text-xs text-slate-400">
                Telegram Cloud Storage Folder
              </span>
            </div>
          </div>

          <button onClick={closeFolderModal} className="p-1.5 text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Folder Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Work & Projects..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-telegram-light dark:bg-telegram-dark border border-telegram-light-border dark:border-telegram-dark-border rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:border-telegram-blue"
            />
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
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
                        ? 'bg-telegram-blue text-white shadow-md scale-105'
                        : 'bg-telegram-light dark:bg-telegram-dark text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
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
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
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
            <div className="p-3 bg-telegram-light dark:bg-telegram-dark/60 rounded-xl border border-telegram-light-border dark:border-telegram-dark-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Smart Folder Filter</span>
                </span>
                <input
                  type="checkbox"
                  checked={isSmart}
                  onChange={(e) => setIsSmart(e.target.checked)}
                  className="w-4 h-4 accent-telegram-blue cursor-pointer"
                />
              </div>

              {isSmart && (
                <div className="mt-2">
                  <select
                    value={smartFilter}
                    onChange={(e) => setSmartFilter(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 bg-telegram-light-card dark:bg-telegram-dark-card border border-telegram-light-border dark:border-telegram-dark-border rounded-lg text-slate-800 dark:text-slate-100"
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
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createFolder.isPending || updateFolder.isPending}
              className="flex items-center space-x-1.5 px-5 py-2 bg-telegram-blue hover:bg-telegram-blue-hover text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
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
