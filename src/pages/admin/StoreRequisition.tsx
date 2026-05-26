import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockOrders, Order } from '@/data/mockData';
import { productBom, mockInventory } from '@/data/bomData';
import { useToast } from '@/hooks/use-toast';
import {
  AlertTriangle, CheckCircle2, Download, FileText, Printer, RefreshCw, Search, Package2,
} from 'lucide-react';

interface BreakdownRow {
  orderId: string;
  customer: string;
  product: string;
  orderedQty: number;
  materialName: string;
  unit: string;
  qtyPerProduct: number;
  totalMaterialQty: number;
  status: Order['status'];
  date: string;
}

const statusOptions = ['All', 'Pending', 'Processing', 'Delivered', 'Cancelled'] as const;

const StoreRequisition = () => {
  const { toast } = useToast();
  const [orderStatus, setOrderStatus] = useState<string>('All');
  const [productFilter, setProductFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [orderSearch, setOrderSearch] = useState('');
  const [materialSearch, setMaterialSearch] = useState('');
  const [refreshTick, setRefreshTick] = useState(0);

  const allProducts = useMemo(
    () => Array.from(new Set(mockOrders.flatMap(o => o.items.map(i => i.name)))),
    []
  );

  // Step 1-3: expand orders → BOM rows
  const breakdown: BreakdownRow[] = useMemo(() => {
    const rows: BreakdownRow[] = [];
    for (const order of mockOrders) {
      for (const item of order.items) {
        const bom = productBom[item.name] ?? [];
        for (const b of bom) {
          rows.push({
            orderId: order.id,
            customer: order.customerName,
            product: item.name,
            orderedQty: item.quantity,
            materialName: b.materialName,
            unit: b.unit,
            qtyPerProduct: b.qtyPerProduct,
            totalMaterialQty: item.quantity * b.qtyPerProduct,
            status: order.status,
            date: order.date,
          });
        }
      }
    }
    return rows;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTick]);

  const filteredBreakdown = useMemo(() => {
    return breakdown.filter(r => {
      if (orderStatus !== 'All' && r.status !== orderStatus) return false;
      if (productFilter !== 'All' && r.product !== productFilter) return false;
      if (dateFilter && r.date !== dateFilter) return false;
      if (orderSearch && !r.orderId.toLowerCase().includes(orderSearch.toLowerCase())) return false;
      if (materialSearch && !r.materialName.toLowerCase().includes(materialSearch.toLowerCase())) return false;
      return true;
    });
  }, [breakdown, orderStatus, productFilter, dateFilter, orderSearch, materialSearch]);

  // Step 4: group materials
  const summary = useMemo(() => {
    const grouped = filteredBreakdown.reduce<Record<string, { materialName: string; unit: string; totalQty: number }>>(
      (acc, item) => {
        const key = `${item.materialName}-${item.unit}`;
        if (!acc[key]) acc[key] = { materialName: item.materialName, unit: item.unit, totalQty: 0 };
        acc[key].totalQty += item.totalMaterialQty;
        return acc;
      },
      {}
    );
    return Object.values(grouped)
      .map(m => {
        const inv = mockInventory.find(i => i.materialName === m.materialName && i.unit === m.unit);
        const available = inv?.availableStock ?? 0;
        const shortage = Math.max(0, m.totalQty - available);
        return { ...m, available, shortage, isShort: available < m.totalQty };
      })
      .sort((a, b) => Number(b.isShort) - Number(a.isShort));
  }, [filteredBreakdown]);

  const shortageCount = summary.filter(s => s.isShort).length;

  const handleExport = (label: string) => {
    if (label === 'Excel') {
      const headers = ['Material', 'Total Required', 'Unit', 'Available', 'Shortage', 'Status'];
      const csv = [
        headers.join(','),
        ...summary.map(s => [s.materialName, s.totalQty, s.unit, s.available, s.shortage, s.isShort ? 'Low Stock' : 'Sufficient'].join(',')),
      ].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `requisition-${Date.now()}.csv`; a.click();
      URL.revokeObjectURL(url);
    } else if (label === 'Print' || label === 'PDF') {
      window.print();
    }
    toast({ title: `${label} ready`, description: `Requisition exported as ${label}.` });
  };

  return (
    <div className="space-y-4">
      {/* Header / Actions */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-4 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-foreground">Store Requisition</h2>
              <p className="text-sm text-muted-foreground">
                Auto-generated from {mockOrders.length} orders · {summary.length} materials · {shortageCount} shortages
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => { setRefreshTick(t => t + 1); toast({ title: 'Refreshed', description: 'Requisition data refreshed.' }); }}>
                <RefreshCw className="w-4 h-4" /> Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('PDF')}>
                <FileText className="w-4 h-4" /> PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('Excel')}>
                <Download className="w-4 h-4" /> Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('Print')}>
                <Printer className="w-4 h-4" /> Print
              </Button>
              <Button size="sm" onClick={() => toast({ title: 'Requisition generated', description: `${summary.length} materials sent to store.` })}>
                <Package2 className="w-4 h-4" /> Generate Requisition
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search Order ID" className="pl-9" value={orderSearch} onChange={e => setOrderSearch(e.target.value)} />
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search Material" className="pl-9" value={materialSearch} onChange={e => setMaterialSearch(e.target.value)} />
            </div>
            <Select value={orderStatus} onValueChange={setOrderStatus}>
              <SelectTrigger><SelectValue placeholder="Order Status" /></SelectTrigger>
              <SelectContent>
                {statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={productFilter} onValueChange={setProductFilter}>
              <SelectTrigger><SelectValue placeholder="Product" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Products</SelectItem>
                {allProducts.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        {/* LEFT 70% — Breakdown */}
        <Card className="lg:col-span-7 rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Order BOM Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[640px] overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Ordered</TableHead>
                    <TableHead>BOM Material</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Qty / Product</TableHead>
                    <TableHead className="text-right">Total Qty</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBreakdown.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                        No requisition rows match the current filters.
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredBreakdown.map((r, i) => (
                    <TableRow key={i} className={i % 2 === 0 ? '' : 'bg-muted/30'}>
                      <TableCell className="font-medium">{r.orderId}</TableCell>
                      <TableCell>{r.customer}</TableCell>
                      <TableCell>{r.product}</TableCell>
                      <TableCell className="text-right">{r.orderedQty}</TableCell>
                      <TableCell>{r.materialName}</TableCell>
                      <TableCell className="text-muted-foreground">{r.unit}</TableCell>
                      <TableCell className="text-right">{r.qtyPerProduct}</TableCell>
                      <TableCell className="text-right font-semibold">{r.totalMaterialQty}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT 30% — Summary */}
        <Card className="lg:col-span-3 rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              Material Summary
              {shortageCount > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <AlertTriangle className="w-3 h-3" /> {shortageCount} short
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[640px] overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead className="text-right">Req.</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">No materials.</TableCell>
                    </TableRow>
                  )}
                  {summary.map((s, i) => (
                    <TableRow key={i} className={i % 2 === 0 ? '' : 'bg-muted/30'}>
                      <TableCell>
                        <div className="font-medium">{s.materialName}</div>
                        <div className="text-xs text-muted-foreground">{s.unit}{s.isShort && ` · short ${s.shortage}`}</div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{s.totalQty}</TableCell>
                      <TableCell className="text-right">{s.available}</TableCell>
                      <TableCell>
                        {s.isShort ? (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="w-3 h-3" /> Low
                          </Badge>
                        ) : (
                          <Badge className="gap-1 bg-green-600 hover:bg-green-600/90">
                            <CheckCircle2 className="w-3 h-3" /> OK
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StoreRequisition;
