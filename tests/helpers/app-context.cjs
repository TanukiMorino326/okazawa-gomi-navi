const fs=require('node:fs'),vm=require('node:vm');
function setup({instant='2026-10-20T22:00:00Z',lang='ja',weatherError=false,storageError=false}={}){
 let clock=new Date(instant).getTime();const nodes=new Map(),events={},intervals=[];
 const make=()=>{const classes=new Set();return {textContent:'',innerHTML:'',hidden:true,dataset:{},attrs:{},events:{},children:[],classList:{toggle(c,on){if(on===undefined)on=!classes.has(c);on?classes.add(c):classes.delete(c)},contains:c=>classes.has(c)},setAttribute(k,v){this.attrs[k]=String(v)},removeAttribute(k){delete this.attrs[k]},getAttribute(k){return this.attrs[k]??null},addEventListener(k,fn){(this.events[k]??=[]).push(fn)},appendChild(c){this.children.push(c)},insertAdjacentHTML(_,html){this.innerHTML+=html},focus(){document.activeElement=this}}};
 const node=k=>{if(!nodes.has(k))nodes.set(k,make());return nodes.get(k)};
 const tabs=['home','week','calendar','sort'].map(tab=>{const n=node('tab-'+tab);n.dataset.tab=tab;return n});
 const languages=['ja','en'].map(lang=>{const n=node('lang-'+lang);n.dataset.lang=lang;return n});
 const sort=node('sort-home');sort.dataset.view='sort';node('#home-view').hidden=false;
 const document={documentElement:{},visibilityState:'visible',activeElement:null,getElementById:id=>node('#'+id),querySelector:node,querySelectorAll:s=>s==='[data-tab]'?tabs:s==='[data-lang]'?languages:s==='[data-view]'?[sort]:[],createElement:make,addEventListener(k,fn){(events[k]??=[]).push(fn)}};
 class AppDate extends Date{constructor(...args){super(...(args.length?args:[clock]))}static now(){return clock}}
 const window={Notification:undefined,okazawaPushReady:new Promise(()=>{}),location:{reload(){}},scrollTo(){},addEventListener(k,fn){(events[k]??=[]).push(fn)}};
 const sample={daily:{weather_code:[0,61],temperature_2m_max:[23,19],temperature_2m_min:[10,11],precipitation_probability_max:[0,80]}};
 const context=vm.createContext({document,window,Intl,Date:AppDate,console,localStorage:{getItem(){if(storageError)throw Error('storage');return lang},setItem(){if(storageError)throw Error('storage')}},fetch:async()=>{if(weatherError)throw Error('offline');return {ok:true,json:async()=>sample}},setTimeout:()=>1,clearTimeout(){},setInterval:fn=>intervals.push(fn),renderSort(){node('#sort-content').innerHTML='sort';}});
 vm.runInContext(fs.readFileSync('schedule-2026.js','utf8')+'\n'+fs.readFileSync('app.js','utf8'),context);
 return {context,node,document,events,intervals,eval:s=>vm.runInContext(s,context),setTime:iso=>{clock=new Date(iso).getTime()},lang:lng=>vm.runInContext(`currentLang=${JSON.stringify(lng)};refreshLanguage();`,context),flush:async()=>{for(let i=0;i<10;i++)await Promise.resolve()}};
}
module.exports={setup};
