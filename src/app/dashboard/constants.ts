import { IBreadcrumbItem } from "@/app/dashboard/components/client";

export const dashBoardBreadCrumb: IBreadcrumbItem = {
  label: "dashboard",
  href: "/dashboard",
};

export const breadcrumbs: Array<IBreadcrumbItem> = [
  {
    ...dashBoardBreadCrumb,
    href: undefined,
    isCurrent: true,
  },
];
