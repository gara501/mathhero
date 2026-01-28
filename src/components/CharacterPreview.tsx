import { Application, extend } from '@pixi/react'
import * as PIXI from 'pixi.js'
import { useEffect, useState, useMemo } from 'react'

// Register PixiJS elements for React
// We register both with and without prefix to be safe
const registerPixi = () => {
  try {
    extend({
      Container: PIXI.Container,
      Sprite: PIXI.Sprite,
      pixiContainer: PIXI.Container,
      pixiSprite: PIXI.Sprite,
    })
  } catch (e) {
    console.warn('CharacterPreview: extend error', e)
  }
}

registerPixi()

interface CharacterPreviewProps {
  spritePath: string
  width?: number
  height?: number
  scale?: number
  isAnimated?: boolean
}

export default function CharacterPreview({ 
  spritePath, 
  width = 96, 
  height = 96, 
  scale = 2,
  isAnimated = true 
}: CharacterPreviewProps) {
  const [frame, setFrame] = useState(0)
  const [baseTexture, setBaseTexture] = useState<PIXI.Texture | null>(null)

  // Simple frame animation logic
  useEffect(() => {
    if (!isAnimated) return
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % 3)
    }, 200)
    return () => clearInterval(interval)
  }, [isAnimated])

  // Initial load
  useEffect(() => {
    let active = true
    const loadTexture = async () => {
      console.log('CharacterPreview: Attempting to load:', spritePath)
      try {
        // Ensure assets are initialized
        try { await PIXI.Assets.init() } catch(e) { /* ignore already init */ }
        
        // Load the texture
        const tex = await PIXI.Assets.load(spritePath)
        console.log('CharacterPreview: Load success:', spritePath, 'Dimensions:', tex.width, 'x', tex.height)
        if (active) {
          setBaseTexture(tex)
        }
      } catch (err) {
        console.error('CharacterPreview: Load failure:', spritePath, err)
      }
    }
    loadTexture()
    return () => { active = false }
  }, [spritePath])

  // Derive frame texture
  const texture = useMemo(() => {
    if (!baseTexture) return null
    if (!baseTexture.width || baseTexture.width < 10) return baseTexture

    try {
      // Heuristic for spritesheet format
      // Standard sheet: 3 columns, 4 rows
      // Full character sheet (8 chars): 12 columns, 8 rows
      let cols = 3
      let rows = 4

      if (baseTexture.width >= 500) {
        // Likely a full sheet or high-res
        if (baseTexture.width / 12 === baseTexture.height / 8) {
          cols = 12
          rows = 8
        }
      }

      const frameWidth = baseTexture.width / cols
      const frameHeight = baseTexture.height / rows

      if (frameWidth <= 0 || frameHeight <= 0) return baseTexture

      return new PIXI.Texture({
        source: baseTexture.source,
        frame: new PIXI.Rectangle(
          (frame % 3) * frameWidth, 
          0, // Always use top row for now
          frameWidth, 
          frameHeight
        )
      })
    } catch (err) {
      console.warn('Error slicing texture, using base:', err)
      return baseTexture
    }
  }, [baseTexture, frame])

  if (!baseTexture) return <div style={{ width, height }} className="bg-dark-card animate-pulse rounded-xl" />

  return (
    <div style={{ width, height, position: 'relative' }}>
      <Application 
        width={width} 
        height={height} 
        backgroundAlpha={0}
        antialias={false}
        resizeTo={undefined}
      >
        <pixiContainer x={width / 2} y={height / 2}>
          <pixiSprite
            texture={texture || baseTexture}
            anchor={0.5}
            scale={scale}
            roundPixels={true}
          />
        </pixiContainer>
      </Application>
    </div>
  )
}
