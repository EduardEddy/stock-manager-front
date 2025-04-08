import Dashboard from "views/Dashboard.js";
import UserProfile from "views/UserProfile.js";
import TableList from "views/TableList.js";
import Typography from "views/Typography.js";
import Icons from "views/Icons.js";
import Maps from "views/Maps.js";
import Notifications from "views/Notifications.js";
import Upgrade from "views/Upgrade.js";

import Products from "views/products";
import NewProduct from "views/products/new";
import Sales from "views/sales"

const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPERADMIN: 'SUPERADMIN',
};

const dashboardRoutes = [
  {
    upgrade: true,
    path: "/upgrade",
    name: "Upgrade to PRO",
    icon: "nc-icon nc-alien-33",
    component: Upgrade,
    layout: "/admin",
    roles: [ROLES.SUPERADMIN],
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin",
    roles: [ROLES.USER, ROLES.ADMIN, ROLES.SUPERADMIN],
  },
  {
    path: "/products/new",
    component: NewProduct,  // No tiene "name" ni "icon", así que no aparece en el menú
    layout: "/admin",
  },
  {
    path: "/products",
    name: "Productos",
    icon: "nc-icon nc-grid-45",
    component: Products,
    layout: "/admin",
    roles: [ROLES.USER, ROLES.ADMIN, ROLES.SUPERADMIN],
  },
  {
    path: "/sales",
    name: "Ventas",
    icon: "nc-icon nc-chart-bar-32",
    component: Sales,
    layout: "/admin",
    roles: [ROLES.USER, ROLES.ADMIN, ROLES.SUPERADMIN],
  },
  {
    path: "/user",
    name: "User Profile",
    icon: "nc-icon nc-circle-09",
    component: UserProfile,
    layout: "/admin",
    roles: [ROLES.SUPERADMIN],
  },
  {
    path: "/table",
    name: "Table List",
    icon: "nc-icon nc-notes",
    component: TableList,
    layout: "/admin",
    roles: [ROLES.SUPERADMIN],
  },
  {
    path: "/typography",
    name: "Typography",
    icon: "nc-icon nc-paper-2",
    component: Typography,
    layout: "/admin",
    roles: [ROLES.SUPERADMIN],
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "nc-icon nc-atom",
    component: Icons,
    layout: "/admin",
    roles: [ROLES.SUPERADMIN],
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "nc-icon nc-pin-3",
    component: Maps,
    layout: "/admin",
    roles: [ROLES.SUPERADMIN],
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "nc-icon nc-bell-55",
    component: Notifications,
    layout: "/admin",
    roles: [ROLES.SUPERADMIN],
  }
];

export default dashboardRoutes;
