//top button js
$(window).scroll(function() {
    var height = $(window).scrollTop();
    if (height > 900) {//아이콘이 나타나길 원하는 높이를 설정하세요
        $('#top_bt_wrap').fadeIn();//나타날 아이콘 클래스 수정!
    } else {
        $('#top_bt_wrap').fadeOut();//나타날 아이콘 클래스 수정!
    }
});

$('a[href*="#"]:not([href="#"]):not(.tab_menu a)').click(function () {
  if (
    location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') &&
    location.hostname == this.hostname
  ) {
    var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
    if (target.length) {
      $('html, body').animate({
        scrollTop: target.offset().top
      }, 500);
      return false;
    }
  }
});


// main banner js(fade) //
document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".bn_img");
    let current = 0;
    const intervalTime = 5000; // 이미지 체류 시간 (ms)

    setInterval(() => {
        slides[current].classList.remove("active");
        current = (current + 1) % slides.length;
        slides[current].classList.add("active");
    }, intervalTime);
});


//s1 - circle graph js//
document.addEventListener("DOMContentLoaded", () => {
  const wrap = document.querySelector("#skills_wrap");
  const circles = wrap.querySelectorAll(".circle");

  // 1) 처음엔 무조건 비어있게 세팅(중요)
  circles.forEach(circle => {
    const progress = circle.querySelector(".progress");
    const r = 60;
    const circumference = 2 * Math.PI * r;
    progress.style.strokeDasharray = circumference;
    progress.style.strokeDashoffset = circumference; // 빈 상태
  });

  // 2) 애니메이션 함수 (소수도 처리)
  const animateCircle = (circle) => {
    const target = parseFloat(circle.getAttribute("data-percent"));
    const progress = circle.querySelector(".progress");
    const percentEl = circle.querySelector(".percent");

    const r = 60;
    const circumference = 2 * Math.PI * r;

    let current = 0;
    const step = 0.5;      // 부드럽게(원하면 0.1)
    const interval = 4;   // 속도

    const timer = setInterval(() => {
      current = Math.min(current + step, target);

      // 표시 텍스트(원하는 자리수로)
    //   percentEl.textContent = current.toFixed(1) + "%";

      const offset = circumference - (current / 100) * circumference;
      progress.style.strokeDashoffset = offset;

      if (current >= target) clearInterval(timer);
    }, interval);
  };

  // 3) AOS가 붙여주는 class(aos-animate) 감지 → 그때 실행
  let done = false;
  const mo = new MutationObserver(() => {
    if (!done && wrap.classList.contains("aos-animate")) {
      done = true;
      circles.forEach(animateCircle);
      mo.disconnect();
    }
  });

  mo.observe(wrap, { attributes: true, attributeFilter: ["class"] });
});


//section2 explain s2_bt js
document.querySelectorAll('.explain_text').forEach(box => {
  const openBtn = box.querySelector('.s2_bt');
  const closeBtn = box.querySelector('.cover_close_bt');

  openBtn.addEventListener('click', () => {
    box.classList.add('is-open');
  });

  closeBtn.addEventListener('click', () => {
    box.classList.remove('is-open');
  });
});


// s6 community title js
document.addEventListener('DOMContentLoaded', () => {
  const word = document.querySelector('.community_effect');
  if (!word) return;

  // 1) 텍스트를 span.letter로 쪼개기 (1번만)
  const text = word.textContent;         // innerHTML 말고 textContent 권장
  word.textContent = '';

  const letters = [];
  [...text].forEach((ch) => {
    const span = document.createElement('span');
    span.className = 'letter';
    // 공백 처리
    span.innerHTML = (ch === ' ') ? '&nbsp;' : ch;
    word.appendChild(span);
    letters.push(span);
  });

  const resetLetters = () => {
    letters.forEach((el) => el.classList.remove('on'));
  };

  const playLetters = () => {
    resetLetters(); // 들어올 때마다 항상 처음부터
    letters.forEach((el, i) => {
      setTimeout(() => el.classList.add('on'), 350 + i * 80);
    });
  };

  // 2) 스크롤 진입/이탈 감지
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) playLetters();
        else resetLetters(); // 화면 밖으로 나가면 리셋 -> 다시 들어오면 재생
      });
    },
    {
      threshold: 0.6, // 60% 보이면 재생 (원하면 0.3~0.8로 조절)
      // AOS offset 비슷하게 느끼고 싶으면 아래 rootMargin 조절해도 됨
      // rootMargin: "0px 0px -20% 0px",
    }
  );

  io.observe(word);
});

//s6 guide swiper js
document.addEventListener("DOMContentLoaded", () => {
  const el = document.querySelector(".guide_swiper");
  if (!el) return;

  const swiper = new Swiper(".guide_swiper", {
    slidesPerView: 1,
    speed: 600,
    loop: true,
    navigation: {
      nextEl: ".guide_wrap .nav_btn.next",
      prevEl: ".guide_wrap .nav_btn.prev",
    },
  });
});


//s8 sns swiper js
document.addEventListener("DOMContentLoaded", () => {
  const snsEl = document.querySelector(".sns_wrap .sns_swiper");
  if (!snsEl) return;

  const wrapper = snsEl.querySelector(".swiper-wrapper");
  const scrollbar = document.querySelector(".swiper-scrollbar");
  const drag = scrollbar.querySelector(".swiper-scrollbar-drag");

  const snsSwiper = new Swiper(snsEl, {
    slidesPerView: "auto",
    spaceBetween: 40,
    loop: false,

    freeMode: true,
    freeModeMomentum: false,

    allowTouchMove: true,
  });

  /* ---------- 무한 마퀴 제어 ---------- */

  let translateX = 0;
  const speed = 1; // px per frame
  const halfWidth = wrapper.scrollWidth / 2;

  function animate() {
    translateX -= speed;

    if (Math.abs(translateX) >= halfWidth) {
      translateX += halfWidth;
    }

    wrapper.style.transform =
      `translate3d(${translateX}px, 0, 0)`;

    updateScrollbar(translateX);
    requestAnimationFrame(animate);
  }

  animate();

  /* ---------- scrollbar sync ---------- */

  function updateScrollbar(translate) {
    const maxTranslate = halfWidth - snsSwiper.width;
    if (maxTranslate <= 0) return;

    const progress =
      (Math.abs(translate) % maxTranslate) / maxTranslate;

    const maxDragX =
      scrollbar.clientWidth - drag.clientWidth;

    drag.style.transform =
      `translateX(${maxDragX * progress}px)`;
  }
});


//s9 ticket event wrap js//
document.addEventListener("DOMContentLoaded", () => {
  const wrap = document.querySelector("#s9_wrap .ticket_wrap");
  if (!wrap) return;

  const tickets = [...wrap.querySelectorAll(".ticket")];

  const closeAllTickets = () => tickets.forEach(t => t.classList.remove("is-open"));

  // ---------------------------
  // 1) 티켓 펼침 (desktop hover)
  // ---------------------------
  tickets.forEach(t => {
    t.addEventListener("mouseenter", () => {
      closeAllTickets();
      t.classList.add("is-open");
    });
  });

  // wrap 밖으로 나가면 티켓 닫기
  wrap.addEventListener("mouseleave", closeAllTickets);

  // ---------------------------
  // 2) 티켓 펼침 (mobile tap toggle)
  // ---------------------------
  tickets.forEach(t => {
    t.addEventListener("click", (e) => {
      // ✅ ticketbox 버튼/링크 클릭은 티켓 토글 방지
      if (e.target.closest("a, button")) return;

      const on = t.classList.contains("is-open");
      closeAllTickets();
      if (!on) t.classList.add("is-open");
    });
  });

  // ---------------------------
  // 3) 자세히 보기 / 닫기 (ticketbox)
  //    - 이벤트 위임 (여러 개 있어도 OK)
  // ---------------------------
  wrap.addEventListener("click", (e) => {
    const openBtn = e.target.closest(".ticketbox_img_bt button");
    const closeBtn = e.target.closest(".ticketbox_hover_fold_bt button");

    // "자세히 보기" 클릭 -> 해당 ticketbox_img 열기
    if (openBtn) {
      const box = openBtn.closest(".ticketbox_img");
      if (!box) return;

      box.classList.add("is-open");

      // 접근성 옵션(선택)
      const panel = box.querySelector(".ticketbox_hover_text");
      if (panel) panel.setAttribute("aria-hidden", "false");
      return;
    }

    // "닫기" 클릭 -> 해당 ticketbox_img 닫기
    if (closeBtn) {
      const box = closeBtn.closest(".ticketbox_img");
      if (!box) return;

      box.classList.remove("is-open");

      const panel = box.querySelector(".ticketbox_hover_text");
      if (panel) panel.setAttribute("aria-hidden", "true");
      return;
    }
  });

  // ---------------------------
  // 4) (선택) 티켓이 닫힐 때 ticketbox도 같이 닫기
  //    - 티켓이 closeAllTickets() 될 때 box 열림이 남는 걸 방지
  // ---------------------------
  const closeAllTicketBoxes = () => {
    wrap.querySelectorAll(".ticketbox_img.is-open").forEach(box => {
      box.classList.remove("is-open");
      const panel = box.querySelector(".ticketbox_hover_text");
      if (panel) panel.setAttribute("aria-hidden", "true");
    });
  };

  // wrap에서 떠날 때 티켓 닫히면 ticketbox도 닫기
  wrap.addEventListener("mouseleave", closeAllTicketBoxes);

  // 모바일에서 다른 티켓으로 바뀔 때도 ticketbox 정리하고 싶으면:
  const _oldCloseAllTickets = closeAllTickets;
  const closeAllTicketsAndBoxes = () => {
    _oldCloseAllTickets();
    closeAllTicketBoxes();
  };

  // 기존 closeAllTickets 사용하는 곳을 교체 (원하면)
  // - 위에서 이미 closeAllTickets를 쓰고 있어서,
  //   더 깔끔하게 하려면 위 hover/click에서 closeAllTickets()를
  //   closeAllTicketsAndBoxes()로 바꿔주면 됨.
});


//s10 tab js //
$(document).ready(function () {

  // 초기 탭
  $(".tab_content").hide();
  $(".tab_menu li:first").addClass("active");
  $(".tab_content:first").show();

  $(".tab_menu li").on("click", function (e) {
    e.preventDefault();

    $(".tab_menu li").removeClass("active");
    $(this).addClass("active");

    $(".tab_content").hide();

    const activeTab = $(this).find("a").attr("href");
    $(activeTab).fadeIn(200);

    // 🔥 탭 전환 시 아코디언 초기화
    $(activeTab).find(".tab_turn")
      .removeClass("turn")
      .children(".text_info")
      .hide();
  });

});

$(".tab_container").on("click", ".tab_title", function () {

  const $item = $(this).closest(".tab_turn");
  const $content = $item.children(".text_info");
  const $wrap = $item.closest(".tab_content");

  if ($item.hasClass("turn")) {
    $item.removeClass("turn");
    $content.stop(true, true).slideUp();
  } else {
    $wrap.find(".tab_turn")
         .removeClass("turn")
         .children(".text_info")
         .stop(true, true)
         .slideUp();

    $item.addClass("turn");
    $content.stop(true, true).slideDown();
  }
});


