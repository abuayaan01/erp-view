import { TransferList } from "@/components/machine-transfer/transfer-list";

export default function MachineTransferPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Machine Transfers</h1>
      </div>
      <TransferList />
    </div>
  );
}
