import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Brain, ArrowLeft, Trophy, BookOpen, DollarSign, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';

const FINANCIAL_QUIZ = {
  title: "Financial Literacy Quiz",
  icon: DollarSign,
  questions: [
    {
      question: "What is compound interest?",
      options: [
        "Interest calculated only on the principal amount",
        "Interest calculated on both principal and previously earned interest",
        "A type of bank fee",
        "The same as simple interest"
      ],
      correct: 1,
      explanation: "Compound interest is interest calculated on both the principal amount and the interest previously earned, leading to exponential growth over time."
    },
    {
      question: "What is a good rule of thumb for emergency savings?",
      options: [
        "1 month of expenses",
        "3-6 months of expenses", 
        "1 year of expenses",
        "No emergency fund needed"
      ],
      correct: 1,
      explanation: "Financial experts recommend saving 3-6 months of living expenses for emergencies to cover unexpected costs like job loss or medical bills."
    },
    {
      question: "What does diversification mean in investing?",
      options: [
        "Putting all money in one stock",
        "Only investing in bonds",
        "Spreading investments across different assets to reduce risk",
        "Only investing in your home country"
      ],
      correct: 2,
      explanation: "Diversification means spreading your investments across different types of assets, sectors, and regions to reduce overall portfolio risk."
    }
  ]
};

const HISTORY_QUIZ = {
  title: "History Quiz",
  icon: BookOpen,
  questions: [
    {
      question: "In what year did the Great Depression begin?",
      options: ["1927", "1929", "1931", "1933"],
      correct: 1,
      explanation: "The Great Depression began in 1929 with the stock market crash on October 29, known as 'Black Tuesday'."
    },
    {
      question: "Who was the first President of the United States?",
      options: [
        "Thomas Jefferson",
        "John Adams", 
        "George Washington",
        "Benjamin Franklin"
      ],
      correct: 2,
      explanation: "George Washington served as the first President of the United States from 1789 to 1797."
    },
    {
      question: "The Berlin Wall fell in which year?",
      options: ["1987", "1989", "1991", "1993"],
      correct: 1,
      explanation: "The Berlin Wall fell on November 9, 1989, marking a significant moment in the end of the Cold War."
    }
  ]
};

export default function SelfLearningIntegration({ task, onComplete }) {
  const { updateUserDarumas } = useUser();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const quiz = selectedQuiz === 'financial' ? FINANCIAL_QUIZ : 
               selectedQuiz === 'history' ? HISTORY_QUIZ : null;

  const handleQuizSelect = (quizType) => {
    setSelectedQuiz(quizType);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
  };

  const handleAnswerSelect = (answerIndex) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (answerIndex === quiz.questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
      // Complete the task if score is good enough
      if (score >= Math.ceil(quiz.questions.length * 0.6)) {
        setTimeout(async () => {
          await updateUserDarumas(task.reward);
          onComplete(task);
        }, 2000);
      }
    }
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    const passed = score >= Math.ceil(quiz.questions.length * 0.6);
    return (
      <Card className="glass-card">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
              passed ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-blue-500 to-purple-600'
            }`}
          >
            {passed ? (
              <Trophy className="w-12 h-12 text-white" />
            ) : (
              <Brain className="w-12 h-12 text-white" />
            )}
          </motion.div>
          <h3 className="text-2xl font-bold mb-3 text-white">
            {passed ? "🎉 Quiz Completed!" : "📚 Keep Learning!"}
          </h3>
          <div className="bg-black/20 rounded-xl p-4 mb-4">
            <p className="text-white text-lg font-semibold mb-2">
              Score: {score}/{quiz.questions.length}
            </p>
            <p className="text-gray-300">
              {quiz.title}
            </p>
          </div>
          {passed ? (
            <div className="bg-green-500/20 border border-green-400/40 rounded-xl p-4">
              <p className="text-green-200 font-semibold text-lg">✨ You earned {task.reward} darumas! ✨</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-yellow-500/20 border border-yellow-400/40 rounded-xl p-4">
                <p className="text-yellow-200 font-medium">You need {Math.ceil(quiz.questions.length * 0.6)} or more correct to pass.</p>
              </div>
              <Button onClick={resetQuiz} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl">
                🔄 Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (selectedQuiz && quiz) {
    const question = quiz.questions[currentQuestion];
    
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Button
              variant="ghost" 
              size="sm"
              onClick={resetQuiz}
              className="p-1 h-8 w-8"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <quiz.icon className="w-6 h-6" />
            {quiz.title}
            <span className="ml-auto text-sm text-gray-400">
              {currentQuestion + 1}/{quiz.questions.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-5 rounded-xl border border-purple-500/20">
            <h4 className="font-bold text-lg mb-6 text-white text-center">{question.question}</h4>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all font-medium ${
                    selectedAnswer === index
                      ? index === question.correct
                        ? 'border-green-400 bg-green-500/20 text-green-200 shadow-lg shadow-green-500/20'
                        : 'border-red-400 bg-red-500/20 text-red-200 shadow-lg shadow-red-500/20'
                      : showExplanation && index === question.correct
                      ? 'border-green-400 bg-green-500/20 text-green-200 shadow-lg shadow-green-500/20'
                      : 'border-gray-400/30 bg-white/10 hover:bg-white/20 text-white hover:border-purple-400/50 shadow-md'
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  whileHover={{ scale: showExplanation ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{option}</span>
                    {showExplanation && index === question.correct && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
          
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/40 rounded-xl p-4"
              >
                <p className="text-blue-200 text-base font-medium leading-relaxed">{question.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {showExplanation && (
            <Button onClick={handleNext} className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-xl shadow-lg">
              {currentQuestion < quiz.questions.length - 1 ? "Next Question →" : "Finish Quiz 🎉"}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-8 h-8 text-purple-400" />
          Self Learning
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-gray-200 text-center text-lg">{task.description}</p>
        
        <div className="grid grid-cols-1 gap-4">
          <motion.button
            className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 p-5 rounded-xl border-2 border-green-400/30 hover:border-green-400/60 transition-all text-left shadow-lg hover:shadow-green-500/20"
            onClick={() => handleQuizSelect('financial')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <DollarSign className="w-10 h-10 text-green-300" />
              <div>
                <h4 className="font-bold text-white text-lg">Financial Literacy Quiz</h4>
                <p className="text-green-200 text-sm">Test your money management knowledge</p>
              </div>
            </div>
          </motion.button>
          
          <motion.button
            className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 p-5 rounded-xl border-2 border-blue-400/30 hover:border-blue-400/60 transition-all text-left shadow-lg hover:shadow-blue-500/20"
            onClick={() => handleQuizSelect('history')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <BookOpen className="w-10 h-10 text-blue-300" />
              <div>
                <h4 className="font-bold text-white text-lg">History Quiz</h4>
                <p className="text-blue-200 text-sm">Test your historical knowledge</p>
              </div>
            </div>
          </motion.button>
        </div>
        
        <div className="text-center bg-purple-500/10 border border-purple-400/30 rounded-lg p-3">
          <div className="flex items-center justify-center gap-2 text-purple-200">
            <Clock className="w-4 h-4" />
            <span className="font-medium">Complete any quiz with 60% or higher to earn {task.reward} darumas</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
