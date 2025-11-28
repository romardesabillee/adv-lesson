import { NextResponse } from 'next/server'

export function proxy(req) {

    let res = NextResponse.next()
    const isAuth = req.cookies.get('token')?.value

    const url = req.nextUrl.clone();
    if (!isAuth) {
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    return res
}

export const config = {
  matcher: ['/u/:path*'],
}