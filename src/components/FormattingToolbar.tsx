import React, { useState } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Type,
  Palette,
  Plus
} from 'lucide-react';

interface FormattingToolbarProps {
  onFormatChange: (format: {
    textSize?: string;
    textAlign?: string;
    textColor?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
  }) => void;
  onInsertText: (text: string, type: 'verse' | 'chorus' | 'bridge' | 'chord') => void;
}

export function FormattingToolbar({ onFormatChange, onInsertText }: FormattingToolbarProps) {
  const [currentFormat, setCurrentFormat] = useState({
    textSize: '18px',
    textAlign: 'left',
    textColor: '#F3F4F6',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
  });

  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const textSizes = [
    { label: 'Small', value: '14px' },
    { label: 'Normal', value: '18px' },
    { label: 'Large', value: '22px' },
    { label: 'Extra Large', value: '26px' },
  ];

  const textColors = [
    { name: 'White', value: '#F3F4F6' },
    { name: 'Light Gray', value: '#9CA3AF' },
    { name: 'Cyan', value: '#06B6D4' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Yellow', value: '#F59E0B' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Purple', value: '#8B5CF6' },
  ];

  const updateFormat = (updates: Partial<typeof currentFormat>) => {
    const newFormat = { ...currentFormat, ...updates };
    setCurrentFormat(newFormat);
    onFormatChange(newFormat);
    
    // Apply formatting to selected text in textarea
    applyFormattingToSelection(newFormat);
  };

  const applyFormattingToSelection = (format: typeof currentFormat) => {
    // Get the active textarea (lyrics editor)
    const textareas = document.querySelectorAll('textarea');
    const activeTextarea = Array.from(textareas).find(ta => ta === document.activeElement) || textareas[0];
    
    if (activeTextarea) {
      const start = activeTextarea.selectionStart;
      const end = activeTextarea.selectionEnd;
      const selectedText = activeTextarea.value.substring(start, end);
      
      if (selectedText) {
        // Apply simple text formatting markers (no HTML)
        let formattedText = selectedText;
        
        // Apply basic formatting with markdown-style markers
        if (format.fontWeight === 'bold') {
          formattedText = `**${formattedText}**`;
        }
        if (format.fontStyle === 'italic') {
          formattedText = `*${formattedText}*`;
        }
        if (format.textDecoration === 'underline') {
          formattedText = `_${formattedText}_`;
        }
        
        // Replace the selected text
        const newValue = activeTextarea.value.substring(0, start) + formattedText + activeTextarea.value.substring(end);
        activeTextarea.value = newValue;
        
        // Update selection to after the formatted text
        const newCursorPos = start + formattedText.length;
        activeTextarea.setSelectionRange(newCursorPos, newCursorPos);
        
        // Trigger change event
        const event = new Event('input', { bubbles: true });
        activeTextarea.dispatchEvent(event);
        
        // Focus back to textarea
        activeTextarea.focus();
      }
    }
  };

  const insertQuickText = (type: 'verse' | 'chorus' | 'bridge' | 'chord') => {
    let textToInsert = '';
    
    switch (type) {
      case 'verse':
        textToInsert = '\n[Verse]\n';
        break;
      case 'chorus':
        textToInsert = '\n[Chorus]\n';
        break;
      case 'bridge':
        textToInsert = '\n[Bridge]\n';
        break;
      case 'chord':
        textToInsert = '[C] ';
        break;
    }
    
    // Insert at current cursor position in textarea
    const textareas = document.querySelectorAll('textarea');
    const activeTextarea = Array.from(textareas).find(ta => ta === document.activeElement) || textareas[0];
    
    if (activeTextarea) {
      const start = activeTextarea.selectionStart;
      const end = activeTextarea.selectionEnd;
      
      // Insert text at cursor position (or replace selection)
      const newValue = activeTextarea.value.substring(0, start) + textToInsert + activeTextarea.value.substring(end);
      activeTextarea.value = newValue;
      
      // Move cursor to end of inserted text
      const newCursorPos = start + textToInsert.length;
      activeTextarea.setSelectionRange(newCursorPos, newCursorPos);
      
      // Trigger change event
      const event = new Event('input', { bubbles: true });
      activeTextarea.dispatchEvent(event);
      
      // Focus back to textarea
      activeTextarea.focus();
    }
    
    onInsertText(textToInsert, type);
  };

  const toggleBold = () => {
    updateFormat({ 
      fontWeight: currentFormat.fontWeight === 'bold' ? 'normal' : 'bold' 
    });
  };

  const toggleItalic = () => {
    updateFormat({ 
      fontStyle: currentFormat.fontStyle === 'italic' ? 'normal' : 'italic' 
    });
  };

  const toggleUnderline = () => {
    updateFormat({ 
      textDecoration: currentFormat.textDecoration === 'underline' ? 'none' : 'underline' 
    });
  };

  return (
    <div className="dropsource-toolbar-slim flex items-center justify-between">
      {/* Left: Text Formatting */}
      <div className="flex items-center dropsource-spacing-md">
        {/* Text Size */}
        <div className="flex items-center dropsource-spacing-xs">
          <Type className="w-4 h-4 dropsource-text-tertiary dropsource-icon-outlined" />
          <Select value={currentFormat.textSize} onValueChange={(value) => updateFormat({ textSize: value })}>
            <SelectTrigger className="dropsource-input" style={{
              width: '96px',
              height: '32px',
              fontSize: 'var(--text-xs)',
              padding: 'calc(var(--spacing-unit) * 0.5) calc(var(--spacing-unit) * 1)'
            }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dropsource-panel dropsource-fade-in" style={{ borderColor: 'var(--dropsource-border)' }}>
              {textSizes.map(size => (
                <SelectItem key={size.value} value={size.value} className="dropsource-text-primary hover:dropsource-surface" style={{ fontSize: 'var(--text-sm)' }}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="dropsource-divider-vertical" style={{ height: '24px' }} />

        {/* Text Style */}
        <div className="flex items-center dropsource-spacing-xs">
          <button
            onClick={toggleBold}
            className={`dropsource-toolbar-button dropsource-focus-visible ${
              currentFormat.fontWeight === 'bold' ? 'active' : ''
            }`}
            style={{ width: '32px', height: '32px', padding: '0' }}
          >
            <Bold className="w-4 h-4 dropsource-icon-outlined" />
          </button>
          <button
            onClick={toggleItalic}
            className={`dropsource-toolbar-button dropsource-focus-visible ${
              currentFormat.fontStyle === 'italic' ? 'active' : ''
            }`}
            style={{ width: '32px', height: '32px', padding: '0' }}
          >
            <Italic className="w-4 h-4 dropsource-icon-outlined" />
          </button>
          <button
            onClick={toggleUnderline}
            className={`dropsource-toolbar-button dropsource-focus-visible ${
              currentFormat.textDecoration === 'underline' ? 'active' : ''
            }`}
            style={{ width: '32px', height: '32px', padding: '0' }}
          >
            <Underline className="w-4 h-4 dropsource-icon-outlined" />
          </button>
        </div>

        <div className="dropsource-divider-vertical" style={{ height: '24px' }} />

        {/* Text Alignment */}
        <div className="flex items-center dropsource-spacing-xs">
          <button
            onClick={() => updateFormat({ textAlign: 'left' })}
            className={`dropsource-toolbar-button dropsource-focus-visible ${
              currentFormat.textAlign === 'left' ? 'active' : ''
            }`}
            style={{ width: '32px', height: '32px', padding: '0' }}
          >
            <AlignLeft className="w-4 h-4 dropsource-icon-outlined" />
          </button>
          <button
            onClick={() => updateFormat({ textAlign: 'center' })}
            className={`dropsource-toolbar-button dropsource-focus-visible ${
              currentFormat.textAlign === 'center' ? 'active' : ''
            }`}
            style={{ width: '32px', height: '32px', padding: '0' }}
          >
            <AlignCenter className="w-4 h-4 dropsource-icon-outlined" />
          </button>
          <button
            onClick={() => updateFormat({ textAlign: 'right' })}
            className={`dropsource-toolbar-button dropsource-focus-visible ${
              currentFormat.textAlign === 'right' ? 'active' : ''
            }`}
            style={{ width: '32px', height: '32px', padding: '0' }}
          >
            <AlignRight className="w-4 h-4 dropsource-icon-outlined" />
          </button>
        </div>

        <div className="dropsource-divider-vertical" style={{ height: '24px' }} />

        {/* Text Color */}
        <Popover open={isColorPickerOpen} onOpenChange={setIsColorPickerOpen}>
          <PopoverTrigger asChild>
            <button
              className="dropsource-toolbar-button dropsource-focus-visible"
              style={{ width: '32px', height: '32px', padding: '0' }}
            >
              <Palette className="w-4 h-4 dropsource-icon-outlined" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="dropsource-card dropsource-fade-in" style={{ width: '256px' }}>
            <div className="dropsource-spacing-md flex flex-col">
              <h4 className="dropsource-text-primary" style={{ fontSize: 'var(--text-sm)', fontWeight: '500' }}>Text Color</h4>
              
              {/* Preset colors */}
              <div className="dropsource-grid-4">
                {textColors.map(color => (
                  <button
                    key={color.value}
                    onClick={() => {
                      updateFormat({ textColor: color.value });
                      setIsColorPickerOpen(false);
                    }}
                    className={`dropsource-clickable ${
                      currentFormat.textColor === color.value 
                        ? 'dropsource-glow-brand' 
                        : 'hover:dropsource-glow-subtle'
                    }`}
                    style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: 'var(--radius-sharp)',
                      backgroundColor: color.value,
                      border: currentFormat.textColor === color.value 
                        ? '2px solid var(--dropsource-brand)' 
                        : '2px solid var(--dropsource-border)'
                    }}
                    title={color.name}
                  />
                ))}
              </div>

              {/* Custom color picker */}
              <div className="dropsource-spacing-xs flex flex-col">
                <label className="dropsource-text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>Custom Color</label>
                <input
                  type="color"
                  value={currentFormat.textColor}
                  onChange={(e) => updateFormat({ textColor: e.target.value })}
                  className="dropsource-input cursor-pointer"
                  style={{ height: '40px' }}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Right: Quick Insert Pills */}
      <div className="flex items-center dropsource-spacing-xs">
        <label className="dropsource-text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>Quick Insert:</label>
        <button
          onClick={() => insertQuickText('verse')}
          className="dropsource-btn-pill dropsource-focus-visible flex items-center dropsource-spacing-xs"
        >
          <Plus className="w-3 h-3 dropsource-icon-outlined" />
          <span>Verse</span>
        </button>
        <button
          onClick={() => insertQuickText('chorus')}
          className="dropsource-btn-pill dropsource-focus-visible flex items-center dropsource-spacing-xs"
        >
          <Plus className="w-3 h-3 dropsource-icon-outlined" />
          <span>Chorus</span>
        </button>
        <button
          onClick={() => insertQuickText('bridge')}
          className="dropsource-btn-pill dropsource-focus-visible flex items-center dropsource-spacing-xs"
        >
          <Plus className="w-3 h-3 dropsource-icon-outlined" />
          <span>Bridge</span>
        </button>
        <button
          onClick={() => insertQuickText('chord')}
          className="dropsource-btn-pill dropsource-focus-visible flex items-center dropsource-spacing-xs"
        >
          <Plus className="w-3 h-3 dropsource-icon-outlined" />
          <span>Chord</span>
        </button>
      </div>
    </div>
  );
}