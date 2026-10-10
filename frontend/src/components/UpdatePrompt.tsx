import React from 'react'
import { Button, Snackbar } from '@mui/material'
import { useRegisterSW } from 'virtual:pwa-register/react'

const UPDATE_CHECK_INTERVAL = 60 * 60 * 1000

// Browsers only look for a new service worker on navigation, which rarely
// happens in an installed PWA that is resumed from the background, so we also
// check when the app becomes visible again.
function watchForUpdates(registration: ServiceWorkerRegistration) {
  const checkForUpdate = () => {
    if (navigator.onLine) {
      registration.update().catch(() => {})
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      checkForUpdate()
    }
  })
  setInterval(checkForUpdate, UPDATE_CHECK_INTERVAL)
}

export default function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegisteredSW(_swUrl, registration) {
      if (registration) {
        watchForUpdates(registration)
      }
    },
  })

  return (
    <Snackbar
      open={needRefresh}
      style={{
        marginRight: 100,
      }}
      message="A new version is available"
      action={
        <>
          <Button
            color="inherit"
            size="small"
            onClick={() => setNeedRefresh(false)}
          >
            Later
          </Button>
          <Button
            color="inherit"
            size="small"
            onClick={() => updateServiceWorker()}
          >
            Reload
          </Button>
        </>
      }
    />
  )
}
