import Text from "@/components/ui/text";
import AddSiteForm from "@/components/add-site-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SiteList from "@/components/site-table";

function Page() {
  return (
    <div>
      <Text>Site Management</Text>
      <div>
        <AddSiteDialog />
        <SiteList />
      </div>
    </div>
  );
}

function AddSiteDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add site</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Register a new site</DialogTitle>
          <DialogDescription>
            Add site detail to create a new site. Click submit when you're done.
          </DialogDescription>
        </DialogHeader>
        <AddSiteForm />
      </DialogContent>
    </Dialog>
  );
}

export default Page;
