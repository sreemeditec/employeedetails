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

            // Capture all fields
            const employee = {
                id: document.querySelector('#newId').value,
                name: document.querySelector('#newName').value,
                role: document.querySelector('#newRole').value,
                avatar: document.querySelector('#newAvatar').value || 'https://ui-avatars.com/api/?name=User&background=random', // Better default
                dob: document.querySelector('#newDOB').value,
                blood: document.querySelector('#newBlood').value,
                gender: document.querySelector('#newGender').value,
                nationality: document.querySelector('#newNationality').value,
                email: document.querySelector('#newEmail').value,
                phone: document.querySelector('#newPhone').value,
                address: document.querySelector('#newAddress').value,
                emergency: document.querySelector('#newEmergency').value,
                dept: document.querySelector('#newDept').value || "Personnel",
                joinDate: document.querySelector('#newJoinDate').value,
                manager: document.querySelector('#newManager').value,
                edu: document.querySelector('#newEdu').value,
                skills: document.querySelector('#newSkills').value
            };

            // Save to LocalStorage
            let employees = JSON.parse(localStorage.getItem('employees')) || [];
            employees.push(employee);
            localStorage.setItem('employees', JSON.stringify(employees));

            // Add to grid (Visual feedback if we stayed on page, but we will redirect)
            const grid = document.querySelector('#directoryGrid');
            if (grid) {
                const newCard = document.createElement('a');
                newCard.href = `employee.html?id=${employee.id}`;
                newCard.className = 'employee-card';
                newCard.setAttribute('data-id', employee.id);
                newCard.innerHTML = `
                    <img src="${employee.avatar}" alt="${employee.name}">
                    <span class="emp-id">ID: ${employee.id}</span>
                    <h3>${employee.name}</h3>
                    <p class="role">${employee.role}</p>
                `;
                grid.appendChild(newCard);
            }

            // Add to list
            const list = document.querySelector('#directoryList');
            if (list) {
                const newListItem = document.createElement('a');
                newListItem.href = `employee.html?id=${employee.id}`;
                newListItem.className = 'list-item';
                newListItem.setAttribute('data-id', employee.id);
                newListItem.innerHTML = `
                    <img src="${employee.avatar}" alt="${employee.name}">
                    <div class="emp-info">
                        <span class="emp-name">${employee.name}</span>
                        <span class="emp-id-tag">ID: ${employee.id}</span>
                        <span class="emp-role">${employee.role} | ${employee.dept}</span>
                    </div>
                `;
                list.appendChild(newListItem);
            }

            newEmpForm.reset();
            modal.classList.remove('active');

            // Redirect to the new employee page
            alert(`Comprehensive personnel record for ${employee.name} has been synchronized. Redirecting to profile...`);
            window.location.href = `employee.html?id=${employee.id}`;
        });
    }

    // 6. Dynamic Employee Detail Page Population
    const urlParams = new URLSearchParams(window.location.search);
    const empId = urlParams.get('id');
    const profileName = document.getElementById('profileName');

    if (empId && profileName) {
        const employees = JSON.parse(localStorage.getItem('employees')) || [];
        const emp = employees.find(e => e.id === empId);

        if (emp) {
            // Update Header
            document.getElementById('profileName').textContent = emp.name;
            document.getElementById('profileRole').textContent = `${emp.role} | ${emp.dept}`;
            document.getElementById('profileId').textContent = `ID: ${emp.id}`;
            const avatarImg = document.getElementById('profileAvatar');
            if (avatarImg) avatarImg.src = emp.avatar;
            document.title = `Sreemeditec | ${emp.name}`;

            // Basic Info
            const setVal = (id, val) => {
                const el = document.getElementById(id);
                if (el) el.textContent = val || '-';
            };

            setVal('infoName', emp.name);
            setVal('infoDob', emp.dob);
            setVal('infoGender', emp.gender);
            setVal('infoNationality', emp.nationality);

            // Contact
            setVal('infoEmail', emp.email);
            setVal('infoPhone', emp.phone);
            setVal('infoEmergency', emp.emergency);

            // Employment
            setVal('infoCorpRole', emp.role);
            setVal('infoDept', emp.dept);
            setVal('infoJoinDate', emp.joinDate);
            setVal('infoManager', emp.manager);

            // Competency
            setVal('infoEdu', emp.edu);

            // Skills (Handle Split)
            const skillsContainer = document.getElementById('infoSkills');
            if (skillsContainer && emp.skills) {
                skillsContainer.innerHTML = ''; // Clear defaults
                const skillsList = emp.skills.split(',').map(s => s.trim());
                skillsList.forEach(skill => {
                    const span = document.createElement('span');
                    span.className = 'skill-tag';
                    span.textContent = skill;
                    skillsContainer.appendChild(span);
                });
            }
        }
    }

    // 7. Load Saved Employees into Dashboard (Persistence)
    const gridViewContainer = document.getElementById('directoryGrid');
    const listViewContainer = document.getElementById('directoryList');

    if (gridViewContainer && listViewContainer) {
        const storedEmployees = JSON.parse(localStorage.getItem('employees')) || [];
        storedEmployees.forEach(emp => {
            // Check for duplicates (prevent adding if already exists)
            if (!gridViewContainer.querySelector(`[data-id="${emp.id}"]`)) {
                // Create Grid Card
                const card = document.createElement('a');
                card.href = `employee.html?id=${emp.id}`;
                card.className = 'employee-card';
                card.setAttribute('data-id', emp.id);
                card.style.display = gridViewContainer.style.display === 'none' ? 'none' : 'flex'; // maintain visibility state
                // Note: display logic is better handled by view toggle, but we init to flex usually or let CSS handle.
                // Actually, the toggle logic hides the CONTAINER, not the child items, usually.
                // But looking at toggle logic: gridView.style.display = 'grid'.
                // The children are usually display:flex via CSS.
                // Let's rely on CSS.

                card.innerHTML = `
                    <img src="${emp.avatar}" alt="${emp.name}">
                    <span class="emp-id">ID: ${emp.id}</span>
                    <h3>${emp.name}</h3>
                    <p class="role">${emp.role}</p>
                `;
                gridViewContainer.appendChild(card);

                // Create List Item
                const li = document.createElement('a');
                li.href = `employee.html?id=${emp.id}`;
                li.className = 'list-item';
                li.setAttribute('data-id', emp.id);
                li.innerHTML = `
                    <img src="${emp.avatar}" alt="${emp.name}">
                    <div class="emp-info">
                        <span class="emp-name">${emp.name}</span>
                        <span class="emp-id-tag">ID: ${emp.id}</span>
                        <span class="emp-role">${emp.role} | ${emp.dept}</span>
                    </div>
                `;
                listViewContainer.appendChild(li);
            }
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
