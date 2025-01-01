// 全局变量存储token
let globalToken = '';

// 发送验证码请求
async function sendPostRequest() {
    const phone = document.getElementById('phoneInput').value;
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    const uploadStatus = document.getElementById('uploadStatus');

    // 验证手机号
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
        uploadStatus.innerHTML = '<span class="status-error">请输入正确的手机号</span>';
        return;
    }

    try {
        sendCodeBtn.disabled = true;
        let countdown = 60;
        
        // 倒计时
        const timer = setInterval(() => {
            sendCodeBtn.textContent = `重新发送(${countdown}s)`;
            countdown--;
            if (countdown < 0) {
                clearInterval(timer);
                sendCodeBtn.disabled = false;
                sendCodeBtn.textContent = '发送验证码';
            }
        }, 1000);

        // 发送验证码请求
        const response = await axios.post('http://localhost:3000/api/login/mobile/captcha', {
            mobile: phone
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (response.data.code === 200) {
            uploadStatus.innerHTML = '<span class="status-success">验证码已发送</span>';
        } else {
            throw new Error(response.data.msg || '发送失败');
        }

    } catch (error) {
        uploadStatus.innerHTML = `<span class="status-error">发送失败: ${error.message}</span>`;
        sendCodeBtn.disabled = false;
        sendCodeBtn.textContent = '发送验证码';
    }
}

// 验证登录
async function verifyCode() {
    const phone = document.getElementById('phoneInput').value;
    const code = document.getElementById('verifyInput').value;
    const uploadStatus = document.getElementById('uploadStatus');
    const responseDisplay = document.getElementById('responseDisplay');

    // 验证输入
    if (!phone || !code) {
        uploadStatus.innerHTML = '<span class="status-error">请输入手机号和验证码</span>';
        return;
    }

    try {
        // 登录请求
        const response = await axios.post('http://localhost:3000/api/login/mobile', {
            mobile: phone,
            captcha: code
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (response.data.code === 200) {
            globalToken = response.data.data.token;
            responseDisplay.textContent = globalToken;
            uploadStatus.innerHTML = '<span class="status-success">登录成功</span>';
        } else {
            throw new Error(response.data.msg || '登录失败');
        }

    } catch (error) {
        uploadStatus.innerHTML = `<span class="status-error">登录失败: ${error.message}</span>`;
        responseDisplay.textContent = '';
    }
}

// 复制Token
function copy() {
    const uploadStatus = document.getElementById('uploadStatus');
    
    if (!globalToken) {
        uploadStatus.innerHTML = '<span class="status-warning">没有可复制的Token</span>';
        return;
    }

    // 创建临时输入框复制内容
    const tempInput = document.createElement('input');
    tempInput.value = globalToken;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);

    uploadStatus.innerHTML = '<span class="status-success">Token已复制到剪贴板</span>';
}

// 辅助函数：显示状态信息
function showStatus(message, type = 'error') {
    const uploadStatus = document.getElementById('uploadStatus');
    uploadStatus.innerHTML = `<span class="status-${type}">${message}</span>`;
} 