import React, {useEffect, useState} from 'react'
import API_BASE_URL from '../../config'
import styles from './MealDisplay.module.css'
import { formatInTimeZone } from 'date-fns-tz'
import { addDays, subDays, format } from 'date-fns'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function MealDisplay() {
    const [meals, setMeals] = useState([])
    const [selectedDate, setSelectedDate] = useState(new Date())

    // When the page is loaded, fetch the meals
    useEffect(() => {
        //getUserMeals(1)
        console.log(selectedDate)
        getUserMealsByDate(1, selectedDate)
    }, [selectedDate])

    const goToPreviousDay = () => {
        setSelectedDate(prev => subDays(prev, 1))
    }

    const goToNextDay = () => {
        setSelectedDate(prev => addDays(prev, 1))
    }

    // Get all the user's meals based on their user id
    const getUserMeals = async (user_id) => {
        try {
            const response = await fetch(`${API_BASE_URL}Meals/${user_id}/meals`)
            const data = await response.json()
            console.log(data)
            setMeals(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error("Failed to fetch meals:", err)
            setMeals([])
        }
    }

    // Get all the user's meals given a user id and date
    const getUserMealsByDate = async (userId, date) => {
        try {
            const formattedDate = format(date, 'yyyy-MM-dd')
            console.log(formattedDate)
            const response = await fetch(`${API_BASE_URL}Meals/${userId}/${formattedDate}/meals`)
            const data = await response.json()
            setMeals(Array.isArray(data) ? data : [])
            console.log(meals)
        }
        catch (err) {
            console.error("Failed to fetch meals:", err)
            setMeals([])
        }
    }


    // Take in a date time object and return a formatted date and time
    const formatDateTime = (dateTime) => {
        // Add Z so that it can be converted from UTC to the user's time zone
        const utcDateTime = new Date(dateTime + 'Z')
        // Get the user's time zone
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        // Return the formatted date converted to the time zone
        return formatInTimeZone(utcDateTime, userTimeZone, "MM/dd/yyyy h:mm a")
    }


    return(
        <div className={styles.mealDisplayContainer}>
        <div className={styles.dateControls}>
            <button onClick={goToPreviousDay}>←</button>
            <DatePicker
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                dateFormat="MM/dd/yyyy"
            />
            <button onClick={goToNextDay}>→</button>
        </div>

            {meals.length === 0 ? (
            <p>No meals logged yet.</p>
            ) : (
                <ul>
                    {meals.map((meal) => (
                        <li key={meal.id}>
                            <strong>{meal.name}</strong>: {formatDateTime(meal.date_time)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}