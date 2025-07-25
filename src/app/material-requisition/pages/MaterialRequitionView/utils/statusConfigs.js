// utils/statusConfigs.js
import {
  Clock, CheckCircle, AlertTriangle, TrendingUp, Package,
  Truck, XCircle, ShoppingCart
} from 'lucide-react';

export const PRIORITY_CONFIG = {
  urgent: { color: "bg-red-500", icon: AlertTriangle },
  high: { color: "bg-red-400", icon: TrendingUp },
  medium: { color: "bg-orange-400", icon: Clock },
  low: { color: "bg-yellow-400", icon: Clock },
};

export const STATUS_CONFIG = {
  pending: { color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock },
  approvedbypm: { color: "bg-blue-50 text-blue-700 border-blue-200", icon: CheckCircle },
  approvedbyho: { color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle },
  forwarded: { color: "bg-purple-50 text-purple-700 border-purple-200", icon: Truck },
  rejected: { color: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
  issued: { color: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: Package },
  received: { color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle },
};

export const PROCUREMENT_STATUS_CONFIG = {
  ordered: { color: "bg-blue-50 text-blue-700 border-blue-200", icon: ShoppingCart },
  delivered: { color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle },
  cancelled: { color: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
  pending: { color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock },
};

export const ISSUE_STATUS_CONFIG = {
  pending: { color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock },
  approved: { color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle },
  issued: { color: "bg-blue-50 text-blue-700 border-blue-200", icon: Package },
  dispatched: { color: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: Truck },
  received: { color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle },
  rejected: { color: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
};
