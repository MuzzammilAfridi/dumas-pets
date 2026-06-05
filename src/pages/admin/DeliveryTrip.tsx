import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Truck, User, Car, MapPin, Route, ListChecks, Activity, BarChart3, Map,
  Save, CalendarCheck, Play, CheckCircle2, XCircle, Plus, Trash2, GripVertical,
  Search, ArrowUp, ArrowDown, Clock, Package, Gauge, Sparkles,
} from 'lucide-react';
import {
  mockDrivers, mockVehicles, mockDeliveryNotes, mockActivity,
  Driver, Vehicle, DeliveryNote, DeliveryStop, TripStatus, TrackingStep, ActivityEntry, statusPill,
} from '@/data/deliveryTripData';

const TRIP_ID = 'DT-0001';
const WAREHOUSE = 'Dumas Central Kitchen, Mumbai';

const TRACKING_ORDER: TrackingStep['key'][] = [
  'Draft', 'Scheduled', 'Driver Assigned', 'Vehicle Assigned', 'In Transit', 'Completed',
];

const DeliveryTrip = () => {
  const { toast } = useToast();
  const [status, setStatus] = useState<TripStatus>('Draft');
  const [tripDate, setTripDate] = useState('2026-06-05');
  const [departure, setDeparture] = useState('2026-06-05T08:00');
  const [expectedReturn, setExpectedReturn] = useState('2026-06-05T16:00');
  const [notes, setNotes] = useState('Morning route covering Bandra → Andheri → Powai.');

  const [driverId, setDriverId] = useState<string>('DRV-001');
  const [vehicleId, setVehicleId] = useState<string>('VEH-001');

  const [stops, setStops] = useState<DeliveryStop[]>([
    { stopNo: 1, deliveryNoteId: 'DN-1001', customer: 'Sarah Mitchell', address: '123 Oak St, Bandra West, Mumbai',   contact: '+91 98111 22233', eta: '09:00', status: 'Pending' },
    { stopNo: 2, deliveryNoteId: 'DN-1002', customer: 'John Davis',     address: '456 Elm Ave, Powai, Mumbai',         contact: '+91 98222 33344', eta: '10:15', status: 'Pending' },
  ]);
  const [selectedDNs, setSelectedDNs] = useState<string[]>([]);
  const [dnSearch, setDnSearch] = useState('');
  const [activity, setActivity] = useState<ActivityEntry[]>(mockActivity);
  const [confirm, setConfirm] = useState<{ open: boolean; action?: () => void; title?: string; desc?: string }>({ open: false });

  const driver: Driver | undefined = useMemo(() => mockDrivers.find(d => d.id === driverId), [driverId]);
  const vehicle: Vehicle | undefined = useMemo(() => mockVehicles.find(v => v.id === vehicleId), [vehicleId]);

  const tracking: TrackingStep[] = useMemo(() => {
    const done = new Set<TrackingStep['key']>(['Draft']);
    if (driverId) done.add('Driver Assigned');
    if (vehicleId) done.add('Vehicle Assigned');
    if (status === 'Scheduled' || status === 'In Transit' || status === 'Completed') done.add('Scheduled');
    if (status === 'In Transit' || status === 'Completed') done.add('In Transit');
    if (status === 'Completed') done.add('Completed');
    return TRACKING_ORDER.map(k => ({
      key: k,
      done: done.has(k),
      timestamp: done.has(k) ? '2026-06-04 10:00' : undefined,
      user: done.has(k) ? 'admin' : undefined,
    }));
  }, [status, driverId, vehicleId]);

  const counts = useMemo(() => {
    const delivered = stops.filter(s => s.status === 'Delivered').length;
    const pending = stops.filter(s => s.status === 'Pending').length;
    return {
      total: stops.length,
      delivered,
      pending,
      distance: stops.length * 6.4, // mock km per stop
      cost: stops.length * 120,     // mock INR per stop
      efficiency: stops.length ? Math.round((delivered / stops.length) * 100) : 0,
    };
  }, [stops]);

  const logActivity = (a: string, remarks: string) => {
    const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
    setActivity(prev => [{ timestamp: stamp, user: 'admin', activity: a, remarks }, ...prev]);
  };

  const changeStatus = (next: TripStatus, label: string) => {
    setStatus(next);
    logActivity(label, `Status set to ${next}`);
    toast({ title: label, description: `Trip ${TRIP_ID} is now ${next}.` });
  };

  const askConfirm = (title: string, desc: string, action: () => void) =>
    setConfirm({ open: true, title, desc, action });

  const addStopsFromDNs = () => {
    if (!selectedDNs.length) return;
    const start = stops.length;
    const added: DeliveryStop[] = selectedDNs.map((id, i) => {
      const dn = mockDeliveryNotes.find(d => d.id === id)!;
      return {
        stopNo: start + i + 1,
        deliveryNoteId: dn.id,
        customer: dn.customer,
        address: dn.address,
        contact: dn.contact,
        eta: '11:00',
        status: 'Pending',
      };
    });
    setStops(prev => [...prev, ...added]);
    setSelectedDNs([]);
    logActivity('Stops Added', `${added.length} stop(s) added from Delivery Notes`);
    toast({ title: 'Stops added', description: `${added.length} stop(s) added to the trip.` });
  };

  const removeStop = (idx: number) =>
    setStops(prev => prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, stopNo: i + 1 })));

  const moveStop = (idx: number, dir: -1 | 1) => {
    setStops(prev => {
      const arr = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= arr.length) return arr;
      [arr[idx], arr[j]] = [arr[j], arr[idx]];
      return arr.map((s, i) => ({ ...s, stopNo: i + 1 }));
    });
  };

  const filteredDNs = mockDeliveryNotes.filter(dn => {
    const q = dnSearch.toLowerCase();
    return !q || dn.id.toLowerCase().includes(q) || dn.customer.toLowerCase().includes(q) || dn.address.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-foreground">Delivery Trip</h1>
            <Badge variant="outline" className="font-mono">{TRIP_ID}</Badge>
            <Badge variant="outline" className={cn('border', statusPill(status))}>{status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Plan, schedule and track a multi-stop delivery route in one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 lg:sticky lg:top-2 z-10">
          <Button variant="outline" size="sm" onClick={() => { changeStatus('Draft', 'Saved Draft'); }}>
            <Save className="w-4 h-4" /> Save Draft
          </Button>
          <Button variant="outline" size="sm" disabled={status !== 'Draft'} onClick={() => changeStatus('Scheduled', 'Trip Scheduled')}>
            <CalendarCheck className="w-4 h-4" /> Schedule Trip
          </Button>
          <Button size="sm" disabled={status !== 'Scheduled'} onClick={() => changeStatus('In Transit', 'Trip Started')}>
            <Play className="w-4 h-4" /> Start Trip
          </Button>
          <Button size="sm" variant="outline" disabled={status !== 'In Transit'}
            onClick={() => askConfirm('Complete Trip', 'Mark this trip as completed?', () => changeStatus('Completed', 'Trip Completed'))}>
            <CheckCircle2 className="w-4 h-4" /> Complete Trip
          </Button>
          <Button size="sm" variant="destructive" disabled={status === 'Completed' || status === 'Cancelled'}
            onClick={() => askConfirm('Cancel Trip', 'Cancel this delivery trip? This cannot be undone.', () => changeStatus('Cancelled', 'Trip Cancelled'))}>
            <XCircle className="w-4 h-4" /> Cancel Trip
          </Button>
        </div>
      </div>

      {/* KPI ANALYTICS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Deliveries', value: counts.total,                    icon: Package,      color: 'from-slate-500 to-slate-600' },
          { label: 'Pending',          value: counts.pending,                  icon: Clock,        color: 'from-amber-400 to-amber-500' },
          { label: 'Delivered',        value: counts.delivered,                icon: CheckCircle2, color: 'from-green-400 to-green-500' },
          { label: 'Total Distance',   value: `${counts.distance.toFixed(1)} km`, icon: Route,     color: 'from-blue-400 to-blue-500' },
          { label: 'Estimated Cost',   value: `₹${counts.cost}`,               icon: Gauge,        color: 'from-purple-400 to-purple-500' },
          { label: 'Trip Efficiency',  value: `${counts.efficiency}%`,         icon: Sparkles,     color: 'from-primary to-orange-500' },
        ].map((k, i) => (
          <Card key={i} className="border-border shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br text-white flex items-center justify-center', k.color)}>
                <k.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground truncate">{k.label}</div>
                <div className="text-lg font-bold text-foreground">{k.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* INFO CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* BASIC */}
        <Card className="border-border shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <ListChecks className="w-4 h-4 text-primary" /> Basic Information
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label className="text-xs">Delivery Trip ID</Label>
                <Input value={TRIP_ID} readOnly className="bg-muted" />
              </div>
              <div>
                <Label className="text-xs">Trip Date</Label>
                <Input type="date" value={tripDate} onChange={e => setTripDate(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Departure</Label>
                  <Input type="datetime-local" value={departure} onChange={e => setDeparture(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs">Expected Return</Label>
                  <Input type="datetime-local" value={expectedReturn} onChange={e => setExpectedReturn(e.target.value)} />
                </div>
              </div>
              <div>
                <Label className="text-xs">Notes / Remarks</Label>
                <Textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs">Status</Label>
                <div className="mt-1"><Badge variant="outline" className={cn('border', statusPill(status))}>{status}</Badge></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DRIVER */}
        <Card className="border-border shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <User className="w-4 h-4 text-primary" /> Driver Information
            </div>
            <div>
              <Label className="text-xs">Driver</Label>
              <Select value={driverId} onValueChange={setDriverId}>
                <SelectTrigger><SelectValue placeholder="Select driver" /></SelectTrigger>
                <SelectContent>
                  {mockDrivers.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.name} — {d.id}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label className="text-xs">Mobile Number</Label>
                <Input value={driver?.mobile ?? ''} readOnly className="bg-muted" />
              </div>
              <div>
                <Label className="text-xs">License Number</Label>
                <Input value={driver?.license ?? ''} readOnly className="bg-muted" />
              </div>
              <div>
                <Label className="text-xs">Driver Status</Label>
                <div className="mt-1">
                  {driver && <Badge variant="outline" className={cn('border', statusPill(driver.status))}>{driver.status}</Badge>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* VEHICLE */}
        <Card className="border-border shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Car className="w-4 h-4 text-primary" /> Vehicle Information
            </div>
            <div>
              <Label className="text-xs">Vehicle</Label>
              <Select value={vehicleId} onValueChange={setVehicleId}>
                <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                <SelectContent>
                  {mockVehicles.map(v => (
                    <SelectItem key={v.id} value={v.id}>{v.number} — {v.type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Vehicle Number</Label>
                <Input value={vehicle?.number ?? ''} readOnly className="bg-muted" />
              </div>
              <div>
                <Label className="text-xs">Vehicle Type</Label>
                <Input value={vehicle?.type ?? ''} readOnly className="bg-muted" />
              </div>
              <div>
                <Label className="text-xs">Capacity</Label>
                <Input value={vehicle?.capacity ?? ''} readOnly className="bg-muted" />
              </div>
              <div>
                <Label className="text-xs">Odometer (km)</Label>
                <Input value={vehicle?.odometer?.toLocaleString() ?? ''} readOnly className="bg-muted" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DELIVERY STOPS */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MapPin className="w-4 h-4 text-primary" /> Delivery Stops
              <Badge variant="outline">{stops.length} stop{stops.length !== 1 ? 's' : ''}</Badge>
            </div>
          </div>
          <div className="rounded-lg border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Delivery Note</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stops.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-sm">
                      No stops yet. Select Delivery Notes below and click "Add Selected to Trip".
                    </TableCell>
                  </TableRow>
                )}
                {stops.map((s, i) => (
                  <TableRow key={`${s.deliveryNoteId}-${i}`}>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <GripVertical className="w-3.5 h-3.5" />
                        <span className="font-mono text-xs">{s.stopNo}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{s.deliveryNoteId}</TableCell>
                    <TableCell className="text-sm">{s.customer}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[240px] truncate">{s.address}</TableCell>
                    <TableCell className="text-xs">{s.contact}</TableCell>
                    <TableCell>
                      <Input type="time" value={s.eta} className="h-8 w-24"
                        onChange={e => setStops(prev => prev.map((x, idx) => idx === i ? { ...x, eta: e.target.value } : x))} />
                    </TableCell>
                    <TableCell>
                      <Select value={s.status} onValueChange={(v) =>
                        setStops(prev => prev.map((x, idx) => idx === i ? { ...x, status: v as DeliveryStop['status'] } : x))}>
                        <SelectTrigger className="h-8 w-[130px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {['Pending','In Transit','Delivered','Failed'].map(v => (
                            <SelectItem key={v} value={v}>{v}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => moveStop(i, -1)} disabled={i === 0}>
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => moveStop(i, 1)} disabled={i === stops.length - 1}>
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => removeStop(i)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ROUTE SUMMARY + TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border-border shadow-sm lg:col-span-1">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Route className="w-4 h-4 text-primary" /> Route Summary
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <SummaryRow label="Total Stops" value={counts.total} />
              <SummaryRow label="Total Distance" value={`${counts.distance.toFixed(1)} km`} />
              <SummaryRow label="Est. Travel Time" value={`${Math.max(1, Math.round(counts.distance / 25 * 60))} min`} />
              <SummaryRow label="Vehicle Utilization" value={`${Math.min(100, counts.total * 12)}%`} />
              <div className="col-span-2">
                <div className="text-xs text-muted-foreground mb-1">Route Optimization</div>
                <Badge variant="outline" className="border bg-green-100 text-green-700 border-green-200">Optimized</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm lg:col-span-2">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MapPin className="w-4 h-4 text-primary" /> Route Timeline
            </div>
            <ol className="relative border-l-2 border-dashed border-border ml-3 space-y-3">
              <TimelineItem label="Warehouse" sub={WAREHOUSE} primary />
              {stops.map((s) => (
                <TimelineItem key={`tl-${s.stopNo}`} label={`Stop ${s.stopNo} · ${s.customer}`} sub={`${s.address} · ETA ${s.eta}`} />
              ))}
              <TimelineItem label="Return to Warehouse" sub={WAREHOUSE} primary />
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* DELIVERY NOTES SELECTION */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Package className="w-4 h-4 text-primary" /> Available Delivery Notes
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-8 h-9 w-[220px]" placeholder="Search DN / customer..."
                  value={dnSearch} onChange={e => setDnSearch(e.target.value)} />
              </div>
              <Button size="sm" onClick={addStopsFromDNs} disabled={!selectedDNs.length}>
                <Plus className="w-4 h-4" /> Add Selected to Trip
              </Button>
            </div>
          </div>
          <div className="rounded-lg border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>DN Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDNs.map(dn => {
                  const checked = selectedDNs.includes(dn.id);
                  return (
                    <TableRow key={dn.id}>
                      <TableCell>
                        <Checkbox checked={checked} onCheckedChange={(v) =>
                          setSelectedDNs(prev => v ? [...prev, dn.id] : prev.filter(x => x !== dn.id))} />
                      </TableCell>
                      <TableCell className="font-mono text-xs">{dn.id}</TableCell>
                      <TableCell className="text-sm">{dn.customer}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{dn.date}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[260px] truncate">{dn.address}</TableCell>
                      <TableCell className="text-xs">{dn.qty}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('border', statusPill(dn.status))}>{dn.status}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* TRACKING + MAP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Activity className="w-4 h-4 text-primary" /> Trip Tracking
            </div>
            <ol className="space-y-3">
              {tracking.map((t, i) => (
                <li key={t.key} className="flex items-start gap-3">
                  <div className={cn(
                    'mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border',
                    t.done ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border'
                  )}>{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{t.key}</div>
                    <div className="text-xs text-muted-foreground">
                      {t.done ? `${t.timestamp} · ${t.user}` : 'Pending'}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Map className="w-4 h-4 text-primary" /> Map & Route Preview
              </div>
              <Badge variant="outline" className="border bg-green-100 text-green-700 border-green-200">Optimized</Badge>
            </div>
            <div className="relative rounded-lg border border-dashed border-border bg-muted/40 h-48 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
              <div className="relative text-center text-sm text-muted-foreground">
                <Map className="w-8 h-8 mx-auto mb-2 text-primary" />
                Google Maps preview will render here
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Driver location: <span className="text-foreground font-medium">Live tracking pending</span>
            </div>
            <div className="space-y-1.5">
              {stops.map(s => (
                <div key={`m-${s.stopNo}`} className="flex items-center gap-2 text-xs">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">{s.stopNo}</div>
                  <span className="font-medium text-foreground">{s.customer}</span>
                  <span className="text-muted-foreground truncate">· {s.address}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ACTIVITY LOG */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <BarChart3 className="w-4 h-4 text-primary" /> Activity Log
          </div>
          <div className="rounded-lg border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date &amp; Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activity.map((a, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs font-mono text-muted-foreground">{a.timestamp}</TableCell>
                    <TableCell className="text-xs">{a.user}</TableCell>
                    <TableCell className="text-sm font-medium">{a.activity}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{a.remarks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* CONFIRM DIALOG */}
      <Dialog open={confirm.open} onOpenChange={(o) => setConfirm(c => ({ ...c, open: o }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirm.title}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{confirm.desc}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm({ open: false })}>Cancel</Button>
            <Button onClick={() => { confirm.action?.(); setConfirm({ open: false }); }}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const SummaryRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="rounded-lg border border-border p-3 bg-muted/30">
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="text-sm font-semibold text-foreground">{value}</div>
  </div>
);

const TimelineItem = ({ label, sub, primary }: { label: string; sub?: string; primary?: boolean }) => (
  <li className="ml-4">
    <div className={cn(
      'absolute -left-1.5 w-3 h-3 rounded-full border-2',
      primary ? 'bg-primary border-primary' : 'bg-background border-primary'
    )} />
    <div className="text-sm font-medium text-foreground">{label}</div>
    {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
  </li>
);

export default DeliveryTrip;
