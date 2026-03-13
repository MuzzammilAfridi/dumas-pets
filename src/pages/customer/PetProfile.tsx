import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, PawPrint } from 'lucide-react';
import { mockPets, Pet } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const PetProfile = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>(mockPets.filter(p => p.customerId === user?.id));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editPet, setEditPet] = useState<Pet | null>(null);
  const [form, setForm] = useState({ name: '', type: 'Dog', breed: '', age: '', weight: '', medicalNotes: '' });
  const { toast } = useToast();

  const openAdd = () => {
    setEditPet(null);
    setForm({ name: '', type: 'Dog', breed: '', age: '', weight: '', medicalNotes: '' });
    setDialogOpen(true);
  };

  const openEdit = (pet: Pet) => {
    setEditPet(pet);
    setForm({ name: pet.name, type: pet.type, breed: pet.breed, age: String(pet.age), weight: String(pet.weight), medicalNotes: pet.medicalNotes });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast({ title: 'Error', description: 'Pet name is required.', variant: 'destructive' }); return; }
    if (editPet) {
      setPets(prev => prev.map(p => p.id === editPet.id ? { ...p, name: form.name, type: form.type, breed: form.breed, age: Number(form.age), weight: Number(form.weight), medicalNotes: form.medicalNotes } : p));
      toast({ title: 'Updated', description: 'Pet profile updated.' });
    } else {
      setPets(prev => [...prev, { id: `p${Date.now()}`, customerId: user?.id || '', name: form.name, type: form.type, breed: form.breed, age: Number(form.age), weight: Number(form.weight), medicalNotes: form.medicalNotes, image: '' }]);
      toast({ title: 'Added', description: 'Pet added successfully.' });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setPets(prev => prev.filter(p => p.id !== id));
    toast({ title: 'Removed', description: 'Pet removed.' });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">My Pets</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button onClick={openAdd}><Plus className="w-4 h-4 mr-1" /> Add Pet</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editPet ? 'Edit Pet' : 'Add Pet'}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2"><Label>Pet Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Type</Label><Input value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} placeholder="Dog, Cat..." /></div>
                <div className="space-y-2"><Label>Breed</Label><Input value={form.breed} onChange={e => setForm({ ...form, breed: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Age (years)</Label><Input type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} /></div>
                <div className="space-y-2"><Label>Weight (kg)</Label><Input type="number" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label>Medical Notes</Label><Textarea value={form.medicalNotes} onChange={e => setForm({ ...form, medicalNotes: e.target.value })} rows={3} /></div>
              <Button onClick={handleSave} className="w-full">{editPet ? 'Update Pet' : 'Add Pet'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {pets.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">
          <PawPrint className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p>No pets added yet.</p>
        </CardContent></Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {pets.map(pet => (
            <Card key={pet.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <PawPrint className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{pet.name}</p>
                      <p className="text-sm text-muted-foreground">{pet.type} • {pet.breed}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(pet)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(pet.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <p><span className="text-muted-foreground">Age:</span> {pet.age} years</p>
                  <p><span className="text-muted-foreground">Weight:</span> {pet.weight} kg</p>
                </div>
                {pet.medicalNotes && pet.medicalNotes !== 'None' && (
                  <p className="mt-2 text-xs text-muted-foreground bg-muted rounded-lg p-2">📋 {pet.medicalNotes}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PetProfile;
