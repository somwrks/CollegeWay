'use client'
import Onboarding from "@/components/Onboarding";
import { SignIn, SignOutButton, useUser } from "@clerk/nextjs";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function Home() {

  return (
    <><Navbar className="shadow-sm">
      <NavbarContent justify="end">
        <NavbarItem>

          <SignOutButton />

        </NavbarItem>
      </NavbarContent>
    </Navbar><main className="flex min-h-screen flex-col justify-center items-center">
        <Onboarding />
      </main></>
  );
}
