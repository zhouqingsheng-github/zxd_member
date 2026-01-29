import config from './config';

/**
 * 统一的文件上传工具
 * 使用方式类似 http.post/http.get
 */
class Upload {
  constructor() {
    this.baseUrl = config.baseUrl || '';
  }

  /**
   * 上传单个文件
   * @param {String} filePath - 文件路径
   * @param {Object} options - 配置项
   * @param {String} options.url - 上传接口地址，默认 /hotel-file/file/upload
   * @param {String} options.name - 文件对应的 key，默认 file
   * @param {Object} options.formData - 额外的表单数据
   * @param {Function} options.onProgress - 上传进度回调
   * @returns {Promise}
   */
  uploadFile(filePath, options = {}) {
    const {
      url = '/hotel-file/upload',
      name = 'file',
      formData = {},
      onProgress
    } = options;

    return new Promise((resolve, reject) => {
      const uploadUrl = this.baseUrl + url;
      const token = uni.getStorageSync('token');

      console.log('开始上传文件:', {
        uploadUrl,
        filePath,
        hasToken: !!token
      });

      const uploadTask = uni.uploadFile({
        url: uploadUrl,
        filePath: filePath,
        name: name,
        formData: formData,
        header: {
          'Authorization': token
        },
        success: (res) => {
          console.log('上传响应:', res);
          try {
            // 检查 HTTP 状态码
            if (res.statusCode !== 200) {
              console.error('上传失败 - HTTP状态码:', res.statusCode);
              reject(new Error(`上传失败，状态码: ${res.statusCode}`));
              return;
            }

            const data = JSON.parse(res.data);
            console.log('解析后的数据:', data);
            
            if (data.code === '200') {
              // 返回完整的 data 对象，包含 name 和 url
              resolve(data.data);
            } else {
              console.error('上传失败 - 业务错误:', data);
              reject(new Error(data.msg || '上传失败'));
            }
          } catch (error) {
            console.error('解析响应数据失败:', error, res.data);
            reject(new Error('解析响应数据失败'));
          }
        },
        fail: (err) => {
          console.error('上传请求失败:', err);
          reject(new Error(err.errMsg || '网络请求失败'));
        }
      });

      // 监听上传进度
      if (onProgress && typeof onProgress === 'function') {
        uploadTask.onProgressUpdate((res) => {
          onProgress(res.progress);
        });
      }
    });
  }

  /**
   * 上传多个文件
   * @param {Array} filePaths - 文件路径数组
   * @param {Object} options - 配置项
   * @returns {Promise<Array>} 返回上传后的 URL 数组
   */
  uploadFiles(filePaths, options = {}) {
    const uploadPromises = filePaths.map(filePath => this.uploadFile(filePath, options));
    return Promise.all(uploadPromises);
  }

  /**
   * 选择并上传图片
   * @param {Object} options - 配置项
   * @param {Number} options.count - 最多可选择的图片数量，默认 9
   * @param {Array} options.sizeType - 图片压缩类型，默认 ['compressed']
   * @param {Array} options.sourceType - 图片来源，默认 ['album', 'camera']
   * @param {String} options.url - 上传接口地址
   * @param {Function} options.onProgress - 上传进度回调
   * @returns {Promise<Array>} 返回上传后的 URL 数组
   */
  chooseAndUploadImage(options = {}) {
    const {
      count = 9,
      sizeType = ['compressed'],
      sourceType = ['album', 'camera'],
      ...uploadOptions
    } = options;

    return new Promise((resolve, reject) => {
      uni.chooseImage({
        count,
        sizeType,
        sourceType,
        success: async (res) => {
          try {
            const urls = await this.uploadFiles(res.tempFilePaths, uploadOptions);
            resolve(urls);
          } catch (error) {
            reject(error);
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }

  /**
   * 选择并上传视频
   * @param {Object} options - 配置项
   * @param {Array} options.sourceType - 视频来源，默认 ['album', 'camera']
   * @param {Number} options.maxDuration - 最长拍摄时间，默认 60 秒
   * @param {String} options.url - 上传接口地址
   * @returns {Promise<String>} 返回上传后的 URL
   */
  chooseAndUploadVideo(options = {}) {
    const {
      sourceType = ['album', 'camera'],
      maxDuration = 60,
      ...uploadOptions
    } = options;

    return new Promise((resolve, reject) => {
      uni.chooseVideo({
        sourceType,
        maxDuration,
        success: async (res) => {
          try {
            const url = await this.uploadFile(res.tempFilePath, uploadOptions);
            resolve(url);
          } catch (error) {
            reject(error);
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }
}

// 创建实例
const upload = new Upload();

export default upload;
