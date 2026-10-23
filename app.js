(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const KEYS = {history:"nlbd_history_v2",reports:"nlbd_reports",theme:"nlbd_theme",language:"nlbd_language"};
  const digitsOnly = (value) => String(value || "").replace(/[^0-9]/g, "");
  let lastResult = null, batchResults = [], installPrompt = null;

  const translations = {
    bn:{privacyDemo:"Privacy-first",eyebrow:"BANGLADESH NUMBER TOOLS",headline:'NUMBER_LOOKUP <span>BD</span>',heroCopy:"মোবাইল নম্বরের ফরম্যাট ও সম্ভাব্য অপারেটর-রেঞ্জ দেখুন। আপনার সার্চ হিস্ট্রি ও রিপোর্ট এই ব্রাউজারেই থাকে.",phoneLabel:"ENTER MOBILE NUMBER",lookup:"নম্বর যাচাই",localHint:"আপনার নম্বর সার্ভারে পাঠানো হচ্ছে না।",trust1:"✓ ফরম্যাট যাচাই",trust2:"✓ মালিকের নাম নয়",trust3:"✓ ব্রাউজারেই পরীক্ষা",metricSearches:"মোট লোকাল সার্চ",storedOnly:"এই ব্রাউজারে সংরক্ষিত",metricReports:"লোকাল রিপোর্ট",reportOnly:"শুধু আপনার ডিভাইসে",metricValid:"সঠিক ফরম্যাট",historyOnly:"হিস্ট্রি থেকে গণনা",resultTitle:"নম্বর বিশ্লেষণ",format:"ফরম্যাট",operator:"সম্ভাব্য রেঞ্জ",spamReports:"লোকাল স্প্যাম রিপোর্ট",copyResult:"ফলাফল কপি",exportResult:"JSON ডাউনলোড",featuresTitle:"কী তথ্য পাওয়া যাবে?",feature1Title:"নম্বর ফরম্যাট",feature1Copy:"বাংলাদেশি মোবাইল নম্বরের গঠন ও দৈর্ঘ্য যাচাই।",feature2Title:"সম্ভাব্য অপারেটর রেঞ্জ",feature2Copy:"প্রিফিক্সভিত্তিক আনুমানিক তথ্য। পোর্ট করা নম্বরে অপারেটর ভিন্ন হতে পারে।",feature3Title:"স্প্যাম রিপোর্ট",feature3Copy:"লোকাল রিপোর্ট আপনার ব্রাউজারেই থাকবে; সবার সঙ্গে শেয়ার হবে না।",batchTitle:"একাধিক নম্বর যাচাই",batchCopy:"প্রতি লাইনে একটি নম্বর লিখুন অথবা TXT/CSV ফাইল ইমপোর্ট করুন। যাচাই শুধু আপনার ব্রাউজারেই হবে।",importFile:"TXT/CSV ইমপোর্ট",runBatch:"সব নম্বর যাচাই",exportCsv:"CSV এক্সপোর্ট",thNumber:"নম্বর",thFormat:"ফরম্যাট",thOperator:"সম্ভাব্য রেঞ্জ",batchEmpty:"এখনও কোনো ব্যাচ চালানো হয়নি।",historyTitle:"সার্চ হিস্ট্রি",exportJson:"JSON এক্সপোর্ট",clearHistory:"হিস্ট্রি মুছুন",thDate:"তারিখ",thStatus:"স্ট্যাটাস",thAction:"অ্যাকশন",reportTitle:"সন্দেহজনক কল পেয়েছেন?",reportCopy:"নিজের অভিজ্ঞতা লোকালি নোট করুন। যাচাই ছাড়া কাউকে প্রতারক হিসেবে চিহ্নিত করবেন না।",reportTypeLabel:"রিপোর্টের ধরন",detailsLabel:"সংক্ষিপ্ত বিবরণ <span>(ঐচ্ছিক)</span>",saveReport:"ব্রাউজারে রিপোর্ট সংরক্ষণ করুন",reportManageTitle:"আপনার লোকাল রিপোর্ট",clearReports:"সব রিপোর্ট মুছুন",thType:"ধরন",privacyTitle:"আপনার ডেটা, আপনার নিয়ন্ত্রণে",privacyCopy:"সার্চ হিস্ট্রি, রিপোর্ট ও পছন্দ এই ব্রাউজারের localStorage-এ থাকে। অন্য ডিভাইসে সিঙ্ক হয় না।",backup:"সব ডেটার JSON ব্যাকআপ",restore:"JSON ব্যাকআপ রিস্টোর",clearAll:"সব লোকাল ডেটা মুছুন",limitTitle:"গুরুত্বপূর্ণ সীমাবদ্ধতা",limitCopy:"এই টুল নম্বরের গঠন ও প্রিফিক্স অনুমান করে। এটি কোনো ব্যক্তির নাম, NID, SIM নিবন্ধন, কল/SMS ইতিহাস, অবস্থান বা লাইভ অপারেটর শনাক্ত করে না। লোকাল রিপোর্ট অন্য ব্যবহারকারীদের কাছে যায় না।",footerCopy:"তথ্যভিত্তিক ব্যবহার করুন · ব্যক্তিগত গোপনীয়তাকে সম্মান করুন"},
    en:{privacyDemo:"Privacy-first",eyebrow:"BANGLADESH NUMBER TOOLS",headline:'NUMBER_LOOKUP <span>BD</span>',heroCopy:"Check a Bangladesh mobile number's format and estimated prefix range. Search history and reports stay in this browser.",phoneLabel:"ENTER MOBILE NUMBER",lookup:"Check number",localHint:"Your number is not sent to a server.",trust1:"✓ Format validation",trust2:"✓ No subscriber names",trust3:"✓ Checked in browser",metricSearches:"Local searches",storedOnly:"Stored in this browser",metricReports:"Local reports",reportOnly:"Only on this device",metricValid:"Valid formats",historyOnly:"Counted from history",resultTitle:"Number analysis",format:"Format",operator:"Estimated range",spamReports:"Local spam reports",copyResult:"Copy result",exportResult:"Download JSON",featuresTitle:"What can you check?",feature1Title:"Number format",feature1Copy:"Validate the structure and length of Bangladesh mobile numbers.",feature2Title:"Estimated operator range",feature2Copy:"Prefix-based estimate only. Ported numbers may use another operator.",feature3Title:"Spam reports",feature3Copy:"Reports stay in your browser and are not shared with everyone.",batchTitle:"Batch number validation",batchCopy:"Enter one number per line or import a TXT/CSV file. Validation runs in your browser.",importFile:"Import TXT/CSV",runBatch:"Validate all",exportCsv:"Export CSV",thNumber:"Number",thFormat:"Format",thOperator:"Estimated range",batchEmpty:"No batch has been run yet.",historyTitle:"Search history",exportJson:"Export JSON",clearHistory:"Clear history",thDate:"Date",thStatus:"Status",thAction:"Action",reportTitle:"Received a suspicious call?",reportCopy:"Save your experience locally. Do not label anyone a scammer without verification.",reportTypeLabel:"Report type",detailsLabel:"Short details <span>(optional)</span>",saveReport:"Save report in browser",reportManageTitle:"Your local reports",clearReports:"Clear reports",thType:"Type",privacyTitle:"Your data, your control",privacyCopy:"Search history, reports, and preferences are stored in this browser's localStorage. They are not synced across devices.",backup:"Back up all data as JSON",restore:"Restore JSON backup",clearAll:"Delete all local data",limitTitle:"Important limitations",limitCopy:"This tool estimates number format and prefix only. It does not identify a person, NID, SIM registration, call/SMS history, location, or live operator. Local reports are not shared with other users.",footerCopy:"Use information responsibly · Respect personal privacy"}
  };

  function normalize(raw) {
    let d = digitsOnly(raw);
    if (d.startsWith("00880")) d = d.slice(2);
    if (d.startsWith("880")) d = d.slice(3);
    if (d.length === 10 && d.startsWith("1")) d = "0" + d;
    return d;
  }
  function validate(raw) {
    const number = normalize(raw), valid = /^01[3-9]\d{8}$/.test(number);
    return {number, valid, formatted: valid ? "+880 " + number.slice(1,5) + "-" + number.slice(5,8) + "-" + number.slice(8) : ""};
  }
  function rangeInfo(number) {
    const p = number.slice(0,3);
    const ranges = {"013":"Grameenphone (013)","017":"Grameenphone (017)","014":"Banglalink (014)","019":"Banglalink (019)","015":"Teletalk (015)","016":"Airtel / Robi range (016)","018":"Robi (018)"};
    return ranges[p] || (document.documentElement.lang === "en" ? "Unknown / verify prefix" : "অজানা / যাচাই প্রয়োজন");
  }
  function read(key) { try { const v=JSON.parse(localStorage.getItem(key)||"[]"); return Array.isArray(v)?v:[]; } catch (_) { return []; } }
  function write(key,value) { localStorage.setItem(key,JSON.stringify(value)); }
  function reportsFor(number) { return read(KEYS.reports).filter(r=>r.number===number); }
  function safeText(value) { return String(value ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
  function dateLabel(value) { try { return new Date(value).toLocaleString(document.documentElement.lang==="en"?"en-GB":"bn-BD"); } catch (_) { return String(value||""); } }
  function download(name,content,type="application/json") {
    const blob = new Blob([content],{type:type+";charset=utf-8"}), url=URL.createObjectURL(blob), a=document.createElement("a");
    a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function csvCell(value) { return '"' + String(value ?? "").replace(/"/g,'""') + '"'; }
  function exportCsv(name,rows) { const csv="\uFEFF"+rows.map(row=>row.map(csvCell).join(",")).join("\r\n"); download(name,csv,"text/csv"); }
  function saveHistory(item) { const arr=read(KEYS.history); arr.unshift(item); write(KEYS.history,arr.slice(0,100)); }
  function lookup(raw, shouldSave=true) {
    const terminal=$("terminalStatus"), scanState=$("scanState"), scanCaption=$("scanCaption"), scanProgress=document.querySelector(".scan-progress");
    const logAnalyze=$("logAnalyze"), logComplete=$("logComplete"), logInit=$("logInit"), logRules=$("logRules");
    if(terminal) terminal.textContent="SCANNING";
    if(scanState){scanState.textContent="SCANNING";scanState.classList.remove("complete");}
    if(scanCaption)scanCaption.textContent="VALIDATING NUMBER FORMAT...";
    if(scanProgress){scanProgress.classList.add("is-scanning");scanProgress.classList.remove("is-complete");}
    const logBox=document.querySelector(".terminal-log");
    if(logAnalyze) logAnalyze.textContent="> VALIDATING INPUT..."; if(logComplete) logComplete.textContent="> CHECKING LOCAL RULES...";
    if(logBox) logBox.classList.add("is-scanning");
    const checked=validate(raw), error=$("error");
    error.hidden=true;
    $("resultPreview").hidden=false;
    if (!String(raw||"").trim()) { if(terminal)terminal.textContent="WAITING";if(scanState)scanState.textContent="STANDBY";if(scanCaption)scanCaption.textContent="READY FOR INPUT · LOCAL SCAN ONLY";if(scanProgress){scanProgress.classList.remove("is-scanning","is-complete");}if(logBox)logBox.classList.remove("is-scanning");error.textContent=document.documentElement.lang==="en"?"Enter a mobile number first.":"প্রথমে একটি মোবাইল নম্বর লিখুন।";error.hidden=false;$("result").hidden=true;return null; }
    if (!checked.valid) { if(terminal)terminal.textContent="INVALID INPUT";if(scanState)scanState.textContent="INVALID";if(scanCaption)scanCaption.textContent="FORMAT CHECK FAILED · TRY AGAIN";if(scanProgress){scanProgress.classList.remove("is-scanning","is-complete");}if(logBox)logBox.classList.remove("is-scanning");if(logAnalyze)logAnalyze.textContent="> FORMAT CHECK FAILED";error.textContent=document.documentElement.lang==="en"?"Enter a valid Bangladesh mobile number, e.g. 01712345678.":"সঠিক বাংলাদেশি মোবাইল নম্বর দিন। উদাহরণ: 01712345678 বা +8801712345678";error.hidden=false;$("result").hidden=true;return null; }
    const item={number:checked.number,formatted:checked.formatted,valid:true,operator:rangeInfo(checked.number),createdAt:new Date().toISOString()};
    lastResult=item; if(terminal)terminal.textContent="COMPLETE";if(scanState){scanState.textContent="RESULT FOUND";scanState.classList.add("complete");}if(scanCaption)scanCaption.textContent="LOCAL FORMAT SCAN COMPLETE";if(scanProgress){scanProgress.classList.remove("is-scanning");scanProgress.classList.add("is-complete");}if(logBox)logBox.classList.remove("is-scanning");if(logInit)logInit.textContent="> INPUT RECEIVED";if(logRules)logRules.textContent="> PREFIX RULES LOADED";if(logAnalyze)logAnalyze.textContent="> FORMAT: VALID";if(logComplete)logComplete.textContent="> LIVE DATA NOT QUERIED";
    $("formattedNumber").textContent=item.formatted;$("validBadge").textContent=document.documentElement.lang==="en"?"Valid format":"ফরম্যাট সঠিক";
    $("formatValue").textContent=document.documentElement.lang==="en"?"Bangladesh mobile · valid structure":"বাংলাদেশি মোবাইল · বৈধ গঠন";
    $("operatorValue").textContent=item.operator;
    const n=reportsFor(item.number).length;$("spamValue").textContent=n?(document.documentElement.lang==="en"?n+" local report(s)":n+"টি লোকাল রিপোর্ট"):(document.documentElement.lang==="en"?"No local reports":"কোনো লোকাল রিপোর্ট নেই");
    $("resultNote").textContent=document.documentElement.lang==="en"?"This checks format and prefix only. No live database was queried. Operator estimates may be wrong due to mobile number portability. Local reports are unverified and visible only in this browser.":"এটি শুধু নম্বরের গঠন ও প্রিফিক্স পরীক্ষা। কোনো লাইভ ডেটাবেসে অনুসন্ধান করা হয়নি। অপারেটর অনুমান নম্বর পোর্টেবিলিটির কারণে ভুল হতে পারে। রিপোর্ট যাচাইকৃত নয় এবং শুধু এই ব্রাউজারে দেখা যায়।";
    $("resultPreview").hidden=true;
    $("result").hidden=false;
    if(shouldSave){saveHistory(item);renderAll();}
    return item;
  }
  function renderHistory() {
    const filter=normalize($("historyFilter").value), all=read(KEYS.history), rows=all.map((x,i)=>({...x,_index:i})).filter(x=>!filter||x.number.includes(filter));
    $("historyRows").innerHTML=rows.length?rows.map((x)=>'<tr><td>'+safeText(x.formatted||x.number)+'</td><td>'+safeText(dateLabel(x.createdAt))+'</td><td>'+safeText(x.valid?(document.documentElement.lang==="en"?"Valid":"সঠিক"):(document.documentElement.lang==="en"?"Invalid":"ভুল"))+'</td><td><button class="table-action" data-history-lookup="'+safeText(x.number)+'">'+(document.documentElement.lang==="en"?"Check":"দেখুন")+'</button> <button class="table-action" data-history-delete="'+x._index+'">'+(document.documentElement.lang==="en"?"Delete":"মুছুন")+'</button></td></tr>').join(""):'<tr><td colspan="4" class="empty-cell">'+(document.documentElement.lang==="en"?"No matching history.":"কোনো হিস্ট্রি নেই।")+'</td></tr>';
  }
  function renderReports() {
    const filter=$("reportFilter").value.trim().toLowerCase(), all=read(KEYS.reports), numberFilter=normalize(filter);
    const rows=all.map((x,i)=>({...x,_index:i})).filter(x=>!filter||(numberFilter && (x.number||"").includes(numberFilter))||(x.type||"").toLowerCase().includes(filter)||(x.details||"").toLowerCase().includes(filter));
    $("reportRows").innerHTML=rows.length?rows.map(x=>'<tr><td>'+safeText(x.number)+'</td><td>'+safeText(x.type)+'</td><td>'+safeText(dateLabel(x.createdAt))+'</td><td><button class="table-action" data-report-delete="'+x._index+'">'+(document.documentElement.lang==="en"?"Delete":"মুছুন")+'</button></td></tr>').join(""):'<tr><td colspan="4" class="empty-cell">'+(document.documentElement.lang==="en"?"No matching reports.":"কোনো রিপোর্ট নেই।")+'</td></tr>';
  }
  let miniPeriod = "all";
  function renderMiniHistory() {
    const target=$("miniHistoryRows");
    if(!target) return;
    const q=normalize($("miniHistoryFilter").value);
    const now=Date.now(), dayStart=new Date(); dayStart.setHours(0,0,0,0);
    const list=read(KEYS.history).filter(x=>{
      const ts=Date.parse(x.createdAt||"");
      const periodOk=miniPeriod==="today" ? ts>=dayStart.getTime() : miniPeriod==="week" ? ts>=now-7*24*60*60*1000 : true;
      return periodOk && (!q || String(x.number||"").includes(q));
    }).slice(0,8);
    target.innerHTML=list.length?list.map(x=>'<article class="mini-history-entry"><span>◉</span><div><b>'+safeText(x.formatted||x.number)+'</b><small>'+safeText(x.operator||"Format check")+'</small><time>'+safeText(dateLabel(x.createdAt))+'</time></div></article>').join(""):'<p class="mini-empty">NO MATCHING LOCAL HISTORY</p>';
  }
  function renderAll() {
    const history=read(KEYS.history), reports=read(KEYS.reports);
    $("metricSearches").textContent=history.length;$("metricReports").textContent=reports.length;$("metricValid").textContent=history.filter(x=>x.valid).length;
    renderHistory();renderReports();renderMiniHistory();
  }
  function runBatch(values) {
    const unique=values.map(v=>String(v).trim()).filter(Boolean).slice(0,500);
    batchResults=unique.map(raw=>{const v=validate(raw);return {input:raw,number:v.number,formatted:v.formatted,valid:v.valid,operator:v.valid?rangeInfo(v.number):"—"};});
    $("batchResults").innerHTML=batchResults.length?batchResults.map(x=>'<tr><td>'+safeText(x.formatted||x.input)+'</td><td>'+safeText(x.operator)+'</td><td><span class="batch-status '+(x.valid?'is-valid':'is-invalid')+'">'+safeText(x.valid?(document.documentElement.lang==="en"?"VALID":"সঠিক"):(document.documentElement.lang==="en"?"INVALID":"ভুল"))+'</span></td></tr>').join(""):'<tr><td colspan="3" class="empty-cell">কোনো নম্বর পাওয়া যায়নি।</td></tr>';
    $("batchTotalCount").textContent=batchResults.length;
    $("batchValidCount").textContent=batchResults.filter(x=>x.valid).length;
    $("batchInvalidCount").textContent=batchResults.filter(x=>!x.valid).length;
    $("batchExportBtn").disabled=!batchResults.length;
    $("batchMessage").textContent=document.documentElement.lang==="en"?batchResults.length+" number(s) checked locally.":"লোকালভাবে "+batchResults.length+"টি নম্বর যাচাই করা হয়েছে।";
  }
  function applyLanguage(lang) {
    document.documentElement.lang=lang;localStorage.setItem(KEYS.language,lang);
    document.querySelectorAll("[data-i18n]").forEach(el=>{const val=translations[lang][el.dataset.i18n];if(val!==undefined)el.innerHTML=val;});
    $("languageBtn").textContent=lang==="bn"?"EN":"বাং";
    $("phone").placeholder=lang==="en"?"01XXXXXXXXX or +8801XXXXXXXXX":"01XXXXXXXXX বা +8801XXXXXXXXX";
    $("historyFilter").placeholder=lang==="en"?"Search by number…":"নম্বর দিয়ে খুঁজুন…";
    $("reportFilter").placeholder=lang==="en"?"Search number or report type…":"নম্বর বা রিপোর্টের ধরন দিয়ে খুঁজুন…";
    renderAll();
  }
  function applyTheme(theme) { document.documentElement.dataset.theme=theme;localStorage.setItem(KEYS.theme,theme);$("themeBtn").textContent=theme==="dark"?"☼":"☾"; }
  function askConfirm(message) { return window.confirm(message); }


  function isMobileLayout(){return window.matchMedia("(max-width: 700px)").matches;}
  function setMobileView(view,panel=""){
    document.body.dataset.activeView=view;
    if(view==="lookup" && panel) document.body.dataset.lookupPanel=panel; else delete document.body.dataset.lookupPanel;
    if(view==="tools" && panel) document.body.dataset.toolsPanel=panel; else delete document.body.dataset.toolsPanel;
    document.querySelectorAll("[data-nav-view]").forEach(link=>link.classList.toggle("active",link.dataset.navView===view));
    if(isMobileLayout()) window.scrollTo({top:0,behavior:"auto"});
  }
  function ensureToolBackButton(selector){
    const target=document.querySelector(selector);
    if(!target||target.querySelector("[data-return-tools]"))return;
    const button=document.createElement("button");
    button.type="button";button.className="back-to-tools";button.dataset.returnTools="";
    button.textContent="← ALL TOOLS";
    target.insertBefore(button,target.firstChild);
  }
  ensureToolBackButton("#reportsManagement");
  ensureToolBackButton("#reportCreation");
  ensureToolBackButton("#locationMapPanel");
  document.querySelectorAll("[data-nav-view]").forEach(link=>link.addEventListener("click",event=>{
    if(isMobileLayout()){event.preventDefault();setMobileView(link.dataset.navView);}
    else{document.querySelectorAll("[data-nav-view]").forEach(item=>item.classList.toggle("active",item===link));}
  }));
  document.querySelectorAll("[data-return-tools]").forEach(button=>button.addEventListener("click",()=>setMobileView("tools")));
  document.querySelectorAll("[data-tool-action]").forEach(button=>button.addEventListener("click",()=>{
    const action=button.dataset.toolAction;
    if(action==="batch"){setMobileView("tools","batch");}
    if(action==="csv"){
      setMobileView("tools","batch");
      $("batchMessage").textContent=document.documentElement.lang==="en"?"Run batch validation first, then use Export CSV.":"প্রথমে ব্যাচ যাচাই করুন, তারপর CSV এক্সপোর্ট চাপুন।";
    }
    if(action==="reports")setMobileView("tools","reports");
    if(action==="reportform")setMobileView("tools","reportform");
    if(action==="map")setMobileView("tools","map");
    if(action==="extra"){setMobileView("lookup","extra");$("result").hidden= !lastResult;$("resultPreview").hidden=!!lastResult;}
    if(action==="backup")$("backupBtn").click();
    if(action==="restore")$("restoreFile").click();
  }));
  $("openTerminalBtn").addEventListener("click",()=>setMobileView("lookup","terminal"));
  if(isMobileLayout())setMobileView("lookup");
  window.addEventListener("resize",()=>{
    if(!isMobileLayout()){
      delete document.body.dataset.activeView;
      delete document.body.dataset.lookupPanel;
      delete document.body.dataset.toolsPanel;
      document.querySelectorAll("[data-nav-view]").forEach(link=>link.classList.toggle("active",link.dataset.navView==="lookup"));
    }else if(!document.body.dataset.activeView)setMobileView("lookup");
  });

  $("lookupBtn").addEventListener("click",()=>lookup($("phone").value));
  $("phone").addEventListener("keydown",e=>{if(e.key==="Enter")lookup($("phone").value);});
  $("copyResultBtn").addEventListener("click",async()=>{if(!lastResult)return;const textOut=JSON.stringify({...lastResult,localReports:reportsFor(lastResult.number).length},null,2);try{await navigator.clipboard.writeText(textOut);$("resultNote").textContent=document.documentElement.lang==="en"?"Result copied to clipboard.":"ফলাফল কপি হয়েছে।";}catch(_){download("number-result.json",textOut);}});
  $("exportResultBtn").addEventListener("click",()=>{if(lastResult)download("number-result.json",JSON.stringify({...lastResult,localReports:reportsFor(lastResult.number).length},null,2));});
  $("reportForm").addEventListener("submit",e=>{e.preventDefault();const checked=validate($("reportPhone").value);if(!checked.valid){$("reportMessage").textContent=document.documentElement.lang==="en"?"Enter a valid Bangladesh mobile number.":"সঠিক বাংলাদেশি মোবাইল নম্বর দিন।";return;}const reports=read(KEYS.reports);reports.push({id:Date.now()+"-"+Math.random().toString(36).slice(2,7),number:checked.number,type:$("reportType").value,details:$("reportDetails").value.trim().slice(0,240),createdAt:new Date().toISOString()});try{write(KEYS.reports,reports.slice(-500));$("reportMessage").textContent=document.documentElement.lang==="en"?"Saved only in this browser; not publicly shared.":"রিপোর্ট শুধু এই ব্রাউজারে সংরক্ষিত হয়েছে; পাবলিক নয়।";$("reportForm").reset();renderAll();}catch(_){$("reportMessage").textContent="ব্রাউজার স্টোরেজে সংরক্ষণ করা যায়নি।";}});
  $("historyFilter").addEventListener("input",renderHistory);$("reportFilter").addEventListener("input",renderReports);
  $("miniHistoryFilter").addEventListener("input",renderMiniHistory);
  document.querySelectorAll("[data-mini-period]").forEach(btn=>btn.addEventListener("click",()=>{miniPeriod=btn.dataset.miniPeriod;document.querySelectorAll("[data-mini-period]").forEach(b=>b.classList.toggle("active",b===btn));renderMiniHistory();}));
  $("miniClearHistoryBtn").addEventListener("click",()=>{if(askConfirm("সার্চ হিস্ট্রি মুছে ফেলবেন?")){write(KEYS.history,[]);renderAll();}});
  $("historyRows").addEventListener("click",e=>{const lookupBtn=e.target.closest("[data-history-lookup]"),del=e.target.closest("[data-history-delete]");if(lookupBtn){$("phone").value=lookupBtn.dataset.historyLookup;lookup($("phone").value,false);if(isMobileLayout())setMobileView("lookup");$("result").scrollIntoView({behavior:"smooth",block:"nearest"});}if(del){const list=read(KEYS.history);list.splice(Number(del.dataset.historyDelete),1);write(KEYS.history,list);renderAll();}});
  $("reportRows").addEventListener("click",e=>{const del=e.target.closest("[data-report-delete]");if(!del)return;const list=read(KEYS.reports);list.splice(Number(del.dataset.reportDelete),1);write(KEYS.reports,list);renderAll();});
  $("clearHistoryBtn").addEventListener("click",()=>{if(askConfirm("সার্চ হিস্ট্রি মুছে ফেলবেন?")){write(KEYS.history,[]);renderAll();}});
  $("clearReportsBtn").addEventListener("click",()=>{if(askConfirm("সব লোকাল রিপোর্ট মুছে ফেলবেন?")){write(KEYS.reports,[]);renderAll();}});
  $("exportHistoryBtn").addEventListener("click",()=>download("number-lookup-history.json",JSON.stringify(read(KEYS.history),null,2)));
  $("exportReportsBtn").addEventListener("click",()=>exportCsv("number-lookup-reports.csv",[["number","type","details","createdAt"],...read(KEYS.reports).map(x=>[x.number,x.type,x.details,x.createdAt])]));
  $("batchRunBtn").addEventListener("click",()=>{runBatch($("batchInput").value.split(/[\n\r,;\t]+/));if(isMobileLayout())setMobileView("tools","batchResults");});
  document.querySelectorAll("[data-new-batch]").forEach(button=>button.addEventListener("click",()=>setMobileView("tools","batch")));
  $("batchExportBtn").addEventListener("click",()=>exportCsv("number-lookup-batch.csv",[["input","normalized_number","valid_format","estimated_operator"],...batchResults.map(x=>[x.input,x.number,x.valid?"yes":"no",x.operator])]));
  $("batchFile").addEventListener("change",async e=>{const file=e.target.files&&e.target.files[0];if(!file)return;try{$("batchInput").value=await file.text();$("batchMessage").textContent=file.name+" ইমপোর্ট হয়েছে।";}catch(_){$("batchMessage").textContent="ফাইলটি পড়া যায়নি।";}e.target.value="";});
  $("backupBtn").addEventListener("click",()=>{const data={app:"Number Lookup BD",version:2,exportedAt:new Date().toISOString(),history:read(KEYS.history),reports:read(KEYS.reports),preferences:{theme:localStorage.getItem(KEYS.theme)||"dark",language:localStorage.getItem(KEYS.language)||"bn"}};download("number-lookup-backup.json",JSON.stringify(data,null,2));$("privacyMessage").textContent="ব্যাকআপ ফাইল তৈরি হয়েছে। নিরাপদ জায়গায় রাখুন।";});
  $("restoreFile").addEventListener("change",async e=>{const file=e.target.files&&e.target.files[0];if(!file)return;try{if(file.size>5*1024*1024)throw new Error("too-large");const data=JSON.parse(await file.text());if(!data||!Array.isArray(data.history)||!Array.isArray(data.reports))throw new Error("invalid");if(data.app&&data.app!=="Number Lookup BD")throw new Error("wrong-app");const cleanHistory=data.history.filter(x=>x&&typeof x==="object"&&typeof x.number==="string"&&/^01[3-9]\d{8}$/.test(x.number)).map(x=>({number:x.number,formatted:"+880 "+x.number.slice(1,5)+"-"+x.number.slice(5,8)+"-"+x.number.slice(8),valid:true,operator:rangeInfo(x.number),createdAt:typeof x.createdAt==="string"&&!Number.isNaN(Date.parse(x.createdAt))?x.createdAt:new Date().toISOString()})).slice(0,100);const cleanReports=data.reports.filter(x=>x&&typeof x==="object"&&typeof x.number==="string"&&/^01[3-9]\d{8}$/.test(x.number)&&typeof x.type==="string").map(x=>({id:typeof x.id==="string"?x.id:Date.now()+"-"+Math.random().toString(36).slice(2,7),number:x.number,type:x.type.slice(0,100),details:typeof x.details==="string"?x.details.slice(0,240):"",createdAt:typeof x.createdAt==="string"&&!Number.isNaN(Date.parse(x.createdAt))?x.createdAt:new Date().toISOString()})).slice(-500);if(!askConfirm("ব্যাকআপের বৈধ হিস্ট্রি ও রিপোর্ট বর্তমান লোকাল ডেটার সঙ্গে যোগ করবেন?"))return;write(KEYS.history,[...cleanHistory,...read(KEYS.history)].slice(0,100));write(KEYS.reports,[...cleanReports,...read(KEYS.reports)].slice(-500));if(data.preferences){if(["dark","light"].includes(data.preferences.theme))applyTheme(data.preferences.theme);if(["bn","en"].includes(data.preferences.language))applyLanguage(data.preferences.language);}renderAll();$("privacyMessage").textContent="ব্যাকআপ রিস্টোর হয়েছে। অবৈধ রেকর্ড বাদ দেওয়া হয়েছে।";}catch(_){$("privacyMessage").textContent="ব্যাকআপ ফাইলটি সঠিক ফরম্যাটে নেই, অন্য অ্যাপের, অথবা ৫ MB-এর বেশি।";}finally{e.target.value="";}});
  $("clearAllBtn").addEventListener("click",()=>{if(askConfirm("সার্চ হিস্ট্রি, রিপোর্ট ও পছন্দসহ সব লোকাল ডেটা মুছে ফেলবেন? এই কাজ ফিরিয়ে নেওয়া যাবে না।")){Object.values(KEYS).forEach(k=>localStorage.removeItem(k));lastResult=null;renderAll();$("result").hidden=true;document.documentElement.lang="bn";document.documentElement.dataset.theme="dark";$("languageBtn").textContent="EN";$("themeBtn").textContent="☼";$("phone").placeholder="01XXXXXXXXX বা +8801XXXXXXXXX";$("historyFilter").placeholder="নম্বর দিয়ে খুঁজুন…";$("reportFilter").placeholder="নম্বর বা রিপোর্টের ধরন দিয়ে খুঁজুন…";document.querySelectorAll("[data-i18n]").forEach(el=>{const val=translations.bn[el.dataset.i18n];if(val!==undefined)el.innerHTML=val;});renderAll();$("privacyMessage").textContent="এই ওয়েব অ্যাপের লোকাল ডেটা ও পছন্দ মুছে ফেলা হয়েছে।";}});
  $("themeBtn").addEventListener("click",()=>applyTheme((localStorage.getItem(KEYS.theme)||"dark")==="dark"?"light":"dark"));
  $("languageBtn").addEventListener("click",()=>applyLanguage((localStorage.getItem(KEYS.language)||"bn")==="bn"?"en":"bn"));
  document.addEventListener("keydown",e=>{if(e.altKey&&e.key.toLowerCase()==="k"){e.preventDefault();$("phone").focus();}if(e.altKey&&e.key.toLowerCase()==="h"){e.preventDefault();$("historyFilter").focus();}if(e.altKey&&e.key.toLowerCase()==="b"){e.preventDefault();$("batchInput").focus();}});
  window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installPrompt=e;$("installBtn").hidden=false;});
  $("installBtn").addEventListener("click",async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$("installBtn").hidden=true;});
  if("serviceWorker" in navigator && /^https?:$/.test(location.protocol)){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));}
  applyTheme(localStorage.getItem(KEYS.theme)||"dark");applyLanguage(localStorage.getItem(KEYS.language)||"bn");renderAll();
})();