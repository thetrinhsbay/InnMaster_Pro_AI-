
export const storageService = {
  // Cookie Management
  setCookie(name: string, value: string, days: number = 7) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
  },

  getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  deleteCookie(name: string) {
    document.cookie = name + '=; Max-Age=-99999999; path=/;';
  },

  // Persistent State Management
  saveState(key: string, data: any) {
    try {
      localStorage.setItem(`innmaster_${key}`, JSON.stringify(data));
    } catch (e) {
      console.error("Error saving state", e);
    }
  },

  getState<T>(key: string, defaultValue: T): T {
    try {
      const saved = localStorage.getItem(`innmaster_${key}`);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },

  clearAll() {
    this.deleteCookie('session_id');
    localStorage.removeItem('innmaster_active_module');
    localStorage.removeItem('innmaster_ai_chat');
    localStorage.removeItem('innmaster_context');
  }
};
