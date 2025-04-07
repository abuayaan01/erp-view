import { DispatchPage } from "@/components/mechine-transfer/dispatch-page"

export default function DispatchTransferPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dispatch Machines</h1>
        <p className="text-muted-foreground mt-2">Dispatch approved machines to their destination sites</p>
      </div>
      <DispatchPage />
    </div>
  )
}

