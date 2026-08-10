// Sesión firmada con HMAC-SHA256 usando Web Crypto (sin dependencias).
// El token = base64url(payload) + "." + base64url(firma HMAC).

const SECRET =
  process.env.AUTH_SECRET ||
  "aurelia-fallback-secret-cambiar-en-vercel";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const SESSION_DAYS = 7;
export const SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60;


function b64urlEncode(bytes: Uint8Array){
  let bin = "";
  for(const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin)
    .replace(/\+/g,"-")
    .replace(/\//g,"_")
    .replace(/=+$/,"");
}

function b64urlDecode(str: string){
  const norm = str.replace(/-/g,"+").replace(/_/g,"/");
  const bin = atob(norm);
  const bytes = new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function getKey(){
  return globalThis.crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign","verify"]
  );
}


export async function createSession(payload: Record<string, any>){
  const body = {
    ...payload,
    exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
  };
  const data = b64urlEncode(encoder.encode(JSON.stringify(body)));
  const key = await getKey();
  const sig = await globalThis.crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(data)
  );
  return `${data}.${b64urlEncode(new Uint8Array(sig))}`;
}


export async function verifySession(token: string | undefined | null){
  if(!token || !token.includes(".")) return null;
  const [data, sig] = token.split(".");
  try{
    const key = await getKey();
    const valid = await globalThis.crypto.subtle.verify(
      "HMAC",
      key,
      b64urlDecode(sig),
      encoder.encode(data)
    );
    if(!valid) return null;
    const payload = JSON.parse(decoder.decode(b64urlDecode(data)));
    if(payload.exp && Date.now() > payload.exp) return null;
    return payload;
  }catch{
    return null;
  }
}
