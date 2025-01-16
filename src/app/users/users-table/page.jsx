import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import api from "@/services/api/api-service";

export default function UsersTable() {
  const [data, setData] = useState([
    {
      id: 1,
      name: "Manish",
      code: "MK123",
      email: "manish@gmail.com",
      phone: "123",
      imageUrl: null,
      password: "$2a$10$UCCYyJKpCyqoZSoc/Rxh/..JaTO.d5XNLxsaSRgoxCUpjaDimxl4S",
      roleId: 1,
      departmentId: null,
      siteId: null,
      createdAt: "2025-01-12T18:19:37.000Z",
      updatedAt: "2025-01-12T18:19:37.000Z",
      deletedAt: null,
    },
    {
      id: 2,
      name: "Pooja",
      code: "PJ456",
      email: "pooja@gmail.com",
      phone: "456",
      imageUrl: "https://example.com/images/pooja.png",
      password: "$2a$10$XhgfT5yAKzj/B1UxqJGF6oCtNO4LCh0zP7yx4EQ/zXhR89wQgOPxi",
      roleId: 2,
      departmentId: 5,
      siteId: 2,
      createdAt: "2025-01-13T09:15:21.000Z",
      updatedAt: "2025-01-13T09:15:21.000Z",
      deletedAt: null,
    },
    {
      id: 3,
      name: "Ravi",
      code: "RV789",
      email: "ravi@gmail.com",
      phone: "789",
      imageUrl: "https://example.com/images/ravi.jpg",
      password: "$2a$10$KL6hN7uwRf8JWgHdFhjvnOC3POTPsAOz1yxUiALC7u0JxjCQX1u3i",
      roleId: 3,
      departmentId: 3,
      siteId: 1,
      createdAt: "2025-01-10T14:22:13.000Z",
      updatedAt: "2025-01-14T08:11:45.000Z",
      deletedAt: null,
    },
    {
      id: 4,
      name: "Anjali",
      code: "AJ234",
      email: "anjali@gmail.com",
      phone: "234",
      imageUrl: null,
      password: "$2a$10$a8U9cEhFjl9E4NHGjQTmMvAKRtPV.VnxnJS/eqz.V7hnXvpgNuZoS",
      roleId: 1,
      departmentId: 4,
      siteId: null,
      createdAt: "2025-01-11T16:08:27.000Z",
      updatedAt: "2025-01-11T16:08:27.000Z",
      deletedAt: "2025-01-15T12:00:00.000Z",
    },
    {
      id: 5,
      name: "Rahul",
      code: "RH555",
      email: "rahul@gmail.com",
      phone: "555",
      imageUrl: "https://example.com/images/rahul.png",
      password: "$2a$10$TjnNjqMAQP9CWXs3VH4lBOGcHdA6dOiT.zmM7.qO3HcFlW7Un5THe",
      roleId: 4,
      departmentId: null,
      siteId: 5,
      createdAt: "2025-01-14T10:20:35.000Z",
      updatedAt: "2025-01-14T10:20:35.000Z",
      deletedAt: null,
    },
  ]);

  return (
    <div className="container mx-auto py-2">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
