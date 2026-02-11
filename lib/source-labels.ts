/** Source provider display labels and official source set — shared by server and client components */

export const SOURCE_LABELS: Record<string, string> = {
  grants_gov: 'Grants.gov',
  sam_assistance: 'SAM.gov',
  nih_guide: 'NIH',
  nsf_funding: 'NSF',
  nih_weekly_index: 'NIH',
  nsf_upcoming: 'NSF',
  ca_grants_portal: 'CA Grants Portal',
  pnd_rfps: 'PND',
}

export const OFFICIAL_SOURCES = new Set([
  'grants_gov',
  'sam_assistance',
  'nih_guide',
  'nsf_funding',
  'nih_weekly_index',
  'nsf_upcoming',
  'ca_grants_portal',
])
