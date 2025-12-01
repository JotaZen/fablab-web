 if (roles && roles.length > 0 && user) {
    const hasRequiredRole = roles.includes(user.role.id) ||
      user.role.id === 'super_admin' ||
      user.role.id === 'admin';
????? eso  no aplica