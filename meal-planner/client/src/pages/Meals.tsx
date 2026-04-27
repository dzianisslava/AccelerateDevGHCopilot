import React, { useState, useEffect } from 'react';
import { mealsAPI } from '../api';
import MealCard from '../components/MealCard';
import CreateMealModal from '../components/CreateMealModal';
import Meal from '../types';
import './Meals.css';

export default function Meals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    try {
      const response = await mealsAPI.getAll();
      setMeals(response.data);
    } catch (error) {
      console.error('Failed to load meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMealCreated = (newMeal: Meal) => {
    setMeals([newMeal, ...meals]);
    setShowModal(false);
  };

  const handleMealDeleted = (id: string) => {
    setMeals(meals.filter((m) => m.id !== id));
  };

  const filteredMeals = meals.filter(
    (meal) =>
      meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meal.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="meals-page">
      <div className="meals-header">
        <h1>My Meals</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add Meal
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search meals or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">Loading meals...</div>
      ) : filteredMeals.length === 0 ? (
        <div className="empty-state">
          <p>No meals yet. Create your first meal!</p>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Create Meal
          </button>
        </div>
      ) : (
        <div className="meals-grid">
          {filteredMeals.map((meal) => (
            <MealCard key={meal.id} meal={meal} onDeleted={handleMealDeleted} />
          ))}
        </div>
      )}

      {showModal && (
        <CreateMealModal onClose={() => setShowModal(false)} onCreated={handleMealCreated} />
      )}
    </div>
  );
}
