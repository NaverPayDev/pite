const parseJson = (json) => {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
};
export {
  parseJson as default
};
