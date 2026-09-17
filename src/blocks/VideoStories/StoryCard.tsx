'use client'
import React, { useState } from 'react'
/* eslint-disable @next/next/no-img-element */

import type { VideoStoriesBlock } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { marks, multiline } from '@/utilities/marks'

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
export const StoryCard: React.FC<{
  index: number
  /** The poster already carries the status bar, badge and duration (as the Figma stills
      do), so they are not drawn a second time on top of it. */
  posterIncludesChrome?: boolean
  story: Story
  tone?: 'dark' | 'light'
}> = ({ index, posterIncludesChrome = false, story, tone = 'dark' }) => {
  const [playing, setPlaying] = useState(false)
  const light = tone === 'light'

  const hasVideoFile = story.video && typeof story.video === 'object'
  const hasEmbed = Boolean(story.videoUrl)
  const canPlay = hasVideoFile || hasEmbed
  const drawChrome = !posterIncludesChrome

  return (
    <div
      className={cn(
        'w-full overflow-hidden bg-slate-800',
        light
          ? /* Figma 6219:3272: 114x214, 10px radius, soft 3.37px shadow. */
            'relative h-[214px] rounded-[10px] shadow-[0_0_3.37px_0_rgba(0,0,0,0.15)]'
          : /* Figma 58:842: 208.75x395, 18.75px radius, 1px cyan rule, soft 6.25px shadow. */
            'relative aspect-[208.75/395] rounded-[18.75px] border border-brand-300 shadow-[0_0_6.25px_0_rgba(0,0,0,0.15)]',
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
        <div className={cn(light && 'absolute inset-0')}>
          {/* Poster */}
          {story.poster && typeof story.poster === 'object' ? (
            <Media
              className="absolute inset-0"
              fill
              imgClassName="object-cover"
              resource={story.poster}
            />
          ) : hasVideoFile ? (
            /*
             * No still uploaded, but there is a video: its own opening frame stands in for
             * one. `#t=0.1` is what makes a browser paint a frame at all — asked only for
             * metadata, it otherwise shows a black box. Muted and never autoplaying, so the
             * card stays a still until the visitor presses play.
             */
            // eslint-disable-next-line jsx-a11y/media-has-caption -- a silent still frame
            <video
              className="absolute inset-0 h-full w-full object-cover"
              muted
              playsInline
              preload="metadata"
              src={`${getMediaUrl((story.video as { url?: null | string }).url)}#t=0.1`}
            />
          ) : (
            <div
              className={cn(
                'absolute inset-0 flex items-start justify-center bg-gradient-to-b from-slate-600 to-slate-800 text-center text-white/60',
                light ? 'pt-[120px] text-[9px]' : 'pt-24 text-xs',
              )}
              data-payload-subpath={`stories.${index}.poster`}
            >
              Poster image
              <br />
              upload in the CMS
            </div>
          )}

          {drawChrome && <StatusBar compact={light} />}

          {/* Badge */}
          {drawChrome && story.badge && (
            <span
              className={cn(
                'absolute left-2 top-8 z-20 flex items-center gap-1 whitespace-nowrap rounded-md bg-brand/90 font-bold uppercase tracking-wide text-white',
                /* The light-tone card is barely wider than this badge, so it drops a size
                   and loses its padding rather than wrapping onto a second line and
                   colliding with the play button. */
                light
                  ? 'top-[18px] px-1.5 py-0.5 text-[6px]'
                  : 'left-3 top-9 gap-1.5 px-2 py-1 text-[9px]',
              )}
            >
              <span className="h-1 w-1 rounded-full bg-brand-200" />
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
            {light ? (
              /* Figma 6219:3276: a 24.92px play disc, its top 92.08px down the card. */
              <img
                alt=""
                className="absolute left-1/2 top-[92.08px] size-[24.92px] -translate-x-1/2 transition-transform hover:scale-105"
                height={25}
                src="/icons/product-detail/play.png"
                width={25}
              />
            ) : (
              /* Figma 6809:149: a 46px white disc with a navy triangle, its centre 44.6% down. */
              <img
                alt=""
                className="absolute left-1/2 top-[38.8%] h-[46px] w-[46px] -translate-x-1/2 transition-transform hover:scale-105"
                height={46}
                src="/icons/video-stories/play.svg"
                width={46}
              />
            )}
          </button>

          {/* Name plate. In the dark tone it floats over the poster on a gradient; the
              light tone gives it a solid plate below the poster instead, as the comp does.
              The duration sits inside it either way so it can never collide with a long
              name, however many lines that wraps to. */}
          {!light && (
            <>
              {drawChrome && story.duration && (
                <span className="absolute bottom-[22%] right-3 z-20 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  {marks(story.duration)}
                </span>
              )}

              {/* Figma 58:843: starts 322.5px down the 395px card, 12.5px side / 17.5px top
                  padding, Playfair 24 name over an 8px Inter caption, 3.125px apart. */}
              <div className="pointer-events-none absolute inset-x-0 top-[81.65%] z-20 flex flex-col gap-[3.125px] px-[12.5px] pt-[17.5px] font-semibold leading-[1.21] text-white [&_sup]:leading-[0]">
                <p className="truncate font-playfair text-2xl leading-[1.33]">
                  {marks(story.name)}
                </p>
                {story.caption && (
                  <p className="truncate font-inter text-[8px] uppercase">{marks(story.caption)}</p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {light && !playing && (
        /* Figma 6219:3273: a 44px brand-600 plate across the foot of the card, 9.43/6.73px
           padding, the name in 10px semibold (line breaks in the name are kept). */
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex h-11 justify-center rounded-b-[10px] bg-brand-600 px-[6.73px] py-[9.43px] text-center">
          <p className="line-clamp-2 text-[10px] font-semibold leading-[1.21] text-white [&_sup]:leading-[0]">
            {multiline(story.name)}
          </p>
        </div>
      )}
    </div>
  )
}
