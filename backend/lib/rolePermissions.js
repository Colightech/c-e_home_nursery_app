const permissions = require("./permissionList");

const rolePermissions = (role) => {
  return permissions[role] || [];
};

module.exports = rolePermissions;