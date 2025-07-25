// components/Tabs/OverviewTab.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Building, User, MapPin, Calendar } from "lucide-react";
import { formatDate } from '../../utils/formatters';

export const OverviewTab = ({ requisition }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BasicInfoCard requisition={requisition} />
        <SiteInfoCard requisition={requisition} />
        <PersonnelCard requisition={requisition} />
      </div>
    </div>
  );
};

// Basic Info Card Component
const BasicInfoCard = ({ requisition }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <FileText className="h-5 w-5" />
        Basic Information
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Requisition No</p>
          <p className="font-medium">{requisition.requisitionNo}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Charge Type</p>
          <p className="font-medium">{requisition.chargeType}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Due Date</p>
          <p className="font-medium">
            {requisition.dueDate
              ? new Date(requisition.dueDate).toLocaleDateString()
              : "Not specified"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Requested For</p>
          <p className="font-medium">{requisition.requestedFor || "N/A"}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);
