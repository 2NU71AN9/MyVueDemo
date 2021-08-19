export default {
    baseURL: "http://106.53.73.30:8888",
    login: "/api/private/v1/login",
    menu: "/api/private/v1/menus",
    users: '/api/private/v1/users',
    userState: (id, state) => `/api/private/v1/users/${id}/state/${state}`,
    addUser: "/api/private/v1/users",
    editUser: (id) => `/api/private/v1/users/${id}`,
    fenPeiRole: (userId) => `/api/private/v1/users/${userId}/role`,
    rights: (isList) => `/api/private/v1/rights/${isList ? 'list' : 'tree'}`,
    roles: "/api/private/v1/roles",
    removeRightById: (roleId, rightId) => `/api/private/v1/roles/${roleId}/rights/${rightId}`,
    setRights: (roleId) => `/api/private/v1/roles/${roleId}/rights`
}