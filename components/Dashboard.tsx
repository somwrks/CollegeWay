"use client";

import React, { useState, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Card,
  CardBody,
  Button,
  Link,
} from "@nextui-org/react";
import Skeleton from "./Skeleton";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import LoadingCard from "./LoadingCard";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<any>([]);
  const { user } = useUser();

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
const router = useRouter();
  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;

      try {
        // Check if the applications table exists and fetch data
        const { data: applications, error } = await supabase
          .from('applications')
          .select('*')
          .eq('userid', user.id);

        if (error) {
          console.error('Error fetching applications:', error);
          return;
        }

        if (applications) {
          setApplications(applications);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  return (
    <div className="min-h-screen bg-black">
      <Navbar className="shadow-sm">
        <NavbarBrand>
          <p className="font-bold text-inherit">APPLICATIONS</p>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button 
              color="default" 
              variant="shadow"
              className="font-semibold"
            >
              <Link             href="/dashboard/new" 
              >
              NEW
              </Link>
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
<div className="flex flex-row justify-between">
      <div className="container p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? [...Array(6)].map((_, index) => (
                <Card key={index} className="w-full bg-gray-800">
                  <CardBody>
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-20 w-full mb-4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardBody>
                </Card>
              ))
            : applications.map((application: any) => (
                <Card
                  key={application.id}
                  onClick={()=> router.push(`/application/${application.applicationid}`)}
                  className="w-full cursor-pointer overflow-hidden h-64 justify-between flex-col flex bg-gray-900"
                >
                  <CardBody className="overflow-hidden" onClick={()=> router.push(`/application/${application.applicationid}`)}>
                    <h3 className="text-xl font-semibold mb-2">
                      {application.title || 'Untitled Application'}
                    </h3>
                    <div className="text-sm text-gray-400 mb-2">
                      {application.type || 'N/A'}
                    </div>
                   
                      <Image
                        alt="Application image"
                        src={"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Morgan_Hall_of_Williams_College_in_the_fall_%2827_October_2010%29.jpg/1280px-Morgan_Hall_of_Williams_College_in_the_fall_%2827_October_2010%29.jpg"}
                        width={400}
                        height={300}
                      />
                 
                  </CardBody>
                </Card>
              ))}
        </div>
      </div>
<div className="flex flex-col min-h-screen gap-4 bg-gray-900 w-1/3 h-full">
<h1 className="text-3xl text-center mt-4">Quick Access</h1>
<LoadingCard/>
</div>
</div>
    </div>
  );
}