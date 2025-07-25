"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { ArrowLeft, Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import LogbookPDF from "./logbook-pdf";
import api from "@/services/api/api-service";
import { useNavigate, useParams } from "react-router";
import { Spinner } from "../ui/loader";

export function LogbookDetails() {
  const [showPdf, setShowPdf] = useState(false);
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfloading, setPdfLoading] = useState(false);
  const params = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogbookEntry = async () => {
      try {
        setLoading(true);
        const res = await api.get(`logbook/${params.id}`);
        const data = res.data;

        const mappedEntry = {
          id: data.id,
          date: data.date,
          registrationNo: data.machine?.registrationNumber || "-",
          assetCode: data.machine?.erpCode || "-",
          machineName: data.machine?.machineName || "-",
          siteName: data.site?.name || "-",
          location: data.location,
          dieselOpeningBalance: data.dieselOpeningBalance,
          dieselIssue: data.dieselIssue,
          dieselClosingBalance: data.dieselClosingBalance,
          openingKMReading: data.openingKmReading,
          closingKMReading: data.closingKmReading,
          totalRunKM: data.totalRunKM,
          dieselAvgKM: data.dieselAvgKM,
          openingHrsMeter: data.openingHrsMeter,
          closingHrsMeter: data.closingHrsMeter,
          totalRunHrsMeter: data.totalRunHrsMeter,
          dieselAvgHrsMeter: data.dieselAvgHrsMeter,
          workingDetail: data.workingDetails,
        };

        setEntry(mappedEntry);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogbookEntry();
  }, []);


  if (loading) {
    return (
      <Spinner />
    );
  }

  if (!entry) return null;

  const dieselUsed =
    entry.dieselOpeningBalance + entry.dieselIssue - entry.dieselClosingBalance;

  const handleBack = () => {
    navigate("/logbook");
  };

  const handleGeneratePdf = async () => {
    setPdfLoading(true);
    try {
      const blob = await pdf(<LogbookPDF entry={entry} />).toBlob();
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } catch (error) {
      console.error("Failed to generate PDF", error);
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <>
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4 mx-1" />
            Back to List
          </Button>
          <Button
            loading={pdfloading}
            variant="outline"
            onClick={handleGeneratePdf}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4 mx-1" />
            Print
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
              <div>
                <CardTitle>Logbook Entry Details</CardTitle>
                <CardDescription>
                  Complete information for the selected logbook entry
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">
                  {format(new Date(entry.date), "PPP")}
                </div>
                <div className="text-sm text-muted-foreground">
                  Entry #{entry.id}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Machine Information</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">
                    Asset Code:
                  </div>
                  <div>{entry.assetCode}</div>
                  <div className="text-sm text-muted-foreground">
                    Machine Name:
                  </div>
                  <div>{entry.machineName}</div>
                  <div className="text-sm text-muted-foreground">
                    Registration No:
                  </div>
                  <div>{entry.registrationNo}</div>
                  <div className="text-sm text-muted-foreground">
                    Site Name:
                  </div>
                  <div>{entry.siteName}</div>

                  <div className="text-sm text-muted-foreground">Location:</div>
                  <div>{entry.location}</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Diesel Consumption</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">
                    Opening Balance:
                  </div>
                  <div>{entry.dieselOpeningBalance} L</div>

                  <div className="text-sm text-muted-foreground">
                    Diesel Issue:
                  </div>
                  <div>{entry.dieselIssue} L</div>

                  <div className="text-sm text-muted-foreground">
                    Closing Balance:
                  </div>
                  <div>{entry.dieselClosingBalance} L</div>

                  <div className="text-sm text-muted-foreground">
                    Diesel Used:
                  </div>
                  <div className="font-medium">{dieselUsed} L</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Performance Metrics</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">
                    KM Reading (Start):
                  </div>
                  <div>{entry.openingKMReading}</div>

                  <div className="text-sm text-muted-foreground">
                    KM Reading (End):
                  </div>
                  <div>{entry.closingKMReading}</div>

                  <div className="text-sm text-muted-foreground">
                    Total KM Run:
                  </div>
                  <div className="font-medium">{entry.totalRunKM}</div>

                  <div className="text-sm text-muted-foreground">
                    Diesel Efficiency:
                  </div>
                  <div className="font-medium">{entry.dieselAvgKM} KM/L</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Hours Meter</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">
                    Hours Meter (Start):
                  </div>
                  <div>{entry.openingHrsMeter}</div>

                  <div className="text-sm text-muted-foreground">
                    Hours Meter (End):
                  </div>
                  <div>{entry.closingHrsMeter}</div>

                  <div className="text-sm text-muted-foreground">
                    Total Hours Run:
                  </div>
                  <div className="font-medium">{entry.totalRunHrsMeter}</div>

                  <div className="text-sm text-muted-foreground">
                    Diesel per Hour:
                  </div>
                  <div className="font-medium">
                    {entry.dieselAvgHrsMeter} L/Hr
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-lg mb-2">Working Details</h3>
              <p className="text-muted-foreground">
                {entry.workingDetail || "No working details provided."}
              </p>
            </div>
          </CardContent>
        </Card>
      </>
    </div>
  );
}

function LogbookDetailsWrapper() {
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  const handleBack = () => {
    // Add your back navigation logic here
    console.log("Go back to list");
  };

  useEffect(() => {
    const fetchLogbookEntry = async () => {
      try {
        setLoading(true);
        const res = await api.get(`logbook/${params.id}`);
        const data = res.data;
        const mappedEntry = {
          id: data.id,
          date: data.date,
          registrationNo: data.machine?.registrationNumber || "-",
          assetCode: data.machine?.erpCode || "-",
          siteName: data.site?.name || "-",
          location: data.location,
          dieselOpeningBalance: data.dieselOpeningBalance,
          dieselIssue: data.dieselIssue,
          dieselClosingBalance: data.dieselClosingBalance,
          openingKMReading: data.openingKmReading,
          closingKMReading: data.closingKmReading,
          totalRunKM: data.totalRunKM,
          dieselAvgKM: data.dieselAvgKM,
          openingHrsMeter: data.openingHrsMeter,
          closingHrsMeter: data.closingHrsMeter,
          totalRunHrsMeter: data.totalRunHrsMeter,
          dieselAvgHrsMeter: data.dieselAvgHrsMeter,
          workingDetail: data.workingDetails,
        };

        setEntry(mappedEntry);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogbookEntry();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!entry) return <div>No logbook data found.</div>;

  return <LogbookDetails entry={entry} onBack={handleBack} />;
}

// export default LogbookDetailsWrapper;
