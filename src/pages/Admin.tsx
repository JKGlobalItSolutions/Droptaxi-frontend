import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Pen, Trash2, Plus, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CarCategory, carPricingConfig } from "@/Config/pricing";
import { getPricing, updatePricing, PricingData, getRoutes, createRoute, updateRoute, deleteRoute, RouteData } from "@/api";

const API_BASE = "https://droptaxi-backend-1.onrender.com/api";

const Admin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin/login", { replace: true });
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  // Don't render admin content until authentication is verified
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <h1 className="text-4xl font-bold">Admin Panel</h1>
          <div className="flex gap-2">
            <Button onClick={() => {
              localStorage.removeItem('admin_token');
              queryClient.clear();
              navigate('/admin/login');
            }} variant="outline" size="sm">
              Logout
            </Button>
            <Button onClick={() => navigate("/")} variant="outline" size="sm">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </div>
        <Tabs defaultValue="pricing">
          <TabsList>
            <TabsTrigger value="pricing">Price Management</TabsTrigger>
            <TabsTrigger value="routes">Routes Management</TabsTrigger>
          </TabsList>
          <TabsContent value="pricing">
            <PricingManagement />
          </TabsContent>
          <TabsContent value="routes">
            <RoutesManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const PricingManagement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, { rate: string; fixedPrice: string }>>({});

  // Fetch pricing data from API
  const { data: pricingData = [], isLoading, error } = useQuery({
    queryKey: ["pricings"],
    queryFn: async () => {
      return await getPricing();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Initialize form data when pricing data is loaded
  useEffect(() => {
    if (pricingData.length > 0) {
      const initialFormData: Record<string, { rate: string; fixedPrice: string }> = {};
      pricingData.forEach(pricing => {
        initialFormData[pricing.type] = {
          rate: pricing.rate.toString(),
          fixedPrice: pricing.fixedPrice.toString()
        };
      });
      setFormData(initialFormData);
    }
  }, [pricingData]);

  const updatePricingMutation = useMutation({
    mutationFn: async (updatedPricing: PricingData[]) => {
      return await updatePricing(updatedPricing);
    },
    onSuccess: () => {
      toast({ title: "Pricing updated successfully!" });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Could not save changes to server.",
        variant: "destructive"
      });
    },
    onSettled: () => {
      // Force refresh all pricing queries
      queryClient.invalidateQueries({ queryKey: ["pricings"] });
    },
  });

  const handleInputChange = (type: string, field: 'rate' | 'fixedPrice', value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const handleSavePricing = () => {
    // Convert form data back to PricingData format
    const updatedPricing: PricingData[] = Object.entries(formData).map(([type, values]) => ({
      type,
      rate: parseFloat(values.rate) || 0,
      fixedPrice: parseFloat(values.fixedPrice) || 0
    }));

    // Validate all values
    const invalidEntries = updatedPricing.filter(item =>
      isNaN(item.rate) || isNaN(item.fixedPrice) || item.rate < 0 || item.fixedPrice < 0
    );

    if (invalidEntries.length > 0) {
      toast({
        title: "Invalid pricing values",
        description: "All pricing values must be valid positive numbers.",
        variant: "destructive"
      });
      return;
    }

    updatePricingMutation.mutate(updatedPricing);
  };

  if (isLoading) {
    return <div>Loading pricing data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 dark:text-red-400">Admin login required</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Price Management
          <Button onClick={handleSavePricing} disabled={updatePricingMutation.isPending} size="sm">
            {updatePricingMutation.isPending ? "Saving..." : "Save All"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pricingData.map((pricing) => (
          <div key={pricing.type} className="mb-8">
            <h3 className="text-lg font-semibold mb-4">{pricing.type}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label>One Way</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData[pricing.type]?.rate ?? pricing.rate.toString()}
                    onChange={(e) => handleInputChange(pricing.type, 'rate', e.target.value)}
                    className="w-24"
                  />
                  <span>₹ / km</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Round Trip</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData[pricing.type]?.fixedPrice ?? pricing.fixedPrice.toString()}
                    onChange={(e) => handleInputChange(pricing.type, 'fixedPrice', e.target.value)}
                    className="w-24"
                  />
                  <span>₹ / km</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Note: These are the centralized pricing rates used throughout the application for fare calculation.
            Changes will immediately reflect in user fare estimations and admin route auto-calculations.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const RoutesManagement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingRoute, setEditingRoute] = useState<RouteData | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: routes = [], error: routesError } = useQuery({
    queryKey: ["routes"],
    queryFn: async () => {
      try {
        const response = await getRoutes();
        return response;
      } catch (error) {
        console.error("Failed to load routes:", error);
        // Instead of returning empty array, show error state
        throw error; // Let React Query handle error state
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const deleteRouteMutation = useMutation({
    mutationFn: (id: string) => deleteRoute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      toast({ title: "Route deleted successfully!" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete route",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const updateRouteMutation = useMutation({
    mutationFn: ({ id, route }: { id: string; route: Partial<RouteData> }) =>
      updateRoute(id, route),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      setEditingRoute(null);
      toast({ title: "Route updated successfully!" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update route",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const createRouteMutation = useMutation({
    mutationFn: (route: Omit<RouteData, '_id'>) => createRoute(route),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      setIsAddDialogOpen(false);
      toast({ title: "Route created successfully!" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create route",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const handleSave = (route: Omit<RouteData, '_id'>) => {
    if (editingRoute && editingRoute._id) {
      updateRouteMutation.mutate({ id: editingRoute._id, route });
    } else {
      createRouteMutation.mutate(route);
    }
  };

  // Check if there's an error with routes
  if (routesError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Manage Popular Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600 dark:text-red-400 p-8">
            <p>Failed to load route data. Please refresh the page or try again later.</p>
            <p className="text-sm mt-2">If the issue persists, contact your administrator.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Manage Popular Routes
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <RouteForm onSave={handleSave} />
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="min-w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes?.map((route: any) => (
                <TableRow key={route._id}>
                  <TableCell className="max-w-[100px] truncate" title={route.from}>{route.from}</TableCell>
                  <TableCell className="max-w-[100px] truncate" title={route.to}>{route.to}</TableCell>
                  <TableCell>{route.time}</TableCell>
                  <TableCell>₹{route.price.toLocaleString()}</TableCell>
                  <TableCell className="min-w-[120px]">
                    <div className="flex gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:p-2"
                        onClick={() => setEditingRoute(route)}
                        title="Edit route"
                      >
                        <Pen className="w-4 h-4" />
                        <span className="sr-only sm:not-sr-only sm:ml-1">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteRouteMutation.mutate(route._id)}
                        title="Delete route"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="sr-only sm:not-sr-only sm:ml-1">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {editingRoute && (
          <Dialog open={!!editingRoute} onOpenChange={() => setEditingRoute(null)}>
            <DialogContent>
              <RouteForm initialData={editingRoute} onSave={handleSave} />
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

const RouteForm = ({ initialData, onSave }: { initialData?: any; onSave: (route: any) => void }) => {
  const [formData, setFormData] = useState({
    from: initialData?.from || "",
    to: initialData?.to || "",
    time: initialData?.time || "",
    price: initialData?.price || "",
  });
  const [autoCalculatedDistance, setAutoCalculatedDistance] = useState<number | null>(null);
  const [autoCalculatedPrice, setAutoCalculatedPrice] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CarCategory>('Sedan');
  const [tripType, setTripType] = useState<'oneWay' | 'roundTrip'>('oneWay');

  // Function to calculate distance using ORS API (similar to HeroSection)
  const calculateAutoDistance = async () => {
    const apiKey = import.meta.env.VITE_ORS_API_KEY;
    if (!apiKey || apiKey === 'YOUR_ORS_API_KEY_HERE' || !formData.from || !formData.to) {
      return;
    }

    try {
      // Geocode from location
      const fromGeocode = await fetch(
        `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(formData.from)}&format=json&limit=1`
      );

      if (!fromGeocode.ok) return;
      const fromData = await fromGeocode.json();
      if (!fromData.features || fromData.features.length === 0) return;

      const fromCoords = fromData.features[0].geometry.coordinates;

      // Geocode to location
      const toGeocode = await fetch(
        `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(formData.to)}&format=json&limit=1`
      );

      if (!toGeocode.ok) return;
      const toData = await toGeocode.json();
      if (!toData.features || toData.features.length === 0) return;

      const toCoords = toData.features[0].geometry.coordinates;

      // Calculate distance
      const distanceResponse = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${fromCoords[0]},${fromCoords[1]}&end=${toCoords[0]},${toCoords[1]}`
      );

      if (!distanceResponse.ok) return;
      const distanceData = await distanceResponse.json();

      if (distanceData.features && distanceData.features.length > 0) {
        const distance = distanceData.features[0].properties.segments[0].distance / 1000;
        const roundedDistance = Math.round(distance * 10) / 10;
        setAutoCalculatedDistance(roundedDistance);

        // Auto-calculate price
        const rate = carPricingConfig[selectedCategory][tripType];
        const calculatedPrice = Math.round(roundedDistance * rate);
        setAutoCalculatedPrice(calculatedPrice);

        // Update form data with auto-calculated price if not manually set
        if (!formData.price) {
          setFormData(prev => ({ ...prev, price: calculatedPrice.toString() }));
        }
      }
    } catch (error) {
      console.error("Auto distance calculation error:", error);
    }
  };

  // Auto-calculate when locations change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      calculateAutoDistance();
    }, 500); // Debounce for 500ms

    return () => clearTimeout(debounceTimer);
  }, [formData.from, formData.to, selectedCategory, tripType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseInt(formData.price),
      distance: autoCalculatedDistance, // Store the calculated distance
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Route" : "Add Route"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>From</Label>
            <Input
              value={formData.from}
              onChange={(e) => setFormData({ ...formData, from: e.target.value })}
              placeholder="Enter from location"
              required
            />
          </div>
          <div>
            <Label>To</Label>
            <Input
              value={formData.to}
              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
              placeholder="Enter to location"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Time</Label>
            <Input
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              placeholder="e.g., 6 hours"
              required
            />
          </div>
        </div>

        {/* Auto Calculation Controls */}
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-medium text-sm">Auto Fare Calculation</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Vehicle Category</Label>
              <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as CarCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(carPricingConfig).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat} - ₹{carPricingConfig[cat as CarCategory][tripType]}/km
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Trip Type</Label>
              <Select value={tripType} onValueChange={(value) => setTripType(value as 'oneWay' | 'roundTrip')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oneWay">One Way</SelectItem>
                  <SelectItem value="roundTrip">Round Trip</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Auto Calculated Results */}
          {autoCalculatedDistance && autoCalculatedPrice && (
            <div className="grid grid-cols-2 gap-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded">
              <div>
                <Label className="text-xs text-muted-foreground">Auto Distance</Label>
                <p className="font-medium">{autoCalculatedDistance} km</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Auto Fare</Label>
                <p className="font-medium">₹{autoCalculatedPrice.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        <div>
          <Label>Price (₹)</Label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder={autoCalculatedPrice ? `Auto: ₹${autoCalculatedPrice}` : "Enter price"}
            required
          />
          {autoCalculatedPrice && (
            <p className="text-sm text-muted-foreground mt-1">
              Auto-calculated: ₹{autoCalculatedPrice.toLocaleString()} (you can override this)
            </p>
          )}
        </div>

        <Button type="submit" className="w-full">
          {initialData ? "Update Route" : "Add Route"}
        </Button>
      </form>
    </>
  );
};



export default Admin;
