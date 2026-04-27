import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

let db: any = null;

export async function initializeDatabase() {
  db = await open({
    filename: path.join(__dirname, '../data/mealplanner.db'),
    driver: sqlite3.Database,
  });

  await db.exec('PRAGMA foreign_keys = ON');

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      provider TEXT,
      provider_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS meals (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      ingredients TEXT,
      prep_time INTEGER,
      cook_time INTEGER,
      servings INTEGER,
      image_url TEXT,
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS meal_plans (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      week_start DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id, week_start)
    );

    CREATE TABLE IF NOT EXISTS meal_plan_items (
      id TEXT PRIMARY KEY,
      meal_plan_id TEXT NOT NULL,
      meal_id TEXT NOT NULL,
      day_of_week INTEGER,
      meal_type TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (meal_plan_id) REFERENCES meal_plans(id),
      FOREIGN KEY (meal_id) REFERENCES meals(id)
    );

    CREATE TABLE IF NOT EXISTS shopping_lists (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      meal_plan_id TEXT,
      items TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (meal_plan_id) REFERENCES meal_plans(id)
    );
  `);

  return db;
}

export function getDatabase() {
  if (!db) throw new Error('Database not initialized');
  return db;
}
