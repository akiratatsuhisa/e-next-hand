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

async function AuthComponent() {
  const session = await getServerSession();

  return (
    <NavbarContent as="div" justify="end">
      {session.isLogged ? (
        <ProfileAvatarMenu user={session.user} />
      ) : (
        <>
          <NavbarItem className="hidden md:flex">
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

export default async function TopBar() {
  return (
    <Navbar isBordered>
      <NavbarBrand>
        <p className="font-bold text-inherit">ACME</p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive>
          <Link href="/" aria-current="page">
            Home
          </Link>
        </NavbarItem>

        <NavbarItem>
          <Link color="foreground" href="/products">
            Products
          </Link>
        </NavbarItem>
      </NavbarContent>

      <AuthComponent />
    </Navbar>
  );
}
