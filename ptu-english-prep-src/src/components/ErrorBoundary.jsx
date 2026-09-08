import { Component } from 'react'
import { Link } from 'react-router-dom'

/**
 * Catches any render-time error in its child component tree and shows a
 * friendly recovery message instead of leaving a blank white screen.
 * Error boundaries must be class components — React does not yet support
 * this behavior in function components with hooks.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // Logged to the browser console only — helps diagnose later, doesn't show to students.
    console.error('Site error caught by ErrorBoundary:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-lg mx-auto px-5 py-16 text-center">
          <p className="font-mono text-xs text-rule tracking-widest mb-2">SOMETHING WENT WRONG</p>
          <h1 className="font-display text-2xl font-semibold text-board mb-3">
            This page hit a snag
          </h1>
          <p className="text-ink-soft mb-6">
            Sorry about that — something on this specific page broke. The rest of the site
            should still work fine. Try reloading, or head back to the homepage.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => window.location.reload()}
              className="bg-highlight text-board font-semibold px-5 py-2.5 rounded-md hover:bg-highlight-soft transition-colors"
            >
              Reload page
            </button>
            <Link
              to="/"
              onClick={this.handleReset}
              className="border border-ink/20 px-5 py-2.5 rounded-md hover:bg-ink/5 transition-colors"
            >
              Go to homepage
            </Link>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}