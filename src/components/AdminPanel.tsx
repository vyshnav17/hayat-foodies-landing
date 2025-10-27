import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Eye, Download, LogOut, CheckCircle, Plus, Edit, Save } from "lucide-react";
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
  id: number;
  name: string;
  description: string;
  images: string[];
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
    images: '',
    ingredients: '',
    calories: '',
    price: '',
    gst: ''
  });

  const defaultProducts = [
    {
      id: 1,
      name: "Chapati",
      description: "Soft, fresh chapati made daily with premium ingredients",
      images: [chapatiImg, breadImg, ruskImg],
      ingredients: ["Whole wheat flour", "Water", "Salt", "Oil"],
      calories: 150,
      price: 20,
      gst: 2,
    },
    {
      id: 2,
      name: "Cream Bun",
      description: "Delicious cream-filled buns with smooth vanilla cream",
      images: [creamBunImg, chocolateBunImg, babyChocolateBunImg],
      ingredients: ["Flour", "Cream", "Sugar", "Yeast", "Vanilla"],
      calories: 250,
      price: 30,
      gst: 3,
    },
    {
      id: 3,
      name: "Normal Buns",
      description: "Freshly baked, delightfully soft—your perfect companion for any meal",
      images: [chocolateBunImg, creamBunImg, babyChocolateBunImg],
      ingredients: ["Flour", "Sugar", "Yeast", "Milk", "Butter"],
      calories: 200,
      price: 25,
      gst: 2.5,
    },
    {
      id: 4,
      name: "Baby Chocolate Bun",
      description: "Soft, rich, and perfectly sized for a satisfying chocolate treat.",
      images: [babyChocolateBunImg, chocolateBunImg, creamBunImg],
      ingredients: ["Flour", "Chocolate", "Sugar", "Yeast", "Butter"],
      calories: 180,
      price: 15,
      gst: 1.5,
    },
    {
      id: 5,
      name: "Bread",
      description: "Fresh, soft bread baked to perfection every day",
      images: [breadImg, chapatiImg, ruskImg],
      ingredients: ["Flour", "Water", "Yeast", "Salt", "Sugar"],
      calories: 120,
      price: 40,
      gst: 4,
    },
    {
      id: 6,
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
    // Load submissions from localStorage
    const storedSubmissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    const active = storedSubmissions.filter((sub: ContactSubmission) => !sub.resolved);
    const resolved = storedSubmissions.filter((sub: ContactSubmission) => sub.resolved);
    setActiveSubmissions(active);
    setResolvedSubmissions(resolved);

    // Load products from localStorage, fallback to defaultProducts
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    if (storedProducts.length > 0) {
      setProducts(storedProducts);
    } else {
      // Initialize with default products if localStorage is empty
      setProducts(defaultProducts);
      localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
  }, []);

  const resolveSubmission = (id: number) => {
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

      // Update localStorage
      const allSubmissions = [...updatedActive, ...updatedResolved];
      localStorage.setItem('contactSubmissions', JSON.stringify(allSubmissions));
    }
  };

  const deleteSubmission = (id: number, isResolved: boolean = false) => {
    if (isResolved) {
      const updatedResolved = resolvedSubmissions.filter(sub => sub.id !== id);
      setResolvedSubmissions(updatedResolved);
      // Keep in localStorage for customer database
      const allSubmissions = [...activeSubmissions, ...updatedResolved];
      localStorage.setItem('contactSubmissions', JSON.stringify(allSubmissions));
    } else {
      const updatedActive = activeSubmissions.filter(sub => sub.id !== id);
      setActiveSubmissions(updatedActive);
      const allSubmissions = [...updatedActive, ...resolvedSubmissions];
      localStorage.setItem('contactSubmissions', JSON.stringify(allSubmissions));
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

  const handleProductSubmit = () => {
    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name: productForm.name,
      description: productForm.description,
      images: productForm.images.split(',').map(url => url.trim()),
      ingredients: productForm.ingredients.split(',').map(ing => ing.trim()),
      calories: parseInt(productForm.calories),
      price: parseFloat(productForm.price),
      gst: parseFloat(productForm.gst)
    };

    let updatedProducts;
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? newProduct : p);
    } else {
      updatedProducts = [...products, newProduct];
    }

    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    // Reset form
    setProductForm({
      name: '',
      description: '',
      images: '',
      ingredients: '',
      calories: '',
      price: '',
      gst: ''
    });
    setEditingProduct(null);
    setIsProductDialogOpen(false);
  };

  const editProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      images: product.images.join(', '),
      ingredients: product.ingredients.join(', '),
      calories: product.calories.toString(),
      price: product.price.toString(),
      gst: product.gst.toString()
    });
    setIsProductDialogOpen(true);
  };

  const deleteProduct = (id: number) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Contact Form Submissions</h1>
          <div className="flex gap-2">
            <Button onClick={exportToCSV} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button onClick={onLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
            <TabsTrigger value="active">Active Queries ({activeSubmissions.length})</TabsTrigger>
            <TabsTrigger value="resolved">Resolved Queries ({resolvedSubmissions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Product Management</h2>
              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setIsProductDialogOpen(true)} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
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
                      <Label htmlFor="images">Images (comma-separated URLs)</Label>
                      <Input
                        id="images"
                        value={productForm.images}
                        onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                      />
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
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleProductSubmit} className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      {editingProduct ? 'Update' : 'Add'} Product
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          <TabsContent value="active" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Submissions List */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Submissions</CardTitle>
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
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{submission.name}</h3>
                              <Badge variant="secondary">
                                {new Date(submission.timestamp).toLocaleDateString()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{submission.email}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-xs">
                              {submission.message.substring(0, 50)}...
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSubmission(submission);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                resolveSubmission(submission.id);
                              }}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSubmission(submission.id);
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

              {/* Submission Details */}
              <div>
                {selectedSubmission ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Submission Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                        <p className="text-lg">{selectedSubmission.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <p className="text-lg">{selectedSubmission.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Phone</label>
                        <p className="text-lg">{selectedSubmission.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Message</label>
                        <p className="text-lg whitespace-pre-wrap">{selectedSubmission.message}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Submitted At</label>
                        <p className="text-lg">
                          {new Date(selectedSubmission.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {selectedSubmission.resolved && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Resolved At</label>
                          <p className="text-lg">
                            {new Date(selectedSubmission.resolvedAt!).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center h-64">
                      <p className="text-muted-foreground">Select a submission to view details</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Resolved Submissions List */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Resolved Submissions</CardTitle>
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
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer bg-green-50 border-green-200"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{submission.name}</h3>
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Resolved
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{submission.email}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-xs">
                              {submission.message.substring(0, 50)}...
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSubmission(submission);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSubmission(submission.id, true);
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

              {/* Submission Details */}
              <div>
                {selectedSubmission ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Submission Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                        <p className="text-lg">{selectedSubmission.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <p className="text-lg">{selectedSubmission.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Phone</label>
                        <p className="text-lg">{selectedSubmission.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Message</label>
                        <p className="text-lg whitespace-pre-wrap">{selectedSubmission.message}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Submitted At</label>
                        <p className="text-lg">
                          {new Date(selectedSubmission.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {selectedSubmission.resolved && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Resolved At</label>
                          <p className="text-lg">
                            {new Date(selectedSubmission.resolvedAt!).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center h-64">
                      <p className="text-muted-foreground">Select a submission to view details</p>
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
