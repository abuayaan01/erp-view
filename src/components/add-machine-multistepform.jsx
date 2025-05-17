"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import api from "@/services/api/api-service"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { z } from "zod"
import { FormMessage } from "./ui/form"
import SelectDropdown from "./ui/select-dropdown"
import { useNavigate } from "react-router"
import { fetchMachines } from "@/features/machine/machine-slice"

// Replace the getCategoryFieldConfig function with this new function based on machineType
const getFieldConfigByMachineType = (machineType) => {
  // Default configuration - all fields required
  const defaultConfig = {
    // Step 1
    registrationNumber: true,
    machineCode: true,

    // Step 2
    engineNumber: true,
    serialNumber: true,
    model: true,
    make: true,
    purchaseDate: true,
    yom: true,
    capacity: true,

    // Step 3
    fitnessCertificateExpiry: true,
    motorVehicleTaxDue: true,
    permitExpiryDate: true,
    nationalPermitExpiry: true,
    insuranceExpiry: true,
    pollutionCertificateExpiry: true,
  }

  // Machine type specific configurations
  const machineTypeConfigs = {
    // For vehicles
    Vehicle: {
      // All fields are required for vehicles
    },

    // For machines (non-vehicles)
    Machine: {
      // Machines don't need vehicle-specific documents
      registrationNumber: false,
      motorVehicleTaxDue: false,
      permitExpiryDate: false,
      nationalPermitExpiry: false,
      pollutionCertificateExpiry: false,
    },

    // For drilling equipment
    Drilling: {
      // Drilling equipment doesn't need vehicle-specific documents and some other fields
      registrationNumber: false,
      motorVehicleTaxDue: false,
      permitExpiryDate: false,
      nationalPermitExpiry: false,
      pollutionCertificateExpiry: false,
      // May have different technical requirements
      engineNumber: false,
    },
  }

  // Return the machine type config or default if not found
  return machineType && machineTypeConfigs[machineType]
    ? { ...defaultConfig, ...machineTypeConfigs[machineType] }
    : defaultConfig
}

// Define which fields are required for each machine category
const getCategoryFieldConfig = (categoryId) => {
  // Default configuration - all fields required
  const defaultConfig = {
    // Step 1
    registrationNumber: true,
    machineCode: true,

    // Step 2
    engineNumber: true,
    serialNumber: true,
    model: true,
    make: true,
    purchaseDate: true,
    yom: true,
    capacity: true,

    // Step 3
    fitnessCertificateExpiry: true,
    motorVehicleTaxDue: true,
    permitExpiryDate: true,
    nationalPermitExpiry: true,
    insuranceExpiry: true,
    pollutionCertificateExpiry: true,
  }

  // Category specific configurations
  const categoryConfigs = {
    // Example: For stationary equipment (assuming ID 1)
    1: {
      registrationNumber: false,
      motorVehicleTaxDue: false,
      permitExpiryDate: false,
      nationalPermitExpiry: false,
      pollutionCertificateExpiry: false,
    },
    // Example: For non-motorized equipment (assuming ID 2)
    2: {
      engineNumber: false,
      motorVehicleTaxDue: false,
      permitExpiryDate: false,
      nationalPermitExpiry: false,
      insuranceExpiry: false,
      pollutionCertificateExpiry: false,
    },
    // Add more category-specific configurations as needed
  }

  // Return the category config or default if not found
  return categoryId && categoryConfigs[categoryId]
    ? { ...defaultConfig, ...categoryConfigs[categoryId] }
    : defaultConfig
}

// Modify the Step1 component to track machineType
const Step1 = ({ onNext, primaryCategories, machineCategories, siteList, watch, setValue, setMachineType }) => {
  const [machineCat, setMachineCat] = useState([])
  const pcid = watch("primaryCategoryId")
  const mcid = watch("machineCategoryId")

  useEffect(() => {
    const machineCategory = primaryCategories.find((item) => item.id == pcid)
    if (machineCategory) {
      setMachineCat(machineCategory.machineCategories)
      // Reset machine category when primary category changes
      setValue("machineCategoryId", "")
      setMachineType(null) // Reset machine type
    }
  }, [pcid, setValue, setMachineType])

  useEffect(() => {
    if (mcid) {
      // Find the selected machine category to get its machineType
      const allCategories = machineCategories || []
      const selectedCategory = allCategories.find((cat) => cat.id == mcid)

      if (selectedCategory && selectedCategory.machineType) {
        setMachineType(selectedCategory.machineType)
      } else {
        // If no machineType is found, default to "Machine"
        setMachineType("Machine")
      }
    }
  }, [mcid, machineCategories, setMachineType])

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <SelectDropdown
            label={"Primary Category *"}
            name={"primaryCategoryId"}
            data={primaryCategories}
            control={onNext.control}
          />
          {onNext.formState.errors.primaryCategoryId && (
            <FormMessage>Please select a valid primary category</FormMessage>
          )}
        </div>

        <div className="col-span-6">
          <SelectDropdown
            label={"Machine Category *"}
            name={"machineCategoryId"}
            data={machineCat}
            control={onNext.control}
          />
          {onNext.formState.errors.machineCategoryId && (
            <FormMessage>Please select a valid machine category</FormMessage>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <Label htmlFor="machineName">Machine Name *</Label>
          <Input id="machineName" {...onNext.register("machineName", { required: true })} />
          {onNext.formState.errors.machineName && (
            <FormMessage>{onNext.formState.errors.machineName.message}</FormMessage>
          )}
        </div>

        <div className="col-span-6">
          <Label htmlFor="registrationNumber">Registration Number</Label>
          <Input id="registrationNumber" {...onNext.register("registrationNumber", { required: true })} />
          {onNext.formState.errors.registrationNumber && (
            <FormMessage>{onNext.formState.errors.registrationNumber.message}</FormMessage>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <Label htmlFor="machineNumber">Machine Number *</Label>
          <Input id="machineNumber" {...onNext.register("machineNumber", { required: true })} />
          {onNext.formState.errors.machineNumber && (
            <FormMessage>{onNext.formState.errors.machineNumber.message}</FormMessage>
          )}
        </div>

        <div className="col-span-6">
          <Label htmlFor="machineCode">Machine Code</Label>
          <Input id="machineCode" {...onNext.register("machineCode", { required: true })} />
          {onNext.formState.errors.machineCode && (
            <FormMessage>{onNext.formState.errors.machineCode.message}</FormMessage>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* <div className="col-span-6">
          <Label htmlFor="erpCode">ERP Code</Label>
          <Input
            id="erpCode"
            {...onNext.register("erpCode", { required: true })}
          />
          {onNext.formState.errors.erpCode && (
            <FormMessage>{onNext.formState.errors.erpCode.message}</FormMessage>
          )}
        </div> */}
        <div className="col-span-6">
          <SelectDropdown label={"Allocate Site *"} name={"siteId"} data={siteList} control={onNext.control} />
          {onNext.formState.errors.siteId && <FormMessage>Please select a valid site</FormMessage>}
        </div>
      </div>
    </>
  )
}

const Step2 = ({ onNext, fieldConfig }) => {
  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <Label htmlFor="chassisNumber">Chassis Number *</Label>
          <Input id="chassisNumber" {...onNext.register("chassisNumber", { required: true })} />
          {onNext.formState.errors.chassisNumber && (
            <FormMessage>{onNext.formState.errors.chassisNumber.message}</FormMessage>
          )}
        </div>

        {fieldConfig.engineNumber && (
          <div className="col-span-6">
            <Label htmlFor="engineNumber">Engine Number</Label>
            <Input id="engineNumber" {...onNext.register("engineNumber", { required: fieldConfig.engineNumber })} />
            {onNext.formState.errors.engineNumber && (
              <FormMessage>{onNext.formState.errors.engineNumber.message}</FormMessage>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {fieldConfig.serialNumber && (
          <div className="col-span-6">
            <Label htmlFor="serialNumber">Serial Number</Label>
            <Input id="serialNumber" {...onNext.register("serialNumber", { required: fieldConfig.serialNumber })} />
            {onNext.formState.errors.serialNumber && (
              <FormMessage>{onNext.formState.errors.serialNumber.message}</FormMessage>
            )}
          </div>
        )}

        {fieldConfig.model && (
          <div className="col-span-6">
            <Label htmlFor="model">Model</Label>
            <Input id="model" {...onNext.register("model", { required: fieldConfig.model })} />
            {onNext.formState.errors.model && <FormMessage>{onNext.formState.errors.model.message}</FormMessage>}
          </div>
        )}
      </div>
      <div className="grid grid-cols-12 gap-4">
        {fieldConfig.make && (
          <div className="col-span-6">
            <Label htmlFor="make">Make</Label>
            <Input id="make" {...onNext.register("make", { required: fieldConfig.make })} />
            {onNext.formState.errors.make && <FormMessage>{onNext.formState.errors.make.message}</FormMessage>}
          </div>
        )}

        {fieldConfig.purchaseDate && (
          <div className="col-span-6">
            <Label htmlFor="purchaseDate">Purchase Date</Label>
            <Input
              id="purchaseDate"
              type="date"
              {...onNext.register("purchaseDate", { required: fieldConfig.purchaseDate })}
            />
            {onNext.formState.errors.purchaseDate && (
              <FormMessage>{onNext.formState.errors.purchaseDate.message}</FormMessage>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {fieldConfig.yom && (
          <div className="col-span-6">
            <Label htmlFor="yom">Year of Manufacture</Label>
            <Input id="yom" type="number" {...onNext.register("yom", { required: fieldConfig.yom })} />
            {onNext.formState.errors.yom && <FormMessage>{onNext.formState.errors.yom.message}</FormMessage>}
          </div>
        )}

        {fieldConfig.capacity && (
          <div className="col-span-6">
            <Label htmlFor="capacity">Capacity</Label>
            <Input id="capacity" {...onNext.register("capacity", { required: fieldConfig.capacity })} />
            {onNext.formState.errors.capacity && <FormMessage>{onNext.formState.errors.capacity.message}</FormMessage>}
          </div>
        )}
      </div>
    </>
  )
}

const Step3 = ({ onNext, fieldConfig }) => {
  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        {fieldConfig.fitnessCertificateExpiry && (
          <div className="col-span-6">
            <Label htmlFor="fitnessCertificateExpiry">Fitness Certificate Expiry</Label>
            <Input
              id="fitnessCertificateExpiry"
              type="date"
              {...onNext.register("fitnessCertificateExpiry", { required: fieldConfig.fitnessCertificateExpiry })}
            />
            <Input id="fitnessCertificateFile" type="file" {...onNext.register("fitnessCertificateFile")} />
            {onNext.formState.errors.fitnessCertificateExpiry && (
              <FormMessage>{onNext.formState.errors.fitnessCertificateExpiry.message}</FormMessage>
            )}
          </div>
        )}

        {fieldConfig.motorVehicleTaxDue && (
          <div className="col-span-6">
            <Label htmlFor="motorVehicleTaxDue">Motor Vehicle Tax Due</Label>
            <Input
              id="motorVehicleTaxDue"
              type="date"
              {...onNext.register("motorVehicleTaxDue", { required: fieldConfig.motorVehicleTaxDue })}
            />
            <Input id="motorVehicleTaxFile" type="file" {...onNext.register("motorVehicleTaxFile")} />
            {onNext.formState.errors.motorVehicleTaxDue && (
              <FormMessage>{onNext.formState.errors.motorVehicleTaxDue.message}</FormMessage>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {fieldConfig.permitExpiryDate && (
          <div className="col-span-6">
            <Label htmlFor="permitExpiryDate">Permit Expiry Date</Label>
            <Input
              id="permitExpiryDate"
              type="date"
              {...onNext.register("permitExpiryDate", { required: fieldConfig.permitExpiryDate })}
            />
            <Input id="permitFile" type="file" {...onNext.register("permitFile")} />
            {onNext.formState.errors.permitExpiryDate && (
              <FormMessage>{onNext.formState.errors.permitExpiryDate.message}</FormMessage>
            )}
          </div>
        )}

        {fieldConfig.nationalPermitExpiry && (
          <div className="col-span-6">
            <Label htmlFor="nationalPermitExpiry">National Permit Expiry</Label>
            <Input
              id="nationalPermitExpiry"
              type="date"
              {...onNext.register("nationalPermitExpiry", { required: fieldConfig.nationalPermitExpiry })}
            />
            <Input id="nationalPermitFile" type="file" {...onNext.register("nationalPermitFile")} />
            {onNext.formState.errors.nationalPermitExpiry && (
              <FormMessage>{onNext.formState.errors.nationalPermitExpiry.message}</FormMessage>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {fieldConfig.insuranceExpiry && (
          <div className="col-span-6">
            <Label htmlFor="insuranceExpiry">Insurance Expiry</Label>
            <Input
              id="insuranceExpiry"
              type="date"
              {...onNext.register("insuranceExpiry", { required: fieldConfig.insuranceExpiry })}
            />
            <Input id="insuranceFile" type="file" {...onNext.register("insuranceFile")} />
            {onNext.formState.errors.insuranceExpiry && (
              <FormMessage>{onNext.formState.errors.insuranceExpiry.message}</FormMessage>
            )}
          </div>
        )}

        {fieldConfig.pollutionCertificateExpiry && (
          <div className="col-span-6">
            <Label htmlFor="pollutionCertificateExpiry">Pollution Certificate Expiry</Label>
            <Input
              id="pollutionCertificateExpiry"
              type="date"
              {...onNext.register("pollutionCertificateExpiry", {
                required: fieldConfig.pollutionCertificateExpiry,
              })}
            />
            <Input id="pollutionCertificateFile" type="file" {...onNext.register("pollutionCertificateFile")} />
            {onNext.formState.errors.pollutionCertificateExpiry && (
              <FormMessage>{onNext.formState.errors.pollutionCertificateExpiry.message}</FormMessage>
            )}
          </div>
        )}

        <div className="col-span-6">
          <Label htmlFor="machineImageFile">Machine Image</Label>
          <Input id="machineImageFile" type="file" {...onNext.register("machineImageFile")} />
        </div>
      </div>
    </>
  )
}

const Step4 = ({ onNext }) => {
  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <Label htmlFor="ownerName">Owner Name *</Label>
          <Input id="ownerName" {...onNext.register("ownerName", { required: true })} />
          {onNext.formState.errors.ownerName && <FormMessage>{onNext.formState.errors.ownerName.message}</FormMessage>}
        </div>

        <div className="col-span-6">
          <SelectDropdown
            label={"Owner Type *"}
            name={"ownerType"}
            data={[
              { name: "Company", id: "Company" },
              { name: "Individual", id: "Individual" },
            ]}
            control={onNext.control}
          />
          {onNext.formState.errors.ownerType && <FormMessage>{onNext.formState.errors.ownerType.message}</FormMessage>}
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
  )
}

// Modify the AddMachineMultiStepForm component to track machineType
const AddMachineMultiStepForm = () => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [machineType, setMachineType] = useState(null)
  const [fieldConfig, setFieldConfig] = useState(getFieldConfigByMachineType(machineType))

  const { data: primaryCategories } = useSelector((state) => state.primaryCategories) || []
  const { data: machineCategories } = useSelector((state) => state.machineCategories) || []
  const { data: siteList } = useSelector((state) => state.sites) || []

  const { toast } = useToast()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Update field config when machineType changes
  useEffect(() => {
    setFieldConfig(getFieldConfigByMachineType(machineType))
  }, [machineType])

  const getSchemaForStep = (stepNumber, config) => {
    switch (stepNumber) {
      case 1:
        return step1Schema
      case 2:
        return getDynamicStep2Schema(config)
      case 3:
        return step4Schema
      case 4:
        return getDynamicStep3Schema(config)
      default:
        return step1Schema
    }
  }

  const getDynamicStep2Schema = (config) => {
    let schema = z.object({
      chassisNumber: z.string().min(3, "Chassis Number is required"),
    })

    if (config.engineNumber) {
      schema = schema.extend({ engineNumber: z.string().optional() })
    }
    if (config.serialNumber) {
      schema = schema.extend({ serialNumber: z.string().optional() })
    }
    if (config.model) {
      schema = schema.extend({ model: z.string().optional() })
    }
    if (config.make) {
      schema = schema.extend({ make: z.string().optional() })
    }
    if (config.purchaseDate) {
      schema = schema.extend({ purchaseDate: z.string().optional() })
    }
    if (config.yom) {
      schema = schema.extend({
        yom: z
          .string()
          .min(4, "Year of Manufacture must be a valid year")
          .max(4, "Year of Manufacture must be a valid year")
          .or(z.literal("")),
      })
    }
    if (config.capacity) {
      schema = schema.extend({ capacity: z.string().optional() })
    }

    return schema
  }

  const getDynamicStep3Schema = (config) => {
    let schema = z.object({
      // Base fields from step3Schema that are always required
      primaryCategoryId: z.number("Required"),
      machineCategoryId: z.number("Required"),
      machineName: z.string().min(3, "Machine Name is required"),
      machineNumber: z.string().min(3, "Machine Number is required"),
      siteId: z.number("Required"),
      chassisNumber: z.string().min(3, "Chassis Number is required"),
      ownerName: z.string().min(3, "Owner Name is required"),
      ownerType: z.string().min(3, "Owner Type is required"),
      machineImageFile: z.instanceof(FileList, "Machine Image File is required").optional(),
    })

    // Optional fields based on config
    if (config.registrationNumber) {
      schema = schema.extend({ registrationNumber: z.string().optional() })
    }
    if (config.machineCode) {
      schema = schema.extend({ machineCode: z.string().optional() })
    }

    // Add Step 2 fields conditionally
    if (config.engineNumber) {
      schema = schema.extend({ engineNumber: z.string().optional() })
    }
    if (config.serialNumber) {
      schema = schema.extend({ serialNumber: z.string().optional() })
    }
    if (config.model) {
      schema = schema.extend({ model: z.string().optional() })
    }
    if (config.make) {
      schema = schema.extend({ make: z.string().optional() })
    }
    if (config.purchaseDate) {
      schema = schema.extend({ purchaseDate: z.string().optional() })
    }
    if (config.yom) {
      schema = schema.extend({
        yom: z
          .string()
          .min(4, "Year of Manufacture must be a valid year")
          .max(4, "Year of Manufacture must be a valid year")
          .or(z.literal("")),
      })
    }
    if (config.capacity) {
      schema = schema.extend({ capacity: z.string().optional() })
    }

    // Add Step 3 fields conditionally
    if (config.fitnessCertificateExpiry) {
      schema = schema.extend({
        fitnessCertificateExpiry: z.string().nonempty("Fitness Certificate Expiry is required"),
        fitnessCertificateFile: z.instanceof(FileList, "Fitness Certificate File is required").optional(),
      })
    }
    if (config.motorVehicleTaxDue) {
      schema = schema.extend({
        motorVehicleTaxDue: z.string().nonempty("Motor Vehicle Tax Due is required"),
        motorVehicleTaxFile: z.instanceof(FileList, "Motor Vehicle Tax File is required").optional(),
      })
    }
    if (config.permitExpiryDate) {
      schema = schema.extend({
        permitExpiryDate: z.string().nonempty("Permit Expiry Date is required"),
        permitFile: z.instanceof(FileList, "Permit File is required").optional(),
      })
    }
    if (config.nationalPermitExpiry) {
      schema = schema.extend({
        nationalPermitExpiry: z.string().nonempty("National Permit Expiry is required"),
        nationalPermitFile: z.instanceof(FileList, "National Permit File is required").optional(),
      })
    }
    if (config.insuranceExpiry) {
      schema = schema.extend({
        insuranceExpiry: z.string().nonempty("Insurance Expiry is required"),
        insuranceFile: z.instanceof(FileList, "Insurance File is required").optional(),
      })
    }
    if (config.pollutionCertificateExpiry) {
      schema = schema.extend({
        pollutionCertificateExpiry: z.string().nonempty("Pollution Certificate Expiry is required"),
        pollutionCertificateFile: z.instanceof(FileList, "Pollution Certificate File is required").optional(),
      })
    }

    return schema
  }

  const methods = useForm({
    resolver: zodResolver(getSchemaForStep(step, fieldConfig)),
    defaultValues: {
      isActive: true,
      status: "Idle",
    },
  })

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods

  // Watch for machine category changes to update field config
  useEffect(() => {
    setFieldConfig(getFieldConfigByMachineType(machineType))
  }, [machineType])

  const navigateToStep = (stepNumber) => {
    setStep(stepNumber)
  }

  const handleNext = (data) => {
    // Save the current step data
    Object.keys(data).forEach((key) => setValue(key, data[key]))

    setStep((prevStep) => {
      const nextStep = prevStep + 1
      return nextStep
    })
  }

  const handleFinalSubmit = async (data) => {
    setLoading(true)
    const formData = new FormData()

    // Loop through the form data and append to formData
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof FileList) {
        // Append files properly
        Array.from(value).forEach((file) => formData.append(key, file))
      } else {
        formData.append(key, value)
      }
    })

    // console.log("Final Form Data:", Object.fromEntries(formData.entries()));
    // return;
    try {
      const res = await api.post("/machinery", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      console.log(res)
      toast({
        title: "Success! ",
        description: "Machine created successfully",
      })
      dispatch(fetchMachines())
      navigate("/list-machine")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.response.data.message || "Failed to submit the form.",
      })
    } finally {
      setLoading(false)
    }
  }

  const steps = ["General Details", "Machine Info.", "Owner Info.", "Documents"]

  // Update to pass fieldConfig to step components
  const renderStepComponent = () => {
    switch (step) {
      case 1:
        return (
          <Step1
            primaryCategories={primaryCategories}
            machineCategories={machineCategories}
            siteList={siteList}
            onNext={methods}
            watch={watch}
            setValue={setValue}
            setMachineType={setMachineType}
          />
        )
      case 2:
        return <Step2 onNext={methods} fieldConfig={fieldConfig} />
      case 3:
        return <Step4 onNext={methods} />
      case 4:
        return <Step3 onNext={methods} fieldConfig={fieldConfig} />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col">
      <Sidebar steps={steps} currentStep={step} navigateToStep={navigateToStep} />
      <div>
        <div className="max-w-4xl py-4">
          <FormProvider {...methods}>
            <form
              onSubmit={(e) => {
                e.preventDefault() // Prevent default form submission
                handleSubmit(step < 4 ? handleNext : handleFinalSubmit)()
              }}
              className="space-y-4 "
            >
              {renderStepComponent()}

              <div className="flex justify-between mt-4">
                {step > 1 && (
                  <span
                    className={
                      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground px-4 py-2 h-9 cursor-pointer"
                    }
                    onClick={() => {
                      setStep((prev) => Math.max(prev - 1, 1))
                    }}
                  >
                    Back
                  </span>
                )}
                <Button loading={loading} type="submit">
                  {step < 4 ? "Next" : "Submit"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  )
}

const Sidebar = ({ steps, currentStep, navigateToStep }) => {
  return (
    <aside className="bg-accent mb-2 rounded p-4">
      <ul className="flex gap-4">
        {steps.map((step, index) => (
          <li key={index}>
            <Button
              variant={currentStep === index + 1 ? "default" : "outline"}
              onClick={() => {
                // navigateToStep(index + 1)
                console.warn("Navigation disabled")
              }}
              className="w-full text-xs"
            >
              {step}
            </Button>
          </li>
        ))}
      </ul>
    </aside>
  )
}

// Step 1 Validation Schema
const step1Schema = z.object({
  primaryCategoryId: z.number("Required"),
  machineCategoryId: z.number("Required"),
  machineName: z.string().min(3, "Machine Name is required"),
  machineNumber: z.string().min(3, "Machine Number is required"),
  registrationNumber: z.string().optional(),
  machineCode: z.string().optional(),
  erpCode: z.string().optional(),
  siteId: z.number("Required"),
})

// Step 2 Validation Schema
const step2Schema = z.object({
  chassisNumber: z.string().min(3, "Chassis Number is required"),
  engineNumber: z.string().optional(),
  serialNumber: z.string().optional(),
  model: z.string().optional(),
  make: z.string().optional(),
  purchaseDate: z.string().optional(),
  yom: z
    .string()
    .min(4, "Year of Manufacture must be a valid year")
    .max(4, "Year of Manufacture must be a valid year")
    .or(z.literal("")),
  capacity: z.string().optional(),
})

// Step 3 Validation Schema
const step3Schema = z.object({
  primaryCategoryId: z.number("Required"),
  machineCategoryId: z.number("Required"),
  machineName: z.string().min(3, "Machine Name is required"),
  machineNumber: z.string().min(3, "Machine Number is required"),
  registrationNumber: z.string().optional(),
  machineCode: z.string().optional(),
  // erpCode: z.string().min(3, "ERP Code is required"),
  siteId: z.number("Required"),

  chassisNumber: z.string().min(3, "Chassis Number is required"),
  engineNumber: z.string().optional(),
  serialNumber: z.string().optional(),
  model: z.string().optional(),
  make: z.string().optional(),
  purchaseDate: z.string().optional(),
  yom: z
    .string()
    .min(4, "Year of Manufacture must be a valid year")
    .max(4, "Year of Manufacture must be a valid year")
    .or(z.literal("")),
  capacity: z.string().optional(),

  ownerName: z.string().min(3, "Owner Name is required"),
  ownerType: z.string().min(3, "Owner Type is required"),

  fitnessCertificateExpiry: z.string().nonempty("Fitness Certificate Expiry is required"),
  fitnessCertificateFile: z.instanceof(FileList, "Fitness Certificate File is required").optional(),
  motorVehicleTaxDue: z.string().nonempty("Motor Vehicle Tax Due is required"),
  motorVehicleTaxFile: z.instanceof(FileList, "Motor Vehicle Tax File is required").optional(),
  permitExpiryDate: z.string().nonempty("Permit Expiry Date is required"),
  permitFile: z.instanceof(FileList, "Permit File is required").optional(),
  nationalPermitExpiry: z.string().nonempty("National Permit Expiry is required"),
  nationalPermitFile: z.instanceof(FileList, "National Permit File is required").optional(),
  insuranceExpiry: z.string().nonempty("Insurance Expiry is required"),
  insuranceFile: z.instanceof(FileList, "Insurance File is required").optional(),
  pollutionCertificateExpiry: z.string().nonempty("Pollution Certificate Expiry is required"),
  pollutionCertificateFile: z.instanceof(FileList, "Pollution Certificate File is required").optional(),
  machineImageFile: z.instanceof(FileList, "Machine Image File is required").optional(),
})

// Step 4 Validation Schema
const step4Schema = z.object({
  ownerName: z.string().min(3, "Owner Name is required"),
  ownerType: z.string().min(3, "Owner Type is required"),
  // ownerPhone: z.string().min(10, "Owner Phone number must be at least 10 digits"),
  // ownerAddress: z.string().min(5, "Owner Address must be at least 5 characters"),
})

export default AddMachineMultiStepForm
