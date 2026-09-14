'use client'
import React, { useState } from 'react'
import { Play } from 'lucide-react'

import type { VideoStoriesBlock } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { marks } from '@/utilities/marks'

type Story = NonNullable<VideoStoriesBlock['stories']>[number]

/**
 * Decorative phone status bar — matches the design's device framing. `compact` scales it for
 * the narrow light-tone card, where the full-size notch is wide enough to sit on top of the
 * clock beside it.
 */
const StatusBar = ({ compact }: { compact?: boolean }) => (
  <div
    aria-hidden="true"
    className={cn(
      'absolute inset-x-0 top-0 z-20 flex items-center justify-between font-semibold text-white',
      compact ? 'px-2 pt-1.5 text-[7px]' : 'px-4 pt-2 text-[10px]',
    )}
  >
    <span>9:41</span>
    <span
      className={cn(
        'absolute left-1/2 -translate-x-1/2 rounded-full bg-black/85',
        compact ? 'top-1 h-2.5 w-8' : 'top-1.5 h-4 w-14',
      )}
    />
    <span className={cn('flex items-center', compact ? 'gap-0.5' : 'gap-1')}>
      <svg
        className={cn(compact ? 'h-1.5 w-2' : 'h-2.5 w-3.5')}
        fill="currentColor"
        viewBox="0 0 16 12"
      >
        <rect height="3" rx=".5" width="2.5" x="0" y="8" />
        <rect height="5" rx=".5" width="2.5" x="4" y="6" />
        <rect height="8" rx=".5" width="2.5" x="8" y="3" />
        <rect height="11" rx=".5" width="2.5" x="12" y="0" />
      </svg>
      <svg
        className={cn(compact ? 'h-1.5 w-2' : 'h-2.5 w-3')}
        fill="currentColor"
        viewBox="0 0 12 10"
      >
        <path d="M6 9.5 0 3a8.5 8.5 0 0 1 12 0Z" />
      </svg>
      <svg
        className={cn(compact ? 'h-1.5 w-2.5' : 'h-2.5 w-4')}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 18 10"
      >
        <rect height="8" rx="2" stroke="currentColor" strokeWidth="1" width="14" x="1" y="1" />
        <rect fill="currentColor" height="5" rx=".5" width="10" x="2.5" y="2.5" />
      </svg>
    </span>
  </div>
)

/**
 * `dark` is the navy `videoStories` band: the poster fills the card and the name sits over
 * it. `light` is the product page comp: the poster is the upper portion and the name gets a
 * solid navy plate beneath it, which reads on the white section behind it.
 */
export const StoryCard: React.FC<{ index: number; story: Story; tone?: 'dark' | 'light' }> = ({
  index,
  story,
  tone = 'dark',
}) => {
  const [playing, setPlaying] = useState(false)
  const light = tone === 'light'

  const hasVideoFile = story.video && typeof story.video === 'object'
  const hasEmbed = Boolean(story.videoUrl)
  const canPlay = hasVideoFile || hasEmbed

  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-[1.75rem] bg-slate-800 shadow-xl',
        light
          ? 'relative flex h-full flex-col'
          : 'relative aspect-[9/19] border-[3px] border-white/25',
      )}
      data-payload-subpath={`stories.${index}.name`}
    >
      {playing && hasVideoFile ? (
        <Media
          className="absolute inset-0 h-full w-full"
          resource={story.video as never}
          videoClassName="h-full w-full object-cover"
        />
      ) : playing && hasEmbed ? (
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          src={story.videoUrl as string}
          title={story.name}
        />
      ) : (
        <div className={cn(light && 'relative aspect-[9/13] w-full')}>
          {/* Poster */}
          {story.poster && typeof story.poster === 'object' ? (
            <Media
              className="absolute inset-0"
              fill
              imgClassName="object-cover"
              resource={story.poster}
            />
          ) : (
            <div
              className="absolute inset-0 flex items-start justify-center bg-gradient-to-b from-slate-600 to-slate-800 pt-24 text-center text-xs text-white/60"
              data-payload-subpath={`stories.${index}.poster`}
            >
              Poster image
              <br />
              upload in the CMS
            </div>
          )}

          <StatusBar compact={light} />

          {/* Badge */}
          {story.badge && (
            <span
              className={cn(
                'absolute left-2 top-8 z-20 flex items-center gap-1 whitespace-nowrap rounded-md bg-brand/90 font-bold uppercase tracking-wide text-white',
                /* The light-tone card is barely wider than this badge, so it drops a size
                   and loses its padding rather than wrapping onto a second line and
                   colliding with the play button. */
                light ? 'px-1.5 py-0.5 text-[7px]' : 'left-3 top-9 gap-1.5 px-2 py-1 text-[9px]',
              )}
            >
              <span className="h-1 w-1 rounded-full bg-[#4da3ff]" />
              {marks(story.badge)}
            </span>
          )}

          {/* Play */}
          <button
            aria-label={`Play ${story.name}'s video`}
            className="absolute inset-0 z-20 flex items-center justify-center"
            disabled={!canPlay}
            onClick={() => setPlaying(true)}
            type="button"
          >
            <span
              className={cn(
                'flex items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform hover:scale-105',
                light ? 'h-9 w-9' : 'h-14 w-14',
              )}
            >
              <Play
                className={cn('ml-0.5 text-brand', light ? 'h-4 w-4' : 'h-6 w-6')}
                fill="currentColor"
                strokeWidth={0}
              />
            </span>
          </button>

          {/* Name plate. In the dark tone it floats over the poster on a gradient; the
              light tone gives it a solid plate below the poster instead, as the comp does.
              The duration sits inside it either way so it can never collide with a long
              name, however many lines that wraps to. */}
          {!light && (
            <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-10">
              {story.duration && (
                <span className="absolute right-3 top-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  {marks(story.duration)}
                </span>
              )}

              <p className="font-serif text-lg leading-tight text-white">{marks(story.name)}</p>
              {story.caption && (
                <p className="text-[9px] font-semibold uppercase tracking-wide text-white/80">
                  {marks(story.caption)}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {light && !playing && (
        /* `mt-auto` plus a shared minimum height keeps every plate in the row the same
           size, so a one-line name and a three-line name still line up. */
        <div className="mt-auto flex min-h-[4.5rem] items-center justify-center bg-brand px-2 py-3 text-center">
          <p className="text-[13px] font-bold leading-tight text-white">{marks(story.name)}</p>
        </div>
      )}
    </div>
  )
}
