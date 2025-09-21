import { useState } from 'react';
import { Volume2, Upload } from 'lucide-react';

export default function AudioPlayer({ 
  src, 
  cover, 
  title, 
  onUpdate 
}: { 
  src?: string; 
  cover?: string; 
  title?: string; 
  onUpdate?: (data: { src?: string; title?: string; cover?: string }) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title || '');
  const [tempSrc, setTempSrc] = useState(src || '');

  const handleSave = () => {
    onUpdate?.({
      src: tempSrc,
      title: tempTitle || 'Untitled Track',
      cover
    });
    setIsEditing(false);
  };

  if (!src && !isEditing) {
    return (
      <div className="p-4 text-center">
        <Volume2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm opacity-70 mb-3">No audio file set</p>
        <button
          onClick={() => setIsEditing(true)}
          className="dropsource-btn-secondary text-xs"
        >
          Add Audio URL
        </button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="p-3 space-y-3">
        <div>
          <label className="text-xs opacity-80">Track Title</label>
          <input
            type="text"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            placeholder="Enter track name..."
            className="dropsource-input text-sm w-full mt-1"
          />
        </div>
        <div>
          <label className="text-xs opacity-80">Audio URL</label>
          <input
            type="url"
            value={tempSrc}
            onChange={(e) => setTempSrc(e.target.value)}
            placeholder="Paste MP3/WAV URL..."
            className="dropsource-input text-sm w-full mt-1"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="dropsource-btn-primary text-xs flex-1"
            disabled={!tempSrc}
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="dropsource-btn-secondary text-xs"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded bg-gradient-to-br from-purple-500 to-blue-500 overflow-hidden flex-shrink-0">
          {cover ? (
            <img src={cover} className="w-full h-full object-cover" alt="" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <Volume2 className="w-5 h-5" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{title || 'Untitled Track'}</div>
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs opacity-60 hover:opacity-100 transition-opacity"
          >
            Edit details
          </button>
        </div>
      </div>
      <audio controls className="w-full" style={{ height: '32px' }}>
        <source src={src} type="audio/mpeg" />
        <source src={src} type="audio/wav" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}