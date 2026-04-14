/**
 * SK 하이닉스 포트폴리오 — 메인 스크립트
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
const SUPABASE_URL = 'https://pfvngqhwppxykwfyyvdw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_f4FS8kUDV7pPtdO21eFZBQ_uKVMLCmy';

// Robust client initialization
let supabase = null;
try {
    const supabaseLib = window.supabase || window.Supabase;
    if (supabaseLib) {
        supabase = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        console.error('Supabase library not found. Check if the CDN script is loaded.');
    }
} catch (e) {
    console.error('Supabase initialization error:', e);
}

function initBoard() {
    const form = document.getElementById('board-form');
    if (!form) {
        console.warn('Board form not found.');
        return;
    }

    console.log('Board initialized, attaching submit listener...');
    loadPosts();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form submission intercepted.');
        
        const nameInput = document.getElementById('board-name');
        const passwordInput = document.getElementById('board-password');
        const messageInput = document.getElementById('board-message');
        
        if (!messageInput.value.trim() || !passwordInput.value.trim()) {
            alert('메시지와 비밀번호를 모두 입력해주세요.');
            return;
        }

        if (!supabase) {
            alert('데이터베이스 연결에 실패했습니다. (Supabase Script가 로드되지 않음)');
            return;
        }

        const newPost = {
            id: Date.now().toString(),
            name: nameInput.value.trim() || '익명',
            password: passwordInput.value.trim(),
            message: messageInput.value.trim(),
            timestamp: new Date().toISOString()
        };

        savePost(newPost);
        
        // Form reset
        nameInput.value = '';
        passwordInput.value = '';
        messageInput.value = '';
        
        // Show success effect (button pulse)
        const btn = form.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>등록 완료!</span>';
        btn.style.background = 'var(--terminal-green)';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
        }, 2000);
    });
}

async function savePost(post) {
    if (!supabase) return;
    const { error } = await supabase.from('posts').insert([post]);
    if (error) {
        console.error('Error saving post:', error);
        alert('게시글 저장 중 오류가 발생했습니다.');
        return;
    }
    loadPosts();
}

async function loadPosts() {
    if (!supabase) return;
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('timestamp', { ascending: false });
    
    if (error) {
        console.error('Error loading posts:', error);
        return;
    }
    renderPosts(data || []);
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
    
    posts.forEach(post => {
        const date = new Date(post.timestamp);
        const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        
        const el = document.createElement('div');
        el.className = 'board-post reveal visible'; 
        el.setAttribute('data-id', post.id);
        el.innerHTML = `
            <div class="post-header">
                <div class="post-header-left">
                    <span class="post-name">${escapeHtml(post.name)}</span>
                    <span class="post-time">${formattedDate}</span>
                </div>
                <div class="post-actions">
                    <button class="btn-post-action edit" onclick="editPost('${post.id}')">수정</button>
                    <button class="btn-post-action delete" onclick="deletePost('${post.id}')">삭제</button>
                </div>
            </div>
            <div class="post-body">
                ${escapeHtml(post.message).replace(/\\n/g, '<br>')}
            </div>
            <textarea class="post-edit-input">${escapeHtml(post.message)}</textarea>
            <div class="post-edit-actions">
                <button class="btn-post-action" onclick="cancelEdit('${post.id}')">취소</button>
                <button class="btn-post-action edit" style="color:var(--hynix-orange);" onclick="saveEdit('${post.id}')">저장</button>
            </div>
        `;
        container.appendChild(el);
    });
}

// Post Action Functions
window.deletePost = async function(postId) {
    if (!supabase) return;
    
    const { data: posts, error: fetchError } = await supabase.from('posts').select('*').eq('id', postId);
    if (fetchError || !posts.length) return;
    const post = posts[0];

    const pwd = prompt('게시글 삭제를 위해 비밀번호 4자리를 입력해주세요.\n(마스터 비밀번호로 강제 삭제 가능)');
    if (pwd === null) return; // Cancelled
    
    if (pwd === post.password || pwd === '0000') {
        if(confirm('정말 이 게시글을 삭제하시겠습니까?')) {
            const { error: deleteError } = await supabase.from('posts').delete().eq('id', postId);
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
    if (!supabase) return;
    
    const { data: posts, error: fetchError } = await supabase.from('posts').select('*').eq('id', postId);
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
    if (!supabase) return;
    
    const postEl = document.querySelector(`.board-post[data-id="${postId}"]`);
    if(!postEl) return;
    
    const input = postEl.querySelector('.post-edit-input');
    const newMsg = input.value.trim();
    
    if(!newMsg) return;

    const { error: updateError } = await supabase
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
        initSmoothScroll();
        initGlitchEffect();
    } catch (error) {
        console.error('Optimization/Visual initialization error:', error);
    }
});
