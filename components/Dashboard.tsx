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
} from "@nextui-org/react";
import Skeleton from "./Skeleton";
import Image from "next/image";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    setTimeout(() => {
      setData([1, 2, 3, 4, 5, 6]);
      setIsLoading(false);
    }, 500);
  }, []);

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
              NEW
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

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
            : data.map((item: any, index: any) => (
                <Card
                  key={index}
                  className="w-full cursor-pointer overflow-hidden h-64 justify-between flex-col flex bg-gray-900"
                >
                  <CardBody className="overflow-hidden">
                    <h3 className="text-xl font-semibold mb-2">
                      Card Title {item}
                    </h3>
                    <Image
                      alt="image"
                      src={
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Morgan_Hall_of_Williams_College_in_the_fall_%2827_October_2010%29.jpg/1280px-Morgan_Hall_of_Williams_College_in_the_fall_%2827_October_2010%29.jpg"
                      }
                      width={400}
                      height={300}
                    />
                  </CardBody>
                </Card>
              ))}
        </div>
      </div>
    </div>
  );
}