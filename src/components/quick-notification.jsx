import React from "react";
import { Bell, BellOff, Eye } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Text from "./ui/text";

const data = [
  {
    from: {
      name: 'Abu Ayaan',
      userId: 1,
      avatar: 'https://creatorindia.netlify.app/media/ayaan_closeimg_4574.webp'
    },
    label: "Request for machine allocation",
    message: "JCB required for Bokaro Site"
  },
  {
    from: {
      name: 'Daniel Hamn',
      userId: 1,
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp_KcABC9F1SCm9NrTOIKAyz_bFEIV5tXQWw&s'
    },
    label: "Request for refueling",
    message: "Need 100 tankers at xyz"
  }

]

function Notification() {
  return (
    <>
      <Popover>
        <PopoverTrigger className="mx-4">
          <Button variant="outline" size="icon">
            <Bell className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          </Button>
        </PopoverTrigger>
        <PopoverContent sideOffset={5} align={"end"}>
          <Label className="flex justify-center">Notifications</Label>
          <Separator className="my-4" />
          {
            data.length > 4 ? <>
            {
              data.map((item) => {
                return (
                  <>
                    <div className="flex gap-2 items-end my-2">
                      <Avatar className={"border-2"}>
                        <AvatarImage src={item.from.avatar} />
                        <AvatarFallback>AA</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <Label className={"text-sm"}>{item.label}</Label>
                        <Text>{item.message}</Text>
                      </div>
                    </div>
                  </>
                )
              })}
              <Separator />
              <div className="flex justify-center mt-4">
                <Button size="sm" variant="ghost" className={"flex items-center text-muted-foreground"}><Eye className="mb-[2px]" />View all</Button>
              </div>
              </>
              :
              <div className="my-8 flex flex-col justify-center items-center gap-6 opacity-[50%]">
                <BellOff className="p-2 bg-secondary rounded-full" size={64} strokeWidth={0.5} />
                <p className="text-center font-sm text-xs text-slate">
                  You’re all caught up! Check back later for new notifications
                </p>
              </div>}
        </PopoverContent>
      </Popover>
    </>
  );
}

export default Notification;
