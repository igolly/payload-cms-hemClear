import type { Block } from 'payload'

export const VideoStories: Block = {
  slug: 'videoStories',
  interfaceName: 'VideoStoriesBlock',
  labels: { singular: 'Video Stories', plural: 'Video Stories' },
  fields: [
    {
      type: 'collapsible',
      label: 'Section Header',
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          admin: { description: 'Pill above the heading, e.g. "From the HemClear® Community".' },
        },
        { name: 'heading', type: 'text' },
        {
          name: 'subheading',
          type: 'text',
          admin: { description: 'Italic line below the heading.' },
        },
      ],
    },
    {
      name: 'stories',
      type: 'array',
      label: 'Stories',
      labels: { singular: 'Story', plural: 'Stories' },
      minRows: 1,
      admin: {
        description:
          'Shown in a swipeable carousel — five at a time on desktop, one on mobile. Add as many as you like.',
        initCollapsed: true,
        components: { RowLabel: '@/blocks/VideoStories/RowLabel#StoryRowLabel' },
      },
      fields: [
        {
          name: 'poster',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Still frame shown before playback. Portrait crop works best.' },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              admin: { description: 'e.g. "Lisa K."', width: '50%' },
            },
            {
              name: 'caption',
              type: 'text',
              defaultValue: 'HemClear® Customer Review',
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'badge',
              type: 'text',
              defaultValue: 'Customer Video',
              admin: { description: 'Pill in the top-left corner.', width: '50%' },
            },
            {
              name: 'duration',
              type: 'text',
              admin: { description: 'e.g. "0:28". Shown bottom-right.', width: '50%' },
            },
          ],
        },
        {
          name: 'video',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Uploaded video file. Plays inline when the visitor presses play.' },
        },
        {
          name: 'videoUrl',
          type: 'text',
          admin: {
            description:
              'Embed URL, used only when no video file is uploaded (e.g. a YouTube/Vimeo embed link).',
          },
        },
      ],
    },
  ],
}
