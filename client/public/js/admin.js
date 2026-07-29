/**
 * Route Finder - Admin Dashboard Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Admin Login Form Submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await res.json();
                if (data.success) {
                    showToast('Authentication successful! Redirecting to Admin Panel...', 'success');
                    setTimeout(() => window.location.href = '/admin', 1000);
                } else {
                    showToast(data.message || 'Login failed', 'danger');
                }
            } catch (err) {
                showToast('Login request failed. Server offline.', 'danger');
            }
        });
    }

    // 2. Add City Form Submission
    const addCityForm = document.getElementById('addCityForm');
    if (addCityForm) {
        addCityForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('cityName').value;
            const state = document.getElementById('cityState').value;

            try {
                const res = await fetch('/api/city', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, state })
                });
                const data = await res.json();
                if (data.success) {
                    showToast(data.message, 'success');
                    setTimeout(() => window.location.reload(), 1000);
                } else {
                    showToast(data.message, 'danger');
                }
            } catch (err) {
                showToast('Error adding city.', 'danger');
            }
        });
    }

    // 3. Add Road Form Submission
    const addRoadForm = document.getElementById('addRoadForm');
    if (addRoadForm) {
        addRoadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const sourceId = document.getElementById('roadSource').value;
            const destinationId = document.getElementById('roadDestination').value;
            const distance = document.getElementById('roadDistance').value;
            const roadType = document.getElementById('roadType').value;

            try {
                const res = await fetch('/api/road', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sourceId, destinationId, distance, roadType })
                });
                const data = await res.json();
                if (data.success) {
                    showToast(data.message, 'success');
                    setTimeout(() => window.location.reload(), 1000);
                } else {
                    showToast(data.message, 'danger');
                }
            } catch (err) {
                showToast('Error adding road.', 'danger');
            }
        });
    }
});

// Delete City Handler
async function deleteCity(id, name) {
    if (!confirm(`Are you sure you want to delete city "${name}" and all connected roads?`)) return;

    try {
        const res = await fetch(`/api/city/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
            showToast(data.message, 'success');
            setTimeout(() => window.location.reload(), 1000);
        } else {
            showToast(data.message, 'danger');
        }
    } catch (err) {
        showToast('Error deleting city.', 'danger');
    }
}

// Delete Road Handler
async function deleteRoad(id) {
    if (!confirm('Are you sure you want to delete this road?')) return;

    try {
        const res = await fetch(`/api/road/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
            showToast(data.message, 'success');
            setTimeout(() => window.location.reload(), 1000);
        } else {
            showToast(data.message, 'danger');
        }
    } catch (err) {
        showToast('Error deleting road.', 'danger');
    }
}
