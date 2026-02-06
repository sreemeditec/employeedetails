/**
 * Main JS for Sreemeditec Employee Portal
 * Features: GSAP Animations, ID Search, QR Generation, New Employee Registry, View Toggle
 */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { firebaseConfig } from "./env.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


document.addEventListener('DOMContentLoaded', () => {
    // 1. GSAP Entrance Animations
    if (typeof gsap !== 'undefined') {
        gsap.from('.employee-card', {
            duration: 0.8,
            y: 20,
            stagger: 0.1,
            ease: "power3.out"
        });

        gsap.from('.header-section', {
            duration: 1,
            y: -10,
            ease: "power4.out"
        });
    }

    // 2. View Toggle Logic
    const gridBtn = document.getElementById('gridViewBtn');
    const listBtn = document.getElementById('listViewBtn');
    const gridView = document.getElementById('directoryGrid');
    const listView = document.getElementById('directoryList');

    if (gridBtn && listBtn) {
        gridBtn.addEventListener('click', () => {
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
            gridView.style.display = 'grid';
            listView.style.display = 'none';
            gsap.from('.employee-card', { y: 10, stagger: 0.05 });
        });

        listBtn.addEventListener('click', () => {
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
            gridView.style.display = 'none';
            listView.style.display = 'flex';
            gsap.from('.list-item', { x: -10, stagger: 0.05 });
        });
    }

    // 3. ID Based Search Logic
    const searchInput = document.querySelector('#empSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.employee-card, .list-item');

            cards.forEach(card => {
                const empId = card.getAttribute('data-id') || "";
                if (empId.toLowerCase().includes(term)) {
                    card.style.display = card.classList.contains('employee-card') ? 'flex' : 'flex';
                    if (card.classList.contains('list-item') && listView.style.display === 'flex') {
                        card.style.display = 'flex';
                    } else if (card.classList.contains('employee-card') && gridView.style.display === 'grid') {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // 4. New Employee Modal Logic
    // 4. New Employee Modal Logic
    const openBtn = document.querySelector('#openModal');
    const closeBtn = document.querySelector('#closeModal');
    const modal = document.querySelector('#newEmpModal');
    const newEmpForm = document.querySelector('#newEmpForm');

    // Password Modal Elements
    const passwordModal = document.querySelector('#passwordModal');
    const passwordForm = document.querySelector('#passwordForm');
    const closePasswordBtn = document.querySelector('#closePasswordModal');

    // Step 1: Open Password Modal on Button Click
    if (openBtn && passwordModal) {
        openBtn.addEventListener('click', () => {
            passwordModal.classList.add('active');
        });
    }

    // Step 2: Handle Password Check
    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.querySelector('#accessCode');
            const code = input ? input.value : '';

            // Security Check (Hardcoded for demo)
            if (code === 'admin123') {
                passwordModal.classList.remove('active');
                modal.classList.add('active');
                passwordForm.reset();
            } else {
                alert('ACCESS DENIED: Authorization code incorrect.');
                passwordForm.reset();
            }
        });
    }

    // Step 3: Close Password Modal
    if (closePasswordBtn && passwordModal) {
        closePasswordBtn.addEventListener('click', () => {
            passwordModal.classList.remove('active');
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    if (newEmpForm) {
        newEmpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.querySelector('#newName').value;
            const id = document.querySelector('#newId').value;
            const role = document.querySelector('#newRole').value;
            const avatar = document.querySelector('#newAvatar').value || 'https://via.placeholder.com/150';

            // Additional Details
            const dept = document.querySelector('#newDept').value || "Personnel";
            const email = document.querySelector('#newEmail').value;

            // Add to grid
            const grid = document.querySelector('#directoryGrid');
            const newCard = document.createElement('a');
            newCard.href = '#';
            newCard.className = 'employee-card';
            newCard.setAttribute('data-id', id);
            newCard.innerHTML = `
                <img src="${avatar}" alt="${name}">
                <span class="emp-id">ID: ${id}</span>
                <h3>${name}</h3>
                <p class="role">${role}</p>
            `;
            grid.appendChild(newCard);

            // Add to list
            const list = document.querySelector('#directoryList');
            const newListItem = document.createElement('a');
            newListItem.href = '#';
            newListItem.className = 'list-item';
            newListItem.setAttribute('data-id', id);
            newListItem.innerHTML = `
                <img src="${avatar}" alt="${name}">
                <div class="emp-info">
                    <span class="emp-name">${name}</span>
                    <span class="emp-id-tag">ID: ${id}</span>
                    <span class="emp-role">${role} | ${dept}</span>
                </div>
            `;
            list.appendChild(newListItem);

            // Animations for new entry
            if (gridView.style.display !== 'none') {
                gsap.from(newCard, { scale: 0.8, duration: 0.6, ease: "back.out(1.7)" });
            } else {
                gsap.from(newListItem, { x: -20, duration: 0.6, ease: "power2.out" });
            }

            newEmpForm.reset();
            modal.classList.remove('active');
            alert(`Comprehensive personnel record for ${name} has been synchronized with the Sreemeditec registry.`);
        });
    }

    // 5. QR Code Generation for Profile Pages
    const qrContainer = document.getElementById("qrcode");
    if (qrContainer && typeof QRCode !== 'undefined') {
        const currentUrl = window.location.href;
        new QRCode(qrContainer, {
            text: currentUrl,
            width: 160,
            height: 160,
            colorDark: "#0f172a",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
});
