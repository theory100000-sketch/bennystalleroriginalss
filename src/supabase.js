import { createClient } from '@supabase/supabase-js'

// 👇 AQUÍ VA LA URL
const supabaseUrl = 'https://jyhxutgxnplcpqxopcgj.supabase.co'

// 👇 AQUÍ VA LA CLAVE PUBLICABLE (LA DE ARRIBA EN TU FOTO)
const supabaseKey = 'sb_publishable_VIVFcxML718dbHqxLsdoDA_CXJjrwgr'

export const supabase = createClient(supabaseUrl, supabaseKey)