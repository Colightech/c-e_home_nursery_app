

const basePermissions = {

  admin: [
    "view_users",
    "view_child",
    "assign_caregiver",
    "view_attendance",
    "create_activity",
    "view_activity",
    "send_message",
    "view_message",

    "check_in",
    "check_out",
    "view_attendance",
    "view_attendance",
    "update_attendance",
    "delete_attendance",
    "create_daycare",
    "view_daycare",
    "update_daycare",
  ],

  caregiver: [
    "view_child",
    "mark_attendance",
    "view_attendance",
    "view_activity",
    "upload_child_media",
    "send_message",
    "view_message",
    "view_users"
  ],

  parent: [
    "view_own_child",
    "view_attendance",
    "view_activity",
    "send_message",
    "view_message",
    "view_users"
  ]
};


const superAdminExtras = [
    "create_user",
    "create_child",
    "manage_daycare",
    "view_all_daycares",
    "create_admin",
    "view_all_users",
    "update_any_user",
    "delete_any_user",
    "delete_user",
    "delete_child",
    "update_user",
    "update_child",
    "update_activity",

    "check_in",
    "check_out",
    "view_attendance",
    "view_attendance",
    "update_attendance",
    "delete_attendance",
    "create_daycare",
    "view_daycare",
    "update_daycare",
    "delete_daycare",
];



const allBasePermissions = [
  ...new Set(Object.values(basePermissions).flat())
];

const permissions = {
  "super-admin": [
    ...new Set([...allBasePermissions, ...superAdminExtras])
  ],

  ...basePermissions
};

module.exports = permissions;
