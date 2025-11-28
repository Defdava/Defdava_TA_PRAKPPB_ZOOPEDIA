// src/pages/Quiz.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllAnimals } from '../services/api'
import { CheckCircle, XCircle, Trophy, ArrowLeft } from 'lucide-react'

export default function Quiz() {
  const [animals, setAnimals] = useState([])
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)

  // Ambil semua hewan dan buat 15 soal acak
  useEffect(() => {
    getAllAnimals().then(data => {
      const shuffled = [...data].sort(() => 0.5 - Math.random())
      const selected = shuffled.slice(0, 15)

      const quizQuestions = selected.map(animal => {
        // Buat 3 jawaban salah acak
        const wrongOptions = data
          .filter(a => a.id !== animal.id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map(a => a.nama)

        const options = [animal.nama, ...wrongOptions].sort(() => 0.5 - Math.random())

        return {
          animal,
          question: `Hewan apa yang tertera pada gambar? "${animal.nama_latin}`,
          options,
          correct: animal.nama
        }
      })

      setAnimals(data)
      setQuestions(quizQuestions)
      setLoading(false)
    })
  }, [])

  const handleAnswer = () => {
    if (!selectedAnswer) return

    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(prev => prev + 1)
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer('')
    } else {
      setShowResult(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer('')
    setScore(0)
    setShowResult(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-32 flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-dark-red border-t-transparent"></div>
          <p className="mt-4 text-xl text-dark-red">Menyiapkan kuis...</p>
        </div>
      </div>
    )
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100)
    const isExcellent = percentage >= 90

    return (
      <div className="min-h-screen pt-20 pb-32 px-6 bg-cream flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <Trophy size={100} className={`mx-auto mb-6 ${isExcellent ? 'text-yellow-500' : 'text-dark-red'}`} />
          <h1 className="text-4xl font-bold text-dark-red mb-4">Kuis Selesai!</h1>
          <div className="text-6xl font-bold text-dark-red mb-4">{score} / {questions.length}</div>
          <p className="text-2xl mb-8">{percentage}% Benar</p>

          <div className="space-y-6 mb-10 max-h-96 overflow-y-auto">
            {questions.map((q, i) => {
              const userAnswer = i === currentQuestion && selectedAnswer ? selectedAnswer : null
              const isCorrect = q.correct === (i < currentQuestion || i === currentQuestion ? q.correct : null)

              return (
                <div key={i} className="bg-gray-50 rounded-xl p-4 text-left">
                  <p className="font-semibold mb-2">Soal {i + 1}: {q.question}</p>
                  <p className="text-sm">
                    <span className="font-medium">Jawaban benar:</span> {q.correct}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={resetQuiz}
              className="bg-dark-red text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700 transition"
            >
              Ulangi Kuis
            </button>
            <Link
              to="/dashboard"
              className="bg-gray-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-700 transition flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Kembali
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const q = questions[currentQuestion]

  return (
    <div className="min-h-screen pt-20 pb-32 px-6 bg-cream">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-dark-red text-white p-6 text-center">
            <h1 className="text-2xl font-bold">Kuis Pengetahuan Hewan</h1>
            <p className="mt-2">Soal {currentQuestion + 1} dari {questions.length}</p>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-200 h-3">
            <div
              className="bg-dark-red h-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question */}
          <div className="p-8">
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-dark-red mb-8 text-center">
                {q.question}
              </h2>

              {/* Image Clue */}
              <div className="flex justify-center mb-8">
                <img
                  src={q.animal.gambar}
                  alt="Petunjuk"
                  className="w-64 h-64 object-cover rounded-2xl shadow-lg"
                />
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {q.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedAnswer(option)}
                    className={`p-5 rounded-xl border-2 text-lg font-medium transition-all ${
                      selectedAnswer === option
                        ? 'border-dark-red bg-red-50 text-dark-red'
                        : 'border-gray-300 hover:border-dark-red hover:bg-red-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleAnswer}
                disabled={!selectedAnswer}
                className={`px-12 py-4 rounded-xl font-bold text-white transition ${
                  selectedAnswer
                    ? 'bg-dark-red hover:bg-red-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {currentQuestion === questions.length - 1 ? 'Selesai' : 'Lanjut'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}