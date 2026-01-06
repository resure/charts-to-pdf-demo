import './App.css'
import { Slide } from './components/Slide'
import { SlideContent } from './components/SlideContent'
import { ExportButton } from './components/ExportButton'
import { chartData } from './charts/chartData'

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px 0' }}>
      <h1 style={{ textAlign: 'center', color: '#363636', marginBottom: '20px' }}>
        PPTX Export Demo
      </h1>
      <Slide>
        <SlideContent data={chartData} />
      </Slide>
      <ExportButton data={chartData} />
    </div>
  )
}

export default App
