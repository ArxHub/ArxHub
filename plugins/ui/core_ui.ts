import { NotImplemented } from '~/stdlib/not_implemented.ts'
import type { ArxHub } from '~/core/arxhub.ts'
import type { Plugin } from '~/core/plugin.ts'

export class CoreUI implements Plugin<ArxHub> {
  readonly name: string

  constructor() {
    this.name = CoreUI.name
  }

  apply(_target: ArxHub): void {
    throw new NotImplemented()
  }
}
