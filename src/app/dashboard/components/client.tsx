"use client";

import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";

export interface IBreadcrumbItem {
  label?: string;
  isCurrent?: boolean;
  href?: string;
}

export function DashboardBreadcrumbs({
  items,
}: {
  items: Array<IBreadcrumbItem>;
}) {
  return (
    <Breadcrumbs size="lg" variant="solid">
      {items.map(({ label, isCurrent, href }, index) => (
        <BreadcrumbItem
          key={index}
          href={href}
          isCurrent={isCurrent}
          color={isCurrent ? "primary" : undefined}
          underline={isCurrent ? undefined : "hover"}
        >
          {label}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
}
