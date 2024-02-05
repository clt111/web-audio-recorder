import { createWavFile } from "../transform"


enum MessageType {
    suspend,
    continue,
    stop,
    result,
}

export default class Recorder {
    context: AudioContext   // 音频上下文
    recorder: AudioWorkletNode // 音频录制节点
    isNeedRecorder: Boolean = false // 是否需要录制
    inputAudioStream: MediaStream // 输入的音频流
    audioInput: MediaStreamAudioSourceNode // 输入的音频节点
    resultRecorderData: any // 录制拿到的音频数据
    littleEdian: boolean

    // 初始化音频上下文和参数
    constructor() {
        this.context = new AudioContext();
    }

    //  创造录音环境
    private _initRecorder = async () => {
        // 先清空可能遗留的数据
        this.resultRecorderData = null;
        this.isNeedRecorder = true;
        this.context = new AudioContext();
        // 加入processor模块
        await this.context.audioWorklet.addModule("./processor.js");
        this.recorder = new AudioWorkletNode(this.context, "recorder-processor", {
            processorOptions: {
              // 这里将isNeedRecoreder传过去了
              isNeedRecorder: this.isNeedRecorder,
            },
        });
        
        // 然后开始订阅消息， 这里主要是为了停止的时候能够拿到数据
        this.recorder.port.onmessage = (e) => {
            if (e.data.type === MessageType.result) {
                console.log(e.data.data);
                this.resultRecorderData = e.data.data;
            }
        };
    }

     // 终止
    private stopStream = () => {
        if (this.inputAudioStream && this.inputAudioStream.getTracks) {
            this.inputAudioStream.getTracks().forEach((track) => track.stop());
        }
    }

    private _portMessageToProcessor = <T>(type: MessageType, value: T) => {
        if (!this.recorder) {
            throw Error('录制失败， 内部出现了错误， 请重试');
        }
        this.recorder.port.postMessage({
            type,
            value,
        })
    }

    // 开始录音
    public startRecord = async () => {
        await this._initRecorder();
        // 通过用户权限拿到音频流, 不捕获错误， 直接抛给外面
        this.inputAudioStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });
        // 实例化MediaStreamSourceNode拿到作为音源Audio Node
        this.audioInput = this.context.createMediaStreamSource(this.inputAudioStream);
        // 然后连接起来
        this.audioInput.connect(this.recorder);
        // 连接到终点
        this.recorder.connect(this.context.destination);
    }

    // 暂停和继续都只通过字段去处理，然后传递给processor让其停止/开始收集，其他状态都不改变
    public suspendRecord = async () => {
        this.isNeedRecorder = false;
        this._portMessageToProcessor<Boolean>(MessageType.suspend, false);
    }
    public continueRecord = async () => {
        this.isNeedRecorder = true;
        this._portMessageToProcessor<Boolean>(MessageType.continue, true);
    }

    // 停止录音
    public stopRecord() {
        this.stopStream(); // 先将录音标识取消了
        this.isNeedRecorder = false
        this._portMessageToProcessor<Boolean>(MessageType.stop, false);
    }

    public getWavData() {
        if (this.isNeedRecorder === true) {
            this.stopRecord();
        } 
        const wavData = createWavFile(this.resultRecorderData);
        return wavData;
    }

    public getWavDataBlob() {
        const wavData = this.getWavData();
        const blobData = new Blob( [wavData], { type: "audio/wav" });
        return blobData;
    }

    public play() {
        const blobData = this.getWavDataBlob();
        const audio = new Audio();
        audio.src = URL.createObjectURL(blobData);
        audio.play();
    }
}

