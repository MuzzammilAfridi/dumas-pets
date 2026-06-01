
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
import { getActiveTariff, getTariffDetails, updateRateCard, getRateCardItems, getUOMs } from '@/services/rateService';
import { useEffect, useState } from "react";

interface RateRow {
  id: string;
  name: string;
  category: string;
  // selected: boolean;
  rate: number;
  uom: string;
  available: boolean;
}



const UOMS = [
  'Kg',
  'Gram',
  'Pack',
  'Piece',
  'Box',
  'Litre'
];

const RateCard = () => {
const [rows, setRows] = useState<RateRow[]>([]);
  const [enableFromDate, setEnableFromDate] = useState<Date | undefined>(new Date());
  const [enabled, setEnabled] = useState(true);
  const [uoms, setUoms] = useState<string[]>([]);
  

  const updateRow = (id: string, patch: Partial<RateRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  // const allSelected = rows.length > 0 && rows.every((r) => r.selected);
  // const toggleAll = (val: boolean) => setRows((prev) => prev.map((r) => ({ ...r, selected: val })));

  // const selectedCount = rows.filter((r) => r.selected).length;

// const handleSave = async () => {
//   try {
//     const activeRes = await getActiveTariff();

//     const activeTariff = activeRes.data.data?.[0];

   

//     if (!activeTariff) {
//       toast.error("No active tariff found");
//       return;
//     }

//     const payload = {
//       date: format(enableFromDate!, "yyyy-MM-dd"),
//       status: enabled ? "Enabled" : "Disabled",
//       rate_card: rows
//         .filter((r) => r.selected)
//         .map((r, index) => ({
//           idx: index + 1,
//           item: r.name,
//           category: r.category,
//           qty: 1,
//           uom: r.uom,
//           rate: r.rate,
//           availability: r.available ? 1 : 0,
//         })),
//     };

//     await updateRateCard(activeTariff.name, payload);

//     toast.success("Rate card updated successfully");
//   } catch (error) {
//     console.error(error);
//     toast.error("Failed to update rate card");
//   }
// };

const addNewRow = () => {
  const newRow: RateRow = {
    id: `new-${Date.now()}`,
    name: "",
    category: "",
    // selected: true,
    rate: 0,
    uom: "Gram",
    available: true,
  };

  setRows((prev) => [...prev, newRow]);
};

const loadUOMs = async () => {
  try {
    const res = await getUOMs();

    const uomList = res.data.data.map(
      (item: any) => item.name
    );

    setUoms(uomList);

    console.log("UOMs:", uomList);
  } catch (error) {
    console.error("Failed to load UOMs", error);
  }
};


const handleSave = async () => {
  try {
    console.log("========== SAVE STARTED ==========");

    const rateCardName = "Rate Card - 1";

    const payload = {
      date: format(enableFromDate!, "yyyy-MM-dd"),
      status: enabled ? "Enabled" : "Disabled",
     rate_card: rows.map((r, index) => ({
  idx: index + 1,
  item: r.name,
  category: r.category,
  qty: 1,
  uom: r.uom,
  rate: r.rate,
  availability: r.available ? 1 : 0,
})),
    };

    console.log("Updating:", rateCardName);
    console.log("Payload:", payload);

    const updateRes = await updateRateCard(
      rateCardName,
      payload
    );

    console.log("Update Success:", updateRes.data);

    toast.success("Rate card updated successfully");
  } catch (error) {
    console.error(error);
    toast.error("Failed to update rate card");
  }
};

const loadRateCard = async () => {
  try {
    const tariffRes = await getRateCardItems();


    console.log("Rate Card:", tariffRes.data.data);

    const rateCard = tariffRes.data.data.rate_card;

    const mappedRows = rateCard.map((item: any) => ({
      id: item.name,
      name: item.item,
      category: item.category,
      // selected: true,
      rate: item.rate || 0,
      uom: item.uom || "Gram",
      available: Boolean(item.availability),
    }));

    setRows(mappedRows);
  } catch (error) {
    console.error(error);
    toast.error("Failed to load rate card");
  }
};

useEffect(() => {
  loadRateCard();
    loadUOMs();
}, []);

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
          <CardDescription>
  {rows.length} Items
</CardDescription>
          </div>
        <div className="flex gap-2">
  <Button variant="outline" onClick={addNewRow}>
    + Add Row
  </Button>

  <Button onClick={handleSave} className="gap-2">
    <Save className="w-4 h-4" /> Save Rate Card
  </Button>
</div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  {/* <TableHead className="w-12">
                    <Checkbox checked={allSelected} onCheckedChange={(v) => toggleAll(Boolean(v))} />
                  </TableHead> */}
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="w-36">Rate (₹)</TableHead>
                  <TableHead className="w-32">UOM</TableHead>
                  <TableHead className="w-40">Availability</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
               <TableRow key={r.id}>
                    {/* <TableCell>
                      <Checkbox
                        checked={r.selected}
                        onCheckedChange={(v) => updateRow(r.id, { selected: Boolean(v) })}
                      />
                    </TableCell> */}
                   <TableCell>
  <Input
    value={r.name}
    onChange={(e) =>
      updateRow(r.id, { name: e.target.value })
    }
  />
</TableCell>
                    <TableCell>
  <Input
    value={r.category}
    onChange={(e) =>
      updateRow(r.id, { category: e.target.value })
    }
  />
</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={r.rate}
                        
                        onChange={(e) => updateRow(r.id, { rate: parseFloat(e.target.value) || 0 })}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={r.uom}
                      
                        onValueChange={(v) => updateRow(r.id, { uom: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                         {uoms.map((u) => (
  <SelectItem key={u} value={u}>
    {u}
  </SelectItem>
))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={r.available}
                          
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
