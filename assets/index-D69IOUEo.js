import{i as y,v as I,x as b,y as L,u as M,z as w,h,q as g,A as W,k as O}from"./index-O2MPUUno.js";function E(e){return b()?(L(e),!0):!1}function m(e){return typeof e=="function"?e():M(e)}const A=typeof window<"u"&&typeof document<"u";typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope;const T=Object.prototype.toString,N=e=>T.call(e)==="[object Object]",C=()=>{};function j(e){return w()}function k(e,t=!0,n){j()?y(e,n):t?e():I(e)}function x(e){var t;const n=m(e);return(t=n==null?void 0:n.$el)!=null?t:n}const v=A?window:void 0;function z(...e){let t,n,o,i;if(typeof e[0]=="string"||Array.isArray(e[0])?([n,o,i]=e,t=v):[t,n,o,i]=e,!t)return C;Array.isArray(n)||(n=[n]),Array.isArray(o)||(o=[o]);const s=[],r=()=>{s.forEach(a=>a()),s.length=0},u=(a,d,f,p)=>(a.addEventListener(d,f,p),()=>a.removeEventListener(d,f,p)),c=g(()=>[x(t),m(i)],([a,d])=>{if(r(),!a)return;const f=N(d)?{...d}:d;s.push(...n.flatMap(p=>o.map(S=>u(a,p,S,f))))},{immediate:!0,flush:"post"}),l=()=>{c(),r()};return E(l),l}function H(){const e=h(!1),t=w();return t&&y(()=>{e.value=!0},t),e}function V(e){const t=H();return O(()=>(t.value,!!e()))}function _(e,t={}){const{window:n=v}=t,o=V(()=>n&&"matchMedia"in n&&typeof n.matchMedia=="function");let i;const s=h(!1),r=l=>{s.value=l.matches},u=()=>{i&&("removeEventListener"in i?i.removeEventListener("change",r):i.removeListener(r))},c=W(()=>{o.value&&(u(),i=n.matchMedia(m(e)),"addEventListener"in i?i.addEventListener("change",r):i.addListener(r),s.value=i.matches)});return E(()=>{c(),u(),i=void 0}),s}function F(e={}){const{window:t=v,initialWidth:n=Number.POSITIVE_INFINITY,initialHeight:o=Number.POSITIVE_INFINITY,listenOrientation:i=!0,includeScrollbar:s=!0}=e,r=h(n),u=h(o),c=()=>{t&&(s?(r.value=t.innerWidth,u.value=t.innerHeight):(r.value=t.document.documentElement.clientWidth,u.value=t.document.documentElement.clientHeight))};if(c(),k(c),z("resize",c,{passive:!0}),i){const l=_("(orientation: portrait)");g(l,()=>c())}return{width:r,height:u}}export{F as u};
