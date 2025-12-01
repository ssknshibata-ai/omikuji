// --- 画像のパス指定（ローカル or オンライン） ---
// 最初の画像は ./images/omikuji.png（HTML側の初期srcと一致させること）
// 結果は ./images/omikuji-0.png ～ ./images/omikuji-4.png
const basePath = "./images/"; // 必要に応じて "./" に変更
const initialImage = `${basePath}omikuji.png`;

const resultImages = [
  `${basePath}omikuji-0.png`,
  `${basePath}omikuji-1.png`,
  `${basePath}omikuji-2.png`,
  `${basePath}omikuji-3.png`,
  `${basePath}omikuji-4.png`
];

// プリロード（あるとスムーズ）
const preloaded = [];
preloaded.push(new Image().src = initialImage);
resultImages.forEach(src => preloaded.push(new Image().src = src));

// ランダム取得
function getRandomImage() {
  const idx = Math.floor(Math.random() * resultImages.length);
  return resultImages[idx];
}

function playOmikuji() {
  const imgTag = document.querySelector("#js-result");
  const header = document.querySelector(".omikuji-headline");
  const button = document.querySelector("#js-button");

  // すぐヘッダーは消す（画面はすっきりさせる）
  header.style.display = "none";

  // 少し遅延を入れて、最初の画像が即変わらないようにする（ここで初期のまま一瞬キープ）
  const startDelayMs = 200; // ボタン押してすぐ真っ先に画像を変えないための遅延
  const spinDurationMs = 3000; // トータルでランダム切替する時間
  const switchIntervalMs = 100; // 画像を切り替える間隔（短めでサイコロ感）

  const startTime = performance.now() + startDelayMs;
  let lastSwitch = 0;

  // スピンループ（requestAnimationFrameベース）
  function spin(now) {
    // now は timestamp（ms）
    const elapsed = now - startTime;

    if (elapsed >= 0 && elapsed < spinDurationMs) {
      // 切り替え間隔を守る
      if (now - lastSwitch >= switchIntervalMs) {
        imgTag.src = getRandomImage();
        lastSwitch = now;
      }
      requestAnimationFrame(spin);
    } else if (elapsed >= spinDurationMs) {
      // 終了時は最終画像を確定させてアニメーション、ボタンを消す
      imgTag.src = getRandomImage(); // 最終決定画像（ランダム）
      imgTag.style.animation = "shake 2.5s ease-in-out 1";
      button.style.display = "none";
    } else {
      // elapsed < 0 の間はまだ startDelay 中 → そのまま次フレームを待つ
      requestAnimationFrame(spin);
    }
  }

  requestAnimationFrame(spin);
}

// イベント登録（DOMContentLoaded を待たない前提で、scriptが末尾にある）
document.querySelector("#js-button").addEventListener("click", playOmikuji);
