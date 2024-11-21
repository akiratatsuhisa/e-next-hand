import { getServerSession } from "@/lib/auth";
import { Container } from "@/components/Container";
import { DashboardBreadcrumbs } from "./components/client";
import { breadcrumbs } from "./constants";

export default async function Dashboard() {
  const session = await getServerSession();

  return (
    <Container>
      <DashboardBreadcrumbs items={breadcrumbs} />

      <p>Dashboard Page</p>
      <pre>{JSON.stringify(session ?? "", undefined, 2)}</pre>
    </Container>
  );
}
