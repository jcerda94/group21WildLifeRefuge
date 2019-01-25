export const addListenerFor = ({ key, action, capiModel }) => {
  capiModel.on(`change:${key}`, action);
};
