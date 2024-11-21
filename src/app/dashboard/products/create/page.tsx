import { Container } from "@/components/Container";
import { DashboardBreadcrumbs } from "../../components/client";
import { breadcrumbs } from "./constants";

export default async function ProductCreate() {
  return (
    <Container>
      <DashboardBreadcrumbs items={breadcrumbs} />

      <p>Create Product Page</p>
    </Container>
  );
}
