/* ===== Scheme tab interactives ===== */
(function(){
const $=s=>document.querySelector(s);
/* route finder */
const Q=[["cash","Is the consideration paid in cash?",["No, in shares","Yes, cash"]],
 ["biz","Is a whole business (undertaking) moving, rather than shares of a company?",["Shares of a company","A business undertaking"]],
 ["ft","Is it a holding company with its 100% subsidiary, or two small companies?",["No","Yes"]],
 ["thr","Would someone cross a takeover threshold (25%, or more than 5% a year above that)?",["No","Yes"]],
 ["bind","Do you need it binding on all holders and tax-neutral?",["Not essential","Yes, essential"]]];
const ans={cash:0,biz:0,ft:0,thr:1,bind:1};
function rfRender(){$('#rf').innerHTML=Q.map(([k,q,o])=>`<div class="rfq"><div class="qt">${q}</div><div class="opts btns">${o.map((t,i)=>`<button class="btn" data-k="${k}" data-v="${i}" aria-pressed="${ans[k]===i}">${t}</button>`).join('')}</div></div>`).join('');
 $('#rf').querySelectorAll('button').forEach(b=>b.onclick=()=>{ans[b.dataset.k]=+b.dataset.v;rfRender()});rfDecide()}
function rfDecide(){let r,why;
 if(ans.cash){if(ans.biz){r='Slump sale (or a business transfer agreement)';why='Cash for a whole undertaking. Simple and quick, but taxable for the seller.'}
  else{r='Share purchase agreement'+(ans.thr?' + mandatory open offer':'');why='Cash for shares. Fast, but the seller pays capital gains tax'+(ans.thr?', and crossing the threshold triggers a SEBI open offer to the public.':'.')}}
 else if(ans.ft){r='Fast-track merger under s.233';why='Holding company with its 100% subsidiary, or small companies. Approved by the Regional Director with no NCLT hearing, so it takes months, not a year.'}
 else if(ans.bind||ans.thr||ans.biz){r='NCLT scheme of arrangement (s.230 to 232)';why='Paid in shares, binding on every holder, tax-neutral under s.2(1B) or s.2(19AA), and generally exempt from the open offer. This is the Motherson route.'}
 else{r='Preferential allotment';why='Issue shares to one counterparty. Quick, but not tax-neutral for an asset swap, and it can trigger an open offer.'}
 $('#rfout').innerHTML=`<b>Suggested route: ${r}.</b> ${why}`}
rfRender();

/* gantt */
const G=[["Board approval, valuation, fairness opinion",0,2,"<b>Who:</b> board, audit committee, independent directors' committee, registered valuer, merchant banker, lawyers. <b>Output:</b> draft scheme plus reports. Announce to the exchanges the same day."],
 ["Exchange and SEBI review",1,5,"File with BSE/NSE under the SEBI circular. A 21-day public comments window, then the exchanges forward to SEBI. <b>Output:</b> observation letter (no objection)."],
 ["NCLT first motion and notices",4,7,"Apply to the NCLT to call meetings. Notices go to the Central Government (Regional Director), RoC, Income-tax, RBI, SEBI, CCI, exchanges and the official liquidator, who have 30 days to respond."],
 ["Shareholder and creditor meetings",6,8,"Meetings or e-voting by class. Tests: majority in number and three-fourths in value, plus majority of minority for listed promoter deals. Creditor meetings can be dispensed with if 90% consent."],
 ["NCLT second motion and sanction",8,14,"Petition for sanction. Objections are heard (only from 10% shareholders or 5% creditors) and regulators' comments addressed. <b>Output:</b> sanction order under s.232."],
 ["RoC filing, effective and record date",14,15,"File the certified order with the RoC within 30 days, at which point the scheme is effective. Fix the record date and allot shares. Pay stamp duty."],
 ["Listing of the resulting company",15,18,"Rule 19(2)(b) relaxation, information document, exchange in-principle and final listing approval, then trading starts."]];
const MOT=[[0,"Jul 2020 announce"],[5,"Dec 2020 NOCs"],[7.5,"Feb 2021 1st motion"],[10,"Apr 2021 vote"],[17.7,"Dec 2021 sanction"],[18.5,"Jan 2022 effective"],[20.9,"Mar 2022 listing"]];
const MAX=22;const gw=$('#gantt');
gw.innerHTML=`<div class="gaxis"><div></div><div class="ticks">${[0,3,6,9,12,15,18,21].map(m=>`<span style="left:${m/MAX*100}%">${m}m</span>`).join('')}</div></div>`+
 G.map((g,i)=>`<div class="grow" data-i="${i}" tabindex="0"><div class="gl">${g[0]}</div><div class="gt"><div class="gb" style="left:${g[1]/MAX*100}%" data-w="${(g[2]-g[1])/MAX*100}"></div>${i===0?MOT.map(m=>`<div class="gm" style="left:${m[0]/MAX*100}%;height:${G.length*28}px" title="${m[1]}"><i></i></div>`).join(''):''}</div></div>`).join('');
const rows=[...gw.querySelectorAll('.grow')];
function gsel(i){rows.forEach((r,k)=>r.classList.toggle('sel',k===i));$('#gdetail').innerHTML=`<b>${G[i][0]}</b> · months ${G[i][1]} to ${G[i][2]}<br>${G[i][3]}`}
rows.forEach((r,i)=>{r.onclick=()=>gsel(i);r.onkeydown=e=>{if(e.key==='Enter')gsel(i)}});gsel(0);
function grow(){gw.querySelectorAll('.gb').forEach((b,i)=>{b.style.width='0';setTimeout(()=>b.style.width=b.dataset.w+'%',120+i*180)})}
const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){grow();io.disconnect()}},{threshold:.2});io.observe(gw);
setTimeout(()=>{gw.querySelectorAll('.gb').forEach(b=>{if(b.style.width===''||b.style.width==='0px')b.style.width=b.dataset.w+'%'})},5000);
$('#ganttReplay').onclick=grow;
$('#ganttOv').onclick=function(){const on=this.getAttribute('aria-pressed')!=='true';this.setAttribute('aria-pressed',on);gw.classList.toggle('ov',on);
 if(on)$('#gdetail').innerHTML='<b>Motherson actual (green markers):</b> '+MOT.map(m=>m[1]).join(' · ')+'. About 18.5 months to effective and 21 to listing. That is longer than the typical bar, partly because of COVID-era tribunal backlogs.'};

/* vote calc */
function vc(){const n=id=>+document.getElementById(id).value||0;const vf=n('vf'),va=n('va'),nf=n('nf'),na=n('na'),pf=n('pf'),pa=n('pa');
 const pv=vf+va?vf/(vf+va)*100:0,pp=pf+pa?pf/(pf+pa)*100:0;
 const c=[[nf>na,`Majority in number: ${nf.toLocaleString('en-IN')} for vs ${na.toLocaleString('en-IN')} against`],[pv>=75,`Three-fourths in value: <b>${pv.toFixed(2)}%</b> for (needs 75%)`],[pf>pa,`Majority of minority (SEBI): public <b>${pp.toFixed(2)}%</b> for (needs over 50%)`]];
 const all=c.every(x=>x[0]);
 $('#vchecks').innerHTML=c.map(([ok,t])=>`<div class="chk ${ok?'pass':'fail'}">${ok?'✓':'✗'} ${t}</div>`).join('')+`<div class="chk ${all?'pass':'fail'}"><b>${all?'Scheme approved. Next: NCLT second motion.':'Scheme fails at the meeting.'}</b></div>`}
['vf','va','nf','na','pf','pa'].forEach(id=>document.getElementById(id).addEventListener('input',vc));vc();

/* dates */
const D=[[10,"Board approval","2 Jul 2020","The day the board approves the draft scheme and announces it."],[38,"Appointed date","1 Apr 2021","From when the scheme counts in the accounts. It can be earlier than the effective date."],[66,"Effective date","Jan 2022","When it legally takes effect: the NCLT order is filed with the RoC."],[82,"Ex-date","14 Jan 2022","From this day the share trades without the right to new shares, so the price adjusts."],[93,"Record date","17 Jan 2022","Whoever holds shares at the end of this day gets the new shares."]];
$('#dates').innerHTML='<div class="dline"></div>'+D.map(d=>`<div class="dm" style="left:${d[0]}%" tabindex="0"><div class="tip">${d[3]}</div><i></i><b>${d[1]}</b><span>${d[2]}</span></div>`).join('');

/* swap ratio maker */
function sr(){const n=id=>+document.getElementById(id).value||0;const AE=n('ae'),AS=n('as'),TE=n('te'),TS=n('ts'),CX=n('cx');
 const ap=AS?AE/AS*10:0,tp=TS?TE/TS*10:0,r=ap?tp/ap:0,nw=TS*r,tot=AS-CX+nw,own=tot?nw/tot*100:0,vps=tot?(AE+TE-CX*ap/10)/tot*10:0;
 const o=[["Acquirer ₹/share",'₹'+ap.toFixed(2)],["Target ₹/share",'₹'+tp.toFixed(2)],["Swap ratio",r.toFixed(3)+" : 1"],["In whole numbers",Math.round(r*10)+" : 10"],["New shares",nw.toLocaleString('en-IN',{maximumFractionDigits:1})+" mn"],["Total after",tot.toLocaleString('en-IN',{maximumFractionDigits:1})+" mn"],["Target holders own",own.toFixed(1)+"%"],["Value/share after",'₹'+vps.toFixed(2)]];
 $('#srout').innerHTML=o.map(([l,v])=>`<div class="o"><div class="v">${v}</div><div class="l">${l}</div></div>`).join('')}
['ae','as','te','ts','cx'].forEach(id=>document.getElementById(id).addEventListener('input',sr));sr();

/* checklist */
const CL=[["Structuring",["Map every stakeholder's objective","Compare routes (scheme vs SPA vs preferential vs fast-track)","Fix the sequence of steps in a composite scheme","Tax check: s.2(1B) / s.2(19AA) conditions","Takeover Code: confirm open offer exemption"]],
 ["Valuation",["Set up data room and diligence","Agree valuation date and methods with the valuers","Obtain the registered valuer's report","Obtain the merchant banker's fairness opinion"]],
 ["Approvals",["Audit committee and independent directors' reports","Board approval and exchange disclosure","Exchange/SEBI filing and observation letter","NCLT first motion, notices, meetings","NCLT sanction, RoC filing, record date"]],
 ["Communication",["Investor presentation and press release","FAQ with accretion and look-through analysis","Engage proxy advisors and top institutions before the vote","Plan the listing day and price discovery"]]];
const saved=(()=>{try{return JSON.parse(localStorage.getItem('mh-cl')||'[]')}catch(e){return[]}})();
let idx=0;$('#checklist').innerHTML=CL.map(([p,its])=>`<div class="ph">${p}</div>`+its.map(t=>{const i=idx++;return `<label><input type="checkbox" data-i="${i}" ${saved.includes(i)?'checked':''}> ${t}</label>`}).join('')).join('');
const total=idx;function clp(){const c=[...document.querySelectorAll('#checklist input:checked')].map(x=>+x.dataset.i);try{localStorage.setItem('mh-cl',JSON.stringify(c))}catch(e){}
 $('#clprog').innerHTML=Array.from({length:total},(_,i)=>`<i class="${i<c.length?'on':''}"></i>`).join('');if(c.length===total&&window.hubToast)hubToast('Checklist complete. You think like a deal team now.')}
document.querySelectorAll('#checklist input').forEach(x=>x.addEventListener('change',clp));clp();

/* flashcards */
const FC=[["Composite scheme","Several steps (e.g. demerger + merger) in one scheme, approved together."],["First motion","Application asking the NCLT to order shareholder and creditor meetings."],["Second motion","Petition asking the NCLT to sanction the scheme after the votes."],["s.230(6) test","Majority in number holding three-fourths in value of those voting, class by class."],["Majority of minority","Public shareholders' votes for must exceed votes against (SEBI, promoter-linked schemes)."],["Observation letter","The stock exchange's no-objection after SEBI review. Needed before going to the NCLT."],["Mirror shareholding","The resulting company's owners are the same, in the same proportions, as the parent's."],["s.2(19AA)","Income-tax definition of demerger. Meeting it makes the demerger tax-neutral."],["Appointed date","The date from which the scheme applies for accounting."],["Fast-track (s.233)","Regional Director route for holding company + 100% subsidiary or small companies. No NCLT."],["Fairness opinion","A merchant banker's view that the ratio is fair, from a financial point of view, to a stated group."],["Rule 19(2)(b) SCRR","Lets a demerged company list without an IPO, subject to SEBI conditions."]];
$('#flash').innerHTML=FC.map(([f,b])=>`<button class="fc" type="button" aria-label="Flashcard: ${f}"><div class="fci"><div class="fcf">${f}</div><div class="fcb">${b}</div></div></button>`).join('');
document.querySelectorAll('.fc').forEach(c=>c.onclick=()=>c.classList.toggle('flip'));

/* quiz */
const QZ=[["Who sanctions a scheme of arrangement in India?",["SEBI","The NCLT","The Registrar of Companies","The stock exchange"],1,"The NCLT sanctions it. SEBI and the exchanges review listed-company schemes first and issue an observation letter."],
 ["What is the Companies Act vote test for each class?",["Simple majority by value","Majority in number holding three-fourths in value","Two-thirds of all shares","90% of all shares"],1,"s.230(6): majority in number who also hold three-fourths in value of those voting."],
 ["In a 1:1 mirror demerger, who gains value?",["The promoters","The public","Nobody: everyone keeps the same % of every business","The resulting company's lenders"],2,"It is value-neutral. Only per-share prices change."],
 ["Why are the target's shares in the acquirer cancelled in a holdco merger?",["To reduce tax","A company can't hold its own shares","SEBI requires a buyback","To increase EPS"],1,"After the merger the acquirer would own its own shares, so they are cancelled."],
 ["Who can object to a scheme at the NCLT?",["Any shareholder","Holders of at least 10% of shares or creditors of at least 5% of debt","Only SEBI","Only the promoters"],1,"s.230(4) limits objections to 10% shareholders or 5% creditors."],
 ["Which route lets a holding company merge its 100% subsidiary without the NCLT?",["s.66","s.230","s.233 fast-track","s.234"],2,"s.233 fast-track, approved by the Regional Director."]];
let score=0,answered=0;
$('#quiz').innerHTML=QZ.map(([q,o],i)=>`<div class="qq" data-q="${i}"><div class="qt">${i+1}. ${q}</div><div class="opts">${o.map((t,k)=>`<button data-k="${k}">${t}</button>`).join('')}</div><div class="ex" hidden></div></div>`).join('');
document.querySelectorAll('.qq').forEach(el=>{const i=+el.dataset.q;el.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(el.dataset.done)return;el.dataset.done=1;const k=+b.dataset.k,ok=k===QZ[i][2];
 b.classList.add(ok?'right':'wrong');if(!ok)el.querySelectorAll('button')[QZ[i][2]].classList.add('right');const ex=el.querySelector('.ex');ex.hidden=false;ex.textContent=(ok?'Correct. ':'Not quite. ')+QZ[i][3];
 answered++;if(ok)score++;const s=$('#qscore');s.hidden=false;s.className='verdict '+(score/answered>=.67?'good':'mid');s.textContent=`Score: ${score} / ${answered}`+(answered===QZ.length?(score===QZ.length?'. Perfect. Ready for viva.':'. Revisit the lessons you missed.'):'')})});
})();
