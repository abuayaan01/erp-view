// Define role constants
const ROLES = {
    ADMIN: { id: 1, name: "Admin" },
    MECHANICAL_HEAD: { id: 2, name: "Mechanical Head" },
    MECHANICAL_MANAGER: { id: 3, name: "Mechanical Manager" },
    MECHANICAL_INCHARGE: { id: 4, name: "Mechanical Incharge" },
    MECHANICAL_STORE_MANAGER: { id: 5, name: "Mechanical Store Manager" },
    PROJECT_MANAGER: { id: 6, name: "Project Manager" },
  };
  
  // Create mappings for quick lookups
  const ROLE_ID_TO_NAME = Object.fromEntries(
    Object.values(ROLES).map(role => [role.id, role.name])
  );
  
  const ROLE_NAME_TO_ID = Object.fromEntries(
    Object.values(ROLES).map(role => [role.name, role.id])
  );
  
  // Functions to retrieve roles
  const getRoleById = (id) => ROLE_ID_TO_NAME[id] || null;
  
  const getIdByRole = (roleName) => ROLE_NAME_TO_ID[roleName] || null;
  
  // Export for reuse
  export { ROLES, getRoleById, getIdByRole };
  