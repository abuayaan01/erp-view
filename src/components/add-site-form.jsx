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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import api from "@/services/api/api-service";

const formSchema = z.object({
  name: z.string().nonempty(),
  code: z.string().nonempty(),
  address: z.string().nonempty(),
  departmentId: z.number(),
});

export default function AddSiteForm({ getSites, close }) {
  const { toast } = useToast();

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
    try {
      const res = await api.post("/sites", values);
      console.log(res);
      getSites();
      toast({
        title: "Success! ",
        description: "Site created successfully",
      });
      close();
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.response.data.message,
      });
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
