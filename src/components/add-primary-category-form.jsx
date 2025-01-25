import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

// Validation schema using zod
const formSchema = z.object({
  primaryCategory: z.string().nonempty("Primary Category is required"),
  machineCategory: z.string().nonempty("Machine Category is required"),
  machineType: z.enum(["vehicle", "machine", "drilling"], {
    errorMap: () => ({ message: "Please select a Machine Type" }),
  }),
  applicableFor: z
    .array(z.string())
    .min(1, "You must select at least one applicable item."),
  standardRunKm: z.string().regex(/^\d*$/, "Must be a valid number"),
  standardRunHrs: z.string().regex(/^\d*$/, "Must be a valid number"),
  standardMileage: z.string().regex(/^\d*$/, "Must be a valid number"),
  standardMileageHr: z.string().regex(/^\d*$/, "Must be a valid number"),
});

const items = [
  { id: "insurance", label: "Insurance" },
  { id: "permit", label: "Permit" },
  { id: "fitness", label: "Fitness" },
  { id: "tax", label: "Tax" },
  { id: "puc", label: "PUC" },
  { id: "welfare", label: "Welfare" },
  { id: "iForm", label: "I Form" },
  { id: "greenTax", label: "Green Tax" },
];

export default function AddPrimaryCategoryForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      primaryCategory: "",
      machineCategory: "",
      machineType: "",
      applicableFor: [],
      standardRunKm: "",
      standardRunHrs: "",
      standardMileage: "",
      standardMileageHr: "",
    },
  });

  const onSubmit = (values) => {
    try {
      console.log("Form Values:", values);
      toast({
        title: "Form Submitted",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(values, null, 2)}
            </code>
          </pre>
        ),
      });
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-3xl py-6"
      >
        {/* Primary and Machine Category */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="primaryCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="category1">Category 1</SelectItem>
                      <SelectItem value="category2">Category 2</SelectItem>
                      <SelectItem value="category3">Category 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="machineCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Machine Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Machine Category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Applicable For */}
        <FormField
          control={form.control}
          name="applicableFor"
          render={() => (
            <FormItem>
              <FormLabel>Applicable For</FormLabel>
              <div className="flex flex-wrap gap-4">
                {items.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="applicableFor"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) =>
                              checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value.filter(
                                      (value) => value !== item.id
                                    )
                                  )
                            }
                          />
                        </FormControl>
                        <FormLabel>{item.label}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Machine Type */}
        <FormField
          control={form.control}
          name="machineType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Machine Type</FormLabel>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-row"
              >
                <FormItem className="flex items-center space-x-2 mr-2 space-y-1">
                  <FormControl>
                    <RadioGroupItem value="vehicle" />
                  </FormControl>
                  <FormLabel>Vehicle</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 mr-2 space-y-1">
                  <FormControl>
                    <RadioGroupItem value="machine" />
                  </FormControl>
                  <FormLabel>Machine</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 mr-2 space-y-1">
                  <FormControl>
                    <RadioGroupItem value="drilling" />
                  </FormControl>
                  <FormLabel>Drilling</FormLabel>
                </FormItem>
              </RadioGroup>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-6">
          <FormField
            control={form.control}
            name="averageBase"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Average Base</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row gap-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-1">
                      <FormControl>
                        <RadioGroupItem value="Distance" />
                      </FormControl>
                      <FormLabel className="font-normal">Distance</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-1">
                      <FormControl>
                        <RadioGroupItem value="Time" />
                      </FormControl>
                      <FormLabel className="font-normal">Time</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-1">
                      <FormControl>
                        <RadioGroupItem value="Both" />
                      </FormControl>
                      <FormLabel className="font-normal">Both</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-1">
                      <FormControl>
                        <RadioGroupItem value="None" />
                      </FormControl>
                      <FormLabel className="font-normal">None</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Standard Runs and Mileage */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="standardRunKm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Standard KM Run (In Month)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter KM" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="standardRunHrs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Standard Hrs. Run (In Month)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Hours" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="standardMileage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Standard Mileage (Km/Ltr)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Mileage" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="standardMileageHr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ltr/hour</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Litres per Hour" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit">Add Category</Button>
      </form>
    </Form>
  );
}
