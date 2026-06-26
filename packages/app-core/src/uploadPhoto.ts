import type { Id } from '@campfire/backend/convex/_generated/dataModel'

export type UploadPhotoFile = {
  blob: Blob
  mimeType: string
}

export async function uploadPhoto(args: {
  file: UploadPhotoFile
  campfireId: Id<'campfires'>
  guestToken?: string
  caption?: string
  guestName?: string
  generateUploadUrl: (args: {
    campfireId: Id<'campfires'>
    guestToken?: string
  }) => Promise<string>
  mediaType?: 'photo' | 'video'
  createPhoto: (args: {
    campfireId: Id<'campfires'>
    storageId: Id<'_storage'>
    mediaType?: 'photo' | 'video'
    caption?: string
    guestToken?: string
    guestName?: string
  }) => Promise<Id<'photos'>>
}): Promise<void> {
  const mediaType =
    args.mediaType ??
    (args.file.mimeType.startsWith('video/') ? 'video' : 'photo')
  const uploadUrl = await args.generateUploadUrl({
    campfireId: args.campfireId,
    guestToken: args.guestToken,
  })

  const result = await fetch(uploadUrl, {
    method: 'POST',
    headers: { 'Content-Type': args.file.mimeType },
    body: args.file.blob,
  })

  if (!result.ok) {
    throw new Error('Upload failed')
  }

  const { storageId } = (await result.json()) as { storageId: string }

  await args.createPhoto({
    campfireId: args.campfireId,
    storageId: storageId as Id<'_storage'>,
    mediaType,
    caption: args.caption,
    guestToken: args.guestToken,
    guestName: args.guestName,
  })
}
