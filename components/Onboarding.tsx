"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { createClient } from '@supabase/supabase-js';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Onboarding() {
  const { user } = useUser();
  const router = useRouter();
  const [isExistingUser, setIsExistingUser] = useState<boolean | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});

  const questions = [
    "What grade are you currently in?",
    "What is your current high school GPA?",
    "What standardized tests have you taken? (Please include your scores if available)",
    "What are your intended college majors or areas of academic interest?",
    "What is the highest level of coursework you've completed?",
    "Have you received any academic awards or honors during high school?",
    "What extracurricular activities are you involved in?",
    "Have you participated in any community service or volunteer work?",
    "What are your hobbies or personal interests outside of school?",
    "What type of college are you most interested in?",
    "What size of college are you interested in attending?",
    "Do you have a preference for the location of the college?",
    "Are you looking for colleges with strong financial aid or scholarships?",
    "Are you a first-generation college student?",
    "Do you have any special requirements for colleges?",
    "Do you need support with the visa or immigration process for studying abroad?",
  ];

  useEffect(() => {
    const checkUser = async () => {
      if (!user) return;

      try {
        // Check if user exists in the users table
        const { data: existingUser } = await supabase
          .from('users')
          .select('userid')
          .eq('userid', user.id)
          .maybeSingle();

        if (existingUser) {
          setIsExistingUser(true);
          router.push('/dashboard');
        } else {
          setIsExistingUser(false);
        }
      } catch (error) {
        console.error('Error checking user:', error);
        setIsExistingUser(false);
      }
    };

    checkUser();
  }, [user, router]);

  const handleNextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      try {
        if (!user) return;

        // Insert new user data
        const { error } = await supabase
          .from('users')
          .insert([{
            userid: user.id,
            grade: responses[0] || '',
            gpa: responses[1] || '',
            standardized_tests: responses[2] || '',
            intended_majors: responses[3] || '',
            highest_coursework: responses[4] || '',
            academic_awards: responses[5] || '',
            extracurricular_activities: responses[6] || '',
            community_service: responses[7] || '',
            hobbies: responses[8] || '',
            preferred_college_type: responses[9] || '',
            preferred_college_size: responses[10] || '',
            preferred_location: responses[11] || '',
            financial_aid_preference: responses[12]?.toLowerCase().includes('yes') || false,
            first_generation_student: responses[13]?.toLowerCase().includes('yes') || false,
            special_requirements: responses[14] || '',
            visa_support_needed: responses[15]?.toLowerCase().includes('yes') || false
          }])
          .select();

        if (error) {
          throw error;
        }

        router.push("/dashboard");
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResponses({ ...responses, [currentQuestion]: e.target.value });
  };

  if (isExistingUser === null) {
    return <div>Loading...</div>;
  }

  if (isExistingUser) {
    return null;
  }

  return (
    <>
  
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
          <Input
            isClearable
            className="mt-5"
            size="md"
            type="text"
            variant="underlined"
            placeholder="Type your answer..."
            value={responses[currentQuestion] || ''}
            onChange={handleInputChange}
          />
          <Button 
            color="primary" 
            onClick={handleNextQuestion} 
            className="mt-5"
            isDisabled={!responses[currentQuestion]}
          >
            {currentQuestion === questions.length - 1 ? "Submit" : "Next"}
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
    </>
  );
}