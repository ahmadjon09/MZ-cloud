/**
 * Code & Document Modal Viewer
 * Syntax-highlighted code viewer and Markdown document preview
 */
import React from 'react';
import {
  X,
  Copy,
  Check,
  FileText,
  Code,
  Download,
  Share2
} from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

export default function CodeDocumentModal() {
  const { activeNoteModalFile: file, closeNoteEditor } = useUIStore();
  const [copied, setCopied] = React.useState(false);

  if (!file) return null;

  const sampleCodeSnippet = `/**
 * ${file.fileName}
 * Telegram Cloud Storage Platform - High Performance Storage Worker
 * Category: ${file.category} | Extension: .${file.extension}
 */

async function processTelegramCDNStream(fileId) {
  console.log("Reading from Telegram CDN stream:", fileId);
  const metadata = {
    fileId,
    timestamp: Date.now(),
    cachedInRedis: true
  };
  return metadata;
}

export default processTelegramCDNStream;`;

  const sampleMarkdown = `### 📄 Document: ${file.fileName}

**Telegram CDN Reference ID:** \`${file.fileId}\`

---

#### 📝 Overview
This document is securely indexed in the **Telegram Cloud Storage Platform** without permanent disk storage on any intermediate server.

#### 📌 Private Notes Attached
${file.userNotes || 'No private notes added yet.'}

#### ⚡ Checklist
- [x] Indexed in PostgreSQL FTS
- [x] Redis Cache updated
- [x] Ready for instant search`;

  const content = file.category === 'CODE' ? sampleCodeSnippet : sampleMarkdown;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl bg-telegram-light-card dark:bg-telegram-dark-card border border-telegram-light-border dark:border-telegram-dark-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-telegram-light-border dark:border-telegram-dark-border flex items-center justify-between bg-telegram-light dark:bg-telegram-dark/50">
          <div className="flex items-center space-x-3">
            {file.category === 'CODE' ? (
              <Code className="w-5 h-5 text-purple-500" />
            ) : (
              <FileText className="w-5 h-5 text-telegram-blue" />
            )}
            <div>
              <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                {file.fileName}
              </h3>
              <span className="text-xs text-slate-400">
                Telegram CDN Document Viewer
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-telegram-blue/10 text-telegram-blue hover:bg-telegram-blue hover:text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={closeNoteEditor}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer Body */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-xs leading-relaxed bg-slate-900 text-slate-200">
          <pre className="whitespace-pre-wrap">{content}</pre>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-telegram-light-border dark:border-telegram-dark-border bg-telegram-light dark:bg-telegram-dark/50 flex items-center justify-between text-xs text-slate-500">
          <span>Added: {new Date(file.createdAt).toLocaleDateString()}</span>
          <span className="text-telegram-blue font-semibold">
            Stored in Telegram CDN
          </span>
        </div>
      </div>
    </div>
  );
}
