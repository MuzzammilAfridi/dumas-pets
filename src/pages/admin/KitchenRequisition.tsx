import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  Eye, Download, Printer, FileSpreadsheet, FileText, Search, RefreshCw, ChefHat,
  Clock, Package, Truck, CheckCircle2, XCircle, Hourglass, Boxes
} from 'lucide-react';
import {
  KITCHEN_STATUSES, KitchenOrder, KitchenOrderStatus, mockKitchenOrders, statusColorMap
} from '@/data/kitchenOrders';
import { downloadOrderPDF, downloadPackingSlipPDF, exportOrdersExcel, exportItemSummaryExcel, generateItemSummary } from '@/lib/kitchenExports';
import { cn } from '@/lib/utils';

const todayStr = new Date().toISOString().slice(0, 10);

const cardConfig: { status: KitchenOrderStatus | 'All' | 'Today'; label: string; icon: any; color: string }[] = [
  { status: 'All',               label: 'Total Orders',      icon: Boxes,        color: 'from-slate-500 to-slate-600' },
  { status: 'Today',             label: "Today's Orders",    icon: Clock,        color: 'from-primary to-orange-500' },
  { status: 'Pending',           label: 'Pending',           icon: Hourglass,    color: 'from-gray-400 to-gray-500' },
  { status: 'In Preparation',    label: 'In Preparation',    icon: ChefHat,      color: 'from-orange-400 to-orange-500' },
  { status: 'Ready for Packing', label: 'Ready for Packing', icon: Package,      color: 'from-purple-400 to-purple-500' },
  { status: 'Packed',            label: 'Packed',            icon: Boxes,        color: 'from-cyan-400 to-cyan-500' },
  { status: 'Out for Delivery',  label: 'Out for Delivery',  icon: Truck,        color: 'from-indigo-400 to-indigo-500' },
  { status: 'Delivered',         label: 'Delivered',         icon: CheckCircle2, color: 'from-green-400 to-green-500' },
  { status: 'Cancelled',         label: 'Cancelled',         icon: XCircle,      color: 'from-red-400 to-red-500' },
];

const KitchenRequisition = () => {
  const [orders, setOrders] = useState<KitchenOrder[]>(mockKitchenOrders);
  const [activeCard, setActiveCard] = useState<KitchenOrderStatus | 'All' | 'Today'>('All');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [customerFilter, setCustomerFilter] = useState('');
  const [itemFilter, setItemFilter] = useState('');
  const [pickupDateFilter, setPickupDateFilter] = useState('');
  const [orderDateFilter, setOrderDateFilter] = useState('');
  const [timeSlotFilter, setTimeSlotFilter] = useState('');
  const [deliveryBoyFilter, setDeliveryBoyFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [detailOrder, setDetailOrder] = useState<KitchenOrder | null>(null);
  const { toast } = useToast();

  const filtered = useMemo(() => {
    return orders.filter(o => {
      if (activeCard === 'Today' && o.pickupDate !== todayStr) return false;
      if (activeCard !== 'All' && activeCard !== 'Today' && o.status !== activeCard) return false;
      if (statusFilter !== 'All' && o.status !== statusFilter) return false;
      if (customerFilter && !o.customerName.toLowerCase().includes(customerFilter.toLowerCase())) return false;
      if (itemFilter && !o.items.some(i => i.itemName.toLowerCase().includes(itemFilter.toLowerCase()))) return false;
      if (pickupDateFilter && o.pickupDate !== pickupDateFilter) return false;
      if (orderDateFilter && o.orderDate !== orderDateFilter) return false;
      if (timeSlotFilter && !o.timeSlot.toLowerCase().includes(timeSlotFilter.toLowerCase())) return false;
      if (deliveryBoyFilter && !o.deliveryBoy.toLowerCase().includes(deliveryBoyFilter.toLowerCase())) return false;
      if (phoneFilter && !o.phone.includes(phoneFilter)) return false;
      if (search) {
        const s = search.toLowerCase();
        const hay = `${o.id} ${o.customerName} ${o.phone} ${o.deliveryBoy} ${o.items.map(i => i.itemName).join(' ')}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });
  }, [orders, activeCard, statusFilter, customerFilter, itemFilter, pickupDateFilter, orderDateFilter, timeSlotFilter, deliveryBoyFilter, phoneFilter, search]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: orders.length, Today: orders.filter(o => o.pickupDate === todayStr).length };
    KITCHEN_STATUSES.forEach(s => { c[s] = orders.filter(o => o.status === s).length; });
    return c;
  }, [orders]);

  const itemSummary = useMemo(() => generateItemSummary(filtered), [filtered]);

  const updateStatus = (id: string, status: KitchenOrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? {
      ...o, status, lastUpdated: new Date().toISOString(),
      history: [...o.history, { status, timestamp: new Date().toISOString(), updatedBy: 'Kitchen Admin' }],
    } : o));
    if (detailOrder?.id === id) {
      setDetailOrder(prev => prev ? { ...prev, status,
        history: [...prev.history, { status, timestamp: new Date().toISOString(), updatedBy: 'Kitchen Admin' }],
      } : null);
    }
    toast({ title: 'Status updated', description: `${id} → ${status}` });
  };

  const resetFilters = () => {
    setSearch(''); setStatusFilter('All'); setCustomerFilter(''); setItemFilter('');
    setPickupDateFilter(''); setOrderDateFilter(''); setTimeSlotFilter('');
    setDeliveryBoyFilter(''); setPhoneFilter(''); setActiveCard('All');
  };

  const toggleSelect = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map(o => o.id));

  const bulkUpdate = (status: KitchenOrderStatus) => {
    selected.forEach(id => updateStatus(id, status));
    setSelected([]);
  };

  const bulkDownloadSlips = async () => {
    for (const id of selected) {
      const o = orders.find(x => x.id === id);
      if (o) await downloadPackingSlipPDF(o);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-primary" /> Kitchen Requisition
          </h2>
          <p className="text-sm text-muted-foreground">Manage orders, preparation, packing, and delivery from one place.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => exportOrdersExcel(filtered)}>
            <FileSpreadsheet className="w-4 h-4" /> Export Kitchen List
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportItemSummaryExcel(filtered)}>
            <FileSpreadsheet className="w-4 h-4" /> Export Summary List
          </Button>
          <Button variant="outline" size="sm" onClick={resetFilters}>
            <RefreshCw className="w-4 h-4" /> Reset
          </Button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-3">
        {cardConfig.map(c => {
          const Icon = c.icon;
          const isActive = activeCard === c.status;
          return (
            <button
              key={c.status}
              onClick={() => setActiveCard(c.status)}
              className={cn(
                'rounded-xl p-3 text-left transition-all border bg-card hover:shadow-md',
                isActive ? 'ring-2 ring-primary shadow-md' : 'border-border'
              )}
            >
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-2 bg-gradient-to-br', c.color)}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="text-2xl font-bold text-foreground">{counts[c.status] ?? 0}</div>
              <div className="text-xs text-muted-foreground leading-tight">{c.label}</div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="sticky top-0 z-10">
        <CardContent className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID, customer, phone, item, delivery boy..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            <Input placeholder="Customer" value={customerFilter} onChange={e => setCustomerFilter(e.target.value)} />
            <Input placeholder="Item name" value={itemFilter} onChange={e => setItemFilter(e.target.value)} />
            <Input type="date" placeholder="Pickup date" value={pickupDateFilter} onChange={e => setPickupDateFilter(e.target.value)} />
            <Input type="date" placeholder="Order date" value={orderDateFilter} onChange={e => setOrderDateFilter(e.target.value)} />
            <Input placeholder="Time slot" value={timeSlotFilter} onChange={e => setTimeSlotFilter(e.target.value)} />
            <Input placeholder="Delivery boy" value={deliveryBoyFilter} onChange={e => setDeliveryBoyFilter(e.target.value)} />
            <Input placeholder="Phone number" value={phoneFilter} onChange={e => setPhoneFilter(e.target.value)} />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                {KITCHEN_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <Card className="border-primary/40 bg-primary/5">
          <CardContent className="p-3 flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm font-medium">{selected.length} selected</span>
            <div className="flex gap-2 flex-wrap">
              <Select onValueChange={(v) => bulkUpdate(v as KitchenOrderStatus)}>
                <SelectTrigger className="w-48"><SelectValue placeholder="Bulk status update" /></SelectTrigger>
                <SelectContent>{KITCHEN_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={bulkDownloadSlips}>
                <Download className="w-4 h-4" /> Download Slips
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelected([])}>Clear</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tables: Kitchen Orders (70%) + Item Wise Summary (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        <Card className="lg:col-span-7">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={selected.length === filtered.length && filtered.length > 0}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Pickup</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Delivery Boy</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Update</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                    No orders match your filters.
                  </TableCell></TableRow>
                ) : filtered.map(o => (
                  <TableRow key={o.id} className={cn(statusColorMap[o.status].row)}>
                    <TableCell>
                      <Checkbox checked={selected.includes(o.id)} onCheckedChange={() => toggleSelect(o.id)} />
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-foreground">{o.id}</div>
                      <div className="text-xs text-muted-foreground">{o.orderDate}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{o.customerName}</div>
                      <div className="text-xs text-muted-foreground">{o.phone}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{o.pickupDate}</div>
                      <div className="text-xs text-muted-foreground">{o.timeSlot}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{o.items.map(i => `${i.itemName} ×${i.quantity}`).join(', ')}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{o.deliveryBoy}</div>
                      <div className="text-xs text-muted-foreground">{o.deliveryBoyPhone}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('border', statusColorMap[o.status].bg)}>
                        {o.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v as KitchenOrderStatus)}>
                        <SelectTrigger className="w-40 h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>{KITCHEN_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setDetailOrder(o)} title="View details">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => downloadOrderPDF(o)} title="Order PDF">
                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => downloadPackingSlipPDF(o)} title="Packing slip">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => downloadPackingSlipPDF(o)} title="Print">
                          <Printer className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Item Wise Summary */}
        <Card className="lg:col-span-3">
          <CardContent className="p-0">
            <div className="p-4 border-b flex items-center justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-primary" /> Item Wise Summary
                </h3>
                <p className="text-xs text-muted-foreground">{itemSummary.length} unique items · auto-grouped</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => exportItemSummaryExcel(filtered)}>
                <FileSpreadsheet className="w-4 h-4" />
              </Button>
            </div>
            <div className="max-h-[640px] overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Orders</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemSummary.length === 0 ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                      No items to summarize.
                    </TableCell></TableRow>
                  ) : itemSummary.map(s => (
                    <TableRow key={s.itemName}>
                      <TableCell className="font-medium">{s.itemName}</TableCell>
                      <TableCell className="text-right font-semibold text-primary">{s.totalQty}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{s.orderCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail drawer */}
      <Sheet open={!!detailOrder} onOpenChange={(o) => !o && setDetailOrder(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {detailOrder && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {detailOrder.id}
                  <Badge variant="outline" className={cn('border', statusColorMap[detailOrder.status].bg)}>
                    {detailOrder.status}
                  </Badge>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-5 text-sm">
                <Section title="Customer">
                  <Row label="Name" value={detailOrder.customerName} />
                  <Row label="Phone" value={detailOrder.phone} />
                  {detailOrder.altPhone && <Row label="Alternate" value={detailOrder.altPhone} />}
                  <Row label="Address" value={`${detailOrder.address}, ${detailOrder.landmark}`} />
                  <Row label="City" value={`${detailOrder.city}, ${detailOrder.state} - ${detailOrder.pincode}`} />
                  <Row label="Pickup" value={`${detailOrder.pickupDate} • ${detailOrder.timeSlot}`} />
                </Section>

                <Section title="Order">
                  <Row label="Order Date" value={detailOrder.orderDate} />
                  <Row label="Status" value={detailOrder.status} />
                  {detailOrder.specialNotes && <Row label="Notes" value={detailOrder.specialNotes} />}
                </Section>

                <Section title="Food Preparation">
                  {detailOrder.items.map((i, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-muted/50 mb-2">
                      <div className="font-semibold">{i.itemName} <span className="text-muted-foreground font-normal">×{i.quantity}</span></div>
                      <div className="text-xs mt-1"><span className="text-muted-foreground">Raw Materials: </span>{i.rawMaterials.join(', ')}</div>
                      <div className="text-xs mt-1"><span className="text-muted-foreground">Instructions: </span>{i.cookingInstructions}</div>
                    </div>
                  ))}
                </Section>

                <Section title="Delivery">
                  <Row label="Boy" value={detailOrder.deliveryBoy} />
                  <Row label="Phone" value={detailOrder.deliveryBoyPhone} />
                  {detailOrder.vehicleNumber && <Row label="Vehicle" value={detailOrder.vehicleNumber} />}
                  {detailOrder.assignedTime && <Row label="Assigned" value={detailOrder.assignedTime} />}
                </Section>

                <Section title="Update Status">
                  <Select value={detailOrder.status} onValueChange={(v) => updateStatus(detailOrder.id, v as KitchenOrderStatus)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{KITCHEN_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </Section>

                <Section title="Status History">
                  <ol className="border-l-2 border-primary/30 pl-4 space-y-3">
                    {detailOrder.history.map((h, idx) => (
                      <li key={idx} className="relative">
                        <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-primary" />
                        <div className="font-medium">{h.status}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(h.timestamp).toLocaleString()} • {h.updatedBy}
                        </div>
                      </li>
                    ))}
                  </ol>
                </Section>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => downloadOrderPDF(detailOrder)}>
                    <FileText className="w-4 h-4" /> Order PDF
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => downloadPackingSlipPDF(detailOrder)}>
                    <Download className="w-4 h-4" /> Packing Slip
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{title}</h4>
    <div className="space-y-1">{children}</div>
  </div>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-2">
    <span className="text-muted-foreground min-w-[90px]">{label}:</span>
    <span className="font-medium text-foreground">{value}</span>
  </div>
);

export default KitchenRequisition;
