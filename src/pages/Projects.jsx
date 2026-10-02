import { useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { Header } from '../components/Layout/Header'
import { ProjectCard } from '../components/ProjectCard'
import { ProjectModal } from '../components/ProjectModal'
import { useData } from '../context/DataContext'

export function Projects() {
  const { projects, tasks, addProject } = useData()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div>
      <Header
        title="Projects"
        subtitle={`${projects.length} project${projects.length === 1 ? '' : 's'}`}
        actions={
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="rounded-lg bg-gray-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            + New Project
          </button>
        }
      />

      <div className="px-8 py-6">
        {projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Create your first project to start tracking tasks."
            action={
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="rounded-lg bg-gray-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                + New Project
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} tasks={tasks} />
            ))}
          </div>
        )}
      </div>

      <ProjectModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={addProject} />
    </div>
  )
}
