const works = [
  {
    name: '前菜',
    foodBox: [13919, 7215, 15103, 7853],
    title: '石头扫地机P20 Ultra Plus评测',
    url: 'https://www.bilibili.com/video/BV1dtbkzNEuB/',
    material: '距离发布仅剩5天，在上一代基础上最核心的升级就是“温度更高”，需要快速把这个参数型卖点做出直观感受。',
    making: '围绕“温度更高”统一设计测试与画面表达。让文稿、测试、拍摄和后期都服务于同一个核心概念。',
    highlight: '从蒸汽视觉到温度对照测试，把抽象参数转成连续、可感知的视觉证据。',
    result: '上线首日播放30W+，登上B站热门。',
  },
  {
    name: '热菜',
    foodBox: [13978, 7372, 15066, 8166],
    title: '外卖平台体验测试',
    url: 'https://www.bilibili.com/video/BV1xoq1BaEiM/',
    material: '原本只想比较四个平台谁送得更快，策划时我把问题延伸到从打开APP到拿到餐的完整体验。',
    making: '在统一商家、餐品、地址和下单时间的前提下，分别测试高峰、非高峰、雨天、普通天气、新老用户等场景。测试中发现新的问题，再继续追加验证。',
    highlight: '有些内容是测试中发现的，比如新用户推荐、优惠、搜索结果等。后期穿插实拍、采访、UI和数据，避免变成一份表格汇报。',
    result: '视频上线当天登上B站热门。',
  },
  {
    name: '汤菜',
    foodBox: [14043, 7096, 15191, 7768],
    title: '大疆扫地机ROMO P评测',
    url: 'https://www.bilibili.com/video/BV1VxtnzPEJP/',
    material: '大疆首款扫地机器人上市前送测，相比复述避障很强，我更想知道它究竟如何判断周围的环境？',
    making: '围绕AI判断、避障与路径规划设计多轮控制变量和对照测试；遇到异常持续复验，并针对测试中新出现的行为追加验证。',
    highlight: '将抽象的AI能力拆成模式差异、路径选择与清洁动作，让机器的思考过程通过行为被看见。',
    result: '视频上线当天登上B站热门。',
  },
  {
    name: '主食',
    foodBox: [13933, 7211, 15078, 7810],
    title: '科沃斯洗地机器人T90 Pro',
    url: 'https://www.bilibili.com/video/BV1z8fmB5ETj/',
    material: '品牌方希望把“滚筒洗地”讲清楚，从结构、原理到清洁过程，以及和传统圆盘拖布的区别，都需要在片中体现。',
    making: '先搭整体结构，前段快速讲清原理并先给出一组实际结果，再回来把“滚筒洗地”逐层拆开，穿插实测、对比和原理画面完成说明。',
    highlight: '尽量不让卖点只靠口播解释，能拍出来的就直接拍，能对比的就放在一起看，让画面承担信息。',
    result: '上线首日播放40W+，登上B站热门。',
  },
  {
    name: '点心',
    foodBox: [13846, 7156, 15137, 7739],
    title: '极米投影仪RS 20全家桶',
    url: 'https://www.bilibili.com/video/BV1ZdJGzwEeB/',
    material: '投影的参数很多，但真正影响选择的，还是放到不同家庭和使用场景里好不好用。',
    making: '根据不同内容切换产品展示、暗场影音、游戏和系统实拍等画面，让各段信息有对应的视觉呈现。',
    highlight: '不同段落采用不同视觉方式，电影突出暗场和画质，游戏进入实际使用场景，产品部分则回到更干净的展示画面。',
    result: '视频上线当天登上B站热门。',
  },
  {
    name: '水果',
    foodBox: [13916, 7546, 15117, 8177],
    title: '黑白影像横评',
    url: 'https://www.bilibili.com/video/BV1nMqsYKEwb/',
    material: '围绕不同手机对黑白影像的呈现展开，通过人像、建筑、街景等场景观察不同品牌的影像风格。',
    making: '根据不同场景控制光影、构图和人物状态，并将多品牌样张整理成统一的对比方式。',
    highlight: '黑白题材本身很吃光影，所以拍摄时更强调明暗层次、轮廓和质感；后期则尽量让同场景样张直接并排，减少花哨包装，让差异本身成为重点。',
    result: '首次尝试手机影像题材，成片获得领导认可。',
  },
];

const track = document.getElementById('carousel-track');
const carousel = document.getElementById('carousel');
const MOTION_MS = 500;
const TRACKPAD_THRESHOLD = 18;
const WHEEL_IDLE_MS = 160;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let activeIndex = 0;
let motionLocked = false;
let unlockTimer = 0;
let wheelTravel = 0;
let wheelDirection = 0;
let wheelGestureConsumed = false;
let lastWheelAt = -Infinity;
let wheelResetTimer = 0;
let wheelLockedUntil = 0;
let drag = null;
let dragFrame = 0;
let draggedUntil = 0;

function makeParagraph(label, body) {
  const section = document.createElement('section');
  const heading = document.createElement('h3');
  heading.textContent = `${label}：`;
  const paragraph = document.createElement('p');
  paragraph.textContent = body;
  section.append(heading, paragraph);
  return section;
}

for (const [index, work] of works.entries()) {
  const slide = document.createElement('article');
  slide.className = 'work-slide';
  slide.setAttribute('aria-roledescription', '作品');
  slide.setAttribute('aria-label', `${index + 1} / 7：${work.name}`);

  const canvas = document.createElement('div');
  canvas.className = 'slide-canvas canvas';
  const visual = document.createElement('div');
  visual.className = 'visual-panel';

  const art = document.createElement('img');
  art.className = 'visual-art';
  art.src = `assets/decor/${work.name}-left.webp`;
  art.width = 2880;
  art.height = 2700;
  art.decoding = 'async';
  art.alt = '';
  art.draggable = false;

  const chef = document.createElement('img');
  chef.className = 'intro-chef';
  chef.src = `assets/decor/${work.name}-chef.png`;
  chef.width = 840;
  chef.height = 1400;
  chef.decoding = 'async';
  chef.alt = '';
  chef.draggable = false;

  const taste = document.createElement('a');
  taste.className = 'taste-link';
  taste.href = work.url;
  taste.target = '_blank';
  taste.rel = 'noopener noreferrer';
  taste.draggable = false;
  taste.setAttribute('aria-label', `点击品鉴：${work.title}，在新标签页打开视频`);
  const tasteImage = document.createElement('img');
  tasteImage.src = '素材/点击品鉴.png';
  tasteImage.width = 1877;
  tasteImage.height = 464;
  tasteImage.decoding = 'async';
  tasteImage.alt = '点击品鉴';
  tasteImage.draggable = false;
  taste.append(tasteImage);

  const still = document.createElement('a');
  still.className = 'video-still';
  still.href = work.url;
  still.target = '_blank';
  still.rel = 'noopener noreferrer';
  still.draggable = false;
  still.setAttribute('aria-label', `${work.title}，在新标签页打开视频`);
  const stillImage = document.createElement('img');
  stillImage.dataset.src = `assets/stills/${work.name}.webp`;
  stillImage.width = 1800;
  stillImage.height = 1012;
  stillImage.decoding = 'async';
  stillImage.alt = `${work.title}视频单帧`;
  stillImage.draggable = false;
  still.append(stillImage);
  visual.append(art, chef, taste, still);

  const headingImage = document.createElement('img');
  headingImage.className = 'work-heading';
  headingImage.src = `assets/decor/${work.name}-heading.png`;
  headingImage.width = 2300;
  headingImage.height = 670;
  headingImage.decoding = 'async';
  headingImage.alt = work.name === '点心' ? '菜品档案' : '菜品介绍';

  const copy = document.createElement('div');
  copy.className = 'work-copy';
  const title = document.createElement('h2');
  title.textContent = work.title;
  copy.append(title,
    makeParagraph('选材', work.material),
    makeParagraph('制作', work.making),
    makeParagraph('亮点', work.highlight),
    makeParagraph('成果', work.result));

  const food = document.createElement('img');
  food.className = 'food-icon';
  food.src = `assets/decor/${work.name}-food.png`;
  food.width = work.foodBox[2] - work.foodBox[0];
  food.height = work.foodBox[3] - work.foodBox[1];
  food.decoding = 'async';
  food.alt = '';
  food.style.setProperty('--food-x', `${work.foodBox[0] / 160}%`);
  food.style.setProperty('--food-y', `${work.foodBox[1] / 90}%`);
  food.style.setProperty('--food-width', `${(work.foodBox[2] - work.foodBox[0]) / 160}%`);
  canvas.append(visual, headingImage, copy, food);
  slide.append(canvas);
  track.append(slide);
}

const endingSlide = document.createElement('article');
endingSlide.className = 'work-slide ending-slide';
endingSlide.id = 'contact';
endingSlide.setAttribute('aria-roledescription', '结束页');
endingSlide.setAttribute('aria-label', '7 / 7：联系方式');
const endingCanvas = document.createElement('div');
endingCanvas.className = 'slide-canvas canvas';
const endingImage = document.createElement('img');
endingImage.className = 'page-art';
endingImage.dataset.src = 'assets/pages/ending-20261013-v2.webp';
endingImage.width = 3840;
endingImage.height = 2160;
endingImage.decoding = 'async';
endingImage.alt = '今天的菜，上齐啦！希望这桌内容合你胃口，也让你更了解我是怎么做内容的。';
endingImage.draggable = false;
const phoneButton = document.createElement('button');
phoneButton.type = 'button';
phoneButton.className = 'contact-hotspot contact-phone';
phoneButton.setAttribute('aria-label', '复制电话 19123036453');
const emailButton = document.createElement('button');
emailButton.type = 'button';
emailButton.className = 'contact-hotspot contact-email';
emailButton.setAttribute('aria-label', '复制邮箱 wowpeekaboo@163.com');
endingCanvas.append(endingImage, phoneButton, emailButton);
endingSlide.append(endingCanvas);
track.append(endingSlide);

const copyToast = document.createElement('div');
copyToast.className = 'copy-toast';
copyToast.setAttribute('role', 'status');
copyToast.setAttribute('aria-live', 'polite');
document.body.append(copyToast);
let copyToastTimer = 0;

function showCopyNotice(message, fallbackText = '') {
  clearTimeout(copyToastTimer);
  copyToast.replaceChildren();
  const label = document.createElement('span');
  label.textContent = message;
  copyToast.append(label);
  if (fallbackText) {
    const input = document.createElement('input');
    input.type = 'text';
    input.readOnly = true;
    input.value = fallbackText;
    input.setAttribute('aria-label', '可手动复制的内容');
    copyToast.append(input);
    requestAnimationFrame(() => {
      input.focus({ preventScroll: true });
      input.select();
    });
  }
  copyToast.classList.add('is-visible');
  copyToastTimer = window.setTimeout(() => {
    copyToast.classList.remove('is-visible');
  }, fallbackText ? 6000 : 1800);
}

function legacyCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  return copied;
}

async function copyContact(text, successMessage) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(text);
    showCopyNotice(successMessage);
  } catch {
    try {
      if (legacyCopy(text)) {
        showCopyNotice(successMessage);
        return;
      }
    } catch {}
    showCopyNotice('复制失败，请手动复制', text);
  }
}

phoneButton.addEventListener('click', () => copyContact('19123036453', '已复制电话'));
emailButton.addEventListener('click', () => copyContact('wowpeekaboo@163.com', '已复制邮箱'));

const slides = [...track.children];
const slideImages = slides.map(slide => [...slide.querySelectorAll('img')]);
const decodeStarted = new WeakSet();

function loadNearbyImages(index) {
  for (let i = Math.max(0, index - 1); i <= Math.min(slides.length - 1, index + 1); i += 1) {
    for (const image of slideImages[i]) {
      if (!image.hasAttribute('src') && image.dataset.src) image.src = image.dataset.src;
      if (decodeStarted.has(image) || typeof image.decode !== 'function') continue;
      decodeStarted.add(image);
      image.decode().catch(() => {});
    }
  }
}

function setTrackPosition(index, dragOffset = 0) {
  track.style.transform = `translate3d(calc(${-index * 100}% + ${dragOffset}px), 0, 0)`;
}

function updateActiveSlide() {
  for (const [index, slide] of slides.entries()) {
    const inactive = index !== activeIndex;
    slide.setAttribute('aria-hidden', String(inactive));
    slide.inert = inactive;
  }
}

function releaseMotionLock() {
  clearTimeout(unlockTimer);
  motionLocked = false;
  carousel.classList.remove('is-transitioning');
}

function settleAt(targetIndex, dragOffset = null) {
  if (motionLocked || targetIndex < 0 || targetIndex >= slides.length) return false;
  if (targetIndex === activeIndex && dragOffset === null) return false;
  motionLocked = true;
  carousel.classList.add('is-transitioning');
  const originIndex = activeIndex;
  activeIndex = targetIndex;
  loadNearbyImages(activeIndex);
  updateActiveSlide();
  cancelAnimationFrame(dragFrame);
  dragFrame = 0;

  if (reducedMotion.matches) {
    track.style.transition = 'none';
    setTrackPosition(activeIndex);
    requestAnimationFrame(() => {
      track.style.transition = '';
      releaseMotionLock();
    });
    return true;
  }

  const beginMotion = () => {
    track.style.transition = '';
    setTrackPosition(activeIndex);
    unlockTimer = window.setTimeout(releaseMotionLock, MOTION_MS);
  };
  if (dragOffset !== null) {
    track.style.transition = 'none';
    setTrackPosition(originIndex, dragOffset);
    // Commit the release position before starting the return or next slide.
    requestAnimationFrame(() => requestAnimationFrame(beginMotion));
  } else beginMotion();
  return true;
}

function changeBy(direction) {
  if (drag?.horizontal) return false;
  return settleAt(activeIndex + Math.sign(direction));
}

loadNearbyImages(0);
updateActiveSlide();
setTrackPosition(0);

function workIsVisible() {
  const bounds = document.getElementById('portfolio').getBoundingClientRect();
  const viewport = document.getElementById('page-scroll').getBoundingClientRect();
  const tolerance = Math.max(12, viewport.height * .025);
  return Math.abs(bounds.top - viewport.top) <= tolerance && bounds.bottom >= viewport.bottom - tolerance;
}

window.addEventListener('keydown', event => {
  if (!workIsVisible() || event.repeat) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    changeBy(event.key === 'ArrowRight' ? 1 : -1);
  }
});

function resetWheelGesture() {
  clearTimeout(wheelResetTimer);
  wheelTravel = 0;
  wheelDirection = 0;
  wheelGestureConsumed = false;
  lastWheelAt = -Infinity;
}

function armWheelReset() {
  clearTimeout(wheelResetTimer);
  wheelResetTimer = window.setTimeout(resetWheelGesture, WHEEL_IDLE_MS);
}

function normalizedWheelDelta(event) {
  const rawDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) * 1.15
    ? event.deltaX : event.deltaY;
  const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16
    : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? carousel.clientHeight : 1;
  return rawDelta * unit;
}

const pageScroll = document.getElementById('page-scroll');
const pageSections = ['cover', 'about', 'portfolio'].map(id => document.getElementById(id));

function closestSectionIndex() {
  const viewportTop = pageScroll.getBoundingClientRect().top;
  let closestIndex = 0;
  let closestDistance = Infinity;
  for (const [index, section] of pageSections.entries()) {
    const distance = Math.abs(section.getBoundingClientRect().top - viewportTop);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  }
  return closestIndex;
}

function scrollSectionIntoView(sectionId, behavior = null) {
  const resolvedBehavior = behavior || (reducedMotion.matches ? 'auto' : 'smooth');
  if (resolvedBehavior === 'smooth') wheelLockedUntil = performance.now() + MOTION_MS;
  document.getElementById(sectionId).scrollIntoView({
    behavior: resolvedBehavior,
    block: 'start',
  });
}

window.addEventListener('wheel', event => {
  if (event.ctrlKey) return;
  // Narrow layouts need native vertical scrolling to read the whole work.
  if (window.matchMedia('(max-width: 980px)').matches &&
      Math.abs(event.deltaY) >= Math.abs(event.deltaX)) return;

  const delta = normalizedWheelDelta(event);
  if (Math.abs(delta) < .5) return;
  const direction = Math.sign(delta);
  const now = performance.now();
  if (now - lastWheelAt > WHEEL_IDLE_MS) {
    resetWheelGesture();
  }
  lastWheelAt = now;
  armWheelReset();
  event.preventDefault();

  if (wheelGestureConsumed || motionLocked || drag || now < wheelLockedUntil) {
    wheelGestureConsumed = true;
    return;
  }

  if (wheelDirection && wheelDirection !== direction) wheelTravel = 0;
  wheelDirection = direction;
  const discreteWheel = event.deltaMode !== WheelEvent.DOM_DELTA_PIXEL;
  if (!discreteWheel) {
    wheelTravel += delta;
  }
  if (!discreteWheel && Math.abs(wheelTravel) < TRACKPAD_THRESHOLD) return;

  wheelGestureConsumed = true;
  const sectionIndex = closestSectionIndex();

  if (sectionIndex === pageSections.length - 1) {
    if (activeIndex === 0 && direction < 0) {
      scrollSectionIntoView('about');
      return;
    }
    if (activeIndex === slides.length - 1 && direction > 0) return;
    if (changeBy(direction)) wheelLockedUntil = now + MOTION_MS;
    return;
  }

  const targetSectionIndex = Math.max(0, Math.min(pageSections.length - 1, sectionIndex + direction));
  if (targetSectionIndex === sectionIndex) return;
  if (targetSectionIndex === pageSections.length - 1) jumpToSlide(0);
  scrollSectionIntoView(pageSections[targetSectionIndex].id);
}, { passive: false });

function scheduleDragPosition() {
  if (dragFrame) return;
  dragFrame = requestAnimationFrame(() => {
    dragFrame = 0;
    if (drag?.horizontal) setTrackPosition(activeIndex, drag.offset);
  });
}

function finishDrag(event, cancelled = false) {
  if (!drag || event.pointerId !== drag.id) return;
  const finished = drag;
  drag = null;
  if (carousel.hasPointerCapture(finished.id)) carousel.releasePointerCapture(finished.id);
  carousel.classList.remove('is-dragging');
  if (!finished.horizontal) return;
  draggedUntil = performance.now() + MOTION_MS;
  if (finished.offset === 0) {
    track.style.transition = '';
    return;
  }
  const threshold = Math.min(60, carousel.clientWidth * .13);
  const target = !cancelled && Math.abs(finished.offset) >= threshold
    ? activeIndex - Math.sign(finished.offset) : activeIndex;
  settleAt(Math.max(0, Math.min(slides.length - 1, target)), finished.offset);
}

carousel.addEventListener('pointerdown', event => {
  if (motionLocked || !event.isPrimary) return;
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  drag = { id: event.pointerId, startX: event.clientX, startY: event.clientY,
    offset: 0, horizontal: false };
}, { passive: true });

carousel.addEventListener('pointermove', event => {
  if (!drag || event.pointerId !== drag.id || motionLocked) return;
  const dx = event.clientX - drag.startX;
  const dy = event.clientY - drag.startY;
  if (!drag.horizontal) {
    if (Math.abs(dx) < 7 || Math.abs(dx) <= Math.abs(dy) * 1.15) return;
    drag.horizontal = true;
    track.style.transition = 'none';
    carousel.classList.add('is-dragging');
    carousel.setPointerCapture(event.pointerId);
  }
  const atFirst = activeIndex === 0 && dx > 0;
  const atLast = activeIndex === slides.length - 1 && dx < 0;
  drag.offset = atFirst || atLast ? 0 : dx;
  scheduleDragPosition();
}, { passive: true });

carousel.addEventListener('pointerup', event => finishDrag(event), { passive: true });
carousel.addEventListener('pointercancel', event => finishDrag(event, true), { passive: true });
carousel.addEventListener('dragstart', event => event.preventDefault());
carousel.addEventListener('click', event => {
  if (performance.now() < draggedUntil && event.target.closest('.video-still, .taste-link, .contact-hotspot')) {
    event.preventDefault();
  }
}, true);

function cancelDrag() {
  if (drag && carousel.hasPointerCapture(drag.id)) carousel.releasePointerCapture(drag.id);
  drag = null;
  cancelAnimationFrame(dragFrame);
  dragFrame = 0;
  carousel.classList.remove('is-dragging');
}

function jumpToSlide(index) {
  const target = Math.max(0, Math.min(slides.length - 1, index));
  clearTimeout(unlockTimer);
  cancelDrag();
  motionLocked = false;
  carousel.classList.remove('is-transitioning');
  activeIndex = target;
  loadNearbyImages(activeIndex);
  updateActiveSlide();
  track.style.transition = 'none';
  setTrackPosition(activeIndex);
  requestAnimationFrame(() => { track.style.transition = ''; });
}

function navigateTo(sectionId, slideIndex = null, behavior = null) {
  resetWheelGesture();
  if (slideIndex !== null) {
    jumpToSlide(slideIndex);
  } else if (sectionId !== 'portfolio') {
    // Returning to the vertical pages resets the next natural entry to 前菜.
    jumpToSlide(0);
  }
  scrollSectionIntoView(sectionId, behavior);
}

document.querySelectorAll('[data-section]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const slide = link.hasAttribute('data-slide') ? Number(link.dataset.slide) : null;
    navigateTo(link.dataset.section, slide);
  });
});

document.querySelector('.cover-next').addEventListener('click', event => {
  event.preventDefault();
  navigateTo('about');
});

if (window.location.hash === '#contact') {
  requestAnimationFrame(() => navigateTo('portfolio', slides.length - 1, 'auto'));
}
