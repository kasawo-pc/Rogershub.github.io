// Rogers Hub member authentication. Set the Supabase URL and publishable key below.
const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_PUBLISHABLE_KEY";
const configured = SUPABASE_URL.startsWith("https://") && !SUPABASE_URL.includes("YOUR_") && !SUPABASE_ANON_KEY.includes("YOUR_");
const statusEl = document.getElementById("status");
const showStatus = (message, isError=false) => { if(statusEl){statusEl.textContent=message;statusEl.style.color=isError?"#ff9b9b":"#65e0d2";} };
if(!configured) showStatus("Member accounts are not connected yet. Rogers Hub needs its Supabase project URL and publishable key.",true);
else if(!window.supabase) showStatus("The account library could not load. Refresh the page and try again.",true);
else {
  const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
  const signup=document.getElementById("signupForm"), login=document.getElementById("loginForm"), welcome=document.getElementById("welcome");
  if(signup) signup.addEventListener("submit",async e=>{
    e.preventDefault();showStatus("Creating account…");
    const name=document.getElementById("name").value.trim(), email=document.getElementById("email").value.trim(), password=document.getElementById("password").value;
    try{const {data,error}=await sb.auth.signUp({email,password,options:{data:{full_name:name},emailRedirectTo:location.origin+"/login.html"}});
      if(error)showStatus(error.message,true);else showStatus(data.session?"Account created. Opening member area…":"Account created. Check your email for a confirmation link before logging in.");
      if(data.session)location.href="member-dashboard.html";
    }catch{showStatus("Unable to create account right now. Please try again.",true);}
  });
  if(login) login.addEventListener("submit",async e=>{
    e.preventDefault();showStatus("Signing in…");
    try{const {data,error}=await sb.auth.signInWithPassword({email:document.getElementById("email").value.trim(),password:document.getElementById("password").value});
      if(error)showStatus(error.message,true);else if(data.session)location.href="member-dashboard.html";
    }catch{showStatus("Unable to sign in right now. Please try again.",true);}
  });
  if(welcome){
    sb.auth.getSession().then(({data,error})=>{if(error||!data.session){location.replace("login.html");return;}welcome.textContent="Welcome, "+(data.session.user.user_metadata?.full_name||data.session.user.email)+"!";}).catch(()=>location.replace("login.html"));
    const logout=document.getElementById("logoutBtn");if(logout)logout.addEventListener("click",async()=>{showStatus("Signing out…");const {error}=await sb.auth.signOut();if(error)showStatus(error.message,true);else location.replace("login.html");});
  }
}