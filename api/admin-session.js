const crypto=require("node:crypto");
module.exports=(req,res)=>{
  if(req.method!=="GET"){res.setHeader("Allow","GET");return res.status(405).json({ok:false})}
  const secret=process.env.ADMIN_SESSION_SECRET;
  const raw=(req.headers.cookie||"").split(";").map(v=>v.trim()).find(v=>v.startsWith("rh_admin_session="));
  if(!secret||!raw)return res.status(401).json({ok:false});
  try{const token=decodeURIComponent(raw.slice("rh_admin_session=".length));const [payload,sig]=token.split(".");const expected=crypto.createHmac("sha256",secret).update(payload).digest("base64url");const a=Buffer.from(sig||"");const b=Buffer.from(expected);if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return res.status(401).json({ok:false});const data=JSON.parse(Buffer.from(payload,"base64url").toString());if(data.role!=="admin"||data.exp<Date.now())return res.status(401).json({ok:false});return res.status(200).json({ok:true})}catch{return res.status(401).json({ok:false})}
};