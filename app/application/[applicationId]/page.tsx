'use client'
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import {
  Link,
  Navbar,
  NavbarBrand,
  Button,
  Card,
  CardBody,
  Checkbox,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import { useUser } from "@clerk/nextjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ApplicationDetail() {
  const { user } = useUser();
  const params = useParams();
  const [application, setApplication] = useState<any>(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingAnswers, setGeneratingAnswers] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch application data
        const { data: appData, error } = await supabase
          .from("applications")
          .select("*")
          .eq("applicationid", params.applicationId)
          .single();

        if (error) throw error;
        setApplication(appData);

        console.log(appData.type);
        // Fetch questions based on application type
        const questionsResponse = await fetch(`/api/python/questions?type=${appData.type}`);
        const questionsData = await questionsResponse.json();
        
        // Set questions
        setQuestions(questionsData.questions);

        // Initialize or set existing answers
        const existingAnswers = appData.answers || new Array(questionsData.questions.length).fill("");
        setAnswers(existingAnswers);

        // Update questions_answers in database
        const { error: updateError } = await supabase
          .from("applications")
          .update({
            
              questions: questionsData.questions,
              answers: existingAnswers
            
          })
          .eq("applicationid", params.applicationId);

        if (updateError) throw updateError;

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.applicationId]);

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[index] = value;
      return newAnswers;
    });
  };

  const saveAnswers = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("applications")
        .update({
            questions: questions,
            answers: answers
          
        })
        .eq("applicationid", params.applicationId);

      if (error) throw error;
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setSaving(false);
    }
  };

  const generateAIAnswer = async (index: number, question: any) => {
    setGeneratingAnswers(prev => ({ ...prev, [index]: true }));
    try {
      const response = await fetch('/api/python/generate-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          user_profile: user,
          university: application?.title  // Add university name
        }),
      });
  
      const data = await response.json();
      if (data.answer) {
        handleAnswerChange(index, data.answer);
      }
    } catch (error) {
      console.error("Error generating AI answer:", error);
    } finally {
      setGeneratingAnswers(prev => ({ ...prev, [index]: false }));
    }
  };
  return (
    <>
      <Navbar className="shadow-sm">
        <NavbarBrand>
          <Link href="/dashboard" className="font-bold text-inherit">
            CollegeFreeWay
          </Link>
        </NavbarBrand>
      </Navbar>
      
      <div className="flex flex-col min-h-screen p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {application?.title || 'Application Form'}
          </h1>
          <Button 
            color="primary"
            onClick={saveAnswers}
            isLoading={saving}
          >
            Save Progress
          </Button>
        </div>

        <div className="space-y-6 bg-black">
          {questions?.map((q: any, index: number) => (
            <Card key={index} className="w-full ">
              <CardBody className="space-y-4 bg-black">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{q.question}</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      onChange={(checked) => {
                        if (checked) {
                          generateAIAnswer(index, q.question);
                        }
                      }}
                    >
                      Write with AI
                    </Checkbox>
                  </div>
                </div>

                {generatingAnswers[index] ? (
                  <div className="flex justify-center p-4">
                    <Spinner size="sm" />
                  </div>
                ) : (
                  <Textarea
                    value={answers[index] || ''}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder="Type your answer here..."
                    minRows={4}
                    className="w-full bg-gray-800"
                  />
                )}

                {q.max_words && (
                  <div className="text-sm text-gray-500">
                    Word limit: {q.max_words}
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}