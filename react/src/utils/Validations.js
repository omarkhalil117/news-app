export const validEmail = (email) => {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
};

export const validPassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)
}

export const validFullName = (name) => {
    return /^[A-Za-z]{1,19}\s[A-Za-z]{1,19}$/.test(name);
}
