import { useRef } from 'react'
import './App.css'
import { Slide } from './components/Slide'
import { SlideContent } from './components/SlideContent'
import { ExportButton } from './components/ExportButton'
import { chartData } from './charts/chartData'

function App() {
  const slideRef = useRef<HTMLDivElement>(null)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px 0' }}>
      <h1 style={{ textAlign: 'center', color: '#363636', marginBottom: '20px' }}>
        Presentation Export Demo
      </h1>
      <Slide ref={slideRef}>
        <SlideContent data={chartData} />
      </Slide>
      <ExportButton data={chartData} slideRef={slideRef} />
    </div>
  )
}

export default App
