# Pokemon Explorer

A modern, interactive React application for exploring Pokemon data using the PokeAPI.

## Features

### List View
- Search Pokemon by name with real-time filtering
- Sort by ID, Name, Height, or Weight
- Toggle between Ascending and Descending order
- Click any Pokemon card to view details

### Gallery View
- Visual gallery with Pokemon artwork
- Filter by multiple Pokemon types
- Beautiful hover effects and animations
- Click any Pokemon to view details

### Detail View
- Comprehensive Pokemon information
- Base stats with visual progress bars
- Abilities and type information
- Previous/Next navigation buttons
- Normal and Shiny sprite variants
- Direct URL routing for each Pokemon

## Technologies Used

- React 19
- TypeScript
- React Router
- Axios
- PokeAPI (no API key required)
- CSS Modules

## Installation

```bash
npm install
```

## Development

```bash
npm start
```

Runs the app in development mode. Open [http://localhost:3000/mp2](http://localhost:3000/mp2) to view it in the browser.

## Build

```bash
npm run build
```

Builds the app for production to the `build` folder.

## Deployment

This app is configured for GitHub Pages deployment.

1. Create a GitHub repository
2. Update the `homepage` field in `package.json` with your repository URL
3. Push to GitHub
4. Enable GitHub Pages in repository settings (Source: GitHub Actions)
5. The deployment workflow will automatically build and deploy your app

## Project Structure

```
src/
├── components/       # React components
│   ├── ListView.tsx
│   ├── GalleryView.tsx
│   └── DetailView.tsx
├── services/        # API service layer
│   └── pokemonService.ts
├── types/          # TypeScript type definitions
│   └── Pokemon.ts
└── styles/         # CSS modules
```

## License

This project was created for educational purposes.
