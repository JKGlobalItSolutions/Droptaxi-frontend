import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import apiClient from "@/api/apiClient";
import { CorporatePricingRow, CarCategory, corporatePricingRows } from "../../config/pricing";

const CorporatePricingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);
  const queryClient = useQueryClient();

  // TODO: Update this to use real API when backend supports corporate pricing
  const { data: pricingData, isLoading, error } = useQuery<CorporatePricingRow[]>({
    queryKey: ["corporate-pricing"],
    queryFn: async () => {
      try {
        // This will fail for now - backend doesn't support /api/pricing/corporate yet
        const response = await apiClient.get("/api/pricing/corporate");
        return response.data;
      } catch (error) {
        console.log("Corporate pricing API not available, using hardcoded data");
        return corporatePricingRows; // Return mock data
      }
    },
    retry: 1,
  });

  const updatePricingMutation = useMutation({
    mutationFn: async (updatedPricing: CorporatePricingRow[]) => {
      // TODO: Replace with actual API call when backend supports it
      // return apiClient.put("/api/pricing/corporate", updatedPricing);
      throw new Error("Backend does not support corporate pricing API yet");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["corporate-pricing"] });
      toast({
        title: "Corporate pricing updated successfully",
        description: "Changes will be reflected on the website.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to update pricing",
        description: "Please try again or contact technical support.",
        variant: "destructive",
      });
    },
  });

  const [formData, setFormData] = useState<CorporatePricingRow[]>(corporatePricingRows);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (pricingData) {
      setFormData(pricingData);
    }
  }, [pricingData]);

  const handleInputChange = (vehicleType: CarCategory, field: keyof CorporatePricingRow, value: string | number) => {
    setFormData(prev =>
      prev.map(row =>
        row.vehicleType === vehicleType
          ? { ...row, [field]: value }
          : row
      )
    );
    setIsModified(true);
  };

  const handleSubmit = () => {
    updatePricingMutation.mutate(formData);
    setIsModified(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error && !pricingData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Unable to load corporate pricing data. Using default values.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Corporate Pricing Management</h1>
        <p className="text-muted-foreground">
          Manage corporate pricing for one-way and round-trip services. These rates are displayed on the main website.
        </p>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Corporate Vehicle Rates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            {formData.map((row, index) => (
              <div key={row.vehicleType} className="border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-primary">{row.vehicleType}</h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`oneWay-${index}`}>One Way Rate (₹/km)</Label>
                    <Input
                      id={`oneWay-${index}`}
                      type="number"
                      value={row.oneWayRate}
                      onChange={(e) => handleInputChange(row.vehicleType, 'oneWayRate', parseFloat(e.target.value))}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`roundTrip-${index}`}>Round Trip Rate (₹/km)</Label>
                    <Input
                      id={`roundTrip-${index}`}
                      type="number"
                      value={row.roundTripRate}
                      onChange={(e) => handleInputChange(row.vehicleType, 'roundTripRate', parseFloat(e.target.value))}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`discount-${index}`}>Discount Percent (%)</Label>
                    <Input
                      id={`discount-${index}`}
                      type="number"
                      value={row.discountPercent}
                      readOnly // Calculated field
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Calculated Savings</Label>
                    <div className="p-3 bg-muted rounded-md text-sm">
                      ₹{(row.oneWayRate * 2 - row.roundTripRate * 1).toFixed(2)} per km
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`notes-${index}`}>Notes</Label>
                  <Input
                    id={`notes-${index}`}
                    value={row.notes}
                    onChange={(e) => handleInputChange(row.vehicleType, 'notes', e.target.value)}
                    placeholder="Enter description for this vehicle type"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-6 border-t border-border">
            <Button
              onClick={handleSubmit}
              disabled={!isModified || updatePricingMutation.isPending}
              className="min-w-32"
            >
              {updatePricingMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>

          {updatePricingMutation.isError && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">
                <strong>Note:</strong> Corporate pricing API is not supported by the backend yet.
                This is a mock implementation. Contact the development team to implement the backend API endpoint.
              </p>
            </div>
          )}

          {isModified && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                You have unsaved changes. Click "Save Changes" to update the corporate pricing.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rate Change Estimation */}
      <Card className="max-w-4xl mt-8">
        <CardHeader>
          <CardTitle>Impact Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Estimated impact on popular routes (130km round trip):
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {formData.slice(0, 4).map(row => (
                <div key={row.vehicleType} className="p-4 border rounded-lg">
                  <div className="text-sm font-medium text-primary">{row.vehicleType}</div>
                  <div className="text-lg font-bold">₹{(130 * 2 * row.roundTripRate).toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">
                    ({row.discountPercent}% corporate discount)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CorporatePricingPage;
