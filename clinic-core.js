(function() {
    // 1. حقن الـ CSS للقائمة الجانبية والموبايل
    const style = document.createElement('style');
    style.innerHTML = `
        .sidebar-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1500; }
        .sidebar-overlay.active { display: block; }
        .mobile-menu-toggle { display: none; }
        
        @media (max-width: 950px) {
            .sidebar {
                transform: translateX(100%) !important;
                position: fixed !important;
                right: 0 !important;
                top: 0 !important;
                height: 100vh !important;
                z-index: 9999 !important;
                transition: transform 0.3s ease-in-out !important;
            }
            .sidebar.active {
                transform: translateX(0) !important;
            }
            .main-content {
                margin-right: 0 !important;
                width: 100% !important;
                padding: 12px !important;
            }
            .mobile-menu-toggle {
                display: flex !important;
                width: 100% !important;
                background: #0b1329;
                color: white;
                border: none;
                padding: 12px;
                font-size: 15px;
                border-radius: 10px;
                cursor: pointer;
                margin-bottom: 15px;
                font-weight: bold;
                text-align: center;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                justify-content: center;
                align-items: center;
                gap: 8px;
                z-index: 100;
            }
        }
    `;
    document.head.appendChild(style);

    function initClinicCore() {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && !sidebar.id) {
            sidebar.id = 'sidebarNav';
        }

        if (window.innerWidth <= 950 && sidebar) {
            sidebar.classList.remove('active');
        }

        if (!document.getElementById('sidebarOverlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            overlay.id = 'sidebarOverlay';
            overlay.onclick = toggleMobileSidebar;
            document.body.appendChild(overlay);
        }

        const mainContent = document.querySelector('.main-content');
        if (mainContent && !document.querySelector('.mobile-menu-toggle')) {
            const menuBtn = document.createElement('button');
            menuBtn.className = 'mobile-menu-toggle';
            menuBtn.innerHTML = '☰ القائمة الرئيسية للعيادة';
            menuBtn.onclick = toggleMobileSidebar;
            mainContent.insertBefore(menuBtn, mainContent.firstChild);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initClinicCore);
    } else {
        initClinicCore();
    }
})();

function toggleMobileSidebar() {
    const nav = document.getElementById('sidebarNav');
    const overlay = document.getElementById('sidebarOverlay');
    if (nav) nav.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
}

// ==========================================
// 🎙️ نظام الأوامر الصوتية العائم لكافة الصفحات
// ==========================================
function renderFloatingVoiceBtn() {
    if (!document.getElementById('globalVoiceFloatingContainer')) {
        const floatingDiv = document.createElement('div');
        floatingDiv.id = 'globalVoiceFloatingContainer';
        floatingDiv.style.cssText = 'position: fixed; bottom: 25px; left: 25px; z-index: 2147483647;';
        floatingDiv.innerHTML = `
            <button onclick="toggleGlobalVoiceCommand()" id="voiceGlobalBtn" style="background: #059669; color: white; border: none; padding: 12px 18px; border-radius: 30px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 8px; font-size: 14px; transition: 0.2s;">
                <span>🎙️</span> <span id="voiceGlobalText">أوامر صوتية</span>
            </button>
        `;
        document.body.appendChild(floatingDiv);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderFloatingVoiceBtn);
} else {
    renderFloatingVoiceBtn();
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let globalRec = null;
let globalListening = false;

function toggleGlobalVoiceCommand() {
    if (!SpeechRecognition) {
        alert('متصفحك لا يدعم الأوامر الصوتية. يرجى استخدام Google Chrome.');
        return;
    }

    if (!globalRec) {
        globalRec = new SpeechRecognition();
        globalRec.lang = 'ar-EG';
        globalRec.interimResults = false;
        globalRec.maxAlternatives = 1;

        globalRec.onstart = function() {
            globalListening = true;
            const txt = document.getElementById('voiceGlobalText');
            const btn = document.getElementById('voiceGlobalBtn');
            if (txt) txt.innerText = 'جاري الاستماع... 🔴';
            if (btn) btn.style.background = '#dc2626';
        };

        globalRec.onresult = function(event) {
            const transcript = event.results[0][0].transcript.trim().toLowerCase();
            console.log('🎙️ الأمر الصوتي العام المسموع:', transcript);
            handleGlobalVoice(transcript);
        };

        globalRec.onerror = function(event) {
            console.error('❌ خطأ في التعرف الصوتي:', event.error);
            resetGlobalBtn();
        };

        globalRec.onend = function() {
            globalListening = false;
            resetGlobalBtn();
        };
    }

    if (globalListening) {
        globalRec.stop();
    } else {
        try {
            globalRec.start();
        } catch (e) {
            globalRec.stop();
        }
    }
}

function resetGlobalBtn() {
    const txt = document.getElementById('voiceGlobalText');
    const btn = document.getElementById('voiceGlobalBtn');
    if (txt) txt.innerText = 'أوامر صوتية';
    if (btn) btn.style.background = '#059669';
}

function handleGlobalVoice(cmd) {
    const navMap = [
        { keywords: ['الرئيسية', 'رئيسية'], url: 'index.html' },
        { keywords: ['المرضى', 'مرضى', 'مريض'], url: 'patients.html' },
        { keywords: ['المواعيد', 'مواعيد', 'جدول'], url: 'appointments.html' },
        { keywords: ['الزيارات', 'زيارات', 'زيارة'], url: 'visits.html' },
        { keywords: ['القياسات', 'قياسات', 'وزن'], url: 'measurements.html' },
        { keywords: ['الخطط الغذائية', 'خطة', 'خطط', 'غذاء'], url: 'meal-builder.html' },
        { keywords: ['قاعدة الأطعمة', 'أطعمة', 'طعام'], url: 'food-database.html' },
        { keywords: ['التحاليل', 'تحاليل', 'تحليل'], url: 'labs.html' },
        { keywords: ['المكملات', 'مكملات', 'فيتامينات'], url: 'supplements.html' },
        { keywords: ['جراحات السمنة', 'سمنة', 'تكميم'], url: 'bariatric.html' },
        { keywords: ['المدفوعات', 'مدفوعات', 'حسابات', 'فلوس'], url: 'payments.html' },
        { keywords: ['التقارير', 'تقارير', 'إحصائيات'], url: 'reports.html' },
        { keywords: ['التنبيهات', 'تنبيهات', 'إشعارات'], url: 'notifications.html' },
        { keywords: ['الأطباء', 'أطباء', 'طاقم'], url: 'doctors.html' },
        { keywords: ['الإعدادات', 'إعدادات'], url: 'settings.html' }
    ];

    for (let item of navMap) {
        for (let kw of item.keywords) {
            if (cmd.includes(kw)) {
                window.location.href = item.url;
                return;
            }
        }
    }

    if (cmd.includes('اطبع') || cmd.includes('طباعة')) {
        window.print();
    } else if (cmd.includes('حجز') || cmd.includes('جديد')) {
        if (typeof openAddAppointmentModal === 'function') {
            openAddAppointmentModal();
        }
    }
}
