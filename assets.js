// ==========================================
// 📝 ここにアップデート内容を自由に書いてね！
// ==========================================
export const updateNotes = [
  { version: "v1.1", date: "2026.11.19", text: "画像どおりのローマ字入力（zyu、ju、jyu、小文字のl/x、んのルールなど）に完全対応しました！" },
  { version: "v1.0", date: "2026.11.01", text: "タイピング惑星ゲームをリリースしました！惑星育成や図鑑機能を楽しんでね。" }
];

// 画像のローマ字表に完全対応した変換マップ
const KANA_MAP = {
  // 基本の50音
  "あ": ["a"], "い": ["i"], "う": ["u"], "え": ["e"], "お": ["o"],
  "か": ["ka", "ca"], "き": ["ki"], "く": ["ku", "cu"], "け": ["ke"], "こ": ["ko", "co"],
  "が": ["ga"], "ぎ": ["gi"], "ぐ": ["gu"], "げ": ["ge"], "ご": ["go"],
  "さ": ["sa"], "し": ["shi", "si", "ci"], "す": ["su"], "せ": ["se", "ce"], "そ": ["so"],
  "ざ": ["za"], "じ": ["ji", "zi"], "ず": ["zu"], "ぜ": ["ze"], "ぞ": ["zo"],
  "た": ["ta"], "ち": ["chi", "ti"], "つ": ["tsu", "tu"], "て": ["te"], "と": ["to"],
  "だ": ["da"], "ぢ": ["di"], "づ": ["du"], "で": ["de"], "ど": ["do"],
  "な": ["na"], "に": ["ni"], "ぬ": ["nu"], "ね": ["ne"], "の": ["no"],
  "は": ["ha"], "ひ": ["hi"], "ふ": ["fu", "hu"], "へ": ["he"], "ほ": ["ho"],
  "ば": ["ba"], "び": ["bi"], "ぶ": ["bu"], "べ": ["be"], "ぼ": ["bo"],
  "ぱ": ["pa"], "ぴ": ["pi"], "ぷ": ["pu"], "ぺ": ["pe"], "ぽ": ["po"],
  "ま": ["ma"], "み": ["mi"], "む": ["mu"], "め": ["me"], "も": ["mo"],
  "や": ["ya"], "ゆ": ["yu"], "よ": ["yo"],
  "ら": ["ra"], "り": ["ri"], "る": ["ru"], "れ": ["re"], "ろ": ["ro"],
  "わ": ["wa"], "を": ["wo"], "ー": ["-"],

  // 小文字単体
  "ぁ": ["la", "xa"], "ぃ": ["li", "xi"], "ぅ": ["lu", "xu"], "ぇ": ["le", "xe"], "ぉ": ["lo", "xo"],
  "ゃ": ["lya", "xya"], "ゅ": ["lyu", "xyu"], "ょ": ["lyo", "xyo"],
  "っ": ["ltu", "xtu"],

  // 拗音・特殊音（2文字セット）
  "うぁ": ["wha"], "うぃ": ["wi", "whi"], "うぇ": ["we", "whe"], "うぉ": ["who"],
  "きゃ": ["kya"], "きぃ": ["kyi"], "きゅ": ["kyu"], "きぇ": ["kye"], "きょ": ["kyo"],
  "ぎゃ": ["gya"], "ぎぃ": ["gyi"], "ぎゅ": ["gyu"], "ぎぇ": ["gye"], "ぎょ": ["gyo"],
  "しゃ": ["sha", "sya"], "しぃ": ["syi"], "しゅ": ["shu", "syu"], "しぇ": ["she", "sye"], "しょ": ["sho", "syo"],
  "じゃ": ["ja", "zya", "jya"], "じぃ": ["zyi", "jyi"], "じゅ": ["ju", "zyu", "jyu"], "じぇ": ["zye", "jye"], "じょ": ["jo", "zyo", "jyo"],
  "ちゃ": ["cha", "tya", "cya"], "ちぃ": ["tyi", "cyi"], "ちゅ": ["chu", "tyu", "cyu"], "ちぇ": ["che", "tye", "cye"], "ちょ": ["cho", "tyo", "cyo"],
  "てゃ": ["tha"], "てぃ": ["thi"], "てゅ": ["thu"], "てぇ": ["the"], "てょ": ["tho"],
  "でゃ": ["dha"], "でぃ": ["dhi"], "でゅ": ["dhu"], "でぇ": ["dhe"], "でょ": ["dho"],
  "にゃ": ["nya"], "にぃ": ["nyi"], "にゅ": ["nyu"], "にぇ": ["nye"], "にょ": ["nyo"],
  "ひゃ": ["hya"], "ひぃ": ["hyi"], "ひゅ": ["hyu"], "ひぇ": ["hye"], "ひょ": ["hyo"],
  "びゃ": ["bya"], "びぃ": ["byi"], "びゅ": ["byu"], "びぇ": ["bye"], "びょ": ["byo"],
  "ぴゃ": ["pya"], "ぴぃ": ["pyi"], "ぴゅ": ["pyu"], "ぴぇ": ["pye"], "ぴょ": ["pyo"],
  "ふぁ": ["fa"], "ふぃ": ["fi"], "ふぇ": ["fe"], "ふぉ": ["fo"],
  "ヴぁ": ["va"], "ヴぃ": ["vi"], "ヴ": ["vu"], "ヴぇ": ["ve"], "ヴぉ": ["vo"],
  "みゃ": ["mya"], "みぃ": ["myi"], "みゅ": ["myu"], "みぇ": ["mye"], "みょ": ["myo"],
  "りゃ": ["rya"], "りぃ": ["ryi"], "りゅ": ["ryu"], "りぇ": ["rye"], "りょ": ["ryo"]
};

// ひらがな（カタカナ混じりも自動変換）から全パターンのローマ字を生成する関数
export function generateRomasFromKana(kanaText) {
  // カタカナをひらがなに統一（「ヴ」はそのまま残す）
  const hira = kanaText.replace(/[\u30a1-\u30f3\u30f5-\u30f6]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );

  // 1文字（または2文字）ごとのローマ字候補リストを作る
  function getOptionsAt(index) {
    const ch1 = hira[index];
    const ch2 = hira.slice(index, index + 2);

    // 1. 「っ」の処理（次の文字の子音を重ねる ＋ ltu / xtu）
    if (ch1 === "っ") {
      const options = [];
      if (index + 1 < hira.length) {
        const nextList = getOptionsAt(index + 1);
        nextList.forEach(nextItem => {
          nextItem.romas.forEach(r => {
            const firstChar = r[0];
            // 母音とn以外なら子音を重ねられる（例: ka -> kka, chi -> cchi）
            if (/[a-z]/.test(firstChar) && !"aiueon".includes(firstChar)) {
              options.push(firstChar);
            }
          });
        });
      }
      options.push("ltu", "xtu");
      return [{ romas: Array.from(new Set(options)), step: 1 }];
    }

    // 2. 「ん」の処理
    if (ch1 === "ん") {
      let canSingleN = false;
      if (index + 1 < hira.length) {
        const nextList = getOptionsAt(index + 1);
        // 次の文字のローマ字がすべて「母音・y・n」以外で始まる場合のみ、単体の "n" が使える
        canSingleN = nextList.every(nextItem =>
          nextItem.romas.every(r => !"aiueoyn".includes(r[0]))
        );
      }
      const romas = canSingleN ? ["n", "nn", "xn"] : ["nn", "xn"];
      return [{ romas, step: 1 }];
    }

    // 3. 通常の文字（2文字の拗音と、1文字ずつ分解するパターンの両方を許容）
    const results = [];
    if (ch2.length === 2 && KANA_MAP[ch2]) {
      results.push({ romas: KANA_MAP[ch2], step: 2 });
    }
    if (KANA_MAP[ch1]) {
      results.push({ romas: KANA_MAP[ch1], step: 1 });
    }
    return results;
  }

  // 全パターンを組み合わせて配列にする
  function build(index) {
    if (index >= hira.length) return [""];
    const branches = getOptionsAt(index);
    const combined = [];

    for (const branch of branches) {
      const suffixes = build(index + branch.step);
      for (const r of branch.romas) {
        for (const s of suffixes) {
          combined.push(r + s);
        }
      }
    }
    return Array.from(new Set(combined));
  }

  return build(0);
}

// 元の言葉リスト（かなを書くだけで全ローマ字パターンが自動生成されます！）
const rawWordList = [
  { jp: "富士山", kana: "ふじさん" },
  { jp: "プログラミング", kana: "ぷろぐらみんぐ" },
  { jp: "寿司打", kana: "すしだ" },
  { jp: "お茶", kana: "おちゃ" },
  { jp: "ちいかわ", kana: "ちいかわ" },
  { jp: "運転手", kana: "うんてんしゅ" },
  { jp: "自動販売機", kana: "じどうはんばいき" },
  { jp: "お父さん", kana: "おとうさん" },
  { jp: "学校", kana: "がっこう" },
  { jp: "チョコレート", kana: "ちょこれーと" },
  { jp: "宇宙旅行", kana: "うちゅうりょこう" },
  { jp: "銀河系", kana: "ぎんがけい" },
  { jp: "ブラックホール", kana: "ぶらっくほーる" },
  { jp: "流星群", kana: "りゅうせいぐん" },
  { jp: "人工衛星", kana: "じんこうえいせい" },
  { jp: "星空", kana: "ほしぞら" },
  { jp: "太陽系", kana: "たいようけい" },
  { jp: "火星探査", kana: "かせいたんさ" },
  { jp: "ロケット発射", kana: "ろけっとはっしゃ" },
  { jp: "無重力", kana: "むじゅうりょく" },
  { jp: "黄色い星", kana: "きいろいほし" },
  { jp: "きつねうどん", kana: "きつねうどん" },
  { jp: "おかあさんといっしょ", kana: "おかあさんといっしょ" },
  { jp: "墾田永年私財法", kana: "こんでんえいねんしざいほう" },
  { jp: "汀に打ちあがらんとするところに", kana: "みぎわにうちあがらんとするところに" },
  { jp: "江戸幕府の滅亡", kana: "えどばくふのめつぼう" },
  { jp: "地球温暖化問題", kana: "ちきゅうおんだんかもんだい" },
  { jp: "深澤明日香", kana: "ふかざわあすか" },
  { jp: "チョコレートプラネット", kana: "ちょこれーとぷらねっと" },
  { jp: "部分分数分解", kana: "ぶぶんぶんすうぶんかい" },
  { jp: "ゴリラの耳に念仏", kana: "ごりらのみみにねんぶつ" },
  { jp: "明日から明日香さんが飛鳥時代をはじめる", kana: "あすからあすかさんがあすかじだいをはじめる" },
  { jp: "紙芝居", kana: "かみしばい" },
  { jp: "やりらふぃー", kana: "やりらふぃー" }
];

export const wordList = rawWordList.map(item => ({
  jp: item.jp,
  romas: generateRomasFromKana(item.kana)
}));

// Lv.1 〜 Lv.45 までの惑星データ
export const planets = [
  { level: 1, name: "Lv.1 小さな隕石", icon: "🪨", threshold: 0 },
  { level: 2, name: "Lv.2 宇宙のちり", icon: "✨", threshold: 40 },
  { level: 3, name: "Lv.3 集合体プロトプラネット", icon: "🥔", threshold: 90 },
  { level: 4, name: "Lv.4 荒涼とした月", icon: "🌕", threshold: 150 },
  { level: 5, name: "Lv.5 赤い砂漠の惑星", icon: "🟠", threshold: 220 },
  { level: 6, name: "Lv.6 水の芽生えし原初星", icon: "💧", threshold: 300 },
  { level: 7, name: "Lv.7 緑芽吹く生命の星", icon: "🌍", threshold: 390 },
  { level: 8, name: "Lv.8 青き海原の惑星", icon: "🌐", threshold: 490 },
  { level: 9, name: "Lv.9 幾重の環を持つ美しき星", icon: "🪐", threshold: 600 },
  { level: 10, name: "Lv.10 巨大ガス惑星", icon: "🌀", threshold: 720 },
  { level: 11, name: "Lv.11 プラズマ放電の星", icon: "⚡", threshold: 850 },
  { level: 12, name: "Lv.12 輝く黄金の星", icon: "⭐", threshold: 990 },
  { level: 13, name: "Lv.13 文明の光る星", icon: "🏙️", threshold: 1140 },
  { level: 14, name: "Lv.14 サイバーダイソン球", icon: "🌐🤖", threshold: 1300 },
  { level: 15, name: "Lv.15 時空を超える要塞星", icon: "🛸", threshold: 1475 },
  { level: 16, name: "Lv.16 恒星系の中核星", icon: "☀️", threshold: 1660 },
  { level: 17, name: "Lv.17 星雲をまとう幻影の星", icon: "🌌", threshold: 1860 },
  { level: 18, name: "Lv.18 銀河の中心ブラックホール星", icon: "🕳️✨", threshold: 2080 },
  { level: 19, name: "Lv.19 全宇宙の管理者星", icon: "👑🔮", threshold: 2320 },
  { level: 20, name: "Lv.20 宇宙の創世神（ビッグバン）", icon: "🌟💥🌠", threshold: 2580 },
  { level: 21, name: "Lv.21 新生星団のコア", icon: "💫", threshold: 2860 },
  { level: 22, name: "Lv.22 超高密度ホワイトドワーフ", icon: "⚪", threshold: 3160 },
  { level: 23, name: "Lv.23 パルサー星雲", icon: "⏱️✨", threshold: 3480 },
  { level: 24, name: "Lv.24 クエーサーの輝き", icon: "🔆", threshold: 3820 },
  { level: 25, name: "Lv.25 暗黒物質の星", icon: "🕳️🌑", threshold: 4180 },
  { level: 26, name: "Lv.26 マルチバースの交差点", icon: "🌀🌐", threshold: 4560 },
  { level: 27, name: "Lv.27 超次元ホログラム星", icon: "💠", threshold: 4960 },
  { level: 28, name: "Lv.28 悠久のエーテル星", icon: "⏳✨", threshold: 5380 },
  { level: 29, name: "Lv.29 無限回廊の天体", icon: "♾️🪐", threshold: 5820 },
  { level: 30, name: "Lv.30 究極神羅・アストラルコア", icon: "👑🌌💫", threshold: 6300 },
  { level: 31, name: "Lv.31 星間文明の要塞都市", icon: "🌐🏙️", threshold: 6800 },
  { level: 32, name: "Lv.32 反物質反応炉星", icon: "⚛️", threshold: 7320 },
  { level: 33, name: "Lv.33 超巨大ブラックホール", icon: "🕳️🌀", threshold: 7860 },
  { level: 34, name: "Lv.34 恒星間ハイパーゲート", icon: "🚪✨", threshold: 8420 },
  { level: 35, name: "Lv.35 ダークマター生命体星", icon: "👾🌌", threshold: 9000 },
  { level: 36, name: "Lv.36 次元回廊の守護天体", icon: "🗝️🌀", threshold: 9600 },
  { level: 37, name: "Lv.37 タイムトラベル・クロノス", icon: "⏳⚡", threshold: 10220 },
  { level: 38, name: "Lv.38 銀河団の統治宮殿", icon: "🏰🌟", threshold: 10860 },
  { level: 39, name: "Lv.39 星雲の歌姫アストライア", icon: "🎶✨", threshold: 11520 },
  { level: 40, name: "Lv.40 スーパー・ギャラクティック・コア", icon: "🌠💥", threshold: 12200 },
  { level: 41, name: "Lv.41 虚空を統べる次元超越星", icon: "🌌👁️", threshold: 12900 },
  { level: 42, name: "Lv.42 無限多元宇宙の心臓部", icon: "♾️💓", threshold: 13620 },
  { level: 43, name: "Lv.43 創世のプロト・ユニバース", icon: "🥚✨", threshold: 14360 },
  { level: 44, name: "Lv.44 涅槃のオメガ・ルミナリー", icon: "💫🧘", threshold: 15120 },
  { level: 45, name: "Lv.45 超越神・アブソリュート・ゼロ", icon: "👑🌌🪐💫", threshold: 15900 }
];