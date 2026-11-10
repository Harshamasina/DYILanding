export type FieldErrors = Record<string, string[]>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmail(value: string): boolean {
    return EMAIL_RE.test(value.trim());
}

export function hasErrors(errors: FieldErrors): boolean {
    return Object.keys(errors).length > 0;
}

export interface ContactFormValues {
    name: string;
    email: string;
    company: string;
    role: string;
    portfolioSize: string;
    inquiryType: string;
    message: string;
}

export function validateContactForm(v: ContactFormValues): FieldErrors {
    const errors: FieldErrors = {};

    if (!v.name.trim()) {
        errors.full_name = ['Please enter your full name.'];
    } else if (v.name.trim().length < 2) {
        errors.full_name = ['Name must be at least 2 characters.'];
    }

    if (!v.email.trim()) {
        errors.work_email = ['Please enter your work email.'];
    } else if (!v.email.includes('@')) {
        errors.work_email = ['Include an @ in the email address, like jane@acmelaw.com.'];
    } else if (!isEmail(v.email)) {
        errors.work_email = ['Enter a valid email address.'];
    }

    if (!v.company.trim()) {
        errors.company = ['Please enter your company name.'];
    }

    if (!v.role) {
        errors.role = ['Please select your role.'];
    }

    if (!v.portfolioSize) {
        errors.portfolio_size = ['Please select your portfolio size.'];
    }

    if (!v.inquiryType) {
        errors.inquiry_type = ['Please choose an inquiry type.'];
    }

    if (!v.message.trim()) {
        errors.message = ['Please share a brief message.'];
    } else if (v.message.trim().length < 10) {
        errors.message = ['Message should be at least 10 characters.'];
    }

    return errors;
}
