import { BlockModel, BlockStyle } from '../../types/profile';
import { BlockStyleControls } from './BlockStyleControls';

export default function BlockStyleEditor({
  block, onChange
}: { block: BlockModel; onChange: (b: BlockModel)=>void }) {
  
  const handleStyleChange = (newStyle: BlockStyle) => {
    onChange({ ...block, style: newStyle });
  };

  return (
    <div className="space-y-3 p-3 dropsource-card">
      <h4 className="text-sm font-medium">Block Style</h4>
      <BlockStyleControls 
        block={block} 
        onChange={handleStyleChange}
      />
    </div>
  );
}