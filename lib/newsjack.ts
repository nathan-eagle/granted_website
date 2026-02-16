import { supabase } from './supabase'

export type NewsjackStory = {
  id: string
  slug: string
  title: string
  meta_description: string
  content_markdown: string
  category: string
  author: string
  published_at: string
  citations: string[]
}

/** Fetch a single published newsjack story by slug */
export async function getPublishedStory(slug: string): Promise<NewsjackStory | null> {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('newsjack_stories')
    .select('id, slug, title, meta_description, content_markdown, category, author, published_at, citations')
    .eq('status', 'published')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data as NewsjackStory
}

/** List published newsjack stories, most recent first */
export async function listPublishedStories(limit = 20): Promise<NewsjackStory[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('newsjack_stories')
    .select('id, slug, title, meta_description, content_markdown, category, author, published_at, citations')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error || !data) return []
  return data as NewsjackStory[]
}
