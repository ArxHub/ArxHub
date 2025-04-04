import { ArxHub } from '@arxhub/core'
import GatewayVFSPlugin from '@arxhub/plugin-gateway-vfs/server'
import GatewayPlugin from '@arxhub/plugin-gateway/server'
import { LocalFileSystem, VirtualFileSystemExtension } from '@arxhub/plugin-vfs/api'
import VFSPlugin from '@arxhub/plugin-vfs/server'

const hub = await ArxHub.create(VFSPlugin, GatewayPlugin, GatewayVFSPlugin)

const { vfs } = hub.extensions.getByType(VirtualFileSystemExtension)
vfs.mount('/local', new LocalFileSystem('data'))

await hub.start()
