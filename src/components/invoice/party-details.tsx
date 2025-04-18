
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PartyDetailsProps {
  businessDetails: string;
  onBusinessDetailsChange: (value: string) => void;
  clientDetails: string;
  onClientDetailsChange: (value: string) => void;
}

export function PartyDetails({
  businessDetails,
  onBusinessDetailsChange,
  clientDetails,
  onClientDetailsChange,
}: PartyDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="businessDetails">Invoice From</Label>
        <p className="text-sm text-muted-foreground">Your Business Details</p>
        <Textarea
          id="businessDetails"
          placeholder="Business Name, Address, Phone, Email, TAX ID, etc."
          rows={4}
          value={businessDetails}
          onChange={(e) => onBusinessDetailsChange(e.target.value)}
          className="bg-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="clientDetails">Bill To</Label>
        <p className="text-sm text-muted-foreground">Client Details</p>
        <Textarea
          id="clientDetails"
          placeholder="Client/Business Name, Address, Phone, Email, TAX ID, etc."
          rows={4}
          value={clientDetails}
          onChange={(e) => onClientDetailsChange(e.target.value)}
          className="bg-white"
        />
      </div>
    </div>
  );
}
