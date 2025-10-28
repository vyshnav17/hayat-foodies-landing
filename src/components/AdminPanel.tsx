import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Eye, Download, LogOut, CheckCircle, Plus, Edit, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import chapatiImg from "@/assets/chapati.jpg";
import creamBunImg from "@/assets/cream-bun.jpg";
import chocolateBunImg from "@/assets/chocolate-bun.jpg";
import breadImg from "@/assets/bread.jpg";
import ruskImg from "@/assets/rusk.jpg";
import babyChocolateBunImg from "@/assets/baby-chocolate-bun.jpg";

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  timestamp: string;
  resolved?: boolean;
  resolvedAt?: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  images: string[]; // base64 encoded images
  ingredients: string[];
  calories: number;
  price: number;
  gst: number;
}

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel = ({ onLogout }: AdminPanelProps) => {
  const [activeSubmissions, setActiveSubmissions] = useState<ContactSubmission[]>([]);
  const [resolvedSubmissions, setResolvedSubmissions] = useState<ContactSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    images: [] as File[],
    ingredients: '',
    calories: '',
    price: '',
    gst: ''
  });

  const defaultProducts = [
    {
      id: "1",
      name: "Chapati",
      description: "Soft, fresh chapati made daily with premium ingredients",
      images: [chapatiImg, breadImg, ruskImg],
      ingredients: ["Whole wheat flour", "Water", "Salt", "Oil"],
      calories: 150,
      price: 20,
      gst: 2,
    },
    {
      id: "2",
      name: "Cream Bun",
      description: "Delicious cream-filled buns with smooth vanilla cream",
      images: [creamBunImg, chocolateBunImg, babyChocolateBunImg],
      ingredients: ["Flour", "Cream", "Sugar", "Yeast", "Vanilla"],
      calories: 250,
      price: 30,
      gst: 3,
    },
    {
      id: "3",
      name: "Normal Buns",
      description: "Freshly baked, delightfully soft—your perfect companion for any meal",
      images: [chocolateBunImg, creamBunImg, babyChocolateBunImg],
      ingredients: ["Flour", "Sugar", "Yeast", "Milk", "Butter"],
      calories: 200,
      price: 25,
      gst: 2.5,
    },
    {
      id: "4",
      name: "Baby Chocolate Bun",
      description: "Soft, rich, and perfectly sized for a satisfying chocolate treat.",
      images: [babyChocolateBunImg, chocolateBunImg, creamBunImg],
      ingredients: ["Flour", "Chocolate", "Sugar", "Yeast", "Butter"],
      calories: 180,
      price: 15,
      gst: 1.5,
    },
    {
      id: "5",
      name: "Bread",
      description: "Fresh, soft bread baked to perfection every day",
      images: [breadImg, chapatiImg, ruskImg],
      ingredients: ["Flour", "Water", "Yeast", "Salt", "Sugar"],
      calories: 120,
      price: 40,
      gst: 4,
    },
    {
      id: "6",
      name: "Rusk",
      description: "Crispy, golden rusk perfect for tea time",
      images: [ruskImg, breadImg, chapatiImg],
      ingredients: ["Flour", "Sugar", "Butter", "Eggs", "Yeast"],
      calories: 100,
      price: 35,
      gst: 3.5,
    },
  ];

  useEffect(() => {
    // Load submissions from API
    fetchContactSubmissions();

    // Load products from API, fallback to defaultProducts
    fetchProducts();
  }, []);

  const fetchContactSubmissions = async () => {
    try {
      const response = await fetch('/api/contact');
      if (response.ok) {
        const submissions = await response.json();
        const active = submissions.filter((sub: ContactSubmission) => !sub.resolved);
        const resolved = submissions.filter((sub: ContactSubmission) => sub.resolved);
        setActiveSubmissions(active);
        setResolvedSubmissions(resolved);
      } else {
        console.error('Failed to fetch contact submissions');
      }
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const products = await response.json();
        if (products.length > 0) {
          setProducts(products);
        } else {
          // Initialize with default products if database is empty
          setProducts(defaultProducts);
          // Save default products to database
          await Promise.all(defaultProducts.map(product =>
            fetch('/api/products', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(product)
            })
          ));
        }
      } else {
        console.error('Failed to fetch products');
        // Fallback to default products
        setProducts(defaultProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to default products
      setProducts(defaultProducts);
    }
  };

  const resolveSubmission = async (id: number) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, resolved: true, resolvedAt: new Date().toISOString() })
      });

      if (response.ok) {
        // Update local state
        const submission = activeSubmissions.find(sub => sub.id === id);
        if (submission) {
          const resolvedSubmission = {
            ...submission,
            resolved: true,
            resolvedAt: new Date().toISOString()
          };

          const updatedActive = activeSubmissions.filter(sub => sub.id !== id);
          const updatedResolved = [...resolvedSubmissions, resolvedSubmission];

          setActiveSubmissions(updatedActive);
          setResolvedSubmissions(updatedResolved);
        }
      } else {
        console.error('Failed to resolve submission');
      }
    } catch (error) {
      console.error('Error resolving submission:', error);
    }
  };

  const deleteSubmission = async (id: number, isResolved: boolean = false) => {
    try {
      const response = await fetch(`/api/contact?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Update local state
        if (isResolved) {
          const updatedResolved = resolvedSubmissions.filter(sub => sub.id !== id);
          setResolvedSubmissions(updatedResolved);
        } else {
          const updatedActive = activeSubmissions.filter(sub => sub.id !== id);
          setActiveSubmissions(updatedActive);
        }
      } else {
        console.error('Failed to delete submission');
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  };

  const exportToCSV = () => {
    const allSubmissions = [...activeSubmissions, ...resolvedSubmissions];
    const csvContent = [
      ['ID', 'Name', 'Email', 'Phone', 'Message', 'Timestamp', 'Status', 'Resolved At'],
      ...allSubmissions.map(sub => [
        sub.id,
        sub.name,
        sub.email,
        sub.phone,
        `"${sub.message.replace(/"/g, '""')}"`, // Escape quotes in message
        sub.timestamp,
        sub.resolved ? 'Resolved' : 'Active',
        sub.resolvedAt || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `contact-submissions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleProductSubmit = async () => {
    // Form validation
    if (!productForm.name.trim()) {
      alert('Product name is required');
      return;
    }
    if (!productForm.description.trim()) {
      alert('Product description is required');
      return;
    }
    if (!productForm.price.trim() || isNaN(parseFloat(productForm.price))) {
      alert('Valid price is required');
      return;
    }
    if (!productForm.gst.trim() || isNaN(parseFloat(productForm.gst))) {
      alert('Valid GST percentage is required');
      return;
    }
    if (!productForm.calories.trim() || isNaN(parseInt(productForm.calories))) {
      alert('Valid calories is required');
      return;
    }
    if (!productForm.ingredients.trim()) {
      alert('Ingredients are required');
      return;
    }

    try {
      let imageUrls: string[] = [];

      if (productForm.images.length > 0) {
        // Validate files before processing
        for (const file of productForm.images) {
          const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
          if (!allowedTypes.includes(file.type)) {
            alert(`File "${file.name}" is not a supported image format. Please select JPG, PNG, GIF, or WebP files only.`);
            return;
          }
          if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert(`File "${file.name}" is too large (${(file.size / (1024 * 1024)).toFixed(2)}MB). Maximum size is 5MB.`);
            return;
          }
        }

        const imagePromises = productForm.images.map(file => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (e) => {
              console.error('FileReader error for file:', file.name, e);
              reject(new Error(`Unable to process the image file "${file.name}". Please ensure the file is a valid JPG/PNG/GIF image, not corrupted, and try again.`));
            };
            reader.readAsDataURL(file);
          });
        });

        imageUrls = await Promise.all(imagePromises);
      }

      const productData = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        images: imageUrls,
        ingredients: productForm.ingredients.split(',').map(ing => ing.trim()).filter(ing => ing),
        calories: parseInt(productForm.calories),
        price: parseFloat(productForm.price),
        gst: parseFloat(productForm.gst)
      };

      let response;
      let successMessage;

      if (editingProduct) {
        // Update existing product - include the id for update
        const updateData = { ...productData, id: editingProduct.id };
        response = await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });
        successMessage = 'Product updated successfully!';
      } else {
        // Add new product
        response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
        successMessage = 'Product added successfully!';
      }

      if (response.ok) {
        const result = await response.json();
        console.log('API Response:', result);

        // Refresh products from API
        await fetchProducts();

        // Reset form
        setProductForm({
          name: '',
          description: '',
          images: [],
          ingredients: '',
          calories: '',
          price: '',
          gst: ''
        });
        setEditingProduct(null);
        setIsProductDialogOpen(false);

        alert(successMessage);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error:', errorData);
        alert(`Failed to ${editingProduct ? 'update' : 'add'} product: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting product:', error);
      alert(`Failed to ${editingProduct ? 'update' : 'add'} product: ${error instanceof Error ? error.message : 'Network error'}`);
    }
  };

  const editProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      images: [],
      ingredients: product.ingredients.join(', '),
      calories: product.calories.toString(),
      price: product.price.toString(),
      gst: product.gst.toString()
    });
    setIsProductDialogOpen(true);
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const updatedProducts = products.filter(p => p.id !== id);
        setProducts(updatedProducts);
      } else {
        console.error('Failed to delete product');
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Admin Panel</h1>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button onClick={onLogout} variant="outline" className="flex items-center justify-center gap-2 text-sm">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="contact" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 h-auto p-1">
            <TabsTrigger value="contact" className="text-xs sm:text-sm py-2">Contact Submissions</TabsTrigger>
            <TabsTrigger value="products" className="text-xs sm:text-sm py-2">Product Management ({products.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="contact" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl md:text-2xl font-bold">Contact Submissions</h2>
              <Button onClick={exportToCSV} className="flex items-center justify-center gap-2 text-sm">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
              {/* Active Submissions List */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">Active Submissions ({activeSubmissions.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {activeSubmissions.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No active submissions
                      </p>
                    ) : (
                      activeSubmissions.map((submission) => (
                        <div
                          key={submission.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border rounded-lg hover:bg-muted/50 cursor-pointer gap-2"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                              <h3 className="font-semibold text-sm md:text-base truncate">{submission.name}</h3>
                              <Badge variant="secondary" className="text-xs w-fit">
                                {new Date(submission.timestamp).toLocaleDateString()}
                              </Badge>
                            </div>
                            <p className="text-xs md:text-sm text-muted-foreground truncate">{submission.email}</p>
                            <p className="text-xs md:text-sm text-muted-foreground truncate max-w-full sm:max-w-xs">
                              {submission.message.substring(0, 50)}...
                            </p>
                          </div>
                          <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSubmission(submission);
                              }}
                            >
                              <Eye className="w-3 h-3 md:w-4 md:h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-700 h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                resolveSubmission(submission.id);
                              }}
                            >
                              <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSubmission(submission.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Resolved Submissions List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">Resolved Submissions ({resolvedSubmissions.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {resolvedSubmissions.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No resolved submissions
                      </p>
                    ) : (
                      resolvedSubmissions.map((submission) => (
                        <div
                          key={submission.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border rounded-lg hover:bg-muted/50 cursor-pointer bg-green-50 border-green-200 gap-2"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                              <h3 className="font-semibold text-sm md:text-base truncate">{submission.name}</h3>
                              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs w-fit">
                                Resolved
                              </Badge>
                            </div>
                            <p className="text-xs md:text-sm text-muted-foreground truncate">{submission.email}</p>
                            <p className="text-xs md:text-sm text-muted-foreground truncate max-w-full sm:max-w-xs">
                              {submission.message.substring(0, 50)}...
                            </p>
                          </div>
                          <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSubmission(submission);
                              }}
                            >
                              <Eye className="w-3 h-3 md:w-4 md:h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSubmission(submission.id, true);
                              }}
                            >
                              <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Submission Details */}
              <div>
                {selectedSubmission ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg md:text-xl">Submission Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 md:space-y-4">
                      <div>
                        <label className="text-xs md:text-sm font-medium text-muted-foreground">Name</label>
                        <p className="text-sm md:text-lg break-words">{selectedSubmission.name}</p>
                      </div>
                      <div>
                        <label className="text-xs md:text-sm font-medium text-muted-foreground">Email</label>
                        <p className="text-sm md:text-lg break-words">{selectedSubmission.email}</p>
                      </div>
                      <div>
                        <label className="text-xs md:text-sm font-medium text-muted-foreground">Phone</label>
                        <p className="text-sm md:text-lg break-words">{selectedSubmission.phone}</p>
                      </div>
                      <div>
                        <label className="text-xs md:text-sm font-medium text-muted-foreground">Message</label>
                        <p className="text-sm md:text-lg whitespace-pre-wrap break-words">{selectedSubmission.message}</p>
                      </div>
                      <div>
                        <label className="text-xs md:text-sm font-medium text-muted-foreground">Submitted At</label>
                        <p className="text-sm md:text-lg break-words">
                          {new Date(selectedSubmission.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {selectedSubmission.resolved && (
                        <div>
                          <label className="text-xs md:text-sm font-medium text-muted-foreground">Resolved At</label>
                          <p className="text-sm md:text-lg break-words">
                            {new Date(selectedSubmission.resolvedAt!).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center h-48 md:h-64">
                      <p className="text-muted-foreground text-center text-sm md:text-base">Select a submission to view details</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl md:text-2xl font-bold">Product Management</h2>
              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setIsProductDialogOpen(true)} className="flex items-center gap-2 w-full sm:w-auto">
                    <Plus className="w-4 h-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto p-4 md:p-6">
                  <DialogHeader>
                    <DialogTitle className="text-lg md:text-xl">{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        placeholder="Product name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="calories">Calories</Label>
                      <Input
                        id="calories"
                        type="number"
                        value={productForm.calories}
                        onChange={(e) => setProductForm({ ...productForm, calories: e.target.value })}
                        placeholder="Calories"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        placeholder="Product description"
                        className="min-h-[80px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        placeholder="Price"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gst">GST (%)</Label>
                      <Input
                        id="gst"
                        type="number"
                        step="0.01"
                        value={productForm.gst}
                        onChange={(e) => setProductForm({ ...productForm, gst: e.target.value })}
                        placeholder="GST percentage"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="images">Images</Label>
                      <Input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          setProductForm({ ...productForm, images: files });
                        }}
                        placeholder="Select images"
                      />
                      {productForm.images.length > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {productForm.images.length} file(s) selected
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
                      <Input
                        id="ingredients"
                        value={productForm.ingredients}
                        onChange={(e) => setProductForm({ ...productForm, ingredients: e.target.value })}
                        placeholder="Ingredient 1, Ingredient 2, Ingredient 3"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setIsProductDialogOpen(false)} className="w-full sm:w-auto">
                      Cancel
                    </Button>
                    <Button onClick={handleProductSubmit} className="flex items-center justify-center gap-2 w-full sm:w-auto">
                      <Save className="w-4 h-4" />
                      {editingProduct ? 'Update' : 'Add'} Product
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
              {/* Products List */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Products</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {products.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No products available
                      </p>
                    ) : (
                      products.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{product.name}</h3>
                              <Badge variant="secondary">
                                ₹{product.price}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground truncate max-w-xs">
                              {product.description.substring(0, 50)}...
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                editProduct(product);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteProduct(product.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Product Details */}
              <div>
                {selectedProduct ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                        <p className="text-lg">{selectedProduct.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Description</label>
                        <p className="text-lg">{selectedProduct.description}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Calories</label>
                        <p className="text-lg">{selectedProduct.calories}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Price</label>
                        <p className="text-lg">₹{selectedProduct.price}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">GST</label>
                        <p className="text-lg">{selectedProduct.gst}%</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Ingredients</label>
                        <p className="text-lg">{selectedProduct.ingredients.join(', ')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Images</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedProduct.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`${selectedProduct.name} ${index + 1}`}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center h-64">
                      <p className="text-muted-foreground">Select a product to view details</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>


        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
