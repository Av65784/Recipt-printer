document.addEventListener('DOMContentLoaded', () => {
    let printedCount = 0;
    let crumpledCount = 0;
    let jarHeight = 0;

    const taskInput = document.getElementById('taskInput');
    const printBtn = document.getElementById('printBtn');
    const printer = document.getElementById('printer');
    const jarFill = document.getElementById('jarFill');
    const printedEl = document.getElementById('printedCount');
    const crumpledEl = document.getElementById('crumpledCount');
    const resetBtn = document.getElementById('resetBtn');
    const columns = document.querySelectorAll('.column');

    // 1. Print Logic
    function printReceipt() {
        const text = taskInput.value.trim();
        if (!text) return;

        taskInput.value = '';
        printer.classList.add('printing');

        setTimeout(() => {
            const receipt = createReceipt(text);
            document.querySelector('.column[data-col="0"]').appendChild(receipt);
            
            printedCount++;
            printedEl.textContent = printedCount;
            printer.classList.remove('printing');
        }, 2000);
    }

    function createReceipt(text) {
        const div = document.createElement('div');
        div.className = 'receipt';
        div.draggable = true;
        div.id = `receipt-${Date.now()}`;
        div.innerHTML = `<b>TASK RECEIPT</b><hr>${text.replace(/\n/g, '<br>')}`;
        
        div.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', div.id);
        });

        return div;
    }

    // 2. Drag and Drop Logic
    columns.forEach(col => {
        col.addEventListener('dragover', (e) => e.preventDefault());
        col.addEventListener('drop', (e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData('text/plain');
            const receipt = document.getElementById(id);
            
            if (receipt) {
                col.appendChild(receipt);
                if (col.dataset.col === "3" && !receipt.classList.contains('completed')) {
                    receipt.classList.add('completed');
                    crumpledCount++;
                    jarHeight = Math.min(100, jarHeight + 20);
                    crumpledEl.textContent = crumpledCount;
                    jarFill.style.height = `${jarHeight}%`;
                }
            }
        });
    });

    // 3. Event Listeners
    printBtn.addEventListener('click', printReceipt);
    
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) printReceipt();
    });

    resetBtn.addEventListener('click', () => {
        document.querySelectorAll('.receipt').forEach(r => r.remove());
        printedCount = crumpledCount = jarHeight = 0;
        printedEl.textContent = 0;
        crumpledEl.textContent = 0;
        jarFill.style.height = '0%';
    });
});
