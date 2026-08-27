#!/usr/bin/env python3
"""Zestawienie powierzchni SOLAYA dla wykonawcy — PL / EN / TH.

Dane pochodzą z dokumentacji architektonicznej „OASIS 2 surfaces".
Uruchomienie:  python3 presentations/assets/solaya/build-contractor-pdf.py
Następnie:     Chrome --headless --print-to-pdf  (patrz README na końcu pliku)
"""
import pathlib

# ── dane z dokumentacji ─────────────────────────────────────────────────────
ROOMS = {
    'A': [('Salon + kuchnia + jadalnia', 'Living Room + Kitchen + Dining Room',
           'ห้องนั่งเล่น + ครัว + ห้องอาหาร', 55.87),
          ('Sypialnia 1', 'Bedroom 1', 'ห้องนอน 1', 14.98),
          ('Łazienka 1', 'Bathroom 1', 'ห้องน้ำ 1', 4.32),
          ('Sypialnia 2', 'Bedroom 2', 'ห้องนอน 2', 16.35),
          ('Łazienka 2', 'Bathroom 2', 'ห้องน้ำ 2', 6.69),
          ('Sypialnia 3', 'Bedroom 3', 'ห้องนอน 3', 13.87),
          ('Łazienka 3', 'Bathroom 3', 'ห้องน้ำ 3', 10.73),
          ('Garderoba', 'Cloakroom', 'ห้องเก็บเสื้อผ้า', 4.89),
          ('Spiżarnia', 'Pantry', 'แพนทรี่', 3.33)],
    'B': [('Salon + kuchnia + jadalnia', 'Living Room + Kitchen + Dining Room',
           'ห้องนั่งเล่น + ครัว + ห้องอาหาร', 51.24),
          ('Sypialnia 1', 'Bedroom 1', 'ห้องนอน 1', 14.91),
          ('Łazienka 1', 'Bathroom 1', 'ห้องน้ำ 1', 4.28),
          ('Sypialnia 2', 'Bedroom 2', 'ห้องนอน 2', 16.40),
          ('Łazienka 2', 'Bathroom 2', 'ห้องน้ำ 2', 6.60),
          ('Spiżarnia', 'Pantry', 'แพนทรี่', 4.20)],
    'C': [('Salon + kuchnia + jadalnia', 'Living Room + Kitchen + Dining Room',
           'ห้องนั่งเล่น + ครัว + ห้องอาหาร', 51.24),
          ('Sypialnia 1', 'Bedroom 1', 'ห้องนอน 1', 14.91),
          ('Łazienka 1', 'Bathroom 1', 'ห้องน้ำ 1', 4.28),
          ('Sypialnia 2', 'Bedroom 2', 'ห้องนอน 2', 16.40),
          ('Łazienka 2', 'Bathroom 2', 'ห้องน้ำ 2', 6.60),
          ('Sypialnia 3', 'Bedroom 3', 'ห้องนอน 3', 14.50),
          ('Spiżarnia', 'Pantry', 'แพนทรี่', 4.20)],
}
PLOTS_OF = {'A': [1, 2, 3, 16, 17, 18, 19], 'B': [4, 5, 6, 7, 8, 9, 11, 12, 14, 15], 'C': [10, 13]}
INT = {'A': 131.03, 'B': 97.63, 'C': 112.13}
BEDS = {'A': 3, 'B': 2, 'C': 3}
BATHS = {'A': 3, 'B': 2, 'C': 2}
# działka: (basen, taras parteru, taras na dachu, powierzchnia działki)
UNITS = {
    1: (36.60, 114.15, 0, 343.16), 2: (37.60, 119.00, 0, 377.26), 3: (37.60, 173.38, 0, 497.72),
    4: (32.80, 110.98, 0, 316.11), 5: (36.20, 61.84, 0, 254.63), 6: (36.20, 60.00, 0, 253.47),
    7: (35.80, 72.41, 0, 242.66), 8: (35.80, 68.16, 0, 216.49), 9: (35.80, 67.14, 0, 214.60),
    10: (35.80, 103.59, 63.20, 304.43), 11: (35.80, 67.40, 46.60, 220.15),
    12: (35.80, 64.60, 46.60, 215.82), 13: (32.12, 78.00, 63.20, 284.90),
    14: (32.12, 59.76, 46.60, 211.50), 15: (32.12, 72.80, 46.60, 232.24),
    16: (32.80, 77.97, 46.60, 273.87), 17: (32.80, 70.33, 46.60, 271.93),
    18: (32.80, 72.10, 46.60, 278.31), 19: (32.80, 68.60, 46.60, 276.34),
}
TYPE_OF = {p: k for k, ps in PLOTS_OF.items() for p in ps}

# ── tłumaczenia ─────────────────────────────────────────────────────────────
L = {
 'pl': dict(idx=0, title='SOLAYA Residence — zestawienie powierzchni dla wykonawcy',
   sub='Plai Laem, Koh Samui · 19 willi · dokumentacja architektoniczna „OASIS 2 surfaces" · wszystkie wymiary w m²',
   kpi=['willi', 'typy układów', 'sypialni łącznie', 'łazienek łącznie', 'basenów', 'tarasów na dachu'],
   h_layouts='Układy pomieszczeń — trzy typy willi',
   types={'A': 'Typ A — 3 sypialnie (pełny)', 'B': 'Typ B — 2 sypialnie', 'C': 'Typ C — 3 sypialnie (kompaktowy)'},
   m_villas='willi', m_beds='sypialnie', m_baths='łazienki', m_int='pow. wewn.', m_plots='Działki',
   th=['Lp.', 'Pomieszczenie', 'Room', 'm²'], total_int='Razem powierzchnia wewnętrzna',
   note='<b>Uwaga dla wykonawcy:</b> powierzchnie wewnętrzne są identyczne w obrębie typu — różnice między działkami dotyczą wyłącznie wielkości basenu, tarasów i powierzchni działki (tabela na następnej stronie). Typ C to układ typu B z dodatkową sypialnią 3 (14,50 m²) — bez trzeciej łazienki i garderoby.',
   h_plots='Zestawienie per działka',
   sub_plots='Powierzchnia wewnętrzna wg typu · basen, tarasy i działka indywidualnie dla każdej willi',
   pth=['Dz.', 'Typ', 'Syp.', 'Łaz.', 'Pow. wewn.', 'Basen', 'Taras', 'Taras dach.', 'Razem', 'Działka'],
   total_row='RAZEM (19 willi)',
   legend='<b>Legenda typów:</b> <span class="tyA">A</span> — 3 sypialnie, 3 łazienki, garderoba (pow. wewn. 131,03 m²) · <span class="tyB">B</span> — 2 sypialnie, 2 łazienki (97,63 m²) · <span class="tyC">C</span> — 3 sypialnie, 2 łazienki (112,13 m²).<br><b>Razem</b> = powierzchnia wewnętrzna + basen + tarasy (z tarasem na dachu). <b>Taras</b> — taras parteru wraz ze schodami.',
   foot='Zestawienie sporządzone na podstawie zestawień pomieszczeń dla każdej działki („OASIS 2 surfaces"). Sumy zweryfikowane rachunkowo dla wszystkich 19 działek.'),
 'en': dict(idx=1, title='SOLAYA Residence — Area Schedule for the Contractor',
   sub='Plai Laem, Koh Samui · 19 villas · architectural documentation "OASIS 2 surfaces" · all dimensions in m²',
   kpi=['villas', 'layout types', 'bedrooms in total', 'bathrooms in total', 'pools', 'roof terraces'],
   h_layouts='Room layouts — three villa types',
   types={'A': 'Type A — 3 bedrooms (full)', 'B': 'Type B — 2 bedrooms', 'C': 'Type C — 3 bedrooms (compact)'},
   m_villas='villas', m_beds='bedrooms', m_baths='bathrooms', m_int='internal area', m_plots='Plots',
   th=['No.', 'Room', '', 'm²'], total_int='Total internal area',
   note='<b>Note for the contractor:</b> internal areas are identical within each type — differences between plots concern only the pool, terraces and plot area (table on the next page). Type C is the Type B layout with an added Bedroom 3 (14.50 m²) — without a third bathroom or cloakroom.',
   h_plots='Schedule per plot',
   sub_plots='Internal area by type · pool, terraces and plot area individual to each villa',
   pth=['Plot', 'Type', 'Bed', 'Bath', 'Internal', 'Pool', 'Terrace', 'Roof terr.', 'Total', 'Plot area'],
   total_row='TOTAL (19 villas)',
   legend='<b>Type legend:</b> <span class="tyA">A</span> — 3 bedrooms, 3 bathrooms, cloakroom (internal 131.03 m²) · <span class="tyB">B</span> — 2 bedrooms, 2 bathrooms (97.63 m²) · <span class="tyC">C</span> — 3 bedrooms, 2 bathrooms (112.13 m²).<br><b>Total</b> = internal area + pool + terraces (incl. roof terrace). <b>Terrace</b> — ground-floor terrace including stairs.',
   foot='Prepared from the per-plot room schedules ("OASIS 2 surfaces"). All sums verified arithmetically for all 19 plots.'),
 'th': dict(idx=2, title='SOLAYA Residence — สรุปพื้นที่สำหรับผู้รับเหมา',
   sub='ไปรเลม เกาะสมุย · 19 วิลล่า · เอกสารสถาปัตยกรรม "OASIS 2 surfaces" · หน่วยเป็นตารางเมตร',
   kpi=['วิลล่า', 'แบบบ้าน', 'ห้องนอนรวม', 'ห้องน้ำรวม', 'สระว่ายน้ำ', 'ระเบียงดาดฟ้า'],
   h_layouts='ผังห้อง — แบบบ้าน 3 ประเภท',
   types={'A': 'แบบ A — 3 ห้องนอน (เต็มรูปแบบ)', 'B': 'แบบ B — 2 ห้องนอน', 'C': 'แบบ C — 3 ห้องนอน (กะทัดรัด)'},
   m_villas='วิลล่า', m_beds='ห้องนอน', m_baths='ห้องน้ำ', m_int='พื้นที่ภายใน', m_plots='แปลงที่',
   th=['ลำดับ', 'ห้อง', 'Room', 'ตร.ม.'], total_int='รวมพื้นที่ภายใน',
   note='<b>หมายเหตุสำหรับผู้รับเหมา:</b> พื้นที่ภายในเท่ากันทุกหลังในแบบเดียวกัน — ความแตกต่างระหว่างแปลงอยู่ที่ขนาดสระว่ายน้ำ ระเบียง และพื้นที่ดิน (ดูตารางหน้าถัดไป) แบบ C คือผังแบบ B ที่เพิ่มห้องนอน 3 (14.50 ตร.ม.) โดยไม่มีห้องน้ำที่สามและห้องเก็บเสื้อผ้า',
   h_plots='สรุปตามแปลง',
   sub_plots='พื้นที่ภายในตามแบบบ้าน · สระว่ายน้ำ ระเบียง และที่ดิน แยกตามแต่ละหลัง',
   pth=['แปลง', 'แบบ', 'นอน', 'น้ำ', 'พื้นที่ภายใน', 'สระ', 'ระเบียง', 'ดาดฟ้า', 'รวม', 'ที่ดิน'],
   total_row='รวมทั้งหมด (19 วิลล่า)',
   legend='<b>คำอธิบายแบบบ้าน:</b> <span class="tyA">A</span> — 3 ห้องนอน 3 ห้องน้ำ ห้องเก็บเสื้อผ้า (ภายใน 131.03 ตร.ม.) · <span class="tyB">B</span> — 2 ห้องนอน 2 ห้องน้ำ (97.63 ตร.ม.) · <span class="tyC">C</span> — 3 ห้องนอน 2 ห้องน้ำ (112.13 ตร.ม.)<br><b>รวม</b> = พื้นที่ภายใน + สระว่ายน้ำ + ระเบียง (รวมระเบียงดาดฟ้า) · <b>ระเบียง</b> — ระเบียงชั้นล่างรวมบันได',
   foot='จัดทำจากรายการพื้นที่ห้องของแต่ละแปลง ("OASIS 2 surfaces") ตรวจสอบผลรวมทางคณิตศาสตร์ครบทั้ง 19 แปลงแล้ว'),
}

FONT = {'pl': '-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
        'en': '-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
        'th': '"Sarabun","Sukhumvit Set","Thonburi",-apple-system,sans-serif'}
SERIF = {'pl': 'Georgia,serif', 'en': 'Georgia,serif', 'th': '"Sarabun","Sukhumvit Set",Georgia,serif'}


def n2(v, lang):
    s = f"{v:.2f}"
    return s.replace('.', ',') if lang == 'pl' else s


def build(lang):
    t = L[lang]; i = t['idx']
    blocks = ''
    for k in ['A', 'B', 'C']:
        rows = ''
        for j, r in enumerate(ROOMS[k]):
            name = r[i] if i < 3 else r[0]
            second = f'<td class="en">{r[1]}</td>' if lang != 'en' else '<td class="en"></td>'
            rows += f'<tr><td class="i">{j+1}</td><td>{name}</td>{second}<td class="n">{n2(r[3], lang)}</td></tr>'
        blocks += f'''<div class="type"><div class="th"><h3>{t['types'][k]}</h3>
          <div class="meta"><span><b>{len(PLOTS_OF[k])}</b> {t['m_villas']}</span><span><b>{BEDS[k]}</b> {t['m_beds']}</span>
          <span><b>{BATHS[k]}</b> {t['m_baths']}</span><span>{t['m_int']} <b>{n2(INT[k], lang)} m²</b></span></div>
          <div class="plots">{t['m_plots']}: {', '.join(str(p) for p in PLOTS_OF[k])}</div></div>
          <table class="rooms"><thead><tr><th class="i">{t['th'][0]}</th><th>{t['th'][1]}</th><th class="en">{t['th'][2]}</th><th class="n">{t['th'][3]}</th></tr></thead>
          <tbody>{rows}<tr class="tot"><td></td><td colspan="2">{t['total_int']}</td><td class="n">{n2(INT[k], lang)}</td></tr></tbody></table></div>'''

    prows = ''; T = dict(int=0, pool=0, terr=0, roof=0, tot=0, plot=0)
    for n in range(1, 20):
        k = TYPE_OF[n]; pool, terr, roof, plot = UNITS[n]; inte = INT[k]; tot = inte + pool + terr + roof
        for key, v in [('int', inte), ('pool', pool), ('terr', terr), ('roof', roof), ('tot', tot), ('plot', plot)]:
            T[key] += v
        prows += (f'<tr><td class="i">{n}</td><td class="c ty{k}">{k}</td><td class="c">{BEDS[k]}</td><td class="c">{BATHS[k]}</td>'
                  f'<td class="n">{n2(inte, lang)}</td><td class="n">{n2(pool, lang)}</td><td class="n">{n2(terr, lang)}</td>'
                  f'<td class="n">{n2(roof, lang) if roof else "—"}</td><td class="n hi"><b>{n2(tot, lang)}</b></td>'
                  f'<td class="n">{n2(plot, lang)}</td></tr>')
    prows += (f'<tr class="sum"><td></td><td colspan="3">{t["total_row"]}</td>'
              f'<td class="n">{n2(T["int"], lang)}</td><td class="n">{n2(T["pool"], lang)}</td><td class="n">{n2(T["terr"], lang)}</td>'
              f'<td class="n">{n2(T["roof"], lang)}</td><td class="n">{n2(T["tot"], lang)}</td><td class="n">{n2(T["plot"], lang)}</td></tr>')

    kpi = ''.join(f'<div class="k"><b>{v}</b><span>{lbl}</span></div>'
                  for v, lbl in zip(['19', '3', '47', '45', '19', '10'], t['kpi']))

    return f'''<!doctype html><html lang="{lang}"><head><meta charset="utf-8"><title>{t['title']}</title><style>
@page{{size:A4 portrait;margin:11mm 10mm}}
*{{box-sizing:border-box}}
body{{margin:0;font-family:{FONT[lang]};color:#16161f;font-size:8.1pt;line-height:1.26;
 -webkit-print-color-adjust:exact;print-color-adjust:exact}}
h1{{font-family:{SERIF[lang]};font-size:15.5pt;margin:0 0 1mm;font-weight:600}}
h2{{font-family:{SERIF[lang]};font-size:11.5pt;margin:0 0 2mm;font-weight:600;border-bottom:.8pt solid #16161f;padding-bottom:1.2mm}}
h3{{font-family:{SERIF[lang]};font-size:10.2pt;margin:0;font-weight:600}}
.sub{{color:#55555f;font-size:8pt;margin:0 0 3mm}}
.kpi{{display:flex;gap:2.2mm;margin-bottom:3.2mm}}
.k{{flex:1;border:.5pt solid #cfcabb;border-radius:1.6mm;padding:1.4mm 2.2mm;background:#f7f5ef}}
.k b{{display:block;font-family:{SERIF[lang]};font-size:11pt;color:#1c1c28;white-space:nowrap}}
.k span{{font-size:6.9pt;color:#66666f}}
.type{{border:.6pt solid #cfcabb;border-radius:2mm;margin-bottom:2.4mm;overflow:hidden;break-inside:avoid}}
.th{{background:#f2efe6;padding:1.7mm 3mm;border-bottom:.6pt solid #cfcabb}}
.meta{{display:flex;gap:5mm;font-size:7.6pt;color:#55555f;margin-top:.8mm}}
.meta b{{color:#16161f}}
.plots{{font-size:7.2pt;color:#7a7a84;margin-top:.6mm}}
table{{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}}
th{{background:#16161f;color:#f2efe6;font-size:6.4pt;text-transform:uppercase;letter-spacing:.04em;
 padding:1.2mm;text-align:left;font-weight:600}}
th.n,td.n{{text-align:right}} th.c,td.c{{text-align:center}} th.i,td.i{{text-align:center;width:6mm}}
td{{padding:.85mm 1.2mm;border-bottom:.35pt solid #e4e0d5}}
.rooms th{{background:#3a3a46}}
td.en{{color:#82828c;font-size:7.4pt}}
tr.tot td{{font-weight:700;background:#f7f5ef;border-top:.6pt solid #b9b3a2}}
td.hi{{background:#faf5e6}} td.hi b{{color:#7a5400}}
tr.sum td{{font-weight:700;background:#16161f;color:#f2efe6;border:0}}
.tyA{{color:#7a5400;font-weight:700}} .tyB{{color:#1f5133;font-weight:700}} .tyC{{color:#2a4a7a;font-weight:700}}
.note{{font-size:7.2pt;color:#55555f;line-height:1.45;margin-top:2.2mm;border-left:2.5pt solid #b9932f;
 background:#faf7ee;padding:1.8mm 2.6mm;border-radius:0 1.4mm 1.4mm 0}}
footer{{margin-top:3mm;padding-top:2mm;border-top:.4pt solid #ddd8cc;font-size:6.9pt;color:#7a7a84}}
.pb{{page-break-before:always}}
</style></head><body>
<h1>{t['title']}</h1><p class="sub">{t['sub']}</p>
<div class="kpi">{kpi}</div>
<h2>{t['h_layouts']}</h2>
{blocks}
<div class="note">{t['note']}</div>
<div class="pb"></div>
<h2>{t['h_plots']}</h2><p class="sub">{t['sub_plots']}</p>
<table><thead><tr><th class="i">{t['pth'][0]}</th><th class="c">{t['pth'][1]}</th><th class="c">{t['pth'][2]}</th><th class="c">{t['pth'][3]}</th>
<th class="n">{t['pth'][4]}</th><th class="n">{t['pth'][5]}</th><th class="n">{t['pth'][6]}</th><th class="n">{t['pth'][7]}</th>
<th class="n">{t['pth'][8]}</th><th class="n">{t['pth'][9]}</th></tr></thead><tbody>{prows}</tbody></table>
<div class="note">{t['legend']}</div>
<footer>{t['foot']} &nbsp;·&nbsp; Harmony Life · SOLAYA Residence, Plai Laem, Koh Samui</footer>
</body></html>'''


if __name__ == '__main__':
    out = pathlib.Path('/tmp')
    for lang in ['pl', 'en', 'th']:
        f = out / f'wykonawca-{lang}.html'
        f.write_text(build(lang), encoding='utf-8')
        print('zapisano', f)
