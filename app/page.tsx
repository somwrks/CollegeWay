'use client'
import Onboarding from "@/components/Onboarding";
import { SignIn, SignOutButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col justify-center items-center">
     <Onboarding/>
     </main>
  );
}
