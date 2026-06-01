import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  Truck, Search, RefreshCw, FileSpreadsheet, Eye, MoreHorizontal, CheckCircle2,
  AlertTriangle, MapPin, Phone, Package, Clock, Users, Zap, Boxes, Send, Route,
  History, UserPlus, Sparkles,
} from 'lucide-react';
import {
  Pickup, PICKUP_STATUSES, PickupStatus, mockPartners, mockPickups, statusPill, Partner,
} from '@/data/pickupData';
import { cn } from '@/lib/utils';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const kpiCards = [
  { key: 'total',      label: 'Total Pickups',      icon: Boxes,       color: 'from-slate-500 to-slate-600' },
  { key: 'pending',    label: 'Pending Assignment', icon: Clock,       color: 'from-gray-400 to-gray-500' },
  { key: 'assigned',   label: 'Assigned',           icon: UserPlus,    color: 'from-blue-400 to-blue-500' },
  { key: 'out',        label: 'Out for Delivery',   icon: Truck,       color: 'from-indigo-400 to-indigo-500' },
  { key: 'delivered',  label: 'Delivered',          icon: CheckCircle2,color: 'from-green-400 to-green-500' },
  { key: 'express',    label: 'Express',            icon: Zap,         color: 'from-primary to-orange-500' },
  { key: 'standard',   label: 'Standard',           icon: Package,     color: 'from-purple-400 to-purple-500' },
  { key: 'reassigned', label: 'Reassigned Today',   icon: History,     color: 'from-amber-400 to-amber-500' },
] as const;

const isEligible = (p: Pickup) =>
  p.paymentDone && p.stockReady && p.addressAvailable && p.contactAvailable && p.zoneServiceable;

const failedChecks = (p: Pickup) => {
  const arr: string[] = [];
  if (!p.paymentDone) arr.push('Payment pending');
  if (!p.stockReady) arr.push('Stock not ready');
  if (!p.addressAvailable) arr.push('Address missing');
  if (!p.contactAvailable) arr.push('Contact missing');
  if (!p.zoneServiceable) arr.push('Zone not serviceable');
  return arr;
};

const PickupList = () => {
  const [pickups, setPickups] = useState<Pickup[]>(mockPickups);
  const [partners, setPartners] = useState<Partner[]>(mockPartners);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [slotFilter, setSlotFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [assignFilter, setAssignFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [partnerFilter, setPartnerFilter] = useState<string>('All');
  const [groupBy, setGroupBy] = useState<string>('none');
  const [sortBy, setSortBy] = useState<string>('window');
  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState<Pickup | null>(null);
  const [assignFor, setAssignFor] = useState<Pickup[] | null>(null);
  const [tripOpen, setTripOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [notify, setNotify] = useState({ email: true, sms: true, push: false });
  const [activeKpi, setActiveKpi] = useState<string>('total');
  const { toast } = useToast();

  const counts = useMemo(() => ({
    total:      pickups.length,
    pending:    pickups.filter(p => p.status === 'Pending Pickup' || p.status === 'Eligible').length,
    assigned:   pickups.filter(p => p.status === 'Assigned').length,
    out:        pickups.filter(p => p.status === 'Out for Delivery').length,
    delivered:  pickups.filter(p => p.status === 'Delivered').length,
    express:    pickups.filter(p => p.deliveryType === 'Express').length,
    standard:   pickups.filter(p => p.deliveryType === 'Standard').length,
    reassigned: pickups.filter(p => p.reassignedToday).length,
  }), [pickups]);

  const filtered = useMemo(() => {
    let list = pickups.filter(p => {
      if (areaFilter && !p.area.toLowerCase().includes(areaFilter.toLowerCase())) return false;
      if (slotFilter && !p.timeSlot.toLowerCase().includes(slotFilter.toLowerCase())) return false;
      if (typeFilter !== 'All' && p.deliveryType !== typeFilter) return false;
      if (statusFilter !== 'All' && p.status !== statusFilter) return false;
      if (assignFilter === 'Unassigned' && p.assignedPartnerId) return false;
      if (assignFilter === 'Assigned' && !p.assignedPartnerId) return false;
      if (assignFilter === 'Reassigned' && !p.reassignedToday) return false;
      if (priorityFilter !== 'All' && p.priority !== priorityFilter) return false;
      if (partnerFilter !== 'All' && p.assignedPartnerId !== partnerFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        const hay = `${p.id} ${p.customer} ${p.phone} ${p.kitchenRef} ${p.salesOrder} ${p.deliveryNote} ${p.address} ${partners.find(x => x.id === p.assignedPartnerId)?.name ?? ''}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      if (activeKpi === 'pending' && !(p.status === 'Pending Pickup' || p.status === 'Eligible')) return false;
      if (activeKpi === 'assigned' && p.status !== 'Assigned') return false;
      if (activeKpi === 'out' && p.status !== 'Out for Delivery') return false;
      if (activeKpi === 'delivered' && p.status !== 'Delivered') return false;
      if (activeKpi === 'express' && p.deliveryType !== 'Express') return false;
      if (activeKpi === 'standard' && p.deliveryType !== 'Standard') return false;
      if (activeKpi === 'reassigned' && !p.reassignedToday) return false;
      return true;
    });
    if (sortBy === 'express') list = [...list].sort((a, b) => (b.deliveryType === 'Express' ? 1 : 0) - (a.deliveryType === 'Express' ? 1 : 0));
    if (sortBy === 'unassigned') list = [...list].sort((a, b) => (a.assignedPartnerId ? 1 : 0) - (b.assignedPartnerId ? 1 : 0));
    return list;
  }, [pickups, partners, search, areaFilter, slotFilter, typeFilter, statusFilter, assignFilter, priorityFilter, partnerFilter, sortBy, activeKpi]);

  const grouped = useMemo(() => {
    if (groupBy === 'none') return { '': filtered };
    const key = (p: Pickup) =>
      groupBy === 'area' ? p.area :
      groupBy === 'slot' ? p.timeSlot :
      groupBy === 'priority' ? p.priority :
      groupBy === 'type' ? p.deliveryType : '';
    return filtered.reduce<Record<string, Pickup[]>>((acc, p) => {
      const k = key(p);
      (acc[k] = acc[k] || []).push(p);
      return acc;
    }, {});
  }, [filtered, groupBy]);

  const resetFilters = () => {
    setSearch(''); setDateFrom(''); setDateTo(''); setAreaFilter(''); setSlotFilter('');
    setTypeFilter('All'); setStatusFilter('All'); setAssignFilter('All'); setPriorityFilter('All');
    setPartnerFilter('All'); setActiveKpi('total');
  };

  const toggleSelect = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map(p => p.id));

  const openAssign = (rows: Pickup[]) => {
    setAssignFor(rows);
    setSelectedPartner(rows[0]?.suggestedPartnerId ?? '');
    setNotes('');
  };

  const confirmAssign = () => {
    if (!assignFor || !selectedPartner) return;
    const partner = partners.find(p => p.id === selectedPartner)!;
    const ids = assignFor.map(p => p.id);
    setPickups(prev => prev.map(p => ids.includes(p.id) ? {
      ...p,
      assignedPartnerId: selectedPartner,
      status: p.assignedPartnerId ? 'Reassigned' : 'Assigned',
      reassignedToday: p.assignedPartnerId ? true : p.reassignedToday,
      audit: [...p.audit, { action: p.assignedPartnerId ? 'Reassigned' : 'Assigned', user: 'Admin', at: new Date().toISOString(), remarks: `→ ${partner.name}${notes ? ` • ${notes}` : ''}` }],
    } : p));
    setPartners(prev => prev.map(p => p.id === selectedPartner ? { ...p, assigned: p.assigned + ids.length } : p));
    toast({ title: 'Assignment confirmed', description: `${ids.length} pickup(s) → ${partner.name}` });
    setAssignFor(null); setSelected([]);
  };

  const exportExcel = () => {
    const headers = ['Pickup ID','Sales Order','Customer','Area','Slot','Type','Items','Status','Partner'];
    const rows = filtered.map(p => [p.id, p.salesOrder, p.customer, p.area, p.timeSlot, p.deliveryType, p.itemsCount, p.status, partners.find(x => x.id === p.assignedPartnerId)?.name ?? '']);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'pickup-list.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const selectedRows = pickups.filter(p => selected.includes(p.id));

  return (
    <TooltipProvider>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Truck className="w-6 h-6 text-primary" /> PickUp List
          </h2>
          <p className="text-sm text-muted-foreground">Manage packed pickup orders, assign delivery partners, and track delivery trips.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={exportExcel}><FileSpreadsheet className="w-4 h-4" /> Export Excel</Button>
          <Button variant="outline" size="sm" onClick={resetFilters}><RefreshCw className="w-4 h-4" /> Reset</Button>
          <Button variant="outline" size="sm" disabled={selected.length === 0} onClick={() => openAssign(selectedRows)}>
            <UserPlus className="w-4 h-4" /> Bulk Assign
          </Button>
          <Button size="sm" onClick={() => setTripOpen(true)} disabled={selected.length === 0}>
            <Route className="w-4 h-4" /> Create Trip
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        {kpiCards.map(c => {
          const Icon = c.icon;
          const active = activeKpi === c.key;
          return (
            <button key={c.key} onClick={() => setActiveKpi(c.key)}
              className={cn('rounded-xl p-3 text-left transition-all border bg-card hover:shadow-md',
                active ? 'ring-2 ring-primary shadow-md' : 'border-border')}>
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-2 bg-gradient-to-br', c.color)}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="text-2xl font-bold text-foreground">{counts[c.key as keyof typeof counts]}</div>
              <div className="text-xs text-muted-foreground leading-tight">{c.label}</div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search order ID, customer, phone, pickup ID, sales order, delivery note, address, partner..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            <Input placeholder="Area / route" value={areaFilter} onChange={e => setAreaFilter(e.target.value)} />
            <Input placeholder="Time slot" value={slotFilter} onChange={e => setSlotFilter(e.target.value)} />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger><SelectValue placeholder="Delivery type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Express">Express</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Pickup status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                {PICKUP_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={assignFilter} onValueChange={setAssignFilter}>
              <SelectTrigger><SelectValue placeholder="Assignment" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Assignments</SelectItem>
                <SelectItem value="Unassigned">Unassigned</SelectItem>
                <SelectItem value="Assigned">Assigned</SelectItem>
                <SelectItem value="Reassigned">Reassigned</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Priorities</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={partnerFilter} onValueChange={setPartnerFilter}>
              <SelectTrigger><SelectValue placeholder="Delivery partner" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Partners</SelectItem>
                {partners.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="w-full">
              <Search className="w-4 h-4" /> Load Pending Pickup Orders
            </Button>
          </div>
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-xs text-muted-foreground">Group by:</span>
            <Select value={groupBy} onValueChange={setGroupBy}>
              <SelectTrigger className="w-40 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="area">Area / Route</SelectItem>
                <SelectItem value="slot">Time slot</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="type">Delivery type</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground ml-2">Sort:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="window">Nearest delivery window</SelectItem>
                <SelectItem value="express">Express first</SelectItem>
                <SelectItem value="unassigned">Unassigned first</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk bar */}
      {selected.length > 0 && (
        <Card className="border-primary/40 bg-primary/5 sticky top-2 z-10">
          <CardContent className="p-3 flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm font-medium">{selected.length} pickup(s) selected</span>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline" onClick={() => openAssign(selectedRows)}><UserPlus className="w-4 h-4" /> Bulk Assign</Button>
              <Button size="sm" variant="outline" onClick={() => {
                const eligible = selectedRows.filter(p => p.suggestedPartnerId);
                eligible.forEach(p => openAssign([p]));
                toast({ title: 'Auto assign suggested', description: `${eligible.length} pickups have suggestions` });
              }}><Sparkles className="w-4 h-4" /> Auto Assign</Button>
              <Button size="sm" onClick={() => setTripOpen(true)}><Route className="w-4 h-4" /> Create Trip</Button>
              <Button size="sm" variant="ghost" onClick={() => setSelected([])}>Clear</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* Table */}
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox checked={selected.length === filtered.length && filtered.length > 0} onCheckedChange={toggleAll} />
                  </TableHead>
                  <TableHead>Pickup</TableHead>
                  <TableHead>Customer / Area</TableHead>
                  <TableHead>Slot</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Eligibility</TableHead>
                  <TableHead>Suggested</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Window</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={12} className="text-center py-12 text-muted-foreground">No pickups match your filters.</TableCell></TableRow>
                ) : Object.entries(grouped).map(([group, rows]) => (
                  <>
                    {group && (
                      <TableRow key={`g-${group}`} className="bg-muted/40 hover:bg-muted/40">
                        <TableCell colSpan={12} className="py-2 text-xs font-semibold text-foreground">
                          {groupBy.toUpperCase()}: {group} <span className="text-muted-foreground font-normal">• {rows.length} pickup(s)</span>
                        </TableCell>
                      </TableRow>
                    )}
                    {rows.map(p => {
                      const eligible = isEligible(p);
                      const suggested = partners.find(x => x.id === p.suggestedPartnerId);
                      const assigned = partners.find(x => x.id === p.assignedPartnerId);
                      const fails = failedChecks(p);
                      return (
                        <TableRow key={p.id} className="cursor-pointer" onClick={() => setDetail(p)}>
                          <TableCell onClick={e => e.stopPropagation()}>
                            <Checkbox checked={selected.includes(p.id)} onCheckedChange={() => toggleSelect(p.id)} />
                          </TableCell>
                          <TableCell>
                            <div className="font-semibold text-foreground">{p.id}</div>
                            <div className="text-xs text-muted-foreground">{p.salesOrder} • {p.kitchenRef}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{p.customer}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{p.area}</div>
                          </TableCell>
                          <TableCell className="text-sm">{p.timeSlot}</TableCell>
                          <TableCell className="text-sm">{p.itemsCount}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn('border', p.deliveryType === 'Express' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-slate-50 text-slate-700 border-slate-200')}>
                              {p.deliveryType === 'Express' && <Zap className="w-3 h-3 mr-1" />}{p.deliveryType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {eligible ? (
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Eligible
                              </Badge>
                            ) : (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 cursor-help">
                                    <AlertTriangle className="w-3 h-3 mr-1" /> Action Needed
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <ul className="text-xs list-disc pl-4">{fails.map(f => <li key={f}>{f}</li>)}</ul>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell>
                            {suggested ? (
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                                <Sparkles className="w-3 h-3 mr-1" />{suggested.name.split(' ')[0]}
                              </Badge>
                            ) : <span className="text-xs text-muted-foreground">—</span>}
                          </TableCell>
                          <TableCell className="text-sm">{assigned ? assigned.name : <span className="text-muted-foreground">—</span>}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn('border', statusPill[p.status])}>{p.status}</Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{p.expectedWindow}</TableCell>
                          <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-end gap-1">
                              <Button size="icon" variant="ghost" onClick={() => setDetail(p)}><Eye className="w-4 h-4" /></Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="icon" variant="ghost"><MoreHorizontal className="w-4 h-4" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openAssign([p])}><UserPlus className="w-4 h-4 mr-2" />Assign Partner</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openAssign([p])}><History className="w-4 h-4 mr-2" />Reassign</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => { setSelected([p.id]); setTripOpen(true); }}><Route className="w-4 h-4 mr-2" />Create Trip</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => setDetail(p)}><CheckCircle2 className="w-4 h-4 mr-2" />View Eligibility</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setDetail(p)}><History className="w-4 h-4 mr-2" />View Audit Log</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Side panel */}
        <div className="space-y-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Available Partners</h3>
                <Badge variant="outline" className="text-xs">{partners.filter(p => p.status !== 'offline').length} online</Badge>
              </div>
              <div className="space-y-3">
                {partners.map(p => {
                  const pct = (p.assigned / p.capacity) * 100;
                  const tone = !p.active || p.status === 'offline'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : pct >= 90 ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  return (
                    <div key={p.id} className="p-3 rounded-xl border border-border hover:shadow-sm transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">{p.initials}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-medium text-sm truncate">{p.name}</div>
                            <Badge variant="outline" className={cn('text-[10px] border', tone)}>{p.status}</Badge>
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate">{p.areas.join(', ')} • {p.currentRoute}</div>
                          <div className="mt-2">
                            <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                              <span>{p.assigned}/{p.capacity} assigned</span>
                              {p.expressCapable && <span className="text-primary flex items-center gap-0.5"><Zap className="w-3 h-3" />Express</span>}
                            </div>
                            <Progress value={pct} className="h-1.5" />
                          </div>
                          <div className="flex gap-1 mt-2">
                            <Button size="sm" variant="outline" className="h-7 text-xs flex-1" disabled={selected.length === 0}
                              onClick={() => { openAssign(selectedRows); setSelectedPartner(p.id); }}>
                              Assign Selected
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground text-sm mb-3">Workload Insights</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Express vs Standard</span><span className="font-medium">{counts.express} / {counts.standard}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Pending / Assigned / Delivered</span><span className="font-medium">{counts.pending} / {counts.assigned} / {counts.delivered}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Overloaded partners</span><span className="font-medium">{partners.filter(p => p.assigned / p.capacity >= 0.9).length}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detail drawer */}
      <Sheet open={!!detail} onOpenChange={o => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 flex-wrap">
                  {detail.id}
                  <Badge variant="outline" className={cn('border', statusPill[detail.status])}>{detail.status}</Badge>
                  <Badge variant="outline" className={cn('border', detail.deliveryType === 'Express' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-slate-50 text-slate-700 border-slate-200')}>
                    {detail.deliveryType}
                  </Badge>
                </SheetTitle>
              </SheetHeader>
              <Tabs defaultValue="overview" className="mt-4">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="assignment">Assignment</TabsTrigger>
                  <TabsTrigger value="trip">Trip</TabsTrigger>
                  <TabsTrigger value="audit">Audit</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4 mt-4 text-sm">
                  <div className="p-3 rounded-lg bg-muted/40 space-y-1">
                    <div className="font-medium">{detail.customer}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" />{detail.phone}</div>
                    <div className="text-xs text-muted-foreground flex items-start gap-1"><MapPin className="w-3 h-3 mt-0.5" />{detail.address}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <Row label="Sales Order" value={detail.salesOrder} />
                    <Row label="Delivery Note" value={detail.deliveryNote} />
                    <Row label="Kitchen Ref" value={detail.kitchenRef} />
                    <Row label="Area" value={detail.area} />
                    <Row label="Time Slot" value={detail.timeSlot} />
                    <Row label="Priority" value={detail.priority} />
                    <Row label="Items" value={`${detail.itemsCount} • ${detail.itemsSummary}`} />
                    <Row label="Window" value={detail.expectedWindow} />
                  </div>
                  <div>
                    <div className="font-semibold mb-2 text-sm">Validation Checks</div>
                    <div className="space-y-1.5">
                      {[
                        ['Payment done', detail.paymentDone],
                        ['Stock ready', detail.stockReady],
                        ['Address available', detail.addressAvailable],
                        ['Contact available', detail.contactAvailable],
                        ['Zone serviceable', detail.zoneServiceable],
                      ].map(([l, v]) => (
                        <div key={l as string} className="flex items-center gap-2 text-xs">
                          {v ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-amber-600" />}
                          <span>{l as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="assignment" className="space-y-4 mt-4 text-sm">
                  <div className="text-xs text-muted-foreground">Suggested based on serviceable area, least load, and express capability.</div>
                  <div className="flex gap-2 flex-wrap">
                    {['Closest route match','Least load','In same area', detail.deliveryType === 'Express' ? 'Express eligible' : null].filter(Boolean).map(t => (
                      <Badge key={t as string} variant="outline" className="bg-primary/10 text-primary border-primary/30 text-[10px]">{t as string}</Badge>
                    ))}
                  </div>
                  <Button size="sm" className="w-full" onClick={() => openAssign([detail])}>
                    <UserPlus className="w-4 h-4" /> {detail.assignedPartnerId ? 'Reassign Partner' : 'Assign Delivery Partner'}
                  </Button>
                </TabsContent>
                <TabsContent value="trip" className="space-y-3 mt-4 text-sm">
                  <Row label="Trip ID" value={detail.assignedPartnerId ? `TRIP-${detail.id}` : '—'} />
                  <Row label="Partner" value={partners.find(p => p.id === detail.assignedPartnerId)?.name ?? '—'} />
                  <Row label="Sales Order" value={detail.salesOrder} />
                  <Row label="Delivery Note" value={detail.deliveryNote} />
                  <Row label="Route" value={partners.find(p => p.id === detail.assignedPartnerId)?.currentRoute ?? '—'} />
                </TabsContent>
                <TabsContent value="audit" className="mt-4 space-y-3">
                  {detail.audit.map((a, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-primary shrink-0" />
                      <div className="text-xs flex-1">
                        <div className="font-medium text-foreground">{a.action}</div>
                        <div className="text-muted-foreground">{a.user} • {new Date(a.at).toLocaleString()}</div>
                        {a.remarks && <div className="text-muted-foreground mt-0.5">{a.remarks}</div>}
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Assignment modal */}
      <Dialog open={!!assignFor} onOpenChange={o => !o && setAssignFor(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><UserPlus className="w-5 h-5 text-primary" /> Assign Delivery Partner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <div className="p-3 rounded-lg bg-muted/40 text-xs">
              {assignFor?.length} pickup(s) selected
              <div className="text-muted-foreground mt-1">{assignFor?.map(p => p.id).join(', ')}</div>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Delivery Partner</label>
              <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                <SelectTrigger><SelectValue placeholder="Select partner" /></SelectTrigger>
                <SelectContent>
                  {partners.filter(p => p.active).map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} • {p.assigned}/{p.capacity} • {p.areas.join(', ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Notes</label>
              <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional remarks for the partner..." rows={2} />
            </div>
            <div className="space-y-2 pt-1">
              <div className="text-xs font-medium">Notifications</div>
              {[['email','Send Email'],['sms','Send SMS'],['push','Send Push']].map(([k, l]) => (
                <div key={k} className="flex items-center justify-between text-xs">
                  <span>{l}</span>
                  <Switch checked={notify[k as keyof typeof notify]} onCheckedChange={v => setNotify(n => ({ ...n, [k]: v }))} />
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignFor(null)}>Cancel</Button>
            <Button onClick={confirmAssign}><Send className="w-4 h-4" /> Confirm Assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Trip modal */}
      <Dialog open={tripOpen} onOpenChange={setTripOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Route className="w-5 h-5 text-primary" /> Create Delivery Trip</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="text-xs text-muted-foreground">{selected.length} pickup(s) will be combined into one trip with sequenced stops.</div>
            <div className="p-3 rounded-lg bg-muted/40 space-y-1.5 text-xs max-h-60 overflow-y-auto">
              {selectedRows.map((p, i) => (
                <div key={p.id} className="flex justify-between">
                  <span><span className="font-medium">#{i + 1}</span> {p.id} • {p.customer}</span>
                  <span className="text-muted-foreground">{p.area} • {p.timeSlot}</span>
                </div>
              ))}
            </div>
            <Select value={selectedPartner} onValueChange={setSelectedPartner}>
              <SelectTrigger><SelectValue placeholder="Assign trip to partner" /></SelectTrigger>
              <SelectContent>
                {partners.filter(p => p.active).map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTripOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              if (!selectedPartner) return;
              setAssignFor(selectedRows);
              setTripOpen(false);
            }}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </TooltipProvider>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col">
    <span className="text-[10px] uppercase text-muted-foreground">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default PickupList;
