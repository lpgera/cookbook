import { useBeforeUnload, useBlocker } from 'react-router'

export default function useUnsavedChangesPrompt(
  hasUnsavedChanges: () => boolean
) {
  useBlocker(
    () =>
      hasUnsavedChanges() &&
      !window.confirm('You have unsaved changes. Leave without saving?')
  )
  useBeforeUnload((event) => {
    if (hasUnsavedChanges()) {
      event.preventDefault()
    }
  })
}
