import { Button } from "../ui/button";
import { Upload } from "lucide-react";

interface BackgroundPickerProps {
  onChange: (css: string) => void;
}

export function BackgroundPicker({ onChange }: BackgroundPickerProps) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; 
    if (!f) return;
    const r = new FileReader();
    r.onload = () => onChange(`url(${r.result})`);
    r.readAsDataURL(f);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="relative">
        <Button className="w-full dropsource-btn-secondary">
          <Upload className="w-4 h-4 mr-2" />
          Upload Background Image
        </Button>
        <input 
          type="file" 
          accept="image/*"
          onChange={handleFileUpload}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </label>
      
      <Button 
        variant="ghost"
        onClick={() => onChange("radial-gradient(1200px 600px at 10% 0%, #132036, #0b111a)")}
        className="dropsource-btn-ghost"
      >
        Use default gradient
      </Button>
    </div>
  );
}