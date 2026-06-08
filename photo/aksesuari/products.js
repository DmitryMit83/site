// ═══════════════════════════════════════════════════════════════════
// AKSESUĀRU KATALOGS — produktu saraksts
// ───────────────────────────────────────────────────────────────────
// Lai pievienotu JAUNU PRODUKTU:
//   1. Nokopējiet vienu {…} bloku zemāk
//   2. Aizpildiet laukus (skatiet aprakstu augšā)
//   3. Saglabājiet failu — produkts parādīsies katalogā automātiski
//
// ── LAUKI ──────────────────────────────────────────────────────────
//
//  id       — unikāls skaitlis, katram produktam savs (piem. 101, 102…)
//
//  name     — produkta nosaukums (rādīts kartītē un uznirstošajā logā)
//
//  brand    — zīmols, tukšs '' ja nav zīmola
//             Filtrā pieejami: 'Roto' | 'Siegenia' | 'Maco' |
//                              'Winkhaus' | 'Soudal' | 'Deventer'
//
//  cat      — kategorija filtrēšanai (tikai mazajiem burtiem):
//             'rokturi' | 'enges' | 'blivgumijas' | 'sledzenes' |
//             'starplikas' | 'hermetiki' | 'drosiba' | 'apkope'
//
//  price    — cenas teksts, piem. 'no €8' vai 'no €3/m'
//
//  img      — ceļš uz FOTOATTĒLU (relatīvs no lv/ mapes):
//             '../photo/aksesuari/products/mans-produkts.jpg'
//             Ieteicamais izmērs: 600×450 px (proporcija 4:3)
//             Ja nav foto — dzēsiet img rindu un izmantojiet icon+bg
//
//  icon     — ikona, ja NAV foto. Izvēlieties atbilstošo:
//             'rokturis' | 'enge' | 'blivgumija' | 'sledzene' |
//             'starplikas' | 'hermetikis' | 'drosiba' | 'apkope'
//
//  bg       — fona krāsa HEX formātā (redzama ja nav img vai ielādē)
//             Ieteicamās krāsas pēc kategorijām:
//             rokturi:#3d6e9c  enges:#7b5e3a  blivgumijas:#2e6644
//             sledzenes:#3a4a6a  starplikas:#6a6a7a  hermetiki:#2e7e7e
//             drosiba:#8a3a3a  apkope:#5a4a8a
//
//  desc     — apraksts (rādīts uznirstošajā logā, 1–3 teikumi)
//
//  features — īpašību saraksts (masīvs, 3–6 rindas)
//
// ═══════════════════════════════════════════════════════════════════

window.SKAT_PRODUCTS = [

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  TESTA PRODUKTS — ar fotoattēlu                             ║
  // ║  Nomainiet img ceļu uz savu fotoattēlu un rediģējiet lauku  ║
  // ╚══════════════════════════════════════════════════════════════╝
  {
    id: 100,
    name: 'Roto rokturis (balts, 43 mm)',
    brand: 'Roto',
    cat: 'rokturi',
    price: 'no €19',
    img: '../photo/aksesuari/products/rokturis-roto-balts.jpg',
    bg: '#3d6e9c',
    icon: 'rokturis',
    desc: 'Klasiskais Roto rokturis PVC logiem baltā krāsā. Starpattālums 43 mm, piemērots lielākajai daļai Eiropas PVC logu. Metāla bāze ar plastmasas vāciņu.',
    features: [
      'Starpattālums: 43 mm',
      'Krāsa: balts (RAL 9016)',
      'Materiāls: cinkts sakausējums + plastmasa',
      'Piemērots PVC un ALU logiem',
      'Uzstādīšana 10 minūtēs — tikai 2 skrūves'
    ]
  },

  // ── Pievienojiet jaunus produktus šeit ─────────────────────────
  // Piemērs AR fotoattēlu:
  // {
  //   id: 101,
  //   name: 'Mans produkts',
  //   brand: 'Roto',
  //   cat: 'rokturi',
  //   price: 'no €25',
  //   img: '../photo/aksesuari/products/mans-produkts.jpg',
  //   bg: '#3d6e9c',
  //   icon: 'rokturis',
  //   desc: 'Produkta apraksts šeit.',
  //   features: [
  //     'Īpašība 1',
  //     'Īpašība 2',
  //     'Īpašība 3'
  //   ]
  // },
  //
  // Piemērs BEZ fotoattēla (ar ikonu):
  // {
  //   id: 102,
  //   name: 'Mans otrs produkts',
  //   brand: '',
  //   cat: 'enges',
  //   price: 'no €14',
  //   bg: '#7b5e3a',
  //   icon: 'enge',
  //   desc: 'Produkta apraksts šeit.',
  //   features: [
  //     'Īpašība 1',
  //     'Īpašība 2'
  //   ]
  // },

  // ── Esošie kataloga produkti ────────────────────────────────────

  // Rokturi
  {id:0,name:'Standarta PVC loga rokturis',brand:'',cat:'rokturi',price:'no €8',bg:'#3d6e9c',icon:'rokturis',desc:'Universāls rokturis piemērots lielākajai daļai PVC logu. Piestiprināms ar diviem skrūvjiem ar 43 mm vai 32 mm starpattālumu.',features:['Piemērots PVC, koka un ALU logiem','Pieejams baltā, brūnā un grafīta krāsā','Starpattālums 43 mm vai 32 mm','Uzstādīšana 15–20 minūtēs']},
  {id:1,name:'Roto Swing rokturis ar bloķēšanu',brand:'Roto',cat:'rokturi',price:'no €22',bg:'#3d6e9c',icon:'rokturis',desc:'Augstas kvalitātes rokturis ar iebūvētu bloķēšanas mehānismu. Novērš nejaušu atvēršanu un nodrošina papildu drošību.',features:['Bloķēšanas mehānisms ar atslēgu','Sertificēts pret ielaušanos (RC2)','Dažādi krāsu varianti','Vācu ražojums — ilgizturība garantēta']},
  {id:2,name:'Siegenia rokturis ar eņģu slēdzeni',brand:'Siegenia',cat:'rokturi',price:'no €28',bg:'#3d6e9c',icon:'rokturis',desc:'Profesionāls rokturis ar integrētu slēdzeni, kas bloķē loga eņģes. Paaugstināta drošība dzīvokļiem un birojiem.',features:['Integrētā eņģu slēdzene','Piemērots PVC un ALU logiem','Izgatavots no cinktā sakausējuma','Garantija 10 gadi']},
  {id:3,name:'Bērnu drošības rokturis',brand:'',cat:'rokturi',price:'no €15',bg:'#3d6e9c',icon:'rokturis',desc:'Rokturis ar bērnu drošības mehānismu — bērns nevar atvērt logu bez papildu darbības no pieaugušā puses.',features:['Divpakāpju atvēršanas mehānisms','Piemērots visiem PVC logiem','Viegla uzstādīšana','Ieteicams ģimenēm ar maziem bērniem']},

  // Eņģes
  {id:4,name:'Standarta PVC loga eņģe',brand:'',cat:'enges',price:'no €12',bg:'#7b5e3a',icon:'enge',desc:'Universāla eņģe atveramo PVC logu un balkona durvju nostiprināšanai. Regulējama trīs virzienā.',features:['Cinkotais tērauds','Slodze līdz 80 kg','3D regulēšana','Piemērota lielākajai daļai PVC logu']},
  {id:5,name:'Roto NT eņģe (3D regulēšana)',brand:'Roto',cat:'enges',price:'no €28',bg:'#7b5e3a',icon:'enge',desc:'Premium klases regulējama eņģe ar uzlabotu 3D regulēšanas mehānismu. Nodrošina precīzu loga novietošanu un ilglaicīgu darbību.',features:['Slodze līdz 130 kg','Precīza 3D regulēšana','Korozijizturīgs pārklājums','Vācu ražojums']},
  {id:6,name:'Maco N-tec eņģe',brand:'Maco',cat:'enges',price:'no €36',bg:'#7b5e3a',icon:'enge',desc:'Premium klases eņģe ar inovatīvu N-tec virsmas apstrādi, kas nodrošina maksimālu izturību pret koroziju — arī jūras klimatā.',features:['N-tec korozijaizsardzība','Slodze līdz 130 kg','Piemērota sāļa gaisa vidēm','Regulēšana bez instrumentiem']},
  {id:7,name:'Tērauda durvju eņģe (3D)',brand:'',cat:'enges',price:'no €22',bg:'#7b5e3a',icon:'enge',desc:'Izturīga tērauda eņģe balkona un ārējo durvju nomaiņai. Slodze līdz 160 kg, piemērota smagām durvīm.',features:['Nerūsējošais tērauds','Slodze līdz 160 kg','3D regulēšana','Piemērota ALU un PVC durvīm']},

  // Blīvgumijas
  {id:8,name:'EPDM blīvgumija logiem',brand:'',cat:'blivgumijas',price:'no €3/m',bg:'#2e6644',icon:'blivgumija',desc:'EPDM gumijas blīvgumija siltuma un trokšņu izolācijai. Piemērota visiem PVC un ALU logu profiliem.',features:['Darba temp. −45°C līdz +120°C','Dažādas šķērsgriezuma formas','Piemērota logiem un durvīm','Pasūtāma pēc vajadzīgā garuma']},
  {id:9,name:'Silikona blīvgumija',brand:'',cat:'blivgumijas',price:'no €4/m',bg:'#2e6644',icon:'blivgumija',desc:'Silikona blīvgumija ar augstu elastību. Ideāla stikla un rāmja savienojumu hermētizācijai.',features:['Augsta elastība','UV izturīga','Piemērota stikla piestiprināšanai','Vairākās krāsās']},
  {id:10,name:'Deventer TPE blīvgumija',brand:'Deventer',cat:'blivgumijas',price:'no €6/m',bg:'#2e6644',icon:'blivgumija',desc:'Premium klases TPE blīvgumija no vadošā Vācijas ražotāja. Nodrošina izcilu siltumizolāciju un ilglaicību.',features:['TPE — izturīgāks par EPDM','Piemērota pasīvās mājas logiem','Sertificēts enerģijas taupīšanas standarts','Garantija 15 gadi']},

  // Slēdzenes
  {id:11,name:'Standarta loga aizture',brand:'',cat:'sledzenes',price:'no €15',bg:'#3a4a6a',icon:'sledzene',desc:'Vienkārša un uzticama loga aizture, kas novērš nejaušu atvēršanu. Piemērota balkona logu un durvju aizsardzībai.',features:['Cinkotais tērauds','Viegla uzstādīšana','Piemērota PVC un ALU logiem','Pieejama baltā un brūnā krāsā']},
  {id:12,name:'Maco multi-punktu slēdzene',brand:'Maco',cat:'sledzenes',price:'no €48',bg:'#3a4a6a',icon:'sledzene',desc:'Augstās drošības multi-punktu slēdzene balkona durvīm. Aizslēdz vienlaicīgi vairākos punktos.',features:['3 vai 5 aizslēgšanas punkti','Sertificēts RC2 standarts','Piemērota PVC un ALU durvīm','Viegla apkope']},
  {id:13,name:'Roto anti-burglar aizture',brand:'Roto',cat:'sledzenes',price:'no €35',bg:'#3a4a6a',icon:'sledzene',desc:'Speciāla pretlaupīšanas aizture no Roto. Nostiprināma uz esošās furnitūras bez pilnīgas nomaiņas.',features:['Sertificēts RC2 aizsardzības standarts','Uzstādāma uz esošās Roto furnitūras','No ārduses neredzama','Atslēgu bloķēšana']},
  {id:14,name:'Winkhaus durvju slēdzene',brand:'Winkhaus',cat:'sledzenes',price:'no €42',bg:'#3a4a6a',icon:'sledzene',desc:'Uzticama daudzpunktu slēdzene no Vācijas ražotāja Winkhaus. Piemērota PVC un koka balkona durvīm.',features:['Daudzpunktu aizslēgšana','Cilindra maiņa bez instrumentiem','Piemērota esošajām PVC durvīm','Sertificēts drošības standarts']},

  // Starplikas
  {id:15,name:'Plastmasas starplikas (komplekts)',brand:'',cat:'starplikas',price:'no €2',bg:'#6a6a7a',icon:'starplikas',desc:'Plastmasas starplikas pareizai stikla paketes novietošanai rāmī. Novērš stikla vibrāciju un nodrošina pareizu ieliktni.',features:['100 gab. komplektā','Biezumi 1–6 mm','Piemērotas visiem stikla pakešu tipiem','UV izturīgs materiāls']},
  {id:16,name:'Gumijas tapas (komplekts)',brand:'',cat:'starplikas',price:'no €3',bg:'#6a6a7a',icon:'starplikas',desc:'Gumijas tapas trokšņu absorbcijai un stikla paketes fiksēšanai rāmī. Samazina rezonansi un vibrāciju.',features:['50 gab. komplektā','EPDM gumija','Dažādas starplikas formas','Piemērotas PVC un ALU profiliem']},

  // Hermētiķi
  {id:17,name:'Silikona hermētiķis (310 ml)',brand:'',cat:'hermetiki',price:'no €7',bg:'#2e7e7e',icon:'hermetikis',desc:'Universāls silikona hermētiķis logu un durvju uzstādīšanai un noblīvēšanai. Izturīgs pret UV un atmosfēras iedarbību.',features:['310 ml kartušs','Pieejams caurspīdīgs, balts un pelēks','Darba temp. −40°C līdz +150°C','Pilnīga adhēzija 24 h laikā']},
  {id:18,name:'Soudal Fix All (290 ml)',brand:'Soudal',cat:'hermetiki',price:'no €9',bg:'#2e7e7e',icon:'hermetikis',desc:'Profesionāls MS polimēra līmēšanas un blīvēšanas materiāls. Bez izocianāta, drošs darbam iekštelpās.',features:['Piemērots uz mitrām virsmām','Pārklājams un lakojas','Elastīgs pēc cietēšanas','Bez izocianāta — drošs iekštelpās']},
  {id:19,name:'Soudal montāžas putas (750 ml)',brand:'Soudal',cat:'hermetiki',price:'no €8',bg:'#2e7e7e',icon:'hermetikis',desc:'Profesionālas poliuretāna montāžas putas logu un durvju uzstādīšanai. Pastāvīga ekspansija un augsta siltumizolācija.',features:['750 ml — taupīgāka par 500 ml','Pastāvīga ekspansija (< 10%)','Piemērotas logu montāžas šuvēm','Darba temp. −10°C līdz +35°C']},
  {id:20,name:'Akrila hermētiķis (310 ml)',brand:'',cat:'hermetiki',price:'no €5',bg:'#2e7e7e',icon:'hermetikis',desc:'Akrila hermētiķis iekštelpu darbu noslēgšanai. Viegli noslaucāms ar ūdeni, labi pielīmējas un pārklājams ar krāsu.',features:['Pārklājams ar krāsu','Viegla uzklāšana','Piemērots iekštelpu šuvēm','Pieejams dažādās krāsās']},

  // Drošība
  {id:21,name:'Logu drošības ierobežotājs',brand:'',cat:'drosiba',price:'no €12',bg:'#8a3a3a',icon:'drosiba',desc:'Mehānisks logu ierobežotājs, kas aptur loga atvēršanos noteiktā pozīcijā. Ideāls bērniem un augsti stāvošiem logiem.',features:['Atvēršanas ierobežojums 10–15 cm','Viegla uzstādīšana un atcelšana','Izturīgs polimērs','Piemērots PVC un ALU logiem']},
  {id:22,name:'Logu drošības tapa (komplekts)',brand:'',cat:'drosiba',price:'no €8',bg:'#8a3a3a',icon:'drosiba',desc:'Papildu drošības tapas loga rāmim, kas novērš loga atvēršanos no ārduses. Uzstādāmas uz esošās furnitūras.',features:['2 gab. komplektā','Cinkotais tērauds','Uzstādīšana bez urbšanas','Piemērota PVC un koka logiem']},

  // Apkope
  {id:23,name:'Furnitūras eļļošanas aerosols (200 ml)',brand:'',cat:'apkope',price:'no €6',bg:'#5a4a8a',icon:'apkope',desc:'Speciāls eļļošanas aerosols logu un durvju furnitūras apkopei. Novērš rūsu, samazina berzi un pagarina kalpošanas laiku.',features:['200 ml aerosols','Eņģēm, rokturiem un slēdzenēm','Tievas caurulītes uzgalis','Ieteicams lietot 2× gadā']},
  {id:24,name:'Logu profila tīrīšanas līdzeklis (500 ml)',brand:'',cat:'apkope',price:'no €5',bg:'#5a4a8a',icon:'apkope',desc:'Speciāls tīrīšanas līdzeklis PVC logu profila atjaunošanai. Noņem dzeltenumu, netīrumus un UV bojājumus.',features:['500 ml pudelē','Iedarbīgs pret dzeltenumu','Nesaskrāpē virsmu','Piemērots visiem PVC profiliem']}

];
