// =========================
// 1) 여기만 계속 추가/수정
// 좌표는 % (0~100)
// =========================
const HOTSPOTS = [
  { id: "A1", x: 35.2, y: 42.1, img: "detail-01.jpg", title: "A1 - 문틀 상세" },
  { id: "B3", x: 62.0, y: 18.4, img: "detail-02.jpg", title: "B3 - 창호 단면" },
  { id: "C7", x: 78.5, y: 63.8, img: "detail-03.jpg", title: "C7 - 걸레받이 마감" },
];

const plan = document.getElementById("plan");
let openId = null;

function closeAll(){
  plan.querySelectorAll(".popup.open").forEach(p => p.classList.remove("open"));
  openId = null;
}

function buildHotspots(){
  const frag = document.createDocumentFragment();

  HOTSPOTS.forEach(h => {
    const wrap = document.createElement("div");
    wrap.className = "hotspot";
    wrap.style.left = `${h.x}%`;
    wrap.style.top  = `${h.y}%`;
    wrap.dataset.id = h.id;

    wrap.innerHTML = `
      <button class="hotspot__btn" aria-label="hotspot ${h.id}"></button>
      <div class="popup" role="dialog" aria-label="popup ${h.id}">
        <button class="popup__close" aria-label="close">✕</button>
        <img src="./assets/${h.img}" alt="${h.title}">
        <div class="popup__title">${h.title}</div>
      </div>
    `;

    frag.appendChild(wrap);
  });

  plan.appendChild(frag);
}

function applyFlip(popup){
  popup.classList.remove("flip");
  popup.style.transform = "translateY(-10px)";

  // 기본(오른쪽)으로 열어본 뒤 화면 밖이면 flip
  const rect = popup.getBoundingClientRect();
  if (rect.right > window.innerWidth - 8) {
    popup.classList.add("flip");
  }
}

// 이벤트 위임: 핫스팟이 많아도 성능 안정
plan.addEventListener("click", (e) => {
  const closeBtn = e.target.closest(".popup__close");
  if (closeBtn){
    closeAll();
    e.stopPropagation();
    return;
  }

  const hotspot = e.target.closest(".hotspot");
  if (hotspot){
    const id = hotspot.dataset.id;

    if (openId === id){
      closeAll(); // 토글 닫기
      return;
    }

    closeAll();
    const popup = hotspot.querySelector(".popup");
    popup.classList.add("open");
    openId = id;

    applyFlip(popup);
    e.stopPropagation();
    return;
  }

  // 바깥 클릭 = 닫기
  closeAll();
});

window.addEventListener("resize", () => {
  if(!openId) return;
  const hs = plan.querySelector(`.hotspot[data-id="${openId}"]`);
  if(!hs) return;
  applyFlip(hs.querySelector(".popup"));
});

buildHotspots();
