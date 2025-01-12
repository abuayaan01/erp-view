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