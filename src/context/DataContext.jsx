import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createSeedData } from '../data/seedData'
import { loadData, makeId, saveData } from '../utils/storage'

const DataContext = createContext(null)

function initialState() {
  const existing = loadData()
  if (existing && existing.projects && existing.tasks) return existing
  const seeded = createSeedData()
  saveData(seeded)
  return seeded
}

export function DataProvider({ children }) {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    saveData(state)
  }, [state])

  function logActivity(type, message, task, project) {
    const entry = {
      id: makeId('act'),
      type,
      message,
      taskId: task?.id ?? null,
      taskName: task?.name ?? '',
      projectName: project?.name ?? '',
      timestamp: Date.now(),
    }
    setState((s) => ({ ...s, activity: [entry, ...s.activity].slice(0, 200) }))
  }

  function addProject(data) {
    const project = {
      id: makeId('proj'),
      name: data.name?.trim() || 'Untitled project',
      description: data.description?.trim() || '',
      startDate: data.startDate || '',
      targetDate: data.targetDate || '',
      health: data.health || 'On Track',
      createdAt: Date.now(),
    }
    setState((s) => ({ ...s, projects: [...s.projects, project] }))
    logActivity('project_created', 'Project created', null, project)
    return project
  }

  function updateProject(id, patch) {
    setState((s) => ({
      ...s,
      projects: s.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }))
  }

  function deleteProject(id) {
    setState((s) => ({
      ...s,
      projects: s.projects.filter((p) => p.id !== id),
      tasks: s.tasks.filter((t) => t.projectId !== id),
    }))
  }

  function addTask(data) {
    const subtasks = data.subtasks || []
    const fromSubtasks = subtasks.length
      ? Math.round((subtasks.filter((s) => s.completed).length / subtasks.length) * 100)
      : null
    const task = {
      id: makeId('task'),
      projectId: data.projectId || '',
      name: data.name?.trim() || 'Untitled task',
      description: data.description?.trim() || '',
      status: data.status || 'Not Started',
      priority: data.priority || 'Medium',
      startDate: data.startDate || '',
      dueDate: data.dueDate || '',
      progress: fromSubtasks ?? (Number.isFinite(data.progress) ? data.progress : 0),
      subtasks,
      notes: data.notes || '',
      createdAt: Date.now(),
      completedAt: data.status === 'Completed' ? Date.now() : null,
    }
    setState((s) => ({ ...s, tasks: [...s.tasks, task] }))
    const project = state.projects.find((p) => p.id === task.projectId)
    logActivity('created', 'Task created', task, project)
    return task
  }

  function getTask(id) {
    return state.tasks.find((t) => t.id === id)
  }

  function updateTask(id, patch) {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }))
  }

  function deleteTask(id) {
    setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }))
  }

  function changeStatus(id, status) {
    const task = getTask(id)
    if (!task) return
    const project = state.projects.find((p) => p.id === task.projectId)
    const patch = { status }
    if (status === 'Completed') {
      patch.progress = 100
      patch.completedAt = Date.now()
    } else if (task.status === 'Completed') {
      patch.completedAt = null
    }
    updateTask(id, patch)
    if (status === 'Completed') {
      logActivity('completed', 'Task completed', task, project)
    } else {
      logActivity('status', `Status changed to ${status}`, task, project)
    }
  }

  function progressStatusPatch(task, clamped) {
    const patch = { progress: clamped }
    if (clamped === 100) {
      patch.status = 'Completed'
      patch.completedAt = Date.now()
    } else if (task.status === 'Completed' && clamped < 100) {
      patch.status = 'In Progress'
      patch.completedAt = null
    }
    return patch
  }

  function updateProgress(id, progress) {
    const task = getTask(id)
    if (!task) return
    const project = state.projects.find((p) => p.id === task.projectId)
    const clamped = Math.max(0, Math.min(100, Math.round(progress)))
    updateTask(id, progressStatusPatch(task, clamped))
    logActivity('progress', `Progress updated to ${clamped}%`, task, project)
  }

  function addSubtask(taskId, text) {
    const task = getTask(taskId)
    if (!task || !text?.trim()) return
    const subtasks = [...task.subtasks, { id: makeId('sub'), text: text.trim(), completed: false }]
    updateTask(taskId, { subtasks })
  }

  function toggleSubtask(taskId, subtaskId) {
    const task = getTask(taskId)
    if (!task) return
    const subtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st,
    )
    const completed = subtasks.filter((s) => s.completed).length
    const derived = Math.round((completed / subtasks.length) * 100)
    updateTask(taskId, { subtasks, ...progressStatusPatch(task, derived) })
    const project = state.projects.find((p) => p.id === task.projectId)
    logActivity('subtask', 'Subtask updated', task, project)
  }

  function deleteSubtask(taskId, subtaskId) {
    const task = getTask(taskId)
    if (!task) return
    const subtasks = task.subtasks.filter((st) => st.id !== subtaskId)
    const patch = { subtasks }
    if (subtasks.length > 0) {
      const completed = subtasks.filter((s) => s.completed).length
      Object.assign(patch, progressStatusPatch(task, Math.round((completed / subtasks.length) * 100)))
    }
    updateTask(taskId, patch)
  }

  const value = useMemo(
    () => ({
      projects: state.projects,
      tasks: state.tasks,
      activity: state.activity,
      addProject,
      updateProject,
      deleteProject,
      addTask,
      getTask,
      updateTask,
      deleteTask,
      changeStatus,
      updateProgress,
      addSubtask,
      toggleSubtask,
      deleteSubtask,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within a DataProvider')
  return ctx
}
