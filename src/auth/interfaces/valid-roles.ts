

//*es una enumeracion, no una interfaz. admin=0, superUser=1, user=2
// export enum ValidRoles {
//     admin,
//     superUser,
//     user,
// }
//*pero con esto se llaman como un objeto: Ejemplo: validRoles.admin
export enum ValidRoles {
    admin = 'admin',
    superUser = 'super-user',
    user = 'user',
}