# Hello World Express Pug TypeScript Project

This is a simple Node.js project using Express, Pug, and TypeScript that demonstrates a basic "Hello World" application.

## Project Structure

```
hello-world-express-pug-ts
├── src
│   ├── app.ts            # Entry point of the application
│   ├── routes
│   │   └── index.ts      # Route definitions
│   ├── views
│   │   └── index.pug     # Pug template for the index view
│   └── types
│       └── index.ts      # Custom TypeScript types
├── package.json           # NPM package configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd hello-world-express-pug-ts
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Compile TypeScript:**
   ```bash
   npx tsc
   ```

4. **Run the application:**
   ```bash
   node dist/app.js
   ```

5. **Access the application:**
   Open your browser and navigate to `http://localhost:3000` to see the "Hello World" message.

## Usage

This project serves as a basic template for building web applications using Express and Pug with TypeScript. You can extend the functionality by adding more routes, views, and custom types as needed.