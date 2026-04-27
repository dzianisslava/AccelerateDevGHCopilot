import React from 'react';

interface Meal {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
  image_url?: string;
  tags: string[];
}

export default Meal;
