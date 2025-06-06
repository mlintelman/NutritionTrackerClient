import React, {useEffect, useState} from 'react'
import API_BASE_URL from "../config"
import MealDisplay from '../components/MealDisplay/MealDisplay'

export default function SummaryPage(){


    return(
        <div>
            <h1>Meal Summary</h1>
            <MealDisplay/>
        </div>
    )
}