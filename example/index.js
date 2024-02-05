import Recorder from "../dist/main";
const recorder = new Recorder();
document.querySelector(".start").addEventListener("click", async () => {
    await recorder.startRecord();
    console.log("开始录音了");
});

document.querySelector(".stop").addEventListener('click', () => {
    recorder.suspendRecord();
    console.log('暂停录音');
})

document.querySelector('.continue').addEventListener('click', () => {
    recorder.continueRecord();
    console.log('继续录音');
})

document.querySelector(".end").addEventListener("click", () => {
    recorder.stopRecord();
    console.log("结束录音了");
});

document.querySelector(".get").addEventListener("click", () => {
    recorder.getWavDataBlob();
    console.log("获取数据");
});

document.querySelector('.play').addEventListener('click', () => {
    recorder.play();
})