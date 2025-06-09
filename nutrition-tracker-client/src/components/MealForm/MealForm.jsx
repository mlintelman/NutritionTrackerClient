import React, {useEffect, useState} from 'react'
import SearchBar from '../SearchBar/SearchBar'
import API_BASE_URL from '../../config'
import styles from './MealForm.module.css'

// Meal form that handles adding food items to a meal and submitting the meal to the database
// Things to work on:
//  - Need to display each food item and how many servings they entered for that food item
//  - Need to display nutrient totals for the meal
//  - Need to post results to API upon submission, including datetime it was submitted and notes (need new tables for this)


export default function MealForm() {
    const [selectedFood, setSelectedFood] = useState(null)
    // Key: value -- food ID: servings
    const [mealItems, setMealItems] = useState([])
    const [servings, setServings] = useState(1)
    const [clearSearchTrigger, setClearSearchTrigger] = useState(0);

    const[nutrientTotals, setNutrientTotals] = useState({'calories': 0, 'protein': 0, 'carbs': 0, 'fat': 0})

    // When a food is selected, set selected food to that food item
    const handleFoodSelect = (foodItem) => {
        setSelectedFood(foodItem)
    }

    // When the form is submitted, process it
    const handleSubmit = (e) => {
        e.preventDefault()
        //console.log("Submit button clicked")
        processMealForm()
    }

    // When the add food button is clicked, add the food item to meal items
    const addFood = () => {
        const newItem = {
            foodItemId: selectedFood.id,
            name: selectedFood.name,
            servingSizeGrams: selectedFood.servingSizeGrams * servings,
            servings: servings,
            calories: selectedFood.calories * servings,
            protein: selectedFood.protein * servings,
            carbs: selectedFood.carbs * servings,
            fat: selectedFood.fat * servings,
        }

        // Replace if already added
        setMealItems(prev => {
            const filtered = prev.filter(item => item.foodItemId !== selectedFood.id)
            return [...filtered, newItem]
        })
    }


    // Process the meal form and post to appropriate tables
    const processMealForm =async () => {
        const inputName = document.getElementById('inputName')
        const inputNotes = document.getElementById('inputNotes')
        // Ensure there are items in the meal and the meal has been named
        
        if (mealItems.length < 1 || inputName.value === "") {
            alert("Please ensure you have entered at least one food item and named your meal.");
            return;
        }

        try {
            // First, post the meal
            const mealRes = await fetch(`${API_BASE_URL}Meals`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 1, // Temporary user
                    dateTime: new Date().toISOString(),
                    name: inputName.value,
                    notes: inputNotes.value
                })
            });

            const meal = await mealRes.json();
            const mealId = meal.id;

            const mealItemsPayload = mealItems.map(item => ({
                mealId: mealId,
                foodItemId: item.foodItemId,
                name: item.name,
                servingSizeGrams: item.servingSizeGrams,
                servings: item.servings,
                calories: item.calories,
                protein: item.protein,
                carbs: item.carbs,
                fat: item.fat,
            }));

            await fetch(`${API_BASE_URL}MealItems`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mealItemsPayload)
            });

            alert('Meal logged successfully!');
            // After alert('Meal logged successfully!')
            setMealItems([]);
            setSelectedFood(null);
            setServings(1);

            // Clear the text inputs
            document.getElementById('inputName').value = '';
            document.getElementById('inputNotes').value = '';

            // Reset SearchBar input if needed by incrementing clear trigger (if SearchBar uses it)
            setClearSearchTrigger(prev => prev + 1);

        } catch (err) {
            console.error(err);
            alert('Something went wrong while logging your meal. Please try again.');
        }
    }
    
    // When the add button is clicked
    const handleAddButton = () => {
        // First double check that something is selected (button should already be disabled)
        if (!selectedFood || !selectedFood.id) return;


        // Then, add food id and servings as a key value pair

        const isDuplicate = mealItems.some(item => item.foodItemId === selectedFood.id)
        // If the food item has already been added to this meal,
        if (isDuplicate) {
            // Confirm with the user they want to override
            if (confirm("This food item has already been added to this meal. Press OK to override, or cancel to keep original.")) {
                addFood()
            }
        } 
        else { // Otherwise, just set the meal items
            addFood() 
        }
        
        // Finally, reset selected food and servings, and trigger the input to clear
        setSelectedFood(null);
        setServings(1);
        setClearSearchTrigger(prev => prev + 1)
    };


    // Every time the food array updates, recalculate the nutrient totals
    useEffect(() => {
    const totals = mealItems.reduce((acc, item) => {
        acc.calories += item.calories
        acc.protein += item.protein
        acc.carbs += item.carbs
        acc.fat += item.fat
        return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    setNutrientTotals(totals);
}, [mealItems]);


    return (
        <form onSubmit={handleSubmit} className={styles.mealForm}> 
            <h2>Add food to your meal:</h2>
            <SearchBar onSelect={handleFoodSelect} clearTrigger={clearSearchTrigger}/>
            {selectedFood && (
                <div>
                    <p><strong>Food:</strong> {selectedFood.name}</p>
                    <p><strong>Description:</strong> {selectedFood.description}</p>
                    <p><strong>Your Serving Size:</strong> {(selectedFood.servingSizeGrams*servings).toFixed(1)}g</p>
                    <p><strong>Calories:</strong> {(selectedFood.calories*servings).toFixed(1)} kcal</p>
                    <p><strong>Protein:</strong> {(selectedFood.protein*servings).toFixed(1)}g</p>
                    <p><strong>Carbs:</strong> {(selectedFood.carbs*servings).toFixed(1)}g</p>
                    <p><strong>Fat:</strong> {(selectedFood.fat*servings).toFixed(1)}g</p>
                    <p className={styles.servings}>
                        <strong>Servings:</strong>
                        <input 
                            step='0.5'
                            type='number'
                            value={servings}
                            onChange={(e) => setServings(e.target.value)}
                        />
                    </p>
                    </div>
            )}

            <button
                type='button'
                className={styles.addButton}
                disabled={!selectedFood}
                onClick={handleAddButton}
                >
                Add to Meal
            </button><br/><hr/>


            <h2>Your Meal:</h2>

            {mealItems.length < 1 ? (
                <p>You haven't entered any food yet.</p>
            ):(
                <div className={styles.mealInfo}>
                    <ul className={styles.mealInfoList}>
                    {mealItems.map((item, index) => (
                        <li key={index} className={styles.mealInfoListItem}>
                            <strong>{item.name}:</strong> {item.servings} serving(s).
                        </li>
                    ))}              
                    </ul>
                    <hr/>
                    <div>
                        <p><strong>Total Calories:</strong> {nutrientTotals.calories.toFixed(1)} kcal</p>
                        <p><strong>Total Protein:</strong> {nutrientTotals.protein.toFixed(1)} g</p>
                        <p><strong>Total Carbs:</strong> {nutrientTotals.carbs.toFixed(1)} g</p>
                        <p><strong>Total Fat:</strong> {nutrientTotals.fat.toFixed(1)} g</p>
                    </div>
                    <span>Meal Name:<textarea
                        type='text'
                        id='inputName'
                        className={styles.inputName}
                        placeholder='Enter meal name here...'
                    /></span><br/>
                    <span>Meal Notes:<textarea
                        type='text'
                        id='inputNotes'
                        className={styles.inputNotes}
                        placeholder='Enter meal notes here...'
                    /></span><br/>
                </div>
            )}

            
            

            <button
                type='submit'
                className={styles.submitButton}
                disabled={mealItems.length < 1}
                >
                Submit Meal
            </button>
        </form>
    )
}