import { makeId } from '../utils/storage'

function offset(days) {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function subtask(text, completed) {
  return { id: makeId('sub'), text, completed }
}

export function createSeedData() {
  const now = Date.now()
  const ts = (minutesAgo) => now - minutesAgo * 60 * 1000

  const projects = [
    {
      id: makeId('proj'),
      name: 'AWD Flow Simplification',
      description: 'Simplify the Alternate Wetting & Drying data capture flow for surveyors in the field.',
      startDate: offset(-30),
      targetDate: offset(18),
      health: 'On Track',
      createdAt: ts(60 * 24 * 30),
    },
    {
      id: makeId('proj'),
      name: 'Surveyor Help & Learning',
      description: 'In-app guidance, tooltips and a learning center to onboard new surveyors faster.',
      startDate: offset(-20),
      targetDate: offset(10),
      health: 'At Risk',
      createdAt: ts(60 * 24 * 20),
    },
    {
      id: makeId('proj'),
      name: 'Farmer Trust & Social Proof',
      description: 'Surface verification badges, testimonials and payment history to build farmer trust.',
      startDate: offset(-15),
      targetDate: offset(25),
      health: 'On Track',
      createdAt: ts(60 * 24 * 15),
    },
    {
      id: makeId('proj'),
      name: 'App Stability & Performance',
      description: 'Reduce crash rate and improve load times across low-end Android devices.',
      startDate: offset(-40),
      targetDate: offset(-2),
      health: 'Blocked',
      createdAt: ts(60 * 24 * 40),
    },
  ]

  const [awd, help, trust, stability] = projects

  const tasks = [
    // AWD Flow Simplification
    {
      id: makeId('task'),
      projectId: awd.id,
      name: 'Finalize field requirements with ops team',
      description: 'Confirm the minimum data points needed per AWD cycle with the field ops lead.',
      status: 'Completed',
      priority: 'High',
      startDate: offset(-28),
      dueDate: offset(-20),
      progress: 100,
      subtasks: [
        subtask('Interview 3 field surveyors', true),
        subtask('Draft requirements doc', true),
        subtask('Sign-off from ops lead', true),
      ],
      notes: 'Ops team wants fewer required photos per cycle — max 2.',
      createdAt: ts(60 * 24 * 28),
      completedAt: ts(60 * 24 * 20),
    },
    {
      id: makeId('task'),
      projectId: awd.id,
      name: 'Design simplified data entry screen',
      description: 'Reduce the AWD entry form from 14 fields to 6 core fields.',
      status: 'Completed',
      priority: 'High',
      startDate: offset(-20),
      dueDate: offset(-10),
      progress: 100,
      subtasks: [subtask('Wireframes', true), subtask('Hi-fi prototype', true), subtask('Design review', true)],
      notes: '',
      createdAt: ts(60 * 24 * 20),
      completedAt: ts(60 * 24 * 10),
    },
    {
      id: makeId('task'),
      projectId: awd.id,
      name: 'Build new AWD form in app',
      description: 'Implement the redesigned form with offline support.',
      status: 'In Progress',
      priority: 'High',
      startDate: offset(-9),
      dueDate: offset(5),
      progress: 60,
      subtasks: [
        subtask('Build form UI', true),
        subtask('Wire up offline cache', true),
        subtask('Validation rules', false),
        subtask('QA pass', false),
        subtask('Ship to beta surveyors', false),
      ],
      notes: 'Offline sync edge case when GPS is unavailable needs a fallback.',
      createdAt: ts(60 * 24 * 9),
    },
    {
      id: makeId('task'),
      projectId: awd.id,
      name: 'Pilot with 10 surveyors in Punjab',
      description: 'Run the simplified flow with a small pilot group and collect feedback.',
      status: 'Not Started',
      priority: 'Medium',
      startDate: offset(6),
      dueDate: offset(16),
      progress: 0,
      subtasks: [],
      notes: '',
      createdAt: ts(60 * 24 * 5),
    },
    {
      id: makeId('task'),
      projectId: awd.id,
      name: 'Fix GPS drift on AWD photo capture',
      description: 'Photos are tagged with stale GPS coordinates on some Android devices.',
      status: 'Blocked',
      priority: 'High',
      startDate: offset(-5),
      dueDate: offset(-1),
      progress: 30,
      subtasks: [subtask('Reproduce on test device', true), subtask('Patch GPS provider', false)],
      notes: 'Blocked — waiting on Android location API behavior confirmation from platform team.',
      createdAt: ts(60 * 24 * 5),
    },

    // Surveyor Help & Learning
    {
      id: makeId('task'),
      projectId: help.id,
      name: 'Audit existing in-app help content',
      description: 'Catalog all current tooltips, FAQs and help screens.',
      status: 'Completed',
      priority: 'Low',
      startDate: offset(-18),
      dueDate: offset(-12),
      progress: 100,
      subtasks: [],
      notes: '',
      createdAt: ts(60 * 24 * 18),
      completedAt: ts(60 * 24 * 12),
    },
    {
      id: makeId('task'),
      projectId: help.id,
      name: 'Design learning center home screen',
      description: 'A searchable hub for guides, videos and FAQs.',
      status: 'In Progress',
      priority: 'Medium',
      startDate: offset(-10),
      dueDate: offset(3),
      progress: 45,
      subtasks: [
        subtask('Content taxonomy', true),
        subtask('Layout exploration', true),
        subtask('Final visual design', false),
      ],
      notes: '',
      createdAt: ts(60 * 24 * 10),
    },
    {
      id: makeId('task'),
      projectId: help.id,
      name: 'Write 12 onboarding help articles',
      description: 'Cover the most common first-week surveyor questions.',
      status: 'In Progress',
      priority: 'High',
      startDate: offset(-6),
      dueDate: offset(-1),
      progress: 50,
      subtasks: [],
      notes: 'Running behind — only 6 of 12 drafted so far.',
      createdAt: ts(60 * 24 * 6),
    },
    {
      id: makeId('task'),
      projectId: help.id,
      name: 'Record walkthrough videos',
      description: 'Short screen-recorded walkthroughs for the top 5 workflows.',
      status: 'Blocked',
      priority: 'Medium',
      startDate: offset(-3),
      dueDate: offset(4),
      progress: 10,
      subtasks: [],
      notes: 'Blocked on voiceover script approval from marketing.',
      createdAt: ts(60 * 24 * 3),
    },
    {
      id: makeId('task'),
      projectId: help.id,
      name: 'Add contextual tooltips to AWD form',
      description: 'Surface inline help for the new simplified AWD form.',
      status: 'Not Started',
      priority: 'Low',
      startDate: offset(5),
      dueDate: offset(12),
      progress: 0,
      subtasks: [],
      notes: '',
      createdAt: ts(60 * 24 * 2),
    },

    // Farmer Trust & Social Proof
    {
      id: makeId('task'),
      projectId: trust.id,
      name: 'Define verification badge criteria',
      description: 'Decide what qualifies a farmer profile as "verified".',
      status: 'Completed',
      priority: 'Medium',
      startDate: offset(-14),
      dueDate: offset(-8),
      progress: 100,
      subtasks: [],
      notes: '',
      createdAt: ts(60 * 24 * 14),
      completedAt: ts(60 * 24 * 8),
    },
    {
      id: makeId('task'),
      projectId: trust.id,
      name: 'Design farmer profile trust section',
      description: 'Badges, payment history and testimonials on the farmer profile screen.',
      status: 'In Progress',
      priority: 'High',
      startDate: offset(-7),
      dueDate: offset(6),
      progress: 70,
      subtasks: [
        subtask('Badge iconography', true),
        subtask('Testimonial card design', true),
        subtask('Payment history list', true),
        subtask('Stakeholder review', false),
      ],
      notes: '',
      createdAt: ts(60 * 24 * 7),
    },
    {
      id: makeId('task'),
      projectId: trust.id,
      name: 'Collect 20 farmer testimonials',
      description: 'Short written or video testimonials from existing farmers.',
      status: 'In Progress',
      priority: 'Medium',
      startDate: offset(-5),
      dueDate: offset(9),
      progress: 35,
      subtasks: [],
      notes: '7 collected so far.',
      createdAt: ts(60 * 24 * 5),
    },
    {
      id: makeId('task'),
      projectId: trust.id,
      name: 'Build payment history timeline component',
      description: 'Reusable timeline showing past payouts to a farmer.',
      status: 'Not Started',
      priority: 'Medium',
      startDate: offset(8),
      dueDate: offset(20),
      progress: 0,
      subtasks: [],
      notes: '',
      createdAt: ts(60 * 24 * 3),
    },

    // App Stability & Performance
    {
      id: makeId('task'),
      projectId: stability.id,
      name: 'Set up crash reporting dashboards',
      description: 'Centralize crash analytics for triage.',
      status: 'Completed',
      priority: 'High',
      startDate: offset(-38),
      dueDate: offset(-28),
      progress: 100,
      subtasks: [],
      notes: '',
      createdAt: ts(60 * 24 * 38),
      completedAt: ts(60 * 24 * 28),
    },
    {
      id: makeId('task'),
      projectId: stability.id,
      name: 'Fix top 5 crash-causing bugs',
      description: 'Address the highest-frequency crashes from the last release.',
      status: 'In Progress',
      priority: 'High',
      startDate: offset(-20),
      dueDate: offset(-6),
      progress: 80,
      subtasks: [
        subtask('Null pointer in sync service', true),
        subtask('OOM on large photo upload', true),
        subtask('ANR on form submit', true),
        subtask('Crash on offline map load', false),
      ],
      notes: 'Last crash fix is tricky — intermittent, hard to reproduce.',
      createdAt: ts(60 * 24 * 20),
    },
    {
      id: makeId('task'),
      projectId: stability.id,
      name: 'Reduce cold start time on low-end devices',
      description: 'Target under 3s cold start on devices with 2GB RAM.',
      status: 'Blocked',
      priority: 'High',
      startDate: offset(-15),
      dueDate: offset(-3),
      progress: 25,
      subtasks: [],
      notes: 'Blocked — waiting on new APK size budget approval from leadership.',
      createdAt: ts(60 * 24 * 15),
    },
    {
      id: makeId('task'),
      projectId: stability.id,
      name: 'Optimize image compression pipeline',
      description: 'Compress field photos client-side before upload to cut sync time.',
      status: 'Not Started',
      priority: 'Medium',
      startDate: offset(-2),
      dueDate: offset(-1),
      progress: 0,
      subtasks: [],
      notes: '',
      createdAt: ts(60 * 24 * 2),
    },
    {
      id: makeId('task'),
      projectId: stability.id,
      name: 'Add performance regression tests to CI',
      description: 'Automated checks to catch regressions before release.',
      status: 'Not Started',
      priority: 'Low',
      startDate: offset(3),
      dueDate: offset(15),
      progress: 0,
      subtasks: [],
      notes: '',
      createdAt: ts(60 * 24 * 1),
    },
  ]

  // Keep progress authoritative: derive it from subtasks whenever a task has any,
  // matching the invariant the data layer maintains for subsequent edits.
  for (const task of tasks) {
    if (task.subtasks.length > 0) {
      const completed = task.subtasks.filter((s) => s.completed).length
      task.progress = task.status === 'Completed' ? 100 : Math.round((completed / task.subtasks.length) * 100)
    }
  }

  const activity = []
  for (const task of tasks) {
    const project = projects.find((p) => p.id === task.projectId)
    activity.push({
      id: makeId('act'),
      type: 'created',
      message: `Task created`,
      taskId: task.id,
      taskName: task.name,
      projectName: project?.name ?? '',
      timestamp: task.createdAt,
    })
    if (task.status === 'Completed') {
      activity.push({
        id: makeId('act'),
        type: 'completed',
        message: `Task completed`,
        taskId: task.id,
        taskName: task.name,
        projectName: project?.name ?? '',
        timestamp: task.completedAt ?? task.createdAt,
      })
    } else if (task.progress > 0) {
      activity.push({
        id: makeId('act'),
        type: 'progress',
        message: `Progress updated to ${task.progress}%`,
        taskId: task.id,
        taskName: task.name,
        projectName: project?.name ?? '',
        timestamp: task.createdAt + 1000 * 60 * 30,
      })
    }
  }
  activity.sort((a, b) => b.timestamp - a.timestamp)

  return { projects, tasks, activity }
}
