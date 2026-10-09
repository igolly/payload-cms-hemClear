'use client'
import React from 'react'
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
  /** Raised to the carousel so only one story can be playing at a time. */
  onPlayChange: (playing: boolean) => void
  playing: boolean
  /** The poster already carries the status bar, badge and duration (as the Figma stills
      do), so they are not drawn a second time on top of it. */
  posterIncludesChrome?: boolean
  story: Story
  tone?: 'dark' | 'light'
}> = ({ index, onPlayChange, playing, posterIncludesChrome = false, story, tone = 'dark' }) => {
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
          : /* Figma 58:842: 208.75x395, 18.75px radius, 1px cyan rule, soft 6.25px shadow.
               A container, so the name plate's type scales with the card's width — five
               across a 1024px screen are narrower than the phone card. */
            'group @container relative aspect-[208.75/395] rounded-[18.75px] border border-brand-300 shadow-[0_0_6.25px_0_rgba(0,0,0,0.15)]',
      )}
      data-payload-subpath={`stories.${index}.name`}
    >
      {/*
       * Closing is the only way back to the still: the native controls can pause a clip but
       * not leave it, and an embed has no exit at all. Sits above the video's own chrome,
       * clear of the controls along the bottom.
       */}
      {playing && (
        <button
          aria-label={`Stop ${story.name}'s video`}
          className={cn(
            'absolute right-2 top-2 z-30 flex items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80',
            light ? 'size-6' : 'size-8',
          )}
          onClick={() => onPlayChange(false)}
          type="button"
        >
          <svg
            aria-hidden="true"
            className={light ? 'size-3' : 'size-4'}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2.25"
            viewBox="0 0 24 24"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      )}

      {playing && hasVideoFile ? (
        /*
         * Its own element rather than `Media`, whose `VideoMedia` is built for decorative
         * background footage: muted, looped and controlless. This is a person talking —
         * "press play to hear it in their words" — so it plays aloud, once, with controls,
         * and `autoPlay` is what carries the press of the play button into playback.
         */
        // eslint-disable-next-line jsx-a11y/media-has-caption -- no caption track is uploaded
        <video
          autoPlay
          className="absolute inset-0 h-full w-full bg-black object-cover"
          controls
          playsInline
          poster={
            story.poster && typeof story.poster === 'object'
              ? getMediaUrl(story.poster.url)
              : undefined
          }
          onEnded={() => onPlayChange(false)}
          preload="auto"
          src={getMediaUrl((story.video as { url?: null | string }).url)}
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
              className={cn(
                'absolute inset-0',
                // A slow push-in behind the quote as it comes up.
                !light && 'transition-transform duration-700 ease-out group-hover:scale-[1.04]',
              )}
              fill
              imgClassName="object-cover"
              resource={story.poster}
              // Roughly half the screen on a phone, never more than a ~300px card above it.
              size="(max-width: 640px) 50vw, 300px"
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
            onClick={() => onPlayChange(true)}
            type="button"
          >
            {light ? (
              /* Figma 6219:3276: a 24.92px play disc, its top 92.08px down the card. */
              <img
                alt=""
                className="absolute left-1/2 top-[92.08px] size-[24.92px] -translate-x-1/2 transition-transform hover:scale-105"
                decoding="async"
                height={25}
                loading="lazy"
                src="/icons/product-detail/play.png"
                width={25}
              />
            ) : (
              /* Figma 6809:149: a 46px white disc with a navy triangle, its centre 44.6% down. */
              <img
                alt=""
                className="absolute left-1/2 top-[38.8%] h-[46px] w-[46px] -translate-x-1/2 transition-transform hover:scale-105"
                decoding="async"
                height={46}
                loading="lazy"
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
              {/* The plate's white text needs its own darkness over a real still: a bright
                  frame — a window, a white bathroom — otherwise swallows the name. A second,
                  taller shade fades in on hover to carry the quote as it comes up. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 top-[58%] z-10 bg-gradient-to-t from-navy-950/95 via-navy-950/60 to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 top-[30%] z-10 bg-gradient-to-t from-navy-950 via-navy-950/80 to-transparent opacity-0 transition-opacity duration-500 group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
              />

              {/* Up top beside the badge, clear of the quote that rises from the foot. */}
              {drawChrome && story.duration && (
                <span className="absolute right-3 top-9 z-20 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  {marks(story.duration)}
                </span>
              )}

              {/*
               * The name plate, after the reference card: a gold kicker, the name in
               * Playfair, then the customer's words in italic. At rest only the kicker and
               * name show; on hover (or focus) the quote's row opens and its words rise in
               * one after another. A device that cannot hover shows the quote outright.
               */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col px-[7%] pb-[8%] text-white [&_sup]:leading-[0]">
                {story.kicker && (
                  <p className="mb-[1.5cqw] truncate font-inter text-[clamp(8px,4.2cqw,11px)] font-bold uppercase tracking-[0.18em] text-gold">
                    {marks(story.kicker)}
                  </p>
                )}
                <p className="truncate font-playfair text-[clamp(16px,10.5cqw,24px)] font-semibold italic leading-[1.3]">
                  {marks(story.name)}
                </p>
                {story.caption && (
                  <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-focus-within:grid-rows-[1fr] group-hover:grid-rows-[1fr] [@media(hover:none)]:grid-rows-[1fr]">
                    <p className="line-clamp-6 min-h-0 overflow-hidden pt-[4cqw] font-playfair text-[clamp(10px,5.8cqw,14px)] italic leading-[1.55] text-white/90">
                      {story.caption.split(/\s+/).map((word, i) => (
                        <React.Fragment key={i}>
                          {i > 0 && ' '}
                          {/* Delayed only on the way in, so the quote clears at once on leave. */}
                          <span
                            className="inline-block translate-y-2 opacity-0 blur-[3px] transition-[opacity,transform,filter] duration-500 ease-out group-focus-within:translate-y-0 group-focus-within:opacity-100 group-focus-within:blur-none group-focus-within:[transition-delay:var(--d)] group-hover:translate-y-0 group-hover:opacity-100 group-hover:blur-none group-hover:[transition-delay:var(--d)] [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100 [@media(hover:none)]:blur-none motion-reduce:translate-y-0 motion-reduce:blur-none"
                            style={{ '--d': `${150 + Math.min(i, 24) * 28}ms` } as React.CSSProperties}
                          >
                            {marks(word)}
                          </span>
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
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
