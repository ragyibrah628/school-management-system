# Muhtasari wa Architecture: School Management System

Hati hii imetokana na kusoma source, configuration na `supabase-schema.sql` pekee. Hakuna ombi lililotumwa Supabase, hakuna build/preview iliyoendeshwa, na `.env`/backup za production hazikusomwa. Marejeo yanaonyesha faili na mstari wa ushahidi.

## 1. MUHTASARI

- Mfumo ni web app ya usimamizi wa shule yenye akaunti za watumiaji, wanafunzi, mitihani/alama, duty reports, matokeo/uchapishaji na timetable; ushahidi wa features hizi uko kwenye routes na state ya [src/App.tsx](src/App.tsx#L978) na data API ya [src/lib/cloud.ts](src/lib/cloud.ts#L203).
- Stack iliyothibitishwa: Vite 7, React 19, TypeScript 5.9, Tailwind Vite plugin 4, Supabase JS v2 na lucide-react; dependencies na scripts ziko [package.json](package.json#L1-L22), Vite plugins/alias ziko [vite.config.ts](vite.config.ts#L1-L16), na React entry ni [src/main.tsx](src/main.tsx#L1-L9).
- Netlify imewekwa kujenga kwa `npm run build` na kuchapisha `dist` ([netlify.toml](netlify.toml#L1-L4)). Electron wrapper ipo na hufungua `dist/index.html` ([electron-main.js](electron-main.js#L1-L31)); hata hivyo dependencies za Electron hazijaorodheshwa kwenye `package.json` ([package.json](package.json#L5-L22)), na installer batch hutegemea `npx electron-builder` ([Build_Windows_Installer.bat](Build_Windows_Installer.bat#L65-L88)). Kwa hiyo uwepo wa wrapper umethibitishwa, lakini package ya installer inayoweza kujengwa haikuthibitishwa.
- Muundo mkuu: `src/App.tsx` ina login, role screens, workflows nyingi na state; `src/lib/cloud.ts` inazungumza na Supabase; `src/context/TimetableContext.tsx`, `src/utils/scheduler.ts` na `src/components/TimetableViewer.tsx` zinashughulikia ratiba; `src/components/DutyReport.tsx` inashughulikia duty/registered counts; `src/types/index.ts` ina aina za timetable. Schema iko `supabase-schema.sql`, na Supabase CLI config iko `supabase/config.toml` ([src/App.tsx](src/App.tsx#L1-L8), [src/context/TimetableContext.tsx](src/context/TimetableContext.tsx#L1-L8)).

## 2. WATUMIAJI NA ROLES

- **Admin:** menu ya Dashboard, Subjects, Classes & Streams, Teacher Accounts, Teaching Assignments, Class Teachers, Registered Students, Exam Management, Results & Approval, Duty Reports, Timetable Schedule na School Settings; menu imefafanuliwa [src/App.tsx](src/App.tsx#L978-L990). Sehemu nyingi ni JSX iliyo ndani ya `App.tsx`; Registered Students hutumia `AdminRegisteredStudents`, na Timetable Schedule huonyesha `TimetableSubsystem` ([src/App.tsx](src/App.tsx#L1005-L1006), [src/App.tsx](src/App.tsx#L1357)).
- **Mwalimu:** ana My Timetable, Exams & Scores, Duty Report na My Account; menu imefafanuliwa [src/App.tsx](src/App.tsx#L995-L1002). Mwalimu aliyewekwa kama class teacher pekee ndiye huongezewa Register Students na Behavior Assessment ([src/App.tsx](src/App.tsx#L995-L999), [src/App.tsx](src/App.tsx#L2159-L2160), [src/App.tsx](src/App.tsx#L2205-L2206)).
- **Class teacher si role tofauti ya database:** ni mwalimu wa kawaida ambaye `sms_class_teachers` humhusisha na darasa; `myClass` hutokana na mapping hiyo na ndipo menu za wanafunzi/tabia zinafunguliwa ([src/App.tsx](src/App.tsx#L86-L92), [src/App.tsx](src/App.tsx#L788-L790)).
- **Parent:** ana Report Cards, Inbox na My Account ([src/App.tsx](src/App.tsx#L2395-L2399)); matokeo huchujwa kwa mwanafunzi aliyeunganishwa kwa `studentName` au kwa namba ya simu iliyo kwenye `username` ([src/App.tsx](src/App.tsx#L2380-L2390), [src/App.tsx](src/App.tsx#L2446-L2465)). Mfumo una screen ya parent, lakini sehemu niliyoisoma haionyeshi workflow ya admin ya kuunda akaunti za parent; namna akaunti hizo zinavyotengenezwa **Sijathibitisha**.
- **Menyu ya timetable:** admin menu `timetable` hufungua `TimetableSubsystem`, ambayo inarender `TimetableViewer` ([src/App.tsx](src/App.tsx#L1005-L1006), [src/components/TimetableSubsystem.tsx](src/components/TimetableSubsystem.tsx#L1-L18)). Viewer ina Class, Teacher, Room, Master, Batch Classes na Batch Teachers views ([src/components/TimetableViewer.tsx](src/components/TimetableViewer.tsx#L85-L86), [src/components/TimetableViewer.tsx](src/components/TimetableViewer.tsx#L390-L436)). `Sidebar`, `Dashboard`, `ClassManager`, `TeacherManager`, `SubjectManager`, `RoomManager` na timetable `Settings` zipo kama components tofauti, lakini hazijaunganishwa kwenye `TimetableSubsystem` iliyoonekana hapa ([src/components/TimetableSubsystem.tsx](src/components/TimetableSubsystem.tsx#L1-L18)); usability ya screens hizo kupitia route nyingine **Sijathibitisha**.
- **Login/session:** hii ni login ya custom, si Supabase Auth: inavuta `users`, inalinganisha username/password kwenye browser, kisha huhifadhi user na screen kwenye `localStorage` ([src/App.tsx](src/App.tsx#L648-L685)). Refresh hurejesha user kutoka `sms_current_user` bila uthibitishaji mpya ([src/App.tsx](src/App.tsx#L633-L646)); logout huondoa session keys hizo ([src/App.tsx](src/App.tsx#L721-L730)). Admin fallback/default credentials pia zipo ndani ya frontend; thamani zake hazijaandikwa hapa ([src/App.tsx](src/App.tsx#L690-L714), [supabase-schema.sql](supabase-schema.sql#L74-L76)).

## 3. DATA

### Tables za Supabase

| Table | Columns zilizo kwenye schema |
|---|---|
| `users` | `id TEXT PK`, `name`, `username UNIQUE`, `password`, `role`, `subjects TEXT[]`, `created_at TIMESTAMPTZ` ([supabase-schema.sql](supabase-schema.sql#L6-L14)) |
| `scores` | `id TEXT PK`, `teacher_name`, `teacher_id`, `student_name`, `class_name`, `subject`, `term`, `score NUMERIC`, `max_score NUMERIC`, `exam_name`, `exam_id`, `created_at` ([supabase-schema.sql](supabase-schema.sql#L16-L31)) |
| `duty_reports` | `id`, `teacher_name`, `date`, `present_count`, `absent_count`, `events_summary`, `day_end_summary`, `created_at` ([supabase-schema.sql](supabase-schema.sql#L33-L42)) |
| `release_state` | `id UUID PK`, `term UNIQUE`, `approved`, `approved_by`, `approved_at`, `created_at` ([supabase-schema.sql](supabase-schema.sql#L44-L51)) |
| `app_data` | `key TEXT PK`, `value TEXT`, `updated_at` ([supabase-schema.sql](supabase-schema.sql#L54-L59)) |

`users`, `scores`, `duty_reports` na `release_state` ni rows zenye fields zinazoulizwa/kuorodheshwa moja kwa moja; settings, timetable na data nyingine inayobadilika kwa muundo wa app huhifadhiwa kama JSON string ndani ya `app_data.value` kwa `key` ([src/lib/cloud.ts](src/lib/cloud.ts#L203-L210), [src/lib/cloud.ts](src/lib/cloud.ts#L296-L328), [src/lib/cloud.ts](src/lib/cloud.ts#L522-L535)). Hii ni tofauti ya storage inayotumika na code, si uthibitisho kwamba JSON blobs ndizo muundo bora zaidi.

### Keys zote za `app_data`

`SYNC_KEYS` pamoja na `ROLE_SYNC_KEYS` ndio orodha kamili inayotumika na sync ya sasa ([src/lib/cloud.ts](src/lib/cloud.ts#L522-L535)). Data na ownership iliyothibitishwa kwenye UI/code:

| Key | Data | Nani huandika / nani husoma |
|---|---|---|
| `sms_school_subjects` | Orodha ya majina ya masomo. | Admin huongeza/huondoa; admin, score entry na timetable husoma ([src/App.tsx](src/App.tsx#L517-L543), [src/App.tsx](src/App.tsx#L587-L590)). |
| `sms_school_classes` | Orodha ya majina ya madarasa/streams. | Admin huandika; timetable, duty report, registered students na score workflows husoma ([src/App.tsx](src/App.tsx#L781-L802), [src/components/DutyReport.tsx](src/components/DutyReport.tsx#L24-L34)). |
| `sms_students` | Map ya class -> wanafunzi wenye name, masomo na hiari ya simu. | Class teacher huongeza/kufuta na kubadili masomo; score entry, duty/report-card na parent lookup husoma ([src/App.tsx](src/App.tsx#L94-L110), [src/App.tsx](src/App.tsx#L2159-L2198)). |
| `sms_exams` | Orodha ya mitihani: id, name, term, deadline, extensions na createdAt. | Admin huunda/huongeza muda/kufuta; walimu na parent screens husoma ([src/App.tsx](src/App.tsx#L287-L342), [src/App.tsx](src/App.tsx#L1360-L1408)). |
| `sms_behavior` | Map ya jina la mwanafunzi -> ratings kwa categories za tabia. | Class teacher huandika; parent report card husoma ([src/App.tsx](src/App.tsx#L858-L885), [src/App.tsx](src/App.tsx#L2547-L2549)). |
| `sms_messages` | Orodha ya message objects, target phone numbers, subject, text na tarehe. | State ya app hui-save; `sendMessage` ingeunda ujumbe, parent inbox huisoma, lakini hakuna call ya `sendMessage` iliyopatikana na hakuna SMS gateway inayoonekana ([src/App.tsx](src/App.tsx#L182-L224), [src/App.tsx](src/App.tsx#L2639-L2656)). |
| `sms_registered_students` | Map ya class -> hesabu za `regB` na `regG`. | Admin UI huandika kupitia `saveRegisteredStudents`; duty report ya mwalimu husoma ([src/components/DutyReport.tsx](src/components/DutyReport.tsx#L156-L161), [src/components/DutyReport.tsx](src/components/DutyReport.tsx#L175-L223), [src/lib/cloud.ts](src/lib/cloud.ts#L684-L740)). |
| `sms_school_name_setting`, `sms_district_name`, `sms_school_address`, `sms_school_motto` | Branding/maelezo ya shule, string. | Admin Settings huandika; login, reports na timetable printing husoma ([src/App.tsx](src/App.tsx#L1080-L1098), [src/components/TimetableViewer.tsx](src/components/TimetableViewer.tsx#L26-L28)). |
| `sms_academic_name`, `sms_headmaster_name` | Majina ya viongozi wa shule. | Admin Settings huandika; report cards na duty reports husoma ([src/App.tsx](src/App.tsx#L1125-L1136), [src/App.tsx](src/App.tsx#L1654-L1658), [src/components/DutyReport.tsx](src/components/DutyReport.tsx#L13-L22)). |
| `sms_school_logo`, `sms_academic_sig`, `sms_headmaster_sig` | Picha/signature kama data URL/base64 string. | Admin upload huandika; print views na login husoma ([src/App.tsx](src/App.tsx#L72-L82), [src/App.tsx](src/App.tsx#L1125-L1136), [src/App.tsx](src/App.tsx#L1654-L1658)). |
| `tt_timetableData` | Ratiba ya `[classId][day][periodId]` na unscheduled lessons/stats. | Timetable context/generator/editor huandika; timetable viewer na My Timetable husoma ([src/context/TimetableContext.tsx](src/context/TimetableContext.tsx#L214-L216), [src/context/TimetableContext.tsx](src/context/TimetableContext.tsx#L260-L284), [src/App.tsx](src/App.tsx#L1980-L1995)). |
| `tt_teachers`, `tt_subjects`, `tt_rooms`, `tt_classes`, `tt_classSubjects`, `tt_timeSlots`, `tt_days` | Timetable entities, assignments, vipindi na siku; miundo imeainishwa kwenye types. | Timetable context huzisoma wakati wa kuanza na kuziandika inapobadilika; scheduler/viewer huzisoma ([src/context/TimetableContext.tsx](src/context/TimetableContext.tsx#L90-L218), [src/context/TimetableContext.tsx](src/context/TimetableContext.tsx#L253-L259), [src/types/index.ts](src/types/index.ts#L1-L74)). |
| `tt_shared_subjects`, `tt_shared_teachers`, `tt_shared_classes` | Snapshot za majina ya masomo, akaunti za walimu na madarasa kutoka School Management UI. | App admin huandika; timetable context husoma ili kuoanisha setup ([src/App.tsx](src/App.tsx#L587-L590), [src/context/TimetableContext.tsx](src/context/TimetableContext.tsx#L72-L164)). |
| `sms_class_teachers` | Map ya class -> teacher id. | Admin huassign; teacher UI hutafuta `myClass`, na duty/report workflows zinaweza kutumia ([src/App.tsx](src/App.tsx#L86-L92), [src/App.tsx](src/App.tsx#L788-L790), [src/App.tsx](src/App.tsx#L2549-L2552)). |
| `sms_teaching_assignments` | Map ya teacher id -> orodha `{cls, sub}`. | Admin huassign; score entry na manual timetable teacher lookup husoma ([src/App.tsx](src/App.tsx#L110-L113), [src/App.tsx](src/App.tsx#L1306-L1354), [src/App.tsx](src/App.tsx#L466-L488)). |

Keys hizi zina data ya kawaida ya app kwenye `app_data`; `users`, `scores`, `duty_reports` na `release_state` zina queries zao na columns maalum ([src/lib/cloud.ts](src/lib/cloud.ts#L203-L210), [src/lib/cloud.ts](src/lib/cloud.ts#L296-L328), [src/lib/cloud.ts](src/lib/cloud.ts#L409-L516)). `sms_registered_students` ni exception: ipo kwenye `app_data` lakini ina functions zake za GET/POST/PATCH ([src/lib/cloud.ts](src/lib/cloud.ts#L684-L740)).

**Local-only/cache keys muhimu:** `sms_users`, `sms_scores`, `sms_duties`, `sms_released` ni cache/fallback za tables; session ni `sms_current_user` na `sms_session_screen` ([src/lib/cloud.ts](src/lib/cloud.ts#L218-L237), [src/lib/cloud.ts](src/lib/cloud.ts#L301-L328), [src/App.tsx](src/App.tsx#L633-L646)). `sms_subject_codes`, `tt_conflicts`, `tt_schoolLogo`, `tt_schoolName` na `tt_shared_subjects_codes` hutumika local lakini hazimo kwenye `SYNC_KEYS`; kwa hiyo code hii haizisync kwenye `app_data` ([src/App.tsx](src/App.tsx#L521-L557), [src/context/TimetableContext.tsx](src/context/TimetableContext.tsx#L219-L249), [src/context/TimetableContext.tsx](src/context/TimetableContext.tsx#L253-L284), [src/lib/cloud.ts](src/lib/cloud.ts#L522-L535)).

## 4. SYNC NA CACHE

- `cloud.ts` huchagua Cloud mode tu ikiwa URL na anon key zipo na URL inaanza `https://`; hutumia `fetch` REST kwa tables na Supabase JS client kwa Realtime ([src/lib/cloud.ts](src/lib/cloud.ts#L1-L10), [src/lib/cloud.ts](src/lib/cloud.ts#L122-L171)). Hati hii haikuomba endpoint yoyote.
- GET cache ni **memory ya browser**, TTL ya sekunde 30; GET zinazofanana hutumia request moja inayoendelea, na POST/PATCH/DELETE hu-invalidate cache husika ([src/lib/cloud.ts](src/lib/cloud.ts#L12-L13), [src/lib/cloud.ts](src/lib/cloud.ts#L122-L180)). REST fetch imewekewa `cache: 'no-store'` na timeout ya sekunde 5 ([src/lib/cloud.ts](src/lib/cloud.ts#L145-L160)).
- `syncToCloud()` husoma kila `SYNC_KEYS` kutoka localStorage na kujaribu POST/upsert, kisha PATCH ikishindikana; role mappings zina sync function tofauti ambayo huruhusu cloud write kwa user aliyehifadhiwa mwenye role admin ([src/lib/cloud.ts](src/lib/cloud.ts#L629-L670)). `syncFromCloud()` hupitia metadata ya `updated_at`, huvuta `value` kwa keys zilizobadilika, hulinda local data isifutwe na cloud-empty/stale data, na hutuma `cloud-sync-complete` ikiwa kuna mabadiliko ([src/lib/cloud.ts](src/lib/cloud.ts#L541-L610), [src/lib/cloud.ts](src/lib/cloud.ts#L674-L679)).
- Login ikifaulu huanza sync ya background; baada ya login, app huvuta data kutoka cloud na ku-refresh users/scores/duties/release state ([src/App.tsx](src/App.tsx#L679-L690), [src/App.tsx](src/App.tsx#L606-L631), [src/App.tsx](src/App.tsx#L348-L405)). Kifaa kipya hakina local cache yake ya kifaa cha zamani; hupata users/tables kwa queries na `app_data` values zilizowahi kusync tu ([src/lib/cloud.ts](src/lib/cloud.ts#L211-L237), [src/lib/cloud.ts](src/lib/cloud.ts#L575-L610)). Keys zisizomo kwenye sync list hazitafika kwa kifaa kipya kupitia utaratibu huu.
- Polling iliyopo kwenye source: general `syncFromCloud` **sekunde 60**, users **sekunde 60**, duty registered/count data **sekunde 60**, scores za admin **sekunde 30**; `startVisiblePolling` husimama tab ikiwa hidden na huita `onResume` mara tab inapoonekana ([src/App.tsx](src/App.tsx#L406-L406), [src/App.tsx](src/App.tsx#L431-L433), [src/App.tsx](src/App.tsx#L906-L906), [src/components/DutyReport.tsx](src/components/DutyReport.tsx#L195-L195), [src/components/DutyReport.tsx](src/components/DutyReport.tsx#L311-L311), [src/lib/cloud.ts](src/lib/cloud.ts#L16-L43)). Duty UI ina maandishi yanayotaja 30s, lakini timer ya code ni 60s ([src/components/DutyReport.tsx](src/components/DutyReport.tsx#L455-L455), [src/components/DutyReport.tsx](src/components/DutyReport.tsx#L311-L311)). Hizi ndizo intervals nilizoziona; **Sijathibitisha** kama ni marekebisho ya mwisho ya Egress yanayotumika production.
- Realtime subscriptions zipo kwa `scores`, `users` na key maalum ya `app_data`; app hutumia subscriptions kwa exams, behavior, role mappings na timetable pia ([src/lib/cloud.ts](src/lib/cloud.ts#L52-L82), [src/App.tsx](src/App.tsx#L431-L434), [src/App.tsx](src/App.tsx#L881-L885), [src/App.tsx](src/App.tsx#L918-L920), [src/context/TimetableContext.tsx](src/context/TimetableContext.tsx#L295-L303)). Schema iliyosomwa huongeza `app_data` pekee kwenye `supabase_realtime`; haionyeshi kuongeza `scores` au `users` ([supabase-schema.sql](supabase-schema.sql#L60-L66)). Ikiwa Realtime ya tables nyingine inafanya kazi production **Sijathibitisha**.
- LocalStorage pia ina cache ya users/scores/duties/release, app settings, wanafunzi, mitihani, tabia, assignment maps na timetable state; baadhi ya keys zina `_ts`/`_cloud_updated_at` za kutatua migongano ([src/App.tsx](src/App.tsx#L90-L184), [src/lib/cloud.ts](src/lib/cloud.ts#L541-L571), [src/context/TimetableContext.tsx](src/context/TimetableContext.tsx#L214-L284)). Scores huhifadhiwa local kwanza, kisha hujaribu upsert cloud; kuna bulk retry ya local scores wakati wa login ([src/lib/cloud.ts](src/lib/cloud.ts#L331-L403)).

## 5. TIMETABLE

- `TimetableContext` huhifadhi teachers, subjects, rooms, classes, class-subject assignments, days/time slots na schedule; generation hutumia `generateSchoolTimetable`, kisha `validateSchedule` ([src/context/TimetableContext.tsx](src/context/TimetableContext.tsx#L253-L284), [src/context/TimetableContext.tsx](src/context/TimetableContext.tsx#L374-L401)). Scheduler ni heuristic: huandaa occupancy maps, hupanga masomo kwa priority, na kuchagua nafasi kwa teacher/class/room availability pamoja na load balancing ([src/utils/scheduler.ts](src/utils/scheduler.ts#L33-L68), [src/utils/scheduler.ts](src/utils/scheduler.ts#L120-L196), [src/utils/scheduler.ts](src/utils/scheduler.ts#L208-L311)).
- `ClassSubject.isDoublePeriod` humaanisha double inayopendelewa; scheduler hutafuta vipindi viwili mfululizo bila break/activity, na double ikishindikana hujaribu vipindi viwili single ([src/types/index.ts](src/types/index.ts#L48-L55), [src/utils/scheduler.ts](src/utils/scheduler.ts#L104-L110), [src/utils/scheduler.ts](src/utils/scheduler.ts#L315-L320), [src/utils/scheduler.ts](src/utils/scheduler.ts#L404-L417)). Data ya cells mbili huweka `isDouble` kwenye mwanzo na continuation pamoja na `isDoubleSpan` kwenye cell ya pili ([src/utils/scheduler.ts](src/utils/scheduler.ts#L365-L389)). Single period ni cell moja. `TimetableCell` type haijaainisha flags hizo, tofauti inayoonekana pia kwenye TypeScript errors ([src/types/index.ts](src/types/index.ts#L68-L75), [src/utils/scheduler.ts](src/utils/scheduler.ts#L294-L294)).
- Viewer ina Class/Teacher/Room/Master na batch print views; teacher view huchukua cell ikiwa teacherId au secondTeacherId inalingana, room view huchuja kwa room, na master/batch huchora ratiba nyingi ([src/components/TimetableViewer.tsx](src/components/TimetableViewer.tsx#L61-L61), [src/components/TimetableViewer.tsx](src/components/TimetableViewer.tsx#L266-L291), [src/components/TimetableViewer.tsx](src/components/TimetableViewer.tsx#L611-L615), [src/components/TimetableViewer.tsx](src/components/TimetableViewer.tsx#L712-L713)). Printing hutengeneza HTML ya dirisha jipya kisha kuita `print()` ([src/components/TimetableViewer.tsx](src/components/TimetableViewer.tsx#L139-L150), [src/components/TimetableViewer.tsx](src/components/TimetableViewer.tsx#L432-L436)).
- “Occupied” kwenye manual class editor ni teacher conflict: viewer hutafuta teacher wa subject iliyochaguliwa, kisha hutafuta teacher huyo kwenye class nyingine kwenye period hiyo (pamoja na continuation ya double); ikipatikana huonyesha jina la class ([src/components/TimetableViewer.tsx](src/components/TimetableViewer.tsx#L300-L330), [src/components/TimetableViewer.tsx](src/components/TimetableViewer.tsx#L535-L544)). Scheduler yenyewe huzuia class, teacher na room kutumia slot moja wakati wa auto-generation ([src/utils/scheduler.ts](src/utils/scheduler.ts#L215-L233), [src/utils/scheduler.ts](src/utils/scheduler.ts#L324-L345)).
- “My Timetable” ya mwalimu inasoma timetable kutoka localStorage na kuchuja cells kwa teacher id (au second teacher id); inaonyesha subject/class zake tu na ina print yake ([src/App.tsx](src/App.tsx#L1977-L2015), [src/App.tsx](src/App.tsx#L2060-L2120)). Admin timetable viewer inaweza kubadili class/teacher/room/master/batch, kuona health/conflicts na kuhariri schedule kwenye Class view; kwa hiyo haifanani na My Timetable ya mwalimu ([src/components/TimetableViewer.tsx](src/components/TimetableViewer.tsx#L390-L436), [src/components/TimetableViewer.tsx](src/components/TimetableViewer.tsx#L344-L370)).

## 6. MITIHANI NA SCORES

1. Admin huunda exam yenye id, name, term, deadline, extensions na createdAt; state huhifadhiwa `sms_exams` na kusync kupitia `app_data` ([src/App.tsx](src/App.tsx#L287-L320), [src/App.tsx](src/App.tsx#L1360-L1371), [src/lib/cloud.ts](src/lib/cloud.ts#L522-L535)).
2. Admin huweka teaching assignments; teacher UI huonyesha exam ikiwa deadline iko mbele na teacher ana angalau assignment moja ([src/App.tsx](src/App.tsx#L334-L348), [src/App.tsx](src/App.tsx#L1306-L1354), [src/App.tsx](src/App.tsx#L2234-L2267)).
3. Mwalimu huchagua class/subject aliyopewa, wanafunzi huja kutoka `sms_students`, kisha save hukagua assignment na deadline tena kabla ya kuandika scores ([src/App.tsx](src/App.tsx#L466-L480), [src/App.tsx](src/App.tsx#L2280-L2336)). Alama huandikwa `sms_scores` local kwanza kisha upsert kwenye table ya `scores`; fields zinajumuisha exam, teacher, class, subject, score na term ([src/lib/cloud.ts](src/lib/cloud.ts#L331-L383), [supabase-schema.sql](supabase-schema.sql#L16-L31)).
4. Admin Results & Approval huchuja scores kwa exam, huhesabu grades/points/division na hutoa print ya general results/report cards ([src/App.tsx](src/App.tsx#L1421-L1458), [src/App.tsx](src/App.tsx#L1485-L1538), [src/App.tsx](src/App.tsx#L1836-L1873)). Release inaruhusiwa ikiwa kuna masomo angalau 7 yaliyowasilishwa; matokeo yanarekodiwa kwa **term** kwenye `release_state`, si kwa exam id ([src/App.tsx](src/App.tsx#L1448-L1464), [src/App.tsx](src/App.tsx#L770-L775), [src/lib/cloud.ts](src/lib/cloud.ts#L494-L516), [supabase-schema.sql](supabase-schema.sql#L44-L51)). Parent screen huonyesha exams za term iliyoreleased kisha report card ya mwanafunzi ([src/App.tsx](src/App.tsx#L2446-L2465)).

**Deadline:** imehifadhiwa kama field ndani ya `sms_exams` (`app_data`), pamoja na extension ya kila teacher ([src/App.tsx](src/App.tsx#L287-L342), [src/lib/cloud.ts](src/lib/cloud.ts#L522-L535)). Inakaguliwa na frontend wakati wa kuonyesha exam na wakati mwalimu anasave ([src/App.tsx](src/App.tsx#L340-L343), [src/App.tsx](src/App.tsx#L466-L480)); schema ya `scores` haina deadline wala rule/trigger inayotekeleza deadline ([supabase-schema.sql](supabase-schema.sql#L16-L31)). Hivyo enforcement iliyoonekana ni frontend pekee; database enforcement haipo kwenye schema iliyosomwa.

## 7. FEATURES NYINGINE

- **Duty Report:** mwalimu huingiza sehemu za siku, attendance per class, maoni ya TOD/headmaster; data huandikwa kwenye `duty_reports`, na admin ana archive/filter na print ([src/components/DutyReport.tsx](src/components/DutyReport.tsx#L50-L102), [src/components/DutyReport.tsx](src/components/DutyReport.tsx#L360-L393), [src/lib/cloud.ts](src/lib/cloud.ts#L409-L475), [src/App.tsx](src/App.tsx#L1886-L1915)).
- **Behavior Assessment:** class teacher huchagua ratings za categories kumi kwa kila mwanafunzi wa darasa lake; data huhifadhiwa `sms_behavior` na kuonyeshwa kwenye parent report card ([src/App.tsx](src/App.tsx#L858-L885), [src/App.tsx](src/App.tsx#L2205-L2232), [src/App.tsx](src/App.tsx#L2547-L2550)).
- **Registered Students:** admin huweka idadi ya wavulana/wasichana kwa kila class; `AdminRegisteredStudents` husoma/kuandika `sms_registered_students`, na duty form huitumia kama registered baseline ([src/components/DutyReport.tsx](src/components/DutyReport.tsx#L175-L223), [src/components/DutyReport.tsx](src/components/DutyReport.tsx#L288-L320)). Hii ni hesabu, tofauti na orodha ya majina ya `sms_students` ([src/App.tsx](src/App.tsx#L94-L110)).
- **Messages/SMS:** code ina helper inayotengeneza ujumbe, kuchagua parent phones na kuhifadhi message kwenye `sms_messages`; parent inbox huonyesha messages zinazolingana na phone ([src/App.tsx](src/App.tsx#L182-L224), [src/App.tsx](src/App.tsx#L2639-L2656)). Hakuna SMS provider/network-send call inayoonekana, na helper haionekani kuitwa popote; kwa ushahidi huu ni inbox ya ndani iliyokusudiwa, si SMS halisi.
- **Teaching Assignments:** admin huunganisha teacher na class+subject; mappings huhifadhiwa `sms_teaching_assignments`, na ndizo hutumika kuchuja score entry ([src/App.tsx](src/App.tsx#L110-L113), [src/App.tsx](src/App.tsx#L1306-L1354), [src/lib/cloud.ts](src/lib/cloud.ts#L629-L646)).
- **Class Teachers:** admin huunganisha class na teacher id; mapping huamua kama teacher anaweza kuona menu ya registration/behavior ([src/App.tsx](src/App.tsx#L86-L92), [src/App.tsx](src/App.tsx#L1287-L1304), [src/App.tsx](src/App.tsx#L788-L790)).
- **School Settings/logo/signatures:** admin huweka school/district/address/motto, viongozi, logo na signatures kwenye localStorage; baadhi ya keys hizo ziko `SYNC_KEYS` kwa cross-device sync ([src/App.tsx](src/App.tsx#L47-L60), [src/App.tsx](src/App.tsx#L1077-L1137), [src/lib/cloud.ts](src/lib/cloud.ts#L526-L528)). Logo/signatures ni data URLs ndani ya browser/database blob, si Supabase Storage kwenye code niliyoona ([src/App.tsx](src/App.tsx#L72-L82), [src/App.tsx](src/App.tsx#L1125-L1136)).
- **Uchapishaji:** results, report cards, timetable na duty report huunda print document kwenye browser window mpya, wakijumuisha branding/signatures husika ([src/App.tsx](src/App.tsx#L1540-L1550), [src/App.tsx](src/App.tsx#L1651-L1664), [src/components/TimetableViewer.tsx](src/components/TimetableViewer.tsx#L139-L150), [src/components/DutyReport.tsx](src/components/DutyReport.tsx#L600-L635)).

## 8. USALAMA NA HATARI

- Schema ina `password TEXT NOT NULL`; login query huchagua password, compares wazi kwenye frontend, na session/user cache huhifadhi object ya user kwenye localStorage. Seed admin pia ina password ya wazi kwenye SQL; hakuna hashing inayoonekana ([supabase-schema.sql](supabase-schema.sql#L6-L14), [supabase-schema.sql](supabase-schema.sql#L74-L76), [src/lib/cloud.ts](src/lib/cloud.ts#L211-L218), [src/App.tsx](src/App.tsx#L674-L685)). Thamani za nywila hazijaandikwa kwenye hati hii.
- RLS imezimwa wazi kwenye tables zote tano kwenye schema iliyosomwa ([supabase-schema.sql](supabase-schema.sql#L68-L72)). Frontend hutumia anon key kama `apikey` na Bearer token ([src/lib/cloud.ts](src/lib/cloud.ts#L1-L10), [src/lib/cloud.ts](src/lib/cloud.ts#L135-L139)). Kwa hiyo hakuna row-level isolation inayotolewa na RLS; ikiwa Supabase role `anon` ina table grants kwenye production, inaweza kusoma/kuandika data kwa REST. Grants halisi za production hazikukaguliwa, kwa hiyo kiwango kamili cha anon exposure **Sijathibitisha**.
- Queries za app huleta passwords za users, scores na duty reports; bila RLS, records hizo hazijatenganishwa kwa teacher/class/parent kwenye database ([src/lib/cloud.ts](src/lib/cloud.ts#L211-L218), [src/lib/cloud.ts](src/lib/cloud.ts#L296-L310), [src/lib/cloud.ts](src/lib/cloud.ts#L409-L475)). Role/assignment/deadline checks ziko frontend; SQL haina constraints au policies za ownership kwenye schema hii ([src/App.tsx](src/App.tsx#L466-L480), [src/App.tsx](src/App.tsx#L340-L343), [supabase-schema.sql](supabase-schema.sql#L6-L59)).
- Parent report lookup hutumia majina ya wanafunzi, na score query yake haijumuishi `class_name` kwenye filter; majina yanayojirudia yanaweza kuchanganya matokeo ([src/App.tsx](src/App.tsx#L2380-L2390), [src/App.tsx](src/App.tsx#L2460-L2465)). Session iliyorejeshwa kutoka localStorage haifanyi login upya ([src/App.tsx](src/App.tsx#L633-L646)).
- Schema inaongeza `app_data` pekee kwenye Realtime publication, wakati client pia inasubscribe `scores` na `users`; live notifications za tables hizo zinaweza kutotumwa bila production publication config nyingine ([supabase-schema.sql](supabase-schema.sql#L60-L66), [src/lib/cloud.ts](src/lib/cloud.ts#L52-L82)).
- Logo/signatures zinaweza kufanya `app_data.value` kuwa kubwa; code inaonya kuhusu logo kubwa lakini haina upload path kwenda object storage ([src/App.tsx](src/App.tsx#L72-L82), [src/lib/cloud.ts](src/lib/cloud.ts#L522-L535)). Hii ni hatari ya size/quota/egress inayopaswa kupimwa, si kipimo nilichofanya.

## 9. DENI LA KIUFUNDI

- Typecheck iliyotekelezwa ilikuwa `npx --no-install tsc --noEmit` (hakuna build/output); iliripoti **makosa 47 katika faili 5**. Namba na makundi yaliyothibitishwa: unused imports/handlers kwenye [SubjectManager.tsx](src/components/SubjectManager.tsx#L4) na [SubjectManager.tsx](src/components/SubjectManager.tsx#L34), [TeacherManager.tsx](src/components/TeacherManager.tsx#L4) na [TeacherManager.tsx](src/components/TeacherManager.tsx#L7); unused `useTimetable` kwenye [TimetableSubsystem.tsx](src/components/TimetableSubsystem.tsx#L2); implicit-any nyingi, `isActivity` isiyopo kwenye type na `setRefreshKey` isiyofafanuliwa kwenye [TimetableViewer.tsx](src/components/TimetableViewer.tsx#L110-L112), [TimetableViewer.tsx](src/components/TimetableViewer.tsx#L826-L827), [TimetableViewer.tsx](src/components/TimetableViewer.tsx#L947-L955); `isDouble` haipo kwenye `TimetableCell` lakini scheduler huiandika ([src/types/index.ts](src/types/index.ts#L68-L75), [src/utils/scheduler.ts](src/utils/scheduler.ts#L294-L294), [src/utils/scheduler.ts](src/utils/scheduler.ts#L371-L384)). `App.tsx` na `cloud.ts` zina `@ts-nocheck`, hivyo errors zake zimefichwa na directive ([src/App.tsx](src/App.tsx#L1-L1), [src/lib/cloud.ts](src/lib/cloud.ts#L1-L1)).
- Kuna logic iliyorudiwa ya grade/points/division na maoni ya Kiswahili ndani ya admin na parent report cards; mabadiliko ya grading yakifanywa upande mmoja tu yatatoa report zisizolingana ([src/App.tsx](src/App.tsx#L1510-L1535), [src/App.tsx](src/App.tsx#L2468-L2545)).
- Timetable code ina utegemezi wa pamoja kati ya generator, validator, manual editor na display: `TimetableCell` inatumika kama contract, lakini UI huongeza flags zisizo kwenye type ([src/types/index.ts](src/types/index.ts#L68-L75), [src/utils/scheduler.ts](src/utils/scheduler.ts#L294-L389), [src/components/TimetableViewer.tsx](src/components/TimetableViewer.tsx#L920-L1030)). `removeLessonSlot` hufuta cell moja tu na kuongeza lesson moja unscheduled; double yenye cells mbili inaweza kuachwa na nusu baada ya kufuta cell moja ([src/context/TimetableContext.tsx](src/context/TimetableContext.tsx#L432-L465)).
- Components za managers/sidebar/dashboard/settings zipo lakini wiring inayoonekana ya subsystem ina viewer tu; kuunganisha au kubadili navigation kunaweza kubadilisha sehemu tofauti ya timetable bila kugusa School Management UI ([src/components/TimetableSubsystem.tsx](src/components/TimetableSubsystem.tsx#L1-L18), [src/components/Sidebar.tsx](src/components/Sidebar.tsx#L8-L20), [src/components/Dashboard.tsx](src/components/Dashboard.tsx#L10-L20)).
- Data ya timetable hutegemea IDs zilizoko `tt_*` na snapshots za `tt_shared_*`; kubadili majina/IDs za classes/teachers bila migration kunaweza kuacha class-subject assignments au ratiba zikiwa na references zilizopitwa na wakati ([src/context/TimetableContext.tsx](src/context/TimetableContext.tsx#L72-L164), [src/types/index.ts](src/types/index.ts#L48-L74)).

## 10. MCHORO WA MTIRIRIKO

### (a) UI <-> Supabase

```text
Admin / Teacher / Parent UI
          |
          v
      App state <------ cloud-sync-complete / Realtime / polling
          |                              ^
          v                              |
      localStorage ----------------------+
          | syncToCloud (POST/PATCH)     | syncFromCloud (GET metadata, then GET values)
          +------------------------------+
          |                              |
          v                              |
  cloud.ts REST fetch -------------------+
     | users / scores / duties / release_state
     | app_data (JSON string by key)
     v
  Supabase Data API
```

Ushahidi: cache/request layer na REST ziko [src/lib/cloud.ts](src/lib/cloud.ts#L122-L180); app-data push/pull ziko [src/lib/cloud.ts](src/lib/cloud.ts#L575-L679); Realtime/poll listeners ziko [src/lib/cloud.ts](src/lib/cloud.ts#L16-L82) na [src/App.tsx](src/App.tsx#L406-L434).

### (b) Score kutoka kwa mwalimu hadi admin

```text
Admin creates exam + deadline (sms_exams/app_data)
                 |
                 v
Teacher selects assigned class + subject + students
                 |
                 v
Frontend checks assignment/deadline
                 |
                 v
local sms_scores (optimistic) -> Supabase scores table
                                      |
                                      v
Admin Results & Approval reads scores by exam
                 |
                 v
Approve term -> release_state.approved = true
                 |
                 v
Parent sees released-term report card -> print/PDF
```

Ushahidi: exam/deadline check na save ziko [src/App.tsx](src/App.tsx#L305-L342), [src/App.tsx](src/App.tsx#L466-L503); score persistence iko [src/lib/cloud.ts](src/lib/cloud.ts#L331-L383); approval/release iko [src/App.tsx](src/App.tsx#L1448-L1464), [src/lib/cloud.ts](src/lib/cloud.ts#L494-L516); parent report iko [src/App.tsx](src/App.tsx#L2446-L2465).

## Mambo ambayo sijaweza kuthibitisha

- RLS, grants, actual tables/columns, publication membership na access ya project ya Supabase ya production; schema iliyosomwa ni faili ya repo tu ([supabase-schema.sql](supabase-schema.sql#L1-L79), [supabase/config.toml](supabase/config.toml#L1-L20)).
- Kama polling values zilizopo ni zile za mwisho baada ya marekebisho ya Egress, na kama deployment ina config nyingine ya Realtime ([src/App.tsx](src/App.tsx#L406-L433), [src/components/DutyReport.tsx](src/components/DutyReport.tsx#L195-L195), [supabase-schema.sql](supabase-schema.sql#L60-L66)).
- Jinsi akaunti za parent zinavyoundwa/kuhusishwa rasmi na wanafunzi; route ya parent ipo lakini workflow ya creation haikuonekana kwenye admin menus ([src/App.tsx](src/App.tsx#L978-L990), [src/App.tsx](src/App.tsx#L2395-L2425)).
- Kama menu/components za timetable ambazo hazijaunganishwa kwenye subsystem ni legacy au zinapaswa kufikiwa kupitia route nyingine ([src/components/TimetableSubsystem.tsx](src/components/TimetableSubsystem.tsx#L1-L18), [src/components/Sidebar.tsx](src/components/Sidebar.tsx#L8-L20)).
- Kama SMS halisi inatarajiwa: code iliyosomwa ina local messages/inbox tu na hakuna gateway call inayoonekana ([src/App.tsx](src/App.tsx#L190-L224), [src/App.tsx](src/App.tsx#L2639-L2656)).
- Sikukagua `.env`, `.env.example`, `.env.local.bak` wala `production_backup.sql`; kwa hiyo hakuna thamani ya key/password au data ya backup iliyoingizwa kwenye hati hii.

## Maswali ninayopaswa kumuuliza mmiliki wa system

- Je, users wanapaswa kuhamishwa kwenda Supabase Auth na password hashing, na ni RLS policies zipi zinazotakiwa kwa role/class/parent?
- Parent account inaundwaje na link ya mwanafunzi inapaswa kutumia student ID gani badala ya jina?
- “Messages/SMS” inamaanisha inbox ndani ya app au SMS ya simu; kama SMS ni lengo, ni provider gani iliyoidhinishwa?
- Je, admin anapaswa kuweza kusimamia rooms, time slots, teachers na class-subject assignments kupitia UI ya timetable iliyopo?
- Ni schema/Realtime publication gani ndiyo source of truth production, na ni polling intervals zipi zilizoidhinishwa baada ya Egress review?
- Je, release ya matokeo inapaswa kuwa kwa term nzima au kwa exam moja moja, na grade/division thresholds zipi ndizo rasmi?