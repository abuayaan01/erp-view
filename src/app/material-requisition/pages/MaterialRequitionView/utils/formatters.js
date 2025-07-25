// utils/formatters.js
export const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleString();
  } catch (error) {
    return dateString;
  }
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

export const getItemGroupName = (groupId, itemGroups) => {
  const group = itemGroups.find((g) => g.id === groupId);
  return group ? group.name : "Unknown Group";
};

export const getUnitName = (unitId, units) => {
  const unit = units.find((u) => u.id === unitId);
  return unit ? unit.shortName || unit.name : "";
};
