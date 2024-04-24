import parsePhoneNumber from 'libphonenumber-js';

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
};

export const formatPhone = (number) => {
    return parsePhoneNumber(number).format('INTERNATIONAL');
};

export const formatDuration = (duration) => {
    if (duration === null) {
        return 'N/A';
    }
    const minutes = Math.floor(duration / 60);
    const seconds = Math.round(duration % 60);

    return `${minutes} min ${seconds} sec`;
};
