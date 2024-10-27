'use client'
import React, { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/select";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { v4 as uuidv4 } from 'uuid';

export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  
  const questions = [
    "Which University/Scholarship?",
    "What type of application is this?",
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});

  const handleNextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      const applicationId = uuidv4();
      
      try {
        const response = await fetch('/api/postApplication', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            applicationId: applicationId,
            userid: user?.id,
            title: responses[0], // University name
            date: new Date().toISOString(),
            type: responses[1], // Application type
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to create application');
        }
  
        router.push(`/application/${applicationId}`);
      } catch (error) {
        console.error('Error creating application:', error);
      }
    }
  };

  const handleInputChange = (value: string) => {
    setResponses({ ...responses, [currentQuestion]: value });
  };

  const renderInput = () => {
    if (currentQuestion === 1) {
      return (
        <Select
          label="Select application type"
          className="mt-5"
          onChange={(e) => handleInputChange(e.target.value)}
        >
          <SelectItem key="University" value="University">
            University
          </SelectItem>
          <SelectItem key="Scholarship" value="Scholarship">
            Scholarship
          </SelectItem>
        </Select>
      );
    }

    return (
      <Input
        isClearable
        className="mt-5"
        size="md"
        type="text"
        variant="underlined"
        placeholder="Type your answer..."
        onChange={(e) => handleInputChange(e.target.value)}
      />
    );
  };

  

  return (
    <div className="flex flex-col w-full items-center justify-center min-h-screen bg-black">

    <div className="flex flex-col w-1/2 justify-center items-center p-4 gap-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center" }}
          >
          <h3 className="text-3xl">{questions[currentQuestion]}</h3>
          {renderInput()}
          <Button 
            color="default" 
            onClick={handleNextQuestion} 
            className="mt-5"
            isDisabled={!responses[currentQuestion]}
            >
            {currentQuestion === questions.length - 1 ? "Submit" : "Next"}
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
            </div>
  );
}