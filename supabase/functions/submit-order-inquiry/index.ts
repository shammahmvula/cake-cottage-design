import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limit: max 5 submissions per hour per IP
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_HOURS = 1

// Simple hash function for IP (privacy-preserving)
function hashIP(ip: string): string {
  let hash = 0
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash.toString(16)
}

// Validate and sanitize input
function validateInput(data: Record<string, unknown>): { valid: boolean; error?: string; sanitized?: Record<string, string | null> } {
  const { name, contact, cake_type, event_type, delivery_option, delivery_location, date_needed, additional_notes, honeypot } = data

  // Honeypot check - if filled, it's a bot
  if (honeypot && String(honeypot).trim() !== '') {
    console.log('Honeypot triggered - rejecting submission')
    return { valid: false, error: 'Invalid submission' }
  }

  // Required field checks
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' }
  }
  if (name.length > 100) {
    return { valid: false, error: 'Name must be less than 100 characters' }
  }

  if (!contact || typeof contact !== 'string' || contact.trim().length < 10) {
    return { valid: false, error: 'Contact must be at least 10 characters' }
  }
  if (contact.length > 50) {
    return { valid: false, error: 'Contact must be less than 50 characters' }
  }

  if (!cake_type || typeof cake_type !== 'string' || cake_type.trim().length === 0) {
    return { valid: false, error: 'Cake type is required' }
  }
  if (cake_type.length > 100) {
    return { valid: false, error: 'Cake type must be less than 100 characters' }
  }

  if (!date_needed || typeof date_needed !== 'string') {
    return { valid: false, error: 'Date needed is required' }
  }
  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date_needed)) {
    return { valid: false, error: 'Invalid date format' }
  }

  // Optional field validation
  if (event_type && (typeof event_type !== 'string' || event_type.length > 100)) {
    return { valid: false, error: 'Event type must be less than 100 characters' }
  }

  if (delivery_location && (typeof delivery_location !== 'string' || delivery_location.length > 200)) {
    return { valid: false, error: 'Delivery location must be less than 200 characters' }
  }

  if (additional_notes && (typeof additional_notes !== 'string' || additional_notes.length > 5000)) {
    return { valid: false, error: 'Additional notes must be less than 5000 characters' }
  }

  // Validate delivery_option
  const validDeliveryOptions = ['pickup', 'delivery']
  const sanitizedDeliveryOption = delivery_option && typeof delivery_option === 'string' 
    ? delivery_option.trim().toLowerCase() 
    : 'pickup'
  
  if (!validDeliveryOptions.includes(sanitizedDeliveryOption)) {
    return { valid: false, error: 'Invalid delivery option' }
  }

  // Return sanitized data
  return {
    valid: true,
    sanitized: {
      name: String(name).trim().substring(0, 100),
      contact: String(contact).trim().substring(0, 50),
      cake_type: String(cake_type).trim().substring(0, 100),
      event_type: event_type ? String(event_type).trim().substring(0, 100) : null,
      delivery_option: sanitizedDeliveryOption,
      delivery_location: delivery_location ? String(delivery_location).trim().substring(0, 200) : null,
      date_needed: String(date_needed).trim(),
      additional_notes: additional_notes ? String(additional_notes).trim().substring(0, 5000) : null,
    }
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
      || req.headers.get('x-real-ip') 
      || 'unknown'
    const ipHash = hashIP(clientIP)

    console.log(`Processing order inquiry from IP hash: ${ipHash}`)

    // Clean up old rate limit entries
    await supabase.rpc('cleanup_old_rate_limits')

    // Check rate limit
    const oneHourAgo = new Date(Date.now() - RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000).toISOString()
    const { data: rateLimitData, error: rateLimitError } = await supabase
      .from('submission_rate_limits')
      .select('id')
      .eq('ip_hash', ipHash)
      .gte('submitted_at', oneHourAgo)

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError)
    }

    const submissionCount = rateLimitData?.length || 0
    console.log(`IP ${ipHash} has ${submissionCount} submissions in the last hour`)

    if (submissionCount >= RATE_LIMIT_MAX) {
      console.log(`Rate limit exceeded for IP hash: ${ipHash}`)
      return new Response(JSON.stringify({ 
        error: 'Too many submissions. Please try again later.',
        rateLimited: true 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Parse and validate input
    const body = await req.json()
    const validation = validateInput(body)

    if (!validation.valid) {
      console.log(`Validation failed: ${validation.error}`)
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Insert the order inquiry
    const { data, error } = await supabase
      .from('order_inquiries')
      .insert([validation.sanitized])
      .select()
      .single()

    if (error) {
      console.error('Insert error:', error)
      return new Response(JSON.stringify({ error: 'Failed to submit inquiry' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Record this submission for rate limiting
    await supabase
      .from('submission_rate_limits')
      .insert([{ ip_hash: ipHash }])

    console.log(`Order inquiry submitted successfully: ${data.id}`)

    return new Response(JSON.stringify({ 
      success: true, 
      id: data.id,
      message: 'Inquiry submitted successfully' 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
