"use strict";(self.webpackChunkfront=self.webpackChunkfront||[]).push([[885],{803105:(e,t,n)=>{n.d(t,{Z:()=>l});var o=n(876767),r=n(648623),i=n(624631),a=n(346417);const s=(0,o.D)();const l=function(e){let{value:t,setValue:n,options:o,title:l,propr:c}=e;return(0,a.jsx)(r.Z,{value:t,onChange:(e,t)=>{"string"===typeof t?n({title:t}):t&&t.inputValue?n({title:t.inputValue}):n(t)},filterOptions:(e,t)=>s(e,t),selectOnFocus:!0,clearOnBlur:!0,handleHomeEndKeys:!0,id:"free-solo-with",options:o,getOptionLabel:e=>"string"===typeof e?e:e.inputValue?e.inputValue:e[""+c],renderOption:(e,t)=>(0,a.jsx)("li",{...e,children:t[""+c]},t.id),sx:{width:"100%"},freeSolo:!0,renderInput:e=>(0,a.jsx)(i.Z,{...e,label:l||"Titre"})})}},680509:(e,t,n)=>{n.d(t,{Z:()=>i});var o=n(936373),r=n(346417);const i=function(e){const{message:t,open:n,setOpen:i}=e;return(0,r.jsx)("div",{children:(0,r.jsx)(o.Z,{anchorOrigin:{vertical:"bottom",horizontal:"center"},open:n,onClose:()=>{i(!1)},message:t},"bottom center")})}},927885:(e,t,n)=>{n.r(t),n.d(t,{default:()=>S});var o=n(270501),r=n(818580),i=n(576940),a=n(835662),s=n(747313),l=n(594500),c=n(661395),d=n(334811),p=n(624631),u=n(369099),h=n(585281),m=n(318394),x=n(680509),f=n(346417);const g=function(){const[e,t]=(0,s.useState)(""),n=(0,l.I0)(),o=(0,l.v9)((e=>e.zone)),[r,i]=(0,s.useState)(!1);return(0,f.jsxs)("div",{style:{padding:"10px",width:"20rem"},children:["rejected"===o.addZone&&(0,f.jsx)(x.Z,{message:o.addZoneError,open:r,setOpen:i}),"success"===o.addZone&&(0,f.jsx)(x.Z,{message:"Enregistrement effectuer",open:!0,setOpen:i}),(0,f.jsxs)("div",{style:{display:"flex"},children:[(0,f.jsx)(p.Z,{onChange:e=>{e.preventDefault(),t(e.target.value)},value:e,label:"D\xe9nomination",name:"etablissement",autoComplete:"off",fullWidth:!0}),(0,f.jsxs)(u.Z,{sx:{marginLeft:"10px"},variant:"contained",disabled:"pending"===o.addZone,onClick:t=>(t=>{t.preventDefault();try{n((0,m.DS)(e)),i(!0)}catch(o){}})(t),children:["pending"===o.addZone&&(0,f.jsx)(h.Z,{color:"inherit",size:20}),(0,f.jsx)("span",{style:{marginLeft:"10px"},children:"Enregistrer"})]})]})]})};var v=n(803105),Z=n(160609);const b=function(){const[e,t]=(0,s.useState)({shop:"",adresse:""}),{shop:n,adresse:o}=e,r=(0,l.I0)(),i=(0,l.v9)((e=>e.zone.zone)),[a,c]=s.useState("");return(0,f.jsxs)("div",{style:{padding:"10px",width:"20rem"},children:[(0,f.jsx)("div",{children:(0,f.jsx)(p.Z,{onChange:n=>{n.preventDefault(),t({...e,shop:n.target.value})},value:n,label:"Shop *",name:"shop",autoComplete:"off",fullWidth:!0})}),(0,f.jsx)("div",{style:{marginTop:"10px",marginBottom:"10px"},children:(0,f.jsx)(p.Z,{onChange:n=>{n.preventDefault(),t({...e,adresse:n.target.value})},value:o,label:"Adresse du shop",name:"adresse",autoComplete:"off",fullWidth:!0})}),(0,f.jsx)("div",{children:i&&(0,f.jsx)(v.Z,{value:a,setValue:c,options:i,title:"Selectionnez la region",propr:"denomination"})}),(0,f.jsxs)(u.Z,{onClick:e=>(e=>{e.preventDefault(),r((0,Z.Bx)({shop:n,adresse:o,idZone:""!==a&&a.idZone}))})(e),sx:{marginTop:"10px"},variant:"contained",fullWidth:!0,children:[(0,f.jsx)(h.Z,{color:"inherit",size:20}),(0,f.jsx)("span",{style:{marginLeft:"10px"},children:"Enregistrer"})]})]})};const w=function(){return(0,f.jsx)("div",{children:(0,f.jsx)(b,{})})};const S=function(){const[e,t]=(0,s.useState)(),[n,p]=(0,s.useState)(!1);(0,s.useEffect)((()=>{(async()=>{const e=await a.Z.get(c.V6+"/zone",c.vc);t(e.data)})()}),[]);const u=(0,l.v9)((e=>e.shop.shop)),h=(0,l.v9)((e=>e.user.user));return(0,f.jsxs)(o.Z,{elevation:3,sx:{padding:"10px"},children:["superUser"===(null===h||void 0===h?void 0:h.fonction)&&(0,f.jsx)(g,{}),(0,f.jsxs)("div",{style:{display:"flex"},children:[(0,f.jsx)("div",{style:{width:"50%"},children:e&&(0,f.jsx)(r._$,{rows:e,columns:[{field:"idZone",headerName:"ID_Region",width:100,editable:!1},{field:"denomination",headerName:"REGION",width:150,editable:!1}],initialState:{pagination:{paginationModel:{pageSize:6}}},pageSizeOptions:[6],checkboxSelection:!0,disableRowSelectionOnClick:!0})}),(0,f.jsxs)("div",{style:{width:"50%"},children:["superUser"===(null===h||void 0===h?void 0:h.fonction)&&(0,f.jsx)(i.ZP,{type:"primary",onClick:()=>p(!0),children:"Ajoutez un shop"}),u&&(0,f.jsx)(r._$,{rows:u,columns:[{field:"region",headerName:"REGION",width:80,editable:!1,renderCell:e=>e.row.region.denomination},{field:"idShop",headerName:"ID SHOP",width:100,editable:!1},{field:"shop",headerName:"SHOP",width:100,editable:!1}],initialState:{pagination:{paginationModel:{pageSize:6}}},pageSizeOptions:[6],checkboxSelection:!0,disableRowSelectionOnClick:!0})]})]}),(0,f.jsx)(d.Z,{open:n,setOpen:p,title:"Ajoutez un shop",children:(0,f.jsx)(w,{})})]})}},334811:(e,t,n)=>{n.d(t,{Z:()=>u});var o=n(747313),r=n(966149),i=n(896467),a=n(233604),s=n(850301),l=n(508586),c=n(261113),d=n(346417);const p=o.forwardRef((function(e,t){return(0,d.jsx)(s.Z,{direction:"up",ref:t,...e})}));const u=function(e){let{open:t,children:n,setOpen:o,title:s}=e;return(0,d.jsx)("div",{children:(0,d.jsxs)(r.Z,{open:t,TransitionComponent:p,keepMounted:!0,onClose:()=>{o(!1)},"aria-describedby":"alert-dialog-slide-description",children:[(0,d.jsxs)(a.Z,{style:{display:"flex",justifyContent:"space-between"},children:[(0,d.jsx)(c.Z,{children:s}),(0,d.jsx)(l.Z,{fontSize:"small",color:"secondary",style:{cursor:"pointer"},onClick:()=>o(!1)})]}),(0,d.jsx)(i.Z,{children:n})]})})}},508586:(e,t,n)=>{n.d(t,{Z:()=>i});var o=n(181171),r=n(346417);const i=(0,o.Z)((0,r.jsx)("path",{d:"M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"}),"Close")},896467:(e,t,n)=>{n.d(t,{Z:()=>m});var o=n(747313),r=n(683061),i=n(608007),a=n(617592),s=n(577342),l=n(814363),c=n(601167);function d(e){return(0,c.ZP)("MuiDialogContent",e)}(0,l.Z)("MuiDialogContent",["root","dividers"]);var p=n(893174),u=n(346417);const h=(0,a.ZP)("div",{name:"MuiDialogContent",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,n.dividers&&t.dividers]}})((e=>{let{theme:t,ownerState:n}=e;return{flex:"1 1 auto",WebkitOverflowScrolling:"touch",overflowY:"auto",padding:"20px 24px",...n.dividers?{padding:"16px 24px",borderTop:"1px solid ".concat((t.vars||t).palette.divider),borderBottom:"1px solid ".concat((t.vars||t).palette.divider)}:{[".".concat(p.Z.root," + &")]:{paddingTop:0}}}})),m=o.forwardRef((function(e,t){const n=(0,s.Z)({props:e,name:"MuiDialogContent"}),{className:o,dividers:a=!1,...l}=n,c={...n,dividers:a},p=(e=>{const{classes:t,dividers:n}=e,o={root:["root",n&&"dividers"]};return(0,i.Z)(o,d,t)})(c);return(0,u.jsx)(h,{className:(0,r.Z)(p.root,o),ownerState:c,ref:t,...l})}))},233604:(e,t,n)=>{n.d(t,{Z:()=>h});var o=n(747313),r=n(683061),i=n(608007),a=n(261113),s=n(617592),l=n(577342),c=n(893174),d=n(963909),p=n(346417);const u=(0,s.ZP)(a.Z,{name:"MuiDialogTitle",slot:"Root",overridesResolver:(e,t)=>t.root})({padding:"16px 24px",flex:"0 0 auto"}),h=o.forwardRef((function(e,t){const n=(0,l.Z)({props:e,name:"MuiDialogTitle"}),{className:a,id:s,...h}=n,m=n,x=(e=>{const{classes:t}=e;return(0,i.Z)({root:["root"]},c.a,t)})(m),{titleId:f=s}=o.useContext(d.Z);return(0,p.jsx)(u,{component:"h2",className:(0,r.Z)(x.root,a),ownerState:m,ref:t,variant:"h6",id:null!=s?s:f,...h})}))},893174:(e,t,n)=>{n.d(t,{Z:()=>a,a:()=>i});var o=n(814363),r=n(601167);function i(e){return(0,r.ZP)("MuiDialogTitle",e)}const a=(0,o.Z)("MuiDialogTitle",["root"])},966149:(e,t,n)=>{n.d(t,{Z:()=>y});var o=n(747313),r=n(683061),i=n(608007),a=n(160994),s=n(691615),l=n(125673),c=n(632530),d=n(270501),p=n(577342),u=n(617592),h=n(814363),m=n(601167);function x(e){return(0,m.ZP)("MuiDialog",e)}const f=(0,h.Z)("MuiDialog",["root","scrollPaper","scrollBody","container","paper","paperScrollPaper","paperScrollBody","paperWidthFalse","paperWidthXs","paperWidthSm","paperWidthMd","paperWidthLg","paperWidthXl","paperFullWidth","paperFullScreen"]);var g=n(963909),v=n(91554),Z=n(319860),b=n(346417);const w=(0,u.ZP)(v.Z,{name:"MuiDialog",slot:"Backdrop",overrides:(e,t)=>t.backdrop})({zIndex:-1}),S=(0,u.ZP)(l.Z,{name:"MuiDialog",slot:"Root",overridesResolver:(e,t)=>t.root})({"@media print":{position:"absolute !important"}}),j=(0,u.ZP)("div",{name:"MuiDialog",slot:"Container",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.container,t["scroll".concat((0,s.Z)(n.scroll))]]}})((e=>{let{ownerState:t}=e;return{height:"100%","@media print":{height:"auto"},outline:0,..."paper"===t.scroll&&{display:"flex",justifyContent:"center",alignItems:"center"},..."body"===t.scroll&&{overflowY:"auto",overflowX:"hidden",textAlign:"center","&:after":{content:'""',display:"inline-block",verticalAlign:"middle",height:"100%",width:"0"}}}})),k=(0,u.ZP)(d.Z,{name:"MuiDialog",slot:"Paper",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.paper,t["scrollPaper".concat((0,s.Z)(n.scroll))],t["paperWidth".concat((0,s.Z)(String(n.maxWidth)))],n.fullWidth&&t.paperFullWidth,n.fullScreen&&t.paperFullScreen]}})((e=>{let{theme:t,ownerState:n}=e;return{margin:32,position:"relative",overflowY:"auto","@media print":{overflowY:"visible",boxShadow:"none"},..."paper"===n.scroll&&{display:"flex",flexDirection:"column",maxHeight:"calc(100% - 64px)"},..."body"===n.scroll&&{display:"inline-block",verticalAlign:"middle",textAlign:"left"},...!n.maxWidth&&{maxWidth:"calc(100% - 64px)"},..."xs"===n.maxWidth&&{maxWidth:"px"===t.breakpoints.unit?Math.max(t.breakpoints.values.xs,444):"max(".concat(t.breakpoints.values.xs).concat(t.breakpoints.unit,", 444px)"),["&.".concat(f.paperScrollBody)]:{[t.breakpoints.down(Math.max(t.breakpoints.values.xs,444)+64)]:{maxWidth:"calc(100% - 64px)"}}},...n.maxWidth&&"xs"!==n.maxWidth&&{maxWidth:"".concat(t.breakpoints.values[n.maxWidth]).concat(t.breakpoints.unit),["&.".concat(f.paperScrollBody)]:{[t.breakpoints.down(t.breakpoints.values[n.maxWidth]+64)]:{maxWidth:"calc(100% - 64px)"}}},...n.fullWidth&&{width:"calc(100% - 64px)"},...n.fullScreen&&{margin:0,width:"100%",maxWidth:"100%",height:"100%",maxHeight:"none",borderRadius:0,["&.".concat(f.paperScrollBody)]:{margin:0,maxWidth:"100%"}}}})),y=o.forwardRef((function(e,t){const n=(0,p.Z)({props:e,name:"MuiDialog"}),l=(0,Z.Z)(),u={enter:l.transitions.duration.enteringScreen,exit:l.transitions.duration.leavingScreen},{"aria-describedby":h,"aria-labelledby":m,BackdropComponent:f,BackdropProps:v,children:y,className:C,disableEscapeKeyDown:W=!1,fullScreen:M=!1,fullWidth:D=!1,maxWidth:O="sm",onBackdropClick:P,onClose:R,open:z,PaperComponent:E=d.Z,PaperProps:T={},scroll:B="paper",TransitionComponent:L=c.Z,transitionDuration:N=u,TransitionProps:I,...A}=n,F={...n,disableEscapeKeyDown:W,fullScreen:M,fullWidth:D,maxWidth:O,scroll:B},H=(e=>{const{classes:t,scroll:n,maxWidth:o,fullWidth:r,fullScreen:a}=e,l={root:["root"],container:["container","scroll".concat((0,s.Z)(n))],paper:["paper","paperScroll".concat((0,s.Z)(n)),"paperWidth".concat((0,s.Z)(String(o))),r&&"paperFullWidth",a&&"paperFullScreen"]};return(0,i.Z)(l,x,t)})(F),V=o.useRef(),K=(0,a.Z)(m),G=o.useMemo((()=>({titleId:K})),[K]);return(0,b.jsx)(S,{className:(0,r.Z)(H.root,C),closeAfterTransition:!0,components:{Backdrop:w},componentsProps:{backdrop:{transitionDuration:N,as:f,...v}},disableEscapeKeyDown:W,onClose:R,open:z,ref:t,onClick:e=>{V.current&&(V.current=null,P&&P(e),R&&R(e,"backdropClick"))},ownerState:F,...A,children:(0,b.jsx)(L,{appear:!0,in:z,timeout:N,role:"presentation",...I,children:(0,b.jsx)(j,{className:(0,r.Z)(H.container),onMouseDown:e=>{V.current=e.target===e.currentTarget},ownerState:F,children:(0,b.jsx)(k,{as:E,elevation:24,role:"dialog","aria-describedby":h,"aria-labelledby":K,...T,className:(0,r.Z)(H.paper,T.className),ownerState:F,children:(0,b.jsx)(g.Z.Provider,{value:G,children:y})})})})})}))},963909:(e,t,n)=>{n.d(t,{Z:()=>o});const o=n(747313).createContext({})},936373:(e,t,n)=>{n.d(t,{Z:()=>W});var o=n(747313),r=n(608007),i=n(919648),a=n(731685),s=n(951782),l=n(534816);var c=n(617592),d=n(319860),p=n(577342),u=n(691615),h=n(473365),m=n(683061),x=n(913392),f=n(270501),g=n(814363),v=n(601167);function Z(e){return(0,v.ZP)("MuiSnackbarContent",e)}(0,g.Z)("MuiSnackbarContent",["root","message","action"]);var b=n(346417);const w=(0,c.ZP)(f.Z,{name:"MuiSnackbarContent",slot:"Root",overridesResolver:(e,t)=>t.root})((e=>{let{theme:t}=e;const n="light"===t.palette.mode?.8:.98,o=(0,x._4)(t.palette.background.default,n);return{...t.typography.body2,color:t.vars?t.vars.palette.SnackbarContent.color:t.palette.getContrastText(o),backgroundColor:t.vars?t.vars.palette.SnackbarContent.bg:o,display:"flex",alignItems:"center",flexWrap:"wrap",padding:"6px 16px",borderRadius:(t.vars||t).shape.borderRadius,flexGrow:1,[t.breakpoints.up("sm")]:{flexGrow:"initial",minWidth:288}}})),S=(0,c.ZP)("div",{name:"MuiSnackbarContent",slot:"Message",overridesResolver:(e,t)=>t.message})({padding:"8px 0"}),j=(0,c.ZP)("div",{name:"MuiSnackbarContent",slot:"Action",overridesResolver:(e,t)=>t.action})({display:"flex",alignItems:"center",marginLeft:"auto",paddingLeft:16,marginRight:-8}),k=o.forwardRef((function(e,t){const n=(0,p.Z)({props:e,name:"MuiSnackbarContent"}),{action:o,className:i,message:a,role:s="alert",...l}=n,c=n,d=(e=>{const{classes:t}=e;return(0,r.Z)({root:["root"],action:["action"],message:["message"]},Z,t)})(c);return(0,b.jsxs)(w,{role:s,square:!0,elevation:6,className:(0,m.Z)(d.root,i),ownerState:c,ref:t,...l,children:[(0,b.jsx)(S,{className:d.message,ownerState:c,children:a}),o?(0,b.jsx)(j,{className:d.action,ownerState:c,children:o}):null]})}));function y(e){return(0,v.ZP)("MuiSnackbar",e)}(0,g.Z)("MuiSnackbar",["root","anchorOriginTopCenter","anchorOriginBottomCenter","anchorOriginTopRight","anchorOriginBottomRight","anchorOriginTopLeft","anchorOriginBottomLeft"]);const C=(0,c.ZP)("div",{name:"MuiSnackbar",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,t["anchorOrigin".concat((0,u.Z)(n.anchorOrigin.vertical)).concat((0,u.Z)(n.anchorOrigin.horizontal))]]}})((e=>{let{theme:t,ownerState:n}=e;return{zIndex:(t.vars||t).zIndex.snackbar,position:"fixed",display:"flex",left:8,right:8,justifyContent:"center",alignItems:"center",..."top"===n.anchorOrigin.vertical?{top:8}:{bottom:8},..."left"===n.anchorOrigin.horizontal&&{justifyContent:"flex-start"},..."right"===n.anchorOrigin.horizontal&&{justifyContent:"flex-end"},[t.breakpoints.up("sm")]:{..."top"===n.anchorOrigin.vertical?{top:24}:{bottom:24},..."center"===n.anchorOrigin.horizontal&&{left:"50%",right:"auto",transform:"translateX(-50%)"},..."left"===n.anchorOrigin.horizontal&&{left:24,right:"auto"},..."right"===n.anchorOrigin.horizontal&&{right:24,left:"auto"}}}})),W=o.forwardRef((function(e,t){const n=(0,p.Z)({props:e,name:"MuiSnackbar"}),c=(0,d.Z)(),m={enter:c.transitions.duration.enteringScreen,exit:c.transitions.duration.leavingScreen},{action:x,anchorOrigin:{vertical:f,horizontal:g}={vertical:"bottom",horizontal:"left"},autoHideDuration:v=null,children:Z,className:w,ClickAwayListenerProps:S,ContentProps:j,disableWindowBlurListener:W=!1,message:M,onBlur:D,onClose:O,onFocus:P,onMouseEnter:R,onMouseLeave:z,open:E,resumeHideDuration:T,TransitionComponent:B=h.Z,transitionDuration:L=m,TransitionProps:{onEnter:N,onExited:I,...A}={},...F}=n,H={...n,anchorOrigin:{vertical:f,horizontal:g},autoHideDuration:v,disableWindowBlurListener:W,TransitionComponent:B,transitionDuration:L},V=(e=>{const{classes:t,anchorOrigin:n}=e,o={root:["root","anchorOrigin".concat((0,u.Z)(n.vertical)).concat((0,u.Z)(n.horizontal))]};return(0,r.Z)(o,y,t)})(H),{getRootProps:K,onClickAway:G}=function(e){const{autoHideDuration:t=null,disableWindowBlurListener:n=!1,onClose:r,open:i,resumeHideDuration:a}=e,c=o.useRef();o.useEffect((()=>{if(i)return document.addEventListener("keydown",e),()=>{document.removeEventListener("keydown",e)};function e(e){e.defaultPrevented||"Escape"!==e.key&&"Esc"!==e.key||null==r||r(e,"escapeKeyDown")}}),[i,r]);const d=(0,s.Z)(((e,t)=>{null==r||r(e,t)})),p=(0,s.Z)((e=>{r&&null!=e&&(clearTimeout(c.current),c.current=setTimeout((()=>{d(null,"timeout")}),e))}));o.useEffect((()=>(i&&p(t),()=>{clearTimeout(c.current)})),[i,t,p]);const u=()=>{clearTimeout(c.current)},h=o.useCallback((()=>{null!=t&&p(null!=a?a:.5*t)}),[t,a,p]),m=e=>t=>{const n=e.onBlur;null==n||n(t),h()},x=e=>t=>{const n=e.onFocus;null==n||n(t),u()},f=e=>t=>{const n=e.onMouseEnter;null==n||n(t),u()},g=e=>t=>{const n=e.onMouseLeave;null==n||n(t),h()};return o.useEffect((()=>{if(!n&&i)return window.addEventListener("focus",h),window.addEventListener("blur",u),()=>{window.removeEventListener("focus",h),window.removeEventListener("blur",u)}}),[n,h,i]),{getRootProps:function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const n={...(0,l.Z)(e),...t};return{role:"presentation",...n,onBlur:m(n),onFocus:x(n),onMouseEnter:f(n),onMouseLeave:g(n)}},onClickAway:e=>{null==r||r(e,"clickaway")}}}({...H}),[X,Y]=o.useState(!0),_=(0,i.Z)({elementType:C,getSlotProps:K,externalForwardedProps:F,ownerState:H,additionalProps:{ref:t},className:[V.root,w]});return!E&&X?null:(0,b.jsx)(a.Z,{onClickAway:G,...S,children:(0,b.jsx)(C,{..._,children:(0,b.jsx)(B,{appear:!0,in:E,timeout:L,direction:"top"===f?"down":"up",onEnter:(e,t)=>{Y(!1),N&&N(e,t)},onExited:e=>{Y(!0),I&&I(e)},...A,children:Z||(0,b.jsx)(k,{message:M,action:x,...j})})})})}))}}]);