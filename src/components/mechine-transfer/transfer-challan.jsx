"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { FileDown } from "lucide-react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export function TransferChallan({ transfer }) {
  const { toast } = useToast()
  const challanRef = useRef(null)

  const handleDownload = async () => {
    if (!challanRef.current) return

    try {
      // Show loading toast
      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your challan...",
      })

      // Convert the challan div to canvas
      const element = challanRef.current
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      })

      const data = canvas.toDataURL("image/png")

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgProperties = pdf.getImageProperties(data)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width

      pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight)

      // Generate filename based on transfer type and ID
      const filename =
        transfer.type === "site_transfer"
          ? `transfer-challan-${transfer.id}.pdf`
          : transfer.type === "sell"
            ? `sale-challan-${transfer.id}.pdf`
            : `scrap-challan-${transfer.id}.pdf`

      // Save the PDF
      pdf.save(filename)

      // Show success toast
      toast({
        title: "Challan Downloaded",
        description: `Transfer challan for ${transfer.id} has been downloaded successfully`,
        variant: "default",
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div ref={challanRef} className="border rounded-md p-6 space-y-6 bg-white max-w-[800px] mx-auto">
        {/* Company Logo and Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <div className="text-xl font-bold">Your Company Logo</div>
          <div className="text-right">
            <h2 className="text-xl font-bold">
              {transfer.type === "site_transfer"
                ? "MACHINE TRANSFER CHALLAN"
                : transfer.type === "sell"
                  ? "MACHINE SALE CHALLAN"
                  : "MACHINE SCRAP CHALLAN"}
            </h2>
            <p className="text-sm text-muted-foreground">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Challan ID and Reference */}
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Challan No:</p>
              <p className="text-lg font-bold">{transfer.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Reference:</p>
              <p>
                {transfer.type === "site_transfer"
                  ? "Site Transfer"
                  : transfer.type === "sell"
                    ? "Machine Sale"
                    : "Machine Scrap"}
              </p>
            </div>
          </div>
        </div>

        {/* From/To Details */}
        <div className="grid grid-cols-2 gap-8">
          <div className="border-r pr-4">
            <h3 className="text-sm font-medium uppercase mb-2">From</h3>
            <p className="font-bold">{transfer.fromSite}</p>
            <p>Your Company Name</p>
            <p>Address Line 1</p>
            <p>Address Line 2</p>
            <p>Contact: +XX XXXX XXXXX</p>
          </div>

          <div>
            <h3 className="text-sm font-medium uppercase mb-2">
              {transfer.type === "site_transfer" ? "To" : transfer.type === "sell" ? "Buyer" : "Scrap Vendor"}
            </h3>
            <p className="font-bold">
              {transfer.type === "site_transfer"
                ? transfer.toSite
                : transfer.type === "sell"
                  ? transfer.buyerName
                  : transfer.scrapVendor}
            </p>
            {transfer.type === "sell" && (
              <>
                <p>Contact: {transfer.buyerContact || "N/A"}</p>
                {transfer.buyerAddress && <p>{transfer.buyerAddress}</p>}
              </>
            )}
            {transfer.type === "scrap" && (
              <>
                <p>Contact: {transfer.scrapVendorContact || "N/A"}</p>
                {transfer.scrapVendorAddress && <p>{transfer.scrapVendorAddress}</p>}
              </>
            )}
            {transfer.type === "site_transfer" && (
              <>
                <p>Your Company Name</p>
                <p>Address Line 1</p>
                <p>Address Line 2</p>
                <p>Contact: +XX XXXX XXXXX</p>
              </>
            )}
          </div>
        </div>

        {/* Machine Details */}
        <div>
          <h3 className="text-sm font-medium uppercase mb-2 border-b pb-2">Machine Details</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-sm text-muted-foreground">Machine Name:</p>
              <p className="font-medium">{transfer.machineName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Machine ID:</p>
              <p className="font-medium">{transfer.machineId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Model:</p>
              <p className="font-medium">{transfer.model || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Serial Number:</p>
              <p className="font-medium">{transfer.serialNumber || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Transfer Details */}
        <div>
          <h3 className="text-sm font-medium uppercase mb-2 border-b pb-2">
            {transfer.type === "site_transfer"
              ? "Transfer Details"
              : transfer.type === "sell"
                ? "Sale Details"
                : "Scrap Details"}
          </h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-sm text-muted-foreground">Date:</p>
              <p className="font-medium">{transfer.transferDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Approved By:</p>
              <p className="font-medium">{transfer.approvedBy}</p>
            </div>
            {transfer.type === "sell" && (
              <div>
                <p className="text-sm text-muted-foreground">Sale Amount:</p>
                <p className="font-medium">{transfer.saleAmount ? `$${transfer.saleAmount}` : "N/A"}</p>
              </div>
            )}
            {transfer.type === "scrap" && (
              <div>
                <p className="text-sm text-muted-foreground">Scrap Value:</p>
                <p className="font-medium">{transfer.scrapValue ? `$${transfer.scrapValue}` : "N/A"}</p>
              </div>
            )}
          </div>
        </div>

        {/* Transport Details */}
        <div>
          <h3 className="text-sm font-medium uppercase mb-2 border-b pb-2">Transport Details</h3>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div>
              <p className="text-sm text-muted-foreground">Vehicle Number:</p>
              <p className="font-medium">{transfer.transportDetails?.vehicleNo || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Driver Name:</p>
              <p className="font-medium">{transfer.transportDetails?.driverName || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Driver Contact:</p>
              <p className="font-medium">{transfer.transportDetails?.driverContact || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="text-xs text-muted-foreground border-t pt-4 mt-4">
          <p className="font-medium">Terms & Conditions:</p>
          <ol className="list-decimal pl-4 space-y-1 mt-1">
            <li>This challan must be presented at the time of delivery/receipt.</li>
            <li>The receiver must verify all details before accepting the machine.</li>
            <li>Any discrepancies must be reported within 24 hours of receipt.</li>
            <li>
              This document serves as proof of{" "}
              {transfer.type === "site_transfer" ? "transfer" : transfer.type === "sell" ? "sale" : "scrapping"}.
            </li>
          </ol>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 pt-8 mt-8">
          <div className="text-center">
            <div className="border-t border-dashed pt-2">
              <p className="font-medium">Authorized Signature</p>
              <p className="text-sm text-muted-foreground">(Sender)</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-dashed pt-2">
              <p className="font-medium">
                {transfer.type === "site_transfer"
                  ? "Receiver's Signature"
                  : transfer.type === "sell"
                    ? "Buyer's Signature"
                    : "Vendor's Signature"}
              </p>
              <p className="text-sm text-muted-foreground">
                {transfer.type === "site_transfer" ? "(Receiver)" : transfer.type === "sell" ? "(Buyer)" : "(Vendor)"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleDownload}>
          <FileDown className="mr-2 h-4 w-4" />
          Download Challan
        </Button>
      </div>
    </div>
  )
}

