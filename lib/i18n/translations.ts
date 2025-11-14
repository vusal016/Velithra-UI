/**
 * Velithra - Internationalization Translations
 * EN / AZ language support
 */

export type Language = 'en' | 'az';

export interface Translations {
  // Common
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    create: string;
    update: string;
    search: string;
    filter: string;
    export: string;
    import: string;
    actions: string;
    status: string;
    active: string;
    inactive: string;
    loading: string;
    noData: string;
    error: string;
    success: string;
    confirm: string;
    yes: string;
    no: string;
  };

  // Navigation
  nav: {
    dashboard: string;
    users: string;
    hr: string;
    employees: string;
    departments: string;
    courses: string;
    tasks: string;
    inventory: string;
    chat: string;
    notifications: string;
    auditLogs: string;
    modules: string;
    profile: string;
    settings: string;
    logout: string;
  };

  // Dashboard
  dashboard: {
    welcome: string;
    totalUsers: string;
    activeModules: string;
    myTasks: string;
    myCourses: string;
    recentActivity: string;
    quickActions: string;
  };

  // Auth
  auth: {
    login: string;
    register: string;
    username: string;
    password: string;
    email: string;
    rememberMe: string;
    forgotPassword: string;
    loginSuccess: string;
    loginFailed: string;
    logout: string;
  };

  // Validation
  validation: {
    required: string;
    invalidEmail: string;
    minLength: string;
    maxLength: string;
    passwordMismatch: string;
  };

  // Messages
  messages: {
    createSuccess: string;
    updateSuccess: string;
    deleteSuccess: string;
    deleteConfirm: string;
    errorOccurred: string;
    noPermission: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      update: 'Update',
      search: 'Search',
      filter: 'Filter',
      export: 'Export',
      import: 'Import',
      actions: 'Actions',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      loading: 'Loading...',
      noData: 'No data available',
      error: 'Error',
      success: 'Success',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
    },
    nav: {
      dashboard: 'Dashboard',
      users: 'Users',
      hr: 'Human Resources',
      employees: 'Employees',
      departments: 'Departments',
      courses: 'Courses',
      tasks: 'Tasks',
      inventory: 'Inventory',
      chat: 'Chat',
      notifications: 'Notifications',
      auditLogs: 'Audit Logs',
      modules: 'Modules',
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Logout',
    },
    dashboard: {
      welcome: 'Welcome back',
      totalUsers: 'Total Users',
      activeModules: 'Active Modules',
      myTasks: 'My Tasks',
      myCourses: 'My Courses',
      recentActivity: 'Recent Activity',
      quickActions: 'Quick Actions',
    },
    auth: {
      login: 'Login',
      register: 'Register',
      username: 'Username',
      password: 'Password',
      email: 'Email',
      rememberMe: 'Remember Me',
      forgotPassword: 'Forgot Password?',
      loginSuccess: 'Login successful',
      loginFailed: 'Login failed',
      logout: 'Logout',
    },
    validation: {
      required: 'This field is required',
      invalidEmail: 'Invalid email address',
      minLength: 'Minimum length is {min} characters',
      maxLength: 'Maximum length is {max} characters',
      passwordMismatch: 'Passwords do not match',
    },
    messages: {
      createSuccess: 'Created successfully',
      updateSuccess: 'Updated successfully',
      deleteSuccess: 'Deleted successfully',
      deleteConfirm: 'Are you sure you want to delete this item?',
      errorOccurred: 'An error occurred',
      noPermission: 'You do not have permission to perform this action',
    },
  },
  az: {
    common: {
      save: 'Yadda saxla',
      cancel: 'Ləğv et',
      delete: 'Sil',
      edit: 'Redaktə et',
      create: 'Yarat',
      update: 'Yenilə',
      search: 'Axtar',
      filter: 'Filtr',
      export: 'İxrac et',
      import: 'İdxal et',
      actions: 'Əməliyyatlar',
      status: 'Status',
      active: 'Aktiv',
      inactive: 'Deaktiv',
      loading: 'Yüklənir...',
      noData: 'Məlumat yoxdur',
      error: 'Xəta',
      success: 'Uğurlu',
      confirm: 'Təsdiq et',
      yes: 'Bəli',
      no: 'Xeyr',
    },
    nav: {
      dashboard: 'İdarə Paneli',
      users: 'İstifadəçilər',
      hr: 'İnsan Resursları',
      employees: 'İşçilər',
      departments: 'Şöbələr',
      courses: 'Kurslar',
      tasks: 'Tapşırıqlar',
      inventory: 'Anbar',
      chat: 'Söhbət',
      notifications: 'Bildirişlər',
      auditLogs: 'Audit Qeydləri',
      modules: 'Modullar',
      profile: 'Profil',
      settings: 'Tənzimləmələr',
      logout: 'Çıxış',
    },
    dashboard: {
      welcome: 'Xoş gəldiniz',
      totalUsers: 'Ümumi İstifadəçilər',
      activeModules: 'Aktiv Modullar',
      myTasks: 'Tapşırıqlarım',
      myCourses: 'Kurslarım',
      recentActivity: 'Son Fəaliyyət',
      quickActions: 'Sürətli Əməliyyatlar',
    },
    auth: {
      login: 'Daxil ol',
      register: 'Qeydiyyat',
      username: 'İstifadəçi adı',
      password: 'Şifrə',
      email: 'E-poçt',
      rememberMe: 'Məni xatırla',
      forgotPassword: 'Şifrəni unutmusunuz?',
      loginSuccess: 'Giriş uğurlu oldu',
      loginFailed: 'Giriş uğursuz oldu',
      logout: 'Çıxış',
    },
    validation: {
      required: 'Bu sahə mütləqdir',
      invalidEmail: 'Yanlış e-poçt ünvanı',
      minLength: 'Minimum uzunluq {min} simvoldur',
      maxLength: 'Maksimum uzunluq {max} simvoldur',
      passwordMismatch: 'Şifrələr uyğun gəlmir',
    },
    messages: {
      createSuccess: 'Uğurla yaradıldı',
      updateSuccess: 'Uğurla yeniləndi',
      deleteSuccess: 'Uğurla silindi',
      deleteConfirm: 'Bu elementi silmək istədiyinizə əminsiniz?',
      errorOccurred: 'Xəta baş verdi',
      noPermission: 'Bu əməliyyatı yerinə yetirmək üçün icazəniz yoxdur',
    },
  },
};
