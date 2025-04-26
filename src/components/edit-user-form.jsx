import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Eye, EyeOff } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import api from "@/services/api/api-service";
import { getIdByRole, ROLES } from "@/utils/roles";
import { useSelector } from "react-redux";

const editFormSchema = z.object({
  name: z.string().min(3),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10),
  code: z.string().min(3),
  roleId: z.string().min(1),
  siteId: z.string(),
  password: z.string().optional(),
  confirm_password: z.string().optional(),
});

export default function EditUserForm({ userData, fetchUsersData, close }) {
  const { toast } = useToast();
  const { data: sites } = useSelector((s) => s.sites);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
      code: userData.code || "",
      roleId: userData.roleName || "", // assuming userData has roleName
      siteId: userData.siteName || "", // assuming userData has siteName
      password: "",
      confirm_password: "",
    },
  });

  async function onSubmit(values) {
    setLoading(true);
    try {
      if (values.password && values.password !== values.confirm_password) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Password and Confirm Password must be same.",
        });
        return;
      }

      const updatedData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        code: values.code,
        roleId: getIdByRole(values.roleId),
        siteId: sites.find((site) => values.siteId === site.name)?.id,
      };

      if (values.password) {
        updatedData.password = values.password;
      }

      await api.put(`/users/${userData.id}`, updatedData);

      toast({
        title: "Success! ",
        description: "User updated successfully",
      });

      fetchUsersData();
      close();
    } catch (error) {
      console.error(
        "Form submission error",
        error.response?.data?.message || error
      );
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          error.response?.data?.message || "Failed to update the user.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-3xl"
      >
        {/* Name + Email */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Wick" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@domain.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Phone + Employee Code */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone No.</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
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
                  <FormLabel>Employee Code</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Role + Site */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ROLES).map((role) => (
                        <SelectItem key={role.name} value={role.name}>
                          {role.name}
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
              name="siteId"
              render={({ field }) => (
                <FormItem className="flex flex-col mt-2">
                  <FormLabel>Site</FormLabel>
                  <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? sites.find((site) => site.name === field.value)?.name
                            : "Select site"}
                          <ChevronsUpDown className="opacity-50 ml-2" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search sites..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No sites found.</CommandEmpty>
                          <CommandGroup>
                            {sites.map((site) => (
                              <CommandItem
                                key={site.name}
                                value={site.name}
                                onSelect={() => {
                                  form.setValue("siteId", site.name);
                                  setPopoverOpen(false);
                                }}
                              >
                                {site.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    site.name === field.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Password (Optional) */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button loading={loading} type="submit">
          Update User
        </Button>
      </form>
    </Form>
  );
}
