class RecorderProcessor extends AudioWorkletProcessor {
    constructor(options) {
        super(options);
        this.isNeedProcess = options.processorOptions.isNeedRecorder;
        this.stopProcess = true;
        this.LBuffer = [];
        this.RBuffer = [];
        this.port.onmessage = (e) => {
            const data = e.data;
            switch (data.type) {
                case 0:
                case 1:
                    this.isNeedProcess = data.value;
                    break;
                case 2:
                    this.stopProcess = false;
                    this.isNeedProcess = data.value;
                    const leftData = this.flatArray(this.LBuffer);
                    const rightData = this.flatArray(this.RBuffer);
                    
                    this.port.postMessage({
                        type: 3,
                        data: this.interleaveLeftAndRight(leftData, rightData)
                    })
                default:
                    // nothing
            }
        }
    }
    // 二维转一维
    flatArray(list) {
        // 拿到总长度
        const length = list.length * list[0].length;
        const data = new Float32Array(length);
        let offset = 0;
        for(let i = 0; i < list.length; i++) {
            data.set(list[i], offset);
            offset += list[i].length;
        }
        return data
    }
    // 交叉合并左右数据
    interleaveLeftAndRight(left, right) {
        const length = left.length + right.length;
        const data = new Float32Array(length);
        for (let i = 0; i < left.length; i++) {
            const k = i * 2;
            data[k] = left[i];
            data[k + 1] = right[i]; 
        }
        return data;
    }
    process(inputs) {
        // 不在录制状态的时候， 就算有输入源也不处理
        if (!this.isNeedProcess && this.stopProcess) {
            return true;
        }
        const inputList = inputs[0];
        if (inputList && inputList[0]) {
            const lData = new Float32Array(inputList[0]);
            this.LBuffer.push(lData);
        }
        if (inputList && inputList[1]) {
            const rData = new Float32Array(inputList[1]);
            this.RBuffer.push(rData);
        }
        return this.stopProcess;
    }
}

registerProcessor('recorder-processor', RecorderProcessor)