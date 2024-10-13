'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, RotateCcw, ChevronRight, Zap, Clock, User, Volume2, VolumeX, HelpCircle, Moon, Sun } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { BarChart as BarChartComponent, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'
import confetti from 'canvas-confetti'

type Difficulty = 'easy' | 'medium' | 'hard'

type Question = {
  id: number
  category: string
  text: string
  options: string[]
  correctAnswer: number
  difficulty: Difficulty
  pattern: string
  hint: string
}

const questions: Question[] = [
  {
    id: 1,
    category: "Logical Reasoning",
    text: "What comes next in the sequence: 2, 4, 8, 16, ...?",
    options: ["24", "32", "64", "128"],
    correctAnswer: 1,
    difficulty: 'easy',
    pattern: "repeating-triangles",
    hint: "Think about multiplying by a certain number."
  },
  {
    id: 2,
    category: "Spatial Reasoning",
    text: "Which shape completes the pattern?",
    options: ["Circle", "Square", "Triangle", "Pentagon"],
    correctAnswer: 2,
    difficulty: 'medium',
    pattern: "checkered",
    hint: "Consider the symmetry and rotation of the shapes."
  },
  {
    id: 3,
    category: "Mathematical Reasoning",
    text: "If 2 + 2 = 4, what is 3 + 3?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 1,
    difficulty: 'easy',
    pattern: "polka-dots",
    hint: "This is a simple addition problem."
  },
  {
    id: 4,
    category: "Verbal Reasoning",
    text: "Complete the analogy: Book is to Reading as Fork is to:",
    options: ["Writing", "Eating", "Cooking", "Sleeping"],
    correctAnswer: 1,
    difficulty: 'medium',
    pattern: "zigzag",
    hint: "Think about the primary function of a fork."
  },
  {
    id: 5,
    category: "Pattern Recognition",
    text: "What number should come next in this series? 2, 4, 6, 8, ...",
    options: ["9", "10", "11", "12"],
    correctAnswer: 1,
    difficulty: 'easy',
    pattern: "stripes",
    hint: "Look for a pattern in the numbers."
  },
  {
    id: 6,
    category: "Logical Reasoning",
    text: "If all roses are flowers and some flowers fade quickly, which of the following statements must be true?",
    options: ["All roses fade quickly", "Some roses fade quickly", "No roses fade quickly", "Roses never fade"],
    correctAnswer: 1,
    difficulty: 'medium',
    pattern: "repeating-triangles",
    hint: "Consider the relationship between roses and flowers."
  },
  {
    id: 7,
    category: "Spatial Reasoning",
    text: "If you unfold a cube, which of the following shapes could you NOT get?",
    options: ["T-shape", "Cross shape", "L-shape", "S-shape"],
    correctAnswer: 3,
    difficulty: 'hard',
    pattern: "checkered",
    hint: "Try visualizing how a cube unfolds."
  },
  {
    id: 8,
    category: "Mathematical Reasoning",
    text: "What is the next number in the sequence: 1, 1, 2, 3, 5, 8, ...?",
    options: ["10", "11", "13", "15"],
    correctAnswer: 2,
    difficulty: 'medium',
    pattern: "polka-dots",
    hint: "This is a famous number sequence."
  },
  {
    id: 9,
    category: "Verbal Reasoning",
    text: "Choose the word that does not belong in the group:",
    options: ["Apple", "Banana", "Carrot", "Cherry"],
    correctAnswer: 2,
    difficulty: 'easy',
    pattern: "zigzag",
    hint: "Think about the type of food each word represents."
  },
  {
    id: 10,
    category: "Pattern Recognition",
    text: "What comes next in the pattern: A1, B2, C3, D4, ...?",
    options: ["E5", "F6", "D5", "E4"],
    correctAnswer: 0,
    difficulty: 'medium',
    pattern: "stripes",
    hint: "Look at the relationship between the letters and numbers."
  },
  {
    id: 11,
    category: "Logical Reasoning",
    text: "If it's not sunny, then it's cloudy. It's not cloudy. Is it sunny?",
    options: ["Yes", "No", "Not enough information", "It's both sunny and cloudy"],
    correctAnswer: 0,
    difficulty: 'medium',
    pattern: "repeating-triangles",
    hint: "Use deductive reasoning to solve this."
  },
  {
    id: 12,
    category: "Spatial Reasoning",
    text: "Which of these is NOT a valid view of a cube?",
    options: ["Square", "Rectangle", "Hexagon", "Triangle"],
    correctAnswer: 2,
    difficulty: 'hard',
    pattern: "checkered",
    hint: "Think about the number of sides a cube has."
  },
  {
    id: 13,
    category: "Mathematical Reasoning",
    text: "If a shirt costs $20 and is on sale for 25% off, what is the sale price?",
    options: ["$10", "$15", "$16", "$18"],
    correctAnswer: 1,
    difficulty: 'medium',
    pattern: "polka-dots",
    hint: "Calculate 25% of $20 and subtract it from the original price."
  },
  {
    id: 14,
    category: "Verbal Reasoning",
    text: "Choose the pair of words that have a similar relationship: Book : Page",
    options: ["Tree : Leaf", "Car : Wheel", "House : Brick", "Pencil : Lead"],
    correctAnswer: 0,
    difficulty: 'medium',
    pattern: "zigzag",
    hint: "Think about the part-to-whole relationship."
  },
  {
    id: 15,
    category: "Pattern Recognition",
    text: "What comes next in the pattern: 1, 3, 6, 10, 15, ...?",
    options: ["18", "20", "21", "25"],
    correctAnswer: 2,
    difficulty: 'hard',
    pattern: "stripes",
    hint: "Look at the differences between consecutive numbers."
  },
  {
    id: 16,
    category: "Logical Reasoning",
    text: "All dogs have tails. Fido is a dog. Does Fido have a tail?",
    options: ["Yes", "No", "Not enough information", "Dogs don't have tails"],
    correctAnswer: 0,
    difficulty: 'easy',
    pattern: "repeating-triangles",
    hint: "This is a simple deductive reasoning problem."
  },
  {
    id: 17,
    category: "Spatial Reasoning",
    text: "If you rotate a triangle 180 degrees, which of these is true?",
    options: ["It looks exactly the same", "It's upside down", "It becomes a different shape", "It disappears"],
    correctAnswer: 1,
    difficulty: 'medium',
    pattern: "checkered",
    hint: "Visualize rotating a triangle."
  },
  {
    id: 18,
    category: "Mathematical Reasoning",
    text: "If you have 3 apples and 4 oranges, what fraction of the fruit are apples?",
    options: ["3/4", "4/7", "3/7", "1/2"],
    correctAnswer: 2,
    difficulty: 'medium',
    pattern: "polka-dots",
    hint: "The total number of fruits is 3 + 4 = 7."
  },
  {
    id: 19,
    category: "Verbal Reasoning",
    text: "Which word is the odd one out?",
    options: ["Swift", "Quick", "Fast", "Slow"],
    correctAnswer: 3,
    difficulty: 'easy',
    pattern: "zigzag",
    hint: "Consider the meaning of each word."
  },
  {
    id: 20,
    category: "Pattern Recognition",
    text: "What letter comes next in the sequence: A, C, E, G, ...?",
    options: ["H", "I", "J", "K"],
    correctAnswer: 1,
    difficulty: 'medium',
    pattern: "stripes",
    hint: "These are vowels."
  },
  {
    id: 21,
    category: "Logical Reasoning",
    text: "If all A are B, and all B are C, then:",
    options: ["All C are A", "All A are C", "Some A are not C", "None of the above"],
    correctAnswer: 1,
    difficulty: 'hard',
    pattern: "repeating-triangles",
    hint: "Use deductive reasoning."
  },
  {
    id: 22,
    category: "Spatial Reasoning",
    text: "Which of these nets, when folded, forms a cube?",
    options: ["T-shape", "Plus sign", "L-shape", "Z-shape"],
    correctAnswer: 1,
    difficulty: 'hard',
    pattern: "checkered",
    hint: "Visualize folding each net."
  },
  {
    id: 23,
    category: "Mathematical Reasoning",
    text: "What is the value of x in the equation: 2x + 5 = 13?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
    difficulty: 'medium',
    pattern: "polka-dots",
    hint: "Solve the equation for x."
  },
  {
    id: 24,
    category: "Verbal Reasoning",
    text: "Choose the word that best completes the analogy: Light is to Dark as Happy is to ___",
    options: ["Joyful", "Bright", "Sad", "Excited"],
    correctAnswer: 2,
    difficulty: 'medium',
    pattern: "zigzag",
    hint: "Think about antonyms."
  },
  {
    id: 25,
    category: "Pattern Recognition",
    text: "What comes next in the pattern: 2, 6, 12, 20, ...?",
    options: ["24", "28", "30", "32"],
    correctAnswer: 2,
    difficulty: 'hard',
    pattern: "stripes",
    hint: "Look at the differences between consecutive numbers."
  }
]
type TestResult = {
  id: number
  date: string
  score: number
  iqScore: number
  categoryScores: Record<string, number>
  difficultyScores: Record<Difficulty, number>
  timePerQuestion: number
}

const patterns = {
  "repeating-triangles": `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  "checkered": `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f97316' fill-opacity='0.2' fill-rule='evenodd'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20z'/%3E%3C/g%3E%3C/svg%3E")`,
  "polka-dots": `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f97316' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
  "zigzag": `url("data:image/svg+xml,%3Csvg width='40' height='12' viewBox='0 0 40 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 6.172L6.172 0h5.656L0 11.828V6.172zm40 5.656L28.172 0h5.656L40 6.172v5.656zM6.172 12l12-12h3.656l12 12h-5.656L20 3.828 11.828 12H6.172zm12 0L20 10.172 21.828 12h-3.656z' fill='%23f97316' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E")`,
  "stripes": `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f97316' fill-opacity='0.2' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
}

export default function Component() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isTestActive, setIsTestActive] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [currentTab, setCurrentTab] = useState("start")
  const [categoryScores, setCategoryScores] = useState<Record<string, number>>({})
  const [difficultyScores, setDifficultyScores] = useState<Record<Difficulty, number>>({
    easy: 0,
    medium: 0,
    hard: 0
  })
  const [isPractice, setIsPractice] = useState(false)
  const [totalTime, setTotalTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [showHint, setShowHint] = useState(false)
  const [hintUsed, setHintUsed] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const calculateIQ = useCallback(() => {
    const baseIQ = 100
    const scorePercentage = score / questions.length
    const difficultyFactor = (difficultyScores.easy * 1 + difficultyScores.medium * 2 + difficultyScores.hard * 3) / score
    const timeFactor = 1 - Math.min(totalTime / (questions.length * 60), 1)
    const iqRange = 40
    return Math.round(baseIQ + (scorePercentage - 0.5) * iqRange * difficultyFactor * timeFactor)
  }, [score, difficultyScores, totalTime])

  const finishTest = useCallback(() => {
    if (!isPractice) {
      const iqScore = calculateIQ()
      const newResult: TestResult = {
        id: testResults.length + 1,
        date: new Date().toLocaleString(),
        score: score,
        iqScore: iqScore,
        categoryScores: categoryScores,
        difficultyScores: difficultyScores,
        timePerQuestion: totalTime / questions.length
      }
      setTestResults(prevResults => [...prevResults, newResult])
    }
    setIsTestActive(false)
    setCurrentTab("results")
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [isPractice, score, categoryScores, difficultyScores, totalTime, testResults.length, calculateIQ])

  const nextQuestion = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prevQuestion => prevQuestion + 1)
      setTimeLeft(60)
      setShowHint(false)
      setHintUsed(false)
    } else {
      finishTest()
    }
  }, [currentQuestion, finishTest])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (timeLeft > 0 && isTestActive) {
      timer = setTimeout(() => {
        setTimeLeft(prevTime => prevTime - 1)
        setTotalTime(prevTotal => prevTotal + 1)
      }, 1000)
    } else if (timeLeft === 0 && currentQuestion < questions.length - 1) {
      nextQuestion()
    } else if (timeLeft === 0 && currentQuestion === questions.length - 1) {
      finishTest()
    }
    return () => clearTimeout(timer)
  }, [timeLeft, currentQuestion, isTestActive, nextQuestion, finishTest])

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
  }, [darkMode])

  const startTest = (practice: boolean) => {
    setIsTestActive(true)
    setCurrentQuestion(0)
    setScore(0)
    setTimeLeft(60)
    setCategoryScores({})
    setDifficultyScores({ easy: 0, medium: 0, hard: 0 })
    setIsPractice(practice)
    setCurrentTab("test")
    setTotalTime(0)
    setShowHint(false)
    setHintUsed(false)
    if (soundEnabled && audioRef.current) {
      audioRef.current.play()
    }
  }

  const handleAnswer = (selectedAnswer: number) => {
    const currentQuestionData = questions[currentQuestion]
    if (selectedAnswer === currentQuestionData.correctAnswer) {
      setScore(prevScore => prevScore + (hintUsed ? 0.5 : 1))
      setCategoryScores(prev => ({
        ...prev,
        [currentQuestionData.category]: (prev[currentQuestionData.category] || 0) + (hintUsed ? 0.5 : 1)
      }))
      setDifficultyScores(prev => ({
        ...prev,
        [currentQuestionData.difficulty]: prev[currentQuestionData.difficulty] + (hintUsed ? 0.5 : 1)
      }))
      if (soundEnabled) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
      }
    }
    nextQuestion()
  }

  const getChartData = (data: Record<string, number>) => {
    return Object.entries(data).map(([name, value]) => ({ name, value }))
  }

  const toggleSound = () => {
    setSoundEnabled(prevEnabled => !prevEnabled)
    setIsMuted(prevMuted => !prevMuted)
    if (audioRef.current) {
      if (soundEnabled) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
    }
  }

  const handleHint = () => {
    setShowHint(true)
    setHintUsed(true)
  }

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode)
  }

  return (
    <TooltipProvider>
      <div className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-purple-900 dark:to-indigo-900">
        <Card className="w-full max-w-4xl mx-auto shadow-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-primary">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                 IQ Test 
              </motion.div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="grid w-full grid-cols-5 rounded-xl bg-orange-200 dark:bg-indigo-800">
                <TabsTrigger value="start" className="data-[state=active]:bg-white dark:data-[state=active]:bg-indigo-600">Start</TabsTrigger>
                <TabsTrigger value="test" disabled={!isTestActive} className="data-[state=active]:bg-white dark:data-[state=active]:bg-indigo-600">Test</TabsTrigger>
                <TabsTrigger value="results" className="data-[state=active]:bg-white dark:data-[state=active]:bg-indigo-600">Results</TabsTrigger>
                <TabsTrigger value="analysis" className="data-[state=active]:bg-white dark:data-[state=active]:bg-indigo-600">Analysis</TabsTrigger>
                <TabsTrigger value="about" className="data-[state=active]:bg-white dark:data-[state=active]:bg-indigo-600">About Me</TabsTrigger>
              </TabsList>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="start">
                    <Card className="bg-white dark:bg-gray-800">
                      <CardHeader>
                        <CardTitle className="text-2xl text-orange-500 dark:text-indigo-400">Welcome to the Fun IQ Adventure!</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">Get ready for an exciting journey through {questions.length} fun questions! You&apos;ll have 60 seconds for each question.</p>
                        <p className="mb-4">Choose to start a practice adventure or the full IQ quest!</p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button onClick={() => startTest(true)} variant="outline" className="bg-yellow-200  text-yellow-800 hover:bg-yellow-300">
                          <Zap className="mr-2 h-4 w-4" /> Practice Adventure
                        </Button>
                        <Button onClick={() => startTest(false)} className="bg-orange-500 text-white hover:bg-orange-600">
                          <Brain className="mr-2 h-4 w-4" /> Start Full Quest
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  <TabsContent value="test">
                    {isTestActive && (
                      <Card  className="bg-white dark:bg-gray-800">
                        <CardHeader>
                          <CardTitle className="flex justify-between items-center text-orange-500 dark:text-indigo-400">
                            <span>Question {currentQuestion + 1}</span>
                            <span className="text-sm font-normal">{questions[currentQuestion].category} ({questions[currentQuestion].difficulty})</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <motion.div
                            className="w-full h-48 rounded-lg mb-4"
                            style={{ backgroundImage: patterns[questions[currentQuestion].pattern as keyof typeof patterns] }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                          />
                          <p className="mb-4 text-lg">{questions[currentQuestion].text}</p>
                          {!showHint && (
                            <Button onClick={handleHint} variant="outline" className="mt-2">
                              <HelpCircle className="mr-2 h-4 w-4" /> Use Hint (0.5 point penalty)
                            </Button>
                          )}
                          {showHint && (
                            <p className="mt-2 text-sm text-orange-600 dark:text-indigo-300">
                              Hint: {questions[currentQuestion].hint}
                            </p>
                          )}
                          <div className="flex items-center mb-2">
                            <Clock className="mr-2 h-4 w-4 text-orange-500 dark:text-indigo-400" />
                            <Progress value={(timeLeft / 60) * 100} className="flex-grow" />
                            <span className="ml-2 text-sm">{timeLeft}s</span>
                          </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2">
                          {questions[currentQuestion].options.map((option, index) => (
                            <Button
                              key={index}
                              onClick={() => handleAnswer(index)}
                              className="w-full justify-start text-left bg-orange-100 hover:bg-orange-200 text-orange-800 dark:bg-indigo-900 dark:hover:bg-indigo-800 dark:text-indigo-100"
                              variant="outline"
                            >
                              {String.fromCharCode(65 + index)}. {option}
                            </Button>
                          ))}
                        </CardFooter>
                      </Card>
                    )}
                  </TabsContent>
                  <TabsContent value="results">
                    <Card className="bg-white dark:bg-gray-800">
                      <CardHeader>
                        <CardTitle className="text-2xl text-orange-500 dark:text-indigo-400">Your Adventure Results</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                          {testResults.map((result) => (
                            <motion.div
                              key={result.id}
                              className="mb-4 p-4 border rounded-md bg-orange-50 dark:bg-indigo-900"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <p className="font-semibold text-orange-600 dark:text-indigo-300">Adventure #{result.id}</p>
                              <p>Date: {result.date}</p>
                              <p>Score: {result.score}/{questions.length}</p>
                              <p>Estimated IQ: {result.iqScore}</p>
                              <p>Average Time per Question: {result.timePerQuestion.toFixed(2)}s</p>
                              <Button variant="link" onClick={() => setCurrentTab("analysis")} className="text-orange-500 dark:text-indigo-400">
                                View Detailed Analysis <ChevronRight className="ml-2 h-4 w-4" />
                              </Button>
                            </motion.div>
                          ))}
                        </ScrollArea>
                      </CardContent>
                      <CardFooter>
                        <Button onClick={() => startTest(false)} className="w-full bg-orange-500 text-white hover:bg-orange-600">
                          <RotateCcw className="mr-2 h-4 w-4" /> Start a New Adventure
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  <TabsContent value="analysis">
                    <Card className="bg-white dark:bg-gray-800">
                      <CardHeader>
                        <CardTitle className="text-2xl text-orange-500 dark:text-indigo-400">Your Adventure Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <h3 className="font-semibold text-lg mb-2 text-orange-600 dark:text-indigo-300">Category Performance</h3>
                            <ResponsiveContainer width="100%" height={200}>
                              <BarChartComponent data={getChartData(categoryScores)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <RechartsTooltip />
                                <Bar dataKey="value" fill="#f97316" />
                              </BarChartComponent>
                            </ResponsiveContainer>
                          </div>
                          <div>
                            <h3  className="font-semibold text-lg mb-2 text-orange-600 dark:text-indigo-300">Difficulty Performance</h3>
                            <ResponsiveContainer width="100%" height={200}>
                              <BarChartComponent data={getChartData(difficultyScores)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <RechartsTooltip />
                                <Bar dataKey="value" fill="#f97316" />
                              </BarChartComponent>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <p className="text-sm text-orange-600 dark:text-indigo-300">
                          This analysis shows how well you did in different types of questions and difficulty levels. Use this to see where you can improve and have even more fun on your next adventure!
                        </p>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  <TabsContent value="about">
                    <Card className="bg-white dark:bg-gray-800">
                      <CardHeader>
                        <CardTitle className="text-2xl text-orange-500 dark:text-indigo-400">About the Creator</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-4 mb-4">
                          <User className="h-12 w-12 text-orange-500 dark:text-indigo-400" />
                          <div>
                            <h3 className="text-lg font-semibold">Abdulganeey Jumoke Kabirat</h3>
                            <p className="text-sm text-orange-600 dark:text-indigo-300">Final Year Computer Science Student</p>
                          </div>
                        </div>
                        <p className="mb-4">
                          Hello! I&apos;m Abdulganeey Jumoke Kabirat, a final year Computer Science student at Sa&apos;adu Zungur University. This IQ Adventure is my final year project, designed to make learning and assessment fun for primary school students.
                        </p>
                        <p className="mb-4">
                          My goal with this project is to combine education and technology in an engaging way, helping young minds explore their potential while having a great time!
                        </p>
                        <p>
                          I hope you enjoy this IQ Adventure as much as I enjoyed creating it. Remember, every question you answer is a step towards growing your amazing brain!
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-orange-500 text-white hover:bg-orange-600" onClick={() => setCurrentTab("start")}>
                          Start Your Adventure!
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Button variant="ghost" onClick={toggleSound} className="text-orange-500 dark:text-indigo-400">
              {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
            </Button>
            <Button variant="ghost" onClick={toggleDarkMode} className="text-orange-500 dark:text-indigo-400">
              {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </Button>
            <p className="text-sm text-orange-600 dark:text-indigo-300">© 2024 IQ Adventure</p>
          </CardFooter>
        </Card>
      </div>
      <audio ref={audioRef} loop>
        <source src="/background-music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </TooltipProvider>
  )
}