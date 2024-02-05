## 介绍
基于AudioWorkletNode实现的录音功能， 用户可录制语音拿到WAV数据
实现文章可见 https://juejin.cn/post/7310787455112413219
## 安装

npm i web-audio-recorder

## 使用

const recorder = new Recorder();

#### 开始录音

```js
	recorder.startRecord();
```
#### 暂停录音
```js
    recorder.suspendRecord();
```
#### 继续录音
```js
    recorder.continueRecord();
```
#### 结束录音
```js
    recorder.stopRecord();
```
#### 获得WAV数据
```js
    recorder.getWavData();
```
#### 获得WAV BLob数据
```js
    recorder.getWavDataBlob();
```

#### 播放录音
```js
    recorder.play();
```
