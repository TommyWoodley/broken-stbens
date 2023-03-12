import { useState } from 'react'

import { useToast } from './toast.context'

export default function useAuth() {
    const { addToast } = useToast()
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const loginUser = (username: string, password: string) => {
        // Reset the login
        setIsLoggedIn(false)

        // // Here we can handle what students are trying to do
        // if (username === 'admin' && password === 'admin') {
        //     setIsLoggedIn(true)
        //     addToast({ variant: 'success', title: 'Yay - You broke into the admin account - try the teacher account next.' })
        //     return;
        // }
        //
        // if (username === 'teacher' && password === 'stbenedicts') {
        //     setIsLoggedIn(true)
        //     addToast({ variant: 'success', title: 'Yay - You broke into the teacher account - try the student account next.' })
        //     return;
        // }
        //
        // if (username === 'student' && password === 'Frixos07!') {
        //     setIsLoggedIn(true)
        //     addToast({ variant: 'success', title: 'Wow - You broke into the student account too - Congratulations!!!' })
        //     return;
        // }

        if (username === 'secure' && password === 'password123') {
            setIsLoggedIn(true)
            return;
        }

        console.log("Looking up username: " + username + " and password: " + password + " in the database.")

        let query = "SELECT * FROM Users WHERE UserId = '" + username + "' AND PassWord = '" + password + "' ;"

        if (query.includes("--")) {
            query = query.slice(0, query.indexOf("--"))
        }
        console.log(query)

        let lowerUN = username.toLowerCase()



        if (lowerUN.includes("'") && lowerUN.includes("--") && lowerUN.includes("or") && lowerUN.includes("=")) {
            let eqIndex = lowerUN.indexOf("=")
            let startIndex = lowerUN.indexOf("or") + 2
            let endIndex = lowerUN.indexOf(" ", eqIndex) === -1 ? lowerUN.length : lowerUN.indexOf(" ", eqIndex);

            let str1 = username.slice(startIndex, eqIndex).trim()
            let str2 = username.slice(eqIndex + 1, endIndex).trim()

            if (str1 === str2) {
                setIsLoggedIn(true)
                return;
            }
        }

        setIsLoggedIn(false)
        addToast({ variant: 'error', title: 'Incorrect Username or Password' })
    }

    return { loginUser, isLoggedIn }
}

