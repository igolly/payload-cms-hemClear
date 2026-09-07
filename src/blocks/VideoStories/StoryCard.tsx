'use client'
import React, { useState } from 'react'
import { Play } from 'lucide-react'

import type { VideoStoriesBlock } from '@/payload-types'

import { Media } from '@/components/Media'

type Story = NonNullable<VideoStoriesBlock['stories']>[number]

/** Decorative phone status bar — matches the design's device framing. */
const StatusBar = () => (
  <div
    aria-hidden="true"
    className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-2 text-[10px] font-semibold text-white"
  >
    <span>9:41</span>
    <span className="absolute left-1/2 top-1.5 h-4 w-14 -translate-x-1/2 rounded-full bg-black/85" />
    <span className="flex items-center gap-1">
      <svg className="h-2.5 w-3.5" fill="currentColor" viewBox="0 0 16 12">
        <rect height="3" rx=".5" width="2.5" x="0" y="8" />
        <rect height="5" rx=".5" width="2.5" x="4" y="6" />
        <rect height="8" rx=".5" width="2.5" x="8" y="3" />
        <rect height="11" rx=".5" width="2.5" x="12" y="0" />
      </svg>
      <svg className="h-2.5 w-3" fill="currentColor" viewBox="0 0 12 10">
        <path d="M6 9.5 0 3a8.5 8.5 0 0 1 12 0Z" />
      </svg>
      <svg className="h-2.5 w-4" fill="none" stroke="currentColor" viewBox="0 0 18 10">
        <rect height="8" rx="2" stroke="currentColor" strokeWidth="1" width="14" x="1" y="1" />
        <rect fill="currentColor" height="5" rx=".5" width="10" x="2.5" y="2.5" />
      </svg>
    </span>
  </div>
)

export const StoryCard: React.FC<{ index: number; story: Story }> = ({ index, story }) => {
  const [playing, setPlaying] = useState(false)

  const hasVideoFile = story.video && typeof story.video === 'object'
  const hasEmbed = Boolean(story.videoUrl)
  const canPlay = hasVideoFile || hasEmbed

  return (
    <div
      className="relative aspect-[9/19] w-full overflow-hidden rounded-[1.75rem] border-[3px] border-white/25 bg-slate-800 shadow-xl"
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
        <>
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

          <StatusBar />

          {/* Badge */}
          {story.badge && (
            <span className="absolute left-3 top-9 z-20 flex items-center gap-1.5 rounded-md bg-[#1c2f6e]/90 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4da3ff]" />
              {story.badge}
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
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform hover:scale-105">
              <Play className="ml-0.5 h-6 w-6 text-[#1c2f6e]" fill="currentColor" strokeWidth={0} />
            </span>
          </button>

          {/* Name plate — the duration lives inside it so it can never collide with a
              long caption, however many lines the name wraps to. */}
          <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-10">
            {story.duration && (
              <span className="absolute right-3 top-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                {story.duration}
              </span>
            )}

            <p className="font-serif text-lg leading-tight text-white">{story.name}</p>
            {story.caption && (
              <p className="text-[9px] font-semibold uppercase tracking-wide text-white/80">
                {story.caption}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
