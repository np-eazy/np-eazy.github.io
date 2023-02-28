const mappedComponents = {}

export const registerComponent = (id, component) => {
  // add optional checks
  mappedComponents[id] = component;
}

export const getComponentById = id => {
  // add optional checks
  if(id) {
    return mappedComponents[id] || null
  }
  return null;
}

export const parseJsonProps = JsonProps => {
  try {
    return JSON.parse(JsonProps);
  } catch {
    return {};
  }
}