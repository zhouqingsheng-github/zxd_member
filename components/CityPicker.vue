<template>
  <view v-if="show" class="city-picker-mask">
    <view class="city-picker-full">
      <view class="city-picker-body">
        <!-- 左侧省份 -->
        <scroll-view scroll-y class="province-list">
          <view
              v-for="(province, idx) in cityList"
              :key="province.adcode"
              :class="['province-item', idx === activeProvinceIndex ? 'active' : '']"
              @click="scrollToProvince(idx)"
          >
            {{ province.name }}
          </view>
        </scroll-view>
        <!-- 右侧城市 -->
        <scroll-view
            scroll-y
            class="city-list-area"
            :scroll-into-view="scrollTarget"
            @scroll="onCityScroll"
        >
          <view
              v-for="(province, idx) in filteredCityList"
              :key="province.adcode"
              :id="'province-' + idx"
              class="province-section"
          >
            <text class="section-title">{{ province.name }}</text>
            <view class="city-list">
              <text
                  v-for="city in province.cities"
                  :key="city.adcode"
                  class="city-item"
                  @click="selectCity(city)"
              >
                {{ formatCityDisplayName(city) }}
              </text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
import {gaodeKey} from "@/common/api";
export default {
  name: "CityPicker",
  props: {
    show: {type: Boolean, default: false},
    currentLocation: {
      type: String,
      default: ''
    },
    search: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      cityList: [],
      hotCities: [],
      activeProvinceIndex: 0,
      scrollTarget: ''
    }
  },
  computed: {
    filteredCityList() {
      if (!this.search) return this.cityList;
      // 只保留包含搜索词的城市，保留省份结构
      return this.cityList.map(province => {
        const filteredCities = province.cities.filter(city => {
          const displayName = this.formatCityDisplayName(city);
          return city.name.includes(this.search) || displayName.includes(this.search);
        });
        return {
          ...province,
          cities: filteredCities
        };
      }).filter(province => province.cities.length > 0);
    }
  },
  methods: {
    async fetchCityData() {
      const key =await gaodeKey()
      const res = await uni.request({
        url: `https://restapi.amap.com/v3/config/district?key=${key}&keywords=中国&subdistrict=2&extensions=base`
      });
      if (res[1].statusCode === 200 && res[1].data.status === '1') {
        let provinces = res[1].data.districts[0].districts;
        // 按 北、上、广（深） 排序
        const priorityProvinces = ['北京市', '上海市', '广东省'];
        provinces.sort((a, b) => {
          const aIndex = priorityProvinces.indexOf(a.name);
          const bIndex = priorityProvinces.indexOf(b.name);
          if (aIndex > -1 && bIndex > -1) return aIndex - bIndex;
          if (aIndex > -1) return -1;
          if (bIndex > -1) return 1;
          return 0;
        });
        this.cityList = provinces.map(province => {
          let cities = province.districts.map(city => ({
            name: city.name,
            adcode: city.adcode,
            province: province.name,
            center: city.center
          }));
          // 如果是广东省，把深圳市和广州市排到最前面
          if (province.name === '广东省') {
            const szIndex = cities.findIndex(c => c.name === '深圳市');
            const gzIndex = cities.findIndex(c => c.name === '广州市');
            let sz, gz;
            if (gzIndex > -1) {
              gz = cities.splice(gzIndex, 1)[0];
            }
            if (szIndex > -1) {
              // 注意：如果广州市已被移除，深圳市索引会前移1
              sz = cities.splice(szIndex > gzIndex ? szIndex - 1 : szIndex, 1)[0];
            }
            // 先插入广州市再插入深圳市，顺序为：深圳市、广州市、其他
            const newCities = [];
            if (sz) newCities.push(sz);
            if (gz) newCities.push(gz);
            cities = [...newCities, ...cities];
          }
          return {
            name: province.name,
            adcode: province.adcode,
            cities
          };
        });
        this.hotCities = [
          {name: '北京', adcode: '110000', province: '北京市'},
          {name: '上海', adcode: '310000', province: '上海市'},
          {name: '广州', adcode: '440100', province: '广东省'},
          {name: '深圳', adcode: '440300', province: '广东省'},
          {name: '杭州', adcode: '330100', province: '浙江省'},
          {name: '成都', adcode: '510100', province: '四川省'},
          {name: '重庆', adcode: '500000', province: '重庆市'},
          {name: '西安', adcode: '610100', province: '陕西省'}
        ];
      }
    },
    selectCity(city) {
      let longitude = '';
      let latitude = '';
      if (city.center) {
        const arr = city.center.split(',');
        longitude = arr[0];
        latitude = arr[1];
      }
      const cityWithProvince = {
        ...city,
        displayName: this.formatCityDisplayName(city),
        longitude,
        latitude
      };
      this.$emit('select', cityWithProvince);
      this.close();
    },
    formatCityDisplayName(city) {
      // 对于直辖市的"城区"条目，使用省份名（如"北京市"）作为显示名，
      // 同时保留原始城市名（如"北京城区"）用于后端交互。
      if (['北京城区', '上海城区', '天津城区', '重庆城区'].includes(city.name)) {
        return city.province;
      }
      // 其他城市直接返回城市名
      return city.name;
    },
    close() {
      this.$emit('close');
    },
    scrollToProvince(idx) {
      this.activeProvinceIndex = idx;
      this.scrollTarget = 'province-' + idx;
    },
    onCityScroll(e) {
      // 可选：根据滚动位置动态高亮左侧省份
      // 需要用uni.createSelectorQuery获取各省份offsetTop
    },
    refreshLocation() {
      this.$emit('refreshLocation');
    }
  },
  mounted() {
    if (this.cityList.length === 0) {
      this.fetchCityData();
    }
  },
  watch: {
    show(val) {
      if (val && this.cityList.length === 0) {
        this.fetchCityData();
      }
    }
  }
}
</script>

<style scoped>
.city-picker-mask {
  background: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
}

.city-picker-full {
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.city-picker-header {
  height: 100rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32rpx;
  border-bottom: 1rpx solid #eee;
  font-size: 32rpx;
  font-weight: bold;
}

.close-btn {
  font-size: 40rpx;
  color: #999;
  cursor: pointer;
}

.city-picker-body {
  flex: 1;
  display: flex;
  height: 0;
}

.province-list {
  width: 160rpx;
  background: #f7f7f7;
  overflow-y: auto;
  padding-bottom: 88rpx;
}

.province-item {
  padding: 24rpx 0;
  text-align: center;
  color: #333;
  font-size: 28rpx;
  cursor: pointer;
}

.province-item.active {
  color: #ee781f;
  background: #fff;
  font-weight: bold;
}

.city-list-area {
  flex: 1;
  background: #fff;
  overflow-y: auto;
  padding: 0 24rpx 88rpx 24rpx;
}

.section-title {
  font-size: 28rpx;
  color: #333;
  margin: 32rpx 0 8rpx 0;
  font-weight: bold;
}

.city-list {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 16rpx;
}

.city-item {
  background: #f5f5f5;
  border-radius: 8rpx;
  padding: 12rpx 24rpx;
  margin: 8rpx 12rpx 8rpx 0;
  font-size: 26rpx;
  color: #333;
  cursor: pointer;
}

.city-item:active {
  background: #ee781f;
  color: #fff;
}
</style>