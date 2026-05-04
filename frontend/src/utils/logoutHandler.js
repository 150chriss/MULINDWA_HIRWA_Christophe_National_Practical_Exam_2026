// Logout handler utility
export const handleLogout = async () => {
  try {
    // Clear user data from localStorage
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('authToken')

    // Clear any other session data if needed
    sessionStorage.clear()

    return true
  } catch (error) {
    console.error('Error during logout:', error)
    return false
  }
}
