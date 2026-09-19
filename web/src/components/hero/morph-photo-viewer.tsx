import type { CSSProperties } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

export type MorphPhoto = {
  src: string
  label: string
  width: number
  height: number
  originX: number
  originY: number
  scale: number
}

export type OpenMorphPhoto = (src: string, label: string, trigger: HTMLButtonElement) => void

export default function MorphPhotoViewer({ photo, open, onOpenChange, restoreFocus }: {
  photo: MorphPhoto | null
  open: boolean
  onOpenChange: (open: boolean) => void
  restoreFocus: () => void
}) {
  return <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="morph-photo-backdrop" />
      {photo && <Dialog.Content className="morph-photo-viewer" style={{
        width: photo.width, height: photo.height,
        '--photo-x': `${photo.originX}px`, '--photo-y': `${photo.originY}px`, '--photo-scale': photo.scale,
      } as CSSProperties} onCloseAutoFocus={event => { event.preventDefault(); restoreFocus() }}>
        <Dialog.Title className="sr-only">{photo.label}</Dialog.Title>
        <Dialog.Description className="sr-only">Fotografía ampliada. Pulsa fuera o Escape para volver a la presentación.</Dialog.Description>
        <img src={photo.src} alt={photo.label} width={photo.width} height={photo.height} />
        <Dialog.Close className="morph-photo-close" aria-label="Cerrar foto"><X size={22} aria-hidden="true" /></Dialog.Close>
      </Dialog.Content>}
    </Dialog.Portal>
  </Dialog.Root>
}
