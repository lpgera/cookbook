import React, { useEffect, useState } from 'react'
import { Box, ButtonBase } from '@mui/material'

export const letterAnchorId = (letter: string) =>
  `letter-${letter === '#' ? 'other' : letter}`

const LetterRail = ({ letters }: { letters: string[] }) => {
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
        right: 0,
        width: 24,
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
            fontSize: 11,
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
