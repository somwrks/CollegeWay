import React, { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const questions = [
    "What's your full name?",
    // "What grade are you currently in?",
    // "What is your current high school GPA?",
    // "What standardized tests have you taken? (Please include your scores if available)",
    // "What are your intended college majors or areas of academic interest?",
    // "What is the highest level of coursework you’ve completed? (e.g., Honors, AP, IB, Dual Enrollment)",
    // "Have you received any academic awards or honors during high school?",
    // "What extracurricular activities are you involved in? (Include leadership roles and notable achievements)",
    // "Have you participated in any community service or volunteer work? (Please describe your role and hours)",
    // "What are your hobbies or personal interests outside of school?",
    // "What type of college are you most interested in? (Public, private, liberal arts, technical institute, etc.)",
    // "What size of college are you interested in attending? (Small < 2,000, Medium 2,000-10,000, Large > 10,000 students)",
    // "Do you have a preference for the location of the college? (Urban, suburban, rural, specific states or regions)",
    // "Are you looking for colleges with strong financial aid or scholarships? (e.g., need-based aid, merit-based scholarships)",
    // "Are you a first-generation college student?",
    // "Do you have any special requirements for colleges? (e.g., learning accommodations, diversity/inclusion programs)",
    // "Do you need support with the visa or immigration process for studying abroad?",
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
const router = useRouter();
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      router.push("/dashboard");
    }
  };

  const handleInputChange = (e: { target: { value: any } }) => {
    setResponses({ ...responses, [currentQuestion]: e.target.value });
  };

  return (
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
            onChange={handleInputChange}
          />
          <Button color="primary" onClick={handleNextQuestion} className="mt-5">
            Next
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
