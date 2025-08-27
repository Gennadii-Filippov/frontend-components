import { ref } from 'vue';

const _data = ref<Record<string, any>>({});

const useGlobal = () => {
  const get = (key: string) => {
    return _data.value[key];
  };

  const set = (key: string, value: any) => {
    _data.value[key] = value;
  };

  return {
    get,
    set,
  };
};
export default useGlobal;
