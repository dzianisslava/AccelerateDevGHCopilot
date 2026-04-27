import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware';
import { getDatabase } from '../database';
import { generateId } from '../auth';

const router = Router();

// Get meal plan for specific week
router.get('/week/:weekStart', authMiddleware, async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const weekStart = req.params.weekStart;

    let mealPlan = await db.get(
      'SELECT * FROM meal_plans WHERE user_id = ? AND week_start = ?',
      [req.user!.id, weekStart]
    );

    if (!mealPlan) {
      // Create meal plan for week
      const id = generateId();
      await db.run(
        'INSERT INTO meal_plans (id, user_id, week_start) VALUES (?, ?, ?)',
        [id, req.user!.id, weekStart]
      );
      mealPlan = { id, user_id: req.user!.id, week_start: weekStart };
    }

    // Get meal plan items
    const items = await db.all(
      `SELECT mpi.*, m.name, m.image_url FROM meal_plan_items mpi
       JOIN meals m ON mpi.meal_id = m.id
       WHERE mpi.meal_plan_id = ?
       ORDER BY mpi.day_of_week, mpi.meal_type`,
      [mealPlan.id]
    );

    res.json({ ...mealPlan, items });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meal plan' });
  }
});

// Add meal to plan
router.post('/:planId/items', authMiddleware, async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const { meal_id, day_of_week, meal_type } = req.body;

    const id = generateId();
    await db.run(
      'INSERT INTO meal_plan_items (id, meal_plan_id, meal_id, day_of_week, meal_type) VALUES (?, ?, ?, ?, ?)',
      [id, req.params.planId, meal_id, day_of_week, meal_type]
    );

    res.status(201).json({ id, message: 'Meal added to plan' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add meal to plan' });
  }
});

// Remove meal from plan
router.delete('/items/:itemId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    await db.run('DELETE FROM meal_plan_items WHERE id = ?', [req.params.itemId]);
    res.json({ message: 'Meal removed from plan' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove meal from plan' });
  }
});

export default router;
