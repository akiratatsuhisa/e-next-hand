import { getServerSession } from "@/lib/auth";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { ProfileAvatarMenu } from "./ProfileAvatarMenu";
import Link from "next/link";

export async function AuthComponent() {
  const session = await getServerSession();

  return (
    <NavbarContent as="div" justify="end">
      {session.isLogged ? (
        <ProfileAvatarMenu user={session.user} />
      ) : (
        <>
          <NavbarItem className="flex">
            <Link href="/register">Register</Link>
          </NavbarItem>

          <NavbarItem>
            <Button as={Link} color="primary" href="/login" variant="flat">
              Login
            </Button>
          </NavbarItem>
        </>
      )}
    </NavbarContent>
  );
}

const defaultMenus = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Products",
    href: "/products",
  },
];

export async function DefaultTopBar() {
  return (
    <Navbar isBordered>
      <NavbarBrand as={Link} href="/">
        <p className="font-bold text-inherit">E-NH</p>
      </NavbarBrand>

      <NavbarContent className="flex gap-4" justify="center">
        {defaultMenus.map(({ label, href }) => (
          <NavbarItem key={label}>
            <Link href={href}>{label}</Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <AuthComponent />
    </Navbar>
  );
}

const dashboardMenus = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Products",
    href: "/dashboard/products",
  },
];

export async function DashboardTopBar() {
  return (
    <Navbar isBordered>
      <NavbarBrand as={Link} href="/">
        <p className="font-bold text-inherit">E-NH</p>
      </NavbarBrand>

      <NavbarContent className="flex gap-4" justify="center">
        {dashboardMenus.map(({ label, href }) => (
          <NavbarItem key={label}>
            <Link href={href}>{label}</Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <AuthComponent />
    </Navbar>
  );
}
