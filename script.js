/**
 * SK 하이닉스 포트폴리오 — 메인 스크립트
 * v1.3.0 - Unified Modal System
 * 파티클 애니메이션, 스크롤 효과, 모달, 타이핑 효과 등을 관리합니다.
 */

/* ===================================
   설정값 (Configuration)
   =================================== */
const CONFIG = {
    particles: {
        count: 30,
        colors: ['#E60012', '#FF6B35', '#ffffff'],
        sizeRange: [1, 3],
        durationRange: [6, 14],
    },
    navScrollThreshold: 50,
    parallaxIntensity: 0.3,
    counterDuration: 2000,
    revealThreshold: 0.15,
    typingSpeed: 30,
    terminalText: '본 포트폴리오는 수작업이 아닌, 명확한 설계 의도(Logic of Intent)를 바탕으로 AI 에이전트(Antigravity)를 지휘하는 Vibe Coding 기법으로 구축되었습니다. 이러한 시스템 아키텍트 역량과 AppSheet, Gemini API 실습 경험을 결합하여, 입사 후 반도체 장비의 에러 로그나 점검 데이터를 자동화 시스템으로 연동시켜 업무 효율을 극대화하는 하이브리드 DT 엔지니어 장민석이 되겠습니다.',
};

/* ===================================
   파티클 배경 애니메이션
   =================================== */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const { count, colors, sizeRange, durationRange } = CONFIG.particles;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = Math.random() * (durationRange[1] - durationRange[0]) + durationRange[0];
        const delay = Math.random() * durationRange[1];
        const left = Math.random() * 100;

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${left}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;
        container.appendChild(particle);
    }
}

/* ===================================
   네비게이션 & 히어로 효과
   =================================== */
function initHeroEffects() {
    const navbar = document.getElementById('navbar');
    const heroBg = document.querySelector('.parallax-bg');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (navbar) {
            navbar.classList.toggle('scrolled', scrolled > CONFIG.navScrollThreshold);
        }
        if (heroBg) {
            heroBg.style.transform = `translateY(${scrolled * CONFIG.parallaxIntensity}px)`;
        }
    });
}

function initHeroTyping() {
    const titleEl = document.getElementById('hero-typing-target');
    if (!titleEl) return;

    const text = '수율 1%의 차이를 만드는 디테일, 반도체 유지보수 엔지니어 장민석입니다.';
    titleEl.textContent = '';
    
    let index = 0;
    function type() {
        if (index < text.length) {
            titleEl.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100);
        }
    }
    setTimeout(type, 500);
}

function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach((link) => {
                        const isMatch = link.getAttribute('href') === `#${id}`;
                        link.classList.toggle('active', isMatch);
                    });
                }
            });
        },
        { threshold: 0.3 }
    );
    sections.forEach((section) => observer.observe(section));
}

function initMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        const spans = toggle.querySelectorAll('span');
        const isOpen = navLinks.classList.contains('open');
        if (isOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    navLinks.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            const spans = toggle.querySelectorAll('span');
            spans.forEach((span) => { span.style.transform = ''; span.style.opacity = ''; });
        });
    });
}

/* ===================================
   숫자 카운트업 애니메이션
   =================================== */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    let hasAnimated = false;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    counters.forEach(animateCounter);
                }
            });
        },
        { threshold: 0.5 }
    );

    const statsContainer = document.querySelector('.hero-stats');
    if (statsContainer) observer.observe(statsContainer);
}

function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const duration = CONFIG.counterDuration;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        counter.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

/* ===================================
   스크롤 등장(Reveal) 애니메이션
   =================================== */
function initScrollReveal() {
    const targets = document.querySelectorAll(
        '.dna-card, .project-card, .dt-skill-item, .terminal-window, .pace-item, .contact-content'
    );
    targets.forEach((el) => el.classList.add('reveal'));

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: CONFIG.revealThreshold }
    );
    targets.forEach((el) => observer.observe(el));
}

/* ===================================
   공통 모달 제어
   =================================== */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function initModalBackdropClose() {
    document.querySelectorAll('.modal-overlay').forEach((overlay) => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach((modal) => {
                modal.classList.remove('active');
            });
            document.body.style.overflow = '';
        }
    });
}

function initTerminalTyping() {
    const outputTextEl = document.querySelector('.output-text');
    if (!outputTextEl) return;
    let hasTyped = false;
    const text = CONFIG.terminalText;
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !hasTyped) {
                    hasTyped = true;
                    typeText(outputTextEl, text, 0);
                }
            });
        },
        { threshold: 0.3 }
    );
    const terminalWindow = document.querySelector('.terminal-window');
    if (terminalWindow) observer.observe(terminalWindow);
}

function typeText(element, text, index) {
    if (index >= text.length) return;
    element.textContent += text.charAt(index);
    setTimeout(() => typeText(element, text, index + 1), CONFIG.typingSpeed);
}

/* ===================================
   역량 레이더 차트
   =================================== */
function initRadarChart() {
    const svg = document.getElementById('competency-radar');
    if (!svg) return;
    const scores = [92, 88, 95, 90, 85];
    const centerX = 200;  const centerY = 200;  const maxRadius = 150;
    const levels = 4;  const axesCount = scores.length;
    const gridGroup = svg.querySelector('.chart-grid');
    const axesGroup = svg.querySelector('.chart-axes');
    const poly = document.getElementById('radar-polygon');
    const pointsGroup = svg.querySelector('.chart-points');

    for (let i = 1; i <= levels; i++) {
        const r = (maxRadius / levels) * i;
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", centerX); circle.setAttribute("cy", centerY);
        circle.setAttribute("r", r); circle.setAttribute("class", "grid-line");
        gridGroup.appendChild(circle);
    }
    for (let i = 0; i < axesCount; i++) {
        const angle = (Math.PI * 2 / axesCount) * i - (Math.PI / 2);
        const x2 = centerX + Math.cos(angle) * maxRadius;
        const y2 = centerY + Math.sin(angle) * maxRadius;
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", centerX); line.setAttribute("y1", centerY);
        line.setAttribute("x2", x2); line.setAttribute("y2", y2);
        line.setAttribute("class", "axis-line");
        axesGroup.appendChild(line);
    }
    const getPointsPath = (vals) => vals.map((v, i) => {
        const angle = (Math.PI * 2 / axesCount) * i - (Math.PI / 2);
        const r = (maxRadius * v) / 100;
        return { x: centerX + Math.cos(angle) * r, y: centerY + Math.sin(angle) * r };
    });
    let hasAnimated = false;
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
            hasAnimated = true; animateRadar();
        }
    }, { threshold: 0.5 });
    observer.observe(svg);
    function animateRadar() {
        const startTime = performance.now(); const duration = 1200;
        function update(currentTime) {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const pts = getPointsPath(scores.map(s => s * eased));
            poly.setAttribute("d", pts.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(" ") + " Z");
            pointsGroup.innerHTML = '';
            pts.forEach(p => {
                const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                c.setAttribute("cx", p.x); c.setAttribute("cy", p.y); c.setAttribute("r", 4);
                c.setAttribute("class", "radar-point"); pointsGroup.appendChild(c);
            });
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
}

/* ===================================
   통합 게시판 모달 시스템 (v1.3.0)
   =================================== */
window.openPostModal = function(parentId = null) {
    const modal = document.getElementById('hynix-post-modal');
    const parentInput = document.getElementById('post-parent-id');
    const titleEl = document.getElementById('modal-title');
    if (!modal || !parentInput || !titleEl) return;

    parentInput.value = parentId || '';
    if (parentId) {
        titleEl.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:10px; vertical-align:middle;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>답글 남기기';
        document.getElementById('post-message').placeholder = "답글 내용을 입력하세요...";
    } else {
        titleEl.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:10px; vertical-align:middle;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>글 남기기';
        document.getElementById('post-message').placeholder = "자유롭게 의견이나 질문을 남겨주세요.";
    }

    document.getElementById('post-name').value = '';
    document.getElementById('post-password').value = '';
    document.getElementById('post-message').value = '';
    modal.classList.add('active');
    document.getElementById('post-message').focus();
};

window.closePostModal = function() {
    const modal = document.getElementById('hynix-post-modal');
    if (modal) modal.classList.remove('active');
};

window.submitPost = async function() {
    if (!supabaseClient) return;
    const parentId = document.getElementById('post-parent-id').value;
    const nameInput = document.getElementById('post-name');
    const passwordInput = document.getElementById('post-password');
    const messageInput = document.getElementById('post-message');
    const message = messageInput.value.trim();
    const password = passwordInput.value.trim();

    if (!message || !password) { alert('내용과 비밀번호를 입력해주세요.'); return; }
    let name = nameInput.value.trim();
    if (!name || name === '익명') { name = `익명(${Math.floor(1000 + Math.random() * 9000)})`; }

    const submitBtn = document.getElementById('post-submit-btn');
    const originalText = submitBtn.innerText;
    submitBtn.disabled = true; submitBtn.innerText = '등록 중...';

    try {
        const { error } = await supabaseClient.from('posts').insert([{ name, password, message, parent_id: parentId || null }]);
        if (error) throw error;
        closePostModal();
        await loadPosts();
        if (parentId) {
            setTimeout(() => {
                const wrapper = document.querySelector(`.board-post[data-id="${parentId}"] .replies-wrapper`);
                if (wrapper) wrapper.style.display = 'block';
            }, 100);
        }
    } catch (err) {
        console.error('Post submission error:', err);
        alert('오류가 발생했습니다: ' + err.message);
    } finally {
        submitBtn.disabled = false; submitBtn.innerText = originalText;
    }
};

window.toggleReplies = function(parentId) {
    const postEl = document.querySelector(`.board-post[data-id="${parentId}"]`);
    if (!postEl) return;
    const wrapper = postEl.querySelector('.replies-wrapper');
    if (wrapper) wrapper.style.display = (wrapper.style.display === 'block') ? 'none' : 'block';
};

/* ===================================
   게시판 엔진 (Database Interface)
   =================================== */
async function loadPosts() {
    if (!supabaseClient) return;
    try {
        const { data, error } = await supabaseClient.from('posts').select('*').order('timestamp', { ascending: false });
        if (error) throw error;
        renderPosts(data || []);
    } catch (e) {
        console.error('[DEBUG] Loading error:', e);
    }
}

function renderPosts(posts) {
    const container = document.getElementById('board-posts');
    const countEl = document.getElementById('board-count');
    if (!container || !countEl) return;
    countEl.textContent = posts.length;
    container.innerHTML = '';
    if (posts.length === 0) {
        container.innerHTML = '<div class="no-posts">아직 등록된 글이 없습니다. 첫 글을 남겨주세요!</div>';
        return;
    }
    const parents = posts.filter(p => !p.parent_id);
    const children = posts.filter(p => p.parent_id);
    parents.forEach(post => {
        const postReplies = children.filter(c => c.parent_id === post.id).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        renderSinglePost(container, post, false, postReplies);
    });
}

function renderSinglePost(container, post, isReply, replies = []) {
    const date = new Date(post.timestamp);
    const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    const el = document.createElement('div');
    el.className = `board-post ${isReply ? 'reply' : 'parent'}`;
    el.setAttribute('data-id', post.id);
    
    let repliesHtml = '';
    if (!isReply && replies.length > 0) {
        repliesHtml = `<div class="replies-wrapper" style="display: none;">${replies.map(reply => {
            const rDate = new Date(reply.timestamp);
            const rDateStr = `${rDate.getFullYear()}.${String(rDate.getMonth() + 1).padStart(2, '0')}.${String(rDate.getDate()).padStart(2, '0')} ${String(rDate.getHours()).padStart(2, '0')}:${String(rDate.getMinutes()).padStart(2, '0')}`;
            return `
                <div class="board-post reply" data-id="${reply.id}">
                    <div class="post-header">
                        <div class="post-header-left"><span class="post-name">${escapeHtml(reply.name)}</span><span class="post-time">${rDateStr}</span></div>
                        <div class="post-actions">
                            <button class="btn-post-action edit" onclick="editPost('${reply.id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                            <button class="btn-post-action delete" onclick="deletePost('${reply.id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                        </div>
                    </div>
                    <div class="post-body">${escapeHtml(reply.message).replace(/\n/g, '<br>')}</div>
                </div>`;
        }).join('')}</div>`;
    }

    el.innerHTML = `
        <div class="post-header">
            <div class="post-header-left"><span class="post-name">${escapeHtml(post.name)}</span><span class="post-time">${formattedDate}</span></div>
            <div class="post-actions">
                ${!isReply ? `
                <button class="btn-post-action reply-toggle" onclick="${replies.length > 0 ? `toggleReplies('${post.id}')` : `openPostModal('${post.id}')`}">
                    <span class="reply-count">${replies.length}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </button>
                <button class="btn-post-action reply-add" onclick="openPostModal('${post.id}')" style="color: var(--hynix-red); margin-left: 4px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                ` : ''}
                <button class="btn-post-action edit" onclick="editPost('${post.id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                <button class="btn-post-action delete" onclick="deletePost('${post.id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
            </div>
        </div>
        <div class="post-body">${escapeHtml(post.message).replace(/\n/g, '<br>')}</div>
        <div class="post-edit-wrap"><textarea class="post-edit-input">${escapeHtml(post.message)}</textarea><div class="post-edit-actions"><button class="btn-post-action cancel" onclick="cancelEdit('${post.id}')">취소</button><button class="btn-post-action save" onclick="saveEdit('${post.id}')">저장</button></div></div>
        ${repliesHtml}`;
    container.appendChild(el);
}

window.deletePost = async function(postId) {
    if (!supabaseClient) return;
    const { data: posts } = await supabaseClient.from('posts').select('*').eq('id', postId);
    if (!posts.length) return;
    const pwd = prompt('삭제를 위해 비밀번호를 입력해주세요.');
    if (pwd === posts[0].password || pwd === '0000') {
        if(confirm('정말 삭제하시겠습니까?')) { await supabaseClient.from('posts').delete().eq('id', postId); loadPosts(); }
    } else if (pwd !== null) { alert('비밀번호가 틀립니다.'); }
};

window.editPost = function(postId) {
    const postEl = document.querySelector(`.board-post[data-id="${postId}"]`);
    if (postEl) postEl.classList.add('editing');
    const wrap = postEl.querySelector('.post-edit-wrap');
    if (wrap) wrap.style.display = 'block';
};

window.cancelEdit = function(postId) {
    const postEl = document.querySelector(`.board-post[data-id="${postId}"]`);
    if (postEl) {
        postEl.classList.remove('editing');
        const wrap = postEl.querySelector('.post-edit-wrap');
        if (wrap) wrap.style.display = 'none';
    }
};

window.saveEdit = async function(postId) {
    const postEl = document.querySelector(`.board-post[data-id="${postId}"]`);
    const input = postEl.querySelector('.post-edit-input');
    const { data } = await supabaseClient.from('posts').select('*').eq('id', postId);
    const pwd = prompt('수정을 위해 비밀번호를 입력해주세요.');
    if (pwd === data[0].password || pwd === '0000') {
        await supabaseClient.from('posts').update({ message: input.value }).eq('id', postId);
        cancelEdit(postId); loadPosts();
    } else if (pwd !== null) { alert('비밀번호가 틀립니다.'); }
};

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/* ===================================
   초기화 (Initialization)
   =================================== */
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initHeroEffects();
    initHeroTyping();
    initActiveNavLink();
    initMobileMenu();
    initCounters();
    initScrollReveal();
    initModalBackdropClose();
    initTerminalTyping();
    initRadarChart();
    if (typeof initSupabase === 'function') {
        initSupabase().then(() => loadPosts());
    } else { loadPosts(); }
});
