// Rogers Hub email-code verification authentication.
const SUPABASE_URL = "https://kmdshraspqvmuqgmzigw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_gtYteZIQR0X3_ttYZZ0ZCw_F-TC2Qxd";
const configured = SUPABASE_URL.startsWith("https://") && !SUPABASE_URL.includes("YOUR_") && !SUPABASE_ANON_KEY.includes("YOUR_");
const statusEl = document.getElementById("status");
const showStatus = (message, isError=false) => { if(statusEl){statusEl.textContent=message;statusEl.style.color=isError?"#ff9b9b":"#65e0d2";} };
if(!configured) showStatus("Member accounts are not connected.",true);
else if(!window.supabase) showStatus("Account library failed to load. Refresh and try again.",true);
else {
 const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
 const signup=document.getElementById("signupForm"), login=document.getElementById("loginForm"), welcome=document.getElementById("welcome");
 const showCodeForm=(form,email,password,name,type)=>{
   form.innerHTML='<label>Email verification code</label><input id="otp" inputmode="numeric" autocomplete="one-time-code" required maxlength="8" placeholder="Enter code from email"><button>Verify email</button><button type="button" id="resendCode" style="background:#334">Resend code</button>';
   showStatus("A verification code was sent to "+email+". Check your inbox and spam folder.");
   form.onsubmit=async ev=>{ev.preventDefault();showStatus("Verifying code…");const {data,error}=await sb.auth.verifyOtp({email,token:document.getElementById("otp").value.trim(),type});
     if(error)showStatus(error.message,true);else if(data.session)location.href="member-dashboard.html";else showStatus("Email confirmed. You can now log in.");};
   document.getElementById("resendCode").onclick=async()=>{showStatus("Sending new code…");let result=type==="signup"?await sb.auth.resend({type:"signup",email}):await sb.auth.signInWithOtp({email,options:{shouldCreateUser:false}});if(result.error)showStatus(result.error.message,true);else showStatus("New code sent.");};
 };
 if(signup)signup.addEventListener("submit",async e=>{e.preventDefault();showStatus("Creating account…");const name=document.getElementById("name").value.trim(),email=document.getElementById("email").value.trim(),password=document.getElementById("password").value;
   try{const {data,error}=await sb.auth.signUp({email,password,options:{data:{full_name:name}}});if(error)showStatus(error.message,true);else if(data.session)location.href="member-dashboard.html";else showCodeForm(signup,email,password,name,"signup");}catch{showStatus("Signup failed. Please retry.",true);}
 });
 if(login)login.addEventListener("submit",async e=>{e.preventDefault();showStatus("Checking password…");const email=document.getElementById("email").value.trim(),password=document.getElementById("password").value;
   try{const {data,error}=await sb.auth.signInWithPassword({email,password});if(error)showStatus(error.message,true);else if(data.session){await sb.auth.signOut();const {error:otpError}=await sb.auth.signInWithOtp({email,options:{shouldCreateUser:false}});if(otpError)showStatus(otpError.message,true);else showCodeForm(login,email,password,null,"email");}}catch{showStatus("Unable to sign in. Please retry.",true);}
 });
 if(welcome){sb.auth.getSession().then(({data,error})=>{if(error||!data.session){location.replace("login.html");return;}welcome.textContent="Welcome, "+(data.session.user.user_metadata?.full_name||data.session.user.email)+"!";}).catch(()=>location.replace("login.html"));const logout=document.getElementById("logoutBtn");if(logout)logout.addEventListener("click",async()=>{showStatus("Signing out…");const {error}=await sb.auth.signOut();if(error)showStatus(error.message,true);else location.replace("login.html");});}
}