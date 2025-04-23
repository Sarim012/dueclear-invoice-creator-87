
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NotesAndTermsProps {
  notes: string;
  onNotesChange: (value: string) => void;
  terms: string;
  onTermsChange: (value: string) => void;
}

export function NotesAndTerms({
  notes,
  onNotesChange,
  terms,
  onTermsChange,
}: NotesAndTermsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Notes to be displayed on the invoice"
          rows={4}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="bg-white resize-none"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="terms">Terms</Label>
        <Textarea
          id="terms"
          placeholder="Terms and conditions for this invoice"
          rows={4}
          value={terms}
          onChange={(e) => onTermsChange(e.target.value)}
          className="bg-white resize-none"
        />
      </div>
    </div>
  );
}
