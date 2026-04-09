// Konfigurasi Firebase (Dapatkan dari Firebase Console > Project Settings)
const firebaseConfig = {
  apiKey: "AIzaSyBft8FA2rTVZG3AkSu63Bk86FCPNvKC_hA",
  authDomain: "latihan2-f2b0f.firebaseapp.com",
  databaseURL: "https://latihan2-f2b0f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "latihan2-f2b0f",
  storageBucket: "latihan2-f2b0f.firebasestorage.app",
  messagingSenderId: "33212839471",
  appId: "1:33212839471:web:8f6f5d79785dfdfd2438da"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Caching elemen DOM
const elements = {
    suhu: document.getElementById('suhu'),
    phAir: document.getElementById('ph-air'),
    kelembapan: document.getElementById('kelembapan'),
    panelWatt: document.getElementById('panel-watt'),
    panelVolt: document.getElementById('panel-volt'),
    panelAmpere: document.getElementById('panel-ampere'),
    bateraiPersen: document.getElementById('baterai-persen'),
    bateraiVolt: document.getElementById('baterai-volt'),
    time: document.getElementById('current-time')
};

// Fungsi untuk mengambil data dari Firebase secara Real-time
function listenToData() {
    const dataRef = database.ref('monitoring'); // Mengarah ke node 'monitoring' di Firebase
    
    dataRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // Update UI dengan data asli dari Firebase
            elements.suhu.innerText = data.suhu;
            elements.phAir.innerText = data.phAir;
            elements.kelembapan.innerText = data.kelembapan;
            elements.panelWatt.innerText = data.panelWatt + " W";
            elements.panelVolt.innerText = data.panelVolt + " V";
            elements.panelAmpere.innerText = data.panelAmpere + " A";
            elements.bateraiPersen.innerText = data.bateraiPersen + " %";
            elements.bateraiVolt.innerText = data.bateraiVolt + " V (Input)";
        }
    }, (error) => {
        console.error("Gagal membaca data:", error);
    });
}

// Update waktu tetap menggunakan jam lokal browser
function updateTime() {
    const now = new Date();
    elements.time.innerText = now.toLocaleString('id-ID');
}

// Jalankan aplikasi
document.addEventListener('DOMContentLoaded', () => {
    listenToData(); // Dengarkan perubahan data di Firebase
    setInterval(updateTime, 1000);
});

// --- FUNGSI SIMULASI KIRIM DATA (Seolah-olah dari Sensor) ---
function simulasiKirimData() {
    const dataFiktif = {
        // Suhu bawang merah idealnya 25-32°C
        suhu: (26 + Math.random() * 6).toFixed(1), 
        // pH air ideal 5.5 - 6.5
        phAir: (5.8 + Math.random() * 1).toFixed(1),
        // Kelembapan tanah ideal 60-70%
        kelembapan: Math.floor(60 + Math.random() * 20),
        // Data Panel Surya & Baterai
        panelWatt: (40 + Math.random() * 30).toFixed(1),
        panelVolt: (12 + Math.random() * 2).toFixed(1),
        panelAmpere: (2 + Math.random() * 2).toFixed(2),
        bateraiPersen: Math.floor(80 + Math.random() * 20),
        bateraiVolt: (12.4 + Math.random() * 1).toFixed(1)
    };

    // Kirim ke Firebase di node 'monitoring'
    database.ref('monitoring').set(dataFiktif)
        .then(() => console.log("Data Simulasi Terkirim:", dataFiktif))
        .catch((error) => console.error("Gagal kirim:", error));
}

// Jalankan simulasi setiap 5 detik
setInterval(simulasiKirimData, 5000);