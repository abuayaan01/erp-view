import { TransferHistory } from "@/components/mechine-transfer/transfer-history"

export default function TransferHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transfer History</h1>
        <p className="text-muted-foreground mt-2">View history of all machine transfers</p>
      </div>
      <TransferHistory />
    </div>
  )
}

