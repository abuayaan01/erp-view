import React from "react";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
function Notification() {
  return (
    <Popover>
      <PopoverTrigger>
        <Bell />
      </PopoverTrigger>
      <PopoverContent>Helllllo</PopoverContent>
    </Popover>
  );
}

export default Notification;
