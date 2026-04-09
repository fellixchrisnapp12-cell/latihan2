// 1. KONFIGURASI FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyBft8FA2rTVZG3AkSu63Bk86FCPNvKC_hA",
    authDomain: "latihan2-f2b0f.firebaseapp.com",
    databaseURL: "https://latihan2-f2b0f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "latihan2-f2b0f",
    storageBucket: "latihan2-f2b0f.firebasestorage.app",
    messagingSenderId: "33212839471",
    appId: "1:33212839471:web:8f6f5d79785dfdfd2438da"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// 2. ELEMEN GLOBAL
const elements = {
    suhu: document.getElementById('suhu'),
    phAir: document.getElementById('ph-air'),
    kelembapan: document.getElementById('kelembapan'),
    panelWatt: document.getElementById('panel-watt'),
    panelVolt: document.getElementById('panel-volt'),
    panelAmpere: document.getElementById('panel-ampere'),
    bateraiPersen: document.getElementById('baterai-persen'),
    bateraiVolt: document.getElementById('baterai-volt'),
    time: document.getElementById('current-time'),
    // Elemen Navigasi
    btnDashboard: document.getElementById('btn-dashboard'),
    btnRiwayat: document.getElementById('btn-riwayat'),
    kontenDashboard: document.getElementById('konten-dashboard'),
    kontenRiwayat: document.getElementById('konten-riwayat'),
    tabelRiwayat: document.getElementById('isi-tabel-riwayat')
};

// 3. LOGIKA NAVIGASI
function setupNavigation() {
    elements.btnRiwayat.addEventListener('click', () => {
        elements.kontenDashboard.style.display = 'none';
        elements.kontenRiwayat.style.display = 'block';
        elements.btnRiwayat.classList.add('active');
        elements.btnDashboard.classList.remove('active');
        muatRiwayat();
    });

    elements.btnDashboard.addEventListener('click', () => {
        elements.kontenDashboard.style.display = 'block';
        elements.kontenRiwayat.style.display = 'none';
        elements.btnDashboard.classList.add('active');
        elements.btnRiwayat.classList.remove('active');
    });
}

// 4. FUNGSI DATA (REAL-TIME & RIWAYAT)
function listenToData() {
    database.ref('monitoring').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            elements.suhu.innerText = data.suhu;
            elements.phAir.innerText = data.phAir;
            elements.kelembapan.innerText = data.kelembapan;
            elements.panelWatt.innerText = data.panelWatt + " W";
            elements.panelVolt.innerText = data.panelVolt + " V";
            elements.panelAmpere.innerText = data.panelAmpere + " A";
            elements.bateraiPersen.innerText = data.bateraiPersen + " %";
            elements.bateraiVolt.innerText = data.bateraiVolt + " V (Input)";
        }
    });
}

function muatRiwayat() {
    const tgl = new Date().toISOString().split('T')[0];
    database.ref(`logs/${tgl}`).limitToLast(10).on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            let html = '';
            const keys = Object.keys(data).reverse();
            keys.forEach(waktu => {
                const item = data[waktu];
                const jam = waktu.match(/.{1,2}/g).join(':');
                html += `
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #eee;">${jam}</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.suhu}°C</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.phAir}</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.kelembapan}%</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.panelWatt}W</td>
                    </tr>`;
            });
            elements.tabelRiwayat.innerHTML = html;
        } else {
            elements.tabelRiwayat.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">Belum ada data riwayat hari ini.</td></tr>';
        }
    });
}

// 5. SIMULASI & WAKTU
function startSimulasi() {
    setInterval(() => {
        const sekarang = new Date();
        const tgl = sekarang.toISOString().split('T')[0];
        const wkt = sekarang.toTimeString().split(' ')[0].replace(/:/g, '');

        const dataFiktif = {
            suhu: (25 + Math.random() * 7).toFixed(1),
            phAir: (6.0 + Math.random() * 0.8).toFixed(1),
            kelembapan: Math.floor(65 + Math.random() * 15),
            panelWatt: (50 + Math.random() * 20).toFixed(1),
            panelVolt: (12.2 + Math.random() * 1).toFixed(1),
            panelAmpere: (3.0 + Math.random() * 1).toFixed(2),
            bateraiPersen: Math.floor(85 + Math.random() * 10),
            bateraiVolt: (12.8 + Math.random() * 0.5).toFixed(1)
        };

        database.ref('monitoring').set(dataFiktif);
        database.ref(`logs/${tgl}/${wkt}`).set(dataFiktif);
    }, 5000);
}

function updateTime() {
    setInterval(() => {
        elements.time.innerText = new Date().toLocaleString('id-ID');
    }, 1000);
}

// 6. INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    listenToData();
    updateTime();
    startSimulasi();
});