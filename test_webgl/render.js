const fs = require('fs');
const { createCanvas } = require('canvas');
const gl = require('headless-gl');

// 创建一个离屏的 WebGL 上下文
const width = 800;
const height = 600;
const canvas = createCanvas(width, height);
const webglContext = gl(width, height);

// WebGL 渲染代码
function render() {
    // 清屏
    webglContext.clearColor(0.0, 0.0, 0.0, 1.0);
    webglContext.clear(webglContext.COLOR_BUFFER_BIT);

    // 这里可以添加更多的 WebGL 渲染代码

    // 读取像素数据
    const pixels = new Uint8Array(width * height * 4);
    webglContext.readPixels(0, 0, width, height, webglContext.RGBA, webglContext.UNSIGNED_BYTE, pixels);

    // 将像素数据写入 Canvas
    const imageData = canvas.createImageData(width, height);
    imageData.data.set(pixels);
    canvas.putImageData(imageData, 0, 0);

    // 保存为 PNG 文件
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`frame-${frameCount}.png`, buffer);
}

// 渲染多帧
const frameCount = 60; // 渲染 60 帧
for (let i = 0; i < frameCount; i++) {
    render();
}

// 使用 FFmpeg 合成视频
const { exec } = require('child_process');
exec('ffmpeg -framerate 30 -i frame-%d.png -c:v libx264 -pix_fmt yuv420p output.mp4', (err, stdout, stderr) => {
    if (err) {
        console.error(`Error: ${err}`);
        return;
    }
    console.log('Video created successfully!');
});
