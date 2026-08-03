/**
 * Internationalization (i18next) - English, Russian, and Uzbek
 * Complete Translations for MZ-CLOUD Platform (Vector icons only, no text emojis)
 * 100% coverage across ContextMenu, PremiumModal, AudioBar, VideoPlayer, and FileCard
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      app: {
        title: 'MZ-CLOUD Storage',
        subtitle: 'Personal Cloud built on Telegram Saved Messages',
        searchPlaceholder: 'Search files, folders, notes, tags... (Cmd + K)',
        demoGenerator: 'Generate Demo Files',
        demoGeneratorTip: 'Create sample Photos, Videos, PDFs, and Code files instantly to test search & galleries'
      },
      sidebar: {
        allFiles: 'Saved Messages (All)',
        photos: 'Photos',
        videos: 'Videos',
        documents: 'Documents',
        music: 'Music & Audio',
        voice: 'Voice Notes',
        code: 'Code & Archives',
        favorites: 'Favorites',
        pinned: 'Pinned',
        recent: 'Recent',
        trash: 'Recycle Bin',
        folders: 'My Folders',
        newFolder: 'New Folder',
        adminPanel: 'Super Admin Panel',
        storageUsed: 'Storage Used',
        collapse: 'Collapse Sidebar',
        expand: 'Expand Sidebar'
      },
      actions: {
        upload: 'Upload Files',
        newFolder: 'Create Folder',
        emptyTrash: 'Empty Trash',
        sort: 'Sort By',
        view: 'View Mode',
        grid: 'Grid View',
        masonry: 'Masonry View',
        list: 'List View',
        refresh: 'Refresh',
        favorite: 'Favorite',
        unfavorite: 'Unfavorite',
        pin: 'Pin to Top',
        unpin: 'Unpin',
        moveToFolder: 'Move to Folder',
        editNotes: 'Private Notes',
        editTags: 'Manage Tags',
        share: 'Share Public Link',
        download: 'Download / View CDN',
        delete: 'Move to Recycle Bin',
        restore: 'Restore File',
        permanentDelete: 'Delete Permanently',
        save: 'Save Changes',
        cancel: 'Cancel',
        confirm: 'Confirm',
        sendToTelegram: 'Send to my Telegram',
        sending: 'Sending...',
        openPreview: 'Open / Preview'
      },
      premium: {
        title: 'MZ-CLOUD Premium',
        subtitle: 'Activate via Telegram Stars (XTR)',
        benefit1Title: '100% Ad-Free Experience (0 Ads)',
        benefit1Desc: 'Sponsorship banners and all promotional overlays are permanently removed.',
        benefit2Title: 'VIP Golden Star Badge',
        benefit2Desc: 'A special MZ-CLOUD Premium golden star icon is displayed next to your name.',
        benefit3Title: 'Parallel Upload Priority',
        benefit3Desc: 'Your files are queued and indexed first in our high-speed Worker Pools.',
        alreadyPremium: 'You are already an MZ-CLOUD Premium member',
        payStars: 'Activate for 50 Telegram Stars',
        devToggle: '[Dev mode] Toggle MZ-CLOUD Premium status'
      },
      files: {
        emptyTitle: 'Your MZ-CLOUD is Empty',
        emptySub: 'Send any photo, video, document, or music track to your Telegram bot to see it appear here instantly!',
        itemCount: 'files',
        size: 'Size',
        date: 'Added',
        folder: 'Folder',
        notes: 'Notes',
        tags: 'Tags',
        noNotes: 'No private notes added yet.'
      },
      media: {
        videoPlayerSub: 'MZ-CLOUD Telegram CDN Player — Position Auto-Remembered',
        cdnStreamTip: 'This media is stored safely inside Telegram CDN. Click below to forward the original file directly to your Telegram chat:',
        videoLoading: 'Loading video from Telegram CDN...',
        audioTrack: 'Audio Track'
      },
      admin: {
        title: 'Super Admin Control Panel',
        overview: 'Platform Overview',
        totalUsers: 'Total Users',
        premiumUsers: 'Premium Users',
        storageUsed: 'Total Storage',
        totalFiles: 'Total CDN Files',
        health: 'Live Server Health',
        redisStatus: 'Redis Cache',
        dbStatus: 'PostgreSQL',
        queueLen: 'Active Queue',
        ramUsage: 'RAM Usage',
        userManagement: 'User Management',
        searchUsers: 'Search users by username or Telegram ID...',
        ban: 'Ban User',
        unban: 'Unban',
        role: 'Role',
        auditLogs: 'System Activity & Audit Logs',
        broadcastTitle: 'Broadcast Announcement',
        broadcastSub: 'Send a message to all active Telegram Bot users',
        broadcastSend: 'Send Broadcast'
      },
      modals: {
        notesTitle: 'Private Markdown Notes & Checklist',
        tagsTitle: 'Manage Colored Tags',
        folderTitle: 'Create / Edit Folder',
        folderName: 'Folder Name',
        color: 'Folder Color',
        emoji: 'Folder Icon',
        searchTitle: 'Global Spotlight Search',
        shareTitle: 'Public Shareable Link'
      }
    }
  },
  ru: {
    translation: {
      app: {
        title: 'Облако MZ-CLOUD',
        subtitle: 'Личное хранилище на базе Избранного Telegram',
        searchPlaceholder: 'Поиск файлов, папок, заметок, тегов... (Cmd + K)',
        demoGenerator: 'Создать демо-файлы',
        demoGeneratorTip: 'Создайте тестовые фото, видео, PDF и код в 1 клик для проверки'
      },
      sidebar: {
        allFiles: 'Избранное (Все файлы)',
        photos: 'Фотографии',
        videos: 'Видеозаписи',
        documents: 'Документы',
        music: 'Аудио и Музыка',
        voice: 'Голосовые сообщения',
        code: 'Код и Архивы',
        favorites: 'Избранные',
        pinned: 'Закрепленные',
        recent: 'Недавние',
        trash: 'Корзина',
        folders: 'Мои Папки',
        newFolder: 'Новая Папка',
        adminPanel: 'Панель Супер-Админа',
        storageUsed: 'Использовано места',
        collapse: 'Свернуть меню',
        expand: 'Развернуть меню'
      },
      actions: {
        upload: 'Загрузить файлы',
        newFolder: 'Создать папку',
        emptyTrash: 'Очистить корзину',
        sort: 'Сортировка',
        view: 'Вид',
        grid: 'Сетка',
        masonry: 'Плитка',
        list: 'Список',
        refresh: 'Обновить',
        favorite: 'В избранное',
        unfavorite: 'Убрать из избранного',
        pin: 'Закрепить',
        unpin: 'Открепить',
        moveToFolder: 'Переместить в папку',
        editNotes: 'Личные заметки',
        editTags: 'Управление тегами',
        share: 'Поделиться ссылкой',
        download: 'Скачать / Просмотр',
        delete: 'В корзину',
        restore: 'Восстановить',
        permanentDelete: 'Удалить навсегда',
        save: 'Сохранить',
        cancel: 'Отмена',
        confirm: 'Подтвердить',
        sendToTelegram: 'Отправить в Telegram чат',
        sending: 'Отправка...',
        openPreview: 'Открыть / Просмотр'
      },
      premium: {
        title: 'MZ-CLOUD Premium',
        subtitle: 'Активация через Telegram Stars (XTR)',
        benefit1Title: '100% Без рекламы (0 Ads)',
        benefit1Desc: 'Спонсорские баннеры и рекламные блоки полностью отключаются.',
        benefit2Title: 'VIP Золотая Звезда',
        benefit2Desc: 'Рядом с вашим именем отображается золотая звезда MZ-CLOUD Premium.',
        benefit3Title: 'Приоритет в очереди',
        benefit3Desc: 'Ваши файлы обрабатываются и индексируются первыми в Worker Pool.',
        alreadyPremium: 'Вы уже участник MZ-CLOUD Premium',
        payStars: 'Активировать за 50 Telegram Stars',
        devToggle: '[Dev mode] Изменить статус MZ-CLOUD Premium'
      },
      files: {
        emptyTitle: 'Ваше облако MZ-CLOUD пока пусто',
        emptySub: 'Отправьте любое фото, видео, документ или музыку в бот Telegram, чтобы увидеть их здесь мгновенно!',
        itemCount: 'файлов',
        size: 'Размер',
        date: 'Добавлено',
        folder: 'Папка',
        notes: 'Заметки',
        tags: 'Теги',
        noNotes: 'Заметки пока не добавлены.'
      },
      media: {
        videoPlayerSub: 'Плеер MZ-CLOUD — Позиция сохраняется автоматически',
        cdnStreamTip: 'Файл хранится в Telegram CDN. Нажмите кнопку ниже, чтобы переслать оригинал в ваш чат:',
        videoLoading: 'Загрузка видео из Telegram CDN...',
        audioTrack: 'Аудио трек'
      },
      admin: {
        title: 'Панель управления Супер-Админа',
        overview: 'Обзор платформы',
        totalUsers: 'Всего пользователей',
        premiumUsers: 'Premium пользователи',
        storageUsed: 'Общий объем',
        totalFiles: 'Файлов в CDN',
        health: 'Состояние серверов',
        redisStatus: 'Кэш Redis',
        dbStatus: 'База данных',
        queueLen: 'Очередь задач',
        ramUsage: 'ОЗУ',
        userManagement: 'Управление пользователями',
        searchUsers: 'Поиск по имени или Telegram ID...',
        ban: 'Заблокировать',
        unban: 'Разблокировать',
        role: 'Роль',
        auditLogs: 'Логи активности системы',
        broadcastTitle: 'Массовая рассылка',
        broadcastSub: 'Отправить сообщение всем пользователям бота',
        broadcastSend: 'Отправить рассылку'
      },
      modals: {
        notesTitle: 'Личные заметки Markdown',
        tagsTitle: 'Управление тегами',
        folderTitle: 'Создание / Редактирование папки',
        folderName: 'Название папки',
        color: 'Цвет папки',
        emoji: 'Иконка папки',
        searchTitle: 'Глобальный поиск',
        shareTitle: 'Публичная ссылка'
      }
    }
  },
  uz: {
    translation: {
      app: {
        title: 'MZ-CLOUD Bulutli Xotira',
        subtitle: 'Telegram Saqlangan xabarlarga asoslangan shaxsiy bulut',
        searchPlaceholder: 'Fayllar, papkalar, eslatmalar, teglarni qidirish... (Cmd + K)',
        demoGenerator: 'Demo fayllarni yaratish',
        demoGeneratorTip: 'Rasm, video, PDF va kod fayllarini darhol test qilish uchun bosing'
      },
      sidebar: {
        allFiles: 'Saqlanganlar (Barcha fayllar)',
        photos: 'Rasmlar',
        videos: 'Videolar',
        documents: 'Hujjatlar',
        music: 'Musiqa va Audio',
        voice: 'Ovozli xabarlar',
        code: 'Kod va Arxivlar',
        favorites: 'Sevimli fayllar',
        pinned: 'Qadalganlar',
        recent: 'So‘nggilar',
        trash: 'Chiqindi qutisi',
        folders: 'Mening Papkalarim',
        newFolder: 'Yangi Papka',
        adminPanel: 'Super Admin Paneli',
        storageUsed: 'Ishlatilgan joy',
        collapse: 'Yig‘ish',
        expand: 'Yoyish'
      },
      actions: {
        upload: 'Fayl yuklash',
        newFolder: 'Papka yaratish',
        emptyTrash: 'Qutini bo‘shatish',
        sort: 'Saralash',
        view: 'Ko‘rinish',
        grid: 'Setka shakli',
        masonry: 'Mozaika shakli',
        list: 'Ro‘yxat shakli',
        refresh: 'Yangilash',
        favorite: 'Sevimlilarga qo‘shish',
        unfavorite: 'Sevimlilardan olib tashlash',
        pin: 'Yuqoriga qadash',
        unpin: 'Qadamaslik',
        moveToFolder: 'Papkaga ko‘chirish',
        editNotes: 'Shaxsiy eslatma',
        editTags: 'Teglarni boshqarish',
        share: 'Ulashish havolasi',
        download: 'Yuklab olish / Ko‘rish',
        delete: 'Chiqindiga tashlash',
        restore: 'Qayta tiklash',
        permanentDelete: 'Butunlay o‘chirish',
        save: 'Saqlash',
        cancel: 'Bekor qilish',
        confirm: 'Tasdiqlash',
        sendToTelegram: 'Telegram chatingizga yuborish',
        sending: 'Yuborilmoqda...',
        openPreview: 'Ochish / Ko\'rish'
      },
      premium: {
        title: 'MZ-CLOUD Premium',
        subtitle: 'Telegram Stars (XTR) orqali faollashtiring',
        benefit1Title: '100% Reklamasiz Interfeys (0 Ads)',
        benefit1Desc: 'Homiylik bannerlari va barcha reklama oynalari butunlay o\'chiriladi.',
        benefit2Title: 'VIP Oltin Yulduz Yorlig\'i',
        benefit2Desc: 'Ismingiz yonida maxsus MZ-CLOUD Premium oltin yulduz statusi ko\'rinadi.',
        benefit3Title: 'Parallel Upload Ustuvorligi',
        benefit3Desc: 'Fayllaringiz tezkor Worker Pool navbatida eng birinchi yozilib indekslanadi.',
        alreadyPremium: 'Siz allaqachon MZ-CLOUD Premium a\'zosisiz',
        payStars: '50 Telegram Stars orqali faollashtirish',
        devToggle: '[Dev mode] MZ-CLOUD Premium statusini yangilash'
      },
      files: {
        emptyTitle: 'Sizning MZ-CLOUD bulutingiz hozircha bo‘sh',
        emptySub: 'Istalgan rasm, video, hujjat yoki musiqani Telegram botingizga yuboring va ular ushbu ekranda darhol paydo bo\'ladi!',
        itemCount: 'fayl',
        size: 'Hajmi',
        date: 'Qo‘shilgan sana',
        folder: 'Papka',
        notes: 'Eslatmalar',
        tags: 'Teglar',
        noNotes: 'Hozircha shaxsiy eslatma qo‘shilmagan.'
      },
      media: {
        videoPlayerSub: 'MZ-CLOUD Telegram CDN Pleyer — Ko\'rilgan vaqt avtomatik saqlanadi',
        cdnStreamTip: 'Ushbu media Telegram CDN da saqlanmoqda. Original faylni o\'z chatingizga yuborish uchun quyidagi tugmani bosing:',
        videoLoading: 'Telegram CDN\'dan video yuklanmoqda...',
        audioTrack: 'Audio Trek'
      },
      admin: {
        title: 'Super Admin Boshqaruv Paneli',
        overview: 'Tizim ko‘rsatkichlari',
        totalUsers: 'Jami foydalanuvchilar',
        premiumUsers: 'Premium foydalanuvchilar',
        storageUsed: 'Jami xotira',
        totalFiles: 'CDN fayllar soni',
        health: 'Serverlar holati',
        redisStatus: 'Redis Kesh',
        dbStatus: 'Ma’lumotlar bazasi',
        queueLen: 'Faol navbat',
        ramUsage: 'RAM bandligi',
        userManagement: 'Foydalanuvchilarni boshqarish',
        searchUsers: 'Foydalanuvchi nomi yoki Telegram ID bo‘yicha qidirish...',
        ban: 'Bloklash',
        unban: 'Blokdan chiqarish',
        role: 'Rol',
        auditLogs: 'Tizim faoliyati va Audit loglar',
        broadcastTitle: 'Ommaviy xabar yuborish',
        broadcastSub: 'Barcha bot foydalanuvchilariga xabar yuborish',
        broadcastSend: 'Xabarni yuborish'
      },
      modals: {
        notesTitle: 'Shaxsiy Markdown Eslatmalar',
        tagsTitle: 'Teglarni boshqarish',
        folderTitle: 'Papka Yaratish / Tahrirlash',
        folderName: 'Papka nomi',
        color: 'Papka rangi',
        emoji: 'Papka belgisi',
        searchTitle: 'Global qidiruv paneli',
        shareTitle: 'Ommaviy havola'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
