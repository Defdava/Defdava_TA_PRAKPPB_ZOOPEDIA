// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oidlzdozlailawmngruv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pZGx6ZG96bGFpbGF3bW5ncnV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MjE0NDIsImV4cCI6MjA3OTI5NzQ0Mn0.CHwIpDE8emycvBaRVbuqDXzmLJ43WSg0_VB70yy-Y94'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)