
const $=s=>document.querySelector(s);
const fmt=(n,d=0)=>n.toLocaleString('en-IN',{minimumFractionDigits:d,maximumFractionDigits:d});

/* ================= 1. BASKET ANIMATION ================= */
// positions in % of stage: [left, top, width, height, opacity]
const FR={
 mssl:{cls:"",lab:["MSSL<small>LISTED</small>","MSSL (without DWH)<small>LISTED</small>","MSSL absorbs SAMIL<small>LISTED</small>","Samvardhana Motherson<small>LISTED · FORMERLY MSSL</small>"],
  pos:[[2,22,46,75,1],[2,22,30,75,1],[2,22,62,75,1],[2,22,62,75,1]]},
 samil:{cls:"unl",lab:["SAMIL<small>FAMILY HOLDCO · UNLISTED</small>","SAMIL<small>FAMILY HOLDCO · UNLISTED</small>","SAMIL<small>DISSOLVED INTO MSSL</small>","SAMIL"],
  pos:[[52,22,46,75,1],[66,22,32,75,1],[66,22,32,75,0],[66,22,32,75,0]]},
 mswil:{cls:"",lab:["MSWIL","MSWIL<small>NEW · LISTED</small>","MSWIL<small>LISTED</small>","MSWIL<small>LISTED</small>"],
  pos:[[35,22,28,75,0],[35,22,28,75,1],[66,22,32,75,1],[66,22,32,75,1]]}
};
const BL=[
 {id:"dwh",c:"b-dwh",lab:["Indian wiring<small>DWH</small>","Indian wiring<small>DWH · 100%</small>","Indian wiring<small>DWH · 100%</small>","Indian wiring<small>DWH · 100%</small>"],
  pos:[[4,36,20,27,1],[37,36,24,57,1],[68,36,28,57,1],[68,36,28,57,1]]},
 {id:"oth",c:"b-oth",lab:["Other MSSL<small>export wiring etc.</small>","Other MSSL<small>export wiring etc.</small>","Other MSSL","Other MSSL"],
  pos:[[26,36,20,27,1],[4,36,26,27,1],[4,36,18,27,1],[4,36,18,27,1]]},
 {id:"s51",c:"b-smrp",lab:["SMRP BV<small>51%</small>","SMRP BV<small>51%</small>","SMRP BV<small>51%</small>","SMRP BV<small>100% · EUROPE</small>"],
  pos:[[4,66,42,27,1],[4,66,26,27,1],[4,66,18,27,1],[4,66,37,27,1]]},
 {id:"s49",c:"b-smrp",lab:["SMRP BV<small>49%</small>","SMRP BV<small>49%</small>","SMRP BV<small>49% ← joins</small>",""],
  pos:[[54,66,20,27,1],[68,66,14,27,1],[23,66,18,27,1],[23,66,18,27,0]]},
 {id:"biz",c:"b-biz",lab:["28 businesses<small>lighting, HVAC…</small>","28 businesses","28 businesses<small>← moves in</small>","Ex-SAMIL businesses<small>lighting, HVAC…</small>"],
  pos:[[76,36,20,27,1],[84,36,13,27,1],[23,36,18,27,1],[23,36,18,27,1]]},
 {id:"st1",c:"b-stake",lab:["33.4% of MSSL<small>shares</small>","33.4% of MSSL<small>shares</small>","33.4% of MSSL<small>CANCELLED</small>",""],
  pos:[[54,36,20,27,1],[68,36,14,27,1],[43,66,19,27,.35],[43,66,19,27,0]]},
 {id:"st2",c:"b-stake",lab:["","33.4% of MSWIL<small>new shares</small>","33.4% of MSWIL<small>← moves in</small>","33.4% of MSWIL<small>shares</small>"],
  pos:[[76,66,20,27,0],[84,66,13,27,1],[43,36,19,27,1],[43,36,19,27,1]]}
];
const OW={
 mssl:[[["pub","Public 38.3%"],["sws","SWS 25.3%"],["par","SAMIL 33.4%"],["fam","Family 3.0%"]],[["pub","Public 38.3%"],["sws","SWS 25.3%"],["par","SAMIL 33.4%"],["fam","Family 3.0%"]],[["fam","Family 50.4%"],["pub","Public 31.9%"],["sws","SWS 17.7%"]],[["fam","Family 50.4%"],["pub","Public 31.9%"],["sws","SWS 17.7%"]]],
 samil:[[["fam","Family 90.4%"],["","Sojitz 6.5%"],["","Staff 3.1%"]],[["fam","Family 90.4%"],["","Sojitz 6.5%"],["","Staff 3.1%"]],[],[]],
 mswil:[[],[["pub","Public 38.3%"],["sws","SWS 25.3%"],["par","SAMIL 33.4%"],["fam","Family 3.0%"]],[["pub","Public 38.3%"],["sws","SWS 25.3%"],["par","Motherson 33.4%"],["fam","Family 3.0%"]],[["pub","Public 38.3%"],["sws","SWS 25.3%"],["par","Motherson 33.4%"],["fam","Family 3.0%"]]]
};
const NARR=[
 "<h3>Before (June 2020)</h3><p>Look at SMRP BV: it is <b>split in half</b> across two boxes. The listed MSSL has 51%; the family's private SAMIL has 49%, plus 28 businesses and 33.4% of MSSL itself. SWS owns 25.3% of everything inside MSSL, including European bumpers it never wanted.</p>",
 "<h3>Move 1: Demerger (1 : 1)</h3><p>The green Indian wiring block <b>leaves MSSL</b> and goes into a new company, MSWIL. Every MSSL shareholder gets 1 MSWIL share per MSSL share, so MSWIL's owners are an exact copy of MSSL's. Notice SAMIL now also holds a new grey block: <b>33.4% of MSWIL</b>. <b>Why:</b> SWS now directly owns 25.3% of the business it cares about.</p>",
 "<h3>Move 2: Merger (51 : 10)</h3><p>SAMIL's box <b>empties into MSSL</b>: the other 49% of SMRP BV, the 28 businesses and the 33.4% of MSWIL all move in. SAMIL's 33.4% of MSSL is <b>cancelled</b>, because a company can't own itself. SAMIL's owners receive 51 new MSSL shares per 10 SAMIL shares, so the family jumps to 50.4%. <b>Why:</b> the listed company now owns 100% of everything, with no private side-pocket.</p>",
 "<h3>After (January 2022)</h3><p>Two clean listed companies. <b>Samvardhana Motherson</b> owns 100% of SMRP BV, all ex-SAMIL businesses and 33.4% of MSWIL; the family owns 50.4% of it directly. <b>MSWIL</b> is the focused Indian wiring company, with SWS at 25.3%. No cash was paid and no tax arose.</p>"
];
const stage=$('#stage');const els={};
function mk(cls,html){const d=document.createElement('div');d.className=cls;d.innerHTML=html;stage.appendChild(d);return d}
for(const k in FR){els['f'+k]=mk('frame '+FR[k].cls,'<div class="fl"></div>');els['o'+k]=mk('owners','')}
BL.forEach(b=>els[b.id]=mk('blk '+b.c,''));
function place(e,[x,y,w,h,o]){e.style.left=x+'%';e.style.top=y+'%';e.style.width=w+'%';e.style.height=h+'%';e.style.opacity=o;e.style.visibility=o===0?'hidden':'visible'}
let st=0,timer=null;
function setStage(s){st=s;
 for(const k in FR){const p=FR[k].pos[s];place(els['f'+k],p);els['f'+k].querySelector('.fl').innerHTML=FR[k].lab[s];
   const o=els['o'+k];o.style.left=p[0]+'%';o.style.top='3%';o.style.width=p[2]+'%';o.style.height='17%';o.style.opacity=OW[k][s].length?1:0;
   o.innerHTML=OW[k][s].map(([c,t])=>`<span class="chip ${c}">${t}</span>`).join('')}
 BL.forEach(b=>{const e=els[b.id];place(e,b.pos[s]);e.innerHTML=b.lab[s];e.classList.toggle('cancel',b.id==='st1'&&s>=2)});
 $('#narr').innerHTML=NARR[s];
 document.querySelectorAll('[data-st]').forEach(x=>x.setAttribute('aria-pressed',+x.dataset.st===s));
 document.querySelectorAll('#prog i').forEach((x,i)=>x.classList.toggle('on',i<=s));
}
document.querySelectorAll('[data-st]').forEach(x=>x.onclick=()=>{clearInterval(timer);timer=null;$('#play').textContent='▶ Play all';setStage(+x.dataset.st)});
$('#play').onclick=()=>{if(timer){clearInterval(timer);timer=null;$('#play').textContent='▶ Play all';return}
 setStage(0);$('#play').textContent='❚❚ Pause';let i=0;timer=setInterval(()=>{i++;if(i>3){clearInterval(timer);timer=null;$('#play').textContent='↻ Replay';return}setStage(i)},4200)};
setStage(0);

/* ================= stacked bar helper ================= */
function bar(el,segs){ // segs [[cls,pct,label]]
 if(!el._init){el.innerHTML='';segs.forEach(()=>{const s=document.createElement('div');s.className='seg';el.appendChild(s)});el._init=true}
 [...el.children].forEach((s,i)=>{const g=segs[i];s.className='seg '+g[0];s.style.flex='0 0 '+g[1]+'%';s.textContent=g[1]>=6?(g[2]||'')+' '+g[1].toFixed(1)+'%':'';s.title=(g[2]||'')+' '+g[1].toFixed(1)+'%'})}

/* ================= 3. ORDER MATTERS ================= */
const ORD={
 a:{bar:[["s-pub",38.3,"Public"],["s-sws",25.3,"SWS"],["s-fam",3.0,"Family"],["s-par",33.4,"Motherson"],["s-sj",0,""]],
  rows:[["SWS's direct stake in DWH","25.3%","Exactly what SWS asked for"],["Family's direct stake in DWH","3.0%","Family's look-through falls to ~19.8%"],["Main listed company's stake","33.4%","Motherson keeps DWH cash flows"],["Public's stake in DWH","38.3%","Look-through rises to 47.2%"]]},
 b:{bar:[["s-pub",26.8,"Public"],["s-sws",17.7,"SWS"],["s-fam",50.4,"Family"],["s-par",0,""],["s-sj",5.1,"Sojitz+staff"]],
  rows:[["SWS's direct stake in DWH","17.7%","Diluted in its favourite business: deal-breaker"],["Family's direct stake in DWH","50.4%","Promoters take majority of DWH directly"],["Main listed company's stake","0%","Motherson loses all DWH exposure"],["Public's stake in DWH","~31.9%","Lower than the actual 47.2% look-through"]]}
};
function ord(k){bar($('#ordbar'),ORD[k].bar);$('#ordA').setAttribute('aria-pressed',k==='a');$('#ordB').setAttribute('aria-pressed',k==='b');
 $('#ordtext').innerHTML='<table><thead><tr><th>Who</th><th class="num">Stake in MSWIL</th><th>So what</th></tr></thead><tbody>'+ORD[k].rows.map(r=>`<tr><td>${r[0]}</td><td class="num">${r[1]}</td><td>${r[2]}</td></tr>`).join('')+'</tbody></table>'+(k==='b'?'<p class="note" style="padding:8px 12px">Illustrative: assumes the merger ownership (50.4 / 31.9 / 17.7) is mirrored into MSWIL. Exact numbers would shift slightly because the swap ratio would then need to value DWH too.</p>':'')}
$('#ordA').onclick=()=>ord('a');$('#ordB').onclick=()=>ord('b');ord('a');

/* ================= 5. OWNERSHIP TOGGLE ================= */
const OWN={0:{m:[["s-pub",38.3,"Public"],["s-sws",25.3,"SWS"],["s-fam",3.0,"Fam"],["s-par",33.4,"SAMIL"],["s-sj",0,""]],w:[["s-pub",0,""],["s-sws",0,""],["s-fam",0,""],["s-par",100,"Inside MSSL (not separate yet)"],["s-sj",0,""]]},
 1:{m:[["s-pub",26.8,"Public"],["s-sws",17.7,"SWS"],["s-fam",50.4,"Family"],["s-par",0,""],["s-sj",5.1,"Soj"]],w:[["s-pub",38.3,"Public"],["s-sws",25.3,"SWS"],["s-fam",3.0,"Fam"],["s-par",33.4,"Motherson"],["s-sj",0,""]]}};
function own(k){bar($('#ownMain'),OWN[k].m);bar($('#ownWire'),OWN[k].w);$('#own0').setAttribute('aria-pressed',k==0);$('#own1').setAttribute('aria-pressed',k==1)}
$('#own0').onclick=()=>own(0);$('#own1').onclick=()=>own(1);own(0);

/* ================= 6. SWAP SIMULATOR ================= */
const C={samSh:473.614,keep:2102.184,fam0:93.238,pub:1208.648,sws:800.298,M:31930,stake:10675,pat:830.1,eps0:1.70,mps:101.11};
function sim(){const r=+$('#r').value,V=+$('#v').value;$('#rv').textContent=r.toFixed(2);$('#vv').textContent=fmt(V);
 const nw=C.samSh*r,tot=C.keep+nw,fam=(C.fam0+.904*nw)/tot*100,pub=C.pub/tot*100,sws=C.sws/tot*100,sj=.096*nw/tot*100;
 const val=C.M+V,vps=val/tot*10,pubV=C.pub*vps/10,pre=C.pub*C.mps/10,gain=pubV-pre,eps=C.pat/tot*10,acc=(eps/C.eps0-1)*100;
 const fair=(C.stake+V)/C.samSh*10/C.mps;
 $('#simout').innerHTML=[["New shares issued",fmt(nw,1)+" mn"],["Total shares",fmt(tot,1)+" mn"],["Family stake",fam.toFixed(1)+"%"],["Public stake",pub.toFixed(1)+"%"],
  ["Value per share",'₹'+vps.toFixed(1)],["Public gain / (loss)",(gain<0?'(':'')+'₹'+fmt(Math.abs(gain))+' cr'+(gain<0?')':'')],["EPS (Q3 FY21)",'₹'+eps.toFixed(2)+' ('+(acc>=0?'+':'')+acc.toFixed(1)+'%)'],["Fair ratio for your value",fair.toFixed(2)]]
  .map(([l,v])=>`<div class="o"><div class="v">${v}</div><div class="l">${l}</div></div>`).join('');
 bar($('#simbar'),[["s-fam",fam,"Family"],["s-pub",pub,"Public"],["s-sws",sws,"SWS"],["s-sj",sj,"Soj"]]);
 const vd=$('#verdict');const pct=gain/pre*100;
 if(Math.abs(pct)<1.5){vd.className='verdict good';vd.innerHTML=`<b>Roughly fair.</b> Public holders gain or lose ${Math.abs(pct).toFixed(1)}% of their stake value.`}
 else if(gain<0){vd.className='verdict bad';vd.innerHTML=`<b>Value moves to the promoters.</b> Public holders lose ${Math.abs(pct).toFixed(1)}% (₹${fmt(-gain)} cr). The ratio is too high for this value.`}
 else{vd.className='verdict mid';vd.innerHTML=`<b>Value moves to the public.</b> Public holders gain ${pct.toFixed(1)}% (₹${fmt(gain)} cr). SAMIL's owners would refuse this ratio.`}
 vd.innerHTML+= fam>50?' The family crosses 50% control.':' The family stays below 50%.';
}
['r','v'].forEach(i=>$('#'+i).addEventListener('input',sim));
$('#reset').onclick=()=>{$('#r').value=5.1;$('#v').value=13765;sim()};sim();

/* ================= 8. JOURNEY ================= */
const J=[
 ["2014 to 2016","Board committee formed","The MSSL board sets up a Committee of Directors to review the group structure. Over the years <b>several investment banks pitch structures</b>. Banker lesson: big restructurings take years of relationship work before a mandate."],
 ["30 Jan 2020","In-principle board approval","The board approves the idea: demerge DWH and own 100% of SMRP BV. A subcommittee is formed and advisors are appointed. The stock is at ₹134."],
 ["Feb to Jun 2020","Diligence and valuation","PwC and AZB do diligence on SAMIL and its top 11 investments. Three valuers build SOTP models. COVID hits and the stock falls to ₹48.5 in March. Banker lesson: the valuation date (31 Mar 2020) is set near the bottom."],
 ["2 Jul 2020","Audit committee, board, announcement","The independent audit committee recommends the scheme; promoter directors abstain. The board approves the 1:1 and 51:10 ratios. Press release and a 65-page investor deck go out. MSWIL is incorporated."],
 ["3 Jul 2020","Market reaction","The stock falls up to 9% intraday. Analysts call SAMIL's valuation rich and flag 43% dilution. Banker lesson: expect this, and plan the response."],
 ["24 Jul 2020","Filed with exchanges","The scheme, valuation reports, fairness opinions, audit committee report and shareholding are filed with BSE and NSE under SEBI's scheme circular (Reg 37 of LODR). SEBI reviews via the exchanges."],
 ["Dec 2020","Exchange no-objection","BSE (4 Dec) and NSE (7 Dec) issue observation letters with no objection. CCI approval is also needed."],
 ["16 Feb 2021","NCLT first motion","The tribunal orders shareholder meetings. Next day the company publishes FAQs showing 8% EPS accretion and the greenfield turnaround. Banker lesson: this is the investor education phase before the vote."],
 ["29 Apr 2021","Shareholder vote","NCLT-convened meeting: <b>99.44% of public votes in favour</b>, passing the majority-of-minority test. The RPT approvals for MSWIL pass at a separate EGM. The NCLT dispenses with creditor meetings."],
 ["23 Dec 2021","NCLT final sanction","The second motion: the tribunal sanctions the scheme. The order is filed with the Registrar of Companies, and the scheme becomes effective in January 2022."],
 ["14 to 17 Jan 2022","Ex-date and record date","MSSL trades ex-DWH from 14 Jan (₹234.8 to ₹187.6). Shareholders on 17 Jan get 1 MSWIL share each. SAMIL then merges in and MSSL is renamed Samvardhana Motherson International."],
 ["28 Mar 2022","MSWIL lists","MSWIL lists at ₹66 (market cap about ₹20,800 cr) and hits the 5% lower circuit at ₹62.70. About 21 months from announcement to listing, roughly 4 months later than the original Q2 FY22 target."]
];
const jr=$('#journey');J.forEach((s,i)=>{const d=document.createElement('div');d.className='jstep';d.innerHTML=`<div class="d">${s[0]}</div><div class="t">${s[1]}</div><div class="x">${s[2]}</div>`;d.onclick=()=>jset(i);jr.appendChild(d)});
function jset(i){const st=[...jr.querySelectorAll('.jstep')];st.forEach((e,k)=>{e.classList.toggle('done',k<i);e.classList.toggle('cur',k===i)});
 const c=st[i];$('#jfill').style.height=(c.offsetTop+10)+'px';$('#jcount').textContent=`Step ${i+1} of ${J.length}`}
let jt=null;$('#jplay').onclick=()=>{if(jt){clearInterval(jt);jt=null;$('#jplay').textContent='▶ Play the journey';return}
 let i=0;jset(0);$('#jplay').textContent='❚❚ Pause';jt=setInterval(()=>{i++;if(i>=J.length){clearInterval(jt);jt=null;$('#jplay').textContent='↻ Replay';return}jset(i)},3000)};
jset(0);

/* ================= 9. STAKEHOLDERS ================= */
const SH=[
 ["Public shareholders",`<p><b>Before:</b> 38.3% of MSSL, but only 19.5% of SMRP BV and nothing of SAMIL's businesses. They worried that the promoters' private 49% created a conflict.</p>
  <p><b>Gave up:</b> 43% dilution; their stake in old MSSL businesses fell from 38.3% to 26.8%.</p>
  <p><b>Got:</b> more of SMRP BV (26.8%), DWH (47.2% look-through), SAMIL's businesses (26.8%), a simpler group, +3.1% EBITDA and +8% EPS. They also got a choice of two stocks.</p>
  <p><b>Risk:</b> overpaying for SAMIL's assets if the valuation was rich.</p><p><b>Verdict:</b> they voted 99.44% in favour and made about 4.2x by 2026.</p>`],
 ["Promoters (Sehgal family)",`<p><b>Before:</b> 3.0% direct plus 33.4% via SAMIL, and a private 49% of SMRP BV plus 28 businesses outside the listed company.</p>
  <p><b>Got:</b> <b>50.4% direct</b> majority of a much larger listed company, liquid listed shares instead of private ones, no holding company layer, and a platform for acquisitions.</p>
  <p><b>Gave up:</b> their private side-pocket; their look-through stake in DWH fell from 33% to about 20%; 1-year lock-in.</p>
  <p><b>Why they wanted it:</b> control and value become transparent and tradeable. Their wealth now moves with the listed share price.</p>`],
 ["SWS (JV partner)",`<p><b>Before:</b> 25.3% of MSSL, mostly exposure to global businesses it did not want.</p>
  <p><b>Got:</b> a direct <b>25.3% of MSWIL</b> (about 31% look-through), with its technical assistance agreement moving to MSWIL on the same terms, and a listed, liquid 17.7% of Motherson it could sell.</p>
  <p><b>What it did next:</b> sold 3.4% in March 2023 (citing group deleveraging) and 4.4% in March 2024, ending at 9.7%. That shows the original motive clearly.</p>`],
 ["Sojitz and SAMIL employees",`<p>They owned 6.5% and 3.1% of the unlisted SAMIL. After the merger they hold about 5.1% of Motherson in <b>listed, tradeable shares</b>, so they get liquidity they never had in a private company.</p>`],
 ["Lenders and rating agencies",`<p>ICRA said the merger was "unlikely to materially impact the credit profile" and kept AA+ (on watch because of COVID). SAMIL's debt (about ₹1,115 cr net) moved into the larger, more diversified listed company. In a demerger, debt linked to DWH goes with it and general debt is split by asset value. The NCLT dispensed with creditor meetings.</p>`],
 ["Employees and customers",`<p><b>DWH employees</b> moved to MSWIL with continuity of service. <b>Customers</b> (Maruti, Tata, Mahindra and others) saw no disruption: supply, sourcing and technical agreements kept the old value chain intact. The plants stayed on MSSL land and were leased to MSWIL (about ₹60 cr a year from FY22, 10 years, 5-year lock-in, 5% annual escalation, set by a Knight Frank report).</p>`],
 ["MSWIL's minority holders",`<p>The new conflict. The family owns <b>50.4% of Motherson</b> but only about <b>20% of MSWIL</b> on a look-through basis. So any money that flows from MSWIL to Motherson benefits the family more.</p>
  <p>Caps were set as % of MSWIL revenue for 10 years: buying components from Motherson ≤34.5% (it was 29.3% in FY20) and from SWS ≤17.5%; functional services ≤5%; technical assistance ≤1%; management fee to Motherson ≤1% (new); car leasing ≤0.5%; plus the lease. The incremental cost was guided at about 2% of revenue. MSWIL's audit committee reviews these every year. Banker point: <b>this is what MSWIL's minorities must watch.</b></p>`],
 ["Regulators",`<p><b>SEBI</b> (via the exchanges) checks disclosure and the majority-of-minority vote. The <b>NCLT</b> checks fairness and the process. <b>CCI</b> checks competition. <b>RBI</b> is informed because SAMIL was a core investment company. The <b>tax authorities</b> see a tax-neutral demerger and amalgamation under s.2(19AA) and s.2(1B).</p>`]
];
const tt=$('#sttabs');SH.forEach((s,i)=>{const b=document.createElement('button');b.className='btn';b.textContent=s[0];b.onclick=()=>sh(i);tt.appendChild(b)});
function sh(i){[...tt.children].forEach((b,k)=>b.setAttribute('aria-pressed',k===i));$('#stpanel').innerHTML=SH[i][1]}
sh(0);

/* ================= 11. PRICE CHART ================= */
(function(){const P=[["Jan 20",2020.08,134,"In-principle"],["Mar 20",2020.23,48.5,"COVID low"],["Jul 20",2020.50,103.6,"Announced"],["Jul 21",2021.53,151,""],["Jan 22",2022.03,234.8,"Last day with DWH"],
 ["Jan 22",2022.04,187.6,"Ex-DWH"],["Mar 23",2023.21,104.9,"SWS sells"],["Mar 24",2024.18,181.5,"SWS sells again"],["Sep 24",2024.72,285,"QIP"],["Oct 26",2026.79,360,"Today"]];
 const W=760,H=330,L=56,R=20,T=24,B=40,x0=2020,x1=2027,ymax=470;
 const x=v=>L+(v-x0)/(x1-x0)*(W-L-R),y=v=>H-B-(v/ymax)*(H-T-B);
 const ns="http://www.w3.org/2000/svg",svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
 const add=(t,a,txt)=>{const e=document.createElementNS(ns,t);for(const k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;svg.appendChild(e);return e};
 [0,100,200,300,400].forEach(v=>{add('line',{x1:L,x2:W-R,y1:y(v),y2:y(v),stroke:'var(--line)'});add('text',{x:L-8,y:y(v)+4,'text-anchor':'end','font-size':12,fill:'var(--muted)'},'₹'+v)});
 for(let yr=2020;yr<=2027;yr++)add('text',{x:x(yr),y:H-B+20,'text-anchor':'middle','font-size':12,fill:'var(--muted)'},yr);
 add('rect',{x:x(2022.04),y:T,width:x(x1)-x(2022.04),height:H-T-B,fill:'var(--soft)',opacity:.6});
 add('text',{x:x(2022.1),y:T+14,'font-size':12,fill:'var(--muted)'},'After split: Motherson part only (bonus-adjusted)');
 const d=P.map((p,i)=>(i?'L':'M')+x(p[1]).toFixed(1)+','+y(p[2]).toFixed(1)).join(' ');
 const path=add('path',{d,fill:'none',stroke:'var(--copper)','stroke-width':2.6,class:'draw','stroke-linejoin':'round'});
 P.forEach((p,i)=>{add('circle',{cx:x(p[1]),cy:y(p[2]),r:4,fill:'var(--panel)',stroke:'var(--copper)','stroke-width':2});
  if(p[3]){const up=[0,4,8,9].includes(i),side=i===5||i===2;add('text',{x:x(p[1])+(side?8:0),y:y(p[2])+(i===2?16:up?-10:18),'text-anchor':side?'start':'middle','font-size':11.5,fill:'var(--ink)'},`${p[3]} ₹${p[2]}`)}});
 add('circle',{cx:x(2026.79),cy:y(434.4),r:5,fill:'var(--blue)'});add('text',{x:x(2026.79)-8,y:y(434.4)+4,'text-anchor':'end','font-size':11.5,fill:'var(--blue)'},'+ MSWIL = ₹434');
 $('#pchart').appendChild(svg);
 const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){path.classList.add('go');io.disconnect()}},{threshold:.3});io.observe(svg);
 setTimeout(()=>path.classList.add('go'),4000);
})();

/* ================= 12. YOUR SHARES ================= */
function mine(){let n=Math.max(1,Math.floor(+$('#nsh').value||0));const v0=n*103.6,m=n*2.25,w=n*2.1,now=m*160+w*35.43,nifty=v0*23146/10552;
 const S=[["2 Jul 2020",`You own <b>${fmt(n)} MSSL</b> shares worth <b>₹${fmt(v0)}</b> at ₹103.6.`],
  ["17 Jan 2022 · demerger",`You keep ${fmt(n)} MSSL shares and receive <b>${fmt(n)} MSWIL</b> shares (1:1). Nothing was sold and no tax was due.`],
  ["Jan 2022 · merger",`Your ${fmt(n)} MSSL shares are unchanged, but MSSL now owns 100% of SMRP BV and SAMIL's businesses. The company is renamed Samvardhana Motherson. Your share count stays the same, but the total share count rises 43%, so your % ownership is smaller. In exchange, each share now owns more businesses.`],
  ["Oct to Nov 2022 · bonuses",`Motherson 1:2 bonus → ${fmt(n*1.5,1)} shares. MSWIL 2:5 bonus → ${fmt(n*1.4,1)} shares.`],
  ["Jul 2025 · bonuses",`Both 1:2 bonus → <b>${fmt(m,1)} Motherson</b> and <b>${fmt(w,1)} MSWIL</b> shares.`],
  ["16 Oct 2026 · today",`${fmt(m,1)} × ₹160 + ${fmt(w,1)} × ₹35.43 = <b>₹${fmt(now)}</b>. That is <b>${(now/v0).toFixed(1)}x</b> your money vs about ₹${fmt(nifty)} (${(nifty/v0).toFixed(1)}x) in the Nifty 50. Dividends excluded.`]];
 const box=$('#mysteps');box.innerHTML='<div class="fill" style="height:calc(100% - 16px)"></div>'+S.map(s=>`<div class="jstep done" style="cursor:default"><div class="d">${s[0]}</div><div style="max-width:64ch">${s[1]}</div></div>`).join('')}
$('#nsh').addEventListener('input',mine);mine();

/* ================= 16. QA ================= */
const QA=[
 ["In one sentence, what happened?","MSSL demerged its Indian wiring business into MSWIL (1:1) and then absorbed the promoter's holding company SAMIL (51 MSSL shares for 10 SAMIL shares), leaving two clean listed companies."],
 ["Why demerge first and then merge?","A demerger copies the parent's shareholding on the record date. Demerging first copied the old ownership, giving SWS 25.3% of MSWIL and parking SAMIL's 33.4% inside Motherson after the merger. Merging first would have copied the post-merger ownership (family ~50%, SWS ~18%), giving the family half of DWH directly and diluting SWS in the business it wanted."],
 ["Is 1:1 fair? Why not 1:2?","Any ratio is fair in a mirror demerger because everyone keeps the same % of every business; only the price per share changes. 1:1 is the simplest."],
 ["How was 51:10 set?","Sum-of-the-parts value per share for MSSL ex-DWH (~₹101) and SAMIL (~₹516), each 50% DCF and 50% peer multiples, NAV ignored. 516 ÷ 101 ≈ 5.1."],
 ["Why cancel SAMIL's MSSL shares?","After the merger SAMIL's assets belong to MSSL, so MSSL would own its own shares. Indian law doesn't allow that, so they are cancelled and SAMIL's owners get fresh shares instead."],
 ["How much dilution?","2,415.4 mn new minus 1,055.8 mn cancelled = 1,359.7 mn net new on a base of 3,157.9 mn, which is 43%."],
 ["Was it accretive?","Yes. EBITDA look-through for the public +3.1% (FY20), and EPS +8% on Q3 FY21 pro forma numbers (₹1.70 to ₹1.84)."],
 ["Why no open offer when promoters went to 50%?","Shares acquired under an NCLT-sanctioned scheme are generally exempt under SAST Reg 10(1)(d). Minorities are protected instead by the majority-of-minority vote and the tribunal's scrutiny."],
 ["What's a scheme of arrangement and why use one?","A Companies Act s.230 to 232 plan approved by shareholders and sanctioned by the NCLT, binding on everyone. It allows share-for-share deals with no cash, tax neutrality and no open offer."],
 ["What is majority of minority?","A SEBI rule for promoter-linked schemes: public shareholders' votes for must exceed their votes against. Here 99.44% of public votes were in favour."],
 ["Who are the losers, if any?","Possibly public holders if SAMIL was overvalued: each ₹1,000 cr of overvaluation cost them about ₹268 cr. And MSWIL minorities face a related-party risk because the family's interest there is only about 20%."],
 ["Why did the stock fall on announcement?","Analysts felt SAMIL was priced richly (based on peak FY19 earnings, at a premium to peers), there was 43% dilution, and SMRP BV was loss-making in FY20. It recovered as greenfield losses reversed."],
 ["What did SWS do afterwards and what does it tell you?","It sold Motherson down from 17.7% to 9.7% (2023 to 2024) and kept 25.3% of MSWIL. That confirms its goal was to focus on Indian wiring."],
 ["Was it successful?","Yes structurally and for returns (about 4.2x vs 2.2x for the Nifty). The caveats are the rich valuation at the trough, MSWIL's flat stock and the missed Vision 2025."],
 ["As a banker, what would you do differently?","Price on normalised earnings or add a true-up, ask for a longer promoter lock-in, set tighter RPT caps with independent review, and get a fairness opinion addressed only to public holders."]
];
/* ================= 17. LIKELY QUESTIONS ================= */
const LQ=[
 ["Concept","h","Explain the restructuring in two minutes.","Use the 60-second pitch (Lesson 15): who the parties are, the problem (51/49 split, SWS misaligned, promoter side-pocket), Move 1 (1:1 demerger), Move 2 (51:10 merger), and the result (two listed companies, family 50.4%, SWS 25.3% of MSWIL).","Don't start with share counts. Start with the problem; numbers come after."],
 ["Concept","h","Why was this called a restructuring 'driven by the JV partner'?","The press release's first line of rationale is SWS's 'long-standing request' to focus on Indian wiring. Without SWS, the promoters could have just merged SAMIL in. The demerger, and its order, exist because of SWS.","Don't say it was only about minorities. The demerger piece is purely about SWS."],
 ["Structure","h","Why demerge first and then merge? Why not the other way?","A demerger mirrors the parent's shareholding on the record date. Demerging first copies the old ownership: SWS 25.3%, SAMIL 33.4% (which then flows into Motherson). Merging first would copy the new ownership: family ~50%, SWS ~18%, so SWS is diluted in the very business it wanted, the family gets DWH directly, and Motherson loses its DWH stake.","Don't say 'for tax reasons' or 'regulatory reasons'. The real reason is who ends up owning MSWIL."],
 ["Structure","h","Why not just do the demerger, or just the merger?","Demerger only: SWS is satisfied, but the 51/49 SMRP BV split and SAMIL side-pocket remain. Merger only: minorities are satisfied, but SWS is diluted in businesses it never wanted and DWH stays buried. Only both, in sequence, satisfies all three groups.","Show you know each step solves a different stakeholder's problem."],
 ["Structure","m","Why did Motherson keep 33.4% of MSWIL instead of distributing it?","It came automatically from SAMIL's stake. Strategically it keeps Motherson exposed to DWH's high-ROCE cash flows and preserves group control: Motherson 33.4% + SWS 25.3% + family 3.0% = 61.7% promoter group in MSWIL, which keeps it firmly a group company.","Mention control, not only cash flows."],
 ["Math","h","Walk me through the share count.","3,157.9 mn − 1,055.8 mn cancelled (SAMIL's own MSSL shares) + 2,415.4 mn new (473.6 mn SAMIL shares × 5.1) = 4,517.6 mn. Net new 1,359.7 mn = 43% dilution.","Forgetting the cancellation, which gives a wrong 76% dilution."],
 ["Math","h","Why are SAMIL's MSSL shares cancelled?","After the merger, SAMIL's assets belong to MSSL, so MSSL would be holding its own shares. A company can't hold its own shares (outside a buyback), so they are extinguished and SAMIL's owners get fresh MSSL shares instead.","Don't call it a buyback. No cash is paid."],
 ["Math","h","Did minorities gain or lose?","Look through to businesses: public gains in DWH (38.3 → 47.2%), SMRP BV (19.5 → 26.8%) and SAMIL businesses (0 → 26.8%), but is diluted in old MSSL businesses (38.3 → 26.8%). Net: +3.1% EBITDA (FY20), +8% EPS (Q3 FY21). The value outcome depends on whether SAMIL was fairly valued.","Don't judge by the 38% → 27% drop alone. That ignores what they got in return."],
 ["Math","m","Why was it EPS dilutive on FY20 but accretive by Q3 FY21?","SMRP BV had a FY20 loss (PAT −€4 mn) because of greenfield plant start-up losses, so SAMIL's 49% added little profit while shares rose 43%. By FY21 the greenfields turned around, so the extra 49% profit outweighed the dilution.","Link it to the greenfields; that is the key driver."],
 ["Valuation","h","How was the 51:10 ratio determined?","Relative SOTP valuation. Each business valued by DCF (50%) and comparable multiples (50%), NAV calculated but given 0%. MSSL ex-DWH ≈ ₹101/sh, SAMIL ≈ ₹516/sh, ratio ≈ 5.1. Three valuers (PW&Co, BSR, Incwert) all came out at about 5.1.","Don't say 'market price'. The market price method wasn't usable because MSSL ex-DWH had no price and SAMIL was unlisted."],
 ["Valuation","h","What was SAMIL worth and what was really being paid for?","₹24,440 cr in total. Of this, ₹10,675 cr was just its 33.4% of MSSL. So ₹13,765 cr was the price for 49% of SMRP BV + 33.4% of DWH + 28 businesses − SAMIL's debt. That ₹13,765 cr is the number to debate.","Saying 'SAMIL was worth ₹24,400 cr' without splitting out its own MSSL stake."],
 ["Valuation","h","Was the valuation fair? Argue both sides.","For: three valuers agreed, two fairness opinions, DCF captured the expected recovery that did happen, EPS accretive early, 99.44% public approval. Against: priced at the COVID trough, DCF on management projections, analysts called it rich (FY19 peak, premium to peers), stock fell 5 to 9%. Each ₹1,000 cr of overvaluation cost the public ~₹268 cr.","Picking one side only. Sir will want balance, then your judgement."],
 ["Valuation","m","Why NAV at 0% weight?","Both are going concerns, so value comes from earnings, not liquidation. NAV was ₹34 vs ₹148, much lower than earnings-based values.","Don't say NAV 'was wrong'. It is just less relevant for operating businesses."],
 ["Valuation","m","Why is the 1:1 demerger ratio fair?","In a mirror demerger, every holder keeps the same % of every business, so any ratio is value-neutral; only per-share prices change. Incwert said exactly this.","Trying to justify 1:1 with a valuation. None is needed."],
 ["Legal","h","Why a scheme of arrangement and not a share purchase or preferential issue?","Scheme (s.230 to 232): share-for-share with no cash, tax-neutral (s.2(19AA), s.2(1B)), binding on all holders once NCLT sanctions, two steps in one approval, and exempt from the open offer under SAST Reg 10(1)(d). A preferential issue would trigger an open offer and isn't tax-neutral; a cash purchase needs debt and pays promoters cash.","Forgetting the open offer exemption, which is the big one for a promoter going 36% → 50%."],
 ["Legal","h","What approvals were needed and what was the vote test?","Exchanges/SEBI (observation letters Dec 2020), CCI, NCLT (first and second motion), RBI intimation (SAMIL was a CIC), shareholders: three-fourths in value under the Companies Act plus majority of minority under SEBI. Public voted 99.44% in favour.","Missing the majority-of-minority rule. It is why promoters couldn't push it through."],
 ["Legal","m","Difference between appointed, effective and record date?","Appointed: accounting effect (1 Apr 2021 for demerger). Effective: legal effect after NCLT order is filed with RoC (Jan 2022). Record: who gets the new shares (17 Jan 2022).","Mixing up appointed and effective date."],
 ["Governance","h","What are the governance concerns?","(1) Promoter-related valuation of SAMIL. (2) Pledged SAMIL shares (~21% of its MSSL stake). (3) New RPT conflict at MSWIL: family owns 50.4% of Motherson but only ~20% of MSWIL, so value moving MSWIL → Motherson favours them. Mitigants: independent audit committee, promoter directors abstained, majority of minority, capped RPTs (e.g. components from Motherson ≤34.5% of revenue, management fee ≤1%), annual review, 1-year lock-in.","Listing concerns without the mitigants, or mitigants without the concerns."],
 ["Stakeholders","m","What did SWS gain? What did it do afterwards?","Direct 25.3% of MSWIL (about 31% look-through), the technical assistance agreement moved to MSWIL, and a liquid Motherson stake. It sold 3.4% in Mar 2023 and 4.4% in Mar 2024, cutting to 9.7%. That confirms its motive.","Saying SWS 'lost' because it went from 25% to 18%. It wanted that exposure reduced."],
 ["Stakeholders","m","What did the promoters gain?","50.4% direct majority, liquid listed wealth instead of private holdco shares, no conflict-of-interest overhang, and one platform to raise capital. They gave up the private 49% of SMRP BV and their DWH look-through dropped to ~20%.","Ignoring what promoters gave up."],
 ["Post-facto","h","Was it successful? Give your view.","Structurally yes: simpler group, SWS focused, EPS accretive early, acquisitions and QIP since, leverage down to 0.8x. Returns ~4.2x vs Nifty 2.2x since Jul 2020. Caveats: rich SAMIL price at the trough, MSWIL flat since listing (51x → 37x P/E), Vision 2025 (US$36 bn) missed, and the RPT conflict at MSWIL.","Using only the share price. Use the stated objectives as your scorecard."],
 ["Post-facto","m","Why has MSWIL's share price not moved much?","It listed as a scarce high-ROCE pure play at ~51x earnings. Revenue doubled, but PAT stalled around ₹600 cr (FY24 to FY26), so the multiple compressed to ~37x. A demerger reveals value; it doesn't guarantee a re-rating.","Saying 'the demerger failed'. The business grew; the valuation was the issue."],
 ["Post-facto","m","Did the holding company discount go away?","The holdco layer is gone, but Motherson still trades at ~39x P/E vs ~57 to 128x for Bosch, Bharat Forge, Uno Minda and Sona. The market now applies a different discount for global exposure, thin margins and acquisition risk.","Claiming the discount disappeared without checking peer multiples."],
 ["Banker","h","If you were the banker, what would you have done differently?","For minorities: price on normalised earnings or add a true-up, longer promoter lock-in, tighter RPT caps with independent review, a fairness opinion addressed only to public holders. For the company: start investor education (FAQs, accretion math) at announcement, not seven months later.","Giving only criticism. Bankers propose solutions."],
 ["Banker","m","What alternatives would a banker have considered?","Status quo; cash buy of SAMIL's 49%; preferential issue to SAMIL; SWS buying DWH; demerger only; merger only; demerger then merger (chosen). Evaluate on cash, tax, open offer, SWS, minorities and completeness.","Not showing a criteria-based comparison. Use the matrix in Lesson 10."],
 ["Curveball","m","Why was the deal announced in the middle of COVID?","The board had approved the idea in January 2020 and work was under way. A low valuation date helps the side receiving shares if recovery is expected (SAMIL holders), but both sides were valued on the same date, which limits the effect. Waiting also risked losing momentum with SWS.","Assuming timing was pure opportunism. Acknowledge the argument, then nuance it."],
 ["Curveball","m","SAMIL had listed NCDs. What happens to its creditors?","In an amalgamation, SAMIL's liabilities (including NCDs) transfer to MSSL, which is a larger, more diversified credit. ICRA saw no material credit impact. The NCLT dispensed with creditor meetings.","Forgetting creditors exist in a scheme."]
];
const cats=["All",...new Set(LQ.map(q=>q[0]))];const qf=$('#qfilter');
cats.forEach(c=>{const b=document.createElement('button');b.className='btn';b.textContent=c;b.onclick=()=>lq(c);qf.appendChild(b)});
function lq(c){[...qf.children].forEach(b=>b.setAttribute('aria-pressed',b.textContent===c));
 $('#likely').innerHTML=LQ.filter(q=>c==='All'||q[0]===c).map(q=>`<details><summary>${q[2]}<span class="qtag ${q[1]==='h'?'lk-h':'lk-m'}">${q[1]==='h'?'Very likely':'Likely'}</span></summary><div class="a"><p>${q[3]}</p><p class="trap"><b>Trap:</b> ${q[4]}</p></div></details>`).join('')}
lq('All');

/* ================= 18. ASK SIR ================= */
const AS=[
 ["The valuation date was 31 March 2020, near the COVID low, and SAMIL was valued largely on recovery projections. As MSSL's banker, would you have pushed for a true-up or a collar on the ratio? How common are such mechanisms in Indian schemes?","Tests whether price-adjustment tools, standard in private M&A, are practical in NCLT schemes where ratios are fixed upfront."],
 ["DSP Merrill's fairness opinion was addressed to MSSL holders 'other than SAMIL and the Sehgal family'. In practice, how much do NCLT, SEBI and institutional investors actually rely on fairness opinions versus the valuation report?","Probes the real weight of fairness opinions in India and the banker's liability exposure."],
 ["The market price method got zero weight because MSSL ex-DWH had no traded price. Could the valuers have cross-checked using MSSL's market price minus an estimated DWH value? Why do you think that wasn't shown?","Shows you understand market-implied valuation and how analysts would have challenged the DCF."],
 ["Public shareholders approved it 99.44% even though the stock fell 9% on announcement. What changed their minds: the FAQ accretion math, proxy advisor support, or the greenfield recovery? How do bankers manage proxy advisors on promoter deals?","Gets at the investor-relations side of execution, which cases rarely show."],
 ["The family went from 36% to 50.4% with no open offer because of the scheme exemption. Do you see SEBI tightening scrutiny on promoter holdco mergers that cross control thresholds this way?","Regulatory-arbitrage question. Shows awareness that schemes can be used to consolidate control cheaply."],
 ["After the deal, the family owns 50.4% of Motherson but only about 20% of MSWIL look-through, and MSWIL buys up to 34.5% of its inputs from Motherson. How would you protect MSWIL's minorities beyond caps? Is this a common blind spot in Indian demergers?","Spots the new conflict the structure created. Most students miss this."],
 ["SWS later sold Motherson shares in block deals at about a 9% discount. Could a swap have been cleaner, for example SWS swapping its Motherson stake for Motherson's 33.4% of MSWIL? What would that have done to control and tax?","A creative structuring question. It tests whether the cross-holdings could have been unwound more efficiently."],
 ["Motherson trades at ~39x P/E versus ~57 to 128x for Bosch, Bharat Forge, Uno Minda and Sona. Did the restructuring remove the holding company discount, or just replace it with a 'global, low-margin, acquisitive' discount?","Pushes the 'did it create value' question beyond share price returns."],
 ["MSWIL listed at about 51x earnings and has since de-rated to about 37x. When you advise on a pure-play demerger, how do you set the board's expectations about a 'demerger premium'?","Practical advisory question about managing client expectations."],
 ["SAMIL was an RBI-registered core investment company with listed NCDs. Did the NCD holders or RBI raise any issues, and how do bankers handle debt holders in a holdco amalgamation?","Brings in the debt side of a scheme, which most of the class will ignore."],
 ["In a scheme like this with no capital raise, how are bankers typically paid, and how do banks manage conflicts when they have other mandates from the same promoter group (BofA disclosed it had)?","Shows interest in the business of banking itself: fees, conflicts, independence."],
 ["If Motherson came to you today, would you advise a further simplification, for example merging MSWIL back once SWS's goals are met, or selling the 33.4% stake to fund acquisitions?","Forward-looking, invites sir's own view. A good way to end."]
];
$('#asksir').innerHTML=AS.map((q,i)=>`<details><summary>Q${i+1}. ${q[0]}</summary><div class="a"><p class="why"><b>Why it's a good question:</b> ${q[1]}</p></div></details>`).join('');

$('#qa').innerHTML=QA.map(([q,a])=>`<details><summary>${q}</summary><div class="a"><p>${a}</p></div></details>`).join('');
