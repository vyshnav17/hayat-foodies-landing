import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Eye, Download, LogOut, CheckCircle, Plus, Edit, Save, Upload, Image as ImageIcon } from "lucide-react";
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
  images: string[]; // image URLs
  ingredients: string[];
  weight?: number;
  quantity?: number;
  price: number;
  gst?: number;
}

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  uploadedAt: string;
  uploadedBy: string;
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
    weight: '',
    quantity: '',
    price: '',
    gst: ''
  });
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<GalleryImage | null>(null);
  const [isGalleryDialogOpen, setIsGalleryDialogOpen] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    image: null as File | null,
    alt: ''
  });

  const defaultProducts = [
    {
      id: "1",
      name: "Chapati",
      description: "Soft, fresh chapati made daily with premium ingredients",
      images: [chapatiImg, breadImg, ruskImg],
      ingredients: ["Whole wheat flour", "Water", "Salt", "Oil"],
      weight: 450,
      price: 60,
      gst: 5,
    },
    {
      id: "2",
      name: "Cream Bun",
      description: "Delicious cream-filled buns with smooth vanilla cream",
      images: [creamBunImg, chocolateBunImg, babyChocolateBunImg],
      ingredients: ["Flour", "Cream", "Sugar", "Yeast", "Vanilla"],
      quantity: 4,
      price: 45,
      gst: 5,
    },
    {
      id: "3",
      name: "Normal Buns",
      description: "Freshly baked, delightfully soft—your perfect companion for any meal",
      images: [chocolateBunImg, creamBunImg, babyChocolateBunImg],
      ingredients: ["Flour", "Sugar", "Yeast", "Milk", "Butter"],
      quantity: 2,
      price: 20,
      gst: 5,
    },
    {
      id: "4",
      name: "Baby Chocolate Bun",
      description: "Soft, rich, and perfectly sized for a satisfying chocolate treat.",
      images: [babyChocolateBunImg, chocolateBunImg, creamBunImg],
      ingredients: ["Flour", "Chocolate", "Sugar", "Yeast", "Butter"],
      quantity: 5,
      price: 40,
      gst: 5,
    },
    {
      id: "5",
      name: "Bread",
      description: "Fresh, soft bread baked to perfection every day",
      images: [breadImg, chapatiImg, ruskImg],
      ingredients: ["Flour", "Water", "Yeast", "Salt", "Sugar"],
      weight: 300,
      price: 40,
      gst: 5,
    },
    {
      id: "6",
      name: "Rusk",
      description: "Crispy, golden rusk perfect for tea time",
      images: [ruskImg, breadImg, chapatiImg],
      ingredients: ["Flour", "Sugar", "Butter", "Eggs", "Yeast"],
      weight: 100,
      price: 35,
      gst: 5,
    },
  ];

  useEffect(() => {
    // Load submissions from API
    fetchContactSubmissions();

    // Load products from API, fallback to defaultProducts
    fetchProducts();

    // Load gallery images from API
    fetchGalleryImages();
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

  const fetchGalleryImages = async () => {
    try {
      const response = await fetch('/api/gallery');
      if (response.ok) {
        const images = await response.json();
        setGalleryImages(images);
      } else {
        console.error('Failed to fetch gallery images');
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
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
    if ((!productForm.weight.trim() || isNaN(parseFloat(productForm.weight))) && (!productForm.quantity.trim() || isNaN(parseFloat(productForm.quantity)))) {
      alert('Either valid weight or quantity is required');
      return;
    }
    if (!productForm.ingredients.trim()) {
      alert('Ingredients are required');
      return;
    }

    try {
      const imageUrls = productForm.images.split(',').map(url => url.trim()).filter(url => url);

      const productData: Omit<Product, 'id'> = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        images: imageUrls,
        ingredients: productForm.ingredients.split(',').map(ing => ing.trim()).filter(ing => ing),
        price: parseFloat(productForm.price),
        gst: parseFloat(productForm.gst)
      };

      if (productForm.weight.trim()) {
        productData.weight = parseFloat(productForm.weight);
      }
      if (productForm.quantity.trim()) {
        productData.quantity = parseFloat(productForm.quantity);
      }

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
          images: '',
          ingredients: '',
          weight: '',
          quantity: '',
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
      images: product.images.join(', '),
      ingredients: product.ingredients.join(', '),
      weight: product.weight?.toString() || '',
      quantity: product.quantity?.toString() || '',
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

  const handleGallerySubmit = async () => {
    // Form validation
    if (!galleryForm.image) {
      alert('Please select an image file');
      return;
    }
    if (!galleryForm.alt.trim()) {
      alert('Alt text is required');
      return;
    }

    // File validation
    if (galleryForm.image.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB');
      return;
    }
    if (!galleryForm.image.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', galleryForm.image);
      formData.append('alt', galleryForm.alt.trim());
      formData.append('uploadedBy', 'Admin');

      console.log('Starting upload...');
      const response = await fetch('/api/gallery', {
        method: 'POST',
        body: formData
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);

      if (response.ok) {
        console.log('Upload successful:', result);

        // Reset form
        setGalleryForm({
          image: null,
          alt: ''
        });
        setIsGalleryDialogOpen(false);

        // Refresh gallery images from API
        await fetchGalleryImages();

        alert('Gallery image uploaded successfully! It will now be visible in the gallery.');
      } else {
        console.error('API Error:', result);
        alert(`Failed to upload gallery image: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error uploading gallery image:', error);
      alert(`Failed to upload gallery image: ${error instanceof Error ? error.message : 'Network error'}`);
    }
  };

  const deleteGalleryImage = async (id: string) => {
    try {
      const response = await fetch(`/api/gallery?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Refresh gallery images from API
        await fetchGalleryImages();
        if (selectedGalleryImage?.id === id) {
          setSelectedGalleryImage(null);
        }
        alert('Gallery image deleted successfully!');
      } else {
        console.error('Failed to delete gallery image');
        alert('Failed to delete gallery image');
      }
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      alert('Error deleting gallery image');
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
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto p-1">
            <TabsTrigger value="contact" className="text-xs sm:text-sm py-2">Contact Submissions</TabsTrigger>
            <TabsTrigger value="products" className="text-xs sm:text-sm py-2">Product Management ({products.length})</TabsTrigger>
            <TabsTrigger value="gallery" className="text-xs sm:text-sm py-2">Gallery Management</TabsTrigger>
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
                      <Label htmlFor="weight">Weight (g)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={productForm.weight}
                        onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })}
                        placeholder="Weight in grams"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={productForm.quantity}
                        onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
                        placeholder="Quantity"
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
                        <label className="text-sm font-medium text-muted-foreground">Weight</label>
                        <p className="text-lg">{selectedProduct.weight}g</p>
                      </div>
                      {selectedProduct.quantity && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Quantity</label>
                          <p className="text-lg">{selectedProduct.quantity}</p>
                        </div>
                      )}
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

          <TabsContent value="gallery" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl md:text-2xl font-bold">Gallery Management</h2>
              <Dialog open={isGalleryDialogOpen} onOpenChange={setIsGalleryDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setIsGalleryDialogOpen(true)} className="flex items-center gap-2 w-full sm:w-auto">
                    <Upload className="w-4 h-4" />
                    Add Image
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md w-[95vw] p-4 md:p-6">
                  <DialogHeader>
                    <DialogTitle className="text-lg md:text-xl">Add New Gallery Image</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="gallery-image">Image File</Label>
                      <input
                        id="gallery-image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setGalleryForm({ ...galleryForm, image: e.target.files?.[0] || null })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gallery-alt">Alt Text</Label>
                      <Input
                        id="gallery-alt"
                        value={galleryForm.alt}
                        onChange={(e) => setGalleryForm({ ...galleryForm, alt: e.target.value })}
                        placeholder="Description of the image"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setIsGalleryDialogOpen(false)} className="w-full sm:w-auto">
                      Cancel
                    </Button>
                    <Button onClick={handleGallerySubmit} className="flex items-center justify-center gap-2 w-full sm:w-auto">
                      <Save className="w-4 h-4" />
                      Add Image
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
              {/* Gallery Images List */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Gallery Images ({galleryImages.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {galleryImages.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No gallery images available
                      </p>
                    ) : (
                      galleryImages.map((image) => (
                        <div
                          key={image.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                          onClick={() => setSelectedGalleryImage(image)}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <img
                              src={image.src}
                              alt={image.alt}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold truncate">{image.alt}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(image.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteGalleryImage(image.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Gallery Image Details */}
              <div>
                {selectedGalleryImage ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Image Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-center">
                        <img
                          src={selectedGalleryImage.src}
                          alt={selectedGalleryImage.alt}
                          className="max-w-full h-auto max-h-64 object-contain rounded"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Alt Text</label>
                        <p className="text-lg">{selectedGalleryImage.alt}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Uploaded At</label>
                        <p className="text-lg">{new Date(selectedGalleryImage.uploadedAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Uploaded By</label>
                        <p className="text-lg">{selectedGalleryImage.uploadedBy}</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center h-64">
                      <p className="text-muted-foreground">Select an image to view details</p>
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
