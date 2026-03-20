import './LoadingSpinner.css'

type LoadingSpinnerProps = {
  label?: string
}

export default function LoadingSpinner({ label = 'Cargando' }: LoadingSpinnerProps) {
  return (
    <div className="spinnerOverlay" role="status" aria-label={label}>
      <div className="spinnerWrapper">
        <div className="pokemon" />
        <div className="loadingText">
          {label}
          <span className="dots">
            <span className="dot dot1">.</span>
            <span className="dot dot2">.</span>
            <span className="dot dot3">.</span>
          </span>
        </div>
      </div>
    </div>
  )
}
