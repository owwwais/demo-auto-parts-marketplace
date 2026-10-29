/* صامولة — بيانات العرض التجريبي (اصطناعية)
 *
 * كل ما في هذا الملف بيانات عرض وليست بيانات تشغيل:
 * - المركبات مأخوذة من قائمة الأكثر مبيعًا في السعودية 2025 (مرجع صحفي، ليس سجلًا رسميًا).
 * - أرقام القطع بصيغ OEM حقيقية الشكل، لكنها لم تُطابق مع كتالوج مرخص. لا تُستخدم للشراء.
 * - الموردون والمندوبون والعملاء أسماء مختلقة؛ أي تشابه مع نشاط قائم غير مقصود.
 * - الأسعار بالهللة (عدد صحيح) وفق INV-06، وتقديرية لسوق الرياض 2026.
 *
 * المصدر الحقيقي لاحقًا: كتالوج مرخص (TecDoc أو ما يعادله) + ملفات الموردين، بقرار D-08.
 */
(function () {
  const vehicles = [
    { id: 'camry-2021', make: 'تويوتا', model: 'كامري', year: 2021, gen: 'XV70', engine: '2.5L', engineCode: 'A25A-FKS', trim: 'GLE', wmi: 'JTN' },
    { id: 'hilux-2019', make: 'تويوتا', model: 'هايلكس', year: 2019, gen: 'AN120', engine: '2.7L', engineCode: '2TR-FE', trim: 'غمارتين', wmi: 'MR0' },
    { id: 'lc-2018', make: 'تويوتا', model: 'لاندكروزر', year: 2018, gen: 'J200', engine: '4.0L', engineCode: '1GR-FE', trim: 'GXR', wmi: 'JTM' },
    { id: 'yaris-2022', make: 'تويوتا', model: 'يارس سيدان', year: 2022, gen: 'XP150', engine: '1.5L', engineCode: '2NR-FE', trim: 'Y', wmi: 'MR2' },
    { id: 'corolla-2020', make: 'تويوتا', model: 'كورولا', year: 2020, gen: 'E210', engine: '1.6L', engineCode: null, trim: 'XLI', wmi: 'JTD' },
    { id: 'accent-2020', make: 'هيونداي', model: 'أكسنت', year: 2020, gen: 'HC', engine: '1.6L', engineCode: 'G4FG', trim: 'Smart', wmi: 'KMH' },
    { id: 'elantra-2022', make: 'هيونداي', model: 'إلنترا', year: 2022, gen: 'CN7', engine: '2.0L', engineCode: null, trim: 'Comfort', wmi: 'KMH' },
    { id: 'pegas-2023', make: 'كيا', model: 'بيجاس', year: 2023, gen: 'AB', engine: '1.4L', engineCode: 'G4LC', trim: 'LX', wmi: 'LJD' },
    { id: 'sunny-2021', make: 'نيسان', model: 'صني', year: 2021, gen: 'N18', engine: '1.6L', engineCode: 'HR16DE', trim: 'SV', wmi: 'MDH' },
    { id: 'patrol-2019', make: 'نيسان', model: 'باترول', year: 2019, gen: 'Y62', engine: '5.6L', engineCode: 'VK56VD', trim: 'LE', wmi: 'JN8' },
    { id: 'taurus-2022', make: 'فورد', model: 'توروس', year: 2022, gen: 'CD542', engine: '2.0L EcoBoost', engineCode: null, trim: 'Titanium', wmi: 'LVS' },
  ];

  const categories = [
    { id: 'filters', name: 'الفلاتر', thumb: 'oil-filter' },
    { id: 'brakes', name: 'الفرامل', thumb: 'brake-pads' },
    { id: 'ignition', name: 'الإشعال', thumb: 'spark-plug' },
    { id: 'fluids', name: 'الزيوت والسوائل', thumb: 'oil-can' },
    { id: 'electrical', name: 'الكهرباء والبطاريات', thumb: 'battery' },
    { id: 'suspension', name: 'التعليق', thumb: 'shock' },
    { id: 'cooling', name: 'التبريد والتكييف', thumb: 'compressor' },
    { id: 'engine', name: 'المحرك والسيور', thumb: 'belt' },
    { id: 'body', name: 'الهيكل والإضاءة', thumb: 'mirror' },
  ];

  // tier: oe = قطعة الوكيل الأصلية · oem = مصنّع المعدات الأصلي · am = بديل معتمد · eco = تجاري اقتصادي
  const brands = {
    'toyota': { name: 'تويوتا أصلي', tier: 'oe' },
    'mobis': { name: 'هيونداي موبيس أصلي', tier: 'oe' },
    'nissan': { name: 'نيسان أصلي', tier: 'oe' },
    'denso': { name: 'دينسو', tier: 'oem' },
    'aisin': { name: 'آيسن', tier: 'oem' },
    'kyb': { name: 'KYB', tier: 'oem' },
    'akebono': { name: 'أكيبونو', tier: 'oem' },
    'ngk': { name: 'NGK', tier: 'oem' },
    'bosch': { name: 'بوش', tier: 'am' },
    'mann': { name: 'مان فلتر', tier: 'am' },
    'sakura': { name: 'ساكورا', tier: 'am' },
    'mobil': { name: 'موبيل 1', tier: 'am' },
    'varta': { name: 'فارتا', tier: 'am' },
    'amaron': { name: 'أمارون', tier: 'am' },
    'philips': { name: 'فيليبس', tier: 'am' },
    'gates': { name: 'جيتس', tier: 'am' },
    'kavo': { name: 'كافو', tier: 'eco' },
    'eco': { name: 'تجاري اقتصادي', tier: 'eco' },
  };
  const tiers = {
    oe: { name: 'أصلي (وكيل)', short: 'أصلي' },
    oem: { name: 'مصنّع أصلي (OEM)', short: 'OEM' },
    am: { name: 'بديل معتمد', short: 'بديل' },
    eco: { name: 'تجاري', short: 'تجاري' },
  };

  // fits: s = confirmed | likely ; src = مصدر الحكم
  const parts = [
    // ── كامري 2021 ─────────────────────────────
    { id: 'p01', cat: 'brakes', thumb: 'brake-pads', name: 'فحمات فرامل أمامية', oem: ['04465-33480'], spec: 'طقم 4 قطع · مع حساس صوت',
      fits: [{ v: 'camry-2021', s: 'confirmed', src: 'رقم OEM مطابق لطراز XV70' }] },
    { id: 'p02', cat: 'filters', thumb: 'filter-element', name: 'فلتر زيت (عنصر ورقي)', oem: ['04152-YZZA6'], spec: 'مع حلقة مطاطية',
      fits: [{ v: 'camry-2021', s: 'confirmed', src: 'رقم OEM مطابق لمحرك A25A-FKS' }, { v: 'yaris-2022', s: 'confirmed', src: 'رقم OEM مطابق لمحرك 2NR-FE' }, { v: 'corolla-2020', s: 'likely', src: 'المحرك غير محدد في ملف المركبة' }] },
    { id: 'p03', cat: 'filters', thumb: 'air-filter', name: 'فلتر هواء المحرك', oem: ['17801-F0020'], spec: 'لوحي · 296×196 مم',
      fits: [{ v: 'camry-2021', s: 'confirmed', src: 'رقم OEM مطابق لطراز XV70 2.5L' }] },
    { id: 'p04', cat: 'filters', thumb: 'cabin-filter', name: 'فلتر مكيف (المقصورة)', oem: ['87139-0E040'], spec: 'كربون نشط',
      fits: [{ v: 'camry-2021', s: 'confirmed', src: 'رقم OEM مطابق' }, { v: 'corolla-2020', s: 'likely', src: 'إحالة مورد دون مصدر مرجعي' }] },
    { id: 'p05', cat: 'ignition', thumb: 'spark-plug', name: 'بوجي إيريديوم', oem: ['90919-01289'], spec: 'الحبة · المحرك يحتاج 4',
      fits: [{ v: 'camry-2021', s: 'confirmed', src: 'رقم OEM مطابق لمحرك A25A-FKS' }] },
    { id: 'p06', cat: 'brakes', thumb: 'brake-disc', name: 'هوب فرامل أمامي', oem: ['43512-33190'], spec: 'الحبة · مهوّى 305 مم',
      fits: [{ v: 'camry-2021', s: 'confirmed', src: 'رقم OEM مطابق لطراز XV70' }] },
    { id: 'p07', cat: 'fluids', thumb: 'oil-can', name: 'زيت محرك 0W-20 تخليقي', oem: [], spec: 'جالون 4 لتر · API SP',
      fits: [{ v: 'camry-2021', s: 'confirmed', src: 'لزوجة دليل المالك للسوق الخليجي' }, { v: 'yaris-2022', s: 'confirmed', src: 'لزوجة دليل المالك' }, { v: 'corolla-2020', s: 'confirmed', src: 'لزوجة دليل المالك' }] },
    { id: 'p08', cat: 'electrical', thumb: 'battery', name: 'بطارية 70 أمبير LN3', oem: [], spec: 'مقاس DIN · تيار تشغيل 680A',
      fits: [{ v: 'camry-2021', s: 'confirmed', src: 'مقاس الحامل وقطبية الطراز' }, { v: 'accent-2020', s: 'likely', src: 'المقاس أكبر من الأصلي؛ راجع الحامل' }] },
    { id: 'p09', cat: 'cooling', thumb: 'compressor', name: 'كمبروسر مكيف', oem: ['88310-06470'], spec: 'مع كلتش كهربائي',
      fits: [{ v: 'camry-2021', s: 'confirmed', src: 'رقم OEM مطابق لطراز XV70 2.5L' }] },
    { id: 'p10', cat: 'body', thumb: 'mirror', name: 'مراية جانبية يمين', oem: ['87910-06T30'], spec: 'كهرباء · تدفئة · إشارة',
      fits: [{ v: 'camry-2021', s: 'likely', src: 'تختلف حسب الفئة؛ الإشارة الجانبية غير مؤكدة لفئة GLE' }] },
    { id: 'p11', cat: 'fluids', thumb: 'coolant', name: 'سائل تبريد SLLC مخفف', oem: [], spec: '4 لتر · وردي',
      fits: [{ v: 'camry-2021', s: 'confirmed', src: 'مواصفة الوكيل' }, { v: 'hilux-2019', s: 'confirmed', src: 'مواصفة الوكيل' }, { v: 'lc-2018', s: 'confirmed', src: 'مواصفة الوكيل' }] },
    // ── هايلكس 2019 ولاندكروزر 2018 ────────────
    { id: 'p12', cat: 'filters', thumb: 'oil-filter', name: 'فلتر زيت (علبة)', oem: ['90915-YZZD2'], spec: 'معدني ملولب',
      fits: [{ v: 'hilux-2019', s: 'confirmed', src: 'رقم OEM مطابق لمحرك 2TR-FE' }, { v: 'lc-2018', s: 'confirmed', src: 'رقم OEM مطابق لمحرك 1GR-FE' }] },
    { id: 'p13', cat: 'filters', thumb: 'air-filter', name: 'فلتر هواء المحرك', oem: ['17801-0C010'], spec: 'لوحي',
      fits: [{ v: 'hilux-2019', s: 'confirmed', src: 'رقم OEM مطابق لمحرك 2TR-FE' }] },
    { id: 'p14', cat: 'ignition', thumb: 'spark-plug', name: 'بوجي إيريديوم', oem: ['90919-01253'], spec: 'الحبة',
      fits: [{ v: 'hilux-2019', s: 'confirmed', src: 'رقم OEM مطابق لمحرك 2TR-FE' }, { v: 'lc-2018', s: 'confirmed', src: 'رقم OEM مطابق لمحرك 1GR-FE' }] },
    { id: 'p15', cat: 'brakes', thumb: 'brake-pads', name: 'فحمات فرامل أمامية', oem: ['04465-0K380'], spec: 'طقم 4 قطع',
      fits: [{ v: 'hilux-2019', s: 'confirmed', src: 'رقم OEM مطابق لطراز AN120' }] },
    { id: 'p16', cat: 'suspension', thumb: 'shock', name: 'مساعد أمامي', oem: ['48510-09N80'], spec: 'غاز · الحبة',
      fits: [{ v: 'hilux-2019', s: 'confirmed', src: 'رقم OEM مطابق لطراز AN120 دفع رباعي' }] },
    { id: 'p17', cat: 'engine', thumb: 'belt', name: 'سير المكينة الرئيسي', oem: ['90916-02708'], spec: '7PK',
      fits: [{ v: 'hilux-2019', s: 'likely', src: 'يختلف بوجود المكيف الخلفي' }, { v: 'lc-2018', s: 'likely', src: 'إحالة مورد' }] },
    // ── هيونداي وكيا ونيسان ─────────────────────
    { id: 'p18', cat: 'filters', thumb: 'oil-filter', name: 'فلتر زيت', oem: ['26300-35505'], spec: 'معدني ملولب',
      fits: [{ v: 'accent-2020', s: 'confirmed', src: 'رقم OEM مطابق لمحرك G4FG' }, { v: 'elantra-2022', s: 'likely', src: 'المحرك غير محدد في ملف المركبة' }] },
    { id: 'p19', cat: 'ignition', thumb: 'spark-plug', name: 'بوجي', oem: ['18855-10060'], spec: 'الحبة',
      fits: [{ v: 'accent-2020', s: 'confirmed', src: 'رقم OEM مطابق لمحرك G4FG' }] },
    { id: 'p20', cat: 'brakes', thumb: 'brake-pads', name: 'فحمات فرامل أمامية', oem: ['58101-H8A00'], spec: 'طقم 4 قطع',
      fits: [{ v: 'accent-2020', s: 'confirmed', src: 'رقم OEM مطابق لطراز HC' }, { v: 'pegas-2023', s: 'likely', src: 'إحالة مورد دون مصدر مرجعي' }] },
    { id: 'p21', cat: 'filters', thumb: 'oil-filter', name: 'فلتر زيت', oem: ['26300-02503'], spec: 'معدني ملولب',
      fits: [{ v: 'pegas-2023', s: 'likely', src: 'إحالة مورد؛ لا يوجد مصدر مرجعي لمحرك G4LC' }] },
    { id: 'p22', cat: 'filters', thumb: 'oil-filter', name: 'فلتر زيت', oem: ['15208-65F0E'], spec: 'معدني ملولب',
      fits: [{ v: 'sunny-2021', s: 'confirmed', src: 'رقم OEM مطابق لمحرك HR16DE' }] },
    { id: 'p23', cat: 'filters', thumb: 'oil-filter', name: 'فلتر زيت', oem: ['15208-31U0B'], spec: 'معدني ملولب',
      fits: [{ v: 'patrol-2019', s: 'likely', src: 'إحالة مورد؛ يلزم مطابقة مع كتالوج نيسان' }] },
    { id: 'p24', cat: 'body', thumb: 'bulb', name: 'لمبة كشاف H11', oem: [], spec: 'الحبة · 55W',
      fits: [{ v: 'camry-2021', s: 'likely', src: 'الفئات ذات الكشاف الهالوجين فقط' }, { v: 'accent-2020', s: 'confirmed', src: 'مقاس القاعدة' }, { v: 'sunny-2021', s: 'confirmed', src: 'مقاس القاعدة' }] },
    { id: 'p25', cat: 'engine', thumb: 'pump', name: 'طرمبة ماء', oem: ['16100-29455'], spec: 'مع جلدة',
      fits: [{ v: 'hilux-2019', s: 'confirmed', src: 'رقم OEM مطابق لمحرك 2TR-FE' }] },
  ];

  // integration: كيف يحدّث المورد مخزونه (يؤثر في حداثة البيانات وقرار التحقق)
  const suppliers = [
    { id: 'S1', name: 'الأفق لقطع الغيار', branch: 'فرع السلي', district: 'السلي', integration: 'manual', integrationLabel: 'ملف Excel يدوي',
      status: 'approved', rating: 4.6, responseMedianSec: 112, acceptRate: 0.91, timeouts: 3, hours: '8:00 ص – 11:00 م', pos: { x: 352, y: 214 }, km: 24, cr: '1010654821', vat: '3104592871' },
    { id: 'S2', name: 'مركز البيان للقطع الأصلية', branch: 'فرع الصناعية القديمة', district: 'الصناعية القديمة', integration: 'pos', integrationLabel: 'ربط نقاط بيع',
      status: 'approved', rating: 4.8, responseMedianSec: 64, acceptRate: 0.97, timeouts: 0, hours: '7:30 ص – 10:30 م', pos: { x: 214, y: 206 }, km: 19, cr: '1010338140', vat: '3002176654' },
    { id: 'S3', name: 'قطع الشمال', branch: 'فرع النرجس', district: 'النرجس', integration: 'api', integrationLabel: 'واجهة API',
      status: 'approved', rating: 4.4, responseMedianSec: 88, acceptRate: 0.94, timeouts: 1, hours: '9:00 ص – 12:00 م', pos: { x: 268, y: 34 }, km: 6, cr: '1010917735', vat: '3109983412' },
    { id: 'S4', name: 'مستودع المسار', branch: 'فرع الصناعية الجديدة', district: 'الصناعية الجديدة', integration: 'manual', integrationLabel: 'ملف Excel يدوي',
      status: 'approved', rating: 4.1, responseMedianSec: 171, acceptRate: 0.83, timeouts: 5, hours: '8:00 ص – 10:00 م', pos: { x: 236, y: 276 }, km: 31, cr: '1010442906', vat: '3007741208' },
    { id: 'S5', name: 'الريم لقطع السيارات', branch: 'فرع حطين', district: 'حطين', integration: 'manual', integrationLabel: 'لم يُحدد',
      status: 'pending', rating: null, responseMedianSec: null, acceptRate: null, timeouts: 0, hours: '9:00 ص – 11:00 م', pos: { x: 120, y: 62 }, km: 9, cr: '1010998215', vat: '3110254467' },
  ];

  // [id, part, supplier, brand, السعر بالهللة, الكمية المعلنة, عمر آخر تحديث بالدقائق, الضمان بالأشهر]
  const offerRows = [
    ['o001', 'p01', 'S1', 'akebono', 23500, 2, 310, 6], ['o002', 'p01', 'S2', 'toyota', 38900, 6, 4, 12], ['o003', 'p01', 'S3', 'bosch', 19800, 9, 12, 6], ['o004', 'p01', 'S4', 'eco', 11500, 14, 1440, 0],
    ['o005', 'p02', 'S1', 'toyota', 2900, 40, 310, 0], ['o006', 'p02', 'S2', 'toyota', 3150, 85, 4, 0], ['o007', 'p02', 'S3', 'denso', 2400, 22, 12, 0], ['o008', 'p02', 'S4', 'sakura', 1700, 60, 1440, 0],
    ['o009', 'p03', 'S2', 'toyota', 7800, 12, 4, 0], ['o010', 'p03', 'S3', 'mann', 4900, 7, 12, 0], ['o011', 'p03', 'S1', 'denso', 5600, 1, 310, 0],
    ['o012', 'p04', 'S2', 'toyota', 6400, 18, 4, 0], ['o013', 'p04', 'S3', 'bosch', 4300, 11, 12, 0], ['o014', 'p04', 'S4', 'kavo', 2600, 30, 1440, 0],
    ['o015', 'p05', 'S2', 'toyota', 7200, 24, 4, 0], ['o016', 'p05', 'S3', 'denso', 5900, 16, 12, 0], ['o017', 'p05', 'S1', 'ngk', 4800, 8, 310, 0],
    ['o018', 'p06', 'S2', 'toyota', 41000, 4, 4, 12], ['o019', 'p06', 'S1', 'akebono', 29500, 2, 310, 6], ['o020', 'p06', 'S4', 'eco', 16500, 6, 1440, 0],
    ['o021', 'p07', 'S2', 'toyota', 15800, 30, 4, 0], ['o022', 'p07', 'S3', 'mobil', 18900, 24, 12, 0], ['o023', 'p07', 'S1', 'mobil', 17500, 12, 310, 0],
    ['o024', 'p08', 'S3', 'varta', 46500, 5, 12, 18], ['o025', 'p08', 'S1', 'amaron', 39900, 3, 310, 24], ['o026', 'p08', 'S4', 'eco', 31000, 8, 1440, 12],
    ['o027', 'p09', 'S2', 'denso', 248000, 1, 4, 12], ['o028', 'p09', 'S4', 'eco', 139000, 2, 1440, 3],
    ['o029', 'p10', 'S2', 'toyota', 89000, 1, 4, 12], ['o030', 'p10', 'S4', 'eco', 42000, 3, 1440, 0],
    ['o031', 'p11', 'S2', 'toyota', 9800, 40, 4, 0], ['o032', 'p11', 'S1', 'toyota', 9200, 20, 310, 0],
    ['o033', 'p12', 'S1', 'toyota', 3400, 55, 310, 0], ['o034', 'p12', 'S2', 'toyota', 3600, 120, 4, 0], ['o035', 'p12', 'S3', 'denso', 2700, 30, 12, 0], ['o036', 'p12', 'S4', 'sakura', 1900, 80, 1440, 0],
    ['o037', 'p13', 'S1', 'toyota', 6900, 10, 310, 0], ['o038', 'p13', 'S4', 'sakura', 3800, 25, 1440, 0],
    ['o039', 'p14', 'S2', 'toyota', 6600, 30, 4, 0], ['o040', 'p14', 'S1', 'denso', 5200, 16, 310, 0],
    ['o041', 'p15', 'S1', 'toyota', 34500, 3, 310, 12], ['o042', 'p15', 'S3', 'akebono', 24900, 5, 12, 6], ['o043', 'p15', 'S4', 'eco', 12900, 10, 1440, 0],
    ['o044', 'p16', 'S1', 'kyb', 39500, 4, 310, 12], ['o045', 'p16', 'S2', 'toyota', 61000, 2, 4, 12],
    ['o046', 'p17', 'S1', 'gates', 13900, 6, 310, 6], ['o047', 'p17', 'S2', 'toyota', 19500, 4, 4, 6],
    ['o048', 'p18', 'S2', 'mobis', 2800, 70, 4, 0], ['o049', 'p18', 'S4', 'sakura', 1600, 90, 1440, 0], ['o050', 'p18', 'S3', 'mann', 2200, 25, 12, 0],
    ['o051', 'p19', 'S2', 'mobis', 3900, 40, 4, 0], ['o052', 'p19', 'S3', 'ngk', 3100, 32, 12, 0],
    ['o053', 'p20', 'S2', 'mobis', 26500, 5, 4, 12], ['o054', 'p20', 'S4', 'kavo', 11900, 12, 1440, 0],
    ['o055', 'p21', 'S4', 'sakura', 1500, 40, 1440, 0], ['o056', 'p22', 'S2', 'nissan', 3300, 50, 4, 0], ['o057', 'p22', 'S3', 'mann', 2300, 18, 12, 0],
    ['o058', 'p23', 'S4', 'sakura', 2400, 20, 1440, 0], ['o059', 'p24', 'S3', 'philips', 4500, 40, 12, 6], ['o060', 'p24', 'S1', 'philips', 3900, 24, 310, 6],
    ['o061', 'p25', 'S1', 'aisin', 32500, 2, 310, 12], ['o062', 'p25', 'S2', 'toyota', 47000, 3, 4, 12],
  ];
  const offers = offerRows.map(([id, part, supplier, brand, price, qty, ageMin, warranty]) => ({ id, part, supplier, brand, price, qty, ageMin, warranty }));

  const customer = {
    name: 'عبدالله الشهري', initial: 'ع', phoneMasked: '05•• ••• 418',
    vehicles: [
      { vehicle: 'camry-2021', nick: 'كامري البيت', vinMasked: 'JTNB11HK•••••4821' },
      { vehicle: 'hilux-2019', nick: 'الهايلكس', vinMasked: 'MR0EX32G•••••9310' },
    ],
    addresses: [
      { id: 'a1', label: 'البيت', district: 'الياسمين', street: 'شارع الثمامة، مبنى 3187', nationalAddress: 'RYMA3187', zone: 'شمال الرياض', inZone: true, pos: { x: 230, y: 50 } },
      { id: 'a2', label: 'العمل', district: 'العليا', street: 'طريق الملك فهد، برج 14', nationalAddress: 'RROA7720', zone: 'وسط الرياض', inZone: true, pos: { x: 196, y: 150 } },
      { id: 'a3', label: 'استراحة', district: 'الدرعية', street: 'طريق العمارية', nationalAddress: 'RDRA0915', zone: 'خارج منطقة الخدمة', inZone: false, pos: { x: 52, y: 120 } },
    ],
  };

  const couriers = [
    { id: 'C1', name: 'خالد العنزي', initial: 'خ', vehicle: 'هيونداي أكسنت', plate: 'ر ب ط 4821', rating: 4.9 },
    { id: 'C2', name: 'ياسر القحطاني', initial: 'ي', vehicle: 'دراجة نارية', plate: 'ن ص ع 1190', rating: 4.7 },
    { id: 'C3', name: 'عمر الدوسري', initial: 'ع', vehicle: 'تويوتا يارس', plate: 'ك ه د 7302', rating: 4.8 },
  ];

  // سياسات التطوير: قيم محاكاة development_only، ليست SLA معتمدة (ROADMAP §3)
  const policies = [
    { id: 'D-03', name: 'مهلة رد المورد على طلب التحقق', value: '180 ثانية', status: 'PROPOSED', owner: 'العمليات', note: 'الهدف التجاري بين دقيقتين و5 دقائق لم يُحسم' },
    { id: 'D-04', name: 'مدة الحجز قبل الدفع (TTL)', value: '600 ثانية', status: 'PROPOSED', owner: 'المنتج', note: 'تُعاد قراءة الحالة من الخادم عند العودة للتطبيق' },
    { id: 'D-05', name: 'متى نطلب تأكيد المورد يدويًا', value: 'الكمية ≤ 3 أو آخر تحديث > 120 دقيقة', status: 'PROPOSED', owner: 'المنتج', note: 'محرك شروط بأسباب ظاهرة، لا عتبة خفية' },
    { id: 'D-06', name: 'السلة الجزئية', value: 'كل أو لا شيء + اقتباس جديد بموافقة', status: 'APPROVED', owner: 'المنتج', note: 'لا شراء جزئي تلقائي' },
    { id: 'D-11', name: 'منطقة الخدمة', value: 'شمال ووسط وشرق الرياض', status: 'PROPOSED', owner: 'العمليات', note: 'مناطق اصطناعية للعرض' },
    { id: 'D-12', name: 'عمولة المنصة', value: '8% من قيمة القطع', status: 'PROPOSED', owner: 'المالية', note: 'قيمة محاكاة؛ لا صرف حقيقي' },
  ];

  // مراجعة ربط الكتالوج: صفوف مستوردة من الموردين تنتظر قرارًا
  const mappingQueue = [
    { id: 'm1', supplier: 'S1', raw: 'فحمات قدام كامري 2018-2023 اكيبونو', sku: 'AFQ-BP-7731', proposed: 'p01', confidence: 0.92, reason: 'الرقم المرجعي في الوصف يطابق 04465-33480' },
    { id: 'm2', supplier: 'S4', raw: 'فلتر زيت تويوتا YZZA6 ساكورا', sku: 'MSR-0871', proposed: 'p02', confidence: 0.88, reason: 'رقم مختصر يطابق 04152-YZZA6' },
    { id: 'm3', supplier: 'S1', raw: 'بواجي هايلكس دينسو 4 حبات', sku: 'AFQ-SP-1204', proposed: 'p14', confidence: 0.61, reason: 'الاسم يطابق والكمية علبة لا حبة؛ يلزم تأكيد الوحدة' },
    { id: 'm4', supplier: 'S3', raw: 'فلتر مكيف اكسنت 2019', sku: 'QSH-CF-2290', proposed: null, confidence: 0.32, reason: 'لا توجد قطعة معيارية مطابقة؛ مقترح إنشاء قطعة جديدة' },
    { id: 'm5', supplier: 'S4', raw: 'مساعد امامي هايلكس 2WD', sku: 'MSR-SH-118', proposed: 'p16', confidence: 0.47, reason: 'القطعة المقترحة لدفع رباعي؛ الوصف يذكر 2WD، فهما قطعتان مختلفتان' },
  ];

  const importBatch = {
    id: 'IMP-0412', file: 'مخزون-الأفق-السلي-24-10.xlsx', uploadedMinAgo: 310, rows: 196,
    ok: 182, errors: 6, quarantined: 8,
    errorRows: [
      { row: 14, sku: 'AFQ-OF-0092', msg: 'السعر سالب (-29.00)' },
      { row: 37, sku: 'AFQ-BP-7731', msg: 'SKU مكرر في الملف نفسه (الصف 36)' },
      { row: 58, sku: 'AFQ-BT-3310', msg: 'عمود الكمية فارغ' },
      { row: 91, sku: '—', msg: 'رقم SKU مفقود' },
      { row: 133, sku: 'AFQ-AC-5521', msg: 'العملة USD غير مدعومة' },
      { row: 170, sku: 'AFQ-LT-0045', msg: 'الضمان 120 شهرًا خارج النطاق المسموح' },
    ],
  };

  window.DATA = { vehicles, categories, brands, tiers, parts, suppliers, offers, customer, couriers, policies, mappingQueue, importBatch,
    meta: { name: 'صامولة', city: 'الرياض', vat: 0.15, demoSupplier: 'S1', demoCourier: 'C1' } };
})();
