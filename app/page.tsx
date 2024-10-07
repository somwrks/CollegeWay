'use client'
import { SignIn, SignOutButton, useUser } from "@clerk/nextjs";
import DataDisplay from "@/components/Landing/DataDisplay";

export default function Home() {
  const { isSignedIn, user } = useUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Next.js with Clerk, MongoDB, and Flask</h1>
        <div>
          <p>Welcome, {user?.firstName}!</p>
          <SignOutButton />
          <DataDisplay />
        </div>
     
    </main>
  );
}
