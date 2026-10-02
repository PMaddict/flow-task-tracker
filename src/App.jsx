import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { DataProvider } from './context/DataContext'
import { Dashboard } from './pages/Dashboard'
import { ProjectDetail } from './pages/ProjectDetail'
import { Projects } from './pages/Projects'
import { Tasks } from './pages/Tasks'
import { Timeline } from './pages/Timeline'

function App() {
  return (
    <DataProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/timeline" element={<Timeline />} />
        </Route>
      </Routes>
    </DataProvider>
  )
}

export default App
