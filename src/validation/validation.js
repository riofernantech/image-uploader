import ValidationException from '../exception/validationException.js';

const validate = (schema, request) => {
    const result = schema.validate(request, {
        abortEarly: false,
        allowUnknown: false
    })
    if (result.error) {
        throw new ValidationException(result.error.message);
    } else {
        return result.value;
    }
}

export default validate