"use strict";(self.webpackChunkfront=self.webpackChunkfront||[]).push([[57],{803105:(e,n,t)=>{t.d(n,{Z:()=>r});var l=t(876767),i=t(648623),s=t(624631),d=t(346417);const o=(0,l.D)();const r=function(e){let{value:n,setValue:t,options:l,title:r,propr:a}=e;return(0,d.jsx)(i.Z,{value:n,onChange:(e,n)=>{"string"===typeof n?t({title:n}):n&&n.inputValue?t({title:n.inputValue}):t(n)},filterOptions:(e,n)=>o(e,n),selectOnFocus:!0,clearOnBlur:!0,handleHomeEndKeys:!0,id:"free-solo-with",options:l,getOptionLabel:e=>"string"===typeof e?e:e.inputValue?e.inputValue:e[""+a],renderOption:(e,n)=>(0,d.jsx)("li",{...e,children:n[""+a]},n.id),sx:{width:"100%"},freeSolo:!0,renderInput:e=>(0,d.jsx)(s.Z,{...e,label:r||"Titre"})})}},792628:(e,n,t)=>{t.d(n,{Z:()=>h});var l=t(557829),i=t(565280),s=t(406740),d=t(747313),o=t(346417);function r(e){const{children:n,value:t,index:i,...s}=e;return(0,o.jsx)("div",{role:"tabpanel",hidden:t!==i,id:"simple-tabpanel-".concat(i),"aria-labelledby":"simple-tab-".concat(i),...s,children:t===i&&(0,o.jsx)(l.Z,{sx:{p:3},children:n})})}function a(e){return{id:"simple-tab-".concat(e),"aria-controls":"simple-tabpanel-".concat(e)}}function c(e){let{titres:n,components:t}=e;const[c,h]=d.useState(0);return(0,o.jsxs)(l.Z,{sx:{width:"100%"},children:[(0,o.jsx)(l.Z,{sx:{borderBottom:1,borderColor:"divider"},children:(0,o.jsx)(s.Z,{value:c,onChange:(e,n)=>{h(n)},"aria-label":"icon label tabs example",style:{padding:"0px",margin:"0px"},children:n.map(((e,n)=>(0,d.createElement)(i.Z,{label:e.label,...a(e.id),key:n})))})}),t.map(((e,n)=>(0,o.jsx)(r,{value:c,index:e.id,children:e.component},n)))]})}const h=d.memo(c)},925057:(e,n,t)=>{t.r(n),t.d(n,{default:()=>J});var l=t(435045),i=t(809019),s=t(369099),d=t(319159),o=t(835662),r=t(209478),a=t(803105),c=t(792628),h=t(747313),x=t(594500),p=t(661395),u=(t(245135),t(346417));const g=function(e){let{listeDemande:n}=e;return(0,u.jsx)(u.Fragment,{children:(0,u.jsx)("div",{className:"statDemande",children:n&&(0,u.jsxs)("p",{style:{textAlign:"center"},children:[(0,u.jsx)("span",{style:{color:"red",marginRight:"10px",fontSize:"1rem"},children:n.filter((e=>e.reponse.length>0)).length}),"demande(s) repondue(s) sur",(0,u.jsx)("span",{style:{color:"red",margin:"7px",fontSize:"1rem"},children:n.length})," demande(s) envoy\xe9e(s)",(0,u.jsx)("span",{style:{color:"red",margin:"7px",fontSize:"1rem"},children:isNaN((100*n.filter((e=>e.reponse.length>0)).length/n.length).toFixed(0))?"":"Soit "+(100*n.filter((e=>e.reponse.length>0)).length/n.length).toFixed(0)+"%"})]})})})};var m=t(372541),j=t(861689),f=t(542420),v=t(270501),Z=t(818580),y=t(416031),b=t.n(y),S=t(334811),C=t(406740),w=t(565280),A=t(261113),N=t(557829),P=t(70816),z=t.n(P);function D(e){let{data:n}=e;const[t,l]=h.useState({fn:e=>e});return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(i.ZP,{container:!0,sx:{marginBottom:"10px"},children:(0,u.jsx)(i.ZP,{item:!0,lg:8,children:(0,u.jsx)(d.default,{type:"text",onChange:e=>(e=>{let n=e.target.value.toUpperCase();l({fn:e=>""===n?e:e.filter((e=>e.reponse[0].codeclient.includes(n)||e.reponse[0].nomClient.includes(n)))})})(e),placeholder:"Code client ou nom du client"})})}),(0,u.jsx)(i.ZP,{container:!0,children:n&&t.fn((e=>{try{return e.filter((e=>e.reponse.length>0))}catch(n){return[]}})(n)).map((e=>(0,u.jsx)(i.ZP,{sx:{padding:"3px"},item:!0,lg:6,children:(0,u.jsxs)("div",{className:"messagesToutes",children:[(0,u.jsxs)("div",{className:"listeImage",children:[(0,u.jsx)("img",{src:"".concat(p.BP,"/").concat(e.file),alt:e._id}),(0,u.jsxs)(A.Z,{component:"p",sx:{fontSize:"13px"},children:[void 0!==e.codeclient&&e.codeclient,";",null===e||void 0===e?void 0:e.sat," ",null===e||void 0===e?void 0:e.reference,null===e||void 0===e?void 0:e.statut,"; ",null===e||void 0===e?void 0:e.raison.toLowerCase(),", ",e.numero&&e.numero,";"]})]}),(0,u.jsx)("div",{className:"itemButtons"}),(0,u.jsx)("div",{children:e.conversation.length>0&&e.conversation.map((e=>(0,u.jsxs)("div",{className:"agent"===e.sender?"agent":"callcenter",children:[(0,u.jsx)("p",{className:"messageText",children:e.message}),(0,u.jsx)("p",{className:"heure",children:z()(e.createdAt).fromNow()})]},e._id)))}),(0,u.jsx)("div",{children:e.reponse.length>0&&e.reponse.map((e=>(0,u.jsxs)("div",{className:"reponseListe",children:[(0,u.jsx)("p",{children:e.codeclient}),(0,u.jsx)("p",{style:{fontWeight:"bold"},children:e.nomClient.toUpperCase()}),(0,u.jsxs)("p",{children:["Statut du client : ",(0,u.jsx)("span",{style:{fontWeight:"bolder"},children:e.clientStatut})," "]}),(0,u.jsxs)("p",{children:["Statut payement : ",(0,u.jsx)("span",{style:{fontWeight:"bolder"},children:e.PayementStatut})]}),(0,u.jsxs)("p",{children:["consExpDays :"," ",(0,u.jsxs)("span",{style:{fontWeight:"bolder"},children:[e.consExpDays," jour(s) "]})]}),(0,u.jsx)("p",{children:e.followup?"Categorie : Follow_up":"Categorie : visite"}),(0,u.jsx)("p",{children:null===e||void 0===e?void 0:e.codeCu})]},e._id)))})]})},e._id)))}),n&&0===n.length&&(0,u.jsx)("p",{style:{fontSize:"12px",marginTop:"20px",textAlign:"center",color:"red"},children:"Aucune demande trouv\xe9e"})]})}const k=h.memo(D);var B=t(396180);const T=function(e){let{data:n}=e;const[t,l]=B.ZP.useMessage(),[s,o]=h.useState({fn:e=>e});return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(u.Fragment,{children:l}),(0,u.jsx)(i.ZP,{container:!0,sx:{marginBottom:"10px"},children:(0,u.jsx)(i.ZP,{item:!0,lg:8,children:(0,u.jsx)(d.default,{type:"text",onChange:e=>(e=>{let n=e.target.value.toUpperCase();o({fn:e=>""===n?e:e.filter((e=>e.codeclient.includes(n)))})})(e),placeholder:"Code client ou ID demande"})})}),(0,u.jsx)(i.ZP,{container:!0,children:n&&s.fn((e=>{try{return e.filter((e=>0===e.reponse.length))}catch(n){return[]}})(n)).map((e=>(0,u.jsxs)(i.ZP,{item:!0,lg:12,className:"messagesToutes",children:[(0,u.jsxs)("div",{className:"listeImage",children:[(0,u.jsx)("img",{src:"".concat(p.BP,"/").concat(e.file),alt:e._id}),(0,u.jsxs)(A.Z,{component:"p",sx:{fontSize:"13px"},children:[(0,u.jsxs)(A.Z,{children:["ID : ",e.idDemande,(0,u.jsx)(A.Z,{component:"span",onClick:()=>{return n=e.idDemande,navigator.clipboard.writeText(n),void t.open({type:"success",content:"Done "+n,duration:2});var n},style:{marginLeft:"10px",color:"blue",fontWeight:"bolder",cursor:"pointer",textAlign:"center"},children:"copy ID"}),(0,u.jsx)("span",{style:{float:"right",fontSize:"10px"},children:z()(e.createdAt).fromNow()})]}),void 0!==e.codeclient&&e.codeclient,";",null===e||void 0===e?void 0:e.sat," ",null===e||void 0===e?void 0:e.reference,null===e||void 0===e?void 0:e.statut,"; ",null===e||void 0===e?void 0:e.raison.toLowerCase(),", ",e.numero&&e.numero,";"]})]}),(0,u.jsx)("div",{className:"itemButtons"}),(0,u.jsx)("div",{children:e.conversation.length>0&&e.conversation.map((e=>(0,u.jsxs)("div",{className:"agent"===e.sender?"agent":"callcenter",children:[(0,u.jsx)("p",{className:"messageText",children:e.message}),(0,u.jsx)("p",{className:"heure",children:z()(e.createdAt).fromNow()})]},e._id)))})]},e._id)))}),n&&0===n.length&&(0,u.jsx)("p",{style:{fontSize:"12px",marginTop:"20px",textAlign:"center",color:"red"},children:"Aucune demande trouv\xe9e"})]})};function F(e){const{children:n,value:t,index:l,...i}=e;return(0,u.jsx)("div",{role:"tabpanel",hidden:t!==l,id:"simple-tabpanel-".concat(l),"aria-labelledby":"simple-tab-".concat(l),...i,children:t===l&&(0,u.jsx)(N.Z,{sx:{p:3},children:(0,u.jsx)(A.Z,{children:n})})})}function I(e){return{id:"simple-tab-".concat(e),"aria-controls":"simple-tabpanel-".concat(e)}}function O(e){let{data:n}=e;const[t,l]=h.useState(0);return(0,u.jsxs)(N.Z,{sx:{width:"100%",minWidth:"30rem"},children:[(0,u.jsx)(N.Z,{sx:{borderBottom:1,borderColor:"divider"},children:(0,u.jsxs)(C.Z,{value:t,onChange:(e,n)=>{l(n)},"aria-label":"basic tabs example",children:[(0,u.jsx)(w.Z,{label:"Valide",...I(0)}),(0,u.jsx)(w.Z,{label:"Attente",...I(1)})]})}),(0,u.jsx)(F,{value:t,index:0,children:(0,u.jsx)(k,{data:n})}),(0,u.jsx)(F,{value:t,index:1,children:(0,u.jsx)(T,{data:n})})]})}const R=function(e){let{listeDemande:n}=e;const[t,l]=h.useState(),[i,s]=h.useState(!1),[o,r]=h.useState();h.useEffect((()=>{(()=>{const e=b().groupBy(n,"codeAgent");try{let t=[],i=Object.keys(e);for(let e=0;e<i.length;e++)t.push({nom:n.filter((n=>n.agent.codeAgent===i[e]))[0].agent.nom,code:i[e],nonRepondu:n.filter((n=>n.agent.codeAgent===i[e]&&0===n.reponse.length)).length,repondu:n.filter((n=>n.agent.codeAgent===i[e]&&n.reponse.length>0&&!n.reponse[0].followup)).length,followup:n.filter((n=>n.agent.codeAgent===i[e]&&n.reponse.length>0&&n.reponse[0].followup)).length,total:n.filter((n=>n.agent.codeAgent===i[e])).length,id:e});l(b().orderBy(t,"total","desc"))}catch(t){console.log(t)}})()}),[n]);const[a,c]=h.useState({fn:e=>e}),x=[{field:"nom",headerName:"Nom Agent",width:250,editable:!1},{field:"code",headerName:"Code Agent",width:130,editable:!1},{field:"repondu",headerName:"Conformes",width:80,editable:!1},{field:"followup",headerName:"Followup",width:80,editable:!1},{field:"nonRepondu",headerName:"Attentes",width:70,editable:!1},{field:"total",headerName:"Total",width:70,editable:!1},{field:"action",headerName:"Action",width:100,editable:!1,renderCell:e=>(0,u.jsx)(u.Fragment,{children:(0,u.jsx)(j.Z,{title:"Plus les d\xe9tails",onClick:t=>((e,t)=>{e.preventDefault(),r(b().filter(n,{codeAgent:t})),s(!0)})(t,e.row.code),children:(0,u.jsx)(f.Z,{size:"small",color:"primary",children:(0,u.jsx)(m.default,{fontSize:"small"})})})})}];return(0,u.jsxs)(v.Z,{elevation:3,sx:{padding:"10px"},children:[(0,u.jsx)("div",{style:{width:"100%",display:"flex",alignItems:"center",justifyContent:"center"},children:(0,u.jsx)("div",{style:{width:"30%"},children:(0,u.jsx)(d.default,{onChange:e=>(e=>{let n=e.target.value.toUpperCase();c({fn:e=>""===n?e:e.filter((e=>e.code.includes(n)||e.nom.includes(n)))})})(e),placeholder:"Cherchez le Code agent ou nom Agent"})})}),t&&(0,u.jsx)(Z._$,{rows:a.fn(t),columns:x,initialState:{pagination:{paginationModel:{pageSize:7}}},pageSizeOptions:[7],checkboxSelection:!0,disableRowSelectionOnClick:!0}),o&&(0,u.jsx)(S.Z,{open:i,setOpen:s,title:"pour ".concat(o[0].agent.nom," -------- code : ").concat(o[0].agent.codeAgent),children:(0,u.jsx)(O,{data:o})})]})};var V=t(71978),_=t(961157),E=t(337169),W=t(326236),L=t(75767),K=t(942450),U=t(763743),M=t(573203),$=t(75854);function q(e){let{donner:n,recherche:t}=e;const[l,s]=(0,h.useState)({datas:[]}),{datas:d}=l;return(0,h.useEffect)((()=>{(()=>{let e=[];const t=b().groupBy(n,"zone.denomination");let l=Object.keys(t);for(let n=0;n<l.length;n++)e.push({region:l[n],agent:t[""+l[n]].filter((e=>"agent"===e.agent.fonction)).length,tech:t[""+l[n]].filter((e=>"tech"===e.agent.fonction)).length});s({datas:e})})()}),[n]),(0,u.jsx)(i.ZP,{container:!0,sx:{height:"25rem"},children:(0,u.jsx)(i.ZP,{item:!0,lg:12,children:!t.codeAgent&&(0,u.jsx)(V.h,{width:"100%",children:(0,u.jsxs)(_.v,{data:d,children:[(0,u.jsx)(E.q,{strokeDasharray:"3 3"}),(0,u.jsx)(W.K,{dataKey:"region"}),(0,u.jsx)(L.B,{}),(0,u.jsx)(K.u,{}),(0,u.jsx)(U.D,{}),(0,u.jsx)(M.$,{dataKey:"agent",fill:"#8884d8",activeBar:(0,u.jsx)($.A,{fill:"pink",stroke:"blue"})}),(0,u.jsx)(M.$,{dataKey:"tech",fill:"#82ca9d",activeBar:(0,u.jsx)($.A,{fill:"gold",stroke:"purple"})})]})})})})}const G=(0,h.memo)(q);const H=function(e){let{listeDemande:n,region:t}=e;const l=(0,x.v9)((e=>e.zone.zone));console.log(l),console.log(t);const i=(e,t,l)=>{try{return(n&&n.filter((e=>e.reponse.length>0))).filter((n=>n.reponse[0].clientStatut===t&&n.reponse[0].PayementStatut===l&&n.codeZone===e)).length}catch(i){console.log(i)}},s=e=>{try{return(n&&n.filter((e=>0===e.reponse.length))).filter((n=>n.codeZone===e)).length}catch(t){console.log(t)}},d=e=>{try{let t=n&&n.filter((n=>n.codeZone===e));return{total:t.length,pourcentage:(100*t.length/n.length).toFixed(0)}}catch(t){console.log(t)}};return(0,u.jsx)(v.Z,{elevation:3,children:(0,u.jsxs)("table",{children:[(0,u.jsx)("thead",{children:(0,u.jsxs)("tr",{style:{background:"#dedede"},children:[(0,u.jsx)("td",{children:"Region"}),(0,u.jsx)("td",{children:"Statut du client"}),(0,u.jsx)("td",{children:"Statut payement"}),(0,u.jsx)("td",{children:"Nombre"}),(0,u.jsx)("td",{children:"En attente"})]})}),(0,u.jsx)("tbody",{children:(t?[t]:l).map(((e,n)=>(0,u.jsxs)(h.Fragment,{children:[(0,u.jsxs)("tr",{children:[(0,u.jsx)("td",{rowSpan:"7",children:e.denomination}),(0,u.jsx)("td",{children:"installed"}),(0,u.jsx)("td",{children:"Normal"}),(0,u.jsx)("td",{children:i(e.idZone,"installed","normal")}),(0,u.jsx)("td",{rowSpan:"6",style:{fontSize:"25px",fontWeight:"bolder"},children:s(e.idZone)})]}),(0,u.jsxs)("tr",{children:[(0,u.jsx)("td",{children:"installed"}),(0,u.jsx)("td",{children:"expired"}),(0,u.jsx)("td",{children:i(e.idZone,"installed","expired")})]}),(0,u.jsxs)("tr",{children:[(0,u.jsx)("td",{children:"installed"}),(0,u.jsx)("td",{children:"Defaulted"}),(0,u.jsx)("td",{children:i(e.idZone,"installed","defaulted")})]}),(0,u.jsxs)("tr",{children:[(0,u.jsx)("td",{children:"pending repossession"}),(0,u.jsx)("td",{children:"defaulted"}),(0,u.jsx)("td",{children:i(e.idZone,"pending repossession","defaulted")})]}),(0,u.jsxs)("tr",{children:[(0,u.jsx)("td",{children:"pending activation"}),(0,u.jsx)("td",{children:"pending fulfliment"}),(0,u.jsx)("td",{children:i(e.idZone,"pending activation","pending fulfliment")})]}),(0,u.jsxs)("tr",{children:[(0,u.jsx)("td",{children:"inactive"}),(0,u.jsx)("td",{children:"terminated"}),(0,u.jsx)("td",{children:i(e.idZone,"inactive","terminated")})]}),(0,u.jsxs)("tr",{style:{background:"#dedede"},children:[(0,u.jsx)("td",{colSpan:"3",children:"Total"}),(0,u.jsxs)("td",{style:{padding:"0px",margin:"0px",fontWeight:"bolder"},children:[(0,u.jsx)("span",{style:{fontSize:"15px"},children:d(e.idZone).total}),(0,u.jsxs)("span",{children:[" "," Soit "+d(e.idZone).pourcentage,"%"]})]})]})]},n)))})]})})};const J=function(){const e=(0,x.v9)((e=>e.zone)),[n,t]=h.useState(""),[m,j]=h.useState(""),[f,v]=h.useState({debut:"",fin:""}),{debut:Z,fin:y}=f,[b,S]=h.useState(!1),[C,w]=h.useState(),[A,N]=h.useState();return h.useEffect((()=>{C&&(async()=>{S(!0);try{o.Z.post(p.V6+"/demandeAgentAll",{data:C,debut:Z.split("T")[0],fin:y.split("T")[0]},p.vc).then((e=>{"token expired"===e.data?(localStorage.removeItem("auth"),window.location.replace("/login")):(console.log(e.data),N(e.data),S(!1))}))}catch(e){console.log(e)}})()}),[C]),(0,u.jsxs)(r.Z,{children:[(0,u.jsxs)(i.ZP,{container:!0,children:[(null===e||void 0===e?void 0:e.zone.length)>0&&(0,u.jsx)(i.ZP,{item:!0,lg:2,sm:6,xs:12,md:6,sx:{padding:"5px"},children:(0,u.jsx)(a.Z,{value:n,setValue:t,options:e.zone,title:"R\xe9gions",propr:"denomination"})}),n&&(0,u.jsx)(i.ZP,{item:!0,lg:2,sm:6,md:6,xs:12,sx:{padding:"5px"},children:(0,u.jsx)(a.Z,{value:m,setValue:j,options:n.shop,title:"Shop",propr:"shop"})}),(0,u.jsx)(i.ZP,{item:!0,lg:3,sm:6,xs:12,md:6,sx:{padding:"5px",display:"flex",alignItems:"center"},children:(0,u.jsx)(d.default,{type:"date",onChange:e=>v({...f,debut:e.target.value}),placeholder:"Date"})}),(0,u.jsx)(i.ZP,{item:!0,lg:3,sm:6,xs:12,md:6,sx:{padding:"5px",display:"flex",alignItems:"center"},children:(0,u.jsx)(d.default,{onChange:e=>v({...f,fin:e.target.value}),type:"date",placeholder:"Date"})}),(0,u.jsx)(i.ZP,{item:!0,lg:2,sx:{padding:"5px",display:"flex",alignItems:"center"},children:(0,u.jsxs)(s.Z,{color:"primary",variant:"contained",disabled:b,onClick:e=>(e=>{e.preventDefault();const t={region:n?n.idZone:void 0,idShop:m?m.idShop:void 0};let l={};void 0!==t.idShop&&(l.idShop=t.idShop),void 0!==t.region&&(l.codeZone=t.region),w(l)})(e),children:[(0,u.jsx)(l.Z,{fontSize:"small"})," ",(0,u.jsx)("span",{style:{marginLeft:"5px"},children:b?"Loading...":"Rechercher"})]})})]}),(0,u.jsx)(i.ZP,{container:!0,children:(0,u.jsx)(i.ZP,{item:!0,lg:12,children:A&&(0,u.jsxs)(i.ZP,{children:[(0,u.jsx)(g,{listeDemande:A}),(0,u.jsx)(c.Z,{titres:[{id:0,label:"Graphique"},{id:1,label:"R\xe9gions"},{id:2,label:"Agents"}],components:[{id:0,component:(0,u.jsx)(G,{donner:A,recherche:C})},{id:1,component:(0,u.jsx)(H,{region:n,listeDemande:A})},{id:2,component:(0,u.jsx)(R,{listeDemande:A})}]})]})})})]})}},334811:(e,n,t)=>{t.d(n,{Z:()=>x});var l=t(747313),i=t(966149),s=t(896467),d=t(233604),o=t(850301),r=t(508586),a=t(261113),c=t(346417);const h=l.forwardRef((function(e,n){return(0,c.jsx)(o.Z,{direction:"up",ref:n,...e})}));const x=function(e){let{open:n,children:t,setOpen:l,title:o}=e;return(0,c.jsx)("div",{children:(0,c.jsxs)(i.Z,{open:n,TransitionComponent:h,keepMounted:!0,onClose:()=>{l(!1)},"aria-describedby":"alert-dialog-slide-description",children:[(0,c.jsxs)(d.Z,{style:{display:"flex",justifyContent:"space-between"},children:[(0,c.jsx)(a.Z,{children:o}),(0,c.jsx)(r.Z,{fontSize:"small",color:"secondary",style:{cursor:"pointer"},onClick:()=>l(!1)})]}),(0,c.jsx)(s.Z,{children:t})]})})}},245135:()=>{}}]);