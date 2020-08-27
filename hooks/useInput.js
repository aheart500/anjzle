import { useState, useCallback } from "react";

const useInput = (initial) => {
  const [value, setValue] = useState(initial);

  const onChangeText = useCallback((t) => setValue(t), []);
  return { value, onChangeText };
};
export default useInput;
