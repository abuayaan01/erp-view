import { ReceivePage } from "@/components/mechine-transfer/receive-page"

export default function ReceiveTransferPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Receive Machines</h1>
        <p className="text-muted-foreground mt-2">Receive dispatched machines at your site</p>
      </div>
      <ReceivePage />
    </div>
  )
}

