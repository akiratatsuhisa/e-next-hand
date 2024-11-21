import { IBreadcrumbItem } from "@/app/dashboard/components/client";
import { dashBoardBreadCrumb } from "../constants";

export const productsBreadCrumb: IBreadcrumbItem = {
  label: "products",
  href: "/dashboard/products",
};

export const breadcrumbs: Array<IBreadcrumbItem> = [
  dashBoardBreadCrumb,
  {
    ...productsBreadCrumb,
    href: undefined,
    isCurrent: true,
  },
];
