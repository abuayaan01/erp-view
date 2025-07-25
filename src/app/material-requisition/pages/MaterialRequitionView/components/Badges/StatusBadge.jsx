// components/Badges/StatusBadge.jsx
import { Badge } from "@/components/ui/badge";
import { PRIORITY_CONFIG, STATUS_CONFIG, PROCUREMENT_STATUS_CONFIG, ISSUE_STATUS_CONFIG } from '../../utils/statusConfigs';

export const StatusBadge = ({ status, type = "default", className = "" }) => {
  let config;
  
  switch (type) {
    case 'priority':
      config = PRIORITY_CONFIG[status.toLowerCase()] || {};
      break;
    case 'procurement':
      config = PROCUREMENT_STATUS_CONFIG[status.toLowerCase()] || {};
      break;
    case 'issue':
      config = ISSUE_STATUS_CONFIG[status.toLowerCase()] || {};
      break;
    default:
      config = STATUS_CONFIG[status.toLowerCase()] || {};
  }

  const Icon = config.icon;

  if (type === 'priority') {
    return (
      <Badge className={`${config.color || "bg-gray-400"} text-white flex items-center gap-1 ${className}`}>
        {Icon && <Icon className="h-3 w-3" />}
        {status}
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={`${config.color || "bg-gray-50 text-gray-700 border-gray-200"} flex items-center gap-1 ${className}`}>
      {Icon && <Icon className="h-3 w-3" />}
      {status}
    </Badge>
  );
};
