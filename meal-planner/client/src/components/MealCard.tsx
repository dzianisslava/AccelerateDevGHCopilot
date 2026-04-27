import React from 'react';
import { mealsAPI } from '../api';
import { shareOnTwitter, shareOnFacebook, shareOnPinterest } from '../sharing';
import Meal from '../types';
import './MealCard.css';

interface MealCardProps {
  meal: Meal;
  onDeleted: (id: string) => void;
}

export default function MealCard({ meal, onDeleted }: MealCardProps) {
  const handleDelete = async () => {
    if (window.confirm(`Delete "${meal.name}"?`)) {
      try {
        await mealsAPI.delete(meal.id);
        onDeleted(meal.id);
      } catch (error) {
        console.error('Failed to delete meal:', error);
      }
    }
  };

  const mealUrl = `${window.location.origin}/meals/${meal.id}`;

  return (
    <div className="meal-card">
      {meal.image_url && (
        <div className="meal-image">
          <img src={meal.image_url} alt={meal.name} />
        </div>
      )}
      <div className="meal-content">
        <h3>{meal.name}</h3>
        {meal.description && <p className="description">{meal.description}</p>}

        <div className="meal-meta">
          {meal.prep_time > 0 && <span>⏱️ Prep: {meal.prep_time}m</span>}
          {meal.cook_time > 0 && <span>🔥 Cook: {meal.cook_time}m</span>}
          {meal.servings > 0 && <span>🍽️ Servings: {meal.servings}</span>}
        </div>

        {meal.tags && meal.tags.length > 0 && (
          <div className="tags">
            {meal.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="meal-actions">
          <button
            className="btn-share"
            onClick={() => shareOnTwitter(meal.name, mealUrl)}
            title="Share on Twitter"
          >
            𝕏
          </button>
          <button
            className="btn-share"
            onClick={() => shareOnFacebook(mealUrl)}
            title="Share on Facebook"
          >
            📘
          </button>
          <button
            className="btn-share"
            onClick={() => shareOnPinterest(meal.name, meal.image_url || '', mealUrl)}
            title="Share on Pinterest"
          >
            📌
          </button>
          <button className="btn-delete" onClick={handleDelete}>
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
