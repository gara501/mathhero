import { PixiElements } from '@pixi/react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements extends PixiElements {
      'pixi-container': PixiElements['pixiContainer'];
      'pixi-sprite': PixiElements['pixiSprite'];
      'pixi-graphics': PixiElements['pixiGraphics'];
      'pixi-text': PixiElements['pixiText'];
      'pixi-animated-sprite': PixiElements['pixiAnimatedSprite'];
      'pixi-simple-mesh': PixiElements['pixiSimpleMesh'];
      'pixi-simple-rope': PixiElements['pixiSimpleRope'];
      'pixi-simple-plane': PixiElements['pixiSimplePlane'];
      // Also ensure camelCase is available
      pixiContainer: PixiElements['pixiContainer'];
      pixiSprite: PixiElements['pixiSprite'];
      pixiGraphics: PixiElements['pixiGraphics'];
      pixiText: PixiElements['pixiText'];
    }
  }
}
