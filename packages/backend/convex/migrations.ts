import { internalMutation } from './_generated/server'
import { v } from 'convex/values'

export const backfillPhotos = internalMutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    let updated = 0
    const photos = await ctx.db.query('photos').take(100)
    for (const photo of photos) {
      const patch: Record<string, unknown> = {}
      if (photo.status === undefined) {
        patch.status = 'published'
      }
      if (photo.mediaType === undefined) {
        patch.mediaType = 'photo'
      }
      if (photo.likeCount === undefined) {
        patch.likeCount = 0
      }
      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(photo._id, patch)
        updated += 1
      }
    }
    return updated
  },
})
