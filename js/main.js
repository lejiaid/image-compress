// 获取DOM元素
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.querySelector('.preview-container');
const originalImage = document.getElementById('originalImage');
const compressedImage = document.getElementById('compressedImage');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const downloadBtn = document.getElementById('downloadBtn');

// 文件上传处理
dropZone.addEventListener('click', () => {
    fileInput.click();
});

// 拖拽上传处理
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.style.borderColor = '#0071e3';
    dropZone.style.backgroundColor = '#f0f0f0';
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.style.borderColor = '#c7c7c7';
    dropZone.style.backgroundColor = 'white';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.style.borderColor = '#c7c7c7';
    dropZone.style.backgroundColor = 'white';
    
    const file = e.dataTransfer.files[0];
    handleFile(file);
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    handleFile(file);
});

// 处理上传的文件
function handleFile(file) {
    if (!file) return;
    
    if (!file.type.match(/image\/(png|jpeg|jpg)/i)) {
        alert('请上传PNG或JPG格式的图片！');
        return;
    }

    // 显示原始文件大小
    originalSize.textContent = formatFileSize(file.size);

    // 预览原图
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage.src = e.target.result;
        // 立即进行一次压缩
        compressImage(e.target.result);
        // 显示预览区域
        previewContainer.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// 压缩图片
function compressImage(base64) {
    const img = new Image();
    
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 设置画布尺寸为图片原始尺寸
        canvas.width = img.width;
        canvas.height = img.height;
        
        // 在画布上绘制图片
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        // 获取压缩质量
        const quality = qualitySlider.value / 100;
        
        // 进行压缩
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        
        // 显示压缩后的图片
        compressedImage.src = compressedBase64;
        
        // 计算并显示压缩后的文件大小
        const compressedBytes = Math.round((compressedBase64.length - 22) * 3 / 4);
        compressedSize.textContent = formatFileSize(compressedBytes);
    };

    img.src = base64;
}

// 质量滑块事件
qualitySlider.addEventListener('input', (e) => {
    qualityValue.textContent = e.target.value + '%';
    if (originalImage.src) {
        compressImage(originalImage.src);
    }
});

// 下载按钮事件
downloadBtn.addEventListener('click', () => {
    if (!compressedImage.src) {
        alert('请先上传图片！');
        return;
    }
    
    // 创建下载链接
    const link = document.createElement('a');
    const timestamp = new Date().getTime();
    link.download = `compressed_image_${timestamp}.jpg`;
    link.href = compressedImage.src;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 