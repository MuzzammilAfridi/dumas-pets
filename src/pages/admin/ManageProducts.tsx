import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import {
  products as initialProducts,
  Product,
  ProductCategory,
} from "@/data/products";
import { useToast } from "@/hooks/use-toast";

import { useProducts } from "@/hooks/useProducts";

import { disableItem } from "@/services/productService";

const ManageProducts = () => {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "PET FOOD" as ProductCategory,
    price: "",
    stock: "10",
    description: "",
    status: "Active",
  });
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);

const itemsPerPage = 10;

  const { products } = useProducts();

  // useEffect(() => {
  //   console.log("Updated products:", products);
  // }, [products]);

  // console.log("products in Manage products", products);

const filtered = products.filter((p: any) =>
  p.item_name
    ?.toLowerCase()
    .includes(search.toLowerCase())
);

const totalPages = Math.ceil(filtered.length / itemsPerPage);

const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;

const paginatedProducts = filtered.slice(startIndex, endIndex);

  const openAdd = () => {
    setEditProduct(null);
    setForm({
      name: "",
      category: "PET FOOD",
      price: "",
      stock: "10",
      description: "",
      status: "Active",
    });
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      stock: "10",
      description: p.description,
      status: "Active",
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.price.trim()) {
      toast({
        title: "Error",
        description: "Name and price are required.",
        variant: "destructive",
      });
      return;
    }
    if (editProduct) {
      setProductList((prev) =>
        prev.map((p) =>
          p.id === editProduct.id
            ? {
                ...p,
                name: form.name,
                category: form.category,
                price: parseFloat(form.price),
                description: form.description,
              }
            : p,
        ),
      );
      toast({ title: "Updated", description: "Product updated successfully." });
    } else {
      const newP: Product = {
        id: `p${Date.now()}`,
        name: form.name,
        category: form.category,
        price: parseFloat(form.price),
        image: "",
        description: form.description,
      };
      setProductList((prev) => [newP, ...prev]);
      toast({ title: "Added", description: "Product added successfully." });
    }
    setDialogOpen(false);
  };

const handleDelete = async (id: string) => {
  try {
    const confirmDisable = window.confirm(
      "Are you sure you want to disable this product?"
    );

    if (!confirmDisable) return;

    await disableItem(id);

    toast({
      title: "Disabled",
      description: "Product disabled successfully",
    });

    // refresh ERP data
    window.location.reload();

  } catch (err: any) {
    console.error(err);

    toast({
      title: "Action Failed",
      description:
        err?.response?.data?.exception ||
        err?.response?.data?.message ||
        "Unable to disable product",
      variant: "destructive",
    });
  }
};

  // if (loading) return <p>Loading products...</p>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search products..."
            value={search}
           onChange={(e) => {
  setSearch(e.target.value);
  setCurrentPage(1);
}}
          />
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}>
              <Plus className="w-4 h-4 mr-1" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editProduct ? "Edit Product" : "Add Product"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) =>
                      setForm({ ...form, category: v as ProductCategory })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PET FOOD">Pet Food</SelectItem>
                      <SelectItem value="TREATS">Treats</SelectItem>
                      <SelectItem value="CAKES">Cakes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Price ($)</Label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => setForm({ ...form, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                {editProduct ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProducts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.item_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src="https://img.freepik.com/free-vector/dog-food-snack-cartoon-vector-icon-illustration-animal-food-icon-concept-isolated-premium-vector_138676-4751.jpg"
                            alt="Placeholder"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="font-medium  truncate max-w-36 ">
                      {p.item_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{p.item_group}</Badge>
                    </TableCell>
                    <TableCell>₹{p.standard_rate?.toFixed(2)}</TableCell>
                    <TableCell>10</TableCell>
                    <TableCell>
                      <Badge>Active</Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    <Button
  variant="ghost"
  size="icon"
  onClick={() => handleDelete(p.item_code)}
>
  <Trash2 className="w-4 h-4 text-destructive" />
</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
     <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
  <p className="text-sm text-muted-foreground">
   Showing{" "}
{filtered.length === 0 ? 0 : startIndex + 1}-
{Math.min(endIndex, filtered.length)} of {filtered.length} products
  </p>

  <div className="flex items-center gap-2">
    <Button
      variant="outline"
      size="sm"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((prev) => prev - 1)}
    >
      Previous
    </Button>

    <div className="flex items-center gap-1 flex-wrap justify-center">
      {Array.from({ length: totalPages }, (_, i) => (
        <Button
          key={i + 1}
          size="sm"
          variant={currentPage === i + 1 ? "default" : "outline"}
          onClick={() => setCurrentPage(i + 1)}
        >
          {i + 1}
        </Button>
      ))}
    </div>

    <Button
      variant="outline"
      size="sm"
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((prev) => prev + 1)}
    >
      Next
    </Button>
  </div>
</div>
    </div>
  );
};

export default ManageProducts;
