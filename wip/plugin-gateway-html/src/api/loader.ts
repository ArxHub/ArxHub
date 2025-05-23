import type { VirtualFile } from '~/plugins/vfs/file.ts'
import type { TemplateSource } from './template_source.ts'

export interface Loader {
  load(pathname: VirtualFile | string): Promise<TemplateSource>
  resolve(from: string, pathname: string): string
}
