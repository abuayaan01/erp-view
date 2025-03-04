import React, { useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/services/api/api-service";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { FormItem, FormLabel } from "./ui/form";
import SelectDropdown from "./ui/select-dropdown";
import { useSelector } from "react-redux";

const Step1 = ({ onNext, primaryCategories, machineCategories, siteList }) => {
  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <SelectDropdown
            label={"Primary Category"}
            name={"primaryCategoryId"}
            data={primaryCategories}
            control={onNext.control}
          />
        </div>

        <div className="col-span-6">
          <SelectDropdown
            label={"Machine Category"}
            name={"machineCategoryId"}
            data={machineCategories}
            control={onNext.control}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <Label htmlFor="machineName">Machine Name</Label>
          <Input
            id="machineName"
            {...onNext.register("machineName", { required: true })}
          />
        </div>

        <div className="col-span-6">
          <Label htmlFor="registrationNumber">Registration Number</Label>
          <Input
            id="registrationNumber"
            {...onNext.register("registrationNumber", { required: true })}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <Label htmlFor="machineNumber">Machine Number</Label>
          <Input
            id="machineNumber"
            {...onNext.register("machineNumber", { required: true })}
          />
        </div>

        <div className="col-span-6">
          <Label htmlFor="machineCode">Machine Code</Label>
          <Input
            id="machineCode"
            {...onNext.register("machineCode", { required: true })}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <Label htmlFor="erpCode">ERP Code</Label>
          <Input
            id="erpCode"
            {...onNext.register("erpCode", { required: true })}
          />
        </div>
        <div className="col-span-6">
          <SelectDropdown
            label={"Allocate Site"}
            name={"siteId"}
            data={siteList}
            control={onNext.control}
          />
        </div>
      </div>
    </>
  );
};

const Step2 = ({ onNext }) => {
  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <Label htmlFor="chassisNumber">Chassis Number</Label>
          <Input
            id="chassisNumber"
            {...onNext.register("chassisNumber", { required: true })}
          />
        </div>

        <div className="col-span-6">
          <Label htmlFor="engineNumber">Engine Number</Label>
          <Input
            id="engineNumber"
            {...onNext.register("engineNumber", { required: true })}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <Label htmlFor="serialNumber">Serial Number</Label>
          <Input
            id="serialNumber"
            {...onNext.register("serialNumber", { required: true })}
          />
        </div>

        <div className="col-span-6">
          <Label htmlFor="model">Model</Label>
          <Input id="model" {...onNext.register("model", { required: true })} />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <Label htmlFor="make">Make</Label>
          <Input id="make" {...onNext.register("make", { required: true })} />
        </div>

        <div className="col-span-6">
          <Label htmlFor="purchaseDate">Purchase Date</Label>
          <Input
            id="purchaseDate"
            {...onNext.register("purchaseDate", { required: true })}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <Label htmlFor="yom">Year of Manufacture</Label>
          <Input
            id="yom"
            type="number"
            {...onNext.register("yom", { required: true })}
          />
        </div>

        <div className="col-span-6">
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            {...onNext.register("capacity", { required: true })}
          />
        </div>
      </div>
    </>
  );
};

const Step3 = ({ onNext }) => {
  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <Label htmlFor="fitnessCertificateExpiry">
            Fitness Certificate Expiry
          </Label>
          <Input
            id="fitnessCertificateExpiry"
            type="date"
            {...onNext.register("fitnessCertificateExpiry", { required: true })}
          />
          <Input
            id="fitnessCertificateFile"
            type="file"
            {...onNext.register("fitnessCertificateFile")}
          />
        </div>
        <div className="col-span-6">
          <Label htmlFor="motorVehicleTaxDue">Motor Vehicle Tax Due</Label>
          <Input
            id="motorVehicleTaxDue"
            type="date"
            {...onNext.register("motorVehicleTaxDue", { required: true })}
          />
          <Input
            id="motorVehicleTaxFile"
            type="file"
            {...onNext.register("motorVehicleTaxFile")}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <Label htmlFor="permitExpiryDate">Permit Expiry Date</Label>
          <Input
            id="permitExpiryDate"
            type="date"
            {...onNext.register("permitExpiryDate", { required: true })}
          />
          <Input
            id="permitFile"
            type="file"
            {...onNext.register("permitFile")}
          />
        </div>

        <div className="col-span-6">
          <Label htmlFor="nationalPermitExpiry">National Permit Expiry</Label>
          <Input
            id="nationalPermitExpiry"
            type="date"
            {...onNext.register("nationalPermitExpiry", { required: true })}
          />
          <Input
            id="nationalPermitFile"
            type="file"
            {...onNext.register("nationalPermitFile")}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <Label htmlFor="insuranceExpiry">Insurance Expiry</Label>
          <Input
            id="insuranceExpiry"
            type="date"
            {...onNext.register("insuranceExpiry", { required: true })}
          />
          <Input
            id="insuranceFile"
            type="file"
            {...onNext.register("insuranceFile")}
          />
        </div>

        <div className="col-span-6">
          <Label htmlFor="pollutionCertificateExpiry">
            Pollution Certificate Expiry
          </Label>
          <Input
            id="pollutionCertificateExpiry"
            type="date"
            {...onNext.register("pollutionCertificateExpiry", {
              required: true,
            })}
          />
          <Input
            id="pollutionCertificateFile"
            type="file"
            {...onNext.register("pollutionCertificateFile")}
          />
        </div>

        <div className="col-span-6">
          <Label htmlFor="machineImageFile">
            Machine Image
          </Label>
          <Input
            id="machineImageFile"
            type="file"
            {...onNext.register("machineImageFile")}
          />
        </div>
      </div>
    </>
  );
};

const Step4 = ({ onNext }) => {
  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input
            id="ownerName"
            {...onNext.register("ownerName", { required: true })}
          />
        </div>

        <div className="col-span-6">
          <Label htmlFor="ownerType">Owner Type</Label>
          <Input
            id="ownerType"
            {...onNext.register("ownerType", { required: true })}
          />
        </div>
      </div>
      {/* <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <Label htmlFor="ownerPhone">Owner Phone.</Label>
          <Input
            id="ownerPhone"
            {...onNext.register("ownerPhone", { required: true })}
          />
        </div>

        <div className="col-span-6">
          <Label htmlFor="ownerAddress">Owner Address</Label>
          <Input
            id="ownerAddress"
            {...onNext.register("ownerAddress", { required: true })}
          />
        </div>
      </div> */}
    </>
  );
};

const Sidebar = ({ steps, currentStep, navigateToStep }) => {
  return (
    <aside className="bg-accent mb-2 rounded p-4">
      <ul className="flex gap-4">
        {steps.map((step, index) => (
          <li key={index}>
            <Button
              variant={currentStep === index + 1 ? "default" : "outline"}
              onClick={() => navigateToStep(index + 1)}
              className="w-full text-xs"
            >
              {step}
            </Button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

const AddMachineMultiStepForm = () => {
  const [step, setStep] = useState(1);

  const { data: primaryCategories } =
    useSelector((state) => state.primaryCategories) || [];

  const { data: machineCategories } =
    useSelector((state) => state.machineCategories) || [];

  const { data: siteList } = useSelector((state) => state.sites) || [];

  const { toast } = useToast();

  const methods = useForm({
    defaultValues: {
      isActive: true,
      status: "Idle",
    },
  });

  const { handleSubmit, watch, setValue } = methods;

  const navigateToStep = (stepNumber) => {
    setStep(stepNumber);
  };

  const handleNext = (data) => {
    // Save the current step data
    Object.keys(data).forEach((key) => setValue(key, data[key]));

    setStep((prevStep) => {
      const nextStep = prevStep + 1;
      return nextStep;
    });
  };

  const handleFinalSubmit = async (data) => {
    const formData = new FormData();

    // Loop through the form data and append to formData
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof FileList) {
        // Append files properly
        Array.from(value).forEach((file) => formData.append(key, file));
      } else {
        formData.append(key, value);
      }
    });

    console.log("Final Form Data:", Object.fromEntries(formData.entries()));

    try {
      const res = await api.post("/machinery", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res);
      toast({
        title: "Success! ",
        description: "Site created successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          error.response.data.message || "Failed to submit the form.",
      });
    }
  };

  const steps = [
    "General Details",
    "Machine Info.",
    "Owner Info.",
    "Documents",
  ];

  const StepComponent = [Step1, Step2, Step4, Step3][step - 1];

  return (
    <div className="flex flex-col">
      <Sidebar
        steps={steps}
        currentStep={step}
        navigateToStep={navigateToStep}
      />
      <div>
        <div className="max-w-4xl py-4">
          <FormProvider {...methods}>
            <form
              // onSubmit={handleSubmit(step < 4 ? handleNext : handleFinalSubmit)}
              onSubmit={(e) => {
                e.preventDefault(); // Prevent default form submission
                handleSubmit(step < 4 ? handleNext : handleFinalSubmit)();
              }}
              className="space-y-4 "
            >
              <StepComponent
                key={step}
                primaryCategories={primaryCategories}
                machineCategories={machineCategories}
                siteList={siteList}
                onNext={methods}
              />
              <div className="flex justify-between mt-4">
                {step > 1 && (
                  <span
                    className={
                      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground px-4 py-2 h-9 cursor-pointer"
                    }
                    onClick={() => {
                      setStep((prev) => Math.max(prev - 1, 1));
                    }}
                  >
                    Back
                  </span>
                )}
                <Button type="submit">{step < 4 ? "Next" : "Submit"}</Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default AddMachineMultiStepForm;
