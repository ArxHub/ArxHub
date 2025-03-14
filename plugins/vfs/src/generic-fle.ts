import { splitPathname } from '@arxhub/stdlib/fs'
import dedent from 'ts-dedent'
import type { VirtualFile } from './file'
import type { VirtualFileSystem } from './system'

export type VirtualFileOptions = {
  pathname: string
  fields: Record<string, unknown>
  type: string
  kind: string
}

export class GenericFile implements VirtualFile {
  readonly vfs: VirtualFileSystem

  readonly pathname: string
  readonly path: string
  readonly name: string
  readonly extension: string

  readonly fields: Record<string, unknown>
  readonly type: string
  readonly kind: string

  constructor(vfs: VirtualFileSystem, options: VirtualFileOptions) {
    this.vfs = vfs

    this.pathname = options.pathname
    const splitted = splitPathname(options.pathname)
    this.path = splitted.path
    this.name = splitted.name
    this.extension = splitted.ext

    this.fields = options.fields
    this.type = options.type
    this.kind = options.kind
  }

  text(): Promise<string> {
    return this.vfs.readTextFile(this.pathname)
  }

  stat(): string {
    return dedent`
      pathname: ${this.pathname}
      extension: ${this.extension}
      type: ${this.type}
      kind: ${this.kind}
    `
  }
}
