import { resetChanges } from './sequences.js';

// Modal UI behavior

let modalResolver = null;

export function openNamingModal() {
    const overlay = document.getElementById("sequence-overlay");
    const seqName = document.getElementById("seq-name");

    seqName.value = "";
    overlay.classList.remove("modal-hidden");
    seqName.focus();

    // create a promise so initSave waits
    return new Promise((resolve) => {
        modalResolver = resolve;
    });
}

export function initOpenModal() {
    const overlay = document.getElementById("sequence-overlay");
    const closeBtn = document.getElementById("sequence-close-btn");
    const sequenceInitBtn = document.getElementById("sequence-init-btn");
    const seqName = document.getElementById("seq-name");

    // cancel button
    closeBtn.addEventListener("click", () => {
        overlay.classList.add("modal-hidden");
        if (modalResolver) {
            modalResolver(false);
        }
    });

    // confirm button
    sequenceInitBtn.addEventListener("click", function () {
        const name = seqName.value.trim() || "Untitled Sequence";

        // logic for creating the new option
        const sequences = document.getElementById("sequences");
        const newSeq = document.createElement("option");
        newSeq.value = "";
        newSeq.innerHTML = name;
        newSeq.selected = true;
        sequences.appendChild(newSeq);

        overlay.classList.add("modal-hidden");
        if (modalResolver) {
            modalResolver(name);
        }
    });
}

export function openSaveModal(id) {
    // initiate the new sequence modal
    const overlay = document.getElementById("save-overlay");
    const noBtn = document.getElementById("sequence-nosave-btn");
    const yesBtn = document.getElementById("sequence-save-btn");

    function openModal() {
        overlay.classList.remove("modal-hidden");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        overlay.classList.add("modal-hidden");
        document.body.style.overflow = "auto";
        resetChanges();
    }

    // close when clicking either button in the modal
    noBtn.addEventListener("click", closeModal);
    yesBtn.addEventListener("click", async function () {
        // await saveSequence(); // *** figure these out
        // await getSequence(id);
        closeModal();
    });

    openModal();
}
