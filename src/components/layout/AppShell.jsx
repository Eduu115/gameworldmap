export function AppShell({ nav, children }) {
  return (
    <div className="app">
      {nav}
      {children}
    </div>
  )
}

