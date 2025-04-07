"use client"

import { Badge } from "@/components/ui/badge"

export function StatusBadge({ status }) {
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return { label: "Pending", className: "bg-amber-100 text-amber-800 hover:bg-amber-100" }
      case "approved":
        return { label: "Approved", className: "bg-green-100 text-green-800 hover:bg-green-100" }
      case "rejected":
        return { label: "Rejected", className: "bg-red-100 text-red-800 hover:bg-red-100" }
      case "dispatched":
        return { label: "Dispatched", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" }
      case "delivered":
        return { label: "Delivered", className: "bg-purple-100 text-purple-800 hover:bg-purple-100" }
      case "procurement":
        return { label: "Procurement", className: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100" }
      case "ordered":
        return { label: "Ordered", className: "bg-cyan-100 text-cyan-800 hover:bg-cyan-100" }
      case "received":
        return { label: "Received", className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" }
      default:
        return { label: status, className: "bg-gray-100 text-gray-800 hover:bg-gray-100" }
    }
  }

  const { label, className } = getStatusConfig(status)

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  )
}

