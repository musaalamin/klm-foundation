import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://brisuzzdgzmlbmcqyini.supabase.co' 
const supabaseKey = 'sb_publishable_9GRHgDfSvaduWxGzSvmuCg_V3EO_9ss' 

export const supabase = createClient(supabaseUrl, supabaseKey)