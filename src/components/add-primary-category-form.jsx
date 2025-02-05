import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast, useToast } from "@/hooks/use-toast";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { fetchMachineCategories } from "@/features/machine-category/machine-category-slice";
import api from "@/services/api/api-service";

// Validation schema using zod
const formSchema = z.object({
  primaryCategoryId: z.string().nonempty("Primary Category is required"),
  name: z.string().nonempty("Machine Category is required"),
  machineType: z.enum(["Vehicle", "Machine", "Drilling"], {
    errorMap: () => ({ message: "Please select a Machine Type" }),
  }),
  // applicableFor: z
  //   .array(z.string())
  //   .min(1, "You must select at least one applicable item."),
  standardKmRun: z.string().regex(/^\d*$/, "Must be a valid number"),
  standardHrsRun: z.string().regex(/^\d*$/, "Must be a valid number"),
  standardMileage: z.string().regex(/^\d*$/, "Must be a valid number"),
  itrPerHour: z.string().regex(/^\d*$/, "Must be a valid number"),
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
  const dispatch = useDispatch();
  const { data, loading } =
    useSelector((state) => state.primaryCategories) || [];
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      primaryCategoryId: "",
      name: "",
      machineType: "",
      standardKmRun: null,
      standardHrsRun: null,
      standardMileage: null,
      itrPerHour: null,
    },
  });

  async function onSubmit(values) {
    console.log("first", values);
    try {
      const res = await api.post("/category/machine", values);
      console.log(res);
      toast({
        title: "Success! ",
        description: "Machine category created successfully",
      });
      dispatch(fetchMachineCategories());
      close();
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          error.response.data.message || "Failed to submit the form.",
      });
    }
  }
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
              name="primaryCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Category</FormLabel>
                  <Select
                    onValueChange={field.onChange} // This will update the form value with the selected id
                    value={field.value} // This will sync the form's value with the Select component
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select a category"
                          // Display the name of the selected item based on the id stored in field.value
                          value={
                            data?.find((item) => item.id === field.value)
                              ?.name || "Select a category"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {data?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} {/* Display the name */}
                        </SelectItem>
                      ))}
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
              name="name"
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
        {/* <FormField
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
        /> */}

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
                    <RadioGroupItem value="Vehicle" />
                  </FormControl>
                  <FormLabel>Vehicle</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 mr-2 space-y-1">
                  <FormControl>
                    <RadioGroupItem value="Machine" />
                  </FormControl>
                  <FormLabel>Machine</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 mr-2 space-y-1">
                  <FormControl>
                    <RadioGroupItem value="rilling" />
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
              name="standardKmRun"
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
              name="standardHrsRun"
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
              name="itrPerHour"
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
export function UpdateMachineCategory({ data }) {
  const [openForm, setOpenForm] = useState(false);
  const closeForm = () => setOpenForm(false);
  const { toast } = useToast();
  const dispatch = useDispatch();

  const form = useForm({
    defaultValues: {
      name: data.name || "",
      averageBase: data.averageBase || "",
      remarks: data.remarks || "",
    },
  });

  async function onSubmit(values) {
    try {
      await api.put(`/category/machine/${data.id}`, values);
      toast({
        title: "Success!",
        description: "Machine category updated successfully",
      });
      dispatch(fetchMachineCategories());
      closeForm();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update machine category",
      });
    }
  }

  return (
    <Dialog open={openForm} onOpenChange={setOpenForm}>
      <DialogTrigger>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Machine Category</DialogTitle>
          <DialogDescription>
            Modify category details and click submit.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
