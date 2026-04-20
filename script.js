/**
 * SK 하이닉스 포트폴리오 — 메인 스크립트
 * v1.0.1 - Supabase & Board Fix
 * 파티클 애니메이션, 스크롤 효과, 모달, 타이핑 효과 등을 관리합니다.
 */

/* ===================================
   설정값 (Configuration)
   =================================== */
const CONFIG = {
    /** 파티클 효과 설정 */
    particles: {
        count: 30,
        colors: ['#E60012', '#FF6B35', '#ffffff'],
        sizeRange: [1, 3],
        durationRange: [6, 14],
    },
    /** 네비게이션 스크롤 감지 임계값 (px) */
    navScrollThreshold: 50,
    /** 히어로 파라락스 강도 */
    parallaxIntensity: 0.3,
    /** 숫자 카운트업 애니메이션 지속 시간 (ms) */
    counterDuration: 2000,
    /** 스크롤 IntersectionObserver 임계값 */
    revealThreshold: 0.15,
    /** 타이핑 효과 속도 (ms) */
    typingSpeed: 30,
    /** 터미널 출력 텍스트 */
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
        
        /** 네비게이션 바 상태 변화 */
        if (navbar) {
            navbar.classList.toggle('scrolled', scrolled > CONFIG.navScrollThreshold);
        }
        
        /** 히어로 파라락스 효과 */
        if (heroBg) {
            heroBg.style.transform = `translateY(${scrolled * CONFIG.parallaxIntensity}px)`;
        }
    });
}

/** 히어로 타이틀 타이핑 효과 */
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
            setTimeout(type, 100); // 히어로 타이핑은 조금 더 천천히
        }
    }
    
    /** 약간의 지연 후 시작 */
    setTimeout(type, 500);
}

/** 현재 보이는 섹션에 맞춰 네비게이션 링크 활성화 */
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

/* ===================================
   모바일 메뉴 토글
   =================================== */
function initMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');

        /** 햄버거 → X 아이콘 토글 */
        const spans = toggle.querySelectorAll('span');
        const isOpen = navLinks.classList.contains('open');
        toggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');

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

    /** 메뉴 항목 클릭 시 모바일 메뉴 자동 닫기 */
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

/** 개별 카운터 애니메이션 처리 */
function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const duration = CONFIG.counterDuration;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        /** easeOutExpo 이징 함수 적용 */
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        counter.textContent = Math.round(eased * target);

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/* ===================================
   스크롤 등장(Reveal) 애니메이션
   =================================== */
function initScrollReveal() {
    /** 애니메이션 대상 요소에 'reveal' 클래스 부여 */
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
   모달 제어 (STAR-R 프레임워크)
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

/** 오버레이 배경 클릭 시 모달 닫기 */
function initModalBackdropClose() {
    document.querySelectorAll('.modal-overlay').forEach((overlay) => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    /** ESC 키로 모달 닫기 */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach((modal) => {
                modal.classList.remove('active');
            });
            document.body.style.overflow = '';
        }
    });
}

/* ===================================
   터미널 타이핑 효과
   =================================== */
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

/** 한 글자씩 타이핑하는 재귀 함수 */
function typeText(element, text, index) {
    if (index >= text.length) return;

    element.textContent += text.charAt(index);
    setTimeout(() => typeText(element, text, index + 1), CONFIG.typingSpeed);
}

/* ===================================
   역량 레이더 차트 (Competency Radar)
   =================================== */
function initRadarChart() {
    const svg = document.getElementById('competency-radar');
    if (!svg) return;

    const scores = [92, 88, 95, 90, 85]; // [본인 점수]
    const centerX = 200;
    const centerY = 200;
    const maxRadius = 150;
    const levels = 4; // 축 눈금 개수
    const axesCount = scores.length;

    const gridGroup = svg.querySelector('.chart-grid');
    const axesGroup = svg.querySelector('.chart-axes');
    const poly = document.getElementById('radar-polygon');
    const pointsGroup = svg.querySelector('.chart-points');

    // 1. 그리드 원(눈금) 그리기
    for (let i = 1; i <= levels; i++) {
        const r = (maxRadius / levels) * i;
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", centerX);
        circle.setAttribute("cy", centerY);
        circle.setAttribute("r", r);
        circle.setAttribute("class", "grid-line");
        gridGroup.appendChild(circle);
    }

    // 2. 축(Axis) 라인 그리기
    for (let i = 0; i < axesCount; i++) {
        const angle = (Math.PI * 2 / axesCount) * i - (Math.PI / 2);
        const x2 = centerX + Math.cos(angle) * maxRadius;
        const y2 = centerY + Math.sin(angle) * maxRadius;

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", centerX);
        line.setAttribute("y1", centerY);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("class", "axis-line");
        axesGroup.appendChild(line);
    }

    // 3. 데이터 점 및 폴리곤 초기화 (점 0에서 시작)
    const getPointsPath = (vals) => {
        return vals.map((v, i) => {
            const angle = (Math.PI * 2 / axesCount) * i - (Math.PI / 2);
            const r = (maxRadius * v) / 100;
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            return { x, y };
        });
    };

    // 애니메이션 트리거 (IntersectionObserver)
    let hasAnimated = false;
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
            hasAnimated = true;
            animateRadar();
        }
    }, { threshold: 0.5 });
    
    observer.observe(svg);

    function animateRadar() {
        const startTime = performance.now();
        const duration = 1200;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic

            const currentScores = scores.map(s => s * eased);
            const pts = getPointsPath(currentScores);
            
            // 폴리곤 경로 업데이트
            const d = pts.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(" ") + " Z";
            poly.setAttribute("d", d);

            // 점 그리기/업데이트
            pointsGroup.innerHTML = '';
            pts.forEach(p => {
                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("cx", p.x);
                circle.setAttribute("cy", p.y);
                circle.setAttribute("r", 4);
                circle.setAttribute("class", "radar-point");
                pointsGroup.appendChild(circle);
            });

            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
}

/* ===================================
   부드러운 스크롤 (앵커 링크)
   =================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* ===================================
   글리치 효과 인터랙션
   =================================== */
function initGlitchEffect() {
    const glitchTexts = document.querySelectorAll('.glitch-text');
    
    glitchTexts.forEach(el => {
        el.addEventListener('mouseover', () => {
            el.style.animation = 'glitch-skew 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite';
        });
        
        el.addEventListener('mouseout', () => {
            el.style.animation = 'glitch-skew 4s infinite linear alternate-reverse';
        });
    });
}

/* ===================================
   자유게시판 (Free Board - Supabase Backend)
   =================================== */
/* --- Supabase Configuration (Dynamically injected during deployment) --- */
// Note: SUPABASE_URL and SUPABASE_ANON_KEY are prepended to this file by the build workflow.

// Robust client initialization
let supabaseClient = null;
try {
    const supabaseLib = window.supabase || (window.Supabase ? window.Supabase.supabase : null) || window.Supabase;
    
    // Check if variables are defined (either by prepend or by global window)
    const url = typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : (window.SUPABASE_URL || '');
    const key = typeof SUPABASE_ANON_KEY !== 'undefined' ? SUPABASE_ANON_KEY : (window.SUPABASE_ANON_KEY || '');

    if (supabaseLib && typeof supabaseLib.createClient === 'function' && url && url !== '__SUPABASE_URL__') {
        supabaseClient = supabaseLib.createClient(url, key);
        console.log('[DEBUG] Supabase client initialized successfully');
    } else {
        console.warn('Supabase configuration missing or invalid. Check GitHub Secrets.');
    }
} catch (e) {
    console.error('Supabase initialization error:', e);
}

// Global handler for board submission to prevent refresh reliably
window.handleBoardSubmit = function(event) {
    // [CRITICAL] 1. IMMEDIATE Sync Prevention
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    console.log('[DEBUG] Board Form Submission Detected (Reload Blocked)');

    // 2. Perform async business logic separately
    asyncBoardSubmission();
    
    return false; // Final fallback
};

async function asyncBoardSubmission() {
    const submitBtn = document.querySelector('#board-form button[type="submit"]');
    const nameInput = document.getElementById('board-name');
    const passwordInput = document.getElementById('board-password');
    const messageInput = document.getElementById('board-message');
    
    if (!messageInput || !passwordInput) {
        console.error('[DEBUG] Form elements missing from DOM');
        return;
    }

    const message = messageInput.value.trim();
    const password = passwordInput.value.trim();
    
    // 익명일 경우 자동으로 4자리 숫자 아이디 부여
    let name = nameInput.value.trim();
    if (!name || name === '익명') {
        const randomId = Math.floor(1000 + Math.random() * 9000);
        name = `익명(${randomId})`;
    }

    if (!message || !password) {
        alert('메시지와 비밀번호를 모두 입력해주세요.');
        return;
    }

    if (!supabaseClient) {
        console.error('[DEBUG] Supabase client is NULL');
        alert('Supabase 연결에 실패했습니다. 사이트 개발자(Secret 설정) 확인이 필요합니다.');
        return;
    }

    // UI Loading State
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>등록 중...</span><div class="loader"></div>';
    }

    try {
        const newPost = { name, password, message };
        console.log('[DEBUG] Sending payload to Supabase:', newPost);
        const success = await savePost(newPost);
        
        if (success) {
            if (nameInput) nameInput.value = '';
            if (passwordInput) passwordInput.value = '';
            if (messageInput) messageInput.value = '';
            console.log('[DEBUG] Post saved successfully');
            loadPosts(); // Refresh list
        }
    } catch (err) {
        console.error('[DEBUG] Async submission error:', err);
        alert('글 등록 중 시스템 오류가 발생했습니다.');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>게시글 등록하기</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>';
        }
    }
}

// Reply Submission Logic
window.showReplyForm = function(parentId) {
    // Hide any other active reply forms first
    document.querySelectorAll('.reply-form-container').forEach(form => {
        form.classList.remove('active');
    });
    
    const postEl = document.querySelector(`.board-post[data-id="${parentId}"]`);
    if (!postEl) return;
    
    let replyForm = postEl.querySelector('.reply-form-container');
    if (!replyForm) {
        // Create reply form if it doesn't exist
        replyForm = document.createElement('div');
        replyForm.className = 'reply-form-container';
        replyForm.innerHTML = `
            <div class="reply-form-grid">
                <input type="text" class="reply-name" placeholder="닉네임 (익명)" maxlength="10">
                <input type="password" class="reply-password" placeholder="비밀번호 4자리" maxlength="4">
            </div>
            <textarea class="reply-textarea" placeholder="답글 내용을 입력하세요..."></textarea>
            <div class="reply-actions">
                <button class="btn-post-action cancel" onclick="cancelReply('${parentId}')">취소</button>
                <button class="btn-post-action save" onclick="submitReply('${parentId}')">답글 등록</button>
            </div>
        `;
        postEl.appendChild(replyForm);
    }
    
    replyForm.classList.add('active');
    replyForm.querySelector('.reply-textarea').focus();
};

window.cancelReply = function(parentId) {
    const postEl = document.querySelector(`.board-post[data-id="${parentId}"]`);
    const replyForm = postEl?.querySelector('.reply-form-container');
    if (replyForm) {
        replyForm.classList.remove('active');
        replyForm.querySelector('.reply-textarea').value = '';
    }
};

window.submitReply = async function(parentId) {
    if (!supabaseClient) return;
    
    const postEl = document.querySelector(`.board-post[data-id="${parentId}"]`);
    const nameInput = postEl.querySelector('.reply-name');
    const passwordInput = postEl.querySelector('.reply-password');
    const messageInput = postEl.querySelector('.reply-textarea');
    
    const message = messageInput.value.trim();
    const password = passwordInput.value.trim();
    if (!message || !password) {
        alert('답글 내용과 비밀번호를 입력해주세요.');
        return;
    }
    
    let name = nameInput.value.trim();
    if (!name || name === '익명') {
        const randomId = Math.floor(1000 + Math.random() * 9000);
        name = `익명(${randomId})`;
    }
    
    const saveBtn = postEl.querySelector('.reply-actions .save');
    saveBtn.disabled = true;
    saveBtn.innerText = '등록 중...';
    
    try {
        const { error } = await supabaseClient.from('posts').insert([{
            name,
            password,
            message,
            parent_id: parentId
        }]);
        
        if (error) throw error;
        
        loadPosts(); // Refresh list
    } catch (err) {
        console.error('Reply submission error:', err);
        alert('답글 등록 중 오류가 발생했습니다.');
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerText = '답글 등록';
    }
};

// Keep initBoard for loading posts
function initBoard() {
    const form = document.getElementById('board-form');
    if (!form) return;
    
    // Add event listener to prevent refresh correctly
    form.addEventListener('submit', window.handleBoardSubmit);
    
    loadPosts();
}

async function savePost(post) {
    if (!supabaseClient) return false;
    const { error } = await supabaseClient.from('posts').insert([post]);
    if (error) {
        console.error('Error saving post:', error);
        alert('게시글 저장 중 오류가 발생했습니다: ' + error.message);
        return false;
    }
    await loadPosts();
    return true;
}

async function loadPosts() {
    console.log('[DEBUG] Loading posts from Supabase...');
    if (!supabaseClient) {
        console.warn('[DEBUG] Cannot load posts: Supabase client is missing');
        return;
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('posts')
            .select('*')
            .order('timestamp', { ascending: false });
        
        if (error) {
            console.error('[DEBUG] Supabase fetch error:', error);
            if (error.code === 'PGRST116' || error.message.includes('relation "posts" does not exist')) {
                const container = document.getElementById('board-posts');
                if (container) container.innerHTML = '<div class="no-posts" style="color:var(--hynix-red);">[SYSTEM ERROR] DB 테이블이 생성되지 않았습니다. 가이드의 SQL을 실행해주세요!</div>';
            }
            return;
        }
        
        console.log('[DEBUG] Posts loaded successfully:', data.length);
        renderPosts(data || []);
    } catch (e) {
        console.error('[DEBUG] Unexpected loading error:', e);
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

    // 1단계 하이어라키 재구성 (부모글과 답글 분리)
    const parents = posts.filter(p => !p.parent_id);
    const children = posts.filter(p => p.parent_id);
    
    // 부모글은 최신순, 답글은 과거순(오래된것이 위)으로 정렬
    parents.forEach(post => {
        renderSinglePost(container, post, false);
        
        // 해당 부모의 답글들을 찾아 렌더링
        const postReplies = children
            .filter(c => c.parent_id === post.id)
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            
        postReplies.forEach(reply => {
            renderSinglePost(container, reply, true);
        });
    });
}

function renderSinglePost(container, post, isReply) {
    const date = new Date(post.timestamp);
    const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    
    const el = document.createElement('div');
    el.className = `board-post ${isReply ? 'reply' : ''}`; 
    el.setAttribute('data-id', post.id);
    el.innerHTML = `
        <div class="post-header">
            <div class="post-header-left">
                <span class="post-name">${escapeHtml(post.name)}</span>
                <span class="post-time">${formattedDate}</span>
            </div>
            <div class="post-actions">
                ${!isReply ? `
                <button class="btn-post-action reply" onclick="showReplyForm('${post.id}')" title="답글">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </button>
                ` : ''}
                <button class="btn-post-action edit" onclick="editPost('${post.id}')" title="수정">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="btn-post-action delete" onclick="deletePost('${post.id}')" title="삭제">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </div>
        </div>
        <div class="post-body">
            ${escapeHtml(post.message).replace(/\n/g, '<br>')}
        </div>
        <div class="post-edit-wrap">
            <textarea class="post-edit-input">${escapeHtml(post.message)}</textarea>
            <div class="post-edit-actions">
                <button class="btn-post-action cancel" onclick="cancelEdit('${post.id}')">취소</button>
                <button class="btn-post-action save" onclick="saveEdit('${post.id}')">저장</button>
            </div>
        </div>
    `;
    container.appendChild(el);
}

// Post Action Functions
window.deletePost = async function(postId) {
    if (!supabaseClient) return;
    
    const { data: posts, error: fetchError } = await supabaseClient.from('posts').select('*').eq('id', postId);
    if (fetchError || !posts.length) return;
    const post = posts[0];

    const pwd = prompt('게시글 삭제를 위해 비밀번호 4자리를 입력해주세요.\n(마스터 비밀번호로 강제 삭제 가능)');
    if (pwd === null) return; // Cancelled
    
    if (pwd === post.password || pwd === '0000') {
        if(confirm('정말 이 게시글을 삭제하시겠습니까?')) {
            const { error: deleteError } = await supabaseClient.from('posts').delete().eq('id', postId);
            if (deleteError) {
                alert('삭제 중 오류가 발생했습니다.');
            } else {
                loadPosts();
            }
        }
    } else {
        alert('비밀번호가 일치하지 않습니다.');
    }
};

window.editPost = async function(postId) {
    if (!supabaseClient) return;
    
    const { data: posts, error: fetchError } = await supabaseClient.from('posts').select('*').eq('id', postId);
    if (fetchError || !posts.length) return;
    const post = posts[0];

    const pwd = prompt('게시글 수정을 위해 비밀번호 4자리를 입력해주세요.\n(마스터 비밀번호로 강제 수정 가능)');
    if (pwd === null) return; // Cancelled

    if (pwd === post.password || pwd === '0000') {
        const postEl = document.querySelector(`.board-post[data-id="${postId}"]`);
        if(postEl) {
            postEl.classList.add('editing');
        }
    } else {
        alert('비밀번호가 일치하지 않습니다.');
    }
};

window.cancelEdit = function(postId) {
    const postEl = document.querySelector(`.board-post[data-id="${postId}"]`);
    if(postEl) {
        postEl.classList.remove('editing');
        const input = postEl.querySelector('.post-edit-input');
        // Re-fetch or reset from DOM if needed, here we just clear the edit state
    }
};

window.saveEdit = async function(postId) {
    if (!supabaseClient) return;
    
    const postEl = document.querySelector(`.board-post[data-id="${postId}"]`);
    if(!postEl) return;
    
    const input = postEl.querySelector('.post-edit-input');
    const newMsg = input.value.trim();
    
    if(!newMsg) return;

    const { error: updateError } = await supabaseClient
        .from('posts')
        .update({ message: newMsg })
        .eq('id', postId);

    if (updateError) {
        alert('저장 중 오류가 발생했습니다.');
    } else {
        loadPosts();
    }
};

// Basic XSS protection
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

/* ===================================
   초기화 (Application Bootstrap)
   =================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1순위: 게시판 기능 (가장 중요)
    try {
        initBoard();
    } catch (e) {
        console.error('initBoard failed:', e);
    }

    // 2순위: 비주얼 효과
    try {
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
        initSmoothScroll();
        initGlitchEffect();
    } catch (error) {
        console.error('Optimization/Visual initialization error:', error);
    }
});
