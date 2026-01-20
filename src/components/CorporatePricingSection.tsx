import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { corporatePricingRows, CorporatePricingRow } from "../Config/pricing";

const CorporatePricingSection = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display mb-4">
            Corporate Pricing Updated to <span className="text-gradient font-display">Standard Levels</span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Our corporate pricing is optimized for business customers, offering competitive rates with
            generous round-trip discounts to ensure reliable, cost-effective transportation for corporations and organizations.
          </p>
        </div>

        {/* Mobile: Card Layout */}
        <div className="md:hidden space-y-4">
          {corporatePricingRows.map((row) => (
            <Card key={row.vehicleType} className="glass-card p-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-center">{row.vehicleType}</CardTitle>
                <p className="text-sm text-muted-foreground text-center mt-2">{row.notes}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">One Way:</span>
                    <span className="text-lg font-bold text-primary">₹{row.oneWayRate}/km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Round Trip:</span>
                    <span className="text-lg font-bold text-primary">₹{row.roundTripRate}/km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Discount:</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {row.discountPercent}%
                    </Badge>
                  </div>
                </div>
                <div className="pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground text-justify leading-relaxed">
                    {row.notes}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Desktop: Table Layout */}
        <div className="hidden md:block">
          <Card className="glass-card overflow-hidden">
            <CardHeader className="pb-6">
              <CardTitle className="text-center text-3xl">Corporate Vehicle Rates</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary/5 border-b border-border">
                    <tr>
                      <th className="text-left p-6 font-semibold text-lg">Vehicle Type</th>
                      <th className="text-center p-6 font-semibold text-lg">One Way <br />(₹/km)</th>
                      <th className="text-center p-6 font-semibold text-lg">Round Trip <br />(₹/km)</th>
                      <th className="text-center p-6 font-semibold text-lg">Discount <br />(%)</th>
                      <th className="text-left p-6 font-semibold text-lg">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {corporatePricingRows.map((row, index) => (
                      <tr
                        key={row.vehicleType}
                        className={`border-b border-border hover:bg-primary/5 transition-colors ${index % 2 === 0 ? 'bg-background' : 'bg-muted/30'
                          }`}
                      >
                        <td className="p-6 font-medium text-lg">{row.vehicleType}</td>
                        <td className="p-6 text-center">
                          <span className="text-xl font-bold text-primary">₹{row.oneWayRate}</span>
                        </td>
                        <td className="p-6 text-center">
                          <span className="text-xl font-bold text-primary">₹{row.roundTripRate}</span>
                        </td>
                        <td className="p-6 text-center">
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 font-semibold px-3 py-1"
                          >
                            {row.discountPercent}%
                          </Badge>
                        </td>
                        <td className="p-6 text-muted-foreground leading-relaxed max-w-xs">
                          {row.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Corporate Benefits */}
        <div className="mt-12 text-center">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
              <h3 className="font-semibold text-lg mb-2 text-primary">Bulk Discounts</h3>
              <p className="text-muted-foreground text-sm">
                Additional 5-10% discount on bookings of 10+ trips per month
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
              <h3 className="font-semibold text-lg mb-2 text-primary">Dedicated Account Manager</h3>
              <p className="text-muted-foreground text-sm">
                Personal account manager for custom rate negotiations and priority booking
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
              <h3 className="font-semibold text-lg mb-2 text-primary">Flexible Payment Terms</h3>
              <p className="text-muted-foreground text-sm">
                Net 30 payment terms for verified corporate accounts
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CorporatePricingSection;
