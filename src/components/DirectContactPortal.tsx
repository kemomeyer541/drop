import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { X, Send, Bug, Lightbulb, AlertTriangle } from 'lucide-react';
import { FloatingCard } from './FloatingCard';

interface DirectContactPortalProps {
  onClose: () => void;
  onMinimize: () => void;
  initialPosition: { x: number; y: number };
  width: number;
  height: number;
  zIndex: number;
  onPositionChange: (position: { x: number; y: number }) => void;
  onSizeChange: (size: { width: number; height: number }) => void;
  onFocus: () => void;
}

export function DirectContactPortal({ 
  onClose, 
  onMinimize, 
  initialPosition, 
  width, 
  height, 
  zIndex, 
  onPositionChange, 
  onSizeChange, 
  onFocus 
}: DirectContactPortalProps) {
  const [formType, setFormType] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formType || !subject || !message) return;
    
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2000);
  };

  const getFormIcon = () => {
    switch (formType) {
      case 'bug': return <Bug className="w-5 h-5 text-red-400" />;
      case 'idea': return <Lightbulb className="w-5 h-5 text-yellow-400" />;
      case 'concern': return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      default: return <Send className="w-5 h-5 text-cyan-400" />;
    }
  };

  if (isSubmitted) {
    return (
      <FloatingCard
        title="Message Sent!"
        onClose={onClose}
        onMinimize={onMinimize}
        initialPosition={initialPosition}
        width={width}
        height={height}
        zIndex={zIndex}
        onPositionChange={onPositionChange}
        onSizeChange={onSizeChange}
        onFocus={onFocus}
      >
        <div className="h-full flex flex-col items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <Send className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold dropsource-text-primary">Message Sent!</h3>
            <p className="dropsource-text-secondary">
              Thanks for reaching out! We'll get back to you soon.
            </p>
            <div className="animate-spin w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </FloatingCard>
    );
  }

  return (
    <FloatingCard
      title="Direct Contact"
      onClose={onClose}
      onMinimize={onMinimize}
      initialPosition={initialPosition}
      width={width}
      height={height}
      zIndex={zIndex}
      onPositionChange={onPositionChange}
      onSizeChange={onSizeChange}
      onFocus={onFocus}
    >
      <div className="h-full flex flex-col">
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-4">
        {/* Contact Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium dropsource-text-primary">
            What can we help you with?
          </label>
          <Select value={formType} onValueChange={setFormType}>
            <SelectTrigger className="dropsource-panel border-gray-700">
              <SelectValue placeholder="Select a topic..." />
            </SelectTrigger>
            <SelectContent className="dropsource-panel border-gray-700">
              <SelectItem value="bug" className="text-white hover:bg-gray-700">
                <div className="flex items-center gap-2">
                  <Bug className="w-4 h-4 text-red-400" />
                  Report a Bug
                </div>
              </SelectItem>
              <SelectItem value="idea" className="text-white hover:bg-gray-700">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  Share an Idea
                </div>
              </SelectItem>
              <SelectItem value="concern" className="text-white hover:bg-gray-700">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                  Report a Concern
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium dropsource-text-primary">
            Email (optional)
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="dropsource-panel border-gray-700 dropsource-text-primary"
          />
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <label className="text-sm font-medium dropsource-text-primary">
            Subject *
          </label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief description of your message"
            className="dropsource-panel border-gray-700 dropsource-text-primary"
            required
          />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label className="text-sm font-medium dropsource-text-primary">
            Message *
          </label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us more about your bug, idea, or concern..."
            className="dropsource-panel border-gray-700 dropsource-text-primary min-h-[120px]"
            required
          />
        </div>

        {/* Form Tips */}
        {formType && (
          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <h4 className="text-sm font-medium dropsource-text-primary mb-2">
              {formType === 'bug' && 'Bug Report Tips:'}
              {formType === 'idea' && 'Idea Submission Tips:'}
              {formType === 'concern' && 'Concern Report Tips:'}
            </h4>
            <ul className="text-xs dropsource-text-secondary space-y-1">
              {formType === 'bug' && (
                <>
                  <li>• Describe what you were doing when the bug occurred</li>
                  <li>• Include your browser/device information if relevant</li>
                  <li>• Steps to reproduce the issue</li>
                </>
              )}
              {formType === 'idea' && (
                <>
                  <li>• Explain the problem your idea would solve</li>
                  <li>• Describe how it would benefit other users</li>
                  <li>• Share any examples or mockups if you have them</li>
                </>
              )}
              {formType === 'concern' && (
                <>
                  <li>• Be specific about what concerns you</li>
                  <li>• Include relevant usernames or content if applicable</li>
                  <li>• We take all reports seriously and investigate thoroughly</li>
                </>
              )}
            </ul>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={!formType || !subject || !message}
            className="dropsource-gradient text-white min-w-[120px]"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </div>
      </form>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-700 bg-gray-800/20">
          <p className="text-xs dropsource-text-secondary text-center">
            ⚠️ DropSource is not intended for collecting PII or securing sensitive data. 
            Please don't include personal information in your message.
          </p>
        </div>
      </div>
    </FloatingCard>
  );
}