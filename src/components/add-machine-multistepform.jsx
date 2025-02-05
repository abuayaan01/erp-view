import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Step1 = ({ onNext }) => {
  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <Label>Primary Category</Label>
          <Input
            placeholder=""
            {...onNext.register("primaryCategoryId", { required: true })}
            type="text"
          />
        </div>

        <div className="col-span-6">
          <Label>Machine Category</Label>
          <Input
            placeholder=""
            {...onNext.register("machineCategoryId", { required: true })}
            type="text"
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
          <Label htmlFor="siteId">Site</Label>
          <Input
            id="siteId"
            {...onNext.register("siteId", { required: true })}
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
          <Input id="purchaseDate" {...onNext.register("purchaseDate", { required: true })} />
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
      <div className="grid grid-cols-12 gap-4">
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
      </div>
    </>
  );
};

const Sidebar = ({ steps, currentStep, navigateToStep }) => {
  return (
    <aside className="bg-gray-100 mb-4 rounded p-4">
      <ul className="flex gap-4">
        {steps.map((step, index) => (
          <li key={index}>
            <Button
              variant={currentStep === index + 1 ? "default" : "outline"}
              onClick={() => navigateToStep(index + 1)}
              className="w-full"
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
  const methods = useForm({
    defaultValues: { name: "", email: "", password: "" },
  });
  const { handleSubmit, watch, setValue } = methods;
  const [step, setStep] = useState(1);

  const navigateToStep = (stepNumber) => {
    setStep(stepNumber);
  };

  const handleNext = (data) => {
    Object.keys(data).forEach((key) => setValue(key, data[key]));
    setStep(step + 1);
  };

  const handleFinalSubmit = (data) => {
    console.log("Final Form Data:", data);
    alert("Form submitted successfully!");
  };

  const steps = [
    "General Details",
    "Machine Info.",
    "Documents",
    "Owner Info.",
  ];
  const StepComponent = [Step1, Step2, Step3, Step4][step - 1];

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
              onSubmit={handleSubmit(step < 3 ? handleNext : handleFinalSubmit)}
              className="space-y-4 "
            >
              <StepComponent onNext={methods} />
              <div className="flex justify-between mt-4">
                {step > 1 && (
                  <Button variant="outline" onClick={() => setStep(step - 1)}>
                    Back
                  </Button>
                )}
                <Button type="submit">{step < 3 ? "Next" : "Submit"}</Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default AddMachineMultiStepForm;
