import { BlockModel } from '../types/profile';
import { CLEAN_TWO_COL_PRESET } from './presetLayouts';

export function defaultProfileLayout(): BlockModel[] {
  // Use the clean two-column preset as the default
  return CLEAN_TWO_COL_PRESET.map(block => ({
    ...block,
    id: block.id === 'profile-header' ? block.id : crypto.randomUUID()
  }));
}