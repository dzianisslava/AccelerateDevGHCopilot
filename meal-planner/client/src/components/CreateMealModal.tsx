import React, { useState } from 'react';
import { mealsAPI } from '../api';
import Meal from '../types';
import './CreateMealModal.css';

interface CreateMealModalProps {
  onClose: () => void;
  onCreated: (meal: Meal) => void;
}

export default function CreateMealModal({ onClose, onCreated }: CreateMealModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ingredients: '',
    prep_time: 15,
    cook_time: 30,
    servings: 4,
    image_url: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const mealData = {
        ...formData,
        ingredients: formData.ingredients.split('\n').filter((i) => i.trim()),
        tags: formData.tags.split(',').map((t) => t.trim()),
      };

      const response = await mealsAPI.create(mealData);
      const newMeal = { ...mealData, id: response.data.id };
      onCreated(newMeal);
    } catch (error) {
      console.error('Failed to create meal:', error);
      alert('Failed to create meal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Meal</h2>
          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="meal-form">
          <div className="form-group">
            <label>Meal Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Spaghetti Carbonara"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Meal description..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Ingredients (one per line)</label>
            <textarea
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              placeholder="Pasta
Eggs
Bacon
Parmesan"
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Prep Time (min)</label>
              <input
                type="number"
                min="0"
                value={formData.prep_time}
                onChange={(e) => setFormData({ ...formData, prep_time: parseInt(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Cook Time (min)</label>
              <input
                type="number"
                min="0"
                value={formData.cook_time}
                onChange={(e) => setFormData({ ...formData, cook_time: parseInt(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Servings</label>
              <input
                type="number"
                min="1"
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="vegetarian, quick, italian"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Meal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
