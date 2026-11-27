// Rogers Tech Hub — robust Supabase member auth
(() => {
 const URL="https://kmdshraspqvmuqgmzigw.supabase.co";
 const KEY="sb_publishable_gtYteZIQR0X3_ttYZZ0ZCw_F-TC2Qxd";
 const status=document.getElementById("status");
 const msg=(s,bad=false)=>{if(status){status.textContent=s;status.style.color=bad?"#ff9b9b":"#65e0d2";}};
 const nice=e=>{const x=e?.message||"Something went wrong.";if(/invalid login credentials/i.test(x))return "Incorrect email or password.";if(/email not confirmed/i.test(x))return "Verify your email using the code sent to your inbox.";if(/already registered|user already exists/i.test(x))return "This email already has an account. Please log in.";if(/rate limit|too many requests/i.test(x))return "Too many attempts. Wait a few minutes and try again.";if(/network|fetch/i.test(x))return "Network error. Check your internet and try again.";return x;};
 if(!window.supabase){msg("Authentication library failed to load. Refresh and retry.",true);return;}
 const sb=window.supabase.createClient(URL,KEY);
 const signup=document.getElementById("signupForm"),login=document.getElementById("loginForm"),welcome=document.getElementById("welcome");
 const goDash=()=>location.assign("member-dashboard.html");
 if(signup){
  signup.addEventListener("submit",async e=>{
   if(signup.dataset.stage==="verify")return;
   e.preventDefault();const name=document.getElementById("name")?.value.trim()||"",email=document.getElementById("email")?.value.trim(),password=document.getElementById("password")?.value;const btn=signup.querySelector('button[type="submit"],button:not([type])');if(!email||!password)return;if(password.length<8){msg("Password must be at least 8 characters.",true);return;}if(btn)btn.disabled=true;msg("Creating account…");
   try{const {data,error}=await sb.auth.signUp({email,password,options:{data:{full_name:name}}});if(error)throw error;if(data.session){goDash();return;}
    signup.dataset.stage="verify";signup.innerHTML='<p>Enter the verification code sent to <strong></strong>.</p><label for="otp">Email verification code</label><input id="otp" inputmode="numeric" autocomplete="one-time-code" maxlength="10" required><button id="verifyBtn" type="submit">Verify email</button><button id="resendCode" type="button">Resend code</button>';signup.querySelector("strong").textContent=email;
    signup.addEventListener("submit",async ev=>{ev.preventDefault();const verify=document.getElementById("verifyBtn"),token=document.getElementById("otp")?.value.trim();if(!token)return;verify.disabled=true;msg("Verifying email…");try{const {data,error}=await sb.auth.verifyOtp({email,token,type:"signup"});if(error)throw error;if(data.session)goDash();else msg("Email verified. You can now log in.");}catch(err){msg(nice(err),true);verify.disabled=false;}});
    document.getElementById("resendCode").addEventListener("click",async ev=>{const b=ev.currentTarget;b.disabled=true;msg("Resending verification code…");try{const {error}=await sb.auth.resend({type:"signup",email});if(error)throw error;msg("Code resent. Check your inbox and spam folder.");}catch(err){msg(nice(err),true);}finally{b.disabled=false;}});
    msg("Verification code sent. Check your inbox and spam folder.");
   }catch(err){msg(nice(err),true);if(btn)btn.disabled=false;}
  });
 }
 if(login){
  login.addEventListener("submit",async e=>{
   if(login.dataset.stage==="verify")return;
   e.preventDefault();const email=document.getElementById("email").value.trim(),password=document.getElementById("password").value,btn=login.querySelector("button");btn.disabled=true;msg("Checking password…");
   try{
    const {data,error}=await sb.auth.signInWithPassword({email,password});if(error)throw error;if(!data.session)throw new Error("Sign-in failed.");
    await sb.auth.signOut();msg("Password correct. Sending login verification code…");
    const {error:otpError}=await sb.auth.signInWithOtp({email,options:{shouldCreateUser:false}});if(otpError)throw otpError;
    login.dataset.stage="verify";login.innerHTML='<p>A verification code was sent to <strong></strong>.</p><label for="loginOtp">Email verification code</label><input id="loginOtp" inputmode="numeric" autocomplete="one-time-code" maxlength="10" required><button id="loginVerify" type="submit">Verify and log in</button><button id="loginResend" type="button">Resend code</button>';
    login.querySelector("strong").textContent=email;msg("Code sent. Check your inbox and spam folder.");
    login.addEventListener("submit",async ev=>{ev.preventDefault();const v=document.getElementById("loginVerify"),token=document.getElementById("loginOtp").value.trim();if(!token)return;v.disabled=true;msg("Verifying code…");try{const {data,error}=await sb.auth.verifyOtp({email,token,type:"email"});if(error)throw error;if(data.session)goDash();else msg("Verification did not create a session.",true);}catch(err){msg(nice(err),true);v.disabled=false;}},{once:true});
    document.getElementById("loginResend").addEventListener("click",async ev=>{const b=ev.currentTarget;b.disabled=true;msg("Resending code…");try{const {error}=await sb.auth.signInWithOtp({email,options:{shouldCreateUser:false}});if(error)throw error;msg("Code resent. Check your inbox.");}catch(err){msg(nice(err),true);}finally{b.disabled=false;}});
   }catch(err){msg(nice(err),true);btn.disabled=false;}
  });
  const forgot=document.getElementById("forgotPassword");if(forgot)forgot.addEventListener("click",async()=>{const email=document.getElementById("email").value.trim();if(!email){msg("Enter your email address first.",true);return;}forgot.disabled=true;msg("Sending password reset email…");try{const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin+"/login.html"});if(error)throw error;msg("Password reset email sent. Check your inbox and spam folder.");}catch(err){msg(nice(err),true);}finally{forgot.disabled=false;}});
 }
 if(welcome){sb.auth.getSession().then(({data,error})=>{if(error||!data.session){location.replace("login.html");return;}welcome.textContent="Welcome, "+(data.session.user.user_metadata?.full_name||data.session.user.email)+"!";}).catch(()=>location.replace("login.html"));const logout=document.getElementById("logoutBtn");if(logout)logout.addEventListener("click",async()=>{msg("Signing out…");const {error}=await sb.auth.signOut();if(error)msg(nice(error),true);else location.replace("login.html");});}
})();
