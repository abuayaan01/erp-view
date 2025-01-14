import Text from '@/components/ui/text'
import React from 'react'
import AddMachineForm from '@/components/add-machine-form'

function Page() {
  return (
    <div>
        <Text>Machine Management {">"} Add Machine</Text>
        <AddMachineForm />
    </div>
  )
}

export default Page

const machineData = [
  {
    ownerName: "BPC INFRAPROJETS PVT LTD",
    machineName: "JCB",
    chassisNo: "HAR3DXSSC02976031",
    engineNo: "PRHM124542",
    registrationNo: "JH01DR9855",
    machineCode: "BPC/JCB/17/0001",
    location: "Bijepur",
    fitnessValidity: "2026-07-29",
    mvTaxValidity: "2029-09-29",
    permitState: "Jharkhand",
    permitValidity: "2028-08-16",
    nationalPermitValidity: "2025-08-16",
    insuranceDate: "2025-12-22",
    pollutionDate: "2024-12-14",
    purchaseDate: "2017-05-20",
  },
  {
    ownerName: "BPC INFRAPROJETS PVT LTD",
    machineName: "TRANSIT MIXER",
    chassisNo: "TM1234567890123456",
    engineNo: "TM9876543210123456",
    registrationNo: "JH02TM7654",
    machineCode: "BPC/TM/18/0002",
    location: "Ranchi",
    fitnessValidity: "2025-11-30",
    mvTaxValidity: "2028-11-30",
    permitState: "Jharkhand",
    permitValidity: "2027-05-15",
    nationalPermitValidity: "2024-09-25",
    insuranceDate: "2024-10-20",
    pollutionDate: "2023-12-30",
    purchaseDate: "2018-06-10",
  },
  {
    ownerName: "BPC INFRAPROJETS PVT LTD",
    machineName: "CAT 323D3 EXCAVATOR",
    chassisNo: "CAT3DXSSC03000111",
    engineNo: "CATHM123456",
    registrationNo: "JH03EX323D",
    machineCode: "BPC/EX-323D/19/0003",
    location: "Simdega",
    fitnessValidity: "2027-03-15",
    mvTaxValidity: "2030-04-10",
    permitState: "Jharkhand",
    permitValidity: "2029-06-20",
    nationalPermitValidity: "2026-03-18",
    insuranceDate: "2025-07-10",
    pollutionDate: "2024-05-22",
    purchaseDate: "2019-09-05",
  },
  {
    ownerName: "BPC INFRAPROJETS PVT LTD",
    machineName: "TANDEM ROLLER",
    chassisNo: "TND4567890123456",
    engineNo: "TND6543210987654",
    registrationNo: "JH04TND4321",
    machineCode: "BPC/TND/20/0004",
    location: "Dhanbad",
    fitnessValidity: "2028-08-01",
    mvTaxValidity: "2031-01-10",
    permitState: "Jharkhand",
    permitValidity: "2029-09-10",
    nationalPermitValidity: "2025-07-12",
    insuranceDate: "2024-08-15",
    pollutionDate: "2023-11-30",
    purchaseDate: "2020-02-10",
  },
  {
    ownerName: "BPC INFRAPROJETS PVT LTD",
    machineName: "SOIL COMPACTOR ROLLER",
    chassisNo: "SCR1239876543210",
    engineNo: "SCR9876543210123",
    registrationNo: "JH05SCR6789",
    machineCode: "BPC/SCR/21/0005",
    location: "Chaibasa",
    fitnessValidity: "2026-12-31",
    mvTaxValidity: "2029-06-30",
    permitState: "Jharkhand",
    permitValidity: "2027-12-20",
    nationalPermitValidity: "2025-04-15",
    insuranceDate: "2024-03-10",
    pollutionDate: "2024-01-10",
    purchaseDate: "2021-03-20",
  },
];
