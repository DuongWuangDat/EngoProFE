// components/Part2Result.tsx
import React from "react";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface AnsweredQuestion {
  questionNumber: number;
  selectedOption: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface Part2Props {
  partData: {
    partNumber: number;
    instructions: string;
    questions: {
      questionNumber: number;
      imageUrl: string;
      options: { option: string; text: string }[];
      correctAnswer: string;
      questionText: string;
    }[];
  };
  answeredQuestions: AnsweredQuestion[];
}

const Part2Result: React.FC<Part2Props> = ({ partData, answeredQuestions }) => {
  const getAnswerStatus = (questionNumber: number, option: string) => {
    const question = partData.questions.find(q => q.questionNumber === questionNumber);
    const userAnswer = answeredQuestions.find(q => q.questionNumber === questionNumber)?.selectedOption;
    
    if (option === question?.correctAnswer) {
      return 'correct';
    }
    if (option === userAnswer) {
      return 'incorrect';
    }
    return 'normal';
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-md font-semibold">
          Phần {partData.partNumber}: {partData.instructions}
        </h2>
      </Card>
      <div className="space-y-6 p-4">
        {partData.questions.map((question) => {
          const answer = answeredQuestions.find(
            q => q.questionNumber === question.questionNumber
          );

          return (
            <Card key={question.questionNumber} className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">
                    Câu {question.questionNumber}
                  </h3>
                  {answer && (
                    <span className={cn(
                      "flex items-center gap-1",
                      answer.isCorrect ? "text-green-500" : "text-red-500"
                    )}>
                      {answer.isCorrect ? (
                        <><Check className="w-4 h-4" /> Đúng</>
                      ) : (
                        <><X className="w-4 h-4" /> Sai</>
                      )}
                    </span>
                  )}
                </div>
                <p className="text-lg">{question.questionText}</p>
                <RadioGroup
                  value={answer?.selectedOption}
                  disabled
                >
                  <div className="space-y-2">
                    {question.options.map((option) => {
                      const status = getAnswerStatus(question.questionNumber, option.option);
                      return (
                        <div
                          key={option.option}
                          className={cn(
                            "flex items-center space-x-2 p-2 rounded-md",
                            status === 'correct' && "bg-green-100",
                            status === 'incorrect' && "bg-red-100"
                          )}
                        >
                          <RadioGroupItem
                            value={option.option}
                            id={`question-${question.questionNumber}-${option.option}`}
                            className={cn(
                              status === 'correct' && "text-green-500 border-green-500",
                              status === 'incorrect' && "text-red-500 border-red-500"
                            )}
                          />
                          <Label
                            htmlFor={`question-${question.questionNumber}-${option.option}`}
                          >
                            {option.option}. {option.text}
                          </Label>
                        </div>
                      )}
                    )}
                  </div>
                </RadioGroup>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Part2Result;