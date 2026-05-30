import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with cross-browser cookies.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = user?.email === 'admin@gmail.com';

  if (
    (!user || !isAdmin) &&
    !request.nextUrl.pathname.startsWith('/login')
  ) {
    // If no user, or user is not the designated admin, redirect to login
    // If they are logged in but not admin, sign them out first (optional, but handled safely via redirect here)
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    if (user && !isAdmin) {
      url.searchParams.set('error', 'NotAdmin');
    }
    return NextResponse.redirect(url);
  }

  if (user && isAdmin && request.nextUrl.pathname.startsWith('/login')) {
    // user is logged in, but trying to access login page
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
