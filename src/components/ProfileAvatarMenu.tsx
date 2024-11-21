"use client";

import { User } from "@/lib/auth";
import { hasPermission } from "@/lib/permission";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import Link from "next/link";

export function ProfileAvatarMenu({ user }: { user: User }) {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="secondary"
          name="Jason Hughes"
          size="sm"
          src="https://i.pravatar.cc/150"
        />
      </DropdownTrigger>

      <DropdownMenu variant="flat">
        <DropdownSection title="Profile" showDivider>
          <DropdownItem
            as={Link}
            key="help_and_feedback"
            className="font-semibold"
            href="/profile"
          >
            Account <span className="font-semibold">{user.name}</span>
          </DropdownItem>
        </DropdownSection>

        <DropdownSection>
          {hasPermission(user, "view:dashboard") ? (
            <DropdownItem as={Link} key="dashboard" href="/dashboard">
              Dashboard
            </DropdownItem>
          ) : (
            <></>
          )}

          <DropdownItem
            as={Link}
            key="logout"
            className="text-danger"
            color="danger"
            href="/logout"
          >
            Log Out
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
