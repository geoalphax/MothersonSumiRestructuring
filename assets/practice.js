/* ===== Practice Lab engine ===== */
(function(){
const $=s=>document.querySelector(s);
const store=window.raStore||{get:(k,d)=>d,set:()=>{}};
/* seeded RNG */
function rng(seed){let a=seed>>>0;return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function R(seed){const r=rng(seed);return{int:(a,b,s=1)=>a+Math.floor(r()*((b-a)/s+1))*s,pick:a=>a[Math.floor(r()*a.length)],f:(a,b,d=2)=>+(a+r()*(b-a)).toFixed(d)}}
/* formats */
const L='en-IN';
const F={n0:v=>v.toLocaleString(L,{maximumFractionDigits:0}),n1:v=>v.toLocaleString(L,{minimumFractionDigits:1,maximumFractionDigits:1}),n2:v=>v.toLocaleString(L,{minimumFractionDigits:2,maximumFractionDigits:2}),
 pct:v=>(v*100).toFixed(1)+'%',pct2:v=>(v*100).toFixed(2)+'%',rs:v=>'₹'+v.toLocaleString(L,{minimumFractionDigits:2,maximumFractionDigits:2}),rs0:v=>'₹'+v.toLocaleString(L,{maximumFractionDigits:0}),
 cr:v=>'₹'+v.toLocaleString(L,{maximumFractionDigits:0})+' cr',x:v=>v.toFixed(3),yn:v=>v?'Yes (1)':'No (0)',pp:v=>(v*100).toFixed(1)+' pp'};
const UNIT={n0:'number',n1:'mn shares',n2:'number',pct:'%',pct2:'%',rs:'₹',rs0:'₹',cr:'₹ cr',x:'ratio',yn:'1 or 0',pp:'percentage points'};
const f=(v,k)=>F[k](v);
const T=(rows)=>'<table class="given"><tbody>'+rows.map(r=>`<tr><td>${r[0]}</td><td class="num">${r[1]}</td></tr>`).join('')+'</tbody></table>';

/* ===================== CASES ===================== */
const C=[];
const add=(o)=>C.push(o);

add({id:'merger-basic',cat:'Merger',lvl:1,title:'Simple share-swap merger',gen:r=>{
 const SA=r.int(800,1500,50),pa=r.int(40,65)/100,vA=r.int(150,400,10),SB=r.int(200,800,50),pb=r.int(50,75)/100,vB=r.int(50,300,10);
 const PA=SA*pa,UA=SA-PA,PB=SB*pb,UB=SB-PB,ratio=vB/vA,n=SB*ratio,t=SA+n;
 return{story:`Acquirer A merges Target B. Both are valued at fair value per share. B's shareholders get A shares; B disappears.`,
 given:T([['A shares (mn)',F.n0(SA)],['  A promoter',F.n0(PA)],['  A public',F.n0(UA)],['A value per share',F.rs0(vA)],['B shares (mn)',F.n0(SB)],['  B promoter',F.n0(PB)],['  B public',F.n0(UB)],['B value per share',F.rs0(vB)]]),
 qs:[{q:'Swap ratio (A shares per B share)',a:ratio,k:'x',s:[`Ratio = B value ÷ A value = ${vB} ÷ ${vA} = ${F.x(ratio)}`]},
  {q:'New A shares issued (mn)',a:n,k:'n1',s:[`New shares = B shares × ratio = ${F.n0(SB)} × ${F.x(ratio)} = ${F.n1(n)}`]},
  {q:'Total A shares after (mn)',a:t,k:'n1',s:[`Total = ${F.n0(SA)} + ${F.n1(n)} = ${F.n1(t)} (no cross-holding to cancel)`]},
  {q:'A promoter % after',a:PA/t,k:'pct',s:[`${F.n0(PA)} ÷ ${F.n1(t)} = ${F.pct(PA/t)}`]},
  {q:'B promoter % after',a:PB*ratio/t,k:'pct',s:[`B promoter gets ${F.n0(PB)} × ${F.x(ratio)} = ${F.n1(PB*ratio)} shares → ÷ ${F.n1(t)} = ${F.pct(PB*ratio/t)}`]}],
 bars:{before:[['A promoter',PA/SA,'s-fam'],['A public',UA/SA,'s-pub']],after:[['A promoter',PA/t,'s-fam'],['A public',UA/t,'s-pub'],['B promoter',PB*ratio/t,'s-par'],['B public',UB*ratio/t,'s-sws']]},
 insight:'Value per share after = (A value + B value) ÷ total shares. It equals A\'s old value per share, so nobody gains or loses at a fair ratio.'}}});

add({id:'merger-premium',cat:'Merger',lvl:1,title:'Merger at a control premium',gen:r=>{
 const pA=r.int(200,600,10),pT=r.int(60,250,5),prem=r.int(10,35,5)/100,ST=r.int(100,500,25),SA=r.int(600,2000,100);
 const ratio=pT*(1+prem)/pA,n=ST*ratio,t=SA+n,val=ratio*pA;
 return{story:`A listed acquirer buys a listed target in an all-share deal, offering target holders a ${F.pct(prem)} premium to the target's market price.`,
 given:T([['Acquirer share price',F.rs0(pA)],['Acquirer shares (mn)',F.n0(SA)],['Target share price',F.rs0(pT)],['Target shares (mn)',F.n0(ST)],['Premium offered',F.pct(prem)]]),
 qs:[{q:'Swap ratio',a:ratio,k:'x',s:[`Offer value per target share = ${pT} × (1 + ${F.pct(prem)}) = ${F.rs(pT*(1+prem))}`,`Ratio = ${F.rs(pT*(1+prem))} ÷ ${pA} = ${F.x(ratio)}`]},
  {q:'Value received per target share (₹, at acquirer price)',a:val,k:'rs',s:[`${F.x(ratio)} × ${pA} = ${F.rs(val)}`]},
  {q:'Target holders\' % of combined company',a:n/t,k:'pct',s:[`New shares ${F.n0(ST)} × ${F.x(ratio)} = ${F.n1(n)}; total ${F.n1(t)}; % = ${F.pct(n/t)}`]}],
 insight:'The premium is a value transfer from acquirer holders to target holders, justified only if synergies are worth more than the premium.'}}});

add({id:'face-value',cat:'Merger',lvl:1,title:'Face value trap (₹1 vs ₹10 shares)',gen:r=>{
 const fvA=r.pick([1,2]),fvT=r.pick([10,5]),vA=r.int(80,200,5),vT=r.int(300,900,10),ST=r.int(100,600,10);
 const ratio=vT/vA,n=ST*ratio,cap=n*fvA/10;
 return{story:`Target shares have a face value of ₹${fvT}; acquirer shares ₹${fvA}. Face value is the legal "par" amount printed on the share, not what it's worth.`,
 given:T([['Acquirer value per share',F.rs0(vA)],['Acquirer face value',F.rs0(fvA)],['Target value per share',F.rs0(vT)],['Target face value',F.rs0(fvT)],['Target shares (mn)',F.n0(ST)]]),
 qs:[{q:'Swap ratio',a:ratio,k:'x',s:[`Face value is irrelevant. Ratio = ${vT} ÷ ${vA} = ${F.x(ratio)}`]},
  {q:'New acquirer shares (mn)',a:n,k:'n1',s:[`${F.n0(ST)} × ${F.x(ratio)} = ${F.n1(n)}`]},
  {q:'Increase in acquirer share capital (₹ cr)',a:cap,k:'n2',s:[`Share capital = new shares × face value = ${F.n1(n)} mn × ₹${fvA} = ₹${F.n1(n*fvA)} mn = ₹${F.n2(cap)} cr`]}],
 insight:'Motherson: 51 MSSL shares of ₹1 for 10 SAMIL shares of ₹10. The ratio comes from value, never from face value.'}}});

add({id:'holdco-cancel',cat:'Holdco',lvl:2,title:'Promoter holdco merger with cancellation',gen:r=>{
 const LS=r.int(800,2000,100),hp=r.int(25,45)/100,vL=r.int(40,200,5),HS=r.int(50,300,10),OA=r.int(2000,15000,500),ND=r.int(0,3000,250);
 const H=LS*hp,HE=H*vL/10+OA-ND,hps=HE*10/HS,ratio=hps/vL,n=HS*ratio,t=LS-H+n;
 return{story:`The promoter's unlisted HoldCo owns ${F.pct(hp)} of ListCo plus other businesses. HoldCo merges into ListCo. The promoter owns 100% of HoldCo; everyone else in ListCo is public.`,
 given:T([['ListCo shares (mn)',F.n0(LS)],['  held by HoldCo',F.n0(H)],['ListCo value per share',F.rs0(vL)],['HoldCo shares (mn)',F.n0(HS)],['HoldCo other assets (₹ cr, equity value)',F.n0(OA)],['HoldCo own net debt (₹ cr)',F.n0(ND)]]),
 qs:[{q:'HoldCo equity value (₹ cr)',a:HE,k:'cr',s:[`ListCo stake = ${F.n0(H)} mn × ₹${vL} ÷ 10 = ₹${F.n0(H*vL/10)} cr`,`+ other assets ₹${F.n0(OA)} cr − net debt ₹${F.n0(ND)} cr = ₹${F.n0(HE)} cr`]},
  {q:'HoldCo value per share (₹)',a:hps,k:'rs',s:[`₹${F.n0(HE)} cr × 10 ÷ ${F.n0(HS)} mn = ${F.rs(hps)}`]},
  {q:'Swap ratio',a:ratio,k:'x',s:[`${F.rs(hps)} ÷ ₹${vL} = ${F.x(ratio)}`]},
  {q:'Total ListCo shares after (mn)',a:t,k:'n1',s:[`${F.n0(LS)} − ${F.n0(H)} cancelled + ${F.n1(n)} new = ${F.n1(t)}`]},
  {q:'Promoter % after',a:n/t,k:'pct',s:[`${F.n1(n)} ÷ ${F.n1(t)} = ${F.pct(n/t)}`]}],
 bars:{before:[['HoldCo',hp,'s-par'],['Public',1-hp,'s-pub']],after:[['Promoter',n/t,'s-fam'],['Public',(LS-H)/t,'s-pub']]},
 insight:'Check: value per share after = (ListCo value + HoldCo other assets − debt) ÷ total = ₹'+vL+'. Unchanged, so fair. This is exactly the SAMIL → MSSL step.'}}});

add({id:'sotp-ev',cat:'Valuation',lvl:2,title:'Build HoldCo value from EV (SOTP)',gen:r=>{
 const ev=r.int(8000,30000,500),opd=r.int(1000,8000,250),st=r.int(40,80)/100,lsh=r.int(50,300,10),lp=r.int(50,400,10),hd=r.int(200,3000,100),HS=r.int(50,400,10);
 const oe=ev-opd,share=oe*st,lv=lsh*lp/10,gav=share+lv,he=gav-hd,ps=he*10/HS;
 return{story:`HoldCo owns ${F.pct(st)} of an unlisted OpCo and a block of listed shares. Value it sum-of-the-parts. OpCo has no other minority investors besides HoldCo's partner.`,
 given:T([['OpCo enterprise value (₹ cr)',F.n0(ev)],['OpCo net debt (₹ cr)',F.n0(opd)],['HoldCo stake in OpCo',F.pct(st)],['Listed shares held (mn)',F.n0(lsh)],['Listed share price',F.rs0(lp)],['HoldCo own net debt (₹ cr)',F.n0(hd)],['HoldCo shares (mn)',F.n0(HS)]]),
 qs:[{q:'OpCo equity value (₹ cr)',a:oe,k:'cr',s:[`Equity = EV − net debt = ${F.n0(ev)} − ${F.n0(opd)} = ₹${F.n0(oe)} cr`]},
  {q:'HoldCo\'s share of OpCo (₹ cr)',a:share,k:'cr',s:[`${F.pct(st)} × ₹${F.n0(oe)} cr = ₹${F.n0(share)} cr (taking only your % is how the partner's "minority" is excluded)`]},
  {q:'HoldCo gross asset value (₹ cr)',a:gav,k:'cr',s:[`Listed stake = ${F.n0(lsh)} × ₹${lp} ÷ 10 = ₹${F.n0(lv)} cr`,`GAV = ${F.n0(share)} + ${F.n0(lv)} = ₹${F.n0(gav)} cr`]},
  {q:'HoldCo equity value (₹ cr)',a:he,k:'cr',s:[`GAV − HoldCo net debt = ${F.n0(gav)} − ${F.n0(hd)} = ₹${F.n0(he)} cr`]},
  {q:'HoldCo value per share (₹)',a:ps,k:'rs',s:[`₹${F.n0(he)} cr × 10 ÷ ${F.n0(HS)} mn = ${F.rs(ps)}`]}],
 insight:'Two levels of "EV − net debt": once inside each business, once at HoldCo. Never subtract the same debt twice. In a merger there is no holdco discount because the holdco disappears.'}}});

add({id:'sub-into-parent',cat:'Merger',lvl:2,title:'Merging a listed subsidiary into its parent',gen:r=>{
 const PS=r.int(1000,3000,100),vP=r.int(100,500,10),SS=r.int(200,800,25),k=r.int(51,85)/100,vS=r.int(40,300,5);
 const ratio=vS/vP,mino=SS*(1-k),n=mino*ratio,t=PS+n;
 return{story:`Parent owns ${F.pct(k)} of its listed Subsidiary. The subsidiary merges into the parent. Shares are issued only to the subsidiary's minority holders; the parent's own stake is simply cancelled.`,
 given:T([['Parent shares (mn)',F.n0(PS)],['Parent value per share',F.rs0(vP)],['Subsidiary shares (mn)',F.n0(SS)],['Parent\'s stake in subsidiary',F.pct(k)],['Subsidiary value per share',F.rs0(vS)]]),
 qs:[{q:'Swap ratio',a:ratio,k:'x',s:[`${vS} ÷ ${vP} = ${F.x(ratio)}`]},
  {q:'Subsidiary shares held by minorities (mn)',a:mino,k:'n1',s:[`${F.n0(SS)} × (1 − ${F.pct(k)}) = ${F.n1(mino)}`]},
  {q:'New parent shares issued (mn)',a:n,k:'n1',s:[`Only minorities get shares: ${F.n1(mino)} × ${F.x(ratio)} = ${F.n1(n)}`]},
  {q:'Minorities\' % of parent after',a:n/t,k:'pct',s:[`${F.n1(n)} ÷ (${F.n0(PS)} + ${F.n1(n)}) = ${F.pct(n/t)}`]}],
 insight:'Common when groups collapse layers (e.g. Tata Steel absorbing listed subsidiaries). The parent never issues shares to itself.'}}});

add({id:'reverse-merger',cat:'Merger',lvl:2,title:'Reverse merger: big private into small listed',gen:r=>{
 const LS=r.int(50,200,10),pp=r.int(30,60)/100,vL=r.int(20,80,5),BS=r.int(100,500,10),vB=r.int(200,800,10);
 const ratio=vB/vL,n=BS*ratio,t=LS+n;
 return{story:`A large unlisted company (owned by its founders) merges into a small listed company to get a listing without an IPO.`,
 given:T([['Listed shares (mn)',F.n0(LS)],['  listed promoter',F.pct(pp)],['Listed value per share',F.rs0(vL)],['Private co shares (mn)',F.n0(BS)],['Private co value per share',F.rs0(vB)]]),
 qs:[{q:'New listed shares issued (mn)',a:n,k:'n1',s:[`Ratio = ${vB} ÷ ${vL} = ${F.x(ratio)}; new = ${F.n0(BS)} × ${F.x(ratio)} = ${F.n1(n)}`]},
  {q:'Founders\' % of listed company after',a:n/t,k:'pct',s:[`${F.n1(n)} ÷ (${F.n0(LS)} + ${F.n1(n)}) = ${F.pct(n/t)}`]},
  {q:'Old public holders\' % after',a:LS*(1-pp)/t,k:'pct2',s:[`${F.n1(LS*(1-pp))} ÷ ${F.n1(t)} = ${F.pct2(LS*(1-pp)/t)}`]}],
 insight:'Control flips to the private company\'s founders. SEBI scrutinises these closely and the listed entity must still meet minimum public shareholding.'}}});

add({id:'mirror-demerger',cat:'Demerger',lvl:1,title:'Mirror demerger with a ratio',gen:r=>{
 const PS=r.int(1000,4000,100),a=r.int(30,55)/100,b=r.int(10,25)/100,nu=r.pick([1,1,2,3]),de=r.pick([1,2,4,5,10]);
 const P=PS*a,FII=PS*b,U=PS-P-FII,t=PS*nu/de;
 return{story:`The parent demerges a division into NewCo. Every holder gets ${nu} NewCo share(s) for every ${de} parent shares.`,
 given:T([['Parent shares (mn)',F.n0(PS)],['  Promoter',F.n0(P)],['  FIIs',F.n0(FII)],['  Public',F.n0(U)],['Entitlement',`${nu} : ${de}`]]),
 qs:[{q:'NewCo total shares (mn)',a:t,k:'n1',s:[`${F.n0(PS)} × ${nu} ÷ ${de} = ${F.n1(t)}`]},
  {q:'Promoter\'s NewCo shares (mn)',a:P*nu/de,k:'n1',s:[`${F.n0(P)} × ${nu} ÷ ${de} = ${F.n1(P*nu/de)}`]},
  {q:'Promoter % of NewCo',a:a,k:'pct',s:[`Mirror: same as % of parent = ${F.pct(a)}`]},
  {q:'FII % of NewCo',a:b,k:'pct',s:[`Mirror: ${F.pct(b)}`]}],
 bars:{before:[['Promoter',a,'s-fam'],['FIIs',b,'s-sws'],['Public',1-a-b,'s-pub']],after:[['Promoter',a,'s-fam'],['FIIs',b,'s-sws'],['Public',1-a-b,'s-pub']]},
 insight:'The ratio only sets how many shares exist, i.e. the per-share price. Percentages never change in a mirror demerger.'}}});

add({id:'demerger-retained',cat:'Demerger',lvl:2,title:'Demerger where the parent keeps a stake (ITC-style)',gen:r=>{
 const PS=r.int(500,2000,100),ip=r.int(55,80)/100,nu=1,de=r.pick([5,10,20]),kp=r.int(20,50,5)/100;
 const sh=PS*nu/de,t=sh/(1-kp),pa=t*kp,dir=PS*ip*nu/de/t,lt=dir+ip*kp;
 return{story:`Parent demerges a business into NewCo but keeps ${F.pct(kp)} of NewCo itself; shareholders get the rest directly. Parent has no promoter: institutions ${F.pct(ip)}, retail the rest.`,
 given:T([['Parent shares (mn)',F.n0(PS)],['Institutions in parent',F.pct(ip)],['Entitlement',`${nu} : ${de}`],['Parent keeps of NewCo',F.pct(kp)]]),
 qs:[{q:'NewCo shares issued to shareholders (mn)',a:sh,k:'n1',s:[`${F.n0(PS)} × ${nu} ÷ ${de} = ${F.n1(sh)}`]},
  {q:'NewCo total shares (mn)',a:t,k:'n1',s:[`Holders own ${F.pct(1-kp)}, so total = ${F.n1(sh)} ÷ ${F.pct(1-kp)} = ${F.n1(t)}`]},
  {q:'Institutions\' direct % of NewCo',a:dir,k:'pct',s:[`${F.pct(ip)} × ${F.pct(1-kp)} = ${F.pct(dir)}`]},
  {q:'Institutions\' look-through % of NewCo',a:lt,k:'pct',s:[`Direct ${F.pct(dir)} + ${F.pct(ip)} × parent's ${F.pct(kp)} = ${F.pct(lt)}`,'Same as their % of the parent: nothing changed economically.']}],
 insight:'ITC kept ~40% of ITC Hotels. Like Motherson keeping 33.4% of MSWIL, the retained stake keeps cash flows and control in the group.'}}});

add({id:'ex-price-cost',cat:'Demerger',lvl:2,title:'Ex-date price and tax cost split',gen:r=>{
 const P0=r.int(300,1200,10),D=r.int(40,300,5),C=r.int(100,800,10),NW=r.int(10000,40000,1000),NB=r.int(1000,8000,250);
 const ex=P0-D,cn=C*NB/NW;
 return{story:`On the ex-date the parent's price drops by the value of the business leaving. For tax, the original cost of your parent shares is split between parent and NewCo in proportion to the net book value transferred (Income-tax Act s.49(2C)/(2D)).`,
 given:T([['Parent price before ex-date',F.rs0(P0)],['Value of demerged business per parent share',F.rs0(D)],['Your cost per parent share',F.rs0(C)],['Parent net worth before demerger (₹ cr)',F.n0(NW)],['Net book value of undertaking moved (₹ cr)',F.n0(NB)]]),
 qs:[{q:'Expected parent ex-price (₹)',a:ex,k:'rs',s:[`${P0} − ${D} = ${F.rs(ex)}`]},
  {q:'Tax cost allocated to each NewCo share (₹, 1:1)',a:cn,k:'rs',s:[`${C} × ${F.n0(NB)} ÷ ${F.n0(NW)} = ${F.rs(cn)}`]},
  {q:'Tax cost left in each parent share (₹)',a:C-cn,k:'rs',s:[`${C} − ${F.n2(cn)} = ${F.rs(C-cn)}`]}],
 insight:'Holding period of NewCo shares includes the time you held the parent shares, so long-term status carries over.'}}});

function compositeData(r){const h=r.int(25,40),s=r.int(15,30),f=r.int(2,8);const u=100-h-s-f;const O=r.int(20,60);const g=r.int(70,95)/100;return{h,s,f,u,O,g}}
add({id:'composite-demerge-merge',cat:'Composite',lvl:3,title:'Composite: demerge first, then merge (Motherson pattern)',gen:r=>{
 const {h,s,f,u,O,g}=compositeData(r);const n=h+O,t=100-h+n,fam=(f+g*n)/t;
 return{story:`ParentCo (100 shares) is owned by the promoter's HoldCo, a JV Partner, the promoter directly and the public. Step 1: demerge Business X into NewCo (1:1). Step 2: merge HoldCo into ParentCo. HoldCo's other assets are worth ${O} ParentCo shares (post-demerger values). The promoter owns ${F.pct(g)} of HoldCo; others own the rest.`,
 given:T([['HoldCo',h],['JV Partner',s],['Promoter direct',f],['Public',u],['HoldCo other assets (in ParentCo-share equivalents)',O],['Promoter\'s share of HoldCo',F.pct(g)]]),
 qs:[{q:'JV Partner % of NewCo',a:s/100,k:'pct',s:['NewCo mirrors ParentCo before the merger: '+s+'%']},
  {q:'ParentCo shares issued to HoldCo owners',a:n,k:'n0',s:[`HoldCo is worth its ${h} ParentCo shares + ${O} of other assets = ${n} ParentCo shares`]},
  {q:'ParentCo shares after merger',a:t,k:'n0',s:[`100 − ${h} cancelled + ${n} new = ${t}`]},
  {q:'Promoter % of ParentCo after',a:fam,k:'pct',s:[`(${f} + ${F.pct(g)} × ${n}) ÷ ${t} = ${F.pct(fam)}`]},
  {q:'ParentCo\'s % of NewCo after the merger',a:h/100,k:'pct',s:[`HoldCo's ${h}% of NewCo moves into ParentCo with the merger: ${h}%`]}],
 insight:'Order matters: a demerger copies ownership at that moment. Demerging first gives the JV partner its full stake in NewCo.'}}});

add({id:'composite-merge-first',cat:'Composite',lvl:3,title:'Composite: what if you merge first?',gen:r=>{
 const {h,s,f,u,O,g}=compositeData(r);const n=h+O,t=100-h+n,fam=(f+g*n)/t;
 return{story:`Same group as the previous case, but the steps are reversed: merge HoldCo into ParentCo first, then demerge Business X into NewCo (1:1). For simplicity assume the same share issuance.`,
 given:T([['HoldCo',h],['JV Partner',s],['Promoter direct',f],['Public',u],['HoldCo other assets (ParentCo-share equivalents)',O],['Promoter\'s share of HoldCo',F.pct(g)]]),
 qs:[{q:'JV Partner % of NewCo',a:s/t,k:'pct',s:[`After merging, ParentCo has ${t} shares; partner still has ${s}. NewCo mirrors: ${s} ÷ ${t} = ${F.pct(s/t)}`]},
  {q:'Promoter % of NewCo',a:fam,k:'pct',s:[`Mirrors merged ParentCo: ${F.pct(fam)}`]},
  {q:'Loss in JV Partner\'s NewCo stake vs demerge-first (pp)',a:s/100-s/t,k:'pp',s:[`${s}% − ${F.pct(s/t)} = ${F.pp(s/100-s/t)}`]}],
 insight:'This is exactly why Motherson demerged DWH first: merging first would have diluted SWS in the business it wanted and handed the promoter a direct majority of it.'}}});

add({id:'value-leak',cat:'Value transfer',lvl:2,title:'Value leakage when the ratio is too high',gen:r=>{
 const LS=r.int(800,2000,100),hp=r.int(25,45)/100,vL=r.int(40,150,5),HS=r.int(50,200,10),OA=r.int(3000,12000,500);
 const H=LS*hp,HE=H*vL/10+OA,fair=HE*10/HS/vL,over=r.int(10,30,5)/100,ag=fair*(1+over),t=LS-H+HS*ag,v=(LS*vL/10+OA)*10/t,pub=LS-H,delta=pub*v/10-pub*vL/10;
 return{story:`Same set-up as a holdco merger, but the board agrees a ratio ${F.pct(over)} above fair value. HoldCo has no debt.`,
 given:T([['ListCo shares (mn)',F.n0(LS)],['  held by HoldCo',F.n0(H)],['ListCo value per share',F.rs0(vL)],['HoldCo shares (mn)',F.n0(HS)],['HoldCo other assets (₹ cr)',F.n0(OA)],['Ratio agreed',F.x(ag)]]),
 qs:[{q:'Fair swap ratio',a:fair,k:'x',s:[`HoldCo value = ${F.n0(H)} × ${vL} ÷ 10 + ${F.n0(OA)} = ₹${F.n0(HE)} cr → ₹${F.n2(HE*10/HS)}/share → ÷ ${vL} = ${F.x(fair)}`]},
  {q:'Value per ListCo share after, at agreed ratio (₹)',a:v,k:'rs',s:[`Total shares = ${F.n0(LS)} − ${F.n0(H)} + ${F.n0(HS)} × ${F.x(ag)} = ${F.n1(t)}`,`Value = (${F.n0(LS*vL/10)} + ${F.n0(OA)}) cr ÷ ${F.n1(t)} mn × 10 = ${F.rs(v)}`]},
  {q:'Public gain / (loss) (₹ cr)',a:delta,k:'cr',s:[`${F.n0(pub)} mn × (${F.n2(v)} − ${vL}) ÷ 10 = ₹${F.n0(delta)} cr`]}],
 insight:'Zero-sum: what the public loses, the promoter gains. That is why promoter-linked schemes need independent valuers, fairness opinions and a majority-of-minority vote.'}}});

add({id:'valuer-weights',cat:'Valuation',lvl:1,title:'From valuer table to "N : 10"',gen:r=>{
 const aD=r.int(90,130),aC=r.int(80,120),tD=r.int(400,650),tC=r.int(380,600),w=r.pick([0.5,0.5,0.6,0.7]);
 const A=aD*w+aC*(1-w),Tg=tD*w+tC*(1-w),ratio=Tg/A,N=Math.round(ratio*10);
 return{story:`A valuer values both companies by DCF and comparable multiples (CCM), weighting DCF ${F.pct(w)} and CCM ${F.pct(1-w)}. NAV gets 0%.`,
 given:T([['Acquirer DCF (₹/share)',aD],['Acquirer CCM (₹/share)',aC],['Target DCF (₹/share)',tD],['Target CCM (₹/share)',tC],['Weight on DCF',F.pct(w)]]),
 qs:[{q:'Acquirer weighted value (₹)',a:A,k:'rs',s:[`${aD} × ${w} + ${aC} × ${(1-w).toFixed(1)} = ${F.rs(A)}`]},
  {q:'Target weighted value (₹)',a:Tg,k:'rs',s:[`${tD} × ${w} + ${tC} × ${(1-w).toFixed(1)} = ${F.rs(Tg)}`]},
  {q:'Swap ratio',a:ratio,k:'x',s:[`${F.n2(Tg)} ÷ ${F.n2(A)} = ${F.x(ratio)}`]},
  {q:'Ratio expressed as N acquirer shares for 10 target shares (N)',a:N,k:'n0',s:[`${F.x(ratio)} × 10 ≈ ${N} → "${N} : 10"`]}],
 insight:'Motherson: PW&Co 100.51 vs 512.81, BSR 101.81 vs 519.27, Incwert 101 vs 516, all ≈ 5.1 → 51 : 10.'}}});

add({id:'eps',cat:'EPS',lvl:1,title:'EPS accretion or dilution',gen:r=>{
 const PA=r.int(300,2000,10),SA=r.int(1000,4000,100),PT=r.int(100,1200,10),ST=r.int(100,600,10),ratio=r.f(1,6,2);
 const e0=PA/SA*10,n=ST*ratio,e1=(PA+PT)/(SA+n)*10;
 return{story:`Acquirer merges Target in an all-share deal. No synergies assumed.`,
 given:T([['Acquirer PAT (₹ cr)',F.n0(PA)],['Acquirer shares (mn)',F.n0(SA)],['Target PAT (₹ cr)',F.n0(PT)],['Target shares (mn)',F.n0(ST)],['Swap ratio',F.n2(ratio)]]),
 qs:[{q:'EPS before (₹)',a:e0,k:'rs',s:[`₹${F.n0(PA)} cr ÷ ${F.n0(SA)} mn × 10 = ${F.rs(e0)}`]},
  {q:'EPS after (₹)',a:e1,k:'rs',s:[`New shares ${F.n0(ST)} × ${ratio} = ${F.n1(n)}; (${F.n0(PA)} + ${F.n0(PT)}) ÷ (${F.n0(SA)} + ${F.n1(n)}) × 10 = ${F.rs(e1)}`]},
  {q:'Accretion / (dilution)',a:e1/e0-1,k:'pct',s:[`${F.n2(e1)} ÷ ${F.n2(e0)} − 1 = ${F.pct(e1/e0-1)}`]}],
 insight:'Rule of thumb: an all-stock deal is EPS-accretive if you "pay" a lower P/E for the target than your own P/E.'}}});

add({id:'eps-breakeven',cat:'EPS',lvl:2,title:'Maximum ratio before EPS dilution',gen:r=>{
 const PA=r.int(500,3000,50),SA=r.int(1000,4000,100),PT=r.int(100,1000,10),ST=r.int(100,800,10);
 const e0=PA/SA*10,maxN=SA*PT/PA,maxR=maxN/ST;
 return{story:`How many shares can the acquirer issue before EPS falls? EPS stays flat when the target's profit "buys" exactly its share of the enlarged share count.`,
 given:T([['Acquirer PAT (₹ cr)',F.n0(PA)],['Acquirer shares (mn)',F.n0(SA)],['Target PAT (₹ cr)',F.n0(PT)],['Target shares (mn)',F.n0(ST)]]),
 qs:[{q:'Acquirer EPS (₹)',a:e0,k:'rs',s:[`${F.n0(PA)} ÷ ${F.n0(SA)} × 10 = ${F.rs(e0)}`]},
  {q:'Max new shares for EPS-neutral (mn)',a:maxN,k:'n1',s:[`Solve (PA+PT)/(SA+N) = PA/SA → N = SA × PT ÷ PA = ${F.n0(SA)} × ${F.n0(PT)} ÷ ${F.n0(PA)} = ${F.n1(maxN)}`]},
  {q:'Max swap ratio for EPS-neutral',a:maxR,k:'x',s:[`${F.n1(maxN)} ÷ ${F.n0(ST)} = ${F.x(maxR)}`]}],
 insight:'Bankers show this "breakeven ratio" in board decks next to the fair ratio. If fair > breakeven, the deal is dilutive in year one and needs a growth or synergy story.'}}});

add({id:'control-threshold',cat:'Control',lvl:3,title:'At what ratio does the promoter cross 50%?',gen:r=>{
 const LS=r.int(1000,3000,100),hp=r.int(25,40)/100,d=r.int(1,5)/100,HS=r.int(200,600,10),g=r.int(70,95)/100,ra=r.f(3,7,1);
 const H=LS*hp,D=LS*d,t=LS-H+HS*ra,pct=(D+g*HS*ra)/t,rstar=(0.5*(LS-H)-D)/((g-0.5)*HS);
 return{story:`Promoter holds ${F.pct(d)} of ListCo directly and ${F.pct(g)} of HoldCo, which owns ${F.pct(hp)} of ListCo. HoldCo merges into ListCo.`,
 given:T([['ListCo shares (mn)',F.n0(LS)],['  held by HoldCo',F.n0(H)],['  promoter direct',F.n0(D)],['HoldCo shares (mn)',F.n0(HS)],['Promoter share of HoldCo',F.pct(g)],['Proposed ratio',ra]]),
 qs:[{q:'Total ListCo shares at proposed ratio (mn)',a:t,k:'n1',s:[`${F.n0(LS)} − ${F.n0(H)} + ${F.n0(HS)} × ${ra} = ${F.n1(t)}`]},
  {q:'Promoter % at proposed ratio',a:pct,k:'pct',s:[`(${F.n0(D)} + ${F.pct(g)} × ${F.n1(HS*ra)}) ÷ ${F.n1(t)} = ${F.pct(pct)}`]},
  {q:'Ratio at which promoter hits exactly 50%',a:rstar,k:'x',s:['Set (D + g·HS·r) ÷ (LS − H + HS·r) = 0.5',`r = [0.5 × (LS − H) − D] ÷ [(g − 0.5) × HS] = [0.5 × ${F.n0(LS-H)} − ${F.n0(D)}] ÷ [${(g-0.5).toFixed(2)} × ${F.n0(HS)}] = ${F.x(rstar)}`]}],
 insight:'In Motherson the family landed at 50.4%, just over the line. Control thresholds (25%, 50%, 75%) make the ratio strategically sensitive, not just financially.'}}});

add({id:'vote',cat:'Votes',lvl:1,title:'Will the scheme pass?',gen:r=>{
 const vf=r.int(1500,3000,10),va=r.int(10,700,5),pf=r.int(200,900,5),pa=r.int(5,700,5);
 const p1=vf/(vf+va),pass=(p1>=0.75&&pf>pa)?1:0;
 return{story:`A promoter-linked scheme needs (a) three-fourths in value of votes cast under the Companies Act and (b) SEBI's majority of minority: public FOR must exceed public AGAINST.`,
 given:T([['All votes FOR (mn shares)',F.n0(vf)],['All votes AGAINST (mn shares)',F.n0(va)],['Public FOR (mn shares)',F.n0(pf)],['Public AGAINST (mn shares)',F.n0(pa)]]),
 qs:[{q:'% FOR by value (all votes)',a:p1,k:'pct2',s:[`${vf} ÷ (${vf} + ${va}) = ${F.pct2(p1)}, needs ≥ 75%`]},
  {q:'Public % FOR',a:pf/(pf+pa),k:'pct2',s:[`${pf} ÷ (${pf} + ${pa}) = ${F.pct2(pf/(pf+pa))}, needs > 50%`]},
  {q:'Does it pass? (1 = yes, 0 = no)',a:pass,k:'yn',s:[pass?'Both tests met.':'At least one test fails, so the scheme fails at the meeting.']}],
 insight:'Motherson: 99.44% of public votes in favour. Promoters can carry test (a) alone; test (b) is the minority\'s veto.'}}});

add({id:'lookthrough',cat:'Look-through',lvl:2,title:'Three-level look-through',gen:r=>{
 const a=r.int(20,60)/100,b=r.int(30,70)/100,c=r.int(40,100)/100,d=r.int(0,15)/100;
 const lb=d+a*b,lc=lb*c;
 return{story:`An investor owns ${F.pct(a)} of HoldA and ${F.pct(d)} of OpB directly. HoldA owns ${F.pct(b)} of OpB. OpB owns ${F.pct(c)} of AssetC.`,
 given:T([['Investor in HoldA',F.pct(a)],['Investor in OpB directly',F.pct(d)],['HoldA in OpB',F.pct(b)],['OpB in AssetC',F.pct(c)]]),
 qs:[{q:'Investor look-through % of OpB',a:lb,k:'pct',s:[`Direct ${F.pct(d)} + ${F.pct(a)} × ${F.pct(b)} = ${F.pct(lb)}`]},
  {q:'Investor look-through % of AssetC',a:lc,k:'pct',s:[`${F.pct(lb)} × ${F.pct(c)} = ${F.pct(lc)}`]}],
 insight:'Multiply along each chain, add the chains. This is how the company FAQ showed public holders going from 19.5% to 26.8% of SMRP BV.'}}});

add({id:'cross-holding',cat:'Merger',lvl:3,title:'Cross-holdings both ways',gen:r=>{
 const SA=r.int(1000,3000,100),vA=r.int(100,400,10),ST=r.int(200,800,25),vT=r.int(50,300,5),k=r.int(10,30)/100,m=r.int(20,150,5);
 const ratio=vT/vA,out=ST*(1-k),n=out*ratio,t=SA-m+n;
 return{story:`Acquirer owns ${F.pct(k)} of Target, and Target owns ${m} mn Acquirer shares. Target merges into Acquirer.`,
 given:T([['Acquirer shares (mn)',F.n0(SA)],['Acquirer value per share',F.rs0(vA)],['Target shares (mn)',F.n0(ST)],['Target value per share',F.rs0(vT)],['Acquirer\'s stake in Target',F.pct(k)],['Acquirer shares held by Target (mn)',F.n0(m)]]),
 qs:[{q:'Swap ratio',a:ratio,k:'x',s:[`${vT} ÷ ${vA} = ${F.x(ratio)}`]},
  {q:'New Acquirer shares issued (mn)',a:n,k:'n1',s:[`Only outside Target holders: ${F.n0(ST)} × (1 − ${F.pct(k)}) × ${F.x(ratio)} = ${F.n1(n)}`]},
  {q:'Acquirer shares after (mn)',a:t,k:'n1',s:[`${F.n0(SA)} − ${F.n0(m)} cancelled + ${F.n1(n)} = ${F.n1(t)}`]},
  {q:'Outside Target holders\' % after',a:n/t,k:'pct',s:[`${F.n1(n)} ÷ ${F.n1(t)} = ${F.pct(n/t)}`]}],
 insight:'Two clean-ups: no shares to yourself for the stake you already own, and cancel your own shares that the target held (HDFC Bank cancelled HDFC Ltd\'s ~21% stake the same way).'}}});

add({id:'bonus-returns',cat:'Post-facto',lvl:1,title:'Tracking a holding through demerger and bonuses',gen:r=>{
 const N=r.int(50,500,10),P0=r.int(80,300,5),b1=r.pick([[1,2],[1,1],[1,4]]),b2=r.pick([[1,2],[2,5],[1,1]]),pM=r.int(80,400,5),pD=r.int(20,150,5);
 const fM=1+b1[0]/b1[1],fD=1+b2[0]/b2[1],sM=N*fM,sD=N*fD,v=sM*pM+sD*pD;
 return{story:`You bought ${N} shares of ParentCo at ₹${P0}. ParentCo later demerged NewCo 1:1. ParentCo then issued a ${b1[0]}:${b1[1]} bonus and NewCo a ${b2[0]}:${b2[1]} bonus (a:b = a new for every b held).`,
 given:T([['Shares bought',N],['Cost per share',F.rs0(P0)],['ParentCo bonus',`${b1[0]} : ${b1[1]}`],['NewCo bonus',`${b2[0]} : ${b2[1]}`],['ParentCo price now',F.rs0(pM)],['NewCo price now',F.rs0(pD)]]),
 qs:[{q:'ParentCo shares now',a:sM,k:'n1',s:[`${N} × (1 + ${b1[0]}/${b1[1]}) = ${F.n1(sM)}`]},
  {q:'NewCo shares now',a:sD,k:'n1',s:[`${N} (1:1) × (1 + ${b2[0]}/${b2[1]}) = ${F.n1(sD)}`]},
  {q:'Total value now (₹)',a:v,k:'rs0',s:[`${F.n1(sM)} × ${pM} + ${F.n1(sD)} × ${pD} = ${F.rs0(v)}`]},
  {q:'Multiple of money',a:v/(N*P0),k:'n2',s:[`${F.rs0(v)} ÷ ${F.rs0(N*P0)} = ${F.n2(v/(N*P0))}x`]}],
 insight:'Motherson: 1 old MSSL share → 2.25 Motherson + 2.1 MSWIL shares ≈ ₹434 in Oct 2026 vs ₹103.6 in July 2020.'}}});

add({id:'open-offer',cat:'Regulation',lvl:2,title:'Would this trigger an open offer?',gen:r=>{
 const LS=r.int(1000,3000,100),pp=r.int(26,60)/100,iss=r.int(50,600,10);
 const P=LS*pp,after=(P+iss)/(LS+iss),inc=after-pp,trig=(inc>0.05&&after<=0.75)||(pp<0.25&&after>=0.25)?1:0;
 return{story:`Promoter group holds ${F.pct(pp)}. The company issues ${iss} mn new shares to the promoter (via preferential allotment OR via a scheme). Creeping limit: a holder with 25% or more can add up to 5% a year without an open offer.`,
 given:T([['Shares before (mn)',F.n0(LS)],['Promoter % before',F.pct(pp)],['New shares to promoter (mn)',F.n0(iss)]]),
 qs:[{q:'Promoter % after',a:after,k:'pct',s:[`(${F.n0(P)} + ${iss}) ÷ (${F.n0(LS)} + ${iss}) = ${F.pct(after)}`]},
  {q:'Increase (percentage points)',a:inc,k:'pp',s:[`${F.pct(after)} − ${F.pct(pp)} = ${F.pp(inc)}`]},
  {q:'Open offer if done by preferential allotment? (1/0)',a:trig,k:'yn',s:[trig?'Yes: increase exceeds 5% in a year.':'No: within the creeping limit.']}],
 insight:'Under a court-sanctioned scheme the same increase is generally exempt (SAST Reg 10(1)(d)). That is why Motherson\'s family could go 36% → 50% without an open offer.'}}});

add({id:'fractions',cat:'Demerger',lvl:1,title:'Fractional entitlements',gen:r=>{
 const H=r.int(13,997),pr=r.pick([[1,4],[3,10],[1,3],[2,7]]),p=r.int(40,400,5);
 const ent=H*pr[0]/pr[1],whole=Math.floor(ent),fr=ent-whole;
 return{story:`Ratio ${pr[0]} new share(s) for every ${pr[1]} held. Fractions aren't issued: they're pooled, a trustee sells them in the market, and holders get cash.`,
 given:T([['Your shares',H],['Entitlement',`${pr[0]} : ${pr[1]}`],['Price the trustee gets per NewCo share',F.rs0(p)]]),
 qs:[{q:'Whole NewCo shares you receive',a:whole,k:'n0',s:[`${H} × ${pr[0]} ÷ ${pr[1]} = ${ent.toFixed(3)} → whole = ${whole}`]},
  {q:'Fractional entitlement',a:fr,k:'n2',s:[`${ent.toFixed(3)} − ${whole} = ${fr.toFixed(3)}`]},
  {q:'Cash for the fraction (₹)',a:fr*p,k:'rs',s:[`${fr.toFixed(3)} × ${p} = ${F.rs(fr*p)}`]}],
 insight:'Schemes always include a fractions clause. A 1:1 ratio (Motherson, Jio Financial) avoids fractions entirely.'}}});

add({id:'holdco-discount',cat:'Valuation',lvl:2,title:'Holdco discount and the value unlock',gen:r=>{
 const gav=r.int(10000,40000,500),debt=r.int(0,4000,250),mc=r.int(5000,30000,500);
 const nav=gav-debt,disc=1-mc/nav;
 return{story:`A listed holding company owns stakes worth a total of ₹${F.n0(gav)} cr (at market) and has ₹${F.n0(debt)} cr of its own net debt. Its own market cap is ₹${F.n0(mc)} cr.`,
 given:T([['Gross asset value (₹ cr)',F.n0(gav)],['HoldCo net debt (₹ cr)',F.n0(debt)],['HoldCo market cap (₹ cr)',F.n0(mc)]]),
 qs:[{q:'Net asset value (₹ cr)',a:nav,k:'cr',s:[`${F.n0(gav)} − ${F.n0(debt)} = ₹${F.n0(nav)} cr`]},
  {q:'Holdco discount',a:disc,k:'pct',s:[`1 − ${F.n0(mc)} ÷ ${F.n0(nav)} = ${F.pct(disc)}`]},
  {q:'Value unlocked if merged at NAV (₹ cr)',a:nav-mc,k:'cr',s:[`${F.n0(nav)} − ${F.n0(mc)} = ₹${F.n0(nav-mc)} cr`]}],
 insight:'Negative "discount" = premium. Merging a holdco away (like SAMIL) means its owners are paid at full SOTP value, with no discount.'}}});

/* ===================== RENDER ===================== */
const mastered=new Set(store.get('mastered',[]));
const seeds=store.get('seeds',{});
const cats=['All',...new Set(C.map(c=>c.cat))];
let filt={cat:'All',lvl:0};
function lvlDots(l){return '<span class="lvl" title="Difficulty '+l+' of 3">'+[1,2,3].map(i=>`<i class="${i<=l?'on':''}"></i>`).join('')+'</span>'}
function bars(b){if(!b)return'';const row=(lab,segs)=>`<div class="barrow"><div class="lab">${lab}</div><div class="stack">${segs.map(s=>`<div class="seg ${s[2]}" style="flex:0 0 ${s[1]*100}%" title="${s[0]} ${F.pct(s[1])}">${s[1]>=.09?s[0]+' '+F.pct(s[1]):''}</div>`).join('')}</div></div>`;
 return `<div class="bars">${row('Before',b.before)}${row('After',b.after)}</div>`}
function parse(v,k){if(v===''||v==null)return null;let x=+String(v).replace(/[,₹%\s]/g,'');if(isNaN(x))return null;if((k==='pct'||k==='pct2'||k==='pp')&&(Math.abs(x)>1.5||/%/.test(v)))x=x/100;return x}
function ok(u,a,k){const tol=(k==='pct'||k==='pct2'||k==='pp')?Math.max(Math.abs(a)*0.005,0.0006):Math.max(Math.abs(a)*0.005,0.011);return Math.abs(u-a)<=tol}
function renderCase(c,host,opts={}){
 const seed=opts.seed??(seeds[c.id]??(C.indexOf(c)+1)*7919);const d=c.gen(R(seed));c._d=d;c._seed=seed;
 const worked=!!opts.worked;
 host.innerHTML=`<div class="chead"><span class="cat">${c.cat}</span>${lvlDots(c.lvl)}<h3>${c.title}</h3>${worked?'':`<button class="mbtn" aria-pressed="${mastered.has(c.id)}">${mastered.has(c.id)?'★ Mastered':'☆ Mark mastered'}</button>`}</div>
 <p class="story">${d.story}</p>${d.given}${worked?bars(d.bars):''}
 <div class="qlist">${d.qs.map((q,i)=>`<div class="qrow" data-i="${i}"><div class="qq2">${i+1}. ${q.q} <span class="unit">${UNIT[q.k]}</span></div>
  ${worked?`<div class="ans">${f(q.a,q.k)}</div>`:`<div class="qin"><input inputmode="decimal" aria-label="${q.q}" placeholder="Your answer"><button class="btn sm chk">Check</button><span class="res"></span></div>`}
  <ol class="steps"${worked?'':' hidden'}>${q.s.map(s=>`<li>${s}</li>`).join('')}</ol></div>`).join('')}</div>
 ${worked?'':`<div class="btns cact"><button class="btn sm hint">Hint</button><button class="btn sm sol">Show solution</button><button class="btn sm reroll">↻ New numbers</button><button class="btn sm reset">Reset</button></div>`}
 <p class="insight"><b>Banker's note:</b> ${d.insight}</p>${!worked&&!opts.noBars?`<details class="viz"><summary>Show ownership picture</summary>${bars(d.bars)||'<p class="note">No ownership picture for this case.</p>'}</details>`:''}`;
 if(worked)return;
 const rows=[...host.querySelectorAll('.qrow')];
 rows.forEach((row,i)=>{const inp=row.querySelector('input'),res=row.querySelector('.res'),q=d.qs[i];
  const check=()=>{const u=parse(inp.value,q.k);if(u==null){res.textContent='Enter a number';res.className='res';return}
   const good=ok(u,q.a,q.k);res.textContent=good?'✓ Correct':'✗ Try again';res.className='res '+(good?'good':'bad');row.classList.toggle('right',good);
   if(rows.every(r=>r.classList.contains('right'))&&!mastered.has(c.id)){mastered.add(c.id);store.set('mastered',[...mastered]);host.querySelector('.mbtn').setAttribute('aria-pressed','true');host.querySelector('.mbtn').textContent='★ Mastered';updateProg();window.hubToast&&hubToast('Case mastered: '+c.title)}};
  row.querySelector('.chk').onclick=check;inp.addEventListener('keydown',e=>{if(e.key==='Enter')check()})});
 let hintI=0;host.querySelector('.hint').onclick=()=>{const r=rows.find(r=>!r.classList.contains('right'))||rows[0];const st=r.querySelector('.steps');st.hidden=false;[...st.children].forEach((li,k)=>li.hidden=k>0);hintI++};
 host.querySelector('.sol').onclick=()=>rows.forEach(r=>{const st=r.querySelector('.steps');st.hidden=false;[...st.children].forEach(li=>li.hidden=false)});
 host.querySelector('.reroll').onclick=()=>{seeds[c.id]=Math.floor(Math.random()*1e9);store.set('seeds',seeds);renderCase(c,host);window.hubToast&&hubToast('New numbers. Same logic.')};
 host.querySelector('.reset').onclick=()=>{delete seeds[c.id];store.set('seeds',seeds);renderCase(c,host)};
 host.querySelector('.mbtn').onclick=function(){mastered.has(c.id)?mastered.delete(c.id):mastered.add(c.id);store.set('mastered',[...mastered]);this.setAttribute('aria-pressed',mastered.has(c.id));this.textContent=mastered.has(c.id)?'★ Mastered':'☆ Mark mastered';updateProg()};
}
/* reference examples */
const REF=['merger-basic','holdco-cancel','mirror-demerger','demerger-retained','composite-demerge-merge'];
const refHost=$('#refs');
if(refHost){REF.forEach((id,i)=>{const c=C.find(x=>x.id===id);const el=document.createElement('article');el.className='case worked';el.id='ref-'+id;refHost.appendChild(el);renderCase(c,el,{worked:true,seed:(i+3)*104729})})}
/* case bank */
const bank=$('#bank');
function buildFilters(){const fc=$('#fcat'),fl=$('#flvl');
 fc.innerHTML=cats.map(c=>`<button class="btn sm" data-c="${c}" aria-pressed="${filt.cat===c}">${c}</button>`).join('');
 fl.innerHTML=[[0,'Any level'],[1,'● Easy'],[2,'●● Medium'],[3,'●●● Hard']].map(([v,t])=>`<button class="btn sm" data-l="${v}" aria-pressed="${filt.lvl===v}">${t}</button>`).join('');
 fc.querySelectorAll('button').forEach(b=>b.onclick=()=>{filt.cat=b.dataset.c;buildFilters();applyFilt()});
 fl.querySelectorAll('button').forEach(b=>b.onclick=()=>{filt.lvl=+b.dataset.l;buildFilters();applyFilt()})}
function applyFilt(){let n=0;C.forEach(c=>{const el=document.getElementById('c-'+c.id);const show=(filt.cat==='All'||c.cat===filt.cat)&&(!filt.lvl||c.lvl===filt.lvl);el.hidden=!show;if(show)n++});$('#fcount').textContent=n+' case'+(n===1?'':'s')}
if(bank){C.forEach((c,i)=>{const el=document.createElement('article');el.className='case';el.id='c-'+c.id;bank.appendChild(el);renderCase(c,el)});buildFilters();applyFilt()}
function updateProg(){const p=$('#mprog');if(!p)return;const n=C.filter(c=>mastered.has(c.id)).length;p.innerHTML=`<div class="mbar"><i style="width:${n/C.length*100}%"></i></div><span>${n} / ${C.length} cases mastered</span>`;store.set('mastered-total',C.length)}
updateProg();
$('#drill')&&($('#drill').onclick=()=>{const pool=C.filter(c=>!mastered.has(c.id));const c=(pool.length?pool:C)[Math.floor(Math.random()*(pool.length||C.length))];filt={cat:'All',lvl:0};buildFilters();applyFilt();
 seeds[c.id]=Math.floor(Math.random()*1e9);store.set('seeds',seeds);const el=document.getElementById('c-'+c.id);renderCase(c,el);el.scrollIntoView({behavior:'smooth'});el.classList.add('flash');setTimeout(()=>el.classList.remove('flash'),2000)});
window.raOpenCase=id=>{const el=document.getElementById(id);if(el&&el.hidden){filt={cat:'All',lvl:0};buildFilters();applyFilt()}};
window.raCaseCount=C.length;
})();
