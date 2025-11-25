import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Pen, Trash2, Plus, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://droptaxi-backend-1.onrender.com/api";

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const auth = localStorage.getItem("dropTaxiAdminAuth");
    if (auth === "authenticated") {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === "admin123") {
      localStorage.setItem("dropTaxiAdminAuth", "authenticated");
      setIsAuthenticated(true);
      toast({ title: "Login successful!" });
    } else {
      toast({ title: "Incorrect password", variant: "destructive" });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Admin Panel</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            <Home className="w-4 h-4 mr-2" />
            Back to Homepage
          </Button>
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

  // Fallback/mock pricing data
  const fallbackPricings = [
    { type: 'economy', rate: 12, fixedPrice: 150 },
    { type: 'premium', rate: 15, fixedPrice: 300 },
    { type: 'suv', rate: 18, fixedPrice: 500 }
  ];

  const { data: pricings = [], isError } = useQuery({
    queryKey: ["pricings"],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_BASE}/pricing`);
        if (!res.ok) throw new Error('API response failed');
        return res.json();
      } catch (error) {
        console.warn('API not available, using fallback data');
        return fallbackPricings; // Return mock data on error
      }
    },
  });

  // Use fallback data if API fails or returns empty array
  const displayPricings = (isError || !pricings.length) ? fallbackPricings : pricings;

  const updatePricing = useMutation({
    mutationFn: ({ type, rate, fixedPrice }: { type: string; rate?: number; fixedPrice?: number }) => {
      const body: any = {};
      if (rate !== undefined) body.rate = rate;
      if (fixedPrice !== undefined) body.fixedPrice = fixedPrice;
      return fetch(`${API_BASE}/pricing/${type}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricings"] });
      toast({ title: "Pricing updated successfully!" });
    },
    onError: () => {
      toast({ title: "Error updating pricing", variant: "destructive" });
    },
  });

  const handleUpdateRate = (type: string, rate: string) => {
    const numRate = parseInt(rate);
    if (isNaN(numRate)) return;
    updatePricing.mutate({ type, rate: numRate });
  };

  const handleUpdateFixedPrice = (type: string, fixedPrice: string) => {
    const numPrice = parseInt(fixedPrice);
    if (isNaN(numPrice)) return;
    updatePricing.mutate({ type, fixedPrice: numPrice });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Pricing</CardTitle>
      </CardHeader>
      <CardContent>
        {displayPricings?.map((pricing: any) => (
          <div key={pricing.type} className="mb-6">
            <h3 className="text-lg font-semibold capitalize mb-2">{pricing.type} Vehicle</h3>
            <div className="flex items-center gap-4 mb-2">
              <Label className="w-32">Rate per km:</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  defaultValue={pricing.rate}
                  onBlur={(e) => handleUpdateRate(pricing.type, e.target.value)}
                  className="w-24"
                />
                <span>₹ / km</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Label className="w-32">Fixed price:</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  defaultValue={pricing.fixedPrice}
                  onBlur={(e) => handleUpdateFixedPrice(pricing.type, e.target.value)}
                  className="w-24"
                />
                <span>₹</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const RoutesManagement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingRoute, setEditingRoute] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: routes } = useQuery({
    queryKey: ["routes"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/routes`);
      return res.json();
    },
  });

  const deleteRoute = useMutation({
    mutationFn: (id: string) =>
      fetch(`${API_BASE}/routes/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      toast({ title: "Route deleted successfully!" });
    },
  });

  const updateRoute = useMutation({
    mutationFn: (route: any) =>
      fetch(`${API_BASE}/routes/${route._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(route),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      setEditingRoute(null);
      toast({ title: "Route updated successfully!" });
    },
  });

  const addRoute = useMutation({
    mutationFn: (route: any) =>
      fetch(`${API_BASE}/routes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(route),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      setIsAddDialogOpen(false);
      toast({ title: "Route added successfully!" });
    },
  });

  const handleSave = (route: any) => {
    if (editingRoute) {
      updateRoute.mutate(route);
    } else {
      addRoute.mutate(route);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Manage Popular Routes
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Route
              </Button>
            </DialogTrigger>
            <DialogContent>
              <RouteForm onSave={handleSave} />
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routes?.map((route: any) => (
              <TableRow key={route._id}>
                <TableCell>{route.from}</TableCell>
                <TableCell>{route.to}</TableCell>
                <TableCell>{route.time}</TableCell>
                <TableCell>₹{route.price.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingRoute(route)}
                    >
                      <Pen className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteRoute.mutate(route._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseInt(formData.price),
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
              required
            />
          </div>
          <div>
            <Label>To</Label>
            <Input
              value={formData.to}
              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
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
              required
            />
          </div>
          <div>
            <Label>Price (₹)</Label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full">
          {initialData ? "Update Route" : "Add Route"}
        </Button>
      </form>
    </>
  );
};

export default Admin;
