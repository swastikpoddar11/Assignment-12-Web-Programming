/**
 * NovaTech Authentication & User Session Management
 */

class AuthManager {
  constructor() {
    this.storageKey = 'novatech_user';
    this.usersKey = 'novatech_registered_users';
    this.initDefaultUsers();
  }

  initDefaultUsers() {
    if (!localStorage.getItem(this.usersKey)) {
      const defaultUsers = [
        {
          name: 'Alex Rivera',
          email: 'alex@example.com',
          password: 'password123',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
        }
      ];
      localStorage.setItem(this.usersKey, JSON.stringify(defaultUsers));
    }
  }

  getRegisteredUsers() {
    try {
      const data = localStorage.getItem(this.usersKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  getCurrentUser() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  login(email, password) {
    const users = this.getRegisteredUsers();
    const match = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password);
    
    if (match) {
      const sessionUser = {
        name: match.name,
        email: match.email,
        avatar: match.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(match.name)}&background=4f46e5&color=fff`
      };
      localStorage.setItem(this.storageKey, JSON.stringify(sessionUser));
      this.updateUI();
      return { success: true, user: sessionUser };
    }
    return { success: false, message: 'Invalid email or password. You can use the demo credentials provided!' };
  }

  register(name, email, password) {
    const users = this.getRegisteredUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase().trim())) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=4f46e5&color=fff`
    };

    users.push(newUser);
    localStorage.setItem(this.usersKey, JSON.stringify(users));

    // Auto login
    const sessionUser = { name: newUser.name, email: newUser.email, avatar: newUser.avatar };
    localStorage.setItem(this.storageKey, JSON.stringify(sessionUser));
    this.updateUI();
    return { success: true, user: sessionUser };
  }

  logout() {
    localStorage.removeItem(this.storageKey);
    this.updateUI();
    if (window.showToast) {
      window.showToast('You have been logged out.', 'info');
    }
  }

  updateUI() {
    const user = this.getCurrentUser();
    const userSlot = document.getElementById('userNavSlot');
    if (!userSlot) return;

    if (user) {
      userSlot.innerHTML = `
        <div class="user-profile-menu" style="display:flex; align-items:center; gap:0.5rem; position:relative;">
          <button id="userDropdownTrigger" class="user-status-btn">
            <img src="${user.avatar}" alt="${user.name}" style="width:24px; height:24px; border-radius:50%; object-fit:cover;">
            <span>${user.name.split(' ')[0]}</span>
            <span style="font-size:0.75rem;">▼</span>
          </button>
          <div id="userDropdown" style="display:none; position:absolute; right:0; top:calc(100% + 8px); background:#fff; border:1px solid var(--border); border-radius:var(--radius-md); box-shadow:var(--shadow-lg); width:180px; padding:0.5rem; z-index:110;">
            <div style="padding:0.5rem; border-bottom:1px solid var(--border); font-size:0.8rem; color:var(--text-muted); word-break:break-all;">${user.email}</div>
            <button id="logoutBtn" style="width:100%; text-align:left; padding:0.6rem 0.5rem; font-size:0.85rem; color:var(--danger); font-weight:600; border-radius:var(--radius-sm); margin-top:4px;">
              🚪 Sign Out
            </button>
          </div>
        </div>
      `;

      const trigger = document.getElementById('userDropdownTrigger');
      const dropdown = document.getElementById('userDropdown');
      const logoutBtn = document.getElementById('logoutBtn');

      trigger.onclick = (e) => {
        e.stopPropagation();
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
      };

      logoutBtn.onclick = () => {
        this.logout();
        dropdown.style.display = 'none';
      };

      document.addEventListener('click', () => {
        if (dropdown) dropdown.style.display = 'none';
      });
    } else {
      userSlot.innerHTML = `
        <a href="auth.html" class="user-status-btn">
          <span>👤</span>
          <span>Sign In</span>
        </a>
      `;
    }
  }
}

window.authManager = new AuthManager();
