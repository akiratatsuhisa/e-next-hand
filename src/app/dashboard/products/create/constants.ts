import { IBreadcrumbItem } from "@/app/dashboard/components/client";
import { productsBreadCrumb } from "../constants";
import { dashBoardBreadCrumb } from "../../constants";

export const productCreateBreadCrumb: IBreadcrumbItem = {
  label: "create",
  href: "/dashboard/products/create",
};

export const breadcrumbs: Array<IBreadcrumbItem> = [
  dashBoardBreadCrumb,
  productsBreadCrumb,
  {
    ...productCreateBreadCrumb,
    href: undefined,
    isCurrent: true,
  },
];
