"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ApplicationDetail() {
  const params = useParams();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const { data, error } = await supabase
          .from("applications")
          .select("*")
          .eq("applicationid", params.applicationId)
          .single();

        if (error) throw error;
        setApplication(data);
      } catch (error) {
        console.error("Error fetching application:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [params.applicationId]);

  if (loading) return <div>Loading...</div>;
  if (!application) return <div>Application not found</div>;

  return (
    <>
      <Navbar className="shadow-sm">
        <NavbarBrand>
          <Link href="/dashboard" className="font-bold text-inherit">CollegeFreeWay</Link>
        </NavbarBrand>
      
      </Navbar>
      <div className="flex flex-col min-h-screen bg-black">

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">{application.title}</h1>
        <div className="grid gap-4">
          <div>
            <strong>Type:</strong> {application.type}
          </div>
          <div>
            <strong>Date:</strong>{" "}
            {new Date(application.date).toLocaleDateString()}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
