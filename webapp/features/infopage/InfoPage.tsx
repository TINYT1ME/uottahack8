// typescript
import React from 'react'
import RecipeCard from './components/RecipeCard'
import { Recipe } from '../../types/types'

const sampleRecipes: Recipe[] = [
  {
    imageUrl: 'https://picsum.photos/800/450?random=1',
    title: 'Pâtes au pesto',
    description: 'Rapide et savoureux',
    ingredients: ['Pâtes', 'Basilic', 'Parmesan', 'Pignons', 'Ail', 'Huile d\'olive'],
    instructions: ['Cuire les pâtes ', 'Mixer les ingrédients', 'Mélanger et servir'],
    servings: 2,
    time: '20 mins',
    sourceUrl: '',
  },
  // autres recettes (si besoin)
]

export default function InfoPage(): React.ReactElement {
  const first = sampleRecipes[0]

  return (
    <main style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 16 }}>Recettes</h2>

      <div
        aria-label="Layout 12-colonnes"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 24,
          alignItems: 'start',
        }}
      >
        {/* Colonne gauche : col-8 */}
        <div style={{ gridColumn: 'span 8' }}>
          <div style={{ width: '100%', maxWidth: 700 }}>
            <RecipeCard recipe={first} />
          </div>
        </div>

      </div>
    </main>
  )
}