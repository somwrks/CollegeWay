import { Button, Calendar, Card, CardBody, Skeleton } from "@nextui-org/react";
import { useState, useEffect } from "react";

const LoadingCard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        <Card className="w-full bg-gray-800">
          <CardBody>
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-20 w-full mb-4" />
            <Skeleton className="h-4 w-1/2" />
          </CardBody>
        </Card>
      ) : (
        <>
          <Card
            isPressable
            className="w-full bg-gray-800"
            onPress={() => window.open("https://calendar.google.com", "_blank")}
          >
            <CardBody className="flex flex-col items-center gap-4 p-3">
              <div className=" rounded-lg">
                <Calendar className="text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-white font-semibold text-lg ">
                  Open your schedule
                </p>
              </div>
            </CardBody>
          </Card>
          <Card
            isPressable
            className="w-full bg-gray-800"
            onPress={() => window.open("https://calendar.google.com", "_blank")}
          >
            <CardBody className="flex flex-col items-center gap-4 p-3">
              <div className="flex flex-col gap-1">
                <p className="text-white font-semibold text-lg ">
                  Todo List
                </p>
              </div>
              <div className="w-9/12 rounded-lg">
                <li>Jack-Kent Scholarship</li>
                <li>Coke Foundation Scholarship</li>
                <li>Remind Dr.K for LOR</li>
                <li>Work on ASU essays</li>
                <li>Revise Resume</li>
                <li>Start working on FAFSA</li>
                <li>ASU Fly In Application</li>
              </div>
            </CardBody>
          </Card>
          <Card
            isPressable
            className="w-full bg-gray-800"
            onPress={() => window.open("https://calendar.google.com", "_blank")}
          >
            <CardBody className="flex flex-col items-center gap-4 p-3">
              
              <div className="flex flex-col justify-between gap-1">
                <div className="text-white flex justify-between flex-row gap-4 flex-wrap font-semibold text-lg ">
                <Button
              color="default" 
              variant="shadow"
              className="font-semibold"
            >
            
              Documents
              
            </Button> <Button
              color="default" 
              variant="shadow"
              className="font-semibold"
            >
            
              Scholarships
              
            </Button> <Button
              color="default" 
              variant="shadow"
              className="font-semibold"
            >
            
            Counsellor
              
            </Button>
            <Button
              color="default" 
              variant="shadow"
              className="font-semibold"
            >
            
            Peer Connect
              
            </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </>
      )}
    </>
  );
};

export default LoadingCard;
