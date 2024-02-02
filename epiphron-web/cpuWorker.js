self.addEventListener('message', (ev) => {
    let i = ev.data.i;
    let buffer = ev.data.buffer;
    let bufArray = new Uint32Array(buffer);
    //console.log(`Started worker on element ${i}`);
    while (true) { 
        Atomics.add(bufArray, i, 1); 
    }
});
