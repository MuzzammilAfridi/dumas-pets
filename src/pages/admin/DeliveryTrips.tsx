import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
            Truck, Search, RefreshCw, Route as RouteIcon, Package, CheckCircle2, Clock,
  PackageCheck, PackageX, Boxes, MapPin, MousePointerClick, ChevronLeft, ChevronRight,
} from 'lucide-react';
import {
  DeliveryTrip, Delivery, TripStatus, DeliveryStatus, mockTrips, deliveryBoy,
  tripStatusClass, deliveryStatusClass,
} from '@/data/deliveryTrips';
import { cn } from '@/lib/utils';

const TRIP_STATUSES: TripStatus[] = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
const DELIVERY_STATUSES: DeliveryStatus[] = ['Pending', 'Out For Delivery', 'Delivered', 'Failed', 'Cancelled'];

const allowedNext = (s: DeliveryStatus): DeliveryStatus[] => {
  switch (s) {
    case 'Pending': return ['Out For Delivery', 'Failed', 'Cancelled'];
    case 'Out For Delivery': return ['Delivered', 'Failed'];
    default: return [];
  }
};

const PAGE_SIZE = 8;

const DeliveryTrips = () => {
  const [trips, setTrips] = useState<DeliveryTrip[]>(mockTrips);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  // Filters
  const [fTrip, setFTrip] = useState('');
  const [fRouteNum, setFRouteNum] = useState('');
  const [fRouteName, setFRouteName] = useState('');
  const [fDelivery, setFDelivery] = useState('');
  const [fOrder, setFOrder] = useState('');
  const [fCustomer, setFCustomer] = useState('');
  const [fStatus, setFStatus] = useState<string>('All');

  const [tripPage, setTripPage] = useState(1);
  const [delPage, setDelPage] = useState(1);
  const [tripSort, setTripSort] = useState<'routeNumber' | 'status' | 'progress'>('routeNumber');

  // Update status dialog
  const [updateFor, setUpdateFor] = useState<Delivery | null>(null);
  const [newStatus, setNewStatus] = useState<DeliveryStatus | ''>('');

  const { toast } = useToast();

  const resetFilters = () => {
    setFTrip(''); setFRouteNum(''); setFRouteName(''); setFDelivery('');
    setFOrder(''); setFCustomer(''); setFStatus('All'); setTripPage(1); setDelPage(1);
  };

  const dateTrips = useMemo(() => trips.filter(t => t.date === date), [trips, date]);

  // Apply filters to trips
  const filteredTrips = useMemo(() => {
    return dateTrips.filter(t => {
      if (fTrip && !t.tripId.toLowerCase().includes(fTrip.toLowerCase())) return false;
      if (fRouteNum && !t.routeNumber.toLowerCase().includes(fRouteNum.toLowerCase())) return false;
      if (fRouteName && !t.routeName.toLowerCase().includes(fRouteName.toLowerCase())) return false;
      if (fStatus !== 'All' && t.status !== fStatus) return false;
      // delivery-level filters: keep trip if any delivery matches
      if (fDelivery || fOrder || fCustomer) {
        const has = t.deliveries.some(d =>
          (!fDelivery || d.deliveryId.toLowerCase().includes(fDelivery.toLowerCase())) &&
          (!fOrder || d.orderNumber.toLowerCase().includes(fOrder.toLowerCase())) &&
          (!fCustomer || d.customerName.toLowerCase().includes(fCustomer.toLowerCase()))
        );
        if (!has) return false;
      }
      return true;
    }).sort((a, b) => {
      if (tripSort === 'status') return a.status.localeCompare(b.status);
      if (tripSort === 'progress') return (b.completedDeliveries / b.totalDeliveries) - (a.completedDeliveries / a.totalDeliveries);
      return a.routeNumber.localeCompare(b.routeNumber);
    });
  }, [dateTrips, fTrip, fRouteNum, fRouteName, fDelivery, fOrder, fCustomer, fStatus, tripSort]);

  const pagedTrips = filteredTrips.slice((tripPage - 1) * PAGE_SIZE, tripPage * PAGE_SIZE);
  const tripPageCount = Math.max(1, Math.ceil(filteredTrips.length / PAGE_SIZE));

  const selectedTrip = useMemo(
    () => trips.find(t => t.tripId === selectedTripId) ?? null,
    [trips, selectedTripId],
  );

  const filteredDeliveries = useMemo(() => {
    if (!selectedTrip) return [];
    return selectedTrip.deliveries.filter(d => {
      if (fDelivery && !d.deliveryId.toLowerCase().includes(fDelivery.toLowerCase())) return false;
      if (fOrder && !d.orderNumber.toLowerCase().includes(fOrder.toLowerCase())) return false;
      if (fCustomer && !d.customerName.toLowerCase().includes(fCustomer.toLowerCase())) return false;
      if (fStatus !== 'All' && d.status !== fStatus) return false;
      return true;
    });
  }, [selectedTrip, fDelivery, fOrder, fCustomer, fStatus]);

  const pagedDeliveries = filteredDeliveries.slice((delPage - 1) * PAGE_SIZE, delPage * PAGE_SIZE);
  const delPageCount = Math.max(1, Math.ceil(filteredDeliveries.length / PAGE_SIZE));

  // KPIs
  const kpis = useMemo(() => {
    const totalTrips = dateTrips.length;
    const completedTrips = dateTrips.filter(t => t.status === 'Completed').length;
    const inProgressTrips = dateTrips.filter(t => t.status === 'In Progress').length;
    const pendingTrips = dateTrips.filter(t => t.status === 'Pending').length;
    const allDel = dateTrips.flatMap(t => t.deliveries);
    const totalDel = allDel.length;
    const completedDel = allDel.filter(d => d.status === 'Delivered').length;
    const pendingDel = allDel.filter(d => d.status === 'Pending' || d.status === 'Out For Delivery').length;
    return { totalTrips, completedTrips, inProgressTrips, pendingTrips, totalDel, completedDel, pendingDel };
  }, [dateTrips]);

  const kpiCards = [
    { label: 'Total Trips', value: kpis.totalTrips, icon: RouteIcon, color: 'from-slate-500 to-slate-600' },
    { label: 'Completed Trips', value: kpis.completedTrips, icon: CheckCircle2, color: 'from-green-500 to-emerald-600' },
    { label: 'In Progress Trips', value: kpis.inProgressTrips, icon: Truck, color: 'from-blue-500 to-indigo-600' },
    { label: 'Pending Trips', value: kpis.pendingTrips, icon: Clock, color: 'from-amber-500 to-orange-500' },
    { label: 'Total Deliveries', value: kpis.totalDel, icon: Boxes, color: 'from-purple-500 to-fuchsia-600' },
    { label: 'Completed Deliveries', value: kpis.completedDel, icon: PackageCheck, color: 'from-emerald-500 to-teal-600' },
    { label: 'Pending Deliveries', value: kpis.pendingDel, icon: Package, color: 'from-primary to-orange-500' },
  ];

  const confirmUpdate = () => {
    if (!updateFor || !newStatus || !selectedTrip) return;
    setTrips(prev => prev.map(t => {
      if (t.tripId !== selectedTrip.tripId) return t;
      const updatedDeliveries = t.deliveries.map(d =>
        d.deliveryId === updateFor.deliveryId ? { ...d, status: newStatus } : d
      );
      const completedCount = updatedDeliveries.filter(d => d.status === 'Delivered').length;
      const allDelivered = updatedDeliveries.length > 0 && updatedDeliveries.every(d => d.status === 'Delivered');
      const anyActive = updatedDeliveries.some(d => d.status === 'Out For Delivery' || d.status === 'Delivered');
      let nextStatus: TripStatus = t.status;
      if (allDelivered) nextStatus = 'Completed';
      else if (anyActive && t.status === 'Pending') nextStatus = 'In Progress';
      return { ...t, deliveries: updatedDeliveries, completedDeliveries: completedCount, status: nextStatus };
    }));
    toast({
      title: 'Delivery status updated',
      description: `${updateFor.deliveryId} → ${newStatus}`,
    });
    setUpdateFor(null);
    setNewStatus('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Truck className="w-6 h-6 text-primary" /> Delivery Trips
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage assigned delivery trips and update delivery statuses
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm">
            <span className="flex items-center gap-1.5 text-foreground"><User className="w-4 h-4 text-primary" /> <strong>{deliveryBoy.name}</strong></span>
            <span className="flex items-center gap-1.5 text-muted-foreground"><Truck className="w-4 h-4" /> {deliveryBoy.vehicle}</span>
            <span className="text-muted-foreground">Total: <strong className="text-foreground">{kpis.totalTrips}</strong></span>
            <span className="text-green-700">Completed: <strong>{kpis.completedTrips}</strong></span>
            <span className="text-amber-700">Pending: <strong>{kpis.pendingTrips + kpis.inProgressTrips}</strong></span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">Date</label>
          <Input
            type="date"
            value={date}
            onChange={e => { setDate(e.target.value); setSelectedTripId(null); setTripPage(1); }}
            className="w-44"
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {kpiCards.map(k => (
          <Card key={k.label} className="overflow-hidden border-border/60">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{k.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{k.value}</p>
                </div>
                <div className={cn('w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center text-white shadow-sm', k.color)}>
                  <k.icon className="w-4 h-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-border/60">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            <Input placeholder="Trip Number" value={fTrip} onChange={e => setFTrip(e.target.value)} />
            <Input placeholder="Route Number" value={fRouteNum} onChange={e => setFRouteNum(e.target.value)} />
            <Input placeholder="Route Name" value={fRouteName} onChange={e => setFRouteName(e.target.value)} />
            <Input placeholder="Delivery Number" value={fDelivery} onChange={e => setFDelivery(e.target.value)} />
            <Input placeholder="Order Number" value={fOrder} onChange={e => setFOrder(e.target.value)} />
            <Input placeholder="Customer Name" value={fCustomer} onChange={e => setFCustomer(e.target.value)} />
            <Select value={fStatus} onValueChange={setFStatus}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                {Array.from(new Set([...TRIP_STATUSES, ...DELIVERY_STATUSES])).map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <Button variant="outline" size="sm" onClick={resetFilters}>
              <RefreshCw className="w-4 h-4" /> Reset
            </Button>
            <Button size="sm" onClick={() => { setTripPage(1); setDelPage(1); }}>
              <Search className="w-4 h-4" /> Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Two-column tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Trips */}
        <Card className="border-border/60">
          <CardContent className="p-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40 rounded-t-lg">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <RouteIcon className="w-4 h-4 text-primary" /> Assigned Delivery Trips
                <Badge variant="secondary" className="ml-1">{filteredTrips.length}</Badge>
              </h2>
              <Select value={tripSort} onValueChange={v => setTripSort(v as typeof tripSort)}>
                <SelectTrigger className="h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="routeNumber">Sort: Route #</SelectItem>
                  <SelectItem value="status">Sort: Status</SelectItem>
                  <SelectItem value="progress">Sort: Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="max-h-[560px] overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow>
                    <TableHead>Route</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedTrips.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12 text-muted-foreground text-sm">
                        No trips found for {date}
                      </TableCell>
                    </TableRow>
                  ) : pagedTrips.map(t => {
                    const active = t.tripId === selectedTripId;
                    return (
                      <TableRow
                        key={t.tripId}
                        onClick={() => { setSelectedTripId(t.tripId); setDelPage(1); }}
                        className={cn(
                          'cursor-pointer transition-colors',
                          active && 'bg-primary/10 hover:bg-primary/10 border-l-4 border-l-primary'
                        )}
                      >
                        <TableCell>
                          <div className="font-semibold text-sm text-foreground">{t.routeNumber}</div>
                          <div className="text-xs text-muted-foreground">{t.routeName}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{t.tripId}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{t.completedDeliveries} / {t.totalDeliveries}</div>
                          <div className="w-24 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${t.totalDeliveries ? (t.completedDeliveries / t.totalDeliveries) * 100 : 0}%` }}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{t.vehicleModel}</div>
                          <div className="text-xs text-muted-foreground">{t.vehicleType}</div>
                          <div className="text-xs font-mono text-foreground">{t.vehicleNumber}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn('border', tripStatusClass(t.status))}>
                            {t.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <Pager page={tripPage} pageCount={tripPageCount} setPage={setTripPage} total={filteredTrips.length} />
          </CardContent>
        </Card>

        {/* RIGHT: Deliveries */}
        <Card className="border-border/60">
          <CardContent className="p-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40 rounded-t-lg">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Boxes className="w-4 h-4 text-primary" /> Trip Deliveries
                {selectedTrip && (
                  <Badge variant="secondary" className="ml-1">{filteredDeliveries.length}</Badge>
                )}
              </h2>
              {selectedTrip && (
                <span className="text-xs text-muted-foreground">{selectedTrip.routeNumber} · {selectedTrip.routeName}</span>
              )}
            </div>

            {!selectedTrip ? (
              <div className="flex flex-col items-center justify-center text-center py-20 px-6">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <MousePointerClick className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold text-foreground">No trip selected</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  Select a Delivery Trip from the left table to view assigned deliveries.
                </p>
              </div>
            ) : (
              <>
                <div className="max-h-[560px] overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-card z-10">
                      <TableRow>
                        <TableHead>Delivery</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="text-center">Pkts</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pagedDeliveries.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-12 text-muted-foreground text-sm">
                            No deliveries match filters
                          </TableCell>
                        </TableRow>
                      ) : pagedDeliveries.map(d => {
                        const next = allowedNext(d.status);
                        return (
                          <TableRow key={d.deliveryId}>
                            <TableCell>
                              <div className="font-semibold text-sm">{d.deliveryId}</div>
                              <div className="text-xs text-muted-foreground">{d.orderNumber}</div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm font-medium">{d.customerName}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {d.location}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="secondary" className="font-mono">{d.packets}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn('border', deliveryStatusClass(d.status))}>
                                {d.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={next.length === 0}
                                onClick={() => { setUpdateFor(d); setNewStatus(next[0] ?? ''); }}
                              >
                                Update
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                <Pager page={delPage} pageCount={delPageCount} setPage={setDelPage} total={filteredDeliveries.length} />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Update Status Dialog */}
      <Dialog open={!!updateFor} onOpenChange={o => { if (!o) { setUpdateFor(null); setNewStatus(''); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Delivery Status</DialogTitle>
            <DialogDescription>
              {updateFor && (
                <>Change status for <strong>{updateFor.deliveryId}</strong> · {updateFor.customerName}</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Current: {updateFor && (
                <Badge variant="outline" className={cn('border ml-1', deliveryStatusClass(updateFor.status))}>
                  {updateFor.status}
                </Badge>
              )}
            </div>
            <Select value={newStatus} onValueChange={v => setNewStatus(v as DeliveryStatus)}>
              <SelectTrigger><SelectValue placeholder="Select new status" /></SelectTrigger>
              <SelectContent>
                {updateFor && allowedNext(updateFor.status).map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setUpdateFor(null); setNewStatus(''); }}>Cancel</Button>
            <Button onClick={confirmUpdate} disabled={!newStatus}>Confirm Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Pager = ({ page, pageCount, setPage, total }: { page: number; pageCount: number; setPage: (n: number) => void; total: number }) => (
  <div className="flex items-center justify-between px-4 py-2.5 border-t border-border text-xs text-muted-foreground">
    <span>{total} {total === 1 ? 'record' : 'records'}</span>
    <div className="flex items-center gap-2">
      <Button size="sm" variant="ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <span>Page {page} of {pageCount}</span>
      <Button size="sm" variant="ghost" disabled={page >= pageCount} onClick={() => setPage(page + 1)}>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

export default DeliveryTrips;
