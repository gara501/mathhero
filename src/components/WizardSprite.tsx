import { Application } from '@pixi/react'
import * as PIXI from 'pixi.js'
import { useEffect, useState, useMemo } from 'react'

interface WizardSpriteProps {
  spritePath: string
  width?: number
  height?: number
  scale?: number
  frameCount?: number
}

export default function WizardSprite({ 
  spritePath, 
  width = 120, 
  height = 120, 
  scale = 1,
  frameCount = 6
}: WizardSpriteProps) {
  const [frame, setFrame] = useState(0)
  const [baseTexture, setBaseTexture] = useState<PIXI.Texture | null>(null)

  // Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % frameCount)
    }, 150)
    return () => clearInterval(interval)
  }, [frameCount])

  // Load texture
  useEffect(() => {
    let active = true
    const loadTexture = async () => {
      try {
        await PIXI.Assets.init()
        const tex = await PIXI.Assets.load(spritePath)
        if (active) setBaseTexture(tex)
      } catch (err) {
        console.error('WizardSprite: Load failure:', err)
      }
    }
    loadTexture()
    return () => { active = false }
  }, [spritePath])

  // Slice texture for current frame
  const texture = useMemo(() => {
    if (!baseTexture) return null
    
    try {
      const frameWidth = baseTexture.width / frameCount
      const frameHeight = baseTexture.height

      return new PIXI.Texture({
        source: baseTexture.source,
        frame: new PIXI.Rectangle(
          frame * frameWidth, 
          0,
          frameWidth, 
          frameHeight
        )
      })
    } catch (e) {
      return baseTexture
    }
  }, [baseTexture, frame, frameCount])

  if (!baseTexture) return <div style={{ width, height }} className="bg-white/5 animate-pulse rounded-full" />

  return (
    <div style={{ width, height, position: 'relative' }}>
      <Application 
        width={width} 
        height={height} 
        backgroundAlpha={0}
        antialias={false}
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
