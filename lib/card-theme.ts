type GrantThemeInput = {
  funder?: string | null
  name?: string | null
  summary?: string | null
  eligibility?: string | null
}

const GRANT_THEME_RULES: Array<{ tokens: string[]; gradient: string }> = [
  { tokens: ['nih', 'national institutes of health'], gradient: 'blog-header-nih' },
  { tokens: ['nsf', 'national science foundation'], gradient: 'blog-header-nsf' },
  { tokens: ['sbir', 'sttr'], gradient: 'blog-header-sbir' },
  { tokens: ['epa', 'environmental protection'], gradient: 'blog-header-epa' },
  { tokens: ['noaa', 'oceanic', 'coastal', 'marine'], gradient: 'blog-header-noaa' },
  { tokens: ['darpa', 'defense advanced research'], gradient: 'blog-header-darpa' },
  { tokens: ['usda', 'agriculture', 'rural'], gradient: 'blog-header-usda' },
  { tokens: ['tribal', 'indigenous', 'native nation'], gradient: 'blog-header-tribal' },
]

const DEFAULT_GRANT_GRADIENT = 'blog-header-tips'

export function inferGrantHeaderClass(input: GrantThemeInput): string {
  const haystack = [input.funder, input.name, input.summary, input.eligibility]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  for (const rule of GRANT_THEME_RULES) {
    if (rule.tokens.some((token) => haystack.includes(token))) {
      return rule.gradient
    }
  }

  return DEFAULT_GRANT_GRADIENT
}
