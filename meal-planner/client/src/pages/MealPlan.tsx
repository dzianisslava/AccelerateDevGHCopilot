import React, { useState, useEffect } from 'react';
import { mealPlansAPI, mealsAPI } from '../api';
import { format, startOfWeek, addDays } from 'date-fns';
import Meal from '../types';
import './MealPlan.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export default function MealPlan() {
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState(format(startOfWeek(new Date()), 'yyyy-MM-dd'));

  useEffect(() => {
    loadData();
  }, [weekStart]);

  const loadData = async () => {
    try {
      const [planResponse, mealsResponse] = await Promise.all([
        mealPlansAPI.getByWeek(weekStart),
        mealsAPI.getAll(),
      ]);
      setMealPlan(planResponse.data);
      setMeals(mealsResponse.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = async (mealId: string) => {
    if (selectedDay === null || !selectedMealType || !mealPlan) return;

    try {
      await mealPlansAPI.addMeal(mealPlan.id, {
        meal_id: mealId,
        day_of_week: selectedDay,
        meal_type: selectedMealType,
      });
      await loadData();
      setSelectedDay(null);
      setSelectedMealType(null);
    } catch (error) {
      console.error('Failed to add meal:', error);
    }
  };

  const handleRemoveMeal = async (itemId: string) => {
    try {
      await mealPlansAPI.removeMeal(itemId);
      await loadData();
    } catch (error) {
      console.error('Failed to remove meal:', error);
    }
  };

  const getMealForSlot = (dayOfWeek: number, mealType: string) => {
    return mealPlan?.items?.find((item: any) => item.day_of_week === dayOfWeek && item.meal_type === mealType);
  };

  if (loading) return <div className="loading">Loading meal plan...</div>;

  return (
    <div className="meal-plan-page">
      <div className="plan-header">
        <h1>Weekly Meal Plan</h1>
        <div className="week-nav">
          <button
            onClick={() => setWeekStart(format(addDays(new Date(weekStart), -7), 'yyyy-MM-dd'))}
          >
            ← Previous Week
          </button>
          <span>Week of {weekStart}</span>
          <button onClick={() => setWeekStart(format(addDays(new Date(weekStart), 7), 'yyyy-MM-dd'))}>
            Next Week →
          </button>
        </div>
      </div>

      <div className="meal-plan-grid">
        {DAYS.map((day, dayIndex) => (
          <div key={day} className="day-column">
            <h3>{day}</h3>
            {MEAL_TYPES.map((mealType) => {
              const meal = getMealForSlot(dayIndex, mealType);
              return (
                <div key={`${dayIndex}-${mealType}`} className="meal-slot">
                  <p className="meal-type-label">{mealType}</p>
                  {meal ? (
                    <div className="meal-item">
                      <strong>{meal.name}</strong>
                      {meal.image_url && <img src={meal.image_url} alt={meal.name} />}
                      <button
                        className="btn-remove"
                        onClick={() => handleRemoveMeal(meal.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn-add"
                      onClick={() => {
                        setSelectedDay(dayIndex);
                        setSelectedMealType(mealType);
                      }}
                    >
                      + Add
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {selectedDay !== null && selectedMealType && (
        <div className="meal-selector-modal">
          <div className="modal-content">
            <h2>Select Meal</h2>
            <div className="meals-list">
              {meals.map((meal) => (
                <div
                  key={meal.id}
                  className="meal-option"
                  onClick={() => handleAddMeal(meal.id)}
                >
                  {meal.image_url && <img src={meal.image_url} alt={meal.name} />}
                  <div>
                    <strong>{meal.name}</strong>
                    <p>⏱️ {meal.prep_time + meal.cook_time} min</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-cancel" onClick={() => {
              setSelectedDay(null);
              setSelectedMealType(null);
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
