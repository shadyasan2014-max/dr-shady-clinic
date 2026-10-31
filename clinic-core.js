// ==========================================
// CLINIC CORE - نظام إدارة العيادات
// ==========================================

(function () {

    // ==========================================
    // إعدادات Supabase
    // ==========================================

    const SUPABASE_URL = 'https://clgywbneeicehmamybrc.supabase.co';

    const SUPABASE_KEY = 'sb_publishable_wY6VrbJDxknPWHzlqaJnrA_NQanmGPc';

    // إنشاء اتصال Supabase مشترك
    if (!window.clinicSupabase && window.supabase) {
        window.clinicSupabase = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );
    }

    // ==========================================
    // CSS القائمة الجانبية والموبايل
    // ==========================================

    const style = document.createElement('style');

    style.innerHTML = `

        /* القائمة الجانبية */

        .sidebar {
            height: 100vh !important;
            max-height: 100vh !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            overscroll-behavior: contain;
            scrollbar-width: thin;
            scrollbar-color: #34d399 #064e3b;
        }

        .sidebar::-webkit-scrollbar {
            width: 6px;
        }

        .sidebar::-webkit-scrollbar-thumb {
            background: #34d399;
            border-radius: 10px;
        }

        .sidebar::-webkit-scrollbar-track {
            background: #064e3b;
        }

        /* خلفية القائمة على الموبايل */

        .sidebar-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1500;
        }

        .sidebar-overlay.active {
            display: block;
        }

        .mobile-menu-toggle {
            display: none;
        }

        /* بيانات المستخدم */

        .clinic-user-role {
            margin: 12px;
            padding: 12px;
            background: rgba(5,150,105,.10);
            border: 1px solid rgba(5,150,105,.2);
            border-radius: 10px;
            color: #047857;
            font-size: 13px;
            text-align: center;
            font-weight: bold;
        }

        /* زر تسجيل الخروج */

        .clinic-logout-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: calc(100% - 24px);
            margin: 12px;
            padding: 12px;
            background: #fee2e2;
            color: #b91c1c;
            border: 1px solid #fecaca;
            border-radius: 10px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
        }

        .clinic-logout-btn:hover {
            background: #fecaca;
        }

        /* إعدادات الشاشات الصغيرة */

        @media (max-width: 950px) {

            .sidebar {
                transform: translateX(100%) !important;
                position: fixed !important;
                right: 0 !important;
                top: 0 !important;
                height: 100vh !important;
                max-height: 100vh !important;
                z-index: 9999 !important;
                transition: transform 0.3s ease-in-out !important;
                overflow-y: auto !important;
                overflow-x: hidden !important;
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

// إصلاح التمرير الداخلي للقائمة الجانبية
const sidebarScrollFix = document.createElement('style');

sidebarScrollFix.textContent = `
    .sidebar {
        display: flex !important;
        flex-direction: column !important;
        justify-content: flex-start !important;
        height: 100vh !important;
        max-height: 100vh !important;
        overflow: hidden !important;
    }

    .sidebar > div:first-child {
        display: flex !important;
        flex-direction: column !important;
        flex: 1 1 auto !important;
        min-height: 0 !important;
        overflow: hidden !important;
    }

    .sidebar-menu {
        display: block !important;
        flex: 1 1 auto !important;
        min-height: 0 !important;
        height: auto !important;
        overflow-y: scroll !important;
        overflow-x: hidden !important;
        overscroll-behavior: contain !important;
        -webkit-overflow-scrolling: touch !important;
    }

    .sidebar-footer {
        flex: 0 0 auto !important;
    }

    .sidebar-menu::-webkit-scrollbar {
        width: 7px;
    }

    .sidebar-menu::-webkit-scrollbar-thumb {
        background: #34d399;
        border-radius: 10px;
    }
`;

document.head.appendChild(sidebarScrollFix);

// ==========================================
// إصلاح التمرير الداخلي للقائمة الجانبية
// ==========================================

function enableSidebarScroll() {

    const sidebar = document.querySelector('.sidebar');

    if (!sidebar) return;

    sidebar.style.setProperty('height', '100vh', 'important');
    sidebar.style.setProperty('max-height', '100vh', 'important');
    sidebar.style.setProperty('overflow-y', 'auto', 'important');
    sidebar.style.setProperty('overflow-x', 'hidden', 'important');
    sidebar.style.setProperty('overscroll-behavior', 'contain', 'important');
    sidebar.style.setProperty('-webkit-overflow-scrolling', 'touch', 'important');

    sidebar.style.setProperty('display', 'block', 'important');

    sidebar.style.setProperty('scrollbar-width', 'thin');
    sidebar.style.setProperty('scrollbar-color', '#34d399 #064e3b');

    // إظهار شريط التمرير بوضوح
    sidebar.style.setProperty('scrollbar-gutter', 'stable');

}

document.addEventListener('DOMContentLoaded', enableSidebarScroll);

window.addEventListener('load', enableSidebarScroll);

setTimeout(enableSidebarScroll, 500);


    // ==========================================
    // تشغيل النظام
    // ==========================================

    function initClinicCore() {

        const sidebar = document.querySelector('.sidebar');

        if (sidebar && !sidebar.id) {
            sidebar.id = 'sidebarNav';
        }

        if (window.innerWidth <= 950 && sidebar) {
            sidebar.classList.remove('active');
        }

        // إنشاء خلفية القائمة

        if (!document.getElementById('sidebarOverlay')) {

            const overlay = document.createElement('div');

            overlay.className = 'sidebar-overlay';
            overlay.id = 'sidebarOverlay';

            overlay.onclick = toggleMobileSidebar;

            document.body.appendChild(overlay);
        }

        // زر القائمة للموبايل

        const mainContent = document.querySelector('.main-content');

        if (
            mainContent &&
            !document.querySelector('.mobile-menu-toggle')
        ) {

            const menuBtn = document.createElement('button');

            menuBtn.className = 'mobile-menu-toggle';

            menuBtn.innerHTML = '☰ القائمة الرئيسية للعيادة';

            menuBtn.onclick = toggleMobileSidebar;

            mainContent.insertBefore(
                menuBtn,
                mainContent.firstChild
            );
        }

        // إضافة زر تسجيل الخروج

        addLogoutButton();

        // التعرف على المستخدم

        loadClinicUserRole();
    }


    if (document.readyState === 'loading') {

        document.addEventListener(
            'DOMContentLoaded',
            initClinicCore
        );

    } else {

        initClinicCore();

    }

})();


// ==========================================
// فتح وغلق القائمة الجانبية
// ==========================================

function toggleMobileSidebar() {

    const nav = document.getElementById('sidebarNav');

    const overlay = document.getElementById('sidebarOverlay');

    if (nav) {
        nav.classList.toggle('active');
    }

    if (overlay) {
        overlay.classList.toggle('active');
    }
}


// ==========================================
// التأكد من صفحة تسجيل الدخول
// ==========================================

function isLoginPage() {

    return window.location.pathname
        .toLowerCase()
        .endsWith('login.html');

}


// ==========================================
// التعرف على المستخدم وصفته
// ==========================================

async function loadClinicUserRole() {

    const client = window.clinicSupabase;

    if (!client || isLoginPage()) return;

    try {

        const { data, error } = await client.auth.getSession();

        if (error) throw error;

        const session = data.session;

        if (!session) {

            window.location.replace('login.html');

            return;
        }

        const userId = session.user.id;

        // التحقق من المدير الرئيسي

        const { data: platformAdmin, error: adminError } =
            await client
                .from('platform_admins')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle();

        if (adminError) throw adminError;

        let role = '';
        let roleLabel = '';

        if (platformAdmin) {

            role = 'super_admin';

            roleLabel = 'المدير الرئيسي';

        } else {

            // التحقق من عضوية العيادة

            const { data: memberships, error: membershipError } =
                await client
                    .from('clinic_memberships')
                    .select('*')
                    .eq('user_id', userId);

            if (membershipError) throw membershipError;

            const membership = (memberships || []).find(item => {

                if (item.is_active === false) return false;

                if (item.active === false) return false;

                return true;

            });

            if (!membership) {

                await client.auth.signOut();

                alert(
                    'حسابك غير مرتبط بعضوية عيادة نشطة. برجاء مراجعة مدير النظام.'
                );

                window.location.replace('login.html');

                return;
            }

            role = membership.role || membership.member_role || '';

            const roles = {

                admin: 'مدير العيادة',

                doctor: 'طبيب',

                reception: 'موظف استقبال',

                nutritionist: 'أخصائي تغذية',

                accountant: 'محاسب'

            };

            roleLabel = roles[role] || 'مستخدم';

        }

        window.currentClinicUser = {

            id: userId,

            role: role,

            roleLabel: roleLabel

        };

        showClinicUserRole(roleLabel);

    } catch (error) {

        console.error('Clinic role error:', error);

    }

}


// ==========================================
// إظهار صفة المستخدم
// ==========================================

function showClinicUserRole(roleLabel) {

    const sidebar = document.querySelector('.sidebar');

    if (!sidebar) return;

    let roleBox = document.getElementById('clinicUserRole');

    if (!roleBox) {

        roleBox = document.createElement('div');

        roleBox.id = 'clinicUserRole';

        roleBox.className = 'clinic-user-role';

        sidebar.appendChild(roleBox);
    }

    roleBox.textContent = 'صفة الحساب: ' + roleLabel;

}


// ==========================================
// إضافة زر تسجيل الخروج
// ==========================================

function addLogoutButton() {

    const sidebar = document.querySelector('.sidebar');

    if (!sidebar) return;

    if (document.getElementById('clinicLogoutBtn')) return;

    const logoutBtn = document.createElement('button');

    logoutBtn.id = 'clinicLogoutBtn';

    logoutBtn.className = 'clinic-logout-btn';

    logoutBtn.innerHTML = '↪ تسجيل الخروج';

    logoutBtn.onclick = logoutClinicUser;

    sidebar.appendChild(logoutBtn);

}


// ==========================================
// تنفيذ تسجيل الخروج
// ==========================================

async function logoutClinicUser() {

    const client = window.clinicSupabase;

    if (!client) {

        window.location.replace('login.html');

        return;
    }

    const confirmed = confirm('هل أنت متأكد من تسجيل الخروج؟');

    if (!confirmed) return;

    try {

        const { error } = await client.auth.signOut();

        if (error) throw error;

        window.location.replace('login.html');

    } catch (error) {

        console.error('Logout error:', error);

        alert('تعذر تسجيل الخروج. حاول مرة أخرى.');

    }

}


// ==========================================
// الأوامر الصوتية العائمة
// ==========================================

function renderFloatingVoiceBtn() {

    if (
        document.getElementById(
            'globalVoiceFloatingContainer'
        )
    ) return;

    const floatingDiv = document.createElement('div');

    floatingDiv.id = 'globalVoiceFloatingContainer';

    floatingDiv.style.cssText =
        'position: fixed; bottom: 25px; left: 25px; z-index: 2147483647;';

    floatingDiv.innerHTML = `

        <button
            onclick="toggleGlobalVoiceCommand()"
            id="voiceGlobalBtn"
            style="
                background: #059669;
                color: white;
                border: none;
                padding: 12px 18px;
                border-radius: 30px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                transition: 0.2s;
            "
        >

            <span>🎙️</span>

            <span id="voiceGlobalText">أوامر صوتية</span>

        </button>

    `;

    document.body.appendChild(floatingDiv);

}


if (document.readyState === 'loading') {

    document.addEventListener(
        'DOMContentLoaded',
        renderFloatingVoiceBtn
    );

} else {

    renderFloatingVoiceBtn();

}


// ==========================================
// نظام التعرف الصوتي
// ==========================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

let globalRec = null;

let globalListening = false;


function toggleGlobalVoiceCommand() {

    if (!SpeechRecognition) {

        alert(
            'متصفحك لا يدعم الأوامر الصوتية. يرجى استخدام Google Chrome.'
        );

        return;
    }

    if (!globalRec) {

        globalRec = new SpeechRecognition();

        globalRec.lang = 'ar-EG';

        globalRec.interimResults = false;

        globalRec.maxAlternatives = 1;


        globalRec.onstart = function () {

            globalListening = true;

            const txt =
                document.getElementById('voiceGlobalText');

            const btn =
                document.getElementById('voiceGlobalBtn');

            if (txt) {
                txt.innerText = 'جاري الاستماع... 🔴';
            }

            if (btn) {
                btn.style.background = '#dc2626';
            }

        };


        globalRec.onresult = function (event) {

            const transcript =
                event.results[0][0]
                    .transcript
                    .trim()
                    .toLowerCase();

            console.log(
                'الأمر الصوتي المسموع:',
                transcript
            );

            handleGlobalVoice(transcript);

        };


        globalRec.onerror = function (event) {

            console.error(
                'خطأ في التعرف الصوتي:',
                event.error
            );

            resetGlobalBtn();

        };


        globalRec.onend = function () {

            globalListening = false;

            resetGlobalBtn();

        };

    }


    if (globalListening) {

        globalRec.stop();

    } else {

        try {

            globalRec.start();

        } catch (error) {

            globalRec.stop();

        }

    }

}


// ==========================================
// إعادة ضبط زر الصوت
// ==========================================

function resetGlobalBtn() {

    const txt =
        document.getElementById('voiceGlobalText');

    const btn =
        document.getElementById('voiceGlobalBtn');

    if (txt) {
        txt.innerText = 'أوامر صوتية';
    }

    if (btn) {
        btn.style.background = '#059669';
    }

}


// ==========================================
// التنقل الصوتي بين صفحات النظام
// ==========================================

function handleGlobalVoice(cmd) {

    const navMap = [

        {
            keywords: ['الرئيسية', 'رئيسية'],
            url: 'index.html'
        },

        {
            keywords: ['المرضى', 'مرضى', 'مريض'],
            url: 'patients.html'
        },

        {
            keywords: ['المواعيد', 'مواعيد', 'جدول'],
            url: 'appointments.html'
        },

        {
            keywords: ['الزيارات', 'زيارات', 'زيارة'],
            url: 'visits.html'
        },

        {
            keywords: ['القياسات', 'قياسات', 'وزن'],
            url: 'measurements.html'
        },

        {
            keywords: ['الخطط الغذائية', 'خطة', 'خطط', 'غذاء'],
            url: 'meal-builder.html'
        },

        {
            keywords: ['قاعدة الأطعمة', 'أطعمة', 'طعام'],
            url: 'food-database.html'
        },

        {
            keywords: ['التحاليل', 'تحاليل', 'تحليل'],
            url: 'labs.html'
        },

        {
            keywords: ['المكملات', 'مكملات', 'فيتامينات'],
            url: 'supplements.html'
        },

        {
            keywords: ['جراحات السمنة', 'سمنة', 'تكميم'],
            url: 'bariatric.html'
        },

        {
            keywords: ['المدفوعات', 'مدفوعات', 'حسابات', 'فلوس'],
            url: 'payments.html'
        },

        {
            keywords: ['التقارير', 'تقارير', 'إحصائيات'],
            url: 'reports.html'
        },

        {
            keywords: ['التنبيهات', 'تنبيهات', 'إشعارات'],
            url: 'notifications.html'
        },

        {
            keywords: ['الأطباء', 'أطباء', 'طاقم'],
            url: 'doctors.html'
        },

        {
            keywords: ['الإعدادات', 'إعدادات'],
            url: 'settings.html'
        }

    ];


    for (let item of navMap) {

        for (let keyword of item.keywords) {

            if (cmd.includes(keyword)) {

                window.location.href = item.url;

                return;
            }

        }

    }


    if (
        cmd.includes('اطبع') ||
        cmd.includes('طباعة')
    ) {

        window.print();

    } else if (
        cmd.includes('حجز') ||
        cmd.includes('جديد')
    ) {

        if (
            typeof openAddAppointmentModal === 'function'
        ) {

            openAddAppointmentModal();

        }

    }

}
