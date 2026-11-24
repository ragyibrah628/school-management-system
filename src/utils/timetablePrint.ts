// Shared print style + auto-fit script for every printed teaching timetable
// (admin class/teacher timetables and a teacher's own "My Timetable").
// The timetable grows its font / cell padding / row height so it fills the page,
// and always stays on ONE landscape page. Colours are black / grey only (B&W printers).
export const TT_PRINT_CSS = `
/* margin 0 removes the browser's own header/footer (date, title, link, page number) */
@page { size: A4 landscape; margin: 0; }
:root { --k: 1; }
* { margin:0; padding:0; box-sizing:border-box; }
html { background:#fff; }
body { width:100%; background:#fff; padding: 9mm 10mm; }
body { font-family: Arial, Helvetica, sans-serif; font-size: 9px; color:#000; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
a, a:visited, a:hover, a:active { color:inherit !important; text-decoration:none !important; }
table { width:100%; border-collapse:collapse; table-layout:fixed; page-break-inside:auto; }
thead { display:table-header-group; }
tr { page-break-inside:avoid; page-break-after:auto; }
th, td { border:1px solid #333; padding: calc(5px*var(--k)) calc(4px*var(--k)); text-align:center; vertical-align:middle; overflow-wrap:anywhere; }
th { background:#d9d9d9; font-weight:800; font-size: calc(8.5px*var(--k)); overflow-wrap:break-word; color:#000; }
td { font-size: calc(9px*var(--k)); line-height:1.2; }
.header { text-align:center; margin-bottom:8px; border-bottom:2px solid #000; padding-bottom:7px; page-break-after:avoid; }
.header h1 { font-size:19px; font-weight:900; letter-spacing:.5px; color:#000; }
.header h2 { font-size:13px; font-weight:800; color:#000; margin-top:3px; text-decoration:underline; }
.header p { font-size:8.5px; color:#222; margin-top:2px; }
.subject { font-weight:800; font-size: calc(11px*var(--k)); color:#000; line-height:1.15; }
.subteacher { font-weight:600; font-size: calc(9px*var(--k)); color:#222; margin-top:2px; }
.breakCell { background:#e3e3e3; color:#000; font-weight:800; font-size: calc(8px*var(--k)); }
.dayCol { background:#ececec; font-weight:900; font-size: calc(9px*var(--k)); color:#000; white-space:nowrap; overflow-wrap:normal; word-break:keep-all; }
.cellFill { background:#f2f2f2; }
.ttfoot { text-align:center; margin-top:6px; font-size:9px; color:#222; font-style:italic; border-top:1px solid #666; padding-top:4px; }
@media print {
  body { margin:0; }
  a, a::after, a::before { content:none !important; }
  .no-print, nav, footer { display:none !important; }
}
`;

export const TT_FIT_SCRIPT = `<script>(function(){
var TARGET_MM=203;
function fit(){
  var b=document.body, root=document.documentElement;
  var prevW=b.style.width; b.style.width='277mm';
  var px=TARGET_MM*96/25.4;
  var rows=[].slice.call(document.querySelectorAll('tbody tr'));
  rows.forEach(function(r){r.style.height='';});
  function h(k){root.style.setProperty('--k',k);return b.offsetHeight;}
  var lo=1,hi=1.3;
  if(h(1)<=px){ for(var i=0;i<14;i++){var m=(lo+hi)/2; if(h(m)<=px)lo=m; else hi=m;} root.style.setProperty('--k',lo); }
  else root.style.setProperty('--k',1);
  var H=b.offsetHeight;
  if(H<px && rows.length){
    var extra=(px-H)/rows.length;
    var hs=rows.map(function(r){return r.offsetHeight;});
    rows.forEach(function(r,i){r.style.height=(hs[i]+extra)+'px';});
  }
  b.style.width=prevW;
}
window.addEventListener('load',fit);
window.addEventListener('beforeprint',fit);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
fit();
})();</script>`;
