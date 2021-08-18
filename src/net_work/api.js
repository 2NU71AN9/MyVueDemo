export default {
    baseURL: "http://106.53.73.30:8888",
    login: "/api/private/v1/login",
    menu: "/api/private/v1/menus",
    users: '/api/private/v1/users',
    userState: (id, state) => `/api/private/v1/users/${id}/state/${state}`,
    addUser: "/api/private/v1/users",
    editUser: (id) => `/api/private/v1/users/${id}`,
    rights: "/api/private/v1/rights/list",
    roles: "/api/private/v1/roles",
}