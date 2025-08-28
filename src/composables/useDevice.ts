import { throttle } from '@/utils';
import { ref, computed, onMounted, onUnmounted } from 'vue';

export const useDevice = () => {
  try {
    const deviceDimension = ref({
      isMobile: false,
      isTablet: false,
      isLaptop: true,
      screenHeight: 0,
      screenWidth: 0,
      orientation: 'portrait' as 'portrait' | 'landscape',
      isLandscape: false,
      isPortrait: true,
      currentDevice: '',
    });

    const setDeviceType = (size: number) => {
      deviceDimension.value.isMobile = size < 744;
      deviceDimension.value.isTablet = size < 1279 && size > 1034;
      deviceDimension.value.isLaptop = size >= 1279;
    };

    const updateDeviceType = () => {
      try {
        if (typeof window === 'undefined') return; // SSR guard
        deviceDimension.value.screenWidth = window.innerWidth;
        deviceDimension.value.screenHeight = window.innerHeight;

        // Определение ориентации
        if (deviceDimension.value.screenWidth > deviceDimension.value.screenHeight) {
          deviceDimension.value.isLandscape = true;
          deviceDimension.value.isPortrait = false;
          deviceDimension.value.orientation = 'landscape';
        } else {
          deviceDimension.value.isPortrait = true;
          deviceDimension.value.isLandscape = false;
          deviceDimension.value.orientation = 'portrait';
        }
        setDeviceType(deviceDimension.value.screenWidth);

        // Определение текущего устройства
        deviceDimension.value.currentDevice = deviceDimension.value.isMobile
          ? 'mobile'
          : deviceDimension.value.isTablet
            ? 'tablet'
            : deviceDimension.value.isLaptop
              ? 'laptop'
              : 'desktop';
      } catch (error) {
        console.error(error);
      }
    };

    const throttleUpdate = throttle(updateDeviceType, 100);

    onMounted(() => {
      updateDeviceType();
      if (typeof window !== 'undefined') {
        window.addEventListener('resize', throttleUpdate);
        window.addEventListener('orientationchange', throttleUpdate);
      }
    });

    onUnmounted(() => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', throttleUpdate);
        window.removeEventListener('orientationchange', throttleUpdate);
      }
    });

    const setInitialDeviceType = (type: 'isMobile' | 'isTablet' | 'isLaptop' | 'isLandscape' | 'isPortrait') => {
      if (type === 'isMobile' || type === 'isTablet' || type === 'isLaptop') {
        deviceDimension.value.isMobile = false;
        deviceDimension.value.isTablet = false;
        deviceDimension.value.isLaptop = false;
        deviceDimension.value[type] = true;
        deviceDimension.value.currentDevice =
          type === 'isMobile' ? 'mobile' : type === 'isTablet' ? 'tablet' : type === 'isLaptop' ? 'laptop' : 'desktop';
      } else {
        deviceDimension.value.isLandscape = type === 'isLandscape';
        deviceDimension.value.isPortrait = type === 'isPortrait';
        deviceDimension.value.orientation = type === 'isLandscape' ? 'landscape' : 'portrait';
      }
    };

    return {
      isMobile: computed(() => deviceDimension.value.isMobile),
      isTablet: computed(() => deviceDimension.value.isTablet),
      isLaptop: computed(() => deviceDimension.value.isLaptop),
      orientation: computed(() => deviceDimension.value.orientation),
      isLandscape: computed(() => deviceDimension.value.isLandscape),
      isPortrait: computed(() => deviceDimension.value.isPortrait),
      screenWidth: computed(() => deviceDimension.value.screenWidth),
      screenHeight: computed(() => deviceDimension.value.screenHeight),
      currentDevice: computed(() => deviceDimension.value.currentDevice),
      updateDeviceType,
      throttleUpdate,
      setInitialDeviceType,
    };
  } catch (error) {
    console.error(error);
  }
};
