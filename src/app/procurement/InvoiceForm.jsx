// components/InvoiceForm.jsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, FileText } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

const InvoiceForm = ({ procurement, onSave }) => {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(null);
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      procurementId: procurement.id,
      invoiceNumber,
      amount: parseFloat(amount),
      invoiceDate,
      notes,
      files:file
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Invoice Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="invoiceNumber">Invoice Number *</Label>
          <Input
            id="invoiceNumber"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            placeholder="Enter invoice number"
            required
          />
        </div>

        <div>
          <Label htmlFor="amount">Amount (₹) *</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            required
          />
        </div>

        <div>
          <Label>Invoice Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {invoiceDate ? format(invoiceDate, "dd-MM-yyyy") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={invoiceDate}
                onSelect={setInvoiceDate}
                initialFocus
                required
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Input
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes here..."
          />
        </div>

        <div>
          <Label>Upload Invoice (Optional)</Label>
          <div className="mt-2 flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-34 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileText className="h-9 w-8 text-gray-400 mb-" />
                <p className="text-sm text-gray-500">
                  Click to upload
                </p>
                <p className="text-xs text-gray-500">
                  PDF, PNG, JPG or JPEG (max. 10MB)
                </p>
              </div>
              <Input
                type="file"
                multiple
                className="border-l-none border-r-none rounded-none border-b-0 border-t-2"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setFile(Array.from(e.target.files))}
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Add
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;