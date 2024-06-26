// 맨 위로 이동 버튼
let moveToTop = function () {
  document.body.scrollIntoView({ behavior: "smooth" });
};

// 타이핑 효과
const $txt = document.querySelector(".txt-title");
const content = "안녕하세요 :)우재의 자기소개 홈페이지입니다.";
let contentIndex = 0;

let typing = function () {
  $txt.innerHTML += content[contentIndex];
  contentIndex++;
  if (content[contentIndex] === "\n") {
    $txt.innerHTML += "<br />";
    contentIndex++;
  }
  if (contentIndex > content.length) {
    $txt.textContent = "";
    contentIndex = 0;
  }
};

setInterval(typing, 200);

// 이미지 슬라이드
let imgIndex = 0;
let position = 0;
const IMG_WIDTH = 438;
const $btnPrev = document.querySelector(".btn-prev");
const $btnNext = document.querySelector(".btn-next");
const $slideImgs = document.querySelector(".slide-images");

let prev = function () {
  if (imgIndex > 0) {
    $btnNext.removeAttribute("disabled");
    position += IMG_WIDTH;
    $slideImgs.style.transform = `translateX(${position}px)`;
    imgIndex = imgIndex - 1;
  }
  if (imgIndex == 0) {
    $btnPrev.setAttribute("disabled", "true");
  }
};

let next = function () {
  if (imgIndex < 5) {
    $btnPrev.removeAttribute("disabled");
    position -= IMG_WIDTH;
    $slideImgs.style.transform = `translateX(${position}px)`;
    $slideImgs.style.transition = "transform .5s ease-out";
    imgIndex = imgIndex + 1;
  }
  if (imgIndex == 4) {
    $btnNext.setAttribute("disabled", "true");
  }
};

let init = function () {
  $btnPrev.setAttribute("disabled", "true");
  $btnPrev.addEventListener("click", prev);
  $btnNext.addEventListener("click", next);
};

init();

// 모달
const $modalBg = document.getElementsByClassName("modal-background");
const $btnOpen = document.getElementsByClassName("btn-open");
const $btnClose = document.getElementsByClassName("btn-close");

function modal(num) {
  $btnOpen[num].addEventListener("click", () => {
    $modalBg[num].style.display = "flex";
    document.body.style.overflow = "hidden";
  });
  $btnClose[num].addEventListener("click", () => {
    $modalBg[num].style.display = "none";
    document.body.style.overflow = "unset";
  });
}

for (let i = 0; i < $btnOpen.length; i++) {
  modal(i);
}

// 스크롤바
let scrollTop = 0;
let bar = document.getElementsByClassName("bar-ing")[0];

window.addEventListener(
  "scroll",
  () => {
    scrollTop = document.documentElement.scrollTop;
    let per = Math.ceil(
      (scrollTop / (document.body.scrollHeight - window.outerHeight)) * 100
    );
    bar.style.width = per + "%";
  },
  false
);



document.getElementById('guestbook-form').addEventListener('submit', async function(event) {
  event.preventDefault(); // 폼 제출 기본 동작 방지

  // 입력된 값 가져오기
  const author = document.getElementById('author').value;
  const content = document.getElementById('content').value;
  const time = new Date().toLocaleString();

  // 방명록 항목 서버에 전송
  const response = await fetch('http://54.167.60.34:8000/entries/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ author, content, time })
  });

  if (response.ok) {
      const entry = await response.json();
      addEntryToDOM(entry);
      document.getElementById('guestbook-form').reset();
  } else {
      alert('방명록 항목 추가 실패');
  }
});

async function fetchEntries() {
  const response = await fetch('http://54.167.60.34:8000/entries/');
  if (response.ok) {
      const entries = await response.json();
      entries.forEach(addEntryToDOM);
  } else {
      alert('방명록 항목 로드 실패');
  }
}

function addEntryToDOM(entry) {
  const entryIndex = document.getElementById('entries').childElementCount;

  const entryDiv = document.createElement('div');
  entryDiv.classList.add('entry');

  const entryAuthor = document.createElement('p');
  entryAuthor.textContent = `작성자: ${entry.author}`;

  const entryContent = document.createElement('p');
  entryContent.textContent = entry.content;

  const entryTime = document.createElement('p');
  entryTime.textContent = `작성시간: ${entry.time}`;
  entryTime.classList.add('entry-time');

  const deleteButton = document.createElement('button');
  deleteButton.textContent = '삭제';
  deleteButton.classList.add('delete-button');
  deleteButton.addEventListener('click', async function() {
      const response = await fetch(`http://54.167.60.34:8000/entries/${entryIndex}`, {
          method: 'DELETE'
      });

      if (response.ok) {
          entryDiv.remove();
      } else {
          alert('방명록 항목 삭제 실패');
      }
  });

  entryDiv.appendChild(entryAuthor);
  entryDiv.appendChild(entryContent);
  entryDiv.appendChild(entryTime);
  entryDiv.appendChild(deleteButton);

  document.getElementById('entries').appendChild(entryDiv);
}

window.onload = fetchEntries;
