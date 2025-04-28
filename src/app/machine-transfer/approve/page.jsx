import { ApprovalDashboard } from "@/components/machine-transfer/approval-dashboard";

export default function ApprovePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Approval Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Approve or reject machine transfer requests
        </p>
      </div>
      <ApprovalDashboard />
    </div>
  );
}
