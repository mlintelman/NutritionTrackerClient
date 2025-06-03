import React, {useState} from 'react'
import FoodSearch from '../FoodSearch/FoodSearch'
import SearchBar from '../SearchBar/SearchBar'
import styles from './MealForm.module.css'

// Edit later to allow multiple food selections!
export default function MealForm() {
    const [selectedFood, setSelectedFood] = useState(null)

    const handleFoodSelect = (foodItem) => {
        setSelectedFood(foodItem)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Meal submission: ', selectedFood)
    }

    return (
        <form onSubmit={handleSubmit} className={styles.mealForm}>
            
            <SearchBar onSelect={handleFoodSelect}/>
            {selectedFood && (
                <p>Selected Food: {selectedFood.name} - {selectedFood.calories} kcal</p>
            )}
            <button
                type='submit'
                className={styles.submitButton}
                disabled={!selectedFood}
                >
                Log Meal
            </button>
        </form>
    )
}