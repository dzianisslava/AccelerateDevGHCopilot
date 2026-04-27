import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware';
import { getDatabase } from '../database';
import { generateId } from '../auth';

const router = Router();

// Get all meals for user
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const meals = await db.all(
      'SELECT * FROM meals WHERE user_id = ? ORDER BY created_at DESC',
      [req.user!.id]
    );

    // Parse JSON fields
    meals.forEach((meal: any) => {
      meal.ingredients = JSON.parse(meal.ingredients || '[]');
      meal.tags = JSON.parse(meal.tags || '[]');
    });

    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
});

// Create meal
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const { name, description, ingredients, prep_time, cook_time, servings, image_url, tags } = req.body;

    const id = generateId();
    await db.run(
      `INSERT INTO meals (id, user_id, name, description, ingredients, prep_time, cook_time, servings, image_url, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        req.user!.id,
        name,
        description,
        JSON.stringify(ingredients || []),
        prep_time,
        cook_time,
        servings,
        image_url,
        JSON.stringify(tags || []),
      ]
    );

    res.status(201).json({ id, message: 'Meal created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create meal' });
  }
});

// Get meal by ID
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const meal = await db.get(
      'SELECT * FROM meals WHERE id = ? AND user_id = ?',
      [req.params.id, req.user!.id]
    );

    if (!meal) return res.status(404).json({ error: 'Meal not found' });

    meal.ingredients = JSON.parse(meal.ingredients || '[]');
    meal.tags = JSON.parse(meal.tags || '[]');

    res.json(meal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meal' });
  }
});

// Update meal
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const { name, description, ingredients, prep_time, cook_time, servings, image_url, tags } = req.body;

    await db.run(
      `UPDATE meals SET name=?, description=?, ingredients=?, prep_time=?, cook_time=?, servings=?, image_url=?, tags=?
       WHERE id=? AND user_id=?`,
      [
        name,
        description,
        JSON.stringify(ingredients || []),
        prep_time,
        cook_time,
        servings,
        image_url,
        JSON.stringify(tags || []),
        req.params.id,
        req.user!.id,
      ]
    );

    res.json({ message: 'Meal updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update meal' });
  }
});

// Delete meal
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    await db.run('DELETE FROM meals WHERE id = ? AND user_id = ?', [req.params.id, req.user!.id]);
    res.json({ message: 'Meal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete meal' });
  }
});

export default router;
