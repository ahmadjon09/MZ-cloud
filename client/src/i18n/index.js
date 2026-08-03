/**
 * Internationalization (i18next) - English, Russian, and Uzbek
 * Complete Translations for Telegram Cloud Storage Platform (Vector icons only, no text emojis)
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      app: {
        title: 'Telegram Cloud Storage',
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
        confirm: 'Confirm'
      },
      files: {
        emptyTitle: 'Your Telegram Cloud is Empty',
        emptySub: 'Drag & Drop files here, forward messages to your bot, or click "Generate Demo Files" above to test immediately!',
        itemCount: 'files',
        size: 'Size',
        date: 'Added',
        folder: 'Folder',
        notes: 'Notes',
        tags: 'Tags',
        noNotes: 'No private notes added yet.'
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
        title: 'Облако Telegram',
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
        confirm: 'Подтвердить'
      },
      files: {
        emptyTitle: 'Ваше облако Telegram пока пусто',
        emptySub: 'Перетащите файлы сюда, пересылайте в бота или нажмите «Создать демо-файлы» для тестирования!',
        itemCount: 'файлов',
        size: 'Размер',
        date: 'Добавлено',
        folder: 'Папка',
        notes: 'Заметки',
        tags: 'Теги',
        noNotes: 'Заметки пока не добавлены.'
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
        title: 'Telegram Bulutli Xotirasi',
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
        confirm: 'Tasdiqlash'
      },
      files: {
        emptyTitle: 'Sizning bulutingiz hozircha bo‘sh',
        emptySub: 'Fayllarni bu yerga torting, botga yuboring yoki darhol test qilish uchun yuqoridagi "Demo fayllarni yaratish" tugmasini bosing!',
        itemCount: 'fayl',
        size: 'Hajmi',
        date: 'Qo‘shilgan sana',
        folder: 'Papka',
        notes: 'Eslatmalar',
        tags: 'Teglar',
        noNotes: 'Hozircha shaxsiy eslatma qo‘shilmagan.'
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
