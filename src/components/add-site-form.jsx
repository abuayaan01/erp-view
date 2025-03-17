import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import api from "@/services/api/api-service";
import { useDispatch } from "react-redux";
import { fetchSites } from "@/features/sites/sites-slice";


const formSchema = z.object({
  name: z.string().trim().min(1, "Site Name is required"),
  code: z.string().trim().min(1, "Site Code is required"),
  address: z.string().trim().min(1, "Site Address is required"),
  departmentId: z.number(),
});

export default function AddSiteForm({ close }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "", // Set initial value for name
      code: "", // Set initial value for code
      address: "", // Set initial value for address
      departmentId: 1,
    },
  });

  async function onSubmit(values) {
    setLoading(true);
    try {
      const res = await api.post("/sites", values);
      toast({
        title: "Success! ",
        description: "Site created successfully",
      });
      dispatch(fetchSites());
      close();
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          error.response.data.message || "Failed to submit the form.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-3xl py-4"
      >
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Code</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site Address</FormLabel>
              <FormControl>
                <Textarea placeholder="" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button loading={loading} type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export function UpdateSite({ data }) {
  const [openForm, setOpenForm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const closeForm = () => {
    setOpenForm(false);
  };

  const { toast } = useToast();
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data.name || "",
      code: data.code || "",
      address: data.address || "",
      departmentId: 1,
    },
  });

  async function onSubmit(values) {
    console.log("asdasdasdasd")
    setLoading(true);
    try {
      const res = await api.put(`/sites/${data.id}`, values);
      console.log(res);
      toast({
        title: "Success!",
        description: "Site updated successfully",
      });
      closeForm();
      dispatch(fetchSites());
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          error.response?.data?.message || "Failed to submit the form.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={openForm} onOpenChange={setOpenForm} onKeyDown={(event) => event.stopPropagation()}>
      <DialogTrigger asChild>
        <button onClick={() => setOpenForm(true)} variant="outline">
          Edit
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Update the site</DialogTitle>
          <DialogDescription>
            Add site detail to update the site. Click submit when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 max-w-3xl py-4"
          >
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="" {...field} onKeyDown={(event) => event.stopPropagation()} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Code</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="" {...field} onKeyDown={(event) => event.stopPropagation()} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="" className="resize-none" {...field} onKeyDown={(event) => event.stopPropagation()} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button loading={loading} type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
