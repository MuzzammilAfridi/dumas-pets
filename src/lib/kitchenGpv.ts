import type { KitchenOrder, KitchenOrderItem } from '@/data/kitchenOrders';

const GPV_RATIO_PATTERN = /^\s*\d{1,3}\s*\/\s*\d{1,3}\s*\/\s*\d{1,3}\s*$/;

const LIFECYCLE_LABELS = new Set(['puppy', 'adult', 'senior', 'kitten']);

const ratioFieldCandidates = [
  'gpvRatio',
  'gpv_ratio',
  'custom_gpv_ratio',
  'grainProteinVegRatio',
  'grain_protein_veg_ratio',
  'custom_grain_protein_veg_ratio',
  'grainProteinVegetableRatio',
  'grain_protein_vegetable_ratio',
  'custom_grain_protein_vegetable_ratio',
  'grainProteinVegetable',
  'grain_protein_vegetable',
  'custom_grain_protein_vegetable',
];

const grainFieldCandidates = ['grainRatio', 'grain_ratio', 'custom_grain_ratio', 'grainPercent', 'grain_percent', 'custom_grain_percent'];
const proteinFieldCandidates = ['proteinRatio', 'protein_ratio', 'custom_protein_ratio', 'proteinPercent', 'protein_percent', 'custom_protein_percent'];
const vegFieldCandidates = ['vegRatio', 'veg_ratio', 'custom_veg_ratio', 'vegetableRatio', 'vegetable_ratio', 'custom_vegetable_ratio', 'vegPercent', 'veg_percent', 'custom_veg_percent'];

function normalizeRatio(value: unknown): string {
  if (value === null || value === undefined) return '';
  const ratio = String(value).trim();
  if (!ratio || LIFECYCLE_LABELS.has(ratio.toLowerCase()) || !GPV_RATIO_PATTERN.test(ratio)) return '';
  return ratio.replace(/\s*\/\s*/g, '/');
}

function firstNumericField(item: Record<string, unknown>, fields: string[]): string {
  for (const field of fields) {
    const value = item[field];
    if (value === null || value === undefined || value === '') continue;
    const numeric = Number(value);
    if (Number.isFinite(numeric)) return String(numeric);
  }
  return '';
}

export function getActualGPVRatio(item: KitchenOrderItem): string {
  const source = item as unknown as Record<string, unknown>;
  for (const field of ratioFieldCandidates) {
    const ratio = normalizeRatio(source[field]);
    if (ratio) return ratio;
  }

  const grain = firstNumericField(source, grainFieldCandidates);
  const protein = firstNumericField(source, proteinFieldCandidates);
  const veg = firstNumericField(source, vegFieldCandidates);
  return grain && protein && veg ? `${grain}/${protein}/${veg}` : '';
}

export function formatKitchenItemName(item: KitchenOrderItem): string {
  const ratio = getActualGPVRatio(item);
  return ratio ? `${item.itemName} (${ratio})` : item.itemName;
}

export function normalizeKitchenOrderGPV(order: KitchenOrder): KitchenOrder {
  return {
    ...order,
    items: order.items.map(item => ({
      ...item,
      gpvRatio: getActualGPVRatio(item),
    })),
  };
}