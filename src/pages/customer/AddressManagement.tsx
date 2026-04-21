import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import { mockAddresses, Address } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createAddress, getAddresses, deleteAddress } from "@/services/addressService";

const AddressManagement = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editAddr, setEditAddr] = useState<Address | null>(null);
  const [form, setForm] = useState({ label: '', street: '', city: '', state: '', zip: '', isDefault: false });
  const { toast } = useToast();

  const openAdd = () => {
    setEditAddr(null);
    setForm({ label: '', street: '', city: '', state: '', zip: '', isDefault: false });
    setDialogOpen(true);
  };

  const openEdit = (a: Address) => {
    setEditAddr(a);
    setForm({ label: a.label, street: a.street, city: a.city, state: a.state, zip: a.zip, isDefault: a.isDefault });
    setDialogOpen(true);
  };



const handleSave = async () => {
  if (!form.street.trim() || !form.city.trim()) {
    toast({ title: "Error", description: "Street and city are required.", variant: "destructive" });
    return;
  }

  console.log("user", user);
  

  try {
  const payload = {
  address_title: "John Doe",
  address_type: "Shipping", 
  address_line1: "Street 1",
  city: "Kozhikode",
  state: "Kerala",
  country: "India",
  pincode: "673001",
  links: [
    {
      link_doctype: "Customer",
      link_name: "John Doe", 
    },
  ],
};

    console.log("payload of Address", payload);
    
    await createAddress(payload);

    toast({ title: "Success", description: "Address saved!" });

    setDialogOpen(false);

    // 🔥 Reload addresses
    window.location.reload();

  } catch (err) {
    console.error(err);
    toast({ title: "Error", description: "Failed to save address", variant: "destructive" });
  }
};


const handleDelete = async (id) => {
  try {
    await deleteAddress(id);

    setAddresses(prev => prev.filter(a => a.id !== id));

    toast({ title: "Removed", description: "Address removed." });
  } catch (err) {
    console.error(err);
  }
};

  const setDefault = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    toast({ title: 'Updated', description: 'Default address changed.' });
  };




useEffect(() => {
  if (!user?.name) return;

const fetchAddresses = async () => {
  const res = await getAddresses("John Doe");

  const mapped = res.data.data.map((a) => ({
    id: a.name,
    label: a.address_title,
    street: a.address_line1,
    city: a.city,
    state: a.state,
    zip: a.pincode,
    isDefault: false,
  }));

  setAddresses(mapped);
};

  fetchAddresses();
}, [user]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">My Addresses</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button onClick={openAdd}><Plus className="w-4 h-4 mr-1" /> Add Address</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editAddr ? 'Edit Address' : 'Add Address'}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2"><Label>Label</Label><Input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="Home, Work..." /></div>
              <div className="space-y-2"><Label>Street</Label><Input value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} /></div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2"><Label>City</Label><Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></div>
                <div className="space-y-2"><Label>State</Label><Input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} /></div>
                <div className="space-y-2"><Label>ZIP</Label><Input value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} /></div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="default" checked={form.isDefault} onCheckedChange={v => setForm({ ...form, isDefault: !!v })} />
                <Label htmlFor="default" className="text-sm">Set as default address</Label>
              </div>
              <Button onClick={handleSave} className="w-full">{editAddr ? 'Update' : 'Add Address'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">
          <MapPin className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p>No addresses saved.</p>
        </CardContent></Card>
      ) : addresses.map(addr => (
        <Card key={addr.id} className={addr.isDefault ? 'border-primary' : ''}>
          <CardContent className="p-4 flex justify-between items-start">
            <div className="flex gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><MapPin className="w-4 h-4 text-primary" /></div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground text-sm">{addr.label || 'Address'}</p>
                  {addr.isDefault && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Default</span>}
                </div>
                <p className="text-sm text-muted-foreground">{addr.street}, {addr.city}, {addr.state} {addr.zip}</p>
              </div>
            </div>
            <div className="flex gap-1">
              {!addr.isDefault && <Button variant="ghost" size="sm" className="text-xs" onClick={() => setDefault(addr.id)}>Set Default</Button>}
              <Button variant="ghost" size="icon" onClick={() => openEdit(addr)}><Pencil className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(addr.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AddressManagement;
