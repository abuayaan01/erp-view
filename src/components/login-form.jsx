import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch } from "react-redux";
import { login } from "@/features/auth/auth-slice";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api/api-service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email().nonempty(),
  password: z.string().nonempty(),
});

export function LoginForm({ className, ...props }) {
  // const [department, setDepartment] = useState();
  // const [role, setRole] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "", // Set initial value for site_name
      password: "", // Set initial value for site_code
    },
  });

  const dispatch = useDispatch();
  const { toast } = useToast();

  const loginReq = async (e) => {
    e.preventDefault();
    
    const user = {
      email: username,
      password: password,
    };

    let res = await api.post("auth/login", user);
    // res = {
    //   id: 21,
    //   name: "Manish Kumar",
    //   email: "manish@gmail.com",
    //   roleId: 1,
    //   departmentId: null,
    //   siteId: null,
    // };

    console.log(res);

    dispatch(login(user));

    // if (
    //   username == "abu.ayaan" &&
    //   password == "12345" &&
    //   department == "mechanical" &&
    //   role == "admin"
    // ) {
    //   dispatch(login(user));
    // } else {
    //   toast({
    //     variant: "destructive",
    //     title: "Uh oh! Something went wrong.",
    //     description: "There was a problem with your request.",
    //   })
    // }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your credentials below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        {/* <div className="grid gap-2">
          <Label htmlFor="role">Select Department</Label>
          <Select onValueChange={(value) => setDepartment(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select department</SelectLabel>
                <SelectItem value="mechanical">Mechanical</SelectItem>
                <SelectItem value="civil">Civil</SelectItem>
                <SelectItem value="inventory">Inventory</SelectItem>
                <SelectItem value="accounts">Accounts</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="role">Select role</Label>
          <Select onValueChange={(value) => setRole(value)}>
            <SelectTrigger className="w-full">
              <SelectValue
                onSelect={(e) => setRole(e.target.value)}
                placeholder="Select role"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select role</SelectLabel>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="site-manager">Site Manager</SelectItem>
                <SelectItem value="machine-manager">Machine Manager</SelectItem>
                <SelectItem value="hr">
                  Human Resources Manager (HRM)
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div> */}
        <div className="grid gap-2">
          <Label htmlFor="email">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="john.doe@bpc.com"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button onClick={loginReq} className="w-full">
          Login
        </Button>
      </div>
    </form>
  );
}
