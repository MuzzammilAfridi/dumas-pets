import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Save } from 'lucide-react';
import { products } from '@/data/products';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface RateRow {
  id: string;
  name: string;
  category: string;
  selected: boolean;
  rate: number;
  uom: string;
  available: boolean;
}

const UOMS = ['kg', 'g', 'pack', 'piece', 'box', 'litre'];

const RateCard = () => {
  const [rows, setRows] = useState<RateRow[]>(
    products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      selected: false,
      rate: p.price,
      uom: 'pack',
      available: true,
    }))
  );
  const [enableFromDate, setEnableFromDate] = useState<Date | undefined>(new Date());
  const [enabled, setEnabled] = useState(true);

  const updateRow = (id: string, patch: Partial<RateRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const allSelected = rows.length > 0 && rows.every((r) => r.selected);
  const toggleAll = (val: boolean) => setRows((prev) => prev.map((r) => ({ ...r, selected: val })));

  const selectedCount = rows.filter((r) => r.selected).length;

  const handleSave = () => {
    if (!enableFromDate) return toast.error('Please pick an enable-from date');
    if (selectedCount === 0) return toast.error('Select at least one item');
    toast.success(`Rate card saved for ${selectedCount} item(s)`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Rate Card</h2>
        <p className="text-sm text-muted-foreground">Set rates, units and availability for your items.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activation</CardTitle>
          <CardDescription>Choose when this rate card becomes effective.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Enable rate from</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn('w-full justify-start text-left font-normal', !enableFromDate && 'text-muted-foreground')}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {enableFromDate ? format(enableFromDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={enableFromDate}
                  onSelect={setEnableFromDate}
                  initialFocus
                  className={cn('p-3 pointer-events-auto')}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex items-center gap-3 h-10 px-3 rounded-md border border-input bg-background">
              <Checkbox
                id="rc-enabled"
                checked={enabled}
                onCheckedChange={(v) => setEnabled(Boolean(v))}
              />
              <Label htmlFor="rc-enabled" className="cursor-pointer">
                {enabled ? 'Enabled' : 'Disabled'}
              </Label>
              <Badge variant={enabled ? 'default' : 'secondary'} className="ml-auto">
                {enabled ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Items</CardTitle>
            <CardDescription>{selectedCount} of {rows.length} selected</CardDescription>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" /> Save Rate Card
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12">
                    <Checkbox checked={allSelected} onCheckedChange={(v) => toggleAll(Boolean(v))} />
                  </TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="w-36">Rate (₹)</TableHead>
                  <TableHead className="w-32">UOM</TableHead>
                  <TableHead className="w-40">Availability</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id} className={cn(!r.selected && 'opacity-70')}>
                    <TableCell>
                      <Checkbox
                        checked={r.selected}
                        onCheckedChange={(v) => updateRow(r.id, { selected: Boolean(v) })}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{r.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={r.rate}
                        disabled={!r.selected}
                        onChange={(e) => updateRow(r.id, { rate: parseFloat(e.target.value) || 0 })}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={r.uom}
                        disabled={!r.selected}
                        onValueChange={(v) => updateRow(r.id, { uom: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {UOMS.map((u) => (
                            <SelectItem key={u} value={u}>{u}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={r.available}
                          disabled={!r.selected}
                          onCheckedChange={(v) => updateRow(r.id, { available: v })}
                        />
                        <span className="text-sm text-muted-foreground">
                          {r.available ? 'In stock' : 'Out of stock'}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RateCard;
