import React, { useEffect, useMemo, useRef, useState } from "react";
import { computeRhymeMarks } from "../utils/rhyme";
import "../styles/rhyme.css";

interface LyricsEditorProps {
  isRhymeHighlightEnabled?: boolean;
  isDrawingMode?: boolean;
  onDrawingStart?: () => void;
  onTextChange?: (text: string) => void;
  onSelectionChange?: (selection: { start: number; end: number }) => void;
  showStats?: boolean;
  selectedColor?: string;
  brushSize?: number;
  selectedTool?: 'brush' | 'pencil' | 'highlighter' | 'eraser';
  onUndo?: () => void;
  onClearDrawing?: () => void;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g,"&")
    .replace(/</g,"<")
    .replace(/>/g,">")
    .replace(/"/g,"&quot;");
}

export function LyricsEditor({ 
  isRhymeHighlightEnabled = false, 
  isDrawingMode = false,
  onDrawingStart,
  onTextChange,
  onSelectionChange,
  showStats = false,
  selectedColor = '#60A5FA',
  brushSize = 3,
  selectedTool = 'brush',
  onUndo,
  onClearDrawing
}: LyricsEditorProps) {
  const [value, setValue] = useState<string>('');
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  
  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [drawingHistory, setDrawingHistory] = useState<ImageData[]>([]);

  // Debounce recompute without causing loops
  const [marks, setMarks] = useState(() => computeRhymeMarks(value));
  const debounced = useRef<number | null>(null);

  useEffect(() => {
    if (debounced.current) cancelAnimationFrame(debounced.current);
    const v = value; 
    const e = isRhymeHighlightEnabled;
    debounced.current = requestAnimationFrame(() => {
      setMarks(e ? computeRhymeMarks(v) : []);
    });
    return () => {
      if (debounced.current) cancelAnimationFrame(debounced.current);
    };
  }, [value, isRhymeHighlightEnabled]);

  // Build overlay HTML safely
  const overlayHTML = useMemo(() => {
    if (!marks.length) return escapeHtml(value).replace(/\n/g, "<br/>");
    // build plain text with spans around ranges
    let html = "";
    let idx = 0;
    for (const m of marks) {
      if (idx < m.start) html += escapeHtml(value.slice(idx, m.start));
      const chunk = escapeHtml(value.slice(m.start, m.end));
      html += `<span class="rhyme-span" style="background:${m.color}">${chunk}</span>`;
      idx = m.end;
    }
    if (idx < value.length) html += escapeHtml(value.slice(idx));
    return html.replace(/\n/g, "<br/>");
  }, [value, marks]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  // Initialize canvas when drawing mode is enabled
  useEffect(() => {
    if (isDrawingMode && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [isDrawingMode]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setValue(newText);
    if (onTextChange) onTextChange(newText);
  };

  const handleSelectionChange = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      setSelectionStart(start);
      setSelectionEnd(end);
      if (onSelectionChange) onSelectionChange({ start, end });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = value.substring(0, start) + '  ' + value.substring(end);
      
      setValue(newText);
      if (onTextChange) onTextChange(newText);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const insertSection = (sectionType: string) => {
    const sectionText = `\n[${sectionType}]\n`;
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const newText = value.substring(0, start) + sectionText + value.substring(start);
      
      setValue(newText);
      if (onTextChange) onTextChange(newText);
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + sectionText.length;
        textarea.focus();
      }, 0);
    }
  };

  // Drawing functions
  const saveCanvasState = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      setDrawingHistory(prev => [...prev, imageData].slice(-20));
    }
  };

  const undoDrawing = () => {
    if (drawingHistory.length === 0 || !canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      const lastState = drawingHistory[drawingHistory.length - 1];
      ctx.putImageData(lastState, 0, 0);
      setDrawingHistory(prev => prev.slice(0, -1));
    }
    
    if (onUndo) onUndo();
  };

  const clearDrawing = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setDrawingHistory([]);
    }
    
    if (onClearDrawing) onClearDrawing();
  };

  // Enhanced drawing event handlers for touch support
  const getEventPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * (canvas.width / rect.width),
        y: (touch.clientY - rect.top) * (canvas.height / rect.height)
      };
    } else {
      // Mouse event
      return {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height)
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode || !canvasRef.current) return;
    
    e.preventDefault(); // Prevent scrolling on touch devices
    saveCanvasState();
    setIsDrawing(true);
    const { x, y } = getEventPos(e);
    setLastPos({ x, y });
    
    if (onDrawingStart) onDrawingStart();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    e.preventDefault(); // Prevent scrolling on touch devices
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { x, y } = getEventPos(e);
    
    ctx.globalCompositeOperation = selectedTool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = selectedTool === 'eraser' ? 'rgba(0,0,0,1)' : selectedColor;
    ctx.lineWidth = brushSize;
    
    switch (selectedTool) {
      case 'pencil':
        ctx.globalAlpha = 0.9;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        break;
      case 'brush':
        ctx.globalAlpha = 0.8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        break;
      case 'highlighter':
        ctx.globalAlpha = 0.3;
        ctx.lineCap = 'square';
        ctx.lineJoin = 'miter';
        break;
      case 'eraser':
        ctx.globalAlpha = 1;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        break;
    }
    
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    setLastPos({ x, y });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Stats calculation
  const words = value.trim().split(/\s+/).filter(word => word.length > 0);
  const lines = value.split('\n').length;
  
  const countSyllables = (word: string): number => {
    if (!word) return 0;
    
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    let count = 0;
    let previousWasVowel = false;
    
    for (let i = 0; i < word.length; i++) {
      const isVowel = 'aeiouy'.includes(word[i]);
      if (isVowel && !previousWasVowel) {
        count++;
      }
      previousWasVowel = isVowel;
    }
    
    if (word.endsWith('e') && count > 1) {
      count--;
    }
    
    return Math.max(1, count);
  };

  const totalSyllables = words.reduce((total, word) => {
    const cleanWord = word.replace(/[^\w]/g, '');
    return total + countSyllables(cleanWord);
  }, 0);

  // Export functions for external access
  useEffect(() => {
    (window as any).insertIntoLyrics = insertSection;
    (window as any).undoDrawing = undoDrawing;
    (window as any).clearDrawing = clearDrawing;
  }, []);

  return (
    <div className="h-full dropsource-editor dropsource-inset-shadow rounded-xl relative overflow-hidden">
      {/* overlay */}
      <div
        className="rhyme-layer"
        aria-hidden="true"
        style={{
          padding: '2rem',
          fontSize: '18px',
          lineHeight: '1.8',
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
        }}
        dangerouslySetInnerHTML={{ __html: overlayHTML }}
      />
      
      {/* the real editor */}
      <textarea
        ref={textareaRef}
        className={`
          w-full h-full p-8 bg-transparent border-none outline-none resize-none 
          dropsource-text-primary placeholder:dropsource-text-secondary placeholder:opacity-50 
          leading-relaxed font-mono
          ${isDrawingMode ? 'pointer-events-none' : ''}
        `}
        style={{
          fontSize: '18px',
          lineHeight: '1.8',
          caretColor: '#06b6d4',
          minHeight: '100%',
        }}
        value={value}
        onChange={handleTextChange}
        onSelect={handleSelectionChange}
        onKeyDown={handleKeyDown}
        placeholder="Start writing here..."
        spellCheck
      />
      
      {/* Statistics overlay */}
      {showStats && value && (
        <div className="absolute bottom-4 right-4 px-3 py-2 bg-gray-900/90 rounded-lg border border-gray-700 dropsource-text-secondary text-sm space-y-1 z-20">
          <div>{words.length} words</div>
          <div>{lines} lines</div>
          <div>{totalSyllables} syllables</div>
        </div>
      )}

      {/* Drawing canvas */}
      <canvas 
        ref={canvasRef}
        className={`absolute inset-0 z-30 ${isDrawingMode ? 'cursor-crosshair pointer-events-auto touch-none' : 'pointer-events-none'}`}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        style={{ width: '100%', height: '100%', touchAction: 'none' }}
      />
    </div>
  );
}