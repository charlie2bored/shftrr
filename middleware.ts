import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Create new response with updated cookies
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect dashboard and quiz routes
  if ((request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/quiz')) && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // Require quiz completion before accessing dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard') && user) {
    const { data: assessmentData } = await supabase
      .from('user_assessments')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!assessmentData) {
      const url = request.nextUrl.clone()
      url.pathname = '/quiz'
      return NextResponse.redirect(url)
    }
  }

  // Redirect authenticated users away from auth pages
  if (request.nextUrl.pathname.startsWith('/auth') && user) {
    // Check if user has completed the assessment
    const { data: assessmentData } = await supabase
      .from('user_assessments')
      .select('id')
      .eq('user_id', user.id)
      .single()

    const url = request.nextUrl.clone()
    if (!assessmentData) {
      url.pathname = '/quiz' // Redirect to quiz if not completed
    } else {
      url.pathname = '/dashboard' // Redirect to dashboard if quiz completed
    }
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
