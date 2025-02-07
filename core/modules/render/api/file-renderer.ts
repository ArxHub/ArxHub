import { VirtualFile } from '~/core/modules/vfs/api'
import { RenderMode } from './render-mode.ts'
import { RenderOptions } from './render-options.ts'

export interface FileRenderer {
  readonly priority?: number

  isSupported(file: VirtualFile, mode: RenderMode): boolean
  render(file: VirtualFile, options: RenderOptions): Promise<string>
}
