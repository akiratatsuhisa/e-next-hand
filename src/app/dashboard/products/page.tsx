import { Container } from "@/components/Container";
import { DashboardBreadcrumbs } from "../components/client";
import { breadcrumbs } from "./constants";

export default async function Products() {
  return (
    <Container>
      <DashboardBreadcrumbs items={breadcrumbs} />

      <p>Products Page</p>
    </Container>
  );
}
