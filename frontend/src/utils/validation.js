// filepath: c:\Users\Sadeeq\Documents\Projects\EventManager\frontend\src\utils\validation.js
export const validateField = (name, value, formData, passwordRequirements) => {
    const errors = {};
    const errorMessages = {};
    const newPasswordReqs = { ...passwordRequirements };
    let isValid = true;

    switch (name) {
        case 'full_name':
            errors.full_name = value.trim() === '';
            errorMessages.full_name = value.trim() === '' ? 'Full name is required' : '';
            isValid = !errors.full_name;
            break;

        case 'username':
            errors.username = value.trim() === '';
            errorMessages.username = value.trim() === '' ? 'Username is required' : '';
            isValid = !errors.username;
            break;

        case 'email':
            const emailValid = /\S+@\S+\.\S+/.test(value);
            errors.email = !emailValid;
            errorMessages.email = emailValid ? '' : 'Invalid email address';
            isValid = emailValid;
            break;

        case 'password':
            newPasswordReqs.length = value.length >= 8;
            newPasswordReqs.uppercase = /[A-Z]/.test(value);
            newPasswordReqs.alphanum = /[A-Za-z]/.test(value) && /\d/.test(value);
            newPasswordReqs.specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

            const passwordValid = Object.values(newPasswordReqs).every(Boolean);
            errors.password = !passwordValid;
            errorMessages.password = passwordValid ? '' : 'Password does not meet requirements';
            isValid = passwordValid;
            break;

        case 'confirmPassword':
            const passwordsMatch = value === formData.password;
            errors.confirmPassword = !passwordsMatch;
            errorMessages.confirmPassword = passwordsMatch ? '' : 'Passwords do not match';
            isValid = passwordsMatch;
            break;

        default:
            break;
    }

    return { errors, errorMessages, newPasswordReqs, isValid };
};

export const validateAllFields = (formData, passwordRequirements) => {
    const fieldNames = ['full_name', 'username', 'email', 'password', 'confirmPassword'];
    let isFormValid = true;

    fieldNames.forEach(name => {
        const { isValid } = validateField(name, formData[name], formData, passwordRequirements);
        if (!isValid) isFormValid = false;
    });

    return isFormValid;
};