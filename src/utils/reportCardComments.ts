export function getAcademicReportCardComment(name: string, division: string, avg: number): string {
  const a = avg.toFixed(1);
  if (!division || division === '-') {
    if (avg >= 70) return `Hongera sana ${name}! Wastani wa ${a}% unaonyesha juhudi na uelewa mzuri. Endelea kujituma na kutumia uwezo wako vizuri.`;
    if (avg >= 45) return `Hongera ${name} kwa wastani wa ${a}%. Endelea na juhudi zako na zingatia masomo yanayohitaji kuboreshwa.`;
    if (avg >= 30) return `${name}, wastani wa ${a}% unaonyesha bado kuna nafasi ya kuboresha. Weka ratiba ya kusoma na omba msaada kwa walimu.`;
    return `${name}, wastani wa ${a}% ni changamoto, lakini unaweza kuboresha hatua kwa hatua. Usikate tamaa na tafuta msaada wa walimu.`;
  }
  if (division === 'I') {
    if (avg >= 80) return `Hongera sana ${name}! Umefanya vizuri sana kwa kupata Daraja la I kwa wastani wa ${a}%. Umeonyesha nidhamu, bidii na umakini mkubwa masomoni. Endelea na moyo huo huo na uwe mfano kwa wenzako.`;
    if (avg >= 70) return `Hongera ${name} kwa Daraja la I! Wastani wa ${a}% unaonyesha juhudi zako kubwa. Bado una nafasi ya kupanda zaidi — tilia mkazo kwenye masomo uliyopata alama za chini na utafanya vizuri zaidi mtihani ujao.`;
    if (avg >= 60) return `Vizuri sana ${name}! Daraja la I kwa wastani wa ${a}% ni mafanikio makubwa. Usibweteke, endelea kupanga muda vizuri, fanya mazoezi mengi na shauriana na walimu wako ili udumishe kiwango hiki.`;
    return `Hongera ${name} kwa kufikia Daraja la I hata kwa wastani wa ${a}%. Umeonyesha kuwa una uwezo mkubwa. Jitahidi kuongeza bidii hasa kwenye masomo dhaifu ili wastani wako uongezeke mtihani ujao.`;
  }
  if (division === 'II') {
    if (avg >= 65) return `Hongera sana ${name}! Daraja la II kwa wastani wa ${a}% ni juhudi nzuri sana. Uko karibu na Daraja la I — ongeza umakini kwenye masomo ya sayansi na hisabati na utafikia kilele.`;
    if (avg >= 55) return `Vizuri sana ${name}! Daraja la II kwa wastani wa ${a}% linaonyesha uwezo wako. Endelea kusoma kwa mpangilio, fanya mitihani ya mazoezi na usisite kuuliza msaada kwa walimu.`;
    if (avg >= 45) return `Hongera ${name} kwa Daraja la II! Wastani wa ${a}% ni wa kuridhisha. Kuna masomo umefanya vizuri na mengine bado — yaweke kipaumbele na utapanda hadi Daraja la I.`;
    return `Hongera ${name} kwa Daraja la II kwa wastani wa ${a}%. Umejitahidi, lakini bado una nafasi kubwa ya kuboresha. Punguza utoro, hudhuria vipindi vyote na jifunze kwa bidii zaidi.`;
  }
  if (division === 'III') {
    if (avg >= 55) return `Hongera ${name}! Daraja la III kwa wastani wa ${a}% — uko kwenye njia sahihi. Umeonyesha juhudi, na kwa kuongeza extra hours za kujisomea unaweza kupanda hadi Daraja la II.`;
    if (avg >= 45) return `Vizuri ${name}, Daraja la III kwa wastani wa ${a}% ni hatua nzuri. Tambua masomo uliyofeli na yafanyie kazi kwa karibu na mwalimu wa somo husika.`;
    if (avg >= 35) return `${name}, Daraja la III kwa wastani wa ${a}% linaonyesha juhudi za wastani. Usikate tamaa — weka ratiba ya kusoma kila siku, epuka kelele na zingatia darasani.`;
    return `${name}, umepata Daraja la III kwa wastani wa ${a}%. Bado unahitaji juhudi zaidi. Anza mapema kujiandaa kwa mtihani ujao na tumia maktaba ya shule.`;
  }
  if (division === 'IV') {
    if (avg >= 45) return `${name}, Daraja la IV kwa wastani wa ${a}% — umefaulu lakini kwa wastani wa chini. Una uwezo wa kupanda hadi Daraja la III kama utaongeza bidii na kushirikiana na walimu.`;
    if (avg >= 35) return `${name}, umepata Daraja la IV kwa wastani wa ${a}%. Hii ni ishara ya kuanza kujituma zaidi. Hudhuria masomo yote, fanya kazi za nyumbani kwa wakati na omba msaada.`;
    if (avg >= 25) return `${name}, Daraja la IV kwa wastani wa ${a}% linahitaji jitihada za ziada. Usikate tamaa — kila hatua unayopiga kuelekea mbele ni muhimu. Shauriana na wazazi na walimu.`;
    return `${name}, Daraja la IV kwa wastani wa ${a}% linaonyesha changamoto. Lakini una nafasi ya kubadilika — anza leo, soma kwa ratiba na uamini kuwa unaweza.`;
  }
  if (avg >= 30) return `Pole sana ${name}, umepata Daraja 0 kwa wastani wa ${a}%. Uko karibu kufaulu — ongeza juhudi maradufu, hudhuria darasani kila siku na fanya mazoezi ya masomo yote.`;
  if (avg >= 20) return `${name}, Daraja 0 kwa wastani wa ${a}% ni changamoto, lakini si mwisho. Tambua udhaifu wako, weka malengo madogo ya kila wiki na yafanyie kazi na mwalimu wako.`;
  if (avg >= 10) return `${name}, umepata Daraja 0 kwa wastani wa ${a}%. Hii ni wito wa kuamka — acha kukata tamaa, anza upya kwa nidhamu, soma kwa bidii na utaona mabadiliko.`;
  return `${name}, Daraja 0 kwa wastani wa ${a}% linahitaji msaada wa haraka. Shule iko tayari kukusaidia — njoo mapema, shiriki darasani na fanya juhudi za ziada. Unaweza kuinuka tena.`;
}

export function getHeadmasterReportCardComment(name: string, division: string, avg: number): string {
  const a = avg.toFixed(1);
  if (!division || division === '-') {
    if (avg >= 70) return `${name} amepata wastani mzuri wa ${a}%. Shule inajivunia juhudi zake na inamtia moyo aendelee kufanya vizuri.`;
    if (avg >= 45) return `${name} amepata wastani wa ${a}%. Shule inatambua juhudi zake na inamtia moyo aendelee kuboresha masomo yake.`;
    if (avg >= 30) return `${name}, wastani wa ${a}% unaonyesha kuwa anahitaji kujituma zaidi. Shule iko tayari kumpa msaada anaohitaji.`;
    return `${name}, wastani wa ${a}% ni changamoto, lakini shule inaamini anaweza kuboresha. Tuko tayari kumsaidia hatua kwa hatua.`;
  }
  if (division === 'I') {
    if (avg >= 80) return `${name} ni fahari ya shule! Daraja la I kwa wastani wa ${a}% linaonyesha nidhamu na juhudi zisizo na kifani. Shule inakutegemea kuwa kiongozi na mfano kwa wenzako.`;
    if (avg >= 70) return `Hongera sana ${name}! Shule inajivunia Daraja la I kwa wastani wa ${a}%. Endelea na moyo wa kujifunza na heshima kwa walimu — mafanikio makubwa yanakusubiri.`;
    if (avg >= 60) return `${name} hongera kwa Daraja la I! Wastani wa ${a}% unaonyesha kuwa juhudi zako zinalipa. Shule inakutia moyo uzidishe bidii ili uendelee kung'ara.`;
    return `Hongera ${name} kwa Daraja la I kwa wastani wa ${a}%. Shule inatambua juhudi zako na inakuhimiza usichoke — bado una nafasi ya kuwa bora zaidi.`;
  }
  if (division === 'II') {
    if (avg >= 65) return `${name}, Daraja la II kwa wastani wa ${a}% ni hatua kubwa. Shule inakupa hongera na inakuamini unaweza kufika Daraja la I mtihani ujao kwa juhudi kidogo zaidi.`;
    if (avg >= 55) return `Hongera ${name}! Daraja la II kwa wastani wa ${a}% linaonyesha kuwa unasonga mbele vizuri. Shule inakuhimiza uzingatie muda na nidhamu zaidi.`;
    if (avg >= 45) return `${name}, Daraja la II kwa wastani wa ${a}% — shule inaona juhudi zako. Endelea kushirikiana na wazazi na walimu ili uboreshe zaidi.`;
    return `${name}, Daraja la II kwa wastani wa ${a}% linaonyesha umejitahidi. Shule inakushauri kupunguza utovu wa nidhamu na kuongeza mahudhurio.`;
  }
  if (division === 'III') {
    if (avg >= 55) return `${name}, Daraja la III kwa wastani wa ${a}% — shule inakupa hongera. Umeonyesha maendeleo na tuna imani ukiongeza bidii utapanda daraja.`;
    if (avg >= 45) return `Hongera ${name} kwa Daraja la III! Wastani wa ${a}% unaonyesha juhudi za wastani. Shule inakuhimiza kutumia vizuri vipindi vya ziada na maktaba.`;
    if (avg >= 35) return `${name}, Daraja la III kwa wastani wa ${a}% — shule inakuhimiza kujituma zaidi. Epuka marafiki wanaokupotezea muda na zingatia malengo yako.`;
    return `${name}, Daraja la III kwa wastani wa ${a}% linahitaji mabadiliko ya mtindo wa kusoma. Shule iko tayari kukupa msaada — jitokeze.`;
  }
  if (division === 'IV') {
    if (avg >= 45) return `${name}, Daraja la IV kwa wastani wa ${a}% — shule inakutia moyo. Bado una nafasi ya kupanda — zingatia masomo dhaifu na shauriana na walimu.`;
    if (avg >= 35) return `Pole ${name} kwa Daraja la IV kwa wastani wa ${a}%. Shule inakushauri kuongeza nidhamu, mahudhurio na kufanya kazi kwa bidii zaidi.`;
    if (avg >= 25) return `${name}, Daraja la IV kwa wastani wa ${a}% — shule inakukumbusha kuwa kila siku ni nafasi mpya ya kujifunza. Usikate tamaa.`;
    return `${name}, Daraja la IV kwa wastani wa ${a}% linahitaji juhudi za dharura. Shule, wazazi na walimu tuko pamoja kukusaidia kuinuka.`;
  }
  if (avg >= 30) return `Pole sana ${name}, Daraja 0 kwa wastani wa ${a}%. Shule haijakata tamaa kwako — tunaamini ukibadilika na kujituma utafaulu mtihani ujao.`;
  if (avg >= 20) return `${name}, Daraja 0 kwa wastani wa ${a}% — shule inakuhimiza uanze upya leo. Njoo shule kila siku, sikiliza kwa makini na fanya mazoezi.`;
  if (avg >= 10) return `${name}, Daraja 0 kwa wastani wa ${a}% — shule inakupa pole na inakualika kwenye ushauri wa kitaaluma ili tukupangie mpango wa kuinuka.`;
  return `${name}, Daraja 0 kwa wastani wa ${a}% — shule bado inakuamini. Elimu ni safari, si kituo. Anza hatua ndogo leo na utafika mbali.`;
}
