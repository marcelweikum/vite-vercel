// UserForm.jsx
import React, { useState, useContext } from 'react'
import { UserContext } from './UserContext'
import { useNavigate } from 'react-router-dom'

export default function UserForm() {
    const [inputName, setInputName] = useState("")
    const { setName } = useContext(UserContext)
    const navigate = useNavigate()

    function handleSubmit(e) {
        e.preventDefault()
        if (inputName.trim() === "") {
            alert("Bitte gib deinen Namen ein.")
            return
        }
        setName(inputName)
        navigate('/quiz')
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Your Name:
                <input 
                    type="text" 
                    value={inputName} 
                    onChange={(e) => setInputName(e.target.value)} 
                    required 
                />
            </label>
            <button type="submit">Start Quiz</button>
        </form>
    )
}
