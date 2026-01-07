// src/utils/navigation.js
class NavigationService {
  constructor() {
    this.navigator = null;
  }

  setNavigator(nav) {
    this.navigator = nav;
  }

  navigateToLogin() {
    if (this.navigator) {
      this.navigator('/login');
    } else {
      // Fallback nếu chưa có navigator
      window.location.href = '/login';
    }
  }
}

export const navigationService = new NavigationService();