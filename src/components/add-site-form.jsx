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

const formSchema = z.object({
  site_name: z.string().nonempty(),
  site_code: z.string().nonempty(),
  site_address: z.string().nonempty(),
});

export default function AddSiteForm() {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "", // Set initial value for site_name
      site_code: "", // Set initial value for site_code
      site_address: "", // Set initial value for site_address
    },
  });

  function onSubmit(values) {
    try {
      console.log(values);
      toast(
        {
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Incorrect input",
        }
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
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
              name="site_name"
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
              name="site_code"
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
          name="site_address"
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
