// epiphron-web
// Devon McKee, 2024

const delay = ms => new Promise(res => setTimeout(res, ms));

async function cpuAtomicTest(contention=1, padding=1) {
    console.log(`Testing CPU atomics with contention ${contention} and padding ${padding}...`);
    
    // Setup SharedArrayBuffer for atomics
    let bufLen = Uint32Array.BYTES_PER_ELEMENT * Math.ceil(navigator.hardwareConcurrency * padding / contention);
    const buffer = new SharedArrayBuffer(bufLen);
    const bufArray = new Uint32Array(buffer);
    for (let i = 0; i < bufArray.length; i++) {
        Atomics.store(bufArray, i, 0);
    }
    //console.log(bufArray);

    // Initialize workers
    const cpuWorkers = [];
    for (let i = 0; i < navigator.hardwareConcurrency; i++) {
        cpuWorkers.push(new Worker('cpuWorker.js'));
    }

    // Start timer and workers
    let start_time = performance.now();
    for (let i = 0; i < navigator.hardwareConcurrency; i++) {
        cpuWorkers[i].postMessage({buffer : buffer, i : Math.floor(i / contention * padding)});
    }
    
    await delay(3000);

    // End workers
    cpuWorkers.forEach((w) => w.terminate());
    let end_time = performance.now();
    let test_time = end_time - start_time;
    console.log(`Workers terminated after ${test_time} ms.`);

    let res = 0;
    for (let i = 0; i < bufArray.length; i++) {
        res += Atomics.load(bufArray, i);
    }
    console.log(`Performed ${res} operations.`);
    console.log(`Throughput: ${res / test_time / 1000} atomic ops/microsecond`);
    return res / test_time / 1000;
}

async function cpuAtomicSweep(contention = 8, padding = 8) {
    console.log(`Detected ${navigator.hardwareConcurrency} logical cores...`);
    console.log(`Sweeping through CPU atomics with contention from 1-${contention} and padding from 1-${padding}`);
    $('#heatmap-progress').css('display', 'block');
    $('#heatmap-progress').prop('value', 0);
    $('#heatmap-progress').prop('max', (Math.log2(contention) + 1) * (Math.log2(padding) + 1));
    let x = [];
    let y = [];
    let z = [];
    for (let c = 1; c <= contention; c *= 2) x.push(c);

    let layout = {
        //title: 'CPU Atomic Results',
        xaxis: { type : 'category', title: 'Contention' },
        yaxis: { type : 'category', title : 'Padding' },
        annotations : []
    };
    let test_num = 0;
    for (let p = 1; p <= padding; p *= 2) {
        y.push(p);
        let row = [];
        for (let c = 1; c <= contention; c *= 2) {
            let res = await cpuAtomicTest(c, p);
            row.push(res);
            layout.annotations.push({ 
                x : Math.log2(c), y : Math.log2(p), 
                text : parseFloat(res).toFixed(2), 
                font : {
                    color: 'white',
                },
                showarrow: false,
                bgcolor: 'black'
            });
            test_num++;
            $('#heatmap-progress').prop('value', test_num);
        }
        z.push(row);
    }
    Plotly.newPlot('cpu-heatmap', [{
        x : x,
        y : y,
        z : z,
        type : 'heatmap',
        colorscale : 'Viridis',
        colorbar : {title : { text : 'Atomic Operations per Microsecond', side : 'right'}}
    }], layout);
}

async function initializeGPU() {
    if (!navigator.gpu) throw Error("WebGPU not supported.");

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) throw Error("Couldn't request WebGPU adapter.");

    const device = await adapter.requestDevice();
    if (!device) throw Error("Couldn't request WebGPU device.");
    
    return { adapter, device };
}

async function gpuAtomicTest(contention=1, padding=1) {

}

async function gpuAtomicSweep(contention=1, padding=1) {
    console.log(`Sweeping through GPU atomics with contention from 1-${contention} and padding from 1-${padding}`);
    let adapter, device;
    try {
        ({ adapter, device } = await initializeGPU());
    } catch (e) {
        alert('Error initializing WebGPU - check console for more info.');
        console.error(e);
        return;
    }
    
}

document.addEventListener('DOMContentLoaded', async () => {
    //await cpuAtomicSweep(navigator.hardwareConcurrency, 16);
    //await gpuAtomicSweep(16, 16);
    $('#start-tests').on('click', async () => {
        $('#start-tests').prop('disabled', true);
        $('#num-threads').text(`Detected ${navigator.hardwareConcurrency} logical threads on CPU.`);
        $('#cpu-baseline').text(`${parseFloat((await cpuAtomicTest(1, 1)).toFixed(2))} atomic ops/microsecond`);
        $('#cpu-contention').text(`${parseFloat((await cpuAtomicTest(2, 1)).toFixed(2))} atomic ops/microsecond`);
        $('#cpu-padding').text(`${parseFloat((await cpuAtomicTest(1, 16)).toFixed(2))} atomic ops/microsecond`);
        await cpuAtomicSweep(navigator.hardwareConcurrency, 16);
    });
});

