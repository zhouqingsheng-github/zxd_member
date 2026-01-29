// 定位服务工具类
import {gaodeKey} from "../common/api";

let locationPromise = null;

export const getLocation = () => {
    // 如果已经有正在进行的定位请求，直接返回该请求的Promise
    if (locationPromise) {
        return locationPromise;
    }

    // 创建新的定位请求
    locationPromise = new Promise((resolve, reject) => {
        // 先检查权限
        uni.getSetting({
            success: (res) => {
                if (!res.authSetting['scope.userLocation']) {
                    // 如果没有权限，提示用户授权
                    uni.authorize({
                        scope: 'scope.userLocation',
                        success: () => {
                            doGetLocation(resolve, reject);
                        },
                        fail: (err) => {
                            console.error('授权失败：', err);
                            uni.showModal({
                                title: '提示',
                                content: '需要获取您的位置权限，是否去设置？',
                                success: (modalRes) => {
                                    if (modalRes.confirm) {
                                        uni.openSetting();
                                    }
                                    reject(err);
                                }
                            });
                        }
                    });
                } else {
                    doGetLocation(resolve, reject);
                }
            },
            fail: (err) => {
                console.error('获取设置失败：', err);
                reject(err);
            }
        });
    });

    // 定位完成后清除Promise
    locationPromise.finally(() => {
        locationPromise = null;
    });

    return locationPromise;
};

// 执行定位
const doGetLocation = (resolve, reject) => {
    uni.getLocation({
        type: 'gcj02',
        isHighAccuracy: true,
        success: async (res) => {
            const key =await gaodeKey()
            // 使用高德地图逆地理编码服务
            uni.request({
                url: 'https://restapi.amap.com/v3/geocode/regeo',
                data: {
                    key: key,
                    location: `${res.longitude},${res.latitude}`,
                    extensions: 'all',
                    output: 'json'
                },
                success: (result) => {
                    if (result.data.status === '1') {
                        const addressComponent = result.data.regeocode.addressComponent;

                        // 处理城市信息
                        let city = addressComponent.city || addressComponent.province || '';
                        if (Array.isArray(city)) city = city[0];
                        city = city || '';
                        if (typeof city === 'string' && (city.endsWith('市') || city.endsWith('州'))) {
                            // city 保持不变
                        } else if (addressComponent.province) {
                            city = addressComponent.province;
                        }
                        // 格式化城市显示名称
                        let displayCity = city;
                        // 处理区信息
                        let district = addressComponent.district || '';
                        if (Array.isArray(district)) district = district[0];
                        district = district || '';

                        resolve({
                            city: displayCity || '定位失败',
                            district: district,
                            address: result.data.regeocode.formatted_address,
                            longitude: res.longitude,
                            latitude: res.latitude,
                            pois: result.data.regeocode.pois
                        });
                    } else {
                        reject(new Error('获取地址信息失败'));
                    }
                },
                fail: (err) => {
                    console.error('逆地理编码失败：', err);
                    reject(err);
                }
            });
        },
        fail: (err) => {
            console.error('获取位置失败：', err);
            reject(err);
        }
    });
}; 