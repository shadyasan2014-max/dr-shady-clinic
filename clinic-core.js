function handleGlobalVoice(cmd) {
    const navMap = {
        'الرئيسية': 'index.html',
        'المرضى': 'patients.html',
        'المواعيد': 'appointments.html',
        'الزيارات': 'visits.html',
        'القياسات': 'measurements.html',
        'الخطط الغذائية': 'meal-builder.html',
        'قاعدة الأطعمة': 'food-database.html',
        'التحاليل': 'labs.html',
        'المكملات': 'supplements.html',
        'جراحات السمنة': 'bariatric.html',
        'المدفوعات': 'payments.html',
        'التقارير': 'reports.html',
        'التنبيهات': 'notifications.html',
        'الأطباء': 'doctors.html',
        'الإعدادات': 'settings.html'
    };

    for (let key in navMap) {
        if (cmd.includes(key)) {
            window.location.href = navMap[key];
            return;
        }
    }

    if (cmd.includes('اطبع') || cmd.includes('طباعة')) {
        window.print();
    } else if (cmd.includes('حجز') || cmd.includes('جديد')) {
        // لو الدالة مشعّلة في الصفحة الحالية (زي صفحة المواعيد)، نادِ عليها بأمان
        if (typeof openAddAppointmentModal === 'function') {
            openAddAppointmentModal();
        }
    }
}
