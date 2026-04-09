(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const a of l.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function r(o){if(o.ep)return;o.ep=!0;const l=n(o);fetch(o.href,l)}})();const O={u25:{membership:{annual:115,term12d:30,daily:20},license:{annual:82.06,term12d:89.06,d6:21.69,d3:14.69},rates:{wood:14.5,plastic:23,dg:27},instrRate:8,pkg:{w15nonSPL:180,h15:260,h30:480,ext10:180},discovery:{single:130,d3:310,d6:570},eLearning:50,freeThreshold:3},o25:{membership:{annual:230,term12d:50,daily:20},license:{annual:187.56,term12d:89.06,d6:21.69,d3:14.69},rates:{wood:20,plastic:29,dg:32},instrRate:10,pkg:{w15nonSPL:255,h15:350,h30:630,ext10:210},discovery:{single:130,d3:340,d6:650},eLearning:75,freeThreshold:4}},mt={wood:.7,plastic:1,dg:1.2},$t=2.8,ht=[{label:"Au Lâcher",noBIA:100,BIA:100,perf:!1},{label:"Pass Planeur",noBIA:150,BIA:200,perf:!1},{label:"SPL — Licence de Pilote de Planeur",noBIA:150,BIA:200,perf:!1},{label:"Compétence campagne +",noBIA:300,BIA:300,perf:!0},{label:"Premiers 1 000 km WeGlide (Commandant de bord)",noBIA:200,BIA:200,perf:!0},{label:"1er championnat officiel (régional, inter-régional, national)",noBIA:200,BIA:200,perf:!0}],$={s1InstrFlights:15,s1InstrDur:1,s2InstrFlights:5,s2InstrDur:1,tdpFlights:6,tdpDur:5/60,tdpTow:5,soloFlights:10,soloDur:1.25,sf28S1Hours:6,sf28S2Hours:4,sf28Rate:60,towPer100h:10},e=t=>Math.round(t).toLocaleString("fr-FR")+" €",G=t=>t.toFixed(2).replace(".",",")+" €",c=t=>(t%1===0?t:t.toFixed(1).replace(".",","))+"h",ut=t=>t===0?"0 h":t<1?t*60+" min":t%1===0?t+" h":t.toFixed(1).replace(".",",")+" h";function K(t,s,n){return t*Math.min(s,O[n].freeThreshold)}function rt(t,s,n,r){return!n||!r?0:t*O[s].instrRate}function W(t,s){return t*s*$t}function at(t,s,n,r){const o=O[n],l=o.rates[s],a=mt[s],i=[];if(i.push({id:"ph",label:"Paiement à l'heure de vol",cost:t*l,note:c(t)+" × "+G(l)}),r&&(s==="wood"||s==="plastic")){const u=O[n].rates.wood,d=15,g=Math.max(0,t-d)*u;i.push({id:"pkg15w",label:"Forfait 15h bois et toile (non-SPL)",cost:o.pkg.w15nonSPL+g,note:"Couvre "+d+"h"+(t>d?", +"+c(t-d)+" à l'heure":" ✓"),pkgCost:o.pkg.w15nonSPL})}const b=15/a,f=Math.max(0,t-b)*l;i.push({id:"pkg15",label:"Forfait 15h",cost:o.pkg.h15+f,note:"Couvre "+c(b)+(t>b?", +"+c(t-b)+" à l'heure":" ✓")+" · non renouvelable dans l'année civile",pkgCost:o.pkg.h15});function x(u){return u<=2?o.pkg.h30:u===3?o.pkg.h30*.5:o.pkg.h30*.3}function F(u){let d=0;for(let g=1;g<=u;g++)d+=x(g);return d}const E=[[1,0],[1,1],[1,2],[2,0],[2,1],[3,0],[4,0],[5,0],[6,0],[7,0]];for(const[u,d]of E){const g=(u*30+d*10)/a,v=F(u)+d*o.pkg.ext10,S=Math.max(0,t-g)*l,h=t>g?", +"+c(t-g)+" à l'heure":" ✓";let m;if(u===1&&d===0)m="Forfait 30h";else if(u===1&&d===1)m="Forfait 30h + prolongation 10h";else if(u===1&&d===2)m="Forfait 30h + 2× prolongation 10h";else if(d===0){const I=u===3?" (−50 % sur le 3e)":u>3?" (−70 % sur les suivants)":"";m=u+"× forfait 30h"+I}else m=u+"× forfait 30h + "+(d===1?"prolongation 10h":"2× prolongation 10h");i.push({id:`pkg30_${u}_${d}`,n30:u,k:d,coverage:g,label:m,cost:v+S,pkgCost:v,note:"Couvre "+c(g)+h+" · valable 1 an"})}return i.sort((u,d)=>u.cost-d.cost)}function lt(){return`
    <div style="margin-top:1.75rem; border-top:1px solid var(--border); padding-top:1rem;">
      <p style="font-size:10px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:var(--text-muted); margin-bottom:.6rem;">
        Notes importantes
      </p>
      <ul style="font-size:11.5px; color:var(--text-muted); line-height:1.8; padding-left:1.1rem; list-style:disc;">
        <li>
          Les heures au-delà de
          <strong style="color:var(--text-mid)">3h (moins de 25 ans)</strong> ou
          <strong style="color:var(--text-mid)">4h (25 ans et plus)</strong>
          lors du même vol ne nécessitent pas de participation aux frais.
        </li>
        <li>
          Le <strong style="color:var(--text-mid)">Marianne</strong> est facturé au tarif bois et toile
          pour les vols d'instruction des élèves non encore brevetés SPL.
        </li>
        <li>
          Le <strong style="color:var(--text-mid)">supplément d'instruction</strong> s'applique du
          1er avril au 30 septembre uniquement — offert hors de cette période.
        </li>
        <li>
          Le <strong style="color:var(--text-mid)">forfait 30h est renouvelable</strong> dans la même
          année civile : <strong style="color:var(--text-mid)">−50 %</strong> sur le 3e forfait,
          <strong style="color:var(--text-mid)">−70 %</strong> sur les suivants.
          Contacter le club pour en bénéficier.
        </li>
        <li>
          Les <strong style="color:var(--text-mid)">forfaits</strong> sont payables en trois fois
          et valables 1 an à compter de la souscription.
        </li>
        <li>
          Le <strong style="color:var(--text-mid)">forfait 15h***</strong> est utilisable uniquement
          dans l'année civile de souscription (1er janvier – 31 décembre) et n'est pas renouvelable
          dans la même année.
        </li>
        <li>
          Les <strong style="color:var(--text-mid)">coûts de remorquage et de dépannage aérien</strong>
          sont susceptibles d'être révisés en fonction du prix du carburant.
        </li>
        <li>
          La <strong style="color:var(--text-mid)">cotisation à la journée</strong> ne peut être
          délivrée qu'à un pilote de planeur inscrit dans un autre club et titulaire d'une licence
          FFVP obtenue par ce club.
        </li>
        <li>
          <strong style="color:var(--text-mid)">Licence FFVP* :</strong> coût de base incluant RC
          (Responsabilité Civile Aéronef) et PJ (Protection Juridique). Options disponibles :
          Individuelle Accident (IA), Assistance Rapatriement (AR), Frais médicaux et thérapie sportive.
        </li>
      </ul>
    </div>
  `}function xt(){const s=document.getElementById("learnBIA").checked,n="u25",r=O[n],o="wood",l=r.membership.annual+r.license.annual,a=$.s1InstrFlights,i=$.s1InstrDur,b=K(a,i,n),f=rt(b,n,!0,!0),x=W(a,$.towPer100h),F=at(b,o,n,!0)[0],E=$.s2InstrFlights,u=$.s2InstrDur,d=$.tdpFlights,g=$.tdpDur,v=K(E,u,n)+K(d,g,n),S=rt(v,n,!0,!0),h=W(E,$.towPer100h)+W(d,$.tdpTow),m=$.soloFlights,I=$.soloDur,w=K(m,I,n),q=W(m,$.towPer100h),z=v+w,M=at(z,o,n,!0)[0],J=F.pkgCost??F.cost,y=F.cost-J,R=M.pkgCost??M.cost,B=M.cost-R,_=$.sf28S1Hours*$.sf28Rate,N=$.sf28S2Hours*$.sf28Rate,j=r.eLearning,V=l+F.cost+f+x+_+j,D=l+M.cost+S+h+q+N,P=V+D;let C="";C+=`
    <div class="metrics" style="margin-top:1.25rem;">
      <div class="metric-card">
        <p class="metric-label">Saison 1</p>
        <p class="metric-value">${e(V)}</p>
        <p class="metric-sub">Formation initiale en moto-planeur incluse</p>
      </div>
      <div class="metric-card">
        <p class="metric-label">Saison 2</p>
        <p class="metric-value">${e(D)}</p>
        <p class="metric-sub">Formation initiale en moto-planeur incluse</p>
      </div>
    </div>
  `,C+=`
    <details class="fold">
      <summary>
        <span>Saison 1 — Formation instructeur · 15 vols × 1 h + SF 28 ${$.sf28S1Hours} h</span>
        <span class="fold-total">${e(V)}</span>
      </summary>
      <div class="fold-body">
        <table class="breakdown">
          <tr><td>Cotisation annuelle</td><td>${e(r.membership.annual)}</td></tr>
          <tr><td>Licence FFVP annuelle</td><td>${G(r.license.annual)}</td></tr>
          <tr><td>Formation théorique <span style="font-size:11px; color:var(--text-muted)">(e-learning · examen SPL)</span></td><td>${e(j)}</td></tr>
          <tr class="section-head"><td colspan="2">Heures de vol — planeur pur (bois et toile)</td></tr>
          <tr><td>${F.label}</td><td>${e(J)}</td></tr>
          ${y>0?`<tr><td>Heures supplémentaires <span style="font-size:11px; color:var(--text-muted)">${c(y/r.rates[o])} au tarif horaire</span></td><td>${e(y)}</td></tr>`:""}
          <tr><td>Instruction <span style="font-size:11px; color:var(--text-muted)">${c(b)} × ${r.instrRate} €/h</span></td><td>${e(f)}</td></tr>
          <tr><td>Remorquage <span style="font-size:11px; color:var(--text-muted)">${a} vols × 10/100h</span></td><td>${e(x)}</td></tr>
          <tr><td>Motoplaneur SF 28 <span style="font-size:11px; color:var(--text-muted)">${$.sf28S1Hours} h × ${$.sf28Rate} €/h · décollage autonome sans remorquage</span></td><td>${e(_)}</td></tr>
          <tr class="total"><td>Total saison 1</td><td>${e(V)}</td></tr>
        </table>
      </div>
    </details>
  `,C+=`
    <details class="fold">
      <summary>
        <span>Saison 2 — Fin de formation + 1er solo (10 × 1h15) + SF 28 ${$.sf28S2Hours} h</span>
        <span class="fold-total">${e(D)}</span>
      </summary>
      <div class="fold-body">
        <table class="breakdown">
          <tr><td>Cotisation annuelle</td><td>${e(r.membership.annual)}</td></tr>
          <tr><td>Licence FFVP annuelle</td><td>${G(r.license.annual)}</td></tr>
          <tr class="section-head"><td colspan="2">Heures de vol — planeur pur (bois et toile)</td></tr>
          <tr><td>${M.label}</td><td>${e(R)}</td></tr>
          ${B>0?`<tr><td>Heures supplémentaires <span style="font-size:11px; color:var(--text-muted)">${c(B/r.rates[o])} au tarif horaire</span></td><td>${e(B)}</td></tr>`:""}
          <tr><td>Instruction <span style="font-size:11px; color:var(--text-muted)">${c(v)} × ${r.instrRate} €/h · vols avec instructeur uniquement</span></td><td>${e(S)}</td></tr>
          <tr><td>Remorquage <span style="font-size:11px; color:var(--text-muted)">${E} vols × 10/100h · ${d} tours de piste × ${$.tdpTow}/100h · ${m} vols solo × 10/100h</span></td><td>${e(h+q)}</td></tr>
          <tr><td>Motoplaneur SF 28 <span style="font-size:11px; color:var(--text-muted)">${$.sf28S2Hours} h × ${$.sf28Rate} €/h · décollage autonome sans remorquage</span></td><td>${e(N)}</td></tr>
          <tr class="total"><td>Total saison 2</td><td>${e(D)}</td></tr>
        </table>
      </div>
    </details>
  `;const Y=ht.filter(k=>!k.perf),Z=ht.filter(k=>k.perf),p=Y.reduce((k,A)=>k+(s?A.BIA:A.noBIA),0),L=Z.reduce((k,A)=>k+(s?A.BIA:A.noBIA),0),T=k=>k.map(A=>{const tt=s?A.BIA:A.noBIA,et=s&&A.BIA>A.noBIA?` <span style="font-size:11px; color:var(--green); font-weight:600;">+${A.BIA-A.noBIA} € avec BIA</span>`:"";return`
      <li style="padding:3px 0;">
        <span style="color:var(--text-mid)">${A.label}</span>${et}
        <strong style="float:right; font-family:var(--mono); color:var(--green);">−${tt} €</strong>
      </li>
    `}).join("");C+=`
    <div class="metrics">
      <div class="metric-card sky">
        <p class="metric-label">Total formation (2 saisons)</p>
        <p class="metric-value">${e(P)}</p>
        <p class="metric-sub">Hors bourses</p>
      </div>
      <div class="metric-card green">
        <p class="metric-label">Avec bourses de formation FFVP</p>
        <p class="metric-value">${e(Math.max(0,P-p))}</p>
        <p class="metric-sub">Après −${e(p)} de bourses${s?" (BIA)":""}</p>
      </div>
    </div>

    <details class="fold">
      <summary>
        <span>Bourses FFVP — jalons de formation</span>
        <span class="fold-total" style="color:var(--green)">−${e(p)}</span>
      </summary>
      <div class="fold-body">
        <p style="font-size:11.5px; color:var(--text-mid); margin-bottom:.6rem;">
          Versées par la FFVP à l'atteinte de chaque étape :
        </p>
        <ul style="list-style:none; padding:0; margin:0;">
          ${T(Y)}
        </ul>
      </div>
    </details>

    <details class="fold">
      <summary>
        <span>Aides à la performance FFVP — après SPL</span>
        <span class="fold-total" style="color:var(--green)">jusqu'à −${e(L)}</span>
      </summary>
      <div class="fold-body">
        <p style="font-size:11.5px; color:var(--text-mid); margin-bottom:.6rem;">
          Disponibles après l'obtention du SPL, sur plusieurs saisons :
        </p>
        <ul style="list-style:none; padding:0; margin:0;">
          ${T(Z)}
        </ul>
      </div>
    </details>
  `,C+=lt(),document.getElementById("learnResults").innerHTML=C}let st=null;function wt(t,s,n,r,o,l,a,i,b,f,x,F){const E=document.getElementById("seasonChartWrap"),u=document.getElementById("seasonChart");if(!u)return;E.style.display="";const d=Math.min(1,t.freeThreshold/Math.max(o,.01)),g=t.rates[s],v=mt[s],S=l+i*d,h=at(S,s,n,!1)[0],m=15/v,I=30/v;function w(p){return p<=2?t.pkg.h30:p===3?t.pkg.h30*.5:t.pkg.h30*.3}function q(p){if(h.n30!==void 0)return Math.max(0,p-h.coverage)*g;if(h.id==="pkg15")return Math.max(0,p-m)*g;if(h.id==="pkg15w"){const L=t.pkg.w15nonSPL/(t.pkg.h15/m);return Math.max(0,p-L)*g}return p*g}const z=[],M=[],J=[],y=[],R=[],B=[],_=[],N=[],j=[],V=[],D=[];for(let p=1;p<=r;p++){const L=p/r;z.push(p);const T=l*L+i*L*d;let k=0,A=0,tt=0,et=0,dt=0,ct=0;if(h.id==="pkg15")k=t.pkg.h15;else if(h.id==="pkg15w")k=t.pkg.w15nonSPL;else if(h.n30!==void 0){const{n30:St,k:Pt}=h;let ot=0;for(let H=1;H<=St;H++){if(T>=ot){const nt=w(H);H===1?A=nt:H===2?tt=nt:H===3?et=nt:dt+=nt}ot+=I}for(let H=1;H<=Pt;H++)T>=ot&&(ct+=t.pkg.ext10),ot+=10/v}const pt=q(T),ft=a*L*t.instrRate,gt=x*L,vt=F*L,Lt=t.membership.annual+t.license.annual+k+A+tt+et+dt+ct+pt+ft+gt+vt;M.push(t.membership.annual),J.push(t.license.annual),y.push(k),R.push(A+tt+et+dt),B.push(ct),_.push(pt),N.push(vt),j.push(ft),V.push(gt),D.push(Lt/p)}const P=(p,L,T)=>({type:"bar",label:p,data:L,backgroundColor:T,stack:"cost",yAxisID:"y",borderWidth:0,order:2}),C=[P("Cotisation",M,"#9ca3af"),P("Licence FFVP",J,"#6b7280")];(h.id==="pkg15"||h.id==="pkg15w")&&C.push(P("Forfait 15h",y,"#fde047")),h.n30>=1&&C.push(P("Forfait(s) 30h",R,"#eab308")),h.k>=1&&C.push(P("Prolongation(s) 10h",B,"#ca8a04")),C.push(P("Heures hors forfait",_,"#ef4444"),P("Remorquage",N,"#8b5cf6"),P("Instruction (été)",j,"#3b82f6"),P("Moto-planeur SF 28",V,"#10b981"),{type:"line",label:"Coût moyen / heure",data:D,yAxisID:"y1",borderColor:"#ef4444",borderDash:[5,3],borderWidth:2,pointRadius:0,tension:.3,fill:!1,order:0});const Y={labels:z,datasets:C},Z={responsive:!0,maintainAspectRatio:!0,aspectRatio:2.4,interaction:{mode:"index",intersect:!1},plugins:{legend:{position:"bottom",labels:{font:{size:11},padding:10,boxWidth:12}},tooltip:{callbacks:{title:p=>p[0].label+"h de vol",label:p=>{if(!p.raw||p.raw===0)return null;const L=p.dataset.yAxisID==="y1"?" €/h":" €";return` ${p.dataset.label} : ${p.raw.toFixed(0)}${L}`},footer:p=>{const T=p.filter(k=>k.dataset.yAxisID==="y").reduce((k,A)=>k+(A.raw||0),0);return T>0?"Total cumulé : "+T.toFixed(0)+" €":null}}}},scales:{x:{stacked:!0,title:{display:!0,text:"Heures de vol",font:{size:10}},ticks:{font:{size:10},maxTicksLimit:13,callback:(p,L)=>z[L]+"h"}},y:{stacked:!0,position:"left",title:{display:!0,text:"Coût cumulé (€)",font:{size:10}},ticks:{font:{size:10},callback:p=>p+" €"},grid:{color:"#f1f5f9"}},y1:{position:"right",title:{display:!0,text:"€ / heure",font:{size:10}},ticks:{font:{size:10},callback:p=>p.toFixed(0)+" €"},grid:{drawOnChartArea:!1}}}};st?(st.data=Y,st.options=Z,st.update("none")):st=new window.Chart(u,{type:"bar",data:Y,options:Z})}let It="o25",Ft="plastic";function Ct(){X("seasonAgeToggle",t=>{It=t,it()}),X("seasonPlaneToggle",t=>{Ft=t,it()})}function Mt(){["seasonHours","seasonDur","seasonTow","seasonSf28","seasonInstr","seasonWinterHours"].forEach(s=>{var n;(n=document.getElementById(s))==null||n.addEventListener("input",it)})}function it(){var D;const t=+document.getElementById("seasonHours").value,s=+document.getElementById("seasonDur").value,n=+document.getElementById("seasonTow").value;document.getElementById("seasonHoursVal").textContent=t+" h",document.getElementById("seasonDurVal").textContent=s.toFixed(1).replace(".",",")+" h",document.getElementById("seasonTowVal").textContent=n+" /100h";const r=It,o=Ft,l=O[r],a=document.getElementById("seasonInstr");a.max=t;const i=Math.min(Math.max(.5,+a.value),t);a.value=i,document.getElementById("seasonInstrVal").textContent=ut(i);const b=document.getElementById("seasonWinterHours");b.max=t;const f=Math.min(Math.max(0,+b.value),i);b.value=f;const x=i-f;document.getElementById("seasonWinterHoursVal").textContent=ut(f);const F=+document.getElementById("seasonSf28").value;document.getElementById("seasonSf28Val").textContent=ut(F);const E=F*60,u=Math.max(0,t-i),d=Math.max(0,Math.round(u/s)),v=Math.max(1,Math.round(i/s))+d,S=i,h=K(d,s,r),m=S+h,I=d*Math.max(0,s-l.freeThreshold),w=x*l.instrRate,q=f*l.instrRate,z=W(v,n),M=l.membership.annual+l.license.annual,y=at(m,o,r,!1)[0],R=M+y.cost+w+z+E;let B="";if(I>0&&(B+=`
      <div class="info-box green-box">
        <strong>Règle des heures gratuites :</strong> Au-delà de ${c(l.freeThreshold)} par vol solo,
        pas de participation aux frais. Vous ne payez que ${c(h)} au lieu de
        ${c(u)} en solo. Économie : <strong>${e(I*l.rates[o])}</strong>.
      </div>
    `),q>0&&(B+=`
      <div class="info-box green-box">
        Économie de <strong>${e(q)}</strong> : ${c(f)} d'instruction
        en hiver → pas de supplément instruction.
      </div>
    `),B+=`
    <div class="metrics">
      <div class="metric-card sky">
        <p class="metric-label">Meilleur coût total</p>
        <p class="metric-value">${e(R)}</p>
        <p class="metric-sub">${y.label}</p>
      </div>
      <div class="metric-card">
        <p class="metric-label">Coût par heure de vol</p>
        <p class="metric-value">${e(R/Math.max(t,1))}</p>
        <p class="metric-sub">~${v} vols · ${c(x)} instr. été / ${c(f)} instr. hiver</p>
      </div>
    </div>
  `,y.coverage&&y.coverage>m){const P=y.coverage-m;B+=`
      <div class="info-box amber-box" style="margin-top:.75rem;">
        Il vous resterait <strong>${c(P)}</strong> non utilisées sur votre
        ${y.label.toLowerCase()} — valables 1 an à compter de la souscription.
      </div>
    `}const _=f>0?`${c(x)} été (payant) · ${c(f)} hiver (gratuit)`:`${c(x)} en été`,N=E>0?`<tr><td>Moto-planeur SF 28 (${c(F)} × 60 €/h)</td><td>${e(E)}</td></tr>`:"";B+=`
    <details class="fold" style="margin-top:1rem;">
      <summary>Détail des coûts <span class="fold-total">${e(R)}</span></summary>
      <div class="fold-body">
        <table class="breakdown">
          <tr><td>Cotisation annuelle</td><td>${e(l.membership.annual)}</td></tr>
          <tr><td>Licence FFVP annuelle</td><td>${G(l.license.annual)}</td></tr>
          <tr><td>${y.label} <span style="font-size:11px; color:var(--text-muted)">${y.note}</span></td><td>${e(y.cost)}</td></tr>
          <tr><td>Instruction <span style="font-size:11px; color:var(--text-muted)">${_}</span></td><td>${e(w)}</td></tr>
          <tr><td>Remorquage (~${v} vols × ${n}/100h)</td><td>${e(z)}</td></tr>
          ${N}
          <tr class="total"><td>Total saison</td><td>${e(R)}</td></tr>
        </table>
      </div>
    </details>
  `;const j=l.pkg.h15/l.rates[o],V=l.pkg.h30/l.rates[o];m<j?B+=`
      <div class="info-box amber-box" style="margin-top:.75rem;">
        Pour ${c(m)} facturables, le paiement à l'heure est moins cher que le forfait 15h
        (seuil de rentabilité : ${c(j)}).
      </div>
    `:y.id==="pkg15"||y.id==="pkg15w"?B+=`
      <div class="info-box green-box" style="margin-top:.75rem;">
        Le forfait 15h est votre meilleure option. Le forfait 30h ne devient intéressant
        qu'à partir de ${c(V)} heures facturables.
      </div>
    `:(D=y.id)!=null&&D.startsWith("pkg30")&&(B+=`
      <div class="info-box green-box" style="margin-top:.75rem;">
        Pour ${c(m)}, le forfait 30h est votre meilleure option
        (rentable dès ${c(V)} heures facturables).
      </div>
    `),y.n30>=3?B+=`
      <div class="info-box amber-box" style="margin-top:.5rem;">
        <strong>Réduction multi-forfaits incluse :</strong> le simulateur applique
        <strong>${y.n30===3?"−50 %":"−70 %"}</strong> sur le
        ${y.n30===3?"3e":y.n30+"e"} forfait 30h.
        Contactez le club pour en bénéficier — ce n'est pas automatique.
      </div>
    `:m>30/mt[o]&&(B+=`
      <div class="info-box amber-box" style="margin-top:.5rem;">
        <strong>Réduction disponible :</strong> à partir du 3e forfait 30h dans la même année
        civile : <strong>−50 %</strong> (4e et suivants : −70 %). Le simulateur en tient compte
        automatiquement.
      </div>
    `),B+=lt(),document.getElementById("seasonResults").innerHTML=B,wt(l,o,r,t,s,i,x,u,n,M,E,z)}let Bt="u25",At="wood";function Tt(){X("discAgeToggle",t=>{Bt=t,U()}),X("discPlaneToggle",t=>{At=t,U()})}function Rt(){var t,s;["discFlights","discDur"].forEach(n=>{var r;(r=document.getElementById(n))==null||r.addEventListener("input",U)}),(t=document.getElementById("discInstr"))==null||t.addEventListener("change",U),(s=document.getElementById("discSummer"))==null||s.addEventListener("change",U)}function U(){const t=+document.getElementById("discFlights").value,s=+document.getElementById("discDur").value,n=document.getElementById("discInstr").checked,r=document.getElementById("discSummer").checked;document.getElementById("discFlightsVal").textContent=t,document.getElementById("discDurVal").textContent=s.toFixed(1).replace(".",",")+" h";const o=Bt,l=At,a=O[o];let i,b;t<=2?(i=t*a.discovery.single,b=t+" × vol découverte individuel ("+a.discovery.single+" €)"):t===3?(i=a.discovery.d3,b="Forfait découverte 3 vols"):t<=5?(i=a.discovery.d3+(t-3)*a.discovery.single,b="Forfait 3 vols + "+(t-3)+" vol(s) supplémentaire(s)"):t===6?(i=a.discovery.d6,b="Forfait découverte 6 vols"):(i=a.discovery.d6+(t-6)*a.discovery.single,b="Forfait 6 vols + "+(t-6)+" vol(s) supplémentaire(s)");const f=K(t,s,o),x=rt(f,o,n,r),F=W(t,10),E=a.membership.annual+a.license.annual,u=f*a.rates[l],d=E+u+x+F,g=i-d,v=d<i,S=Math.min(s,a.freeThreshold)*a.rates[l]+(n&&r?Math.min(s,a.freeThreshold)*a.instrRate:0)+10*$t,h=t<=3?t===3?a.discovery.d3/3:a.discovery.single:t===6?a.discovery.d6/6:a.discovery.single;let m=null;h>S&&(m=E/(h-S));let I="";I+=`
    <div class="metrics" style="margin-top:1.5rem;">
      <div class="metric-card ${v?"":"accent"}">
        <p class="metric-label">Forfaits découverte</p>
        <p class="metric-value" style="color:var(--${v?"text-mid":"accent"})">${e(i)}</p>
        <p class="metric-sub">${b}</p>
      </div>
      <div class="metric-card ${v?"green":""}">
        <p class="metric-label">Voie cotisation annuelle</p>
        <p class="metric-value" style="color:var(--${v?"green":"text"})">${e(d)}</p>
        <p class="metric-sub">Cotisation + licence + ${c(f)} de vol</p>
      </div>
    </div>
  `,v?I+=`
      <div class="info-box green-box">
        <strong>Rejoignez le club !</strong> Même pour seulement ${t} vols,
        la cotisation annuelle (${e(d)}) coûte
        <strong>${e(Math.abs(g))} de moins</strong> que le forfait découverte (${e(i)}).
        Les forfaits découverte sont conçus pour une expérience ponctuelle — dès que vous volez
        régulièrement, la cotisation est plus avantageuse.
      </div>
    `:I+=`
      <div class="info-box">
        <strong>Le forfait découverte est avantageux</strong> pour ce nombre de vols
        (${e(Math.abs(g))} moins cher). Mais dès que vous volez davantage, la cotisation
        l'emporte.
      </div>
    `,m!==null&&(I+=`
      <div class="info-box amber-box">
        <strong>Seuil de rentabilité à ${Math.ceil(m)} vols</strong> — à partir du vol
        n°${Math.ceil(m)}, la cotisation annuelle est moins chère que les vols découverte.
      </div>
    `),I+=`
    <p class="section-label">Détail des coûts</p>
    <table class="breakdown">
      <tr class="section-head"><td colspan="2">Voie forfait découverte</td></tr>
      <tr><td>${b}</td><td>${e(i)}</td></tr>
      <tr><td><em style="font-size:11.5px; color:var(--text-muted)">Assurance FFVP comprise</em></td><td></td></tr>
      <tr class="total"><td>Total</td><td>${e(i)}</td></tr>
    </table>

    <table class="breakdown">
      <tr class="section-head"><td colspan="2">Voie cotisation annuelle (${o==="u25"?"moins de 25 ans":"25 ans et plus"})</td></tr>
      <tr><td>Cotisation annuelle</td><td>${e(a.membership.annual)}</td></tr>
      <tr><td>Licence FFVP annuelle</td><td>${G(a.license.annual)}</td></tr>
      <tr><td>${t} vols × ${c(Math.min(s,a.freeThreshold))} facturable × ${G(a.rates[l])}/h</td><td>${e(u)}</td></tr>
      ${n?`<tr><td>Instruction (${c(f)} × ${a.instrRate} €/h${r?"":" — gratuit"})</td><td>${e(x)}</td></tr>`:""}
      <tr><td>Remorquage</td><td>${e(F)}</td></tr>
      <tr class="total"><td>Total</td><td>${e(d)}</td></tr>
      ${v?`<tr class="saving"><td>Économie vs forfait découverte</td><td>${e(Math.abs(g))}</td></tr>`:""}
    </table>
  `,I+=lt(),document.getElementById("discResults").innerHTML=I}let Et="o25",kt="dg";function Vt(){X("visitAgeToggle",t=>{Et=t,Q()}),X("visitPlaneToggle",t=>{kt=t,Q()})}function Dt(){var t,s;["visitDays","visitFlights","visitDur"].forEach(n=>{var r;(r=document.getElementById(n))==null||r.addEventListener("input",Q)}),(t=document.getElementById("visitInstr"))==null||t.addEventListener("change",Q),(s=document.getElementById("visitSummer"))==null||s.addEventListener("change",Q)}function Q(){const t=+document.getElementById("visitDays").value,s=+document.getElementById("visitFlights").value,n=+document.getElementById("visitDur").value,r=document.getElementById("visitInstr").checked,o=document.getElementById("visitSummer").checked;document.getElementById("visitDaysVal").textContent=t+" jour"+(t>1?"s":""),document.getElementById("visitFlightsVal").textContent=s,document.getElementById("visitDurVal").textContent=n.toFixed(1).replace(".",",")+" h";const l=Et,a=kt,i=O[l],b=Math.min(n,i.freeThreshold),f=s*b,x=s*Math.max(0,n-i.freeThreshold),F=rt(f,l,r,o),E=W(s,10),u=f*i.rates[a],d=t*i.membership.daily,g=i.membership.term12d,v=t<=12&&g<=d?{cost:g,label:"Cotisation courte durée 12 jours consécutifs"}:{cost:d,label:t+" × cotisation à la journée (20 €)"},S=v.cost+u+F+E,h=a==="dg"?"DG500 / LAK19":a==="plastic"?"Pégase / Marianne":"bois et toile";let m="";if(x>0){const q=x*i.rates[a];m+=`
      <div class="info-box green-box" style="margin-top:1.25rem;">
        <strong>Avantage long vol :</strong> Au-delà de ${c(i.freeThreshold)} par vol,
        pas de participation aux frais. Avec des vols de ${c(n)} en moyenne, vous bénéficiez
        de <strong>${c(x)} gratuites</strong> — économie de ${e(q)} sur les
        heures de vol. Vous ne payez que ${c(f)} sur ${c(s*n)}
        heures totales.
      </div>
    `}else m+='<div style="margin-top:1.25rem;"></div>';m+=`
    <div class="metrics">
      <div class="metric-card accent">
        <p class="metric-label">Coût total (${t} jour${t>1?"s":""})</p>
        <p class="metric-value">${e(S)}</p>
        <p class="metric-sub">${v.label}</p>
      </div>
      <div class="metric-card">
        <p class="metric-label">Coût par vol</p>
        <p class="metric-value">${e(S/Math.max(s,1))}</p>
        <p class="metric-sub">${c(f)} facturables sur ${h}</p>
      </div>
    </div>
  `;const I=i.membership.term12d,w=t*i.membership.daily;m+=`
    <p class="section-label">Options de cotisation pour ${t} jour${t>1?"s":""}</p>
    <div class="compare-wrap">
      <table>
        <thead>
          <tr>
            <th>Option</th>
            <th style="text-align:right">Coût</th>
            <th style="text-align:right">Remarques</th>
          </tr>
        </thead>
        <tbody>
          <tr class="${I<=w?"best":""}">
            <td>Cotisation courte durée 12 jours consécutifs${I<=w?'<span class="badge badge-best">Meilleur</span>':""}</td>
            <td style="text-align:right; font-family:var(--mono)">${e(I)}</td>
            <td style="text-align:right; font-size:12px; color:var(--text-muted)">Jusqu'à 12 jours consécutifs</td>
          </tr>
          <tr class="${w<I?"best":""}">
            <td>${t} × cotisation à la journée${w<I?'<span class="badge badge-best">Meilleur</span>':""}</td>
            <td style="text-align:right; font-family:var(--mono)">${e(w)}</td>
            <td style="text-align:right; font-size:12px; color:var(--text-muted)">Nécessite une licence FFVP du club d'origine</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,m+=`
    <p class="section-label">Détail des coûts</p>
    <table class="breakdown">
      <tr><td>${v.label}</td><td>${e(v.cost)}</td></tr>
      <tr><td><em style="font-size:11.5px; color:var(--text-muted)">Votre licence FFVP du club d'origine vous couvre — pas de nouvelle licence annuelle nécessaire</em></td><td></td></tr>
      <tr class="section-head"><td colspan="2">Heure de vol sur ${h}</td></tr>
      <tr><td>${s} vols — ${c(f)} facturables × ${G(i.rates[a])}/h</td><td>${e(u)}</td></tr>
      ${x>0?`<tr class="saving"><td>Heures gratuites au-delà de ${c(i.freeThreshold)}/vol (${c(x)})</td><td>— ${e(x*i.rates[a])}</td></tr>`:""}
      ${r?`<tr><td>Instruction (${c(f)} × ${i.instrRate} €/h${o?"":" — gratuit hors avr.–sept."})</td><td>${e(F)}</td></tr>`:""}
      <tr><td>Remorquage (~${s} × 10/100h)</td><td>${e(E)}</td></tr>
      <tr class="total"><td>Total</td><td>${e(S)}</td></tr>
    </table>
  `,!o&&r&&(m+=`
      <div class="info-box green-box">
        <strong>Avantage hors saison :</strong> Voler hors avril–septembre signifie pas de
        supplément d'instruction (${i.instrRate} €/h). Vous économisez
        ${e(f*i.instrRate)} sur l'instruction.
      </div>
    `),m+=lt(),document.getElementById("visitResults").innerHTML=m}const qt=["learn","season","discovery","visit"];let bt=!1;function zt(){bt||(bt=!0,window.addEventListener("beforeunload",t=>{t.preventDefault(),t.returnValue=""}))}function Ht(t){var n;zt(),document.querySelectorAll(".scenario-card").forEach(r=>{r.classList.toggle("active",r.dataset.sc===t)}),document.getElementById("mainDivider").classList.remove("hidden"),qt.forEach(r=>{document.getElementById("sc-"+r).classList.toggle("hidden",r!==t)});const s={learn:xt,season:it,discovery:U,visit:Q};(n=s[t])==null||n.call(s)}function X(t,s){const n=document.getElementById(t);n&&n.addEventListener("click",r=>{const o=r.target.closest("button");o&&(n.querySelectorAll("button").forEach(l=>l.classList.remove("active")),o.classList.add("active"),s(o.dataset.v))})}function jt(){document.querySelectorAll(".scenario-card").forEach(t=>{t.addEventListener("click",()=>Ht(t.dataset.sc))})}jt();Ct();Tt();Vt();Mt();Rt();Dt();var yt;(yt=document.getElementById("learnBIA"))==null||yt.addEventListener("change",xt);
