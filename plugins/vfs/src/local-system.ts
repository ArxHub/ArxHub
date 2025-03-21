import { isFileExists, listFiles, readTextFile } from '@arxhub/stdlib/fs'
import type { VirtualFile } from './file'
import { FileNotFound } from './file-not-found'
import { GenericFile, type VirtualFileOptions } from './generic-fle'
import type { VirtualFileSystem } from './system'

export class LocalFileSystem implements VirtualFileSystem {
  private readonly rootDir: string

  constructor(rootDir: string) {
    this.rootDir = rootDir
  }

  async file(pathname: string): Promise<VirtualFile> {
    const file = await this.fileOrNull(pathname)
    if (file == null) throw new FileNotFound(pathname)
    return file
  }

  isFileExists(pathname: string): Promise<boolean> {
    return isFileExists(`${this.rootDir}/${pathname}`)
  }

  async fileOrNull(pathname: string): Promise<VirtualFile | null> {
    if (!(await this.isFileExists(pathname))) return null
    const meta = await this.readMeta(pathname)
    return new GenericFile(this, { ...meta, pathname })
  }

  // TODO: Add caching
  async *listFiles(): AsyncGenerator<VirtualFile> {
    for await (const pathname of listFiles(this.rootDir)) {
      if (pathname.endsWith('.meta')) continue
      const meta = JSON.parse(await readTextFile(`${pathname}.meta`))
      yield new GenericFile(this, meta)
    }
  }

  readTextFile(pathname: string): Promise<string> {
    return readTextFile(`${this.rootDir}/${pathname}`)
  }

  refresh(): Promise<void> {
    // no-op for now
    // TODO: Add caching to listFiles
    return Promise.resolve()
  }

  private async readMeta(pathname: string): Promise<Omit<VirtualFileOptions, 'pathname'>> {
    const meta = { type: 'application/octet-stream', kind: 'unknown', fields: {} }
    // biome-ignore lint/style/noParameterAssign: Meta files should always be with a .meta extension
    if (!pathname.endsWith('.meta')) pathname = `${pathname}.meta`
    if (!(await this.isFileExists(pathname))) {
      console.warn(`Meta file does not exists: '${pathname}'`)
      return meta
    }
    try {
      return { ...meta, ...JSON.parse(await this.readTextFile(pathname)) }
    } catch (e) {
      console.error(`Error reading meta file: '${pathname}'`, e)
      return meta
    }
  }
}
