const permissions = require("./permissions");

const rolePermissions = (role) => {
  return permissions[role] || [];
};

module.exports = rolePermissions;