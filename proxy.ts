import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/auth";


// Protege las páginas /private/* y las APIs /api/* con la cookie de sesión.
// El login y el logout quedan públicos (si no, no podrías entrar).
export async function proxy(request: NextRequest){

  const { pathname } = request.nextUrl;

  if(pathname === "/api/login" || pathname === "/api/logout"){
    return NextResponse.next();
  }

  const token = request.cookies.get("session")?.value;
  const session = await verifySession(token);

  if(!session){

    if(pathname.startsWith("/api")){
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);

  }

  return NextResponse.next();

}


export const config = {
  matcher: ["/private/:path*", "/api/:path*"]
};
