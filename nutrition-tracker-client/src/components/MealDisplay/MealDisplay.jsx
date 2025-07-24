import React, {useEffect, useState} from 'react'
import API_BASE_URL from '../../config'
import styles from './MealDisplay.module.css'
import { formatInTimeZone } from 'date-fns-tz'
import { addDays, subDays, format } from 'date-fns'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function MealDisplay() {
    const [meals, setMeals] = useState([])
    const [mealItems, setMealItems] = useState([])
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedMealId, setSelectedMealId] = useState(null)

    // When the page is loaded, fetch the meals
    useEffect(() => {
        //getUserMeals(1)
        //console.log(selectedDate)
        getUserMealsByDate(1, selectedDate)
    }, [selectedDate])

    const goToPreviousDay = () => {
        setSelectedDate(prev => subDays(prev, 1))
    }

    const goToNextDay = () => {
        setSelectedDate(prev => addDays(prev, 1))
    }

    // Get all the user's meals given a user id and date
    const getUserMealsByDate = async (userId, date) => {
        try {
            const formattedDate = format(date, 'yyyy-MM-dd')
            //console.log(formattedDate)
            const response = await fetch(`${API_BASE_URL}Meals/user/${userId}/${formattedDate}`)
            const data = await response.json()
            setMeals(Array.isArray(data) ? data : [])
            //console.log(meals)
        }
        catch (err) {
            console.error("Failed to fetch meals:", err)
            setMeals([])
        }
    }

    // Get all the user's meal items given a meal id
    const getMealItems = async (mealId) => {
        try {
            const response = await fetch(`${API_BASE_URL}MealItems/meal/${mealId}`)
            const data = await response.json()
            setMealItems(Array.isArray(data) ? data: [])
            console.log(mealItems)
        }
        catch (err) {
            console.error("Failed to fetch meal items:", err)
            setMealItems([])
        }
    }

    // Take in a date time object and return a formatted date and time
    const formatDateTime = (dateTime) => {
        // Add Z so that it can be converted from UTC to the user's time zone
        const utcDateTime = new Date(dateTime + 'Z')
        // Get the user's time zone
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        // Return the formatted date converted to the time zone
        return formatInTimeZone(utcDateTime, userTimeZone, "h:mm a")
    }

    const handleClickMeal = (mealId) => {
        if (mealId == selectedMealId) {
            setSelectedMealId(-1)
        }
        else {
        setSelectedMealId(mealId)
        }
        getMealItems(mealId)
    }

    const handleDeleteMeal = async (mealId) => {
        try {
            // Send a delete request to the API
            const response = await fetch(`${API_BASE_URL}Meals/${mealId}`, {
                method: 'DELETE',
            })
            // If it goes through, update the meals list
            if (response.ok) {
                setMeals((prevMeals) => prevMeals.filter((meal) => meal.id !== mealId))
                if (selectedMealId === mealId) {
                    setSelectedMealId(null)
                    setMealItems([])
                }

            } else {
                console.error('Failed to delete meal.')
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    useEffect(() => {
        console.log(selectedMealId)
    }, [selectedMealId])


    return(
        <div className={styles.mealDisplayContainer}>
            <div className={styles.dateControls}>
                <button className={styles.dateControlsButton} onClick={goToPreviousDay}>←</button>
                <DatePicker
                    selected={selectedDate}
                    onChange={date => setSelectedDate(date)}
                    dateFormat="MM/dd/yyyy"
                    className={styles.customDatePicker}
                />
                <button className={styles.dateControlsButton} onClick={goToNextDay}>→</button>
            </div>

            {meals.length === 0 ? (
            <p>No meals logged yet.</p>
            ) : (
                <div className={styles.mealListContainer}>
                    <ul className={styles.mealList}>
                        {meals.map((meal) => (
                            <li 
                            key={meal.id}
                            >
                                <strong>{meal.name}</strong>: {formatDateTime(meal.dateTime)} <button onClick={() => handleClickMeal(meal.id)}>{meal.id === selectedMealId ? (<p>↑</p>) : (<p>↓</p>)}</button><br/>
                                {selectedMealId === meal.id && (
                                    <ul className={styles.mealItemsList}>
                                        {mealItems.map((mealItem) => (
                                            <li
                                                key={mealItem.id}>
                                                <p>{mealItem.name}</p>
                                                <ul className={styles.nutrientList}>
                                                    <li>Calories: {mealItem.calories} kcal</li>
                                                    <li>Protein: {mealItem.protein}g</li>
                                                    <li>Carbs: {mealItem.carbs}g</li>
                                                    <li>Fat: {mealItem.fat}g</li>
                                                </ul>
                                            </li>
                                        ))}
                                        
                                        <span>
                                            <button>Edit</button>
                                            <button onClick={() => handleDeleteMeal(meal.id)}>Delete</button>
                                        </span>
                                    </ul>
                                    
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}