// Rogers Tech Hub authentication (Supabase Auth).
const SUPABASE_URL = "https://kmdshraspqvmuqgmzigw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_gtYteZIQR0X3_ttYZZ0ZCw_F-TC2Qxd";
const statusEl = document.getElementById("status");
const showStatus = (message, error=false) => { if(statusEl){statusEl.textContent=message;statusEl.style.color=error?"#ff9b9b":"#65e0d2";} };
const friendly = (e) => {
 const m=e?.message||"Something went wrong. Please try again.";
 if(/invalid login credentials/i.test(m)) return "Incorrect email or password. If you haven't verified your email, check your inbox.";
 if(/email not confirmed/i.test(m)) return "Please verify your email first. Check your inbox for the confirmation code.";
 if(/rate limit|too many requests/i.test(m)) return "Too many attempts. Please wait a few minutes and try again.";
 if(/network|fetch/i.test(m)) return "Connection error. Check your internet and retry.";
 return m;
};
if(!window.supabase) showStatus("Authentication library did not load. Check your internet and refresh.",true);
else {
 const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
 const signup=document.getElementById("signupForm"), login=document.getElementById("loginForm"), welcome=document.getElementById("welcome");
 if(signup) signup.addEventListener("submit",async e=>{
   e.preventDefault(); const name=document.getElementById("name").value.trim(), email=document.getElementById("email").value.trim(), password=document.getElementById("password").value;
   if(password.length<8){showStatus("Password must be at least 8 characters.",true);return;}
   const button=signup.querySelector("button");button.disabled=true;showStatus("Creating your account…");
   try{const {data,error}=await sb.auth.signUp({email,password,options:{data:{full_name:name}}});
     if(error) throw error;
     if(data.session){location.href="member-dashboard.html";return;}
     signup.innerHTML='<p>Please enter the email verification code sent to <strong>'+email.replace(/</g,"&lt;")+'</strong>.</p><label for="otp">Verification code</label><input id="otp" inputmode="numeric" autocomplete="one-time-code" maxlength="8" required><button type="submit">Verify email</button><button type="button" id="resendCode">Resend code</button>';
     showStatus("Verification code sent. Check your inbox and spam folder.");
     signup.onsubmit=async ev=>{ev.preventDefault();showStatus("Verifying…");const {data,error}=await sb.auth.verifyOtp({email,token:document.getElementById("otp").value.trim(),type:"signup"});if(error)showStatus(friendly(error),true);else if(data.session)location.href="member-dashboard.html";else showStatus("Email verified. Please log in.");};
     document.getElementById("resendCode").onclick=async()=>{showStatus("Sending code…");const {error}=await sb.auth.resend({type:"signup",email});if(error)showStatus(friendly(error),true);else showStatus("A new verification code has been sent.");};
   }catch(err){showStatus(friendly(err),true);button.disabled=false;}
 });
 if(login) login.addEventListener("submit",async e=>{
   e.preventDefault();const email=document.getElementById("email").value.trim(),password=document.getElementById("password").value;const button=login.querySelector("button");button.disabled=true;showStatus("Signing in…");
   try{const {data,error}=await sb.auth.signInWithPassword({email,password});if(error)throw error;if(data.session)location.href="member-dashboard.html";else showStatus("Signed in, but no session was returned.",true);}
   catch(err){showStatus(friendly(err),true);button.disabled=false;}
 });
 if(welcome){sb.auth.getSession().then(({data,error})=>{if(error||!data.session){location.replace("login.html");return;}welcome.textContent="Welcome, "+(data.session.user.user_metadata?.full_name||data.session.user.email)+"!";}).catch(()=>location.replace("login.html"));const logout=document.getElementById("logoutBtn");if(logout)logout.addEventListener("click",async()=>{showStatus("Signing out…");const {error}=await sb.auth.signOut();if(error)showStatus(friendly(error),true);else location.replace("login.html");});}
}
