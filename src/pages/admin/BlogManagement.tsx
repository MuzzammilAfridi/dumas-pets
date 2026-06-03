import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Pencil,
  Trash2,
  Eye,
  Plus,
  Search,
  Star,
  Clock,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";
import {
  BlogCategory,
  Blogger,
  BlogPost,
  ContentType,
} from "@/data/blogData";
import { blogService, slugify, calcReadTime } from "@/lib/erpnext/blog";

import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogCategories,
  getBloggers,
} from "@/services/blogService";



type FormState = Omit<BlogPost, "name"> & { name?: string };

const emptyForm: FormState = {
  title: "",
  blog_intro: "",
  blog_category: "",
  blogger: "",
  published: 0,
  featured: 0,
  published_on: new Date().toISOString().slice(0, 10),
  route: "",
  meta_title: "",
  meta_description: "",
  meta_image: "",
  cover_image: "",
  content_type: "Markdown",
  content: "",
  read_time: 1,
 enable_email_notification: 0,
  disable_comments: 0,
  disable_likes: 0,
  hide_cta: 0,
};

const BlogManagement = () => {
  const { toast } = useToast();

  // Data
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [bloggers, setBloggers] = useState<Blogger[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPublished, setFilterPublished] = useState("all");
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Editor
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const [routeTouched, setRouteTouched] = useState(false);
  const [metaTitleTouched, setMetaTitleTouched] = useState(false);
  const [readTimeTouched, setReadTimeTouched] = useState(false);

  // Preview-only dialog (from row action)
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<BlogPost | null>(null);

  const refresh = async () => {
    setLoading(true);
  const [p, c, b] = await Promise.all([
  getBlogs(),
  getBlogCategories(),
  getBloggers(),
]);

setPosts(p);
setCategories(c);
setBloggers(b);
 
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  // Unsaved changes warning
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // Derived list
  const filtered = useMemo(() => {
    let list = [...posts];
    if (search.trim())
      list = list.filter((p) =>
        p.title.toLowerCase().includes(search.trim().toLowerCase()),
      );
    if (filterCategory !== "all")
      list = list.filter((p) => p.blog_category === filterCategory);
    if (filterPublished !== "all")
      list = list.filter((p) =>
        filterPublished === "published" ? p.published === 1 : p.published === 0,
      );
    list.sort((a, b) =>
      sortDesc
        ? b.published_on.localeCompare(a.published_on)
        : a.published_on.localeCompare(b.published_on),
    );
    return list;
  }, [posts, search, filterCategory, filterPublished, sortDesc]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, filterCategory, filterPublished]);

  // ------- Editor helpers -------
  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setRouteTouched(false);
    setMetaTitleTouched(false);
    setReadTimeTouched(false);
    setDirty(false);
    setEditorOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setForm({ ...post });
    setErrors({});
    setRouteTouched(true);
    setMetaTitleTouched(true);
    setReadTimeTouched(true);
    setDirty(false);
    setEditorOpen(true);
  };

  const closeEditor = (force = false) => {
    if (dirty && !force) {
      if (!window.confirm("You have unsaved changes. Discard them?")) return;
    }
    setEditorOpen(false);
    setDirty(false);
  };

  // Auto fields
  useEffect(() => {
    if (!editorOpen) return;
    if (!routeTouched && form.title) {
      setForm((f) => ({ ...f, route: `blog/${slugify(form.title)}` }));
    }
    if (!metaTitleTouched && form.title) {
      setForm((f) => ({ ...f, meta_title: form.title }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.title, editorOpen]);

  useEffect(() => {
    if (!editorOpen) return;
    if (!readTimeTouched) {
      setForm((f) => ({ ...f, read_time: calcReadTime(form.content || "") }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.content, editorOpen]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.blog_intro.trim()) e.blog_intro = "Intro is required";
    if (!form.blogger) e.blogger = "Blogger is required";
    if (!form.blog_category) e.blog_category = "Category is required";
    if (!form.content.trim()) e.content = "Content is required";
    if (!form.route.trim()) e.route = "Route is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async (asDraft: boolean) => {
    if (!validate()) {
      toast({
        title: "Please fix the errors",
        description: "Some required fields are missing.",
        variant: "destructive",
      });
      return;
    }
    const payload: FormState = {
      ...form,
      published: asDraft ? 0 : 1,
    };
    try {
      if (editing) {
       await updateBlog(editing.name, payload);
        toast({ title: "Blog updated", description: form.title });
      } else {
       await createBlog(payload);
        toast({
          title: asDraft ? "Draft saved" : "Blog published",
          description: form.title,
        });
      }
      setDirty(false);
      setEditorOpen(false);
      await refresh();
    } catch (err) {
      toast({
        title: "Save failed",
        description: String(err),
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
await deleteBlog(confirmDelete.name);
    toast({ title: "Blog deleted", description: confirmDelete.title });
    setConfirmDelete(null);
    await refresh();
  };

  // Lookups for table display
  const categoryTitle = (n: string) =>
    categories.find((c) => c.name === n)?.title ?? n;
  const bloggerName = (n: string) =>
    bloggers.find((b) => b.name === n)?.full_name ?? n;

  // ---------- Render ----------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Blog Management</h2>
          <p className="text-sm text-muted-foreground">
            Create, edit and publish blog posts synced with ERPNext.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" /> Create Blog
        </Button>
      </div>

      {/* KPI cards */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Blogs" value={posts.length} />
        <StatCard
          label="Published"
          value={posts.filter((p) => p.published === 1).length}
        />
        <StatCard
          label="Drafts"
          value={posts.filter((p) => p.published === 0).length}
        />
        <StatCard
          label="Featured"
          value={posts.filter((p) => p.featured === 1).length}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 grid gap-3 md:grid-cols-[1fr_180px_180px_160px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.name} value={c.name}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterPublished} onValueChange={setFilterPublished}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setSortDesc((s) => !s)}
            className="justify-between"
          >
            Date {sortDesc ? "↓" : "↑"}
          </Button>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Cover</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Blogger</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Read</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 9 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : pageRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <ImageIcon className="w-10 h-10 opacity-40" />
                      <p className="font-medium">No blogs found</p>
                      <p className="text-sm">
                        Try clearing filters or create a new blog post.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((post) => (
                  <TableRow key={post.name}>
                    <TableCell>
                      {post.cover_image ? (
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="w-14 h-10 rounded-md object-cover"
                        />
                      ) : (
                        <div className="w-14 h-10 rounded-md bg-muted flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium max-w-[260px] truncate">
                      {post.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {categoryTitle(post.blog_category)}
                      </Badge>
                    </TableCell>
                    <TableCell>{bloggerName(post.blogger)}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {post.published_on}
                    </TableCell>
                    <TableCell className="text-sm">
                      {post.read_time ?? 1} min
                    </TableCell>
                    <TableCell>
                      {post.featured === 1 ? (
                        <Star className="w-4 h-4 text-primary fill-primary" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={post.published === 1 ? "default" : "outline"}
                      >
                        {post.published === 1 ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setPreviewPost(post)}
                          aria-label="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openEdit(post)}
                          aria-label="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setConfirmDelete(post)}
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {!loading && filtered.length > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Showing {(page - 1) * pageSize + 1}–
            {Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="px-3 py-1.5 rounded-md bg-muted">
              {page} / {pageCount}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === pageCount}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Editor Dialog */}
      <Dialog
        open={editorOpen}
        onOpenChange={(o) => (o ? setEditorOpen(true) : closeEditor())}
      >
        <DialogContent className="max-w-[1200px] w-[95vw] h-[92vh] p-0 flex flex-col">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>
              {editing ? "Edit Blog" : "Create Blog"}
              {dirty && (
                <span className="ml-2 text-xs text-primary">• unsaved</span>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="grid md:grid-cols-2 flex-1 overflow-hidden">
            {/* Form */}
            <div className="overflow-y-auto p-6 space-y-6 border-r">
              <Section title="Basic Information">
                <Field label="Blog Title" error={errors.title} required>
                  <Input
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                  />
                </Field>
                <Field label="Blog Intro" error={errors.blog_intro} required>
                  <Textarea
                    rows={2}
                    value={form.blog_intro}
                    onChange={(e) => update("blog_intro", e.target.value)}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="Category"
                    error={errors.blog_category}
                    required
                  >
                    <Select
                      value={form.blog_category}
                      onValueChange={(v) => update("blog_category", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.name} value={c.name}>
                            {c.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Blogger" error={errors.blogger} required>
                    <Select
                      value={form.blogger}
                      onValueChange={(v) => update("blogger", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blogger" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloggers.map((b) => (
                          <SelectItem key={b.name} value={b.name}>
                            {b.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </Section>

              <Section title="Publishing">
                <div className="grid grid-cols-2 gap-3">
                  <ToggleRow
                    label="Published"
                    checked={form.published === 1}
                    onChange={(v) => update("published", v ? 1 : 0)}
                  />
                  <ToggleRow
                    label="Featured"
                    checked={form.featured === 1}
                    onChange={(v) => update("featured", v ? 1 : 0)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Published Date">
                    <Input
                      type="date"
                      value={form.published_on}
                      onChange={(e) => update("published_on", e.target.value)}
                    />
                  </Field>
                  <Field label="Route / Slug" error={errors.route} required>
                    <Input
                      value={form.route}
                      onChange={(e) => {
                        setRouteTouched(true);
                        update("route", e.target.value);
                      }}
                    />
                  </Field>
                </div>
              </Section>

              <Section title="SEO Information">
                <Field label="Meta Title">
                  <Input
                    value={form.meta_title}
                    onChange={(e) => {
                      setMetaTitleTouched(true);
                      update("meta_title", e.target.value);
                    }}
                  />
                </Field>
                <Field label="Meta Description">
                  <Textarea
                    rows={2}
                    value={form.meta_description}
                    onChange={(e) =>
                      update("meta_description", e.target.value)
                    }
                  />
                </Field>
                <Field label="Meta Image URL">
                  <Input
                    value={form.meta_image}
                    onChange={(e) => update("meta_image", e.target.value)}
                  />
                </Field>
              </Section>

              <Section title="Cover Image">
                <Field label="Cover Image URL">
                  <Input
                    value={form.cover_image}
                    onChange={(e) => update("cover_image", e.target.value)}
                    placeholder="https://..."
                  />
                </Field>
                {form.cover_image && (
                  <div className="rounded-lg border overflow-hidden">
                    <img
                      src={form.cover_image}
                      alt="cover preview"
                      className="w-full h-40 object-cover"
                    />
                  </div>
                )}
              </Section>

              <Section title="Content">
                <Field label="Content Type">
                  <Select
                    value={form.content_type}
                    onValueChange={(v) =>
                      update("content_type", v as ContentType)
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Markdown">Markdown</SelectItem>
                      <SelectItem value="HTML">HTML</SelectItem>
                      <SelectItem value="Rich Text">Rich Text</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Content" error={errors.content} required>
                  <Textarea
                    rows={12}
                    className="font-mono text-sm"
                    value={form.content}
                    onChange={(e) => update("content", e.target.value)}
                  />
                </Field>
              </Section>

              <Section title="Additional Settings">
                <Field label="Read Time (minutes)">
                  <Input
                    type="number"
                    min={1}
                    className="w-32"
                    value={form.read_time}
                    onChange={(e) => {
                      setReadTimeTouched(true);
                      update("read_time", Number(e.target.value));
                    }}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <ToggleRow
                    label="Email Notification"
                    checked={form.enable_email_notification === 1}
                    onChange={(v) =>
                      update("enable_email_notification", v ? 1 : 0)
                    }
                  />
                  <ToggleRow
                    label="Disable Comments"
                    checked={form.disable_comments === 1}
                    onChange={(v) => update("disable_comments", v ? 1 : 0)}
                  />
                  <ToggleRow
                    label="Disable Likes"
                    checked={form.disable_likes === 1}
                    onChange={(v) => update("disable_likes", v ? 1 : 0)}
                  />
                  <ToggleRow
                    label="Hide CTA"
                    checked={form.hide_cta === 1}
                    onChange={(v) => update("hide_cta", v ? 1 : 0)}
                  />
                </div>
              </Section>
            </div>

            {/* Live Preview */}
            <div className="overflow-y-auto bg-muted/30">
              <BlogPreview
                form={form}
                bloggerName={bloggerName(form.blogger)}
                categoryTitle={
                  form.blog_category
                    ? categoryTitle(form.blog_category)
                    : "Uncategorized"
                }
              />
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t flex-row justify-between sm:justify-between bg-card">
            <Button variant="ghost" onClick={() => closeEditor()}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => save(true)}>
                Save Draft
              </Button>
              <Button onClick={() => save(false)}>
                {editing ? "Update & Publish" : "Publish Now"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview-only dialog */}
      <Dialog
        open={!!previewPost}
        onOpenChange={(o) => !o && setPreviewPost(null)}
      >
        <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto p-0">
          {previewPost && (
            <BlogPreview
              form={previewPost}
              bloggerName={bloggerName(previewPost.blogger)}
              categoryTitle={categoryTitle(previewPost.blog_category)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this blog?</AlertDialogTitle>
            <AlertDialogDescription>
              “{confirmDelete?.title}” will be permanently removed. This cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// ---------- helper sub-components ----------

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <Card>
    <CardContent className="p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </CardContent>
  </Card>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-3">
    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
      {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const Field = ({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label className="text-sm">
      {label}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </Label>
    {children}
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);

const ToggleRow = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between rounded-lg border p-3">
    <Label className="text-sm">{label}</Label>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

// Minimal, safe markdown -> HTML (headings, bold, italic, lists, paragraphs).
const renderMarkdown = (md: string) => {
  const esc = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  const lines = esc(md).split("\n");
  const out: string[] = [];
  let inList = false;
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^###\s+/.test(line)) {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push(`<h3>${line.replace(/^###\s+/, "")}</h3>`);
    } else if (/^##\s+/.test(line)) {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push(`<h2>${line.replace(/^##\s+/, "")}</h2>`);
    } else if (/^#\s+/.test(line)) {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push(`<h1>${line.replace(/^#\s+/, "")}</h1>`);
    } else if (/^[-*]\s+/.test(line)) {
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${line.replace(/^[-*]\s+/, "")}</li>`);
    } else if (line === "") {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push("");
    } else {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push(`<p>${line}</p>`);
    }
  }
  if (inList) out.push("</ul>");
  return out
    .join("\n")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
};

const BlogPreview = ({
  form,
  bloggerName,
  categoryTitle,
}: {
  form: FormState | BlogPost;
  bloggerName: string;
  categoryTitle: string;
}) => {
  const html =
    form.content_type === "Markdown"
      ? renderMarkdown(form.content || "")
      : form.content || "";

  return (
    <article className="bg-background">
      {/* Hero */}
      <div className="relative w-full h-56 bg-muted">
        {form.cover_image ? (
          <img
            src={form.cover_image}
            alt={form.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ImageIcon className="w-10 h-10 opacity-40" />
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <Badge variant="secondary">{categoryTitle}</Badge>
        <h1 className="text-3xl font-bold leading-tight text-foreground">
          {form.title || "Untitled blog post"}
        </h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {bloggerName || "Unknown author"}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {form.published_on}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {form.read_time ?? 1} min
          </span>
        </div>
        {form.blog_intro && (
          <p className="text-lg text-muted-foreground leading-relaxed">
            {form.blog_intro}
          </p>
        )}
        <div
          className="prose prose-sm max-w-none text-foreground [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-1"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* SEO Preview Card */}
        <div className="mt-6 border rounded-lg p-4 bg-muted/40">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
            SEO Preview
          </p>
          <p className="text-primary text-base truncate">
            {form.meta_title || form.title || "Page title"}
          </p>
          <p className="text-green-700 dark:text-green-500 text-xs truncate">
            yourdomain.com/{form.route || "blog/your-post"}
          </p>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {form.meta_description ||
              form.blog_intro ||
              "Add a meta description to improve search ranking."}
          </p>
        </div>
      </div>
    </article>
  );
};

export default BlogManagement;
