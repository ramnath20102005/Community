import { useState } from "react";

export const useForm = (initialValues = {}, validationRules = {}) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));

        // Validate field on blur if validation rules exist
        if (validationRules[name]) {
            const error = validationRules[name](values[name], values);
            if (error) {
                setErrors((prev) => ({
                    ...prev,
                    [name]: error,
                }));
            }
        }
    };

    const touchAll = () => {
        const fullTouched = {};
        Object.keys(values).forEach(key => fullTouched[key] = true);
        setTouched(fullTouched);
    };

    const validate = (markTouched = true) => {
        if (markTouched) touchAll();
        const newErrors = {};
        Object.keys(validationRules).forEach((field) => {
            const error = validationRules[field](values[field], values);
            if (error) {
                newErrors[field] = error;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (onSubmit) => async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const isValid = validate();
        if (!isValid) {
            setIsSubmitting(false);
            return;
        }

        try {
            await onSubmit(values);
        } catch (error) {
            console.error("Form submission error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const reset = () => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    };

    return {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        reset,
        setValues,
        setErrors,
        validate,
    };
};
