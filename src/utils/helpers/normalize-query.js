export default (query) => {
  // Convert numeric strings to numbers and "true"/"false" to booleans
  return Object.fromEntries(
    Object.entries(query).map(([key, value]) => [
      key,
      value === 'true'
        ? true
        : value === 'false'
        ? false
        : !isNaN(value)
        ? Number(value)
        : value,
    ])
  );
};
