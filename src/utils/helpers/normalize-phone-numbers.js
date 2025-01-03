const normalizePhoneNumber = (phoneNumber) => {
  // Remove any non-digit characters and leading plus sign
  return phoneNumber.replace(/^\+/, '').replace(/\D/g, '');
};

export default normalizePhoneNumber;
