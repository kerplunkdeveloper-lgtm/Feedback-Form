// The 12 "Kerplunk Voice" areas. Keep in sync with VOICE in google-apps-script/Code.gs.
export const VOICE_ITEMS = [
  { key: 'atmosphere', label: 'Work atmosphere', icon: '🌤️' },
  { key: 'culture', label: 'Company culture', icon: '🤝' },
  { key: 'management', label: 'Management support', icon: '🧭' },
  { key: 'coordination', label: 'Team coordination', icon: '🔗' },
  { key: 'workload', label: 'Workload management', icon: '📋' },
  { key: 'balance', label: 'Work-life balance', icon: '⚖️' },
  { key: 'salary', label: 'Salary & benefits', icon: '💰' },
  { key: 'hr', label: 'HR policies', icon: '📑' },
  { key: 'growth', label: 'Career growth & learning', icon: '📈' },
  { key: 'recognition', label: 'Recognition & appreciation', icon: '🏆' },
  { key: 'facilities', label: 'Office facilities', icon: '🏢' },
  { key: 'satisfaction', label: 'Overall job satisfaction', icon: '⭐' },
]

// Kerplunk Voice is shown as short pages of 3 areas each (no long scrolling).
export const VOICE_PARTS = [
  { title: 'Workplace', items: VOICE_ITEMS.slice(0, 3) },
  { title: 'Team & workload', items: VOICE_ITEMS.slice(3, 6) },
  { title: 'Pay & growth', items: VOICE_ITEMS.slice(6, 9) },
  { title: 'Overall', items: VOICE_ITEMS.slice(9, 12) },
]
