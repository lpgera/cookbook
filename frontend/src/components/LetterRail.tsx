import React, { useEffect, useState } from 'react'
import { Box, ButtonBase } from '@mui/material'

export const letterAnchorId = (letter: string) =>
  `letter-${letter === '#' ? 'other' : letter}`

// Auto-hiding (overlay) scroll bars take up no layout space and appear on top
// of the rail when scrolling with a mouse or trackpad, so leave room for them.
const getScrollbarGap = () => {
  if (!window.matchMedia('(pointer: fine)').matches) {
    return 0
  }
  const probe = document.createElement('div')
  probe.style.cssText =
    'position:absolute;top:-999px;width:50px;height:50px;overflow:scroll'
  document.body.appendChild(probe)
  const isOverlay = probe.offsetWidth === probe.clientWidth
  probe.remove()
  return isOverlay ? 16 : 0
}

export const useScrollbarGap = () => useState(getScrollbarGap)[0]

const LetterRail = ({ letters }: { letters: string[] }) => {
  const scrollbarGap = useScrollbarGap()
  const [active, setActive] = useState<string | null>(null)

  const jumpTo = (letter: string) => {
    setActive(letter)
    document
      .getElementById(letterAnchorId(letter))
      ?.scrollIntoView({ block: 'start' })
  }

  const jumpToPoint = (event: React.PointerEvent<HTMLElement>) => {
    const letter = [
      ...event.currentTarget.querySelectorAll<HTMLElement>('[data-letter]'),
    ].find((el) => event.clientY < el.getBoundingClientRect().bottom)?.dataset
      .letter
    if (letter && letter !== active) {
      jumpTo(letter)
    }
  }

  const lettersKey = letters.join('')
  useEffect(() => {
    const headingTop = (letter: string) =>
      document.getElementById(letterAnchorId(letter))?.getBoundingClientRect()
        .top ?? Infinity

    const threshold = 88 // slightly below the headings' scroll margin

    const onScroll = () => {
      const current =
        [...lettersKey].findLast((l) => headingTop(l) <= threshold) ??
        lettersKey[0] ??
        null
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2

      setActive((previous) => {
        const previousTop = previous ? headingTop(previous) : Infinity
        return atBottom &&
          previousTop > threshold &&
          previousTop < window.innerHeight
          ? previous
          : current
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lettersKey])

  if (letters.length < 2) {
    return null
  }

  return (
    <Box
      component="nav"
      aria-label="Jump to letter"
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId)
        jumpToPoint(event)
      }}
      onPointerMove={(event) => {
        if (event.buttons || event.pointerType === 'touch') {
          jumpToPoint(event)
        }
      }}
      sx={{
        position: 'fixed',
        top: { xs: 56, sm: 64 },
        bottom: 0,
        right: scrollbarGap,
        width: 28,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        touchAction: 'none',
        userSelect: 'none',
        zIndex: 'fab',
      }}
    >
      {letters.map((letter) => (
        <ButtonBase
          key={letter}
          data-letter={letter}
          aria-label={`Jump to ${letter}`}
          onClick={() => jumpTo(letter)}
          sx={{
            typography: 'caption',
            fontSize: `clamp(9px, calc((100dvh - 64px) / ${letters.length} * 0.62), 15px)`,
            lineHeight: 1.45,
            fontWeight: letter === active ? 'bold' : 'medium',
            color: letter === active ? 'secondary.main' : 'text.secondary',
          }}
        >
          {letter}
        </ButtonBase>
      ))}
    </Box>
  )
}

export default LetterRail
