const crypto = require("node:crypto");
const COOKIE = "rh_admin_session";
const MAX_AGE = 8 * 60 * 60;
function safeEqual(a,b){const x=Buffer.from(String(a));const y=Buffer.from(String(b));return x.length===y.length&&crypto.timingSafeEqual(x,y)}
function sign(value,secret){return crypto.createHmac("sha256",secret).update(value).digest("base64url")}
module.exports = (req,res) => {
  if(req.method!=="POST"){res.setHeader("Allow","POST");return res.status(405).json({error:"Method not allowed."})}
  const origin=req.headers.origin;
  if(origin){try{if(new URL(origin).host!==req.headers.host)return res.status(403).json({error:"Request rejected."})}catch{return res.status(403).json({error:"Request rejected."})}}
  const {ADMIN_EMAIL,ADMIN_PASSWORD,ADMIN_SESSION_SECRET}=process.env;
  if(!ADMIN_EMAIL||!ADMIN_PASSWORD||!ADMIN_SESSION_SECRET)return res.status(503).json({error:"Admin login is not configured yet. Add the admin settings in Vercel."});
  const body=typeof req.body==="object"&&req.body?req.body:{};
  if(!safeEqual(String(body.email||"").trim().toLowerCase(),ADMIN_EMAIL.trim().toLowerCase())||!safeEqual(String(body.password||""),ADMIN_PASSWORD))return res.status(401).json({error:"Email or password is incorrect."});
  const payload=Buffer.from(JSON.stringify({exp:Date.now()+MAX_AGE*1000,role:"admin"})).toString("base64url");
  const token=payload+"."+sign(payload,ADMIN_SESSION_SECRET);
  res.setHeader("Set-Cookie",COOKIE+"="+token+"; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age="+MAX_AGE);
  return res.status(200).json({ok:true});
};