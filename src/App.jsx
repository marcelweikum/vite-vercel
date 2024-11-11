// App.jsx
import { useState, useEffect } from 'react'
import { UserProvider } from './components/UserContext'
import Header from './components/Header'
import Question from './components/Question'
import Results from './components/Results'
import UserForm from './components/UserForm'
import { Routes, Route } from 'react-router-dom';

function App() {

  const [userName, setUserName] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [element, setElement] = useState("")
  const [artwork, setArtwork] = useState(null)
  
  const questions = [
    {
      question: "What's your favorite color?",
      options: ["Red", "Blue", "Green", "Yellow"],
    },
    {
      question: "What's your favorite hobby?",
      options: ["Reading", "Sports", "Gaming", "Traveling"]
    },
    {
      question: "What's your favorite season?",
      options: ["Summer", "Winter", "Spring", "Autumn"]
    },
    {
      question: "What animal do you prefer?",
      options: ["Lion", "Snake", "Badger", "Penguin"]
    },
  ]

  const keywords = {
    Fire: "fire",
    Water: "water",
    Earth: "earth",
    Air: "air",
  }

  const elements = {
    "Red": "Fire",
    "Blue": "Water",
    "Green": "Earth",
    "Yellow": "Air",
    
    "Reading": "Air",
    "Sports": "Fire",
    "Gaming": "Water",
    "Traveling": "Earth",
    
    "Summer": "Fire",
    "Winter": "Water",
    "Spring": "Earth",
    "Autumn": "Air",
    
    "Lion": "Fire",
    "Snake": "Water",
    "Badger": "Earth",
    "Penguin": "Air",
  }
  

  useEffect(
    function() {
      if (currentQuestionIndex === questions.length) {
        const selectedElement = determineElement(answers)
        setElement(selectedElement)
        fetchArtwork(keywords[selectedElement])
      }
    },
    [currentQuestionIndex]
  )

  const fetchArtwork = async (element) => {
    try {
      const searchResponse = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${element}`)
      const searchData = await searchResponse.json()

      if (searchData.total === 0) {
        console.error("Keine Kunstwerke gefunden für das Element:", element)
        setArtwork(null)
        return
      }

      const randomIndex = Math.floor(Math.random() * searchData.objectIDs.length)
      const objectID = searchData.objectIDs[randomIndex]

      const objectResponse = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`)
      const objectData = await objectResponse.json()

      const requiredFields = ['title', 'primaryImage', 'artistDisplayName', 'objectDate']
      const hasAllFields = requiredFields.every(field => field in objectData)

      if (hasAllFields && objectData.primaryImage) {
        setArtwork(objectData)
      } else {
        console.error("Das ausgewählte Kunstwerk hat nicht alle erforderlichen Felder oder kein Bild.")
        setArtwork(null)
      }

    } catch (error) {
      console.error("Fehler beim Abrufen des Kunstwerks:", error)
      setArtwork(null)
    }
  }

  function handleAnswer(answer) {
    setAnswers([...answers, answer])
    setCurrentQuestionIndex(currentQuestionIndex + 1)
  }

  function handleUserFormSubmit(name) {
    setUserName(name)
  }

  function determineElement(answers) {
    const counts = {}
    answers.forEach(function(answer) {
      const element = elements[answer]
      counts[element] = (counts[element] || 0) + 1
    })
    return Object.keys(counts).reduce(function(a, b) {
      return counts[a] > counts[b] ? a : b
    })
  }

  return (
    <UserProvider value={{ name: userName, setName: setUserName }}>
      <Header />
        <Routes>
          <Route path="/" element={<UserForm onSubmit={handleUserFormSubmit} />} />
          <Route
            path="/quiz"
            element={
              currentQuestionIndex < questions.length ? (
                <Question 
                  question={questions[currentQuestionIndex].question} 
                  options={questions[currentQuestionIndex].options} 
                  onAnswer={handleAnswer} 
                />
              ) : (
                <Results element={element} artwork={artwork} />
              )
            }
          />
        </Routes>
      <Footer />
    </UserProvider>
  )
}

export default App
