import Text from "@/components/ui/text";
import React from "react";
import UsersTable from "../users-table/page";

function ManageUsers() {
  return (
    <div>
      <Text>Users Management</Text>
      <div>
        <UsersTable />
      </div>
    </div>
  );
}

export default ManageUsers;